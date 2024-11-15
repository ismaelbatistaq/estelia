import React from 'react';
import { X } from 'lucide-react';

interface CustomerFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerFilters = ({ isOpen, onClose }: CustomerFiltersProps) => {
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
            {/* Status */}
            <div>
              <h3 className="font-medium mb-3">Estado</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Activos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Inactivos</span>
                </label>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <h3 className="font-medium mb-3">Frecuencia de Visita</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Frecuentes (más de 2 visitas/mes)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Regulares (1-2 visitas/mes)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Ocasionales (menos de 1 visita/mes)</span>
                </label>
              </div>
            </div>

            {/* Last Visit */}
            <div>
              <h3 className="font-medium mb-3">Última Visita</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Última semana</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Último mes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Últimos 3 meses</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Más de 3 meses</span>
                </label>
              </div>
            </div>

            {/* Customer Type */}
            <div>
              <h3 className="font-medium mb-3">Tipo de Cliente</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>Nuevos (último mes)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span>VIP (más de RD$ 10,000 gastados)</span>
                </label>
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