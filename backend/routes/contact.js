import express from 'express';
import Contact from '../models/Contact.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      await Contact.create(req.body);
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
