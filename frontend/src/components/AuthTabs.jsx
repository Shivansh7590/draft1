import { Link, useLocation } from 'react-router-dom';

export default function AuthTabs({ active }) {
  const location = useLocation();
  const redirectState = location.state?.from ? { from: location.state.from } : undefined;

  const tabClass = (isActive) =>
    `flex-1 rounded-lg py-2.5 text-sm font-medium text-center transition-colors focus:outline-none focus:ring-2 focus:ring-signal ${
      isActive ? 'bg-white text-ink shadow-sm' : 'text-slate hover:text-ink'
    }`;

  return (
    <div className="mb-6 flex rounded-xl bg-mist/40 p-1" role="tablist" aria-label="Authentication">
      <Link
        to="/login"
        state={redirectState}
        role="tab"
        aria-selected={active === 'login'}
        className={tabClass(active === 'login')}
      >
        Sign In
      </Link>
      <Link
        to="/signup"
        state={redirectState}
        role="tab"
        aria-selected={active === 'signup'}
        className={tabClass(active === 'signup')}
      >
        Sign Up
      </Link>
    </div>
  );
}
