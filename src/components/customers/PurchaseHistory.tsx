import React from 'react';
import { Package, Calendar } from 'lucide-react';

interface PurchaseHistoryProps {
  customerId: number;
}

export const PurchaseHistory = ({ customerId }: PurchaseHistoryProps) => {
  const purchases = [
    {
      id: 1,
      date: '2024-01-20',
      products: [
        { name: 'Shampoo Premium', quantity: 1, price: 450 },
        { name: 'Acondicionador Premium', quantity: 1, price: 400 },
      ],
      total: 850,
    },
    {
      id: 2,
      date: '2024-01-05',
      products: [
        { name: 'Tratamiento Capilar', quantity: 1, price: 1200 },
      ],
      total: 1200,
    },
  ];

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => (
        <div
          key={purchase.id}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{purchase.date}</span>
          </div>

          <div className="space-y-2">
            {purchase.products.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>{product.name}</span>
                  <span className="text-sm text-gray-500">
                    x{product.quantity}
                  </span>
                </div>
                <span>RD$ {product.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="font-medium">RD$ {purchase.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
};