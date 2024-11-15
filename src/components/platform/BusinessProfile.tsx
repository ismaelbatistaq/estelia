import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, Users, Settings, CreditCard } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { BusinessUsers } from './BusinessUsers';
import { BusinessSettings } from './BusinessSettings';
import { BusinessBilling } from './BusinessBilling';

interface Business {
  id: string;
  name: string;
  slug: string;
  settings?: any; // Ajusta los tipos según tus datos
}

export const BusinessProfile = () => {
  const { businessId } = useParams();
  const [activeTab, setActiveTab] = useState('users');

  const { data, isLoading } = useSupabase<Business[]>(
    'businesses',
    {
      select: '*',
      filters: { id: businessId }
    },
    [businessId]
  );

  // Forzamos a TypeScript a interpretar `business` como un objeto `Business | null`
  const business = (data && data.length > 0 ? data[0] : null) as Business | null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Business not found</p>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <BusinessUsers business={business} />;
      case 'settings':
        return <BusinessSettings business={business} />;
      case 'billing':
        return <BusinessBilling business={business} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Building2 className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <p className="text-gray-500">estelia.com/app/{business.slug}</p>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <div className="flex gap-2 p-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
