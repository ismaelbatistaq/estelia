import React from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { useBusiness } from '../hooks/useBusiness';
import { format } from 'date-fns';
import { Package, Check, Box, Truck, Home } from 'lucide-react';

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

export const Orders = () => {
  const { business } = useBusiness();
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

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.status === status);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      <div className="space-y-6">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500">
                    Placed on {format(new Date(order.created_at), 'PPP')}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-600">
                  RD$ {order.total.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                  <div
                    className="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-500"
                    style={{
                      width: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%`
                    }}
                  />
                </div>
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const currentIndex = getStatusIndex(order.status);
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.status}
                        className={`flex flex-col items-center ${
                          index <= currentIndex ? 'text-purple-600' : 'text-gray-400'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index <= currentIndex ? 'bg-purple-50' : 'bg-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="mt-2 text-xs font-medium">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b">
              <h4 className="font-medium mb-4">Order Items</h4>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-medium">
                      RD$ {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Info */}
            {order.tracking_number && (
              <div className="p-6 border-b">
                <h4 className="font-medium mb-4">Tracking Information</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Tracking Number:</span>{' '}
                    {order.tracking_number}
                  </p>
                  {order.estimated_delivery && (
                    <p className="text-sm">
                      <span className="text-gray-500">Estimated Delivery:</span>{' '}
                      {format(new Date(order.estimated_delivery), 'PPP')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Status History */}
            <div className="p-6">
              <h4 className="font-medium mb-4">Order History</h4>
              <div className="space-y-3">
                {order.status_history?.map((history) => (
                  <div
                    key={history.id}
                    className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium capitalize">{history.status}</p>
                      {history.notes && (
                        <p className="text-sm text-gray-500">{history.notes}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(history.created_at), 'PPP p')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};