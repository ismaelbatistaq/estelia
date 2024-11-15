import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requirePlatformAdmin?: boolean;
  requireBusinessAccess?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requirePlatformAdmin = false,
  requireBusinessAccess = false,
}) => {
  const { user, loading } = useAuth();
  const { businessSlug } = useParams();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirigir al login correspondiente si el usuario no está autenticado
    const redirectTo = requirePlatformAdmin
      ? "/platform/login"
      : requireBusinessAccess && businessSlug
      ? `/app/${businessSlug}/login`
      : "/platform/login";

    return <Navigate to={redirectTo} replace />;
  }

  // Si el usuario es administrador de la plataforma, permitir acceso a todo
  if (user.role === 'SUPERADMIN') {
    return <>{children}</>;
  }

  // Validar acceso a negocios específicos si es necesario
  if (requireBusinessAccess && businessSlug) {
    const hasAccess = user.organization?.slug === businessSlug;
    if (!hasAccess) {
      return <Navigate to={`/app/${businessSlug}/login`} replace />;
    }
  }

  // Validar acceso a funcionalidades de plataforma si es necesario
  if (requirePlatformAdmin && user.role !== 'SUPERADMIN') {
    const redirectTo = user.organization?.slug
      ? `/app/${user.organization.slug}`
      : "/platform/login";

    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
