import React from 'react';
import { Plus, Download, Calendar } from 'lucide-react';

export const PersonnelManagement = () => {
  const employees = [
    {
      id: 1,
      name: 'Ana Gómez',
      role: 'Estilista Senior',
      schedule: 'Lunes a Viernes',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      id: 2,
      name: 'Carmen Santos',
      role: 'Estilista',
      schedule: 'Martes a Sábado',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestión de Personal</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Horarios</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Nuevo Empleado</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={employee.image}
                alt={employee.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{employee.name}</h3>
                <p className="text-sm text-gray-500">{employee.role}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Horario</span>
                <span>{employee.schedule}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estado</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full
                    ${employee.status === 'active'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-50 text-gray-600'
                    }`}
                >
                  {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Editar
              </button>
              <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors">
                Ver Perfil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};