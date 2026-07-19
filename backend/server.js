import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { connectDb } from './lib/connectDb.js';
import { ensureAdmin } from './lib/ensureAdmin.js';
import { PRODUCTS_ROOT } from './lib/productAssets.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use('/media/products', express.static(PRODUCTS_ROOT));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Nimbus API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    const db = await connectDb();
    await ensureAdmin();

    // #region agent log
    fetch('http://127.0.0.1:7352/ingest/4bf7390c-a809-4743-b3bb-e5090eea21ab',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d9bdc'},body:JSON.stringify({sessionId:'1d9bdc',location:'server.js:start',message:'Backend started',data:{port:PORT,dbMode:db.mode},timestamp:Date.now(),runId:'post-fix',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
