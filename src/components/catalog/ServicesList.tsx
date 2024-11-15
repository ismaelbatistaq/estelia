import React from 'react';
import { Clock, Edit, Trash2, Scissors } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image_url: string | null;
  status: 'active' | 'inactive';
  category: {
    name: string;
  } | null;
}

interface ServicesListProps {
  searchQuery: string;
  services: Service[];
}

export const ServicesList = ({ searchQuery, services }: ServicesListProps) => {
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredServices.map((service) => (
        <div key={service.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-video relative">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Scissors className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{service.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{service.category?.name || 'Sin categoría'}</p>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Clock className="w-4 h-4" />
              <span>{service.duration} minutos</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-semibold">
                RD$ {service.price.toLocaleString()}
              </span>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};