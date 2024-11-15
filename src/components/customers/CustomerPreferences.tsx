import React from 'react';
import { Heart, AlertCircle, Scissors } from 'lucide-react';

interface CustomerPreferencesProps {
  customerId: number;
}

export const CustomerPreferences = ({ customerId }: CustomerPreferencesProps) => {
  const preferences = {
    preferredStylist: 'Ana Gómez',
    favoriteServices: ['Corte y Peinado', 'Tinte'],
    allergies: 'Ninguna registrada',
    specialNotes: 'Prefiere productos sin sulfatos',
    preferredDays: ['Sábados', 'Domingos'],
    preferredTimes: 'Mañanas',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-500 mb-3">Preferencias Generales</h3>
        <div className="grid gap-4">
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <Heart className="w-4 h-4 text-red-500" />
            <div>
              <p className="font-medium">Estilista Preferido</p>
              <p className="text-sm text-gray-500">
                {preferences.preferredStylist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="font-medium">Alergias/Sensibilidades</p>
              <p className="text-sm text-gray-500">{preferences.allergies}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-500 mb-3">Servicios Favoritos</h3>
        <div className="space-y-2">
          {preferences.favoriteServices.map((service, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg"
            >
              <Scissors className="w-4 h-4 text-purple-500" />
              <span>{service}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-500 mb-3">Horarios Preferidos</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Días:</span>{' '}
              {preferences.preferredDays.join(', ')}
            </p>
            <p className="text-sm">
              <span className="font-medium">Horario:</span>{' '}
              {preferences.preferredTimes}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-500 mb-3">Notas Especiales</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm">{preferences.specialNotes}</p>
        </div>
      </div>
    </div>
  );
};