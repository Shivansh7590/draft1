import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productService } from '../services';
import { useAuth, useCart } from '../context/AppContext';
import { useProduct } from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';
import ProductGallery from '../components/ProductGallery';
import ProductConfigurator from '../components/ProductConfigurator';
import SEO from '../components/SEO';
import AuthSubmitButton, { authFieldClass } from '../components/AuthSubmitButton';
import { WaveformLoader } from '../components/Waveform';
import { formatPrice } from '../lib/utils';
import { getCategoryLabel } from '../lib/categories';
import {
  buildCartVariant,
  buildConfigSpecs,
  calculateConfigPrice,
  getDefaultConfig,
  hasConfigurator,
} from '../lib/configurator';

const reviewSchema = z.object({
  comment: z.string().min(10, 'Review must be at least 10 characters'),
  stars: z.coerce.number().min(1).max(5),
});

export default function ProductDetail() {
  const { slug } = useParams();
  const { product, related, loading, error, setProduct } = useProduct(slug);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [config, setConfig] = useState({});
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const { addItem } = useCart();
  const { user } = useAuth();

  const configurable = hasConfigurator(product);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { stars: 5 },
  });

  useEffect(() => {
    setSelectedVariant(null);
    setConfig({});
    setQty(1);
    setActiveTab('specs');
    reset({ stars: 5, comment: '' });
  }, [slug, reset]);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (configurable) {
      setConfig(getDefaultConfig(product));
    }
  }, [product, configurable]);

  const displaySpecs = useMemo(() => {
    if (!product) return {};
    if (configurable) return buildConfigSpecs(product, config);
    return product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs || {};
  }, [product, configurable, config]);

  if (loading) {
    return <WaveformLoader message="Loading product..." size="lg" />;
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-slate">{error || 'Product not found.'}</p>
        <Link to="/consumer?section=computer&category=laptops" className="mt-4 inline-block text-signal hover:underline">
          Back to laptops
        </Link>
      </div>
    );
  }

  const price = configurable
    ? calculateConfigPrice(product, config)
    : product.price + (selectedVariant?.priceModifier || 0);
  const cartVariant = configurable
    ? buildCartVariant(product, config)
    : { ...selectedVariant, priceModifier: selectedVariant?.priceModifier || 0 };

  const handleAddToCart = () => {
    addItem(product, cartVariant, qty);
    toast.success('Added to bag!');
  };

  const onReviewSubmit = async (data) => {
    if (!user) return;
    try {
      const res = await productService.addReview(product._id, data);
      setProduct(res.data.product);
      reset({ stars: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <>
      <SEO title={product.name} description={product.description} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {configurable ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
            <div className="lg:sticky lg:top-20 lg:self-start">
              <ProductGallery images={product.images} alt={product.name} />
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-signal">
                {getCategoryLabel(product.category)}
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-tight">
                {product.name}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate">{product.description}</p>

              <div className="mt-5 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-signal text-signal' : 'text-mist'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate">
                  {product.rating?.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="mt-12">
                <ProductConfigurator product={product} config={config} onChange={setConfig} />
              </div>

              <div className="sticky bottom-4 z-20 mt-10 rounded-2xl border border-white/60 bg-white/85 p-5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate">Total</p>
                    <p className="font-mono-price text-3xl font-semibold text-ink">{formatPrice(price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-mist">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="p-2 hover:bg-mist/25"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="p-2 hover:bg-mist/25"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <AuthSubmitButton
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex w-full items-center justify-center gap-2 py-3.5 text-base"
                >
                  <ShoppingBag className="h-5 w-5" /> Add to Bag
                </AuthSubmitButton>
                {product.stock > 0 ? (
                  <p className="mt-2 flex items-center justify-center gap-1 text-sm text-green-600">
                    <Check className="h-4 w-4" /> In stock — ships in 1–2 business days
                  </p>
                ) : (
                  <p className="mt-2 text-center text-sm text-red-500">Out of stock</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2">
            <ProductGallery images={product.images} alt={product.name} />

            <div>
              <p className="mb-1 text-sm font-medium uppercase tracking-wider text-signal">
                {getCategoryLabel(product.category)}
              </p>
              <h1 className="font-display mb-2 text-3xl font-semibold text-ink">{product.name}</h1>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-signal text-signal' : 'text-mist'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate">
                  {product.rating?.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
              <p className="font-mono-price mb-6 text-3xl font-semibold text-ink">{formatPrice(price)}</p>
              <p className="mb-6 text-slate leading-relaxed">{product.description}</p>

              {product.variants?.length > 0 && (
                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-ink">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                          selectedVariant?.color === v.color
                            ? 'border-signal bg-signal/10 text-signal'
                            : 'border-mist hover:border-slate/30'
                        }`}
                      >
                        {v.color}
                        {v.priceModifier > 0 && ` (+${formatPrice(v.priceModifier)})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6 flex items-center gap-4">
                <p className="text-sm font-medium text-ink">Quantity</p>
                <div className="flex items-center rounded-lg border border-mist">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-mist/25" aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{qty}</span>
                  <button type="button" onClick={() => setQty(qty + 1)} className="p-2 hover:bg-mist/25" aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <AuthSubmitButton type="button" onClick={handleAddToCart} disabled={product.stock === 0} className="flex flex-1 items-center justify-center gap-2">
                  <ShoppingBag className="h-5 w-5" /> Add to Cart
                </AuthSubmitButton>
              </div>
            </div>
          </div>
        )}

        <section className="mt-20 border-t border-mist pt-16">
          <h2 className="mb-8 text-center text-3xl font-semibold text-ink">Specifications</h2>
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
            {Object.entries(displaySpecs).map(([key, val]) => (
              <div key={key} className="flex justify-between rounded-xl bg-mist/20 px-5 py-4">
                <span className="text-sm text-slate">{key}</span>
                <span className="max-w-[55%] text-right text-sm font-medium text-ink">{val}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-mist pt-16">
          <div className="mb-6 flex gap-6 border-b border-mist">
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === 'reviews' ? 'border-b-2 border-signal text-signal' : 'text-slate hover:text-ink'
              }`}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="space-y-6">
            {product.reviews?.length > 0 ? (
              product.reviews.map((r, i) => (
                <div key={i} className="rounded-xl border border-mist p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-ink">{r.userName}</span>
                    <div className="flex">
                      {Array.from({ length: r.stars }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-signal text-signal" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate">No reviews yet. Be the first to share your experience.</p>
            )}

            <form onSubmit={handleSubmit(onReviewSubmit)} className="rounded-xl border border-mist p-6">
              <h3 className="mb-4 font-semibold text-ink">Write a Review</h3>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-ink">Rating</label>
                <select {...register('stars')} className={authFieldClass(!!user, 'rounded-lg border border-mist px-3 py-2 text-sm')} disabled={!user}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} Stars</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-ink">Comment</label>
                <textarea
                  {...register('comment')}
                  rows={3}
                  className={authFieldClass(!!user, 'w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-signal focus:outline-none')}
                  disabled={!user}
                />
                {errors.comment && <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>}
              </div>
              <AuthSubmitButton className="px-4 py-2 text-sm">Submit Review</AuthSubmitButton>
            </form>
          </div>
        </section>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-ink">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
