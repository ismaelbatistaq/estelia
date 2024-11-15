import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface ServiceHistoryProps {
  customerId: number;
}

export const ServiceHistory = ({ customerId }: ServiceHistoryProps) => {
  const services = [
    {
      id: 1,
      date: '2024-01-20',
      service: 'Corte y Peinado',
      stylist: 'Ana Gómez',
      duration: '45 min',
      price: 800,
      notes: 'Cliente satisfecho con el resultado',
    },
    {
      id: 2,
      date: '2024-01-05',
      service: 'Tinte',
      stylist: 'Carmen Santos',
      duration: '120 min',
      price: 2500,
      notes: 'Color personalizado',
    },
  ];

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">{service.service}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{service.date}</span>
              </div>
            </div>
            <span className="font-medium">RD$ {service.price}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span>{service.stylist}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{service.duration}</span>
            </div>
          </div>

          {service.notes && (
            <p className="mt-2 text-sm text-gray-500">{service.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
};