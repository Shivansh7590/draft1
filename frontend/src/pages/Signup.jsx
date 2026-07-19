import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AppContext';
import SEO from '../components/SEO';
import AuthTabs from '../components/AuthTabs';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || '/account';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      toast.success('Account created!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-mist px-4 py-2.5 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20';

  return (
    <>
      <SEO title="Sign Up" />

      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-ink">Create your account</h1>
            <p className="mt-1 text-slate">Join the Nimbus community</p>
          </div>

          <AuthTabs active="signup" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-mist bg-white p-8 shadow-sm">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">Full Name</label>
              <input id="name" {...register('name')} className={inputClass} autoComplete="name" />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email</label>
              <input id="email" type="email" {...register('email')} className={inputClass} autoComplete="email" />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">Password</label>
              <input id="password" type="password" {...register('password')} className={inputClass} autoComplete="new-password" />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-ink">Confirm Password</label>
              <input id="confirmPassword" type="password" {...register('confirmPassword')} className={inputClass} autoComplete="new-password" />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-signal py-3 font-semibold text-cloud hover:bg-signal/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-signal"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate">
                       Developed by <a href="https://www.linkedin.com/in/shivansh-tiwari-850a12319/">Shivansh Tiwari</a> and <a href="https://www.linkedin.com/in/kartikey-thakur-282092331/">Kartikey Singh</a>
    <br />
            Already have an account?{' '}
            <Link to="/login" state={{ from: location.state?.from }} className="font-medium text-signal hover:text-signal">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
