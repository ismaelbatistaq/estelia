import React from 'react';
import { Menu, Bell, Search, Store, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopBarProps {
  sidebarOpen: boolean;
  onMenuClick: () => void;
  organization: {
    name?: string;
    slug?: string;
  } | null;
}

export const TopBar = ({ sidebarOpen, onMenuClick, organization }: TopBarProps) => {
  const orgName = organization?.name || 'No Organization';
  const orgSlug = organization?.slug || '#';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
          </button>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {orgName}
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Link
            to={`/org/${orgSlug}/clientflow`}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Check-in</span>
          </Link>
          <Link
            to={`/org/${orgSlug}/pos`}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Store className="w-5 h-5" />
            <span className="hidden sm:inline">POS</span>
          </Link>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-medium">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};
