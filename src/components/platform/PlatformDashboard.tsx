import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Users, DollarSign, Calendar } from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';

export const PlatformDashboard = () => {
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

  const stats = [
    {
      title: 'Total Businesses',
      value: organizations?.length || 0,
      icon: Building2,
    },
    {
      title: 'Active Users',
      value: organizations?.reduce((sum, org) => sum + (org.stats?.users || 0), 0) || 0,
      icon: Users,
    },
    {
      title: 'Total Revenue',
      value: `RD$ ${organizations?.reduce((sum, org) => {
        const revenue = parseFloat(org.stats?.revenue?.replace('RD$ ', '').replace(',', '') || '0');
        return sum + (isNaN(revenue) ? 0 : revenue);
      }, 0).toLocaleString() || '0'}`,
      icon: DollarSign,
    },
    {
      title: 'Total Appointments',
      value: organizations?.reduce((sum, org) => sum + (org.stats?.appointments || 0), 0) || 0,
      icon: Calendar,
    },
  ];

  const chartData = organizations?.map(org => ({
    name: org.name,
    users: org.stats?.users || 0,
    revenue: parseFloat(org.stats?.revenue?.replace('RD$ ', '').replace(',', '') || '0') || 0,
  })) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Business Growth</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Revenue by Business</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};