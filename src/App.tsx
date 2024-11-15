import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { PlatformLogin } from './components/platform/auth/PlatformLogin';
import { BusinessLogin } from './components/business/auth/BusinessLogin';
import { Platform } from './pages/Platform';
import { BusinessApp } from './pages/BusinessApp';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Platform Routes */}
          <Route path="/platform/login" element={<PlatformLogin />} />
          <Route path="/platform/*" element={
            <PrivateRoute requirePlatformAdmin>
              <Platform />
            </PrivateRoute>
          } />

          {/* Business Routes */}
          <Route path="/app/:businessSlug/login" element={<BusinessLogin />} />
          <Route path="/app/:businessSlug" element={
            user?.organization?.slug ? (
              <Navigate to={`/app/${user.organization.slug}/dashboard`} replace />
            ) : (
              <div>Loading...</div> // O un componente de carga temporal
            )
          } />
          <Route path="/app/:businessSlug/*" element={
            <PrivateRoute requireBusinessAccess>
              <BusinessApp />
            </PrivateRoute>
          } />

          {/* Legacy Routes Redirect */}
          <Route path="/org/:businessSlug/*" element={
            user?.organization?.slug ? (
              <Navigate to={`/app/${user.organization.slug}`} replace />
            ) : (
              <div>Loading...</div>
            )
          } />

          {/* Root Redirect */}
          <Route path="/" element={
            user?.role === 'SUPERADMIN' ? (
              <Navigate to="/platform/dashboard" replace />
            ) : user?.organization?.slug ? (
              <Navigate to={`/app/${user.organization.slug}`} replace />
            ) : (
              <div>Loading...</div>
            )
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
