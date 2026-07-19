import Waveform from './Waveform';

export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-mist/60 ${className}`} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-mist bg-white p-4">
      <Skeleton className="mb-4 aspect-square w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div>
      <div className="mb-8 flex justify-center">
        <Waveform size="md" variant="muted" label="Loading products" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
