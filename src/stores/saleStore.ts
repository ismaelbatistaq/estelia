import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Sale = Database['public']['Tables']['sales']['Row'];
type SaleItem = Database['public']['Tables']['sale_items']['Row'];

interface SaleState {
  sales: Sale[];
  isLoading: boolean;
  error: Error | null;
  fetchSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>, items: Omit<SaleItem, 'id' | 'sale_id' | 'created_at' | 'updated_at'>[]) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
}

export const useSaleStore = create<SaleState>((set) => ({
  sales: [],
  isLoading: false,
  error: null,

  fetchSales: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          client:clients(*),
          items:sale_items(
            *,
            product:products(*),
            service:services(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ sales: data || [], error: null });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  addSale: async (sale, items) => {
    try {
      set({ isLoading: true });
      
      // Start a Supabase transaction
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single();

      if (saleError) throw saleError;

      // Insert sale items
      const saleItems = items.map(item => ({
        ...item,
        sale_id: saleData.id
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Fetch the complete sale with items
      const { data: completeSale, error: fetchError } = await supabase
        .from('sales')
        .select(`
          *,
          client:clients(*),
          items:sale_items(
            *,
            product:products(*),
            service:services(*)
          )
        `)
        .eq('id', saleData.id)
        .single();

      if (fetchError) throw fetchError;

      set((state) => ({
        sales: [completeSale, ...state.sales],
        error: null
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSale: async (id, updates) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(*),
          items:sale_items(
            *,
            product:products(*),
            service:services(*)
          )
        `)
        .single();

      if (error) throw error;
      set((state) => ({
        sales: state.sales.map((sale) =>
          sale.id === id ? { ...sale, ...data } : sale
        ),
        error: null
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSale: async (id) => {
    try {
      set({ isLoading: true });
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        sales: state.sales.filter((sale) => sale.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },
}));