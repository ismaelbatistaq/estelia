import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Client = Database['public']['Tables']['clients']['Row'];

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  error: Error | null;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ clients: data || [], error: null });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  addClient: async (client) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ 
        clients: [data, ...state.clients],
        error: null 
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  updateClient: async (id, updates) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id ? { ...client, ...data } : client
        ),
        error: null
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClient: async (id) => {
    try {
      set({ isLoading: true });
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        clients: state.clients.filter((client) => client.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
}));