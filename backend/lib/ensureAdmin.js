import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isOffline } from './dbMode.js';
import { ensureOfflineAdmin } from './offlineStore.js';

const ADMIN_EMAIL = 'adminKS@nimbus.com';
const ADMIN_PASSWORD = '12345678';

export async function ensureAdmin() {
  if (isOffline()) {
    return ensureOfflineAdmin();
  }
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    return { created: false, email: existing.email };
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    name: 'Admin KS',
    email: ADMIN_EMAIL,
    passwordHash,
    role: 'admin',
  });

  console.log(`Created admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  return { created: true, email: ADMIN_EMAIL.toLowerCase() };
}
