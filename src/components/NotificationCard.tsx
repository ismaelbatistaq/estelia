import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NotificationCardProps {
  type: 'warning' | 'info' | 'alert';
  title: string;
  message: string;
  time: string;
  icon: LucideIcon;
}

const typeStyles = {
  warning: 'bg-yellow-50 text-yellow-600',
  info: 'bg-blue-50 text-blue-600',
  alert: 'bg-red-50 text-red-600',
};

export const NotificationCard = ({ type, title, message, time, icon: Icon }: NotificationCardProps) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className={`p-2 rounded-lg ${typeStyles[type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="font-medium truncate">{title}</p>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{time}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
    </div>
  );
};