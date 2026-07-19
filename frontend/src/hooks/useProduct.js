import { useState, useEffect } from 'react';
import { productService } from '../services';

/**
 * Loads a product and related items by slug for the universal product detail page.
 * Re-fetches whenever slug changes — no per-product pages required.
 */
export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setRelated([]);
      setLoading(false);
      setError('No product specified');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);
    setRelated([]);

    productService
      .getBySlug(slug)
      .then((res) => {
        if (cancelled) return null;
        const loaded = res.data.product;
        setProduct(loaded);
        return productService.getByCategory(loaded.category);
      })
      .then((res) => {
        if (cancelled || !res) return;
        setRelated(res.data.products.filter((p) => p.slug !== slug).slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setError('Product not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, related, loading, error, setProduct };
}
