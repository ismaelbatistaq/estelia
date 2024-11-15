import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { Loader2 } from 'lucide-react';

export const BusinessLogin = () => {
  const navigate = useNavigate();
  const { businessSlug } = useParams();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!businessSlug) {
          navigate('/platform/login');
          return;
        }

        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', businessSlug)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            navigate('/platform/login');
            return;
          }
          throw error;
        }

        setBusiness(data);
      } catch (error) {
        console.error('Error fetching business:', error);
        navigate('/platform/login');
      } finally {
        setLoadingBusiness(false);
      }
    };

    fetchBusiness();
  }, [businessSlug, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      if (!business) {
        throw new Error('Business not found');
      }

      // First verify if the user has access to this business
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('business_id', business.id)
        .single();

      if (profileError) {
        throw new Error('Invalid credentials or no access to this business');
      }

      // Then attempt to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password');
        }
        throw signInError;
      }

      // Navigate to business dashboard
      navigate(`/app/${businessSlug}/dashboard`);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill demo credentials if it's the demo salon
  useEffect(() => {
    if (businessSlug === 'demo-salon') {
      setEmail('demo@demo-salon.estelia.com');
      setPassword('demo123');
    }
  }, [businessSlug]);

  if (loadingBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Business Not Found</h1>
          <button
            onClick={() => navigate('/platform/login')}
            className="text-purple-600 hover:text-purple-700"
          >
            Go to Platform Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{business.name}</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Powered by Estelia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};