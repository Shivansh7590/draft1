import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { orderService } from '../services';
import { useAuth, useCart } from '../context/AppContext';
import ProtectedRoute from '../components/ProtectedRoute';
import SEO from '../components/SEO';
import { formatPrice } from '../lib/utils';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(3, 'ZIP is required'),
  country: z.string().min(2, 'Country is required'),
});

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [method, setMethod] = useState('card');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const total = cartTotal + shipping;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: 'United States' },
  });

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);
    try {
      let paymentMethodId = null;

      if (method === 'upi') {
        const UPI_REGEX = /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/;
        if (!UPI_REGEX.test(upiId)) {
          setUpiError('Enter a valid UPI ID, e.g. name@bank');
          setProcessing(false);
          return;
        }
        setUpiError('');
      } else {
        const hasStripe = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_');
        if (hasStripe && stripe && elements) {
          const card = elements.getElement(CardElement);
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
            billing_details: { name: data.fullName },
          });
          if (error) {
            toast.error(error.message);
            setProcessing(false);
            return;
          }
          paymentMethodId = paymentMethod.id;
        }
      }

      const orderItems = items.map((i) => ({
        productId: i.productId,
        variant: i.variant,
        qty: i.qty,
      }));

      const res = await orderService.create({
        items: orderItems,
        shippingAddress: data,
        paymentMethodId,
        paymentMethod: method,
        upiId: method === 'upi' ? upiId : undefined,
      });

      clearCart();
      setOrderId(res.data.order._id);
      setConfirmed(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (confirmed) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-ink">Order Confirmed!</h1>
        <p className="mb-2 text-slate">Thank you for your purchase.</p>
        <p className="mb-6 text-sm text-slate/70">Order ID: {orderId}</p>
        <Link to="/account" className="text-signal hover:underline">View order history</Link>
      </div>
    );
  }

  const inputClass = 'w-full rounded-lg border border-mist px-4 py-2.5 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-ink">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <input {...register('fullName')} placeholder="Full Name" className={inputClass} />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
            </div>
            <div>
              <input {...register('address')} placeholder="Street Address" className={inputClass} />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input {...register('city')} placeholder="City" className={inputClass} />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <input {...register('state')} placeholder="State" className={inputClass} />
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input {...register('zip')} placeholder="ZIP Code" className={inputClass} />
                {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip.message}</p>}
              </div>
              <div>
                <input {...register('country')} placeholder="Country" className={inputClass} />
                {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-ink">Payment</h2>

          <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-mist/40 p-1">
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`rounded-md py-2 text-sm font-medium transition ${
                method === 'card' ? 'bg-cloud text-ink shadow-sm' : 'text-slate hover:text-ink'
              }`}
            >
              Credit / Debit Card
            </button>
            <button
              type="button"
              onClick={() => setMethod('upi')}
              className={`rounded-md py-2 text-sm font-medium transition ${
                method === 'upi' ? 'bg-cloud text-ink shadow-sm' : 'text-slate hover:text-ink'
              }`}
            >
              UPI
            </button>
          </div>

          {method === 'card' ? (
            <>
              <div className="rounded-lg border border-mist p-4">
                <CardElement
                  options={{
                    style: {
                      base: { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9CA3AF' } },
                    },
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-slate/70">
                Test card: 4242 4242 4242 4242 · Any future date · Any CVC
              </p>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-mist p-4">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full text-sm outline-none placeholder:text-slate/50"
                />
              </div>
              {upiError && <p className="mt-1 text-sm text-red-500">{upiError}</p>}
              <p className="mt-2 text-xs text-slate/70">
                Demo mode: UPI payments are simulated here — no real transaction is sent to any UPI app or bank.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-mist bg-mist/25 p-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">Order Summary</h2>
        <div className="mb-4 space-y-3">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variant?.color}`} className="flex justify-between text-sm">
              <span className="text-slate">
                {item.product?.name} × {item.qty}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-mist pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate">Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate">Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={processing}
          className="mt-6 w-full rounded-xl bg-signal py-3 font-semibold text-cloud hover:bg-signal/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-signal"
        >
          {processing ? 'Processing...' : `Pay ${formatPrice(total)}`}
        </button>
      </div>
    </form>
  );
}

export default function Checkout() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <ProtectedRoute>
        <div className="py-20 text-center">
          <p className="text-slate">Your cart is empty.</p>
          <Link to="/consumer" className="mt-4 inline-block text-signal hover:underline">Continue shopping</Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SEO title="Checkout" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-ink">Checkout</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </ProtectedRoute>
  );
}
