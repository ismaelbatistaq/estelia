import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Dashboard } from './Dashboard';
import { Calendar } from './Calendar';
import { Sales } from './Sales';
import { POS } from './POS';
import { Catalog } from './Catalog';
import { Marketplace } from './Marketplace';
import { ClientFlow } from './ClientFlow';
import { Customers } from './Customers';
import { Settings } from './Settings';
import { Admin } from './Admin';

export const BusinessApp = () => {
  return (
    <Layout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="sales" element={<Sales />} />
        <Route path="pos" element={<POS />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="marketplace/*" element={<Marketplace />} />
        <Route path="clientflow" element={<ClientFlow />} />
        <Route path="customers" element={<Customers />} />
        <Route path="admin/*" element={<Admin />} />
        <Route path="settings/*" element={<Settings />} />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Layout>
  );
};