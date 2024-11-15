import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminLayout } from '../components/admin/AdminLayout';
import { ClientManagement } from '../components/admin/ClientManagement';
import { MarketplaceAdmin } from '../components/admin/MarketplaceAdmin';
import { UserManagement } from '../components/admin/UserManagement';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { BillingManagement } from '../components/admin/BillingManagement';
import { AuditLogs } from '../components/admin/AuditLogs';
import { Settings } from '../components/admin/Settings';

export const AdminPortal = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.roles.includes('admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/clients" element={<ClientManagement />} />
        <Route path="/marketplace" element={<MarketplaceAdmin />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/billing" element={<BillingManagement />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
};