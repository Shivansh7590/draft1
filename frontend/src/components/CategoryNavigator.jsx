import { AnimatePresence, motion } from 'framer-motion';
import { SECTIONS } from '../lib/categories';

const spring = { type: 'spring', stiffness: 520, damping: 38, mass: 0.8 };
const tap = { scale: 0.96 };
const hover = { scale: 1.02 };

export default function CategoryNavigator({
  section,
  category,
  onSectionChange,
  onCategoryChange,
}) {
  const activeSection = SECTIONS.find((item) => item.value === section);

  return (
    <div className="mb-10">
      <div
        role="tablist"
        aria-label="Product sections"
        className="relative mx-auto flex max-w-2xl overflow-hidden rounded-full border border-white/60 bg-white/25 p-1.5 shadow-[0_8px_32px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-2xl backdrop-saturate-150"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
        />
        {SECTIONS.map((item) => {
          const isActive = section === item.value;
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSectionChange(item.value)}
              className="relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-medium transition-colors sm:px-4"
            >
              {isActive && (
                <motion.span
                  layoutId="section-pill"
                  className="absolute inset-0 rounded-full border border-white/80 bg-white/70 shadow-[0_4px_16px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl backdrop-saturate-150"
                  transition={spring}
                />
              )}
              <span className={`relative flex items-center gap-2 ${isActive ? 'text-ink' : 'text-slate/80'}`}>
                <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-signal' : 'text-slate/60'}`} />
                <span>{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection.value}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-5"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.2 }}
              className="mb-4 text-center text-sm text-slate"
            >
              {activeSection.description}
            </motion.p>

            <div
              role="tablist"
              aria-label={`${activeSection.label} subcategories`}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              <motion.button
                type="button"
                role="tab"
                aria-selected={!category}
                whileTap={tap}
                whileHover={hover}
                onClick={() => onCategoryChange('')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  !category
                    ? 'bg-ink text-cloud shadow-sm'
                    : 'bg-white text-slate ring-1 ring-mist hover:text-ink'
                }`}
                transition={spring}
              >
                All {activeSection.label}
              </motion.button>

              {activeSection.subcategories.map((sub, index) => {
                const isActive = category === sub.value;

                return (
                  <motion.button
                    key={sub.value}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * (index + 1), duration: 0.2 }}
                    whileTap={tap}
                    whileHover={hover}
                    onClick={() => onCategoryChange(sub.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-ink text-cloud shadow-sm'
                        : 'bg-white text-slate ring-1 ring-mist hover:text-ink'
                    }`}
                  >
                    {sub.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
