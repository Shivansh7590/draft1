export const API = {
  health: '/health',
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  products: {
    list: '/products',
    bySlug: (slug) => `/products/${slug}`,
    review: (id) => `/products/${id}/reviews`,
  },
  cart: {
    get: '/cart',
    sync: '/cart/sync',
  },
  orders: {
    create: '/orders',
    byUser: (userId) => `/orders/${userId}`,
    cancel: (orderId) => `/orders/${orderId}/cancel`,
  },
  contact: '/contact',
};
