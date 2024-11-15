import React from 'react';
import { UserPlus, Users, Clock, BarChart3 } from 'lucide-react';

interface ClientFlowTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ClientFlowTabs = ({ activeTab, onTabChange }: ClientFlowTabsProps) => {
  const tabs = [
    { id: 'checkin', label: 'Check-in', icon: UserPlus },
    { id: 'queue', label: 'Cola de Espera', icon: Users },
    { id: 'service', label: 'Servicios Activos', icon: Clock },
    { id: 'analytics', label: 'Análisis', icon: BarChart3 },
  ];

  return (
    <div className="flex gap-2 p-4 border-b overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
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