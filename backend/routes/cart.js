import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/sync',
  [body('items').isArray().withMessage('Items must be an array')],
  validate,
  async (req, res, next) => {
    try {
      const validItems = [];
      for (const item of req.body.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          validItems.push({
            productId: item.productId,
            variant: item.variant || {},
            qty: item.qty || 1,
          });
        }
      }

      const cart = await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { items: validItems },
        { upsert: true, new: true }
      ).populate('items.productId');

      res.json({ success: true, cart });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
