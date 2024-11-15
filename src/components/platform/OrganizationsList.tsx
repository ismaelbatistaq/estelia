import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Calendar, DollarSign, Plus, Settings } from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';
import { AddUserModal } from './AddUserModal';

export const OrganizationsList = () => {
  const navigate = useNavigate();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const { organizations, loading, error } = useOrganizations();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load businesses. Please try again later.</p>
      </div>
    );
  }

  const handleAddUser = (business: any) => {
    setSelectedBusiness(business);
    setShowAddUserModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Businesses</h1>
        <button
          onClick={() => navigate('/platform/create')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Create New Business
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations?.map((org) => (
          <div key={org.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">{org.name}</h3>
                <p className="text-sm text-gray-500">estelia.com/app/{org.slug}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">{org.stats.users} Users</p>
              </div>
              <div className="text-center">
                <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">{org.stats.appointments} Appointments</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">{org.stats.revenue}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => navigate(`/platform/organizations/${org.id}`)}
                className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => handleAddUser(org)}
                className="flex items-center gap-1 px-3 py-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
              <button
                onClick={() => window.location.href = `/app/${org.slug}/login`}
                className="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
              >
                Access App
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => {
            setShowAddUserModal(false);
            setSelectedBusiness(null);
          }}
          business={selectedBusiness}
        />
      )}
    </div>
  );
};