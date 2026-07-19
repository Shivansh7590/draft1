import api from '../lib/api';
import { API } from '../lib/endpoints';

const normalizeUser = (user) =>
  user
    ? {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      }
    : null;

export const authService = {
  me: async () => {
    const { data } = await api.get(API.auth.me);
    return normalizeUser(data.user);
  },
  login: async (email, password) => {
    const { data } = await api.post(API.auth.login, { email, password });
    return { ...data, user: normalizeUser(data.user) };
  },
  signup: async (name, email, password) => {
    const { data } = await api.post(API.auth.signup, { name, email, password });
    return { ...data, user: normalizeUser(data.user) };
  },
  logout: () => api.post(API.auth.logout),
};

export const productService = {
  getAll: (params = {}) => api.get(API.products.list, { params }),
  getFeatured: () => api.get(API.products.list, { params: { featured: true } }),
  getBySlug: (slug) => api.get(API.products.bySlug(slug)),
  getByCategory: (category) => api.get(API.products.list, { params: { category } }),
  addReview: (productId, review) => api.post(API.products.review(productId), review),
};

export const cartService = {
  get: () => api.get(API.cart.get),
  sync: (items) =>
    api.post(API.cart.sync, {
      items: items.map(({ productId, variant, qty }) => ({
        productId: typeof productId === 'object' ? productId._id : productId,
        variant: variant || {},
        qty,
      })),
    }),
};

export const orderService = {
  create: (order) => api.post(API.orders.create, order),
  getByUser: (userId) => api.get(API.orders.byUser(userId)),
  cancel: (orderId, payload) => api.patch(API.orders.cancel(orderId), payload),
};

export const contactService = {
  send: (message) => api.post(API.contact, message),
};

export { normalizeUser };
