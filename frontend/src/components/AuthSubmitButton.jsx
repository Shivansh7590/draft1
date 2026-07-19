import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

const disabledClass =
  'rounded-xl bg-slate/20 py-3 text-center font-semibold text-slate/70 cursor-not-allowed';
const activeClass =
  'rounded-xl bg-signal py-3 font-semibold text-cloud hover:bg-signal/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-signal';

export default function AuthSubmitButton({
  children,
  loading = false,
  disabled = false,
  className = 'w-full',
  type = 'submit',
  signInLabel = 'Sign in first to continue',
  signInRedirect,
  to,
  onClick,
}) {
  const { user } = useAuth();
  const location = useLocation();
  const redirectTo = signInRedirect || location;

  if (!user) {
    return (
      <Link
        to="/login"
        state={{ from: redirectTo }}
        className={`block ${disabledClass} ${className}`}
      >
        {signInLabel}
      </Link>
    );
  }

  if (to) {
    return (
      <Link to={to} className={`block text-center ${activeClass} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${activeClass} ${className}`}
    >
      {children}
    </button>
  );
}

export function authFieldClass(enabled, baseClass) {
  return `${baseClass}${enabled ? '' : ' cursor-not-allowed bg-mist/20 text-slate/70'}`;
}
