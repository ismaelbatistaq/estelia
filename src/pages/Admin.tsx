import React, { useState } from 'react';
import { Tabs } from '../components/admin/Tabs';
import { PurchaseManagement } from '../components/admin/PurchaseManagement';
import { TaxDocuments } from '../components/admin/TaxDocuments';
import { DGIIReports } from '../components/admin/DGIIReports';
import { PersonnelManagement } from '../components/admin/PersonnelManagement';
import { WorkspaceManagement } from '../components/admin/WorkspaceManagement';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('purchases');

  const renderContent = () => {
    switch (activeTab) {
      case 'purchases':
        return <PurchaseManagement />;
      case 'tax':
        return <TaxDocuments />;
      case 'dgii':
        return <DGIIReports />;
      case 'personnel':
        return <PersonnelManagement />;
      case 'workspace':
        return <WorkspaceManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión Administrativa</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};