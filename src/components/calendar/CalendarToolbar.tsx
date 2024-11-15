import React from 'react';
import { NavigateAction } from 'react-big-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ToolbarProps {
  date: Date;
  view: string;
  views: string[];
  label: string;
  onNavigate: (action: NavigateAction) => void;
  onView: (view: string) => void;
}

export const CalendarToolbar = ({ date, view, views, label, onNavigate, onView }: ToolbarProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          Hoy
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('PREV')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-lg font-semibold">{label}</h2>
      </div>

      <div className="flex gap-2">
        {views.map((name) => (
          <button
            key={name}
            onClick={() => onView(name)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === name
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {name === 'month' ? 'Mes' : name === 'week' ? 'Semana' : 'Día'}
          </button>
        ))}
      </div>
    </div>
  );
};