import React, { useState } from 'react';
import { X, CreditCard, DollarSign } from 'lucide-react';

interface POSPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  total: number;
}

export const POSPaymentModal = ({ isOpen, onClose, onComplete, total }: POSPaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [amountPaid, setAmountPaid] = useState(total.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Procesar Pago</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors
                  ${
                    paymentMethod === 'cash'
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'hover:bg-gray-50'
                  }`}
              >
                <DollarSign className="w-6 h-6" />
                <span className="font-medium">Efectivo</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors
                  ${
                    paymentMethod === 'card'
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'hover:bg-gray-50'
                  }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="font-medium">Tarjeta</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto a Pagar
            </label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {paymentMethod === 'cash' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cambio
              </label>
              <input
                type="text"
                value={`RD$ ${Math.max(
                  parseFloat(amountPaid) - total,
                  0
                ).toFixed(2)}`}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border rounded-lg"
              />
            </div>
          )}

          <div className="pt-4 border-t">
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium
                hover:bg-purple-700 transition-colors"
            >
              Completar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};