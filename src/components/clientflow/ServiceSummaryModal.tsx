import React from 'react';
import { X, Clock, User, Check } from 'lucide-react';

interface ServiceSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: any[];
  stylist: any;
  total: number;
}

export const ServiceSummaryModal = ({
  isOpen,
  onClose,
  services,
  stylist,
  total,
}: ServiceSummaryModalProps) => {
  if (!isOpen) return null;

  const handleComplete = () => {
    // Here you would save the service completion data
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Resumen del Servicio</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stylist Info */}
          <div className="flex items-center gap-4">
            <img
              src={stylist.image}
              alt={stylist.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{stylist.name}</h3>
              <p className="text-sm text-gray-500">{stylist.role}</p>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            <h3 className="font-medium">Servicios Realizados</h3>
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <span className="font-medium">RD$ {service.price}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>RD$ {total}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Confirmar y Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};