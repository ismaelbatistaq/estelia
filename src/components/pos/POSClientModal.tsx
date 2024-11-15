import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';

interface POSClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (client: any) => void;
}

export const POSClientModal = ({ isOpen, onClose, onSelect }: POSClientModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  
  const clients = [
    { id: 1, name: 'María Pérez', email: 'maria@email.com', phone: '809-555-0101' },
    { id: 2, name: 'Juan Rodríguez', email: 'juan@email.com', phone: '809-555-0102' },
    { id: 3, name: 'Ana García', email: 'ana@email.com', phone: '809-555-0103' },
  ];

  if (!isOpen) return null;

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Seleccionar Cliente</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setShowNewClientForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Cliente</span>
            </button>
          </div>

          <div className="space-y-2">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => onSelect(client)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-medium">
                    {client.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
                <div className="text-sm text-gray-500">{client.phone}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};