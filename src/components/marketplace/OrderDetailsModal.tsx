import React from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  statusSteps: any[];
}

export const OrderDetailsModal = ({ isOpen, onClose, order, statusSteps }: OrderDetailsModalProps) => {
  if (!isOpen) return null;

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.status === status);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Order Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold">Order Details</h2>
            <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
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

          {/* Order Items */}
          <div>
            <h3 className="font-medium text-gray-500 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
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
            <div>
              <h3 className="font-medium text-gray-500 mb-4">Tracking Information</h3>
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
          <div>
            <h3 className="font-medium text-gray-500 mb-4">Order History</h3>
            <div className="space-y-3">
              {order.status_history?.map((history: any) => (
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
      </div>
    </div>
  );
};