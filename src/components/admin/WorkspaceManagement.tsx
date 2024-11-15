import React from 'react';
import { Plus, Layout } from 'lucide-react';

export const WorkspaceManagement = () => {
  const workstations = [
    {
      id: 1,
      name: 'Estación 1',
      type: 'Corte y Peinado',
      assignedTo: 'Ana Gómez',
      status: 'occupied',
    },
    {
      id: 2,
      name: 'Estación 2',
      type: 'Corte y Peinado',
      assignedTo: 'Carmen Santos',
      status: 'occupied',
    },
    {
      id: 3,
      name: 'Estación 3',
      type: 'Manicure',
      assignedTo: null,
      status: 'available',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestión de Espacios</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Nueva Estación</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workstations.map((station) => (
          <div
            key={station.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Layout className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">{station.name}</h3>
                  <p className="text-sm text-gray-500">{station.type}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full
                  ${station.status === 'available'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-yellow-50 text-yellow-600'
                  }`}
              >
                {station.status === 'available'
                  ? 'Disponible'
                  : 'Ocupado'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Asignado a</span>
                <span className="font-medium">
                  {station.assignedTo || 'Sin asignar'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Editar
              </button>
              <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors">
                {station.status === 'available' ? 'Asignar' : 'Liberar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};