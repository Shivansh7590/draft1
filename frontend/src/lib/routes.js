/** Single universal product detail route — all categories share this page. */
export const PRODUCT_DETAIL_PATH = '/products/:slug';

export function productPath(slug) {
  return `/products/${slug}`;
}
