import React from 'react';
import { Bell, Mail, Phone, Tag } from 'lucide-react';

interface MarketingPreferencesProps {
  customerId: number;
}

export const MarketingPreferences = ({ customerId }: MarketingPreferencesProps) => {
  const preferences = {
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true,
    promotions: true,
    activePromotions: [
      {
        id: 1,
        name: '20% en Tintes',
        validUntil: '2024-02-28',
        type: 'discount',
      },
      {
        id: 2,
        name: 'Tratamiento Gratis',
        validUntil: '2024-02-15',
        type: 'gift',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-500 mb-3">Preferencias de Contacto</h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>Notificaciones por Email</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              className="rounded text-purple-600"
              onChange={() => {}}
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>Notificaciones por SMS</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.smsNotifications}
              className="rounded text-purple-600"
              onChange={() => {}}
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-400" />
              <span>Recordatorios de Citas</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.whatsappNotifications}
              className="rounded text-purple-600"
              onChange={() => {}}
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-500 mb-3">Promociones Activas</h3>
        <div className="space-y-2">
          {preferences.activePromotions.map((promo) => (
            <div
              key={promo.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="font-medium">{promo.name}</p>
                  <p className="text-sm text-gray-500">
                    Válido hasta: {promo.validUntil}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full
                  ${promo.type === 'discount'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-purple-50 text-purple-600'
                  }`}
              >
                {promo.type === 'discount' ? 'Descuento' : 'Regalo'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-500 mb-3">Configuración de Privacidad</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Sus datos personales están protegidos y solo se utilizan para mejorar su
            experiencia en nuestro salón. Puede actualizar sus preferencias de
            privacidad en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
};