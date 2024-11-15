import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Calendar, Package, Heart, AlertCircle, Bell } from 'lucide-react';
import { ServiceHistory } from './ServiceHistory';
import { PurchaseHistory } from './PurchaseHistory';
import { CustomerPreferences } from './CustomerPreferences';
import { MarketingPreferences } from './MarketingPreferences';

interface CustomerProfileProps {
  customer: any;
  onClose: () => void;
}

export const CustomerProfile = ({ customer, onClose }: CustomerProfileProps) => {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: 'Información' },
    { id: 'services', label: 'Historial de Servicios' },
    { id: 'purchases', label: 'Compras' },
    { id: 'preferences', label: 'Preferencias' },
    { id: 'marketing', label: 'Marketing' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServiceHistory customerId={customer.id} />;
      case 'purchases':
        return <PurchaseHistory customerId={customer.id} />;
      case 'preferences':
        return <CustomerPreferences customerId={customer.id} />;
      case 'marketing':
        return <MarketingPreferences customerId={customer.id} />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={customer.image}
                alt={customer.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{customer.name}</h2>
                <p className="text-gray-500">Cliente desde 2023</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-500">Información de Contacto</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>Santo Domingo, DN</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-500">Estadísticas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-500">Visitas</span>
                    </div>
                    <p className="text-lg font-semibold">{customer.totalVisits}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-500">Total Gastado</span>
                    </div>
                    <p className="text-lg font-semibold">
                      RD$ {customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-500">Preferencias</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                  <Heart className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="font-medium">Estilista Preferido</p>
                    <p className="text-sm text-gray-500">Ana Gómez</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="font-medium">Alergias</p>
                    <p className="text-sm text-gray-500">Ninguna registrada</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-500">Recordatorios</h3>
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <Bell className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="font-medium">Próxima Cita</p>
                  <p className="text-sm text-gray-500">No hay citas programadas</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-white border-l shadow-lg overflow-y-auto">
      <div className="sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Perfil del Cliente</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b overflow-x-auto">
          <div className="flex p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors
                  ${activeTab === tab.id
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">{renderContent()}</div>
    </div>
  );
};