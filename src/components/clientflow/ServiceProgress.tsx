import React, { useState } from 'react';
import { Clock, User, Scissors, Pause, Check, Play } from 'lucide-react';
import { ServiceCompletionModal } from './ServiceCompletionModal';

export const ServiceProgress = () => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const activeServices = [
    {
      id: 1,
      client: {
        name: 'María Pérez',
        email: 'maria@email.com',
        phone: '809-555-0101',
      },
      service: 'Corte y Peinado',
      stylist: {
        name: 'Ana Gómez',
        role: 'Estilista Senior',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      startTime: new Date('2024-01-20T10:30:00'),
      duration: '45 min',
      progress: 65,
      status: 'in_progress',
      services: [
        {
          id: 1,
          name: 'Corte y Peinado',
          duration: '45 min',
          price: 800,
        },
      ],
      products: [
        {
          id: 1,
          name: 'Shampoo Premium',
          price: 450,
          quantity: 1,
        },
      ],
    },
    // Add more active services as needed
  ];

  const handleComplete = (service: any) => {
    setSelectedService(service);
    setShowCompletionModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeServices.map((service) => (
          <div
            key={service.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">{service.client.name}</h3>
                  <p className="text-sm text-gray-500">{service.service}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full
                  ${service.status === 'in_progress'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-yellow-50 text-yellow-600'
                  }`}
              >
                {service.status === 'in_progress' ? 'En Progreso' : 'Pausado'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{service.stylist.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Inicio: {service.startTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progreso</span>
                  <span className="font-medium">{service.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${service.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between">
              <div className="text-sm text-gray-500">
                Duración estimada: {service.duration}
              </div>
              <div className="flex gap-2">
                {service.status === 'in_progress' ? (
                  <>
                    <button className="flex items-center gap-1 px-3 py-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors">
                      <Pause className="w-4 h-4" />
                      <span>Pausar</span>
                    </button>
                    <button
                      onClick={() => handleComplete(service)}
                      className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Completar</span>
                    </button>
                  </>
                ) : (
                  <button className="flex items-center gap-1 px-3 py-1 text-purple-600 hover:bg-purple-50 rounded transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Reanudar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <ServiceCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          serviceData={{
            ...selectedService,
            endTime: new Date(),
            waitTime: 15,
            serviceTime: 45,
          }}
        />
      )}
    </div>
  );
};