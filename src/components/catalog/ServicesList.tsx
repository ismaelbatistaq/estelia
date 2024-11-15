import React from 'react';
import { Clock, Edit, Trash2 } from 'lucide-react';

interface ServicesListProps {
  searchQuery: string;
}

export const ServicesList = ({ searchQuery }: ServicesListProps) => {
  const services = [
    {
      id: 1,
      name: 'Corte y Peinado',
      category: 'Cabello',
      price: 800,
      duration: 60,
      description: 'Corte de cabello profesional y peinado',
      image: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=300',
    },
    {
      id: 2,
      name: 'Tinte',
      category: 'Cabello',
      price: 2500,
      duration: 120,
      description: 'Tinte profesional con productos de alta calidad',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300',
    },
    // Add more services as needed
  ];

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredServices.map((service) => (
        <div key={service.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-video relative">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{service.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{service.category}</p>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
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