import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

router.use(protect);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('Order must have items'),
    body('shippingAddress.fullName').notEmpty().withMessage('Full name required'),
    body('shippingAddress.address').notEmpty().withMessage('Address required'),
    body('shippingAddress.city').notEmpty().withMessage('City required'),
    body('shippingAddress.zip').notEmpty().withMessage('ZIP required'),
    body('paymentMethodId').optional({ nullable: true }).isString(),
    body('paymentMethod').optional().isIn(['card', 'upi']).withMessage('Invalid payment method'),
    body('upiId').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { items, shippingAddress, paymentMethodId, paymentMethod = 'card', upiId } = req.body;
      let total = 0;
      const orderItems = [];

      if (paymentMethod === 'upi') {
        const UPI_REGEX = /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/;
        if (!upiId || !UPI_REGEX.test(upiId)) {
          return res.status(400).json({ success: false, message: 'Enter a valid UPI ID (e.g. name@bank)' });
        }
      }

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
        }
        if (product.stock < item.qty) {
          return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
        }

        const variant = product.variants.find(
          (v) => v.color === item.variant?.color && v.storage === item.variant?.storage
        );
        const price = product.price + (variant?.priceModifier || 0);
        total += price * item.qty;

        orderItems.push({
          productId: product._id,
          productName: product.name,
          variant: item.variant || {},
          qty: item.qty,
          price,
        });

        product.stock -= item.qty;
        await product.save();
      }

      let stripePaymentId = null;
      if (paymentMethod === 'upi') {
        // Simulated: real UPI processing needs an India-registered Stripe account,
        // INR currency, and a redirect-based confirmation flow — not set up here.
        stripePaymentId = `upi_sim_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      } else if (stripe && paymentMethodId) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100),
          currency: 'usd',
          payment_method: paymentMethodId,
          confirm: true,
          automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
        });
        stripePaymentId = paymentIntent.id;
      }

      const order = await Order.create({
        userId: req.user._id,
        items: orderItems,
        total,
        shippingAddress,
        paymentMethod,
        stripePaymentId,
        status: 'processing',
      });

      await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

      res.status(201).json({ success: true, order });
    } catch (err) {
      next(err);
    }
  }
);

const CANCELLATION_REASONS = [
  'changed_mind',
  'found_better_price',
  'ordered_by_mistake',
  'no_longer_needed',
  'shipping_too_long',
  'other',
];

router.patch(
  '/:orderId/cancel',
  [
    body('reason').isIn(CANCELLATION_REASONS).withMessage('Please select a valid cancellation reason'),
    body('note').optional().isString().isLength({ max: 500 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      if (!['pending', 'processing'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: `Orders that are already ${order.status} can't be cancelled. Please contact support.`,
        });
      }

      const { reason, note } = req.body;

      // Restock items since the order never shipped
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.qty } });
      }

      order.status = 'cancelled';
      order.cancellationReason = note ? `${reason}: ${note}` : reason;
      order.cancelledAt = new Date();
      await order.save();

      res.json({ success: true, order });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:userId', async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images slug');

    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

export default router;
