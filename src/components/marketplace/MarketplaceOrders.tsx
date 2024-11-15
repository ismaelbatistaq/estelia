import React, { useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { useBusiness } from '../../hooks/useBusiness';
import { format } from 'date-fns';
import { Package, Check, Box, Truck, Home, Eye } from 'lucide-react';
import { OrderDetailsModal } from './OrderDetailsModal';

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  items: Array<{
    id: string;
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  status_history: Array<{
    id: string;
    status: string;
    notes: string;
    created_at: string;
  }>;
}

const statusSteps = [
  { status: 'pending', label: 'Order Created', icon: Package },
  { status: 'confirmed', label: 'Order Confirmed', icon: Check },
  { status: 'processing', label: 'Processing', icon: Box },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Home },
];

export const MarketplaceOrders = () => {
  const { business } = useBusiness();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading, error } = useSupabase<Order>(
    'marketplace_orders',
    {
      select: `
        *,
        items:marketplace_order_items(
          id,
          quantity,
          product:marketplace_products(
            name,
            price
          )
        ),
        status_history:marketplace_order_status_history(
          id,
          status,
          notes,
          created_at
        )
      `,
      filters: {
        business_id: business?.id
      }
    },
    [business?.id]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading orders</p>
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-600';
      case 'confirmed':
        return 'bg-blue-50 text-blue-600';
      case 'processing':
        return 'bg-purple-50 text-purple-600';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-600';
      case 'delivered':
        return 'bg-green-50 text-green-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.created_at), 'PPP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    RD$ {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          statusSteps={statusSteps}
        />
      )}
    </div>
  );
};