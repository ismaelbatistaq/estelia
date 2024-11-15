import React, { useState } from 'react';
import { ClientCheckIn } from '../components/clientflow/ClientCheckIn';
import { QueueManagement } from '../components/clientflow/QueueManagement';
import { ServiceProgress } from '../components/clientflow/ServiceProgress';
import { FlowAnalytics } from '../components/clientflow/FlowAnalytics';
import { ClientFlowTabs } from '../components/clientflow/ClientFlowTabs';
import { useBusinessData } from '../hooks/useBusinessData';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  image_url: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

interface Stylist {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url: string | null;
}

export const ClientFlow = () => {
  const [activeTab, setActiveTab] = useState('checkin');

  const { data: services, loading: servicesLoading } = useBusinessData<Service>('services');
  const { data: products, loading: productsLoading } = useBusinessData<Product>('products');
  const { data: stylists, loading: stylistsLoading } = useBusinessData<Stylist>('profiles', {
    filters: { role: 'stylist' }
  });

  const loading = servicesLoading || productsLoading || stylistsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'checkin':
        return (
          <ClientCheckIn 
            services={services || []} 
            products={products || []} 
            stylists={stylists || []} 
          />
        );
      case 'queue':
        return <QueueManagement />;
      case 'service':
        return <ServiceProgress />;
      case 'analytics':
        return <FlowAnalytics />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Flujo de Clientes</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <ClientFlowTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};