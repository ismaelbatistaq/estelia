import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useBusiness() {
  const { orgSlug } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        if (!orgSlug) return;

        setLoading(true);
        
        // First get the basic business data
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', orgSlug)
          .single();

        if (businessError) throw businessError;
        if (!businessData) throw new Error('Business not found');

        // Then get the counts in separate queries
        const [
          { count: usersCount },
          { count: appointmentsCount },
          { data: salesData },
        ] = await Promise.all([
          supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', businessData.id),
          supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', businessData.id),
          supabase
            .from('sales')
            .select('total')
            .eq('business_id', businessData.id),
        ]);

        // Calculate total sales
        const totalSales = salesData?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;

        // Combine all data
        setBusiness({
          ...businessData,
          stats: {
            users: usersCount || 0,
            appointments: appointmentsCount || 0,
            revenue: totalSales,
          },
        });
      } catch (err) {
        console.error('Error fetching business:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [orgSlug]);

  return { business, loading, error };
}