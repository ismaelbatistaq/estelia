import React from 'react';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

interface Sale {
  id: string;
  created_at: string;
  client?: {
    first_name: string;
    last_name: string;
  };
  total: number;
  status: string;
  items: Array<{
    product?: {
      name: string;
    };
    service?: {
      name: string;
    };
  }>;
}

interface SalesHistoryProps {
  sales: Sale[];
}

export const SalesHistory = ({ sales }: SalesHistoryProps) => {
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
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalle
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
                  {format(new Date(sale.created_at), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {sale.client ? `${sale.client.first_name} ${sale.client.last_name}` : 'Cliente General'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {sale.items.map((item, index) => (
                    <span key={index}>
                      {item.product?.name || item.service?.name}
                      {index < sale.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  RD$ {sale.total.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    sale.status === 'completed' 
                      ? 'bg-green-50 text-green-600' 
                      : sale.status === 'refunded'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {sale.status === 'completed' ? 'Completada' : 
                     sale.status === 'refunded' ? 'Reembolsada' : 'Pendiente'}
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
            Mostrando {sales.length} ventas
          </div>
        </div>
      </div>
    </div>
  );
};