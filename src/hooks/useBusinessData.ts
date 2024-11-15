import { useEffect, useState } from 'react';
import { useOutletBusiness } from './useOutletBusiness';
import { supabase } from '../lib/supabase';

interface QueryOptions {
  select?: string;
  filters?: Record<string, any>;
  relationships?: string[];
}

export function useBusinessData<T>(
  table: string,
  options: QueryOptions = {}
) {
  const { business } = useOutletBusiness();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!business?.id) {
          setLoading(false);
          return;
        }

        let query = supabase
          .from(table)
          .select(options.select || '*')
          .eq('business_id', business.id);

        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          });
        }

        const { data: result, error: queryError } = await query;

        if (queryError) {
          console.error(`Error fetching ${table}:`, queryError);
          throw queryError;
        }

        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Error in useBusinessData for ${table}:`, err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (business?.id) {
      fetchData();
    }
  }, [business?.id, table, JSON.stringify(options)]);

  return { data, loading, error, refetch: () => business?.id && setLoading(true) };
}