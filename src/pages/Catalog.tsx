import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { CatalogTabs } from '../components/catalog/CatalogTabs';
import { ProductsList } from '../components/catalog/ProductsList';
import { ServicesList } from '../components/catalog/ServicesList';
import { InventoryList } from '../components/catalog/InventoryList';
import { SuppliersList } from '../components/catalog/SuppliersList';
import { AddItemModal } from '../components/catalog/AddItemModal';
import { useBusinessData } from '../hooks/useBusinessData';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  image_url: string;
}

export function Catalog() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, loading: productsLoading, error: productsError } = 
    useBusinessData<Product>('products');
  const { data: services, loading: servicesLoading, error: servicesError } = 
    useBusinessData<Service>('services');

  const loading = productsLoading || servicesLoading;
  const error = productsError || servicesError;

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
        <p className="text-red-600">Error loading catalog data. Please try again later.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsList searchQuery={searchQuery} products={products} />;
      case 'services':
        return <ServicesList searchQuery={searchQuery} services={services} />;
      case 'inventory':
        return <InventoryList searchQuery={searchQuery} products={products} />;
      case 'suppliers':
        return <SuppliersList searchQuery={searchQuery} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catálogo</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar {activeTab === 'products' ? 'Producto' : activeTab === 'services' ? 'Servicio' : activeTab === 'suppliers' ? 'Proveedor' : 'Item'}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <CatalogTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar..."
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

          {renderTabContent()}
        </div>
      </div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        type={activeTab}
      />
    </div>
  );
}