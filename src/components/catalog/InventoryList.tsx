import React from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category: {
    name: string;
  } | null;
  status: 'active' | 'inactive';
}

interface InventoryListProps {
  searchQuery: string;
  products: Product[];
}

export const InventoryList = ({ searchQuery, products }: InventoryListProps) => {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false
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
              Categoría
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
          {filteredProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">{product.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.sku}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`font-medium ${
                  product.stock <= 5 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {product.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {product.category?.name || 'Sin categoría'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {product.stock <= 5 ? (
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