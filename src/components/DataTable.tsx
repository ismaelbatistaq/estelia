import React from 'react';

interface DataTableProps {
  data: Array<{
    id: number;
    client: string;
    service: string;
    amount: string;
    date: string;
  }>;
}

export const DataTable = ({ data }: DataTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Servicio
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 whitespace-nowrap text-sm">
                {row.client}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                {row.service}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-medium">
                {row.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};