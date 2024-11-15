import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Business {
  id: string;
  name: string;
  slug: string;
  settings: any;
}

export function useOutletBusiness() {
  const { orgSlug } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        if (!orgSlug) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', orgSlug)
          .maybeSingle();

        if (error) throw error;
        setBusiness(data);
      } catch (err) {
        console.error('Business error:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [orgSlug]);

  return { business, loading, error };
}