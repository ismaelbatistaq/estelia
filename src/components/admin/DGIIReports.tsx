import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

export const DGIIReports = () => {
  const reports = [
    {
      id: 1,
      name: 'Formato 606',
      description: 'Compras de Bienes y Servicios',
      period: 'Enero 2024',
      dueDate: '2024-02-15',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Formato 607',
      description: 'Ventas de Bienes y Servicios',
      period: 'Enero 2024',
      dueDate: '2024-02-15',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Reportes DGII</h2>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 bg-gray-50 border rounded-lg text-sm">
            <option>Enero 2024</option>
            <option>Febrero 2024</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Generar Reportes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-gray-500">
                      {report.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full
                      ${report.status === 'completed'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-yellow-50 text-yellow-600'
                      }`}
                  >
                    {report.status === 'completed'
                      ? 'Completado'
                      : 'Pendiente'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Período</span>
                    <span>{report.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha Límite</span>
                    <span>{report.dueDate}</span>
                  </div>
                </div>

                <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Descargar Reporte</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};