import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { orderService } from '../services';
import { useAuth } from '../context/AppContext';
import ProtectedRoute from '../components/ProtectedRoute';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';
import { formatPrice } from '../lib/utils';

const CANCELLABLE_STATUSES = ['pending', 'processing'];

const CANCEL_REASONS = [
  { value: 'changed_mind', label: 'I changed my mind' },
  { value: 'found_better_price', label: 'Found a better price elsewhere' },
  { value: 'ordered_by_mistake', label: 'Ordered by mistake' },
  { value: 'no_longer_needed', label: 'No longer need this item' },
  { value: 'shipping_too_long', label: 'Shipping is taking too long' },
  { value: 'other', label: 'Other' },
];

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-signal/10 text-signal',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate/10 text-slate',
};

function CancelOrderModal({ order, onClose, onCancelled }) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!reason) {
      setError('Please select a reason for cancelling.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await orderService.cancel(order._id, { reason, note: note.trim() || undefined });
      onCancelled(res.data.order);
      toast.success('Order cancelled');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel this order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-cloud p-6 shadow-xl"
      >
        <h2 className="mb-1 text-lg font-semibold text-ink">Cancel this order?</h2>
        <p className="mb-4 text-sm text-slate">
          Order #{order._id.slice(-8).toUpperCase()} · {formatPrice(order.total)}
        </p>

        <label className="mb-1.5 block text-sm font-medium text-ink">Reason for cancelling</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mb-4 w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
        >
          <option value="">Select a reason</option>
          {CANCEL_REASONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <label className="mb-1.5 block text-sm font-medium text-ink">
          Additional details <span className="font-normal text-slate">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Tell us more..."
          className="mb-4 w-full resize-none rounded-lg border border-mist px-3 py-2.5 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
        />

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-lg border border-mist py-2.5 text-sm font-medium text-ink hover:bg-mist/25 disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {submitting ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    if (!user) return;
    orderService
      .getByUser(user.id)
      .then((res) => setOrders(res.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancelled = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
    setCancelTarget(null);
  };

  return (
    <>
      <SEO title="My Orders" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-ink">My Orders</h1>
        <p className="mb-8 text-slate">Track and manage your purchases</p>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate">No orders yet.</p>
            <Link to="/consumer" className="mt-2 inline-block text-signal hover:underline">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border border-mist p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-slate">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                      {' · '}
                      {order.paymentMethod === 'upi' ? 'UPI' : 'Card'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink">{formatPrice(order.total)}</p>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[order.status] || 'bg-mist text-slate'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-b border-mist pb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-slate">
                      <span>{item.productName || item.productId?.name} × {item.qty}</span>
                      <span>{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                {order.status === 'cancelled' ? (
                  <p className="pt-4 text-sm text-slate/70">
                    Cancelled{order.cancelledAt ? ` on ${new Date(order.cancelledAt).toLocaleDateString()}` : ''}
                  </p>
                ) : CANCELLABLE_STATUSES.includes(order.status) ? (
                  <div className="pt-4">
                    <button
                      onClick={() => setCancelTarget(order)}
                      className="text-sm font-medium text-red-500 hover:underline"
                    >
                      Cancel Order
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {cancelTarget && (
          <CancelOrderModal
            order={cancelTarget}
            onClose={() => setCancelTarget(null)}
            onCancelled={handleCancelled}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function Orders() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
