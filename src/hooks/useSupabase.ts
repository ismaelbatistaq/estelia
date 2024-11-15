import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseSupabaseOptions {
  select?: string;
  filters?: Record<string, any>;
}

export function useSupabase<T>(
  table: string,
  options: UseSupabaseOptions = {},
  deps: any[] = []
) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let query = supabase.from(table).select(options.select || '*');

        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          });
        }

        const { data: result, error: queryError } = await query;
        
        if (queryError) throw queryError;
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${table}:`, err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [...deps]);

  return { data, error, isLoading };
}