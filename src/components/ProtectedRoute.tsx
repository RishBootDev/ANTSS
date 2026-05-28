import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If Admin attempts to access user area, or User attempts admin area, redirect
    return <Navigate to={user.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
