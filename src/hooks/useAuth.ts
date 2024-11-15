import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  error: Error | null;
  isPlatformAdmin: boolean;
  isPlatformAgent: boolean;
  isBusinessUser: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isPlatformAdmin: false,
    isPlatformAgent: false,
    isBusinessUser: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setState({
            user: null,
            isLoading: false,
            error: null,
            isPlatformAdmin: false,
            isPlatformAgent: false,
            isBusinessUser: false,
          });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            *,
            business:businesses(
              id,
              name,
              slug,
              settings
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setState({
          user: profile,
          isLoading: false,
          error: null,
          isPlatformAdmin: profile.user_type === 'platform_admin',
          isPlatformAgent: profile.user_type === 'platform_agent',
          isBusinessUser: profile.user_type === 'business_user',
        });
      } catch (error) {
        console.error('Error in fetchUser:', error);
        setState(prev => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      first_name: string;
      last_name: string;
      user_type: 'platform_admin' | 'platform_agent' | 'business_user';
      business_id?: string;
      role?: 'owner' | 'admin' | 'manager' | 'staff' | 'stylist' | 'receptionist';
      platform_role?: string;
    }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setState({
      user: null,
      isLoading: false,
      error: null,
      isPlatformAdmin: false,
      isPlatformAgent: false,
      isBusinessUser: false,
    });
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
  };
}