import React, { useState } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onOrderUpdate?: (updatedOrder: any) => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-600' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
  { value: 'processing', label: 'Processing', color: 'bg-purple-50 text-purple-600' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-50 text-indigo-600' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-50 text-green-600' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-600' },
];

export const OrderDetailsModal = ({ isOpen, onClose, order, onOrderUpdate }: OrderDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      if (!statusNote) {
        alert('Please add a note about this status update');
        return;
      }

      setLoading(true);

      // Update order status
      const { error: orderError } = await supabase
        .from('marketplace_orders')
        .update({ 
          status: newStatus,
          ...(newStatus === 'shipped' && {
            tracking_number: '123456789', // You would get this from a form
            estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          })
        })
        .eq('id', currentOrder.id);

      if (orderError) throw orderError;

      // Add status history entry
      const { error: historyError } = await supabase
        .from('marketplace_order_status_history')
        .insert([{
          order_id: currentOrder.id,
          status: newStatus,
          notes: statusNote,
        }]);

      if (historyError) throw historyError;

      // Fetch updated order data
      const { data: updatedOrder, error: fetchError } = await supabase
        .from('marketplace_orders')
        .select(`
          *,
          items:marketplace_order_items(
            id,
            quantity,
            price,
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
        `)
        .eq('id', currentOrder.id)
        .single();

      if (fetchError) throw fetchError;

      // Update local state and parent component
      setCurrentOrder(updatedOrder);
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }

      // Reset form state
      setStatusNote('');
      setShowStatusDropdown(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-50 text-gray-600';
  };

  const getNextStatuses = () => {
    const currentIndex = statusOptions.findIndex(opt => opt.value === currentOrder.status);
    return statusOptions.slice(currentIndex + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold">Order Details</h2>
            <p className="text-sm text-gray-500">Order #{currentOrder.id.slice(0, 8)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Items */}
          <div>
            <h3 className="font-medium text-gray-500 mb-4">Order Items</h3>
            <div className="space-y-3">
              {currentOrder.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-medium">
                    RD$ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div>
            <h3 className="font-medium text-gray-500 mb-4">Current Status</h3>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStatusColor(currentOrder.status)}`}>
                {statusOptions.find(opt => opt.value === currentOrder.status)?.label}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  Update Status
                  <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                    {getNextStatuses().map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleUpdateStatus(status.value)}
                        disabled={loading}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <span className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-').replace('-50', '-600')}`} />
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Update Note */}
          <div>
            <h3 className="font-medium text-gray-500 mb-4">Status Update Note</h3>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Add a note about this status update..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          {/* Status History */}
          <div>
            <h3 className="font-medium text-gray-500 mb-4">Order History</h3>
            <div className="space-y-3">
              {currentOrder.status_history?.map((history: any) => (
                <div
                  key={history.id}
                  className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(history.status)}`}>
                        {statusOptions.find(opt => opt.value === history.status)?.label}
                      </span>
                    </div>
                    {history.notes && (
                      <p className="mt-2 text-sm text-gray-500">{history.notes}</p>
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