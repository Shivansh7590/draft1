import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../lib/utils';

export default function ProductGallery({ images = [], alt = 'Product image' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1 || paused) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  if (!images.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-mist/30 text-sm text-slate">
        No images available
      </div>
    );
  }

  const go = (direction) => {
    setIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-gradient-to-b from-[#f7f7f5] to-mist/30 sm:aspect-square">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[index]}
            src={getMediaUrl(images[index])}
            alt={`${alt} — view ${index + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full w-full object-contain p-4 sm:p-8 lg:p-12"
            draggable={false}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur-md transition hover:bg-white/95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur-md transition hover:bg-white/95"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className="group p-1"
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === index ? 'h-2 w-2 bg-ink' : 'h-2 w-2 bg-mist group-hover:bg-slate/50'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex w-full gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ${
                  i === index
                    ? 'border-ink/30 bg-white shadow-sm ring-1 ring-ink/10'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`View thumbnail ${i + 1}`}
              >
                <img src={getMediaUrl(img)} alt="" className="h-full w-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
