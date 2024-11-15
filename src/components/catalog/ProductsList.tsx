import React from 'react';
import { Edit, Trash2, AlertCircle, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  image_url: string | null;
  status: 'active' | 'inactive';
  category: {
    name: string;
  } | null;
}

interface ProductsListProps {
  searchQuery: string;
  products: Product[];
}

export const ProductsList = ({ searchQuery, products }: ProductsListProps) => {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <div key={product.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
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
            {product.stock <= 5 && (
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
                RD$ {product.price.toLocaleString()}
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