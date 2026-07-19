import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';
import { isOffline } from '../lib/dbMode.js';
import * as offlineStore from '../lib/offlineStore.js';
import { getCategoriesForSection } from '../lib/categories.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (isOffline()) {
      return res.json(offlineStore.listProducts(req.query));
    }

    const { category, section, minPrice, maxPrice, minRating, search, sort, featured } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    } else if (section) {
      const sectionCategories = getCategoriesForSection(section);
      if (sectionCategories?.length) {
        filter.category = { $in: sectionCategories };
      }
    }
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (search) filter.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const products = await Product.find(filter).sort(sortOption).select('-reviews');
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    if (isOffline()) {
      const result = offlineStore.findProductBySlug(req.params.slug);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json(result);
    }

    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:id/reviews',
  protect,
  [
    body('comment').trim().notEmpty().withMessage('Comment is required'),
    body('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be 1-5'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const existing = product.reviews.find((r) => r.userId.toString() === req.user._id.toString());
      if (existing) {
        return res.status(400).json({ success: false, message: 'You already reviewed this product' });
      }

      product.reviews.push({
        userId: req.user._id,
        userName: req.user.name,
        comment: req.body.comment,
        stars: req.body.stars,
      });

      product.reviewCount = product.reviews.length;
      product.rating = product.reviews.reduce((sum, r) => sum + r.stars, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ success: true, product });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
