import React from 'react';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { useBusinessData } from '../../hooks/useBusinessData';
interface Service {
  id: string;
  name: string;
  category_id: string | null;
  description: string | null;
  price: number;
  duration: number;
  image_url: string | null;
  status: string | null;
}

interface ServicesListProps {
  searchQuery: string;
}

export const ServicesList = ({ searchQuery }: ServicesListProps) => {
  const { data: services, loading, error } = useBusinessData<Service>('services');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading services. Please try again later.</p>
      </div>
    );
  }

  const filteredServices = (services || []).filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredServices.map((service) => (
        <div key={service.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-video relative">
            <img
              src={service.image_url || 'https://via.placeholder.com/300'}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{service.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{service.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Clock className="w-4 h-4" />
              <span>{service.duration} minutos</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-semibold">
                RD$ {service.price}
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
