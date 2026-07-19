import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../services';
import SEO from '../components/SEO';
import AuthSubmitButton, { authFieldClass } from '../components/AuthSubmitButton';
import { useAuth } from '../context/AppContext';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const faqs = [
  { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return on all products. Items must be in original condition with all accessories.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout. Free shipping on orders over $100.' },
  { q: 'Do you offer international shipping?', a: 'Yes! We ship to over 40 countries. International shipping typically takes 7-14 business days.' },
  { q: 'How do I contact support?', a: 'You can reach us via this contact form, email support@nimbus.audio, or call 1-800-NIMBUS-1. We respond within 24 hours.' },
  { q: 'Are your products covered by warranty?', a: 'All Nimbus products come with a 2-year limited warranty covering manufacturing defects.' },
];

export default function Contact() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!user) return;
    setLoading(true);
    try {
      await contactService.send(data);
      toast.success('Message sent! We\'ll get back to you soon.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
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
      <SEO title="Contact" description="Get in touch with the Nimbus team." />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-ink">Contact Us</h1>
          <p className="mt-2 text-slate">We&apos;d love to hear from you</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-mist bg-white p-8 shadow-sm">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">Name</label>
              <input id="name" {...register('name')} className={inputClass} disabled={!user} />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email</label>
              <input id="email" type="email" {...register('email')} className={inputClass} disabled={!user} />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="subject" className="mb-1 block text-sm font-medium text-ink">Subject</label>
              <input id="subject" {...register('subject')} className={inputClass} disabled={!user} />
              {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">Message</label>
              <textarea id="message" {...register('message')} rows={5} className={inputClass} disabled={!user} />
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
            </div>
            <AuthSubmitButton loading={loading && !!user}>
              {loading ? 'Sending...' : 'Send Message'}
            </AuthSubmitButton>
          </form>

          <div>
            <h2 className="mb-6 text-xl font-semibold text-ink">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-mist">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-signal rounded-xl"
                    aria-expanded={openFaq === i}
                  >
                    {faq.q}
                    <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-mist px-4 py-3 text-sm text-slate">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
