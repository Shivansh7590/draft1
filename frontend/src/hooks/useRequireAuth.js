import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AppContext';

export function useRequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (message = 'Please sign in to continue', redirectTo = location) => {
    if (user) return true;

    toast.error(message);
    navigate('/login', { state: { from: redirectTo } });
    return false;
  };

  return { user, requireAuth, isAuthenticated: !!user };
}
