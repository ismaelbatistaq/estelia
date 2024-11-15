import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    duration: string;
    price: number;
    image: string;
  };
  isSelected: boolean;
  onSelect: (service: any) => void;
}

export const ServiceCard = ({ service, isSelected, onSelect }: ServiceCardProps) => {
  return (
    <div
      onClick={() => onSelect(service)}
      className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer
        ${isSelected ? 'ring-2 ring-purple-600 border-transparent' : ''}`}
    >
      <div className="aspect-video relative">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-purple-600 bg-opacity-10 flex items-center justify-center">
            <div className="bg-purple-600 text-white p-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-2">{service.name}</h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{service.duration}</span>
          </div>
          <span className="font-medium text-purple-600">
            RD$ {service.price}
          </span>
        </div>
      </div>
    </div>
  );
};