import React from 'react';
import { Receipt, FileText, Building2, Users, Layout } from 'lucide-react';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs = [
    { id: 'purchases', label: 'Compras', icon: Receipt },
    { id: 'tax', label: 'Documentos Fiscales', icon: FileText },
    { id: 'dgii', label: 'Reportes DGII', icon: Building2 },
    { id: 'personnel', label: 'Personal', icon: Users },
    { id: 'workspace', label: 'Espacios', icon: Layout },
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