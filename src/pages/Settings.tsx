import React from 'react';
import { Tabs } from '../components/settings/Tabs';
import { GeneralSettings } from '../components/settings/GeneralSettings';
import { UserManagement } from '../components/settings/UserManagement';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { BillingSettings } from '../components/settings/BillingSettings';

export const Settings = () => {
  const [activeTab, setActiveTab] = React.useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'users':
        return <UserManagement />;
      case 'security':
        return <SecuritySettings />;
      case 'billing':
        return <BillingSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};