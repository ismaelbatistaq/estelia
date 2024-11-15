import React from 'react';
import { Users, Clock, Filter } from 'lucide-react';

export const CalendarSidebar = () => {
  const stylists = [
    { id: 1, name: 'Ana Gómez', color: '#7C3AED' },
    { id: 2, name: 'Carmen Santos', color: '#EC4899' },
    { id: 3, name: 'Luis Medina', color: '#3B82F6' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold">Estilistas</h3>
        </div>
        <div className="space-y-2">
          {stylists.map((stylist) => (
            <label key={stylist.id} className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-purple-600" defaultChecked />
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stylist.color }}
              />
              <span className="text-sm">{stylist.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold">Horario</h3>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-purple-600" defaultChecked />
            <span className="text-sm">Mañana (8:00 - 12:00)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-purple-600" defaultChecked />
            <span className="text-sm">Tarde (12:00 - 17:00)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-purple-600" defaultChecked />
            <span className="text-sm">Noche (17:00 - 21:00)</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold">Servicios</h3>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-purple-600" defaultChecked />
            <span className="text-sm">Corte y Peinado</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-purple-600" defaultChecked />
            <span className="text-sm">Tinte</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-purple-600" defaultChecked />
            <span className="text-sm">Manicure</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-purple-600" defaultChecked />
            <span className="text-sm">Pedicure</span>
          </label>
        </div>
      </div>
    </div>
  );
};