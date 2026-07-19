import { productService } from '../services';

/** Re-attach product data to cart items loaded from localStorage (IDs only). */
export async function hydrateCartItems(items) {
  if (!items.length || items.every((i) => i.product?.slug)) {
    return items;
  }

  try {
    const { data } = await productService.getAll();
    const byId = Object.fromEntries(data.products.map((p) => [p._id, p]));

    return items
      .map((item) => {
        const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
        const product = item.product || byId[id];
        if (!product) return null;

        const variant = item.variant || {};
        const matched = product.variants?.find(
          (v) => v.color === variant.color && v.storage === variant.storage
        );

        return {
          ...item,
          productId: id,
          product,
          price: product.price + (matched?.priceModifier || 0),
          variant,
          qty: item.qty || 1,
        };
      })
      .filter(Boolean);
  } catch {
    return items;
  }
}

/** Map server cart (populated) to client cart shape. */
export function mapServerCart(serverItems = []) {
  return serverItems
    .map((item) => {
      const product = item.productId;
      if (!product || !product._id) return null;

      const variant = item.variant || {};
      const matched = product.variants?.find(
        (v) => v.color === variant.color && v.storage === variant.storage
      );

      return {
        productId: product._id,
        product,
        variant,
        qty: item.qty,
        price: product.price + (matched?.priceModifier || 0),
      };
    })
    .filter(Boolean);
}

/** Merge local and server carts — higher qty wins per line item. */
export function mergeCartItems(local = [], server = []) {
  const merged = new Map();

  for (const item of [...server, ...local]) {
    const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
    const key = `${id}-${item.variant?.color || ''}-${item.variant?.storage || ''}`;
    const existing = merged.get(key);
    if (!existing || item.qty > existing.qty) {
      merged.set(key, item);
    }
  }

  return [...merged.values()];
}
