import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth, useCart } from '../context/AppContext';
import AuthSubmitButton from '../components/AuthSubmitButton';
import SEO from '../components/SEO';
import { WaveformEmpty } from '../components/Waveform';
import { formatPrice, getMediaUrl } from '../lib/utils';
import { productPath } from '../lib/routes';
import { variantKey } from '../lib/variantKey';

const PROMO_CODES = { NIMBUS10: 0.1, WELCOME20: 0.2 };

export default function Cart() {
  const { items, removeItem, updateQty, cartTotal } = useCart();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const discount = appliedPromo ? cartTotal * appliedPromo : 0;
  const total = cartTotal - discount;

  const applyPromo = () => {
    if (!user) return;
    const code = promoCode.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setAppliedPromo(PROMO_CODES[code]);
      toast.success(`Promo code applied! ${PROMO_CODES[code] * 100}% off`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <SEO title="Cart" />
        <WaveformEmpty
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
        >
          <Link
            to="/consumer"
            className="inline-block rounded-xl bg-signal px-6 py-3 font-semibold text-cloud hover:bg-signal/90"
          >
            Continue Shopping
          </Link>
        </WaveformEmpty>
      </>
    );
  }

  return (
    <>
      <SEO title="Cart" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-ink">Shopping Cart</h1>

        {!user && (
          <p className="mb-6 rounded-xl border border-mist bg-mist/25 px-4 py-3 text-sm text-slate">
            You can view your cart here. Sign in to update items, apply promo codes, or checkout.
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${variantKey(item.variant)}`}
                className="flex gap-4 rounded-2xl border border-mist bg-white p-4"
              >
                <img
                  src={getMediaUrl(item.product?.images?.[0])}
                  alt={item.product?.name}
                  className="h-24 w-24 rounded-xl object-contain bg-mist/20 p-1"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={productPath(item.product?.slug)} className="font-semibold text-ink hover:text-signal">
                      {item.product?.name}
                    </Link>
                    {(item.variant?.summary || item.variant?.color) && (
                      <p className="mt-1 text-sm text-slate">
                        {item.variant.summary || item.variant.color}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-mist">
                      <button
                        onClick={() => user && updateQty(item.productId, item.variant, item.qty - 1)}
                        className="p-1.5 hover:bg-mist/25 disabled:opacity-40"
                        aria-label="Decrease quantity"
                        disabled={!user}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => user && updateQty(item.productId, item.variant, item.qty + 1)}
                        className="p-1.5 hover:bg-mist/25 disabled:opacity-40"
                        aria-label="Increase quantity"
                        disabled={!user}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!user) return;
                    removeItem(item.productId, item.variant);
                    toast.success('Item removed');
                  }}
                  className="self-start p-2 text-slate/70 hover:text-red-500 disabled:opacity-40"
                  aria-label="Remove item"
                  disabled={!user}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-mist bg-mist/25 p-6">
            <h2 className="mb-4 text-lg font-semibold text-ink">Order Summary</h2>

            <div className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/70" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="w-full rounded-lg border border-mist py-2 pl-9 pr-3 text-sm focus:border-signal focus:outline-none disabled:bg-mist/20"
                  aria-label="Promo code"
                  disabled={!user}
                />
              </div>
              <button
                onClick={applyPromo}
                disabled={!user}
                className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-cloud hover:bg-ink/90 disabled:bg-slate/20 disabled:text-slate/70"
              >
                {user ? 'Apply' : 'Sign in first'}
              </button>
            </div>
            <p className="mb-4 text-xs text-slate/70">Try: NIMBUS10 or WELCOME20</p>

            <div className="space-y-2 border-t border-mist pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate">Shipping</span>
                <span>{cartTotal >= 100 ? 'Free' : formatPrice(9.99)}</span>
              </div>
              <div className="flex justify-between border-t border-mist pt-2 text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total + (cartTotal >= 100 ? 0 : 9.99))}</span>
              </div>
            </div>

            <AuthSubmitButton to="/checkout" signInRedirect={{ pathname: '/checkout' }} className="mt-6">
              Proceed to Checkout
            </AuthSubmitButton>
          </div>
        </div>
      </div>
    </>
  );
}
