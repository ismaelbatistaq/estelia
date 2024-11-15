import React from 'react';
import { Package, Scissors, BoxesIcon, Building2 } from 'lucide-react';

interface CatalogTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CatalogTabs = ({ activeTab, onTabChange }: CatalogTabsProps) => {
  const tabs = [
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'services', label: 'Servicios', icon: Scissors },
    { id: 'inventory', label: 'Inventario', icon: BoxesIcon },
    { id: 'suppliers', label: 'Proveedores', icon: Building2 },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
  );
};