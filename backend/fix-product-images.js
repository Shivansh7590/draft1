import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const fixes = [
  {
    slug: 'nimbus-phone-15',
    images: [
      'https://images.unsplash.com/photo-1574737308581-1eb78bf8fbc1?w=800&q=80',
      'https://images.unsplash.com/photo-1744487347462-db8ad9f942a3?w=800&q=80',
    ],
  },
  {
    slug: 'nimbus-phone-15-pro',
    images: [
      'https://images.unsplash.com/photo-1744487347462-db8ad9f942a3?w=800&q=80',
      'https://images.unsplash.com/photo-1574737308581-1eb78bf8fbc1?w=800&q=80',
    ],
  },
  {
    slug: 'nimbus-tablet-air',
    images: [
      'https://images.unsplash.com/photo-1616469829167-0bd76a80c913?w=800&q=80',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    ],
  },
];

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nimbus';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    for (const fix of fixes) {
      const result = await Product.updateOne(
        { slug: fix.slug },
        { $set: { images: fix.images } }
      );
      if (result.matchedCount === 0) {
        console.warn(`No product found with slug "${fix.slug}" — skipped.`);
      } else {
        console.log(`Updated images for "${fix.slug}" (matched: ${result.matchedCount}, modified: ${result.modifiedCount})`);
      }
    }

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to fix images:', err.message);
    process.exit(1);
  }
};

run();
