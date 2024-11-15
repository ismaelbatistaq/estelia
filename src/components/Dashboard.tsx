import React from 'react';
import { 
  TrendingUp, Users, Calendar, DollarSign, Package, 
  Bell, ChevronRight, AlertCircle, Boxes
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { AppointmentCard } from './AppointmentCard';
import { SalesChart } from './SalesChart';
import { NotificationCard } from './NotificationCard';
import { DataTable } from './DataTable';

const stats = [
  {
    title: 'Ventas del Día',
    value: 'RD$ 15,240',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Citas Hoy',
    value: '24',
    change: '+4.5%',
    trend: 'up',
    icon: Calendar,
  },
  {
    title: 'Clientes Nuevos',
    value: '12',
    change: '-2.4%',
    trend: 'down',
    icon: Users,
  },
  {
    title: 'Productos Vendidos',
    value: '85',
    change: '+8.7%',
    trend: 'up',
    icon: Package,
  },
];

const notifications = [
  {
    type: 'warning',
    title: 'Inventario Bajo',
    message: 'Tinte para cabello #5 está por debajo del mínimo',
    time: '5 min',
    icon: Boxes,
  },
  {
    type: 'info',
    title: 'Nueva Cita',
    message: 'María Pérez agendó para mañana 2:00 PM',
    time: '10 min',
    icon: Calendar,
  },
  {
    type: 'alert',
    title: 'Actualización de Sistema',
    message: 'Nueva versión disponible para instalar',
    time: '1 hora',
    icon: AlertCircle,
  },
];

const recentSales = [
  { id: 1, client: 'María Pérez', service: 'Corte y Peinado', amount: 'RD$ 1,500', date: '2024-01-20' },
  { id: 2, client: 'Laura Díaz', service: 'Manicure y Pedicure', amount: 'RD$ 800', date: '2024-01-20' },
  { id: 3, client: 'Sofia Medina', service: 'Tinte y Mechas', amount: 'RD$ 3,500', date: '2024-01-20' },
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Ventas</h2>
            <select className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <option>Últimos 7 días</option>
              <option>Este Mes</option>
              <option>Este Año</option>
            </select>
          </div>
          <SalesChart />
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Notificaciones</h2>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-700">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <NotificationCard key={index} {...notification} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Ventas Recientes</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <DataTable data={recentSales} />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Próximas Citas</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { time: '10:00 AM', client: 'María Pérez', service: 'Corte y Peinado', stylist: 'Ana Gómez' },
              { time: '11:30 AM', client: 'Laura Díaz', service: 'Manicure y Pedicure', stylist: 'Carmen Santos' },
              { time: '2:00 PM', client: 'Sofia Medina', service: 'Tinte y Mechas', stylist: 'Ana Gómez' },
            ].map((apt, index) => (
              <AppointmentCard key={index} {...apt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};