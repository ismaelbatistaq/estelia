import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: any;
  signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ user: User | null; session: Session | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
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
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
        setUser(null);
        return;
      }

      if (!profile) {
        console.warn("No profile found for user. Please create a profile.");
        setUser(null);
        return;
      }

      setUser({
        ...profile,
        organization: profile.business,
        role: profile.user_type === 'platform_admin' ? 'SUPERADMIN' : profile.role,
      });
    } catch (error) {
      console.error('Error in fetchUser:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (isMounted) {
        if (error) {
          console.error('Error fetching session:', error.message);
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        const currentSession = data?.session ?? null;
        setSession(currentSession);

        if (currentSession?.user) {
          await fetchUser(currentSession.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    };

    fetchSession();

    const { subscription } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      if (isMounted) {
        setSession(updatedSession);
        if (updatedSession?.user) {
          fetchUser(updatedSession.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    }).data; // Aseguramos acceder directamente a `data.subscription`

    return () => {
      isMounted = false;
      subscription?.unsubscribe(); // Llamamos a `unsubscribe` del objeto correcto
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }

    return data;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
