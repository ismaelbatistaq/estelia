import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useBusiness } from '../../hooks/useBusiness';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  onUpdateCart: (items: any[]) => void;
}

export const CartDrawer = ({ isOpen, onClose, items, onUpdateCart }: CartDrawerProps) => {
  const { business } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      onUpdateCart(items.filter(item => item.id !== productId));
    } else {
      onUpdateCart(
        items.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('marketplace_orders')
        .insert([{
          business_id: business.id,
          total,
          shipping_address: shippingAddress,
          status: 'pending',
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('marketplace_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Add initial status history
      const { error: historyError } = await supabase
        .from('marketplace_order_status_history')
        .insert([{
          order_id: order.id,
          status: 'pending',
          notes: 'Order created',
        }]);

      if (historyError) throw historyError;

      // Clear cart
      onUpdateCart([]);
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-purple-600 font-semibold">
                        RD$ {item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateQuantity(item.id, 0)}
                          className="p-1 hover:bg-gray-100 rounded ml-2"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({
                        ...shippingAddress,
                        street: e.target.value
                      })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={shippingAddress.zip}
                        onChange={(e) => setShippingAddress({
                          ...shippingAddress,
                          zip: e.target.value
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>RD$ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ITBIS (18%)</span>
                    <span>RD$ {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>RD$ {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || !shippingAddress.street || !shippingAddress.phone}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium
                    hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};