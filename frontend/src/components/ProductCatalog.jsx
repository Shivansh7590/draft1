import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { productService } from '../services';
import ProductCard from './ProductCard';
import CategoryNavigator from './CategoryNavigator';
import SEO from './SEO';
import { ProductGridSkeleton } from './Skeleton';
import { WaveformEmpty } from './Waveform';
import { isCategoryInSection } from '../lib/categories';

const sortOptions = [
  { value: '', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function ProductCatalog({
  title,
  description,
  seoTitle,
  seoDescription,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const section = searchParams.get('section') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';

  const debouncedSearch = useDebounce(search, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      else if (section) params.section = section;
      if (sort) params.sort = sort;
      if (debouncedSearch) params.search = debouncedSearch;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;

      const res = await productService.getAll(params);
      setProducts(Array.isArray(res.data?.products) ? res.data.products : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [section, category, sort, debouncedSearch, minPrice, maxPrice, minRating]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  };

  const handleSectionChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (section === value) {
      params.delete('section');
      params.delete('category');
    } else {
      params.set('section', value);
      const currentCategory = params.get('category');
      if (currentCategory && !isCategoryInSection(currentCategory, value)) {
        params.delete('category');
      }
    }

    setSearchParams(params);
  };

  const handleCategoryChange = (value) => {
    updateParams({ category: value });
  };

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-ink">{title}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-slate">{description}</p>
        </div>

        <CategoryNavigator
          section={section}
          category={category}
          onSectionChange={handleSectionChange}
          onCategoryChange={handleCategoryChange}
        />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate/70" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-mist py-3 pl-10 pr-4 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
              aria-label="Search products"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="rounded-xl border border-mist px-4 py-3 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
            aria-label="Sort products"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-xl border border-mist px-4 py-3 text-sm font-medium hover:bg-mist/25 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          <aside className={`w-56 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParams({ minPrice: e.target.value })}
                  className="w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-signal focus:outline-none"
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParams({ maxPrice: e.target.value })}
                  className="w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-signal focus:outline-none"
                  aria-label="Maximum price"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink">Min Rating</h3>
              <select
                value={minRating}
                onChange={(e) => updateParams({ minRating: e.target.value })}
                className="w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-signal focus:outline-none"
                aria-label="Minimum rating"
              >
                <option value="">Any</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
          </aside>

          <div className="flex-1">
            {!loading && (
              <p className="mb-4 text-sm text-slate">{products.length} products found</p>
            )}
            {loading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <WaveformEmpty
                title="No products found"
                description="Try adjusting your filters or search terms."
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${section}-${category}-${sort}-${debouncedSearch}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {products.map((p, index) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
