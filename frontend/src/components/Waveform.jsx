import { cn } from '../lib/utils';

const BAR_COUNT = {
  sm: 7,
  md: 12,
  lg: 20,
  xl: 32,
};

export default function Waveform({
  size = 'md',
  variant = 'default',
  className = '',
  label = 'Loading',
}) {
  const count = BAR_COUNT[size] || BAR_COUNT.md;
  const bars = Array.from({ length: count });

  const variantStyles = {
    default: 'bg-signal',
    muted: 'bg-slate/30',
    inverse: 'bg-cloud/80',
    ink: 'bg-ink/20',
  };

  const heights = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-14',
    xl: 'h-24',
  };

  return (
    <div
      className={cn('flex items-end justify-center gap-[3px]', heights[size], className)}
      role="status"
      aria-label={label}
    >
      {bars.map((_, i) => (
        <span
          key={i}
          className={cn(
            'w-[3px] origin-bottom rounded-full',
            variantStyles[variant],
            size === 'xl' && 'w-1',
            size === 'lg' && 'w-[3px]'
          )}
          style={{
            animation: `waveform 1.2s ease-in-out ${(i * 0.07) % 0.84}s infinite`,
            height: `${30 + ((i * 17) % 70)}%`,
          }}
        />
      ))}
    </div>
  );
}

export function WaveformLoader({ message = 'Loading...', size = 'md' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Waveform size={size} variant="default" />
      {message && <p className="text-sm text-slate">{message}</p>}
    </div>
  );
}

export function WaveformEmpty({ title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Waveform size="sm" variant="muted" className="mb-6 opacity-60" label="" />
      {title && <h2 className="font-display text-xl text-ink">{title}</h2>}
      {description && <p className="mt-2 max-w-sm text-sm text-slate">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
