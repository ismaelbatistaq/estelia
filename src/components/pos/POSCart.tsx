import React from 'react';
import { Minus, Plus, Trash2, User } from 'lucide-react';

interface POSCartProps {
  items: any[];
  client: any;
  onSelectClient: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export const POSCart = ({ 
  items, 
  client, 
  onSelectClient,
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}: POSCartProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% ITBIS
  const total = subtotal + tax;

  return (
    <>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Carrito de Compra</h2>
        <button
          onClick={onSelectClient}
          className="w-full flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <User className="w-5 h-5 text-gray-500" />
          <span className="flex-1 text-left">
            {client ? (
              <div>
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-gray-500">{client.email}</div>
              </div>
            ) : (
              <span className="text-gray-500">Seleccionar Cliente</span>
            )}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No hay items en el carrito</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-purple-600 font-semibold">
                    RD$ {item.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 hover:bg-gray-100 rounded ml-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>RD$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ITBIS (18%)</span>
            <span>RD$ {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>RD$ {total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium
            hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceder al Pago
        </button>
      </div>
    </>
  );
};