import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { SalesOverview } from '../components/sales/SalesOverview';
import { SalesHistory } from '../components/sales/SalesHistory';
import { useBusinessData } from '../hooks/useBusinessData';

interface Sale {
  id: string;
  client_id: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  client?: {
    first_name: string;
    last_name: string;
  };
}

export const Sales = () => {
  const { data: sales, loading, error } = useBusinessData<Sale>('sales', {
    select: `
      *,
      client:clients(first_name, last_name)
    `
  });

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
        <p className="text-red-600">Error loading sales. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ventas</h1>
        <Link 
          to="/pos"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Store className="w-5 h-5" />
          <span>Punto de Venta (POS)</span>
        </Link>
      </div>
      
      <SalesOverview sales={sales} />
      <SalesHistory sales={sales} />
    </div>
  );
};