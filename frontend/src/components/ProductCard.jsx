import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import { formatPrice, getMediaUrl } from '../lib/utils';
import { getCategoryLabel } from '../lib/categories';
import { productPath } from '../lib/routes';

export default function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link
        to={productPath(product.slug)}
        className="block overflow-hidden rounded-2xl border border-mist bg-white transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-signal"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-mist/20">
          <img
            src={getMediaUrl(product.images?.[0])}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/5 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-cloud px-4 py-2 text-sm font-medium text-ink shadow-lg">
              <ShoppingBag className="h-4 w-4" /> View Details
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-signal">
            {getCategoryLabel(product.category)}
          </p>
          <h3 className="mb-2 font-semibold text-ink">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-mono-price text-lg font-semibold text-ink">{formatPrice(product.price)}</span>
            <div className="flex items-center gap-1 text-sm text-slate">
              <Star className="h-4 w-4 fill-signal text-signal" aria-hidden="true" />
              <span className="font-mono-price text-xs">{product.rating?.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
