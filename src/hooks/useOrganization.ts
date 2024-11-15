import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useOrganization() {
  const { businessSlug: orgSlug } = useParams(); // Cambié a businessSlug para ser consistente
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchOrganization() {
      if (!orgSlug) {
        setLoading(false);
        return; // Evita realizar la consulta si no hay `orgSlug`
      }

      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', orgSlug)
          .single();

        if (error) throw error;

        setOrganization(data);
      } catch (err) {
        console.error('Error fetching organization:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, [orgSlug]);

  return { organization, loading, error };
}
