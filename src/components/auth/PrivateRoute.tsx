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
  requirePlatformAdmin,
  requireBusinessAccess
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
    if (requirePlatformAdmin) {
      return <Navigate to="/platform/login" />;
    }
    if (requireBusinessAccess && businessSlug) {
      return <Navigate to={`/app/${businessSlug}/login`} />;
    }
    return <Navigate to="/platform/login" />;
  }

  // Check platform admin access
  if (requirePlatformAdmin && user.role !== 'SUPERADMIN') {
    if (user.organization?.slug) {
      return <Navigate to={`/app/${user.organization.slug}`} />;
    }
    return <Navigate to="/platform/login" />;
  }

  // Check business access
  if (requireBusinessAccess && businessSlug) {
    const hasAccess = user.organization?.slug === businessSlug;
    if (!hasAccess) {
      return <Navigate to={`/app/${businessSlug}/login`} />;
    }
  }

  return <>{children}</>;
};