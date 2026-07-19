import { setServers } from 'node:dns/promises';
setServers(['1.1.1.1', '8.8.8.8']);
import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const NAMES = [
  'Nimbus Tablet Air',
  'Nimbus Phone 15',
  'Nimbus Phone 15 Pro',
  'Gameripper',
  'Powerbook',
];

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nimbus';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    for (const name of NAMES) {
      const product = await Product.findOne({ name });
      console.log('='.repeat(60));
      console.log(name);
      console.log('='.repeat(60));
      if (!product) {
        console.log('  (no product found with this exact name)\n');
        continue;
      }
      console.log('  slug:', product.slug);
      console.log('  images:', JSON.stringify(product.images, null, 2));
      console.log('');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Inspection failed:', err);
    process.exit(1);
  }
};

run();
