import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag, User, Menu, X, Search, Package } from 'lucide-react';
import { useAuth, useCart } from '../context/AppContext';

const navLinks = [
  { to: '/consumer', label: 'Consumer' },
  { to: '/corporate', label: 'Corporate' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-mist bg-cloud/90 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-signal">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink">
            <span className="font-display text-lg font-semibold text-signal">N</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">Nimbus</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-signal focus:outline-none focus:ring-2 focus:ring-signal rounded ${
                  isActive ? 'text-signal' : 'text-slate'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/consumer"
            className="hidden rounded-lg p-2 text-slate hover:bg-mist/40 sm:block focus:outline-none focus:ring-2 focus:ring-signal"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </Link>

          {user && (
            <Link
              to="/orders"
              className="hidden rounded-lg p-2 text-slate hover:bg-mist/40 sm:block focus:outline-none focus:ring-2 focus:ring-signal"
              aria-label="My Orders"
            >
              <Package className="h-5 w-5" />
            </Link>
          )}

          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-slate hover:bg-mist/40 focus:outline-none focus:ring-2 focus:ring-signal"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-signal text-[10px] font-bold text-cloud">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-mist/40 focus:outline-none focus:ring-2 focus:ring-signal"
              >
                <User className="h-4 w-4" />
                {user.name?.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate hover:text-ink focus:outline-none focus:ring-2 focus:ring-signal"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/signup"
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink hover:bg-mist/40 focus:outline-none focus:ring-2 focus:ring-signal"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-cloud hover:bg-signal/90 focus:outline-none focus:ring-2 focus:ring-signal"
              >
                Sign In
              </Link>
            </div>
          )}

          <button
            className="rounded-lg p-2 text-slate hover:bg-mist/40 md:hidden focus:outline-none focus:ring-2 focus:ring-signal"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-mist bg-cloud px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-3 text-sm font-medium text-ink"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <div className="mt-2 space-y-1 border-t border-mist pt-2">
              <Link
                to="/orders"
                className="block py-3 text-sm font-medium text-ink"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
              <Link
                to="/account"
                className="block py-3 text-sm font-medium text-ink"
                onClick={() => setMobileOpen(false)}
              >
                Account
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="block w-full py-3 text-left text-sm font-medium text-slate"
              >
                Logout
              </button>
            </div>
          )}
          {!user && (
            <div className="mt-2 space-y-2">
              <Link
                to="/signup"
                className="block rounded-lg border border-mist px-4 py-2 text-center text-sm font-medium text-ink"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="block rounded-lg bg-signal px-4 py-2 text-center text-sm font-medium text-cloud"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
