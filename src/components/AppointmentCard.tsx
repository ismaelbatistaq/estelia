import React from 'react';
import { Calendar } from 'lucide-react';

interface AppointmentCardProps {
  time: string;
  client: string;
  service: string;
  stylist: string;
}

export const AppointmentCard = ({ time, client, service, stylist }: AppointmentCardProps) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-medium">{client}</p>
            <p className="text-sm text-gray-500">{service}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">{time}</p>
          <p className="text-sm text-gray-500">{stylist}</p>
        </div>
      </div>
    </div>
  );
};