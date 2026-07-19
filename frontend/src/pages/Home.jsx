import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Headphones, Shield, Truck, Star } from 'lucide-react';
import { productService } from '../services';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Waveform from '../components/Waveform';
import { ProductGridSkeleton } from '../components/Skeleton';
import AuthSubmitButton from '../components/AuthSubmitButton';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';

const testimonials = [
  { name: 'Alex Chen', role: 'Music Producer', text: 'Nimbus Air Pro changed how I mix on the go. Unmatched clarity.', stars: 5 },
  { name: 'Sarah Miller', role: 'Tech Reviewer', text: 'The Sound Max headphones are the best I have tested this year.', stars: 5 },
  { name: 'Marcus Johnson', role: 'Audiophile', text: 'Build quality and sound stage are absolutely premium.', stars: 5 },
];

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $100' },
  { icon: Shield, title: '2-Year Warranty', desc: 'Full coverage on every product' },
  { icon: Headphones, title: '24/7 Support', desc: 'Expert audio assistance anytime' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    productService
      .getFeatured()
      .then((res) => setFeatured(Array.isArray(res.data?.products) ? res.data.products : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Home" description="Nimbus — Premium audio and wearables. Experience sound redefined." />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-cloud">
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-0 opacity-[0.08]">
          <Waveform size="xl" variant="inverse" className="w-full max-w-5xl px-8" label="" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <Waveform size="lg" variant="default" className="max-w-xl opacity-90" label="" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-signal">
              New Collection 2026
            </p>
            <h1 className="font-display mb-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Sound,{' '}
              <span className="text-signal">Reimagined</span>
            </h1>
            <p className="mb-8 text-lg text-cloud/75 sm:text-xl">
              Premium audio and wearables engineered for those who refuse to compromise on quality.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/consumer"
                className="inline-flex items-center gap-2 rounded-xl bg-signal px-6 py-3 font-semibold text-cloud transition-colors hover:bg-signal/90 focus:outline-none focus:ring-2 focus:ring-signal/50"
              >
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-cloud/20 px-6 py-3 font-semibold text-cloud transition-colors hover:bg-cloud/10 focus:outline-none focus:ring-2 focus:ring-cloud/30"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-b border-mist bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-sm text-slate">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink">Featured Products</h2>
              <p className="mt-2 text-slate">Our most loved audio gear</p>
            </div>
            <Link to="/consumer" className="hidden text-sm font-medium text-signal hover:text-signal/80 sm:block">
              View all &rarr;
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-mist/25 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80"
                alt="Nimbus headphones craftsmanship"
                className="rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-signal">Our Story</p>
              <h2 className="font-display mb-4 text-3xl font-semibold text-ink">Crafted for the Discerning Ear</h2>
              <p className="mb-4 leading-relaxed text-slate">
                Founded in 2020, Nimbus set out to prove that premium audio doesn&apos;t require compromise.
                Every product is designed in our San Francisco studio and tested by world-class audio engineers.
              </p>
              <p className="mb-6 leading-relaxed text-slate">
                From adaptive noise cancellation to spatial audio, we push the boundaries of what&apos;s possible
                in a pair of earbuds or a smartwatch.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 font-semibold text-signal hover:text-signal/80">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display mb-10 text-center text-3xl font-semibold text-ink">What Our Customers Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-mist bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-signal text-signal" />
                  ))}
                </div>
                <p className="mb-4 text-slate">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="text-sm text-slate">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-ink py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <Waveform size="sm" variant="default" className="mx-auto mb-6 opacity-80" label="" />
          <h2 className="font-display mb-2 text-2xl font-semibold text-cloud">Stay in the Loop</h2>
          <p className="mb-6 text-cloud/60">Get early access to new drops and exclusive offers.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!user) return;
              toast.success('Thanks for subscribing!');
              setEmail('');
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={!user}
              className="flex-1 rounded-xl border border-mist/30 bg-cloud px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-signal disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Email for newsletter"
            />
            <AuthSubmitButton className="shrink-0 px-6" type="submit">
              Subscribe
            </AuthSubmitButton>
          </form>
        </div>
      </section>
    </>
  );
}
