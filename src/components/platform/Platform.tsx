import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlatformLayout } from './PlatformLayout';
import { OrganizationsList } from './OrganizationsList';
import { CreateOrganization } from './CreateOrganization';
import { PlatformDashboard } from './PlatformDashboard';
import { BillingSettings } from './BillingSettings';
import { MarketplaceManagement } from './MarketplaceManagement';
import { MarketplaceCategories } from './MarketplaceCategories';
import { MarketplaceOrders } from './MarketplaceOrders';

export const Platform = () => {
  return (
    <PlatformLayout>
      <Routes>
        <Route path="/" element={<PlatformDashboard />} />
        <Route path="organizations" element={<OrganizationsList />} />
        <Route path="create" element={<CreateOrganization />} />
        <Route path="marketplace" element={<MarketplaceManagement />} />
        <Route path="marketplace/categories" element={<MarketplaceCategories />} />
        <Route path="marketplace/orders" element={<MarketplaceOrders />} />
        <Route path="billing" element={<BillingSettings />} />
        <Route path="*" element={<Navigate to="/platform" replace />} />
      </Routes>
    </PlatformLayout>
  );
};