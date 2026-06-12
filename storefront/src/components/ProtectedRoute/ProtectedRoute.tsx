import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // or a proper spinner component
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !user.roles.includes(requiredRole)) {
    // Role is required but user doesn't have it
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
