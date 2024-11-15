import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useBusiness } from '../../hooks/useBusiness';
import { supabase } from '../../lib/supabase';

export const GeneralSettings = () => {
  const { business } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: business?.name || '',
    email: business?.settings?.email || '',
    phone: business?.settings?.phone || '',
    address: business?.settings?.address || '',
    schedule: business?.settings?.schedule || {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: null, close: null },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { error } = await supabase
        .from('businesses')
        .update({
          name: formData.name,
          settings: {
            ...business?.settings,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            schedule: formData.schedule,
          },
        })
        .eq('id', business?.id);

      if (error) throw error;

      // Show success message
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.id} className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm font-medium text-gray-700">{day.label}</div>
              <div>
                <input
                  type="time"
                  value={formData.schedule[day.id]?.open || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        [day.id]: {
                          ...formData.schedule[day.id],
                          open: e.target.value,
                        },
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <input
                  type="time"
                  value={formData.schedule[day.id]?.close || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schedule: {
                        ...formData.schedule,
                        [day.id]: {
                          ...formData.schedule[day.id],
                          close: e.target.value,
                        },
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};