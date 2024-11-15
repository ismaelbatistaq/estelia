import React, { useState } from 'react';
import { X } from 'lucide-react';

interface StartServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  client: any;
  services: any[];
  selectedStylist: any;
  workstations: any[];
}

export const StartServiceModal = ({
  isOpen,
  onClose,
  onConfirm,
  client,
  services,
  selectedStylist,
  workstations,
}: StartServiceModalProps) => {
  const [selectedStation, setSelectedStation] = useState('');
  const [confirmedStylist, setConfirmedStylist] = useState(selectedStylist?.id || '');

  if (!isOpen) return null;

  const availableStations = workstations.filter(station => station.status === 'available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      stationId: selectedStation,
      stylistId: confirmedStylist,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Iniciar Servicio</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-medium mb-2">Cliente</h3>
            <p className="text-gray-600">{client.name}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Servicios</h3>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id} className="text-gray-600">
                  {service.name} - {service.duration}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Estación de Trabajo
            </label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seleccionar estación</option>
              {availableStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Confirmar Estilista
            </label>
            <select
              value={confirmedStylist}
              onChange={(e) => setConfirmedStylist(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seleccionar estilista</option>
              {/* Add your stylists options here */}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Iniciar Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};