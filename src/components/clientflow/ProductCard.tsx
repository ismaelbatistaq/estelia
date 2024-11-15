import React from 'react';
import { CheckCircle, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  isSelected: boolean;
  quantity: number;
  onSelect: (product: any) => void;
  onUpdateQuantity: (quantity: number) => void;
}

export const ProductCard = ({ 
  product, 
  isSelected, 
  quantity,
  onSelect,
  onUpdateQuantity 
}: ProductCardProps) => {
  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all
        ${isSelected ? 'ring-2 ring-purple-600 border-transparent' : ''}`}
    >
      <div className="aspect-video relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white p-2 rounded-full">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-medium text-purple-600">
            RD$ {product.price}
          </span>
          {isSelected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(Math.max(0, quantity - 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSelect(product)}
              className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};