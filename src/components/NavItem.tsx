import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  expanded: boolean;
  showTooltip?: boolean;
  isActive?: boolean;
}

export const NavItem = ({ icon: Icon, label, path, showTooltip, isActive }: NavItemProps) => {
  return (
    <Link
      to={path}
      className={`flex items-center justify-center p-3 rounded-lg transition-colors relative group/item
        ${isActive 
          ? 'bg-purple-50 text-purple-600' 
          : 'text-gray-600 hover:bg-gray-50'
        }`}
    >
      <Icon className={`w-6 h-6 ${isActive ? 'text-purple-600' : 'text-gray-600'}`} />
      
      {showTooltip && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded 
          opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible
          transition-all duration-200 whitespace-nowrap">
          {label}
        </div>
      )}
    </Link>
  );
};