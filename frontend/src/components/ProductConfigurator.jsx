import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { calculateConfigPrice, getSelectedOption } from '../lib/configurator';

const spring = { type: 'spring', stiffness: 480, damping: 34 };

function OptionRow({ selected, option, onSelect }) {
  const delta = option.priceModifier || 0;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
        selected
          ? 'border-ink/20 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
          : 'border-mist/80 bg-white/60 hover:border-slate/25 hover:bg-white'
      }`}
      transition={spring}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? 'border-ink bg-ink text-cloud' : 'border-slate/40 bg-transparent'
        }`}
        aria-hidden="true"
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>

      <div className="min-w-0 flex-1">
        <p className={`font-medium ${selected ? 'text-ink' : 'text-ink/90'}`}>{option.label}</p>
        {option.description && (
          <p className="mt-1 text-sm leading-relaxed text-slate">{option.description}</p>
        )}
      </div>

      <div className="shrink-0 pt-0.5 text-right">
        {delta > 0 ? (
          <span className="font-mono-price text-sm text-slate">+{formatPrice(delta)}</span>
        ) : (
          <span className="text-sm text-slate/60">Included</span>
        )}
      </div>
    </motion.button>
  );
}

export default function ProductConfigurator({ product, config, onChange }) {
  const groups = product.configurator?.groups ?? [];
  const total = calculateConfigPrice(product, config);

  return (
    <div className="space-y-10">
      <div className="border-b border-mist pb-6">
        <p className="font-mono-price text-3xl font-semibold tracking-tight text-ink">
          From {formatPrice(product.price)}
        </p>
        <p className="mt-1 text-sm text-slate">or {formatPrice(total)} for your current configuration</p>
      </div>

      {groups.map((group, groupIndex) => (
        <section key={group.id} className="border-b border-mist pb-10 last:border-0">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">{group.label}</h2>
            {group.subtitle && <p className="mt-1.5 text-base text-slate">{group.subtitle}</p>}
          </div>

          <div className="space-y-3">
            {group.options.map((option) => (
              <OptionRow
                key={option.value}
                selected={config[group.id] === option.value}
                option={option}
                onSelect={() => onChange({ ...config, [group.id]: option.value })}
              />
            ))}
          </div>

          <p className="mt-4 text-xs text-slate/70">
            Step {groupIndex + 1} of {groups.length}
          </p>
        </section>
      ))}

      <div className="rounded-2xl bg-mist/20 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">Your configuration</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {groups.map((group) => getSelectedOption(group, config)?.label).filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  );
}
