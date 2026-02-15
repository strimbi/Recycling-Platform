import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

export function RequireAuth() {
  const auth = useAuth();
  return auth.isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireAdmin() {
  const auth = useAuth();
  if (!auth.isAuthed) return <Navigate to="/login" replace />;
  return auth.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
