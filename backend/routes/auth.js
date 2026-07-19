import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { isOffline } from '../lib/dbMode.js';
import * as offlineStore from '../lib/offlineStore.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendTokenResponse = (user, res, statusCode) => {
  const token = signToken(user._id);
  const isProduction = process.env.NODE_ENV === 'production';

  res
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
};

router.post(
  '/signup',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      if (isOffline()) {
        const existing = offlineStore.findUserByEmail(email);
        if (existing) {
          return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await offlineStore.createUser({ name, email, password });
        return sendTokenResponse(user, res, 201);
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ name, email, passwordHash });

      sendTokenResponse(user, res, 201);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (isOffline()) {
        const user = offlineStore.findUserByEmail(email);
        const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false;
        if (!user || !passwordOk) {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        return sendTokenResponse(user, res, 200);
      }

      const user = await User.findOne({ email });
      const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false;

      // #region agent log
      fetch('http://127.0.0.1:7352/ingest/4bf7390c-a809-4743-b3bb-e5090eea21ab',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d9bdc'},body:JSON.stringify({sessionId:'1d9bdc',location:'auth.js:login:lookup',message:'User lookup result',data:{userFound:!!user,passwordOk,storedEmail:user?.email,role:user?.role},timestamp:Date.now(),hypothesisId:'H1-H4'})}).catch(()=>{});
      // #endregion

      if (!user || !passwordOk) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // #region agent log
      fetch('http://127.0.0.1:7352/ingest/4bf7390c-a809-4743-b3bb-e5090eea21ab',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d9bdc'},body:JSON.stringify({sessionId:'1d9bdc',location:'auth.js:login:success',message:'Sending token response',data:{hasJwtSecret:!!process.env.JWT_SECRET,userId:String(user._id)},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
      // #endregion

      sendTokenResponse(user, res, 200);
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7352/ingest/4bf7390c-a809-4743-b3bb-e5090eea21ab',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d9bdc'},body:JSON.stringify({sessionId:'1d9bdc',location:'auth.js:login:error',message:'Login handler error',data:{errorMessage:err?.message},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      next(err);
    }
  }
);

router.post('/logout', (_req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out' });
});

router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});

export default router;
