import React from 'react';
import { CreditCard, Package, Users, Calendar } from 'lucide-react';

interface BusinessBillingProps {
  business: any;
}

export const BusinessBilling = ({ business }: BusinessBillingProps) => {
  const currentPlan = {
    name: 'Pro',
    price: 2999,
    interval: 'monthly',
    features: [
      '10 staff members',
      '500 clients',
      'Unlimited appointments',
      'Advanced reports',
      'Inventory management',
      'Marketing tools',
    ],
  };

  const usage = {
    users: 8,
    clients: 350,
    appointments: 750,
    storage: '750MB',
  };

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-semibold">{currentPlan.name} Plan</h4>
              <p className="text-gray-500">
                RD$ {currentPlan.price.toLocaleString()}/{currentPlan.interval}
              </p>
            </div>
            <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
              Change Plan
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">Staff Members</p>
              <p className="text-lg font-semibold">
                {usage.users} <span className="text-sm text-gray-500">/ 10</span>
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">Clients</p>
              <p className="text-lg font-semibold">
                {usage.clients} <span className="text-sm text-gray-500">/ 500</span>
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="text-lg font-semibold">
                {usage.appointments} <span className="text-sm text-gray-500">/ ∞</span>
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-gray-500">Storage</p>
              <p className="text-lg font-semibold">
                {usage.storage} <span className="text-sm text-gray-500">/ 1GB</span>
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h5 className="font-medium mb-2">Included Features</h5>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <button className="text-purple-600 hover:text-purple-700">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  date: '2024-03-01',
                  description: 'Pro Plan - Monthly',
                  amount: 'RD$ 2,999',
                },
                {
                  date: '2024-02-01',
                  description: 'Pro Plan - Monthly',
                  amount: 'RD$ 2,999',
                },
              ].map((invoice, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <button className="text-purple-600 hover:text-purple-700">
                      Download
                    </button>
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