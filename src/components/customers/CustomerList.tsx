import React from 'react';
import { User, Calendar, Package, Star } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  status: string;
  image_url: string;
}

interface CustomerListProps {
  customers: Customer[]; // Aseguramos que siempre sea un array
  searchQuery: string;
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerList = ({
  searchQuery,
  customers,
  onSelectCustomer,
}: CustomerListProps) => {
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredCustomers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => onSelectCustomer(customer)}
          className="bg-white border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={customer.image_url}
              alt={customer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{customer.name}</h3>
              <p className="text-sm text-gray-500">{customer.phone}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Última visita: {customer.lastVisit}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {customer.totalVisits} visitas
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">
                RD$ {customer.totalSpent.toLocaleString()}
              </span>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                customer.status === 'active'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-50 text-gray-600'
              }`}
            >
              {customer.status === 'active' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
