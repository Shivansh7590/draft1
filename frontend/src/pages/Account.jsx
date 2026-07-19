import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../context/AppContext';
import ProtectedRoute from '../components/ProtectedRoute';
import SEO from '../components/SEO';

function AccountContent() {
  const { user } = useAuth();

  return (
    <>
      <SEO title="Account" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-ink">My Account</h1>
        <p className="mb-8 text-slate">Welcome back, {user.name}</p>

        <div className="max-w-md rounded-2xl border border-mist p-6">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-signal/10 text-2xl font-bold text-signal">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate">Name</p>
              <p className="font-medium text-ink">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate">Email</p>
              <p className="font-medium text-ink">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate">Member since</p>
              <p className="font-medium text-ink">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
              </p>
            </div>
          </div>

          <Link
            to="/orders"
            className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-mist py-2.5 text-sm font-medium text-ink hover:bg-mist/25"
          >
            <Package className="h-4 w-4" /> View My Orders
          </Link>
        </div>
      </div>
    </>
  );
}

export default function Account() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}
