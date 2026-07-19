import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Building2, Headphones, Package, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../services';
import SEO from '../components/SEO';
import AuthSubmitButton, { authFieldClass } from '../components/AuthSubmitButton';
import Waveform from '../components/Waveform';
import { useAuth } from '../context/AppContext';

const schema = z.object({
  company: z.string().min(2, 'Company name is required'),
  name: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  productInterest: z.string().min(1, 'Please select a product category'),
  quantity: z.string().min(1, 'Estimated quantity is required'),
  message: z.string().min(10, 'Please share a few details about your order'),
});

const benefits = [
  {
    icon: Package,
    title: 'Volume Pricing',
    desc: 'Tiered discounts on orders of 25+ units across any product line.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    desc: 'A named account manager for onboarding, fulfillment, and renewals.',
  },
  {
    icon: Building2,
    title: 'Custom Branding',
    desc: 'Co-branded packaging and engraving options for enterprise clients.',
  },
  {
    icon: Headphones,
    title: 'Priority Fulfillment',
    desc: 'Expedited production and shipping for corporate rollouts and events.',
  },
];

const productLines = [
  { label: 'Earbuds & Headphones', value: 'earbuds-headphones' },
  { label: 'Speakers & Conference Audio', value: 'speakers' },
  { label: 'Wearables & Smart Devices', value: 'wearables' },
  { label: 'Mixed Product Bundle', value: 'mixed' },
];

const quantityRanges = [
  { label: '25 – 99 units', value: '25-99' },
  { label: '100 – 499 units', value: '100-499' },
  { label: '500 – 999 units', value: '500-999' },
  { label: '1,000+ units', value: '1000+' },
];

export default function CorporateOrders() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!user) return;
    setLoading(true);
    try {
      await contactService.send({
        name: data.name,
        email: data.email,
        subject: `Corporate Order Inquiry — ${data.company}`,
        message: [
          `Company: ${data.company}`,
          `Phone: ${data.phone || 'Not provided'}`,
          `Product interest: ${data.productInterest}`,
          `Estimated quantity: ${data.quantity}`,
          '',
          data.message,
        ].join('\n'),
      });
      toast.success('Inquiry sent! Our corporate team will reach out within 1 business day.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = authFieldClass(
    !!user,
    'w-full rounded-lg border border-mist px-4 py-2.5 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20'
  );

  return (
    <>
      <SEO
        title="Corporate Orders"
        description="Bulk ordering, volume pricing, and dedicated support for businesses."
      />

      <section className="relative overflow-hidden bg-ink py-20 text-cloud">
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center opacity-40">
          <Waveform size="md" variant="default" className="max-w-md" label="" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-signal"
          >
            Nimbus for Business
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display mb-4 text-4xl font-semibold sm:text-5xl"
          >
            Corporate Orders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-cloud/70"
          >
            Equip your teams, offices, and events with Nimbus audio at scale — with pricing,
            support, and fulfillment built for organizations.
          </motion.p>
        </div>
      </section>

      <section className="border-b border-mist bg-white py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-signal/10 text-signal">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-2 font-semibold text-ink">{title}</h2>
              <p className="text-sm text-slate">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display mb-4 text-2xl font-semibold text-ink">How it works</h2>
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Submit your inquiry',
                  desc: 'Tell us about your company, product needs, and estimated volume.',
                },
                {
                  step: '02',
                  title: 'Receive a custom quote',
                  desc: 'Our corporate team responds within one business day with tailored pricing.',
                },
                {
                  step: '03',
                  title: 'Fulfillment & support',
                  desc: 'We handle production, branding options, and priority delivery for your rollout.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="font-mono-price text-sm font-semibold text-signal">{item.step}</span>
                  <div>
                    <h3 className="font-semibold text-ink">{item.title}</h3>
                    <p className="text-sm text-slate">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-mist bg-mist/25 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-ink">Popular for</p>
              <ul className="mt-3 space-y-2 text-sm text-slate">
                <li>Office and hybrid workspace setups</li>
                <li>Employee welcome kits and client gifts</li>
                <li>Conference rooms and event activations</li>
                <li>Retail and hospitality partner programs</li>
              </ul>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-2xl border border-mist bg-white p-8 shadow-sm"
          >
              <div>
                <h2 className="text-xl font-semibold text-ink">Request a quote</h2>
                <p className="mt-1 text-sm text-slate">Minimum order: 25 units</p>
              </div>

              <div>
                <label htmlFor="company" className="mb-1 block text-sm font-medium text-ink">
                  Company name
                </label>
                <input id="company" {...register('company')} className={inputClass} disabled={!user} />
                {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">
                    Contact name
                  </label>
                  <input id="name" {...register('name')} className={inputClass} disabled={!user} />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink">
                    Phone <span className="text-slate">(optional)</span>
                  </label>
                  <input id="phone" type="tel" {...register('phone')} className={inputClass} disabled={!user} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
                  Work email
                </label>
                <input id="email" type="email" {...register('email')} className={inputClass} disabled={!user} />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="productInterest" className="mb-1 block text-sm font-medium text-ink">
                    Product interest
                  </label>
                  <select id="productInterest" {...register('productInterest')} className={inputClass} disabled={!user}>
                    <option value="">Select category</option>
                    {productLines.map((line) => (
                      <option key={line.value} value={line.label}>{line.label}</option>
                    ))}
                  </select>
                  {errors.productInterest && (
                    <p className="mt-1 text-sm text-red-500">{errors.productInterest.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-ink">
                    Estimated quantity
                  </label>
                  <select id="quantity" {...register('quantity')} className={inputClass} disabled={!user}>
                    <option value="">Select range</option>
                    {quantityRanges.map((range) => (
                      <option key={range.value} value={range.label}>{range.label}</option>
                    ))}
                  </select>
                  {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
                  Order details
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={4}
                  placeholder="Timeline, delivery locations, branding needs, etc."
                  className={inputClass}
                  disabled={!user}
                />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <AuthSubmitButton loading={loading && !!user}>
                {loading ? 'Sending...' : 'Submit Inquiry'}
              </AuthSubmitButton>
            </form>
        </div>
      </div>
    </>
  );
}
