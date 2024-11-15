import React, { useState } from 'react';
import { Search, ShoppingCart, Filter, Package, ShoppingBag } from 'lucide-react';
import { CartDrawer } from '../components/marketplace/CartDrawer';
import { CategoryNav } from '../components/marketplace/CategoryNav';
import { ProductFilters } from '../components/marketplace/ProductFilters';
import { useSupabase } from '../hooks/useSupabase';
import { useBusiness } from '../hooks/useBusiness';
import { MarketplaceOrders } from '../components/marketplace/MarketplaceOrders';

interface MarketplaceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  image_url: string;
  status: 'active' | 'inactive';
}

export const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const { business } = useBusiness();

  const { data: products, isLoading, error } = useSupabase<MarketplaceProduct>(
    'marketplace_products',
    {
      select: '*',
      filters: {
        status: 'active'
      }
    }
  );

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
        <p className="text-red-600">Error loading marketplace products</p>
      </div>
    );
  }

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setShowCart(true);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Tabs */}
      <div className="w-48 bg-white border-r p-4">
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors
              ${activeTab === 'products'
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Package className="w-5 h-5" />
            <span>Products</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors
              ${activeTab === 'orders'
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>My Orders</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'products' ? (
          <div className="p-6 space-y-6">
            {/* Products Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search products..."
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
                <span>Filters</span>
              </button>
            </div>

            {/* Categories */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-600 font-semibold">
                        RD$ {product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-sm text-gray-500">{product.brand}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <MarketplaceOrders />
        )}
      </div>

      {/* Filters Sidebar */}
      <ProductFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onUpdateCart={setCartItems}
      />
    </div>
  );
};