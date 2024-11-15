import React from 'react';
import { User, Calendar, Package, Star } from 'lucide-react';
import { format } from 'date-fns';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  preferences: any;
  status: 'active' | 'inactive';
  last_visit: string | null;
  total_visits: number;
  total_spent: number;
}

interface CustomerListProps {
  searchQuery: string;
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerList = ({ searchQuery, customers, onSelectCustomer }: CustomerListProps) => {
  const filteredCustomers = customers.filter((customer) =>
    `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery) || false
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
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-purple-600">
                {customer.first_name.charAt(0)}
                {customer.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{customer.first_name} {customer.last_name}</h3>
              <p className="text-sm text-gray-500">{customer.phone}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Última visita: {customer.last_visit ? format(new Date(customer.last_visit), 'dd/MM/yyyy') : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {customer.total_visits} visitas
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">
                RD$ {customer.total_spent.toLocaleString()}
              </span>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full
                ${customer.status === 'active'
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