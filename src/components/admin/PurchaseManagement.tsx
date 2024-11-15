import React from 'react';
import { Plus, Download } from 'lucide-react';

export const PurchaseManagement = () => {
  const purchases = [
    {
      id: 1,
      date: '2024-01-20',
      vendor: 'Distribuidora Belleza Pro',
      invoice: 'B0001',
      amount: 'RD$ 25,000',
      status: 'pending',
    },
    {
      id: 2,
      date: '2024-01-19',
      vendor: 'Cosméticos del Caribe',
      invoice: 'B0002',
      amount: 'RD$ 18,500',
      status: 'paid',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Registro de Compras</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Nueva Compra</span>
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
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. Factura
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
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {purchase.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {purchase.vendor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {purchase.invoice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {purchase.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full
                      ${purchase.status === 'paid'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-yellow-50 text-yellow-600'
                      }`}
                  >
                    {purchase.status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};