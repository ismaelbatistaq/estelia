import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Appointment = Database['public']['Tables']['appointments']['Row'];

interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
  error: Error | null;
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  isLoading: false,
  error: null,

  fetchAppointments: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(*),
          service:services(*),
          stylist:profiles(*)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      set({ appointments: data || [], error: null });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  addAppointment: async (appointment) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select(`
          *,
          client:clients(*),
          service:services(*),
          stylist:profiles(*)
        `)
        .single();

      if (error) throw error;
      set((state) => ({
        appointments: [...state.appointments, data],
        error: null
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAppointment: async (id, updates) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(*),
          service:services(*),
          stylist:profiles(*)
        `)
        .single();

      if (error) throw error;
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, ...data } : appointment
        ),
        error: null
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAppointment: async (id) => {
    try {
      set({ isLoading: true });
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        appointments: state.appointments.filter((appointment) => appointment.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
}));