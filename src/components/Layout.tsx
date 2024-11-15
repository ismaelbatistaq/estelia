import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Calendar, ShoppingCart, Package, Settings, LayoutDashboard, Store, Users } from 'lucide-react';
import { NavItem } from './NavItem';
import { TopBar } from './TopBar';
import { useAuth } from '../contexts/AuthContext';
import { useOrganization } from '../hooks/useOrganization';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: 'dashboard' },
  { icon: Calendar, label: 'Calendar', path: 'calendar' },
  { icon: ShoppingCart, label: 'Sales', path: 'sales' },
  { icon: Package, label: 'Catalog', path: 'catalog' },
  { icon: Store, label: 'Marketplace', path: 'marketplace' },
  { icon: Users, label: 'Customers', path: 'customers' },
  { icon: Settings, label: 'Settings', path: 'settings' },
];

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { organization } = useOrganization();
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (!organization?.slug) return false; // Evitar errores si `slug` no está definido
    const currentPath = location.pathname.replace(`/app/${organization.slug}/`, '');
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  if (!organization && user.role !== 'SUPERADMIN') {
    // Mostrar un mensaje de error si `organization` no está disponible y el usuario no es admin
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Organization data is not available. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        organization={organization}
      />

      <div className="flex min-h-[calc(100vh-4rem)] pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-20 bg-white shadow-lg rounded-r-xl transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="flex flex-col gap-2 p-4">
            {menuItems.map((item) => (
              <NavItem
                key={item.path}
                {...item}
                path={organization ? `/app/${organization.slug}/${item.path}` : '#'}
                expanded={false}
                showTooltip={true}
                isActive={isActiveRoute(item.path)}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-20' : 'ml-0'} p-6`}>
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ organization }} />
          </div>
        </main>
      </div>
    </div>
  );
};
