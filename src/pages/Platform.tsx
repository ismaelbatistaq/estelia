import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlatformLayout } from '../components/platform/PlatformLayout';
import { OrganizationsList } from '../components/platform/OrganizationsList';
import { CreateOrganization } from '../components/platform/CreateOrganization';
import { BusinessProfile } from '../components/platform/BusinessProfile';
import { PlatformDashboard } from '../components/platform/PlatformDashboard';
import { BillingSettings } from '../components/platform/BillingSettings';
import { MarketplaceManagement } from '../components/platform/MarketplaceManagement';
import { MarketplaceCategories } from '../components/platform/MarketplaceCategories';
import { MarketplaceOrders } from '../components/platform/MarketplaceOrders';

export const Platform = () => {
  return (
    <PlatformLayout>
      <Routes>
        <Route path="dashboard" element={<PlatformDashboard />} />
        <Route path="organizations" element={<OrganizationsList />} />
        <Route path="organizations/:businessId/*" element={<BusinessProfile />} />
        <Route path="create" element={<CreateOrganization />} />
        <Route path="marketplace" element={<MarketplaceManagement />} />
        <Route path="marketplace/categories" element={<MarketplaceCategories />} />
        <Route path="marketplace/orders" element={<MarketplaceOrders />} />
        <Route path="billing" element={<BillingSettings />} />
        <Route path="/" element={<Navigate to="/platform/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/platform/dashboard" replace />} />
      </Routes>
    </PlatformLayout>
  );
};