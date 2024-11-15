import React, { useState } from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';
import { CustomerList } from '../components/customers/CustomerList';
import { CustomerFilters } from '../components/customers/CustomerFilters';
import { CustomerProfile } from '../components/customers/CustomerProfile';
import { AddCustomerModal } from '../components/customers/AddCustomerModal';
import { useSupabase } from '../hooks/useSupabase';
import { useBusiness } from '../hooks/useBusiness';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  preferences: any;
  status: 'active' | 'inactive';
  created_at: string;
  appointments: Array<{
    created_at: string;
  }>;
  sales: Array<{
    total: number;
  }>;
}

export const Customers = () => {
  const { business } = useBusiness();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: customers, isLoading, error } = useSupabase<Customer>(
    'clients',
    {
      select: `
        *,
        appointments (
          created_at
        ),
        sales (
          total
        )
      `,
      filters: {
        business_id: business?.id
      }
    },
    [business?.id]
  );

  // Process the data to calculate metrics
  const processedCustomers = customers?.map(customer => ({
    ...customer,
    last_visit: customer.appointments?.length > 0 
      ? customer.appointments.reduce((latest, apt) => 
          latest > apt.created_at ? latest : apt.created_at, 
          customer.appointments[0].created_at
        )
      : null,
    total_visits: customer.appointments?.length || 0,
    total_spent: customer.sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading customers. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Clientes</h1>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                <span>Exportar</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Cliente</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar por nombre, teléfono o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Customer List */}
          <CustomerList
            customers={processedCustomers || []}
            searchQuery={searchQuery}
            onSelectCustomer={setSelectedCustomer}
          />
        </div>
      </div>

      {/* Customer Profile Sidebar */}
      {selectedCustomer && (
        <CustomerProfile
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* Filters Sidebar */}
      <CustomerFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};