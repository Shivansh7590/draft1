import 'dotenv/config';
import mongoose from 'mongoose';

const required = ['JWT_SECRET'];
const optional = ['MONGODB_URI', 'STRIPE_SECRET_KEY'];

console.log('\n🔍 Nimbus Environment Check\n');

let ok = true;

for (const key of required) {
  if (!process.env[key]) {
    console.log(`❌ ${key} — missing (required)`);
    ok = false;
  } else {
    console.log(`✅ ${key} — set`);
  }
}

for (const key of optional) {
  if (!process.env[key]) {
    console.log(`⚠️  ${key} — not set (optional)`);
  } else {
    console.log(`✅ ${key} — set`);
  }
}

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nimbus';
console.log(`\n📡 Testing MongoDB connection...`);

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('✅ MongoDB connected successfully\n');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.log(`❌ MongoDB connection failed: ${err.message}\n`);
  console.log('→ Follow SETUP.md Step 1 to configure MongoDB Atlas\n');
  process.exit(1);
}
