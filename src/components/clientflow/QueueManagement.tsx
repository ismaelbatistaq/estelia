import React from 'react';
import { Clock, User, Scissors } from 'lucide-react';

export const QueueManagement = () => {
  const queueItems = [
    {
      id: 1,
      client: 'María Pérez',
      service: 'Corte y Peinado',
      stylist: 'Ana Gómez',
      waitTime: '15 min',
      status: 'waiting',
    },
    {
      id: 2,
      client: 'Laura Díaz',
      service: 'Tinte',
      stylist: 'Carmen Santos',
      waitTime: '5 min',
      status: 'next',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {queueItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">{item.client}</h3>
                  <p className="text-sm text-gray-500">{item.service}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full
                  ${item.status === 'next'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-yellow-50 text-yellow-600'
                  }`}
              >
                {item.status === 'next' ? 'Siguiente' : 'En Espera'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Scissors className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{item.stylist}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Tiempo de espera: {item.waitTime}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Reasignar
              </button>
              <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors">
                Iniciar Servicio
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};