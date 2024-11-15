import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export const CreateOrganization = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ownerEmail: '',
    ownerFirstName: '',
    ownerLastName: '',
    ownerPassword: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert([{
          name: formData.name,
          slug: formData.slug,
          settings: {
            phone: formData.phone,
            address: formData.address,
            email: formData.ownerEmail
          }
        }])
        .select()
        .single();

      if (businessError) throw businessError;

      // Create owner account
      const { data: auth, error: authError } = await supabase.auth.signUp({
        email: formData.ownerEmail,
        password: formData.ownerPassword,
        options: {
          data: {
            first_name: formData.ownerFirstName,
            last_name: formData.ownerLastName,
          }
        }
      });

      if (authError) throw authError;

      // Create owner profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: auth.user!.id,
          business_id: business.id,
          email: formData.ownerEmail,
          first_name: formData.ownerFirstName,
          last_name: formData.ownerLastName,
          role: 'admin',
          user_type: 'business_user',
          is_owner: true
        }]);

      if (profileError) throw profileError;

      // Stay in platform after creating business
      navigate('/platform/organizations');
    } catch (error) {
      console.error('Error creating business:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Business</h1>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields remain the same */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/platform/organizations')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Create Business</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};