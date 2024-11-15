import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Store, UserCog, 
  CreditCard, FileText, Settings as SettingsIcon, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Clients', path: '/admin/clients' },
    { icon: Store, label: 'Marketplace', path: '/admin/marketplace' },
    { icon: UserCog, label: 'Users', path: '/admin/users' },
    { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
    { icon: FileText, label: 'Audit Logs', path: '/admin/audit' },
    { icon: SettingsIcon, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Estelia Admin
          </h1>
        </div>

        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={logout}
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