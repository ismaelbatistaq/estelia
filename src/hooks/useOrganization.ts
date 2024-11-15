import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useOrganization() {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        if (!orgSlug) {
          navigate('/platform');
          return;
        }

        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', orgSlug)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            navigate('/platform');
          }
          throw error;
        }

        setOrganization(data);
      } catch (err) {
        setError(err as Error);
        if ((err as any).code === 'PGRST116') {
          navigate('/platform');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, [orgSlug, navigate]);

  return { organization, loading, error };
}