import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Users, TrendingUp } from 'lucide-react';

export const FlowAnalytics = () => {
  const data = [
    { hour: '9AM', clients: 4 },
    { hour: '10AM', clients: 6 },
    { hour: '11AM', clients: 8 },
    { hour: '12PM', clients: 7 },
    { hour: '1PM', clients: 5 },
    { hour: '2PM', clients: 6 },
    { hour: '3PM', clients: 8 },
    { hour: '4PM', clients: 7 },
  ];

  const metrics = [
    {
      title: 'Tiempo Promedio de Espera',
      value: '15 min',
      change: '-12%',
      trend: 'down',
      icon: Clock,
    },
    {
      title: 'Clientes en Cola',
      value: '8',
      change: '+25%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Eficiencia del Servicio',
      value: '92%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full
                    ${metric.trend === 'up'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                    }`}
                >
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4">{metric.value}</h3>
              <p className="text-sm text-gray-500">{metric.title}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Flujo de Clientes por Hora</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clients" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};