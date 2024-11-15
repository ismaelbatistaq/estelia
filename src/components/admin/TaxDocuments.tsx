import React from 'react';
import { Plus, Download } from 'lucide-react';

export const TaxDocuments = () => {
  const documents = [
    {
      id: 1,
      type: 'B01',
      sequence: '0001-0100',
      used: 45,
      available: 55,
      expiryDate: '2024-12-31',
      status: 'active',
    },
    {
      id: 2,
      type: 'B02',
      sequence: '0001-0050',
      used: 48,
      available: 2,
      expiryDate: '2024-12-31',
      status: 'low',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Comprobantes Fiscales</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Nueva Secuencia</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Tipo {doc.type}</h3>
                <p className="text-sm text-gray-500">
                  Secuencia: {doc.sequence}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full
                  ${doc.status === 'active'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                  }`}
              >
                {doc.status === 'active' ? 'Activo' : 'Bajo'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Utilizados</span>
                <span className="font-medium">{doc.used}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Disponibles</span>
                <span className="font-medium">{doc.available}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fecha de Vencimiento</span>
                <span className="font-medium">{doc.expiryDate}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    doc.available < 10 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{
                    width: `${(doc.used / (doc.used + doc.available)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};