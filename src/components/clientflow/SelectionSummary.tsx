import React from 'react';
import { ShoppingCart, X } from 'lucide-react';

interface SelectionSummaryProps {
  selectedServices: any[];
  toggleService: (service: any) => void;
  total: number;
  onConfirm: () => void;
  disableConfirm: boolean;
}

export const SelectionSummary = ({
  selectedServices,
  toggleService,
  total,
  onConfirm,
  disableConfirm,
}: SelectionSummaryProps) => {
  return (
    <div className="bg-white border rounded-lg p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <ShoppingCart className="w-5 h-5 text-gray-400" />
      </div>

      {selectedServices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay servicios seleccionados</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.duration}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">RD$ {service.price}</span>
                  <button
                    onClick={() => toggleService(service)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium">Total</span>
              <span className="text-lg font-semibold">RD$ {total}</span>
            </div>

            <button
              onClick={onConfirm}
              disabled={disableConfirm}
              className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium
                hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Check-in
            </button>
          </div>
        </>
      )}
    </div>
  );
};