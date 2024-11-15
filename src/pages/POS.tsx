import React, { useState } from 'react';
import { Search, ShoppingCart, X, User } from 'lucide-react';
import { POSCategories } from '../components/pos/POSCategories';
import { POSProducts } from '../components/pos/POSProducts';
import { POSCart } from '../components/pos/POSCart';
import { POSPaymentModal } from '../components/pos/POSPaymentModal';
import { POSInvoiceModal } from '../components/pos/POSInvoiceModal';
import { POSClientModal } from '../components/pos/POSClientModal';

export const POS = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleAddToCart = (item: any) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveFromCart(itemId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handlePayment = () => {
    if (!selectedClient) {
      setShowClientModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setShowClientModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setShowInvoiceModal(true);
  };

  const handleInvoiceComplete = () => {
    setShowInvoiceModal(false);
    setCart([]);
    setSelectedClient(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 pt-16">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Left Side - Products */}
        <div className="flex-1 flex flex-col h-full">
          {/* Search and Categories */}
          <div className="p-4 bg-white shadow-sm">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar productos o servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <POSCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <POSProducts
              searchQuery={searchQuery}
              category={selectedCategory}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Right Side - Cart */}
        <div className="w-96 bg-white shadow-lg flex flex-col">
          <POSCart
            items={cart}
            client={selectedClient}
            onSelectClient={() => setShowClientModal(true)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handlePayment}
          />
        </div>
      </div>

      {/* Client Selection Modal */}
      <POSClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSelect={handleClientSelect}
      />

      {/* Payment Modal */}
      <POSPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onComplete={handlePaymentComplete}
        total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      />

      {/* Invoice Modal */}
      <POSInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onComplete={handleInvoiceComplete}
        items={cart}
        client={selectedClient}
      />
    </div>
  );
};