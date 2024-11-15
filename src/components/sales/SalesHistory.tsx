import React from 'react';
import { Download } from 'lucide-react';

export const SalesHistory = () => {
  const sales = [
    {
      id: 1,
      date: '2024-01-20',
      invoice: 'B0001',
      client: 'María Pérez',
      amount: 'RD$ 1,500',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-01-20',
      invoice: 'B0002',
      client: 'Juan Rodríguez',
      amount: 'RD$ 2,800',
      status: 'completed',
    },
    // Add more sales as needed
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Historial de Ventas</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. Factura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {sale.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {sale.invoice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {sale.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {sale.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando 1-10 de 50 resultados
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};