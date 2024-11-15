import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { ProductCard } from './ProductCard';
import { StylistCard } from './StylistCard';
import { SelectionSummary } from './SelectionSummary';
import { ServiceSummaryModal } from './ServiceSummaryModal';

interface ClientCheckInProps {
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
    image_url: string | null;
  }>;
  products: Array<{
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  }>;
  stylists: Array<{
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    avatar_url: string | null;
  }>;
}

export const ClientCheckIn = ({ services, products, stylists }: ClientCheckInProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);

  const toggleService = (service: any) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const toggleProduct = (product: any) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map(p =>
        p.id === productId ? { ...p, quantity } : p
      )
    );
  };

  const handleConfirmCheckIn = () => {
    if ((selectedServices.length === 0 && selectedProducts.length === 0) || !selectedStylist) {
      return;
    }
    setShowSummary(true);
  };

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0) +
    selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Search and New Client Button */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar cliente por nombre, teléfono o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={() => setShowNewClientForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Services Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Servicios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={{
                    ...service,
                    duration: `${service.duration} min`,
                    image: service.image_url || 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=300'
                  }}
                  isSelected={selectedServices.some(s => s.id === service.id)}
                  onSelect={() => toggleService(service)}
                />
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Productos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    image: product.image_url || 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=300'
                  }}
                  isSelected={selectedProducts.some(p => p.id === product.id)}
                  quantity={selectedProducts.find(p => p.id === product.id)?.quantity || 0}
                  onSelect={() => toggleProduct(product)}
                  onUpdateQuantity={(quantity) => updateProductQuantity(product.id, quantity)}
                />
              ))}
            </div>
          </div>

          {/* Stylists Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Estilistas Disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stylists.map((stylist) => (
                <StylistCard
                  key={stylist.id}
                  stylist={{
                    ...stylist,
                    name: `${stylist.first_name} ${stylist.last_name}`,
                    available: true,
                    image: stylist.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
                  }}
                  isSelected={selectedStylist?.id === stylist.id}
                  onSelect={() => setSelectedStylist(stylist)}
                />
              ))}
            </div>
          </div>
        </div>

        <SelectionSummary
          selectedServices={selectedServices}
          selectedProducts={selectedProducts}
          toggleService={toggleService}
          toggleProduct={toggleProduct}
          updateProductQuantity={updateProductQuantity}
          total={total}
          onConfirm={handleConfirmCheckIn}
          disableConfirm={!selectedStylist}
        />
      </div>

      <ServiceSummaryModal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        services={selectedServices}
        products={selectedProducts}
        stylist={selectedStylist}
        total={total}
      />
    </div>
  );
};