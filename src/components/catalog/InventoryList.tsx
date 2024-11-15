import React from 'react';
import { AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';

interface InventoryListProps {
  searchQuery: string;
}

export const InventoryList = ({ searchQuery }: InventoryListProps) => {
  const inventory = [
    {
      id: 1,
      product: 'Shampoo Premium',
      sku: 'SH001',
      quantity: 25,
      minStock: 10,
      location: 'Almacén A',
      lastUpdated: '2024-01-20',
      status: 'ok',
    },
    {
      id: 2,
      product: 'Acondicionador Premium',
      sku: 'AC001',
      quantity: 5,
      minStock: 10,
      location: 'Almacén A',
      lastUpdated: '2024-01-20',
      status: 'low',
    },
    // Add more inventory items as needed
  ];

  const filteredInventory = inventory.filter((item) =>
    item.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ubicación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Última Actualización
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredInventory.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">{item.product}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.sku}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`font-medium ${
                  item.quantity <= item.minStock ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {item.quantity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {item.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.lastUpdated}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {item.status === 'low' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Bajo Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                    OK
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center gap-2">
                  <button className="p-1 hover:bg-purple-50 rounded text-purple-600">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-purple-50 rounded text-purple-600">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};