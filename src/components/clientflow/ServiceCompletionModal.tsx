import React from 'react';
import { X, Printer, Clock, Calendar, User, CheckCircle2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ServiceCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: {
    client: any;
    services: any[];
    products: any[];
    stylist: any;
    startTime: Date;
    endTime: Date;
    waitTime: number;
    serviceTime: number;
  };
}

export const ServiceCompletionModal = ({
  isOpen,
  onClose,
  serviceData,
}: ServiceCompletionModalProps) => {
  if (!isOpen) return null;

  const {
    client,
    services,
    products,
    stylist,
    startTime,
    endTime,
    waitTime,
    serviceTime,
  } = serviceData;

  const servicesTotal = services.reduce((sum, service) => sum + service.price, 0);
  const productsTotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const subtotal = servicesTotal + productsTotal;
  const tax = subtotal * 0.18; // 18% ITBIS
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Implement PDF export functionality
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold">Resumen del Servicio</h2>
            <p className="text-sm text-gray-500">Comprobante de Servicio #{Math.floor(Math.random() * 10000)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Exportar PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Imprimir"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Business Info */}
          <div className="text-center border-b pb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Estelia
            </h1>
            <p className="text-gray-500">Salón de Belleza</p>
            <p className="text-sm text-gray-500">RNC: 123456789</p>
          </div>

          {/* Client & Service Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-500">Cliente</h3>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-500">{client.email}</p>
              <p className="text-sm text-gray-500">{client.phone}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-500">Detalles del Servicio</h3>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{format(startTime, 'PPP', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>
                  {format(startTime, 'p', { locale: es })} - {format(endTime, 'p', { locale: es })}
                </span>
              </div>
            </div>
          </div>

          {/* Time Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Tiempo de Espera</p>
              <p className="text-lg font-semibold">{waitTime} min</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Tiempo de Servicio</p>
              <p className="text-lg font-semibold">{serviceTime} min</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Tiempo Total</p>
              <p className="text-lg font-semibold">{waitTime + serviceTime} min</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-medium mb-3">Servicios Realizados</h3>
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <p className="font-medium">{service.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">{service.duration}</p>
                  </div>
                  <span className="font-medium">RD$ {service.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          {products.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Productos</h3>
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {product.quantity} x RD$ {product.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-medium">
                      RD$ {(product.price * product.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff */}
          <div>
            <h3 className="font-medium mb-3">Personal que Atendió</h3>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <img
                src={stylist.image}
                alt={stylist.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{stylist.name}</p>
                <p className="text-sm text-gray-500">{stylist.role}</p>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal Servicios</span>
              <span>RD$ {servicesTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal Productos</span>
              <span>RD$ {productsTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ITBIS (18%)</span>
              <span>RD$ {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span>RD$ {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t">
            <div className="text-center">
              <div className="h-24 border-b border-dashed"></div>
              <p className="mt-2 text-sm text-gray-500">Firma del Cliente</p>
            </div>
            <div className="text-center">
              <div className="h-24 border-b border-dashed"></div>
              <p className="mt-2 text-sm text-gray-500">Firma del Estilista</p>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-gray-500">
            <p>Gracias por su preferencia</p>
            <p>Este documento es un comprobante de servicio y no tiene validez fiscal</p>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};