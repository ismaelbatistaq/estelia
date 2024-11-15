import React from 'react';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';

export const BillingSettings = () => {
  const { organizations, loading } = useOrganizations();

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for trying out Estelia',
      features: [
        '2 staff members',
        '50 clients',
        '100 appointments/month',
        'Basic reports',
      ],
      limits: {
        users: 2,
        clients: 50,
        appointments: 100,
        products: 20,
        services: 10,
      },
    },
    {
      name: 'Pro',
      price: 2999,
      description: 'For growing salons',
      features: [
        '10 staff members',
        '500 clients',
        'Unlimited appointments',
        'Advanced reports',
        'Inventory management',
        'Marketing tools',
      ],
      limits: {
        users: 10,
        clients: 500,
        appointments: 1000,
        products: 200,
        services: 50,
      },
    },
    {
      name: 'Enterprise',
      price: 9999,
      description: 'For large salons and chains',
      features: [
        'Unlimited staff members',
        'Unlimited clients',
        'Unlimited appointments',
        'Advanced reports',
        'Inventory management',
        'Marketing tools',
        'API access',
        'Priority support',
        'Custom branding',
      ],
      limits: {
        users: null,
        clients: null,
        appointments: null,
        products: null,
        services: null,
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing Settings</h1>

      {/* Current Usage */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Current Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {organizations.map((org) => (
            <div key={org.id} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">{org.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-medium">{org.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Users</span>
                  <span className="font-medium">{org.stats.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Appointments</span>
                  <span className="font-medium">{org.stats.appointments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <CreditCard className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="font-medium">•••• •••• •••• 4242</p>
            <p className="text-sm text-gray-500">Expires 12/25</p>
          </div>
          <button className="ml-auto text-sm text-purple-600 hover:text-purple-700">
            Update
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-xl shadow-sm p-6 flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-gray-500 mt-1">{plan.description}</p>
                <p className="text-3xl font-bold mt-4">
                  {plan.price === 0 ? (
                    'Free'
                  ) : (
                    <>
                      RD$ {plan.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">
                        /month
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="mt-6 w-full py-2 px-4 rounded-lg border-2 border-purple-600 font-medium transition-colors hover:bg-purple-50">
                {plan.name === 'Free' ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Billing History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  date: '2024-03-01',
                  description: 'Pro Plan - Monthly',
                  amount: 'RD$ 2,999',
                  status: 'paid',
                },
                {
                  date: '2024-02-01',
                  description: 'Pro Plan - Monthly',
                  amount: 'RD$ 2,999',
                  status: 'paid',
                },
              ].map((invoice) => (
                <tr key={invoice.date} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {invoice.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};