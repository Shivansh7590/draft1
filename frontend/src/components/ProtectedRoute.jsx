import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { WaveformLoader } from './Waveform';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <WaveformLoader message="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
