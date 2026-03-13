// ─────────────────────────────────────────────
//  components/common/ProtectedRoute.tsx
//  Routage protégé par rôle
// ─────────────────────────────────────────────
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cm-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-cm-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-cm-muted text-sm font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on role
    const dashboardRoutes: Record<UserRole, string> = {
      APPLICANT: '/applicant/dashboard',
      AGENT: '/agent/dashboard',
      ADMIN: '/admin/dashboard',
      EMBASSY: '/ambassade/dashboard',
      BORDER: '/frontiere/dashboard',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
  }

  return <>{children}</>;
}
