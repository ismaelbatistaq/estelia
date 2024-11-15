import React from 'react';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { useBusinessData } from '../../hooks/useBusinessData';


interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string | null;
  price: number;
  stock: number;
  min_stock: number;
  status: string | null;
  image_url: string | null;
}

interface ProductsListProps {
  searchQuery: string;
}

export const ProductsList = ({ searchQuery }: ProductsListProps) => {
  const { data: products, loading, error } = useBusinessData<Product>('products');

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
        <p className="text-red-600">Error loading products. Please try again later.</p>
      </div>
    );
  }

  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <div key={product.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-square relative">
            <img
              src={product.image_url || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stock <= product.min_stock && (
              <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Bajo Stock
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-semibold">
                RD$ {product.price}
              </span>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
