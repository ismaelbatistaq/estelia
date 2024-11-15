import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, Plus, CreditCard, LayoutDashboard, 
  LogOut, ShoppingBag, Grid, Package 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/platform' },
    { icon: Building2, label: 'Organizations', path: '/platform/organizations' },
    { icon: Plus, label: 'Create Business', path: '/platform/create' },
    { 
      icon: ShoppingBag, 
      label: 'Marketplace', 
      path: '/platform/marketplace',
      submenu: [
        { icon: Grid, label: 'Categories', path: '/platform/marketplace/categories' },
        { icon: Package, label: 'Orders', path: '/platform/marketplace/orders' }
      ]
    },
    { icon: CreditCard, label: 'Billing', path: '/platform/billing' },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Estelia Platform
          </h1>
        </div>

        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = isActiveRoute(item.path);
            const ItemIcon = item.icon;
            
            return (
              <div key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-purple-50 text-purple-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <ItemIcon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>

                {item.submenu && isActive && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subitem) => {
                      const isSubActive = location.pathname === subitem.path;
                      const SubIcon = subitem.icon;
                      return (
                        <button
                          key={subitem.path}
                          onClick={() => navigate(subitem.path)}
                          className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors
                            ${isSubActive
                              ? 'bg-purple-50 text-purple-600'
                              : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-purple-600' : 'text-gray-500'}`} />
                          <span>{subitem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};