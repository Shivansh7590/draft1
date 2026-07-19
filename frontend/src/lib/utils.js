const CART_KEY = 'nimbus_cart';

const MEDIA_ORIGIN = (import.meta.env.VITE_API_URL || '/api').replace(/\/api\/?$/, '');

export const getMediaUrl = (path) => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${MEDIA_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export const cn = (...classes) => classes.filter(Boolean).join(' ');
