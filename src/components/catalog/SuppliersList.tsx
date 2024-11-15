import React from 'react';
import { Phone, Mail, Edit, Trash2, Star } from 'lucide-react';

interface SuppliersListProps {
  searchQuery: string;
}

export const SuppliersList = ({ searchQuery }: SuppliersListProps) => {
  const suppliers = [
    {
      id: 1,
      name: 'Distribuidora Belleza Pro',
      contact: 'Juan Pérez',
      email: 'juan@bellezapro.com',
      phone: '809-555-0101',
      rating: 4.5,
      activeOrders: 2,
      status: 'active',
    },
    {
      id: 2,
      name: 'Cosméticos del Caribe',
      contact: 'María Rodríguez',
      email: 'maria@cosmeticoscaribe.com',
      phone: '809-555-0102',
      rating: 4.0,
      activeOrders: 1,
      status: 'active',
    },
    // Add more suppliers as needed
  ];

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredSuppliers.map((supplier) => (
        <div key={supplier.id} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-lg">{supplier.name}</h3>
              <p className="text-sm text-gray-500">{supplier.contact}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{supplier.rating}</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{supplier.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{supplier.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-sm text-purple-600 font-medium">
                {supplier.activeOrders} órdenes activas
              </span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};