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
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { login } = useAuth();
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
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7352/ingest/4bf7390c-a809-4743-b3bb-e5090eea21ab',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d9bdc'},body:JSON.stringify({sessionId:'1d9bdc',location:'Login.jsx:onSubmit:catch',message:'Login failed on client',data:{status:err?.response?.status,apiMessage:err?.response?.data?.message,networkError:!err?.response,errCode:err?.code},timestamp:Date.now(),hypothesisId:'H2-H5'})}).catch(()=>{});
      // #endregion
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign In" />

      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
            <p className="mt-1 text-slate">Sign in to your Nimbus account</p>
          </div>

          <AuthTabs active="login" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-mist bg-white p-8 shadow-sm">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full rounded-lg border border-mist px-4 py-2.5 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">Password</label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="w-full rounded-lg border border-mist px-4 py-2.5 text-sm focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
                autoComplete="current-password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-signal py-3 font-semibold text-cloud hover:bg-signal/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-signal"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate">
            Don&apos;t have an account?{' '}
            <Link to="/signup" state={{ from: location.state?.from }} className="font-medium text-signal hover:text-signal/80">
              Sign up
            </Link>
          </p>

          <p className="mt-2 text-center text-xs text-slate/70">
           Developed by <a href="https://www.linkedin.com/in/shivansh-tiwari-850a12319/">Shivansh Tiwari</a> and <a href="https://www.linkedin.com/in/kartikey-thakur-282092331/">Kartikey Singh</a>
          </p>
        </div>
      </div>
    </>
  );
}
