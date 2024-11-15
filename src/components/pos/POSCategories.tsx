import React from 'react';
import { Scissors, Package, Star } from 'lucide-react';

interface POSCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const POSCategories = ({ selectedCategory, onSelectCategory }: POSCategoriesProps) => {
  const categories = [
    { id: 'all', name: 'Todo', icon: Star },
    { id: 'services', name: 'Servicios', icon: Scissors },
    { id: 'products', name: 'Productos', icon: Package },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
              ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};