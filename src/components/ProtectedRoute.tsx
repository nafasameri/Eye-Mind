import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { Role } from '../types/api';

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children ? <>{children}</> : <Outlet />;
}

export function RoleGate({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const { activeRole, trial, tenantSelectionRequired } = useAuth();

  if (tenantSelectionRequired) {
    return <Navigate to="/select-tenant" replace />;
  }

  if (!activeRole) {
    if (trial && allow.length === 0) return <>{children}</>;
    return <Navigate to="/app" replace />;
  }

  if (!allow.includes(activeRole)) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
