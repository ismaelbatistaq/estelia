import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, ChevronRight } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { CategoryModal } from './CategoryModal';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parent_id: string | null;
  status: 'active' | 'inactive';
}

export const MarketplaceCategories = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories, isLoading, error } = useSupabase<Category>(
    'marketplace_categories',
    {
      select: '*'
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
        <p className="text-red-600">Error loading categories</p>
      </div>
    );
  }

  const rootCategories = categories?.filter(cat => !cat.parent_id) || [];
  const subCategories = categories?.filter(cat => cat.parent_id) || [];

  const getSubcategories = (parentId: string) => {
    return subCategories.filter(cat => cat.parent_id === parentId);
  };

  const filteredCategories = rootCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketplace Categories</h1>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Slug: {category.slug}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${category.status === 'active'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-50 text-gray-600'
                    }`}
                >
                  {category.status}
                </span>
              </div>
            </div>

            {/* Subcategories */}
            <div className="border-t">
              {getSubcategories(category.id).map((subcat) => (
                <div
                  key={subcat.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{subcat.name}</h4>
                    <p className="text-sm text-gray-500">{subcat.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory(subcat);
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        parentCategories={rootCategories}
      />
    </div>
  );
};