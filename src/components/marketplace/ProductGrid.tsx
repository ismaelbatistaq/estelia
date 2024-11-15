import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductGridProps {
  searchQuery: string;
  category: string;
  onAddToCart: (product: any) => void;
}

export const ProductGrid = ({ searchQuery, category, onAddToCart }: ProductGridProps) => {
  const products = [
    {
      id: 1,
      name: 'Secador Profesional',
      category: 'equipment',
      price: 4500,
      rating: 4.5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500',
      description: 'Secador profesional de alto rendimiento',
    },
    {
      id: 2,
      name: 'Kit de Tintes Premium',
      category: 'hair',
      price: 2800,
      rating: 4.8,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500',
      description: 'Kit completo de tintes profesionales',
    },
    // Add more products
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-square relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-gray-500">
                ({product.reviews} reseñas)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                RD$ {product.price.toLocaleString()}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};