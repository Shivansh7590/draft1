import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { products as seedProducts } from './seedData.js';
import { getCategoriesForSection } from './categories.js';

const users = new Map();
let products = [];

const newId = () => crypto.randomBytes(12).toString('hex');

const normalizeProduct = (product, index) => ({
  _id: newId(),
  ...product,
  specs: product.specs || {},
  reviews: (product.reviews || []).map((review) => ({
    _id: newId(),
    userId: newId(),
    ...review,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  createdAt: new Date(Date.now() - index * 1000),
  updatedAt: new Date(Date.now() - index * 1000),
});

export function initOfflineStore() {
  products = seedProducts.map(normalizeProduct);

  const adminHash = bcrypt.hashSync('12345678', 12);
  users.set('adminKS@nimbus.com', {
    _id: newId(),
    name: 'Admin KS',
    email: 'adminKS@nimbus.com',
    passwordHash: adminHash,
    role: 'admin',
  });

  const demoHash = bcrypt.hashSync('demo1234', 12);
  users.set('demo@nimbus.audio', {
    _id: newId(),
    name: 'Demo User',
    email: 'demo@nimbus.audio',
    passwordHash: demoHash,
    role: 'user',
  });
}

export function listProducts(query = {}) {
  const { category, section, minPrice, maxPrice, minRating, search, sort, featured } = query;
  let result = [...products];

  if (category) {
    result = result.filter((p) => p.category === category);
  } else if (section) {
    const sectionCategories = getCategoriesForSection(section);
    if (sectionCategories?.length) {
      result = result.filter((p) => sectionCategories.includes(p.category));
    }
  }
  if (featured === 'true') result = result.filter((p) => p.featured);
  if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));
  if (minRating) result = result.filter((p) => p.rating >= Number(minRating));
  if (search) {
    const term = String(search).toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    );
  }

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  else result.sort((a, b) => b.createdAt - a.createdAt);

  const sanitized = result.map(({ reviews, ...product }) => product);
  return { success: true, count: sanitized.length, products: sanitized };
}

export function findProductBySlug(slug) {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  return { success: true, product };
}

export function findUserByEmail(email) {
  return users.get(email.toLowerCase()) || null;
}

export function findUserById(id) {
  for (const user of users.values()) {
    if (String(user._id) === String(id)) return user;
  }
  return null;
}

export async function createUser({ name, email, password }) {
  const normalized = email.toLowerCase();
  if (users.has(normalized)) return null;

  const passwordHash = await bcrypt.hash(password, 12);
  const user = {
    _id: newId(),
    name,
    email: normalized,
    passwordHash,
    role: 'user',
  };
  users.set(normalized, user);
  return user;
}

export function ensureOfflineAdmin() {
  return { created: false, email: 'adminKS@nimbus.com' };
}
