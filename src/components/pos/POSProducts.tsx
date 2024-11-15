import React from 'react';
import { Plus } from 'lucide-react';

interface POSProductsProps {
  searchQuery: string;
  category: string;
  onAddToCart: (item: any) => void;
}

export const POSProducts = ({ searchQuery, category, onAddToCart }: POSProductsProps) => {
  const products = [
    {
      id: 1,
      name: 'Corte y Peinado',
      price: 800,
      category: 'services',
      image: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=300',
    },
    {
      id: 2,
      name: 'Tinte',
      price: 2500,
      category: 'services',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300',
    },
    {
      id: 3,
      name: 'Shampoo Premium',
      price: 450,
      category: 'products',
      image: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=300',
    },
    // Add more products as needed
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddToCart(product)}
          className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="aspect-square rounded-lg overflow-hidden mb-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-medium mb-1">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-purple-600 font-semibold">
              RD$ {product.price}
            </span>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Plus className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};