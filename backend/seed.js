import { setServers } from 'node:dns/promises';
setServers(['1.1.1.1', '8.8.8.8']);
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import { products } from './lib/seedData.js';

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nimbus';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await User.deleteMany({ email: { $in: ['demo@nimbus.audio', 'adminKS@nimbus.com'] } });

    const passwordHash = await bcrypt.hash('12345678', 12);
    const admin = await User.create({
      name: 'Admin KS',
      email: 'adminKS@nimbus.com',
      passwordHash,
      role: 'admin',
    });

    const seededProducts = products.map((product) => ({
      ...product,
      reviews: (product.reviews || []).map((review) => ({
        ...review,
        userId: admin._id,
      })),
    }));

    await Product.insertMany(seededProducts);
    console.log(`Seeded ${seededProducts.length} products`);
    console.log('Created admin user: adminKS@nimbus.com / 12345678');

    await mongoose.disconnect();
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
