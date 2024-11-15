import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const CreateBusiness = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ownerEmail: '',
    ownerFirstName: '',
    ownerLastName: '',
    ownerPassword: '',
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
        }])
        .select()
        .single();

      if (businessError) throw businessError;

      // Create owner account
      const { data: auth, error: authError } = await supabase.auth.signUp({
        email: formData.ownerEmail,
        password: formData.ownerPassword,
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
          user_type: 'business_user',
          is_owner: true,
        }]);

      if (profileError) throw profileError;

      navigate(`/${business.slug}`);
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const slug = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-');
                setFormData({
                  ...formData,
                  name: e.target.value,
                  slug,
                });
              }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">estelia.com/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Business Owner</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.ownerFirstName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerFirstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.ownerLastName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerLastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.ownerPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/platform')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}