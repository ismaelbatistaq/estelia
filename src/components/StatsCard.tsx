import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

export const StatsCard = ({ title, value, change, trend, icon: Icon }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
        <div className={`px-2.5 py-1 rounded-lg flex items-center text-sm
          ${trend === 'up' 
            ? 'bg-green-50 text-green-600' 
            : 'bg-red-50 text-red-600'
          }`}>
          {change}
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4 ml-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 ml-1" />
          )}
        </div>
      </div>
      <h3 className="text-2xl font-bold mt-4">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
};