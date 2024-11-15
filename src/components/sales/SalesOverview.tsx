import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

interface Sale {
  created_at: string;
  total: number;
}

interface SalesOverviewProps {
  sales: Sale[];
}

export const SalesOverview = ({ sales }: SalesOverviewProps) => {
  // Get sales for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = startOfDay(date);
    const end = endOfDay(date);
    
    const dayTotal = sales.reduce((sum, sale) => {
      const saleDate = new Date(sale.created_at);
      if (isWithinInterval(saleDate, { start, end })) {
        return sum + sale.total;
      }
      return sum;
    }, 0);

    return {
      date: format(date, 'EEE'),
      total: dayTotal
    };
  }).reverse();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Resumen de Ventas</h2>
        <select className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <option>Últimos 7 días</option>
          <option>Este Mes</option>
          <option>Este Año</option>
        </select>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`RD$ ${value.toLocaleString()}`, 'Ventas']}
            />
            <Bar dataKey="total" fill="#7C3AED" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};