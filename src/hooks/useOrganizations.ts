import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  stats: {
    users: number;
    appointments: number;
    revenue: string;
  };
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        setLoading(true);
        
        // Fetch businesses
        const { data: businesses, error: businessError } = await supabase
          .from('businesses')
          .select('*');

        if (businessError) throw businessError;

        // Fetch stats for each business
        const orgsWithStats = await Promise.all(
          businesses.map(async (business) => {
            const [
              { count: usersCount },
              { count: appointmentsCount },
              { sum: revenueSum }
            ] = await Promise.all([
              supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('business_id', business.id),
              supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .eq('business_id', business.id),
              supabase
                .from('sales')
                .select('total')
                .eq('business_id', business.id)
                .then(({ data }) => ({
                  sum: data?.reduce((acc, sale) => acc + (sale.total || 0), 0) || 0
                }))
            ]);

            return {
              ...business,
              stats: {
                users: usersCount || 0,
                appointments: appointmentsCount || 0,
                revenue: `RD$ ${(revenueSum || 0).toLocaleString()}`
              }
            };
          })
        );

        setOrganizations(orgsWithStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizations();
  }, []);

  return { organizations, loading, error };
}