import React from 'react';

interface StylistCardProps {
  stylist: {
    id: number;
    name: string;
    role: string;
    available: boolean;
    image: string;
  };
  isSelected: boolean;
  onSelect: (stylist: any) => void;
}

export const StylistCard = ({ stylist, isSelected, onSelect }: StylistCardProps) => {
  return (
    <div
      onClick={() => onSelect(stylist)}
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer
        ${isSelected ? 'ring-2 ring-purple-600 border-transparent' : ''}`}
    >
      <div className="flex items-center gap-4">
        <img
          src={stylist.image}
          alt={stylist.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium">{stylist.name}</h3>
          <p className="text-sm text-gray-500">{stylist.role}</p>
          <span
            className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full
              ${stylist.available
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-50 text-gray-600'
              }`}
          >
            {stylist.available ? 'Disponible' : 'Ocupado'}
          </span>
        </div>
      </div>
    </div>
  );
};