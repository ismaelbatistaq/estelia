import React from 'react';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductFilters = ({ isOpen, onClose }: ProductFiltersProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg z-50">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-3">Precio</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Menos de RD$ 1,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>RD$ 1,000 - RD$ 5,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>RD$ 5,000 - RD$ 10,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Más de RD$ 10,000</span>
                </div>
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-medium mb-3">Marcas</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>L'Oréal</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Wella</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Revlon</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Schwarzkopf</span>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="font-medium mb-3">Calificación</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>4 estrellas o más</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>3 estrellas o más</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>2 estrellas o más</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};