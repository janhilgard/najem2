import React from 'react';
import { Edit, Trash2, AlertCircle, CheckCircle, MinusCircle, CreditCard, Wallet } from 'lucide-react';
import type { Platba } from '../types';

interface PlatbyTableProps {
  platby: Platba[];
  onEdit: (platba: Platba) => void;
  onDelete: (id: string) => void;
}

export default function PlatbyTable({ platby, onEdit, onDelete }: PlatbyTableProps) {
  const getStatusIcon = (stav: Platba['stav']) => {
    switch (stav) {
      case 'spárováno':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'částečně_spárováno':
        return <MinusCircle className="h-5 w-5 text-yellow-500" />;
      case 'nespárováno':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (stav: Platba['stav']) => {
    switch (stav) {
      case 'spárováno':
        return 'Spárováno s předpisem';
      case 'částečně_spárováno':
        return 'Částečně spárováno';
      case 'nespárováno':
        return 'Nespárováno';
    }
  };

  const getTypPlatbyIcon = (typ: Platba['typPlatby']) => {
    switch (typ) {
      case 'bankovni_prevod':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'hotovost':
        return <Wallet className="h-5 w-5 text-green-500" />;
    }
  };

  const getTypPlatbyText = (typ: Platba['typPlatby']) => {
    switch (typ) {
      case 'bankovni_prevod':
        return 'Bankovní převod';
      case 'hotovost':
        return 'Hotovost';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nájemník</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ platby</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celkem</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stav</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poznámka</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {platby.map((platba) => (
            <tr key={platba.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {/* In real app, fetch tenant name by najemnikId */}
                  {platba.najemnikId === '1' ? 'Jan Novák' : 'Marie Svobodová'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(platba.datum).toLocaleDateString('cs')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getTypPlatbyIcon(platba.typPlatby)}
                  <span className="ml-2 text-sm text-gray-900">
                    {getTypPlatbyText(platba.typPlatby)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{platba.celkovaCastka.toLocaleString()} Kč</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getStatusIcon(platba.stav)}
                  <span className="ml-2 text-sm text-gray-500">{getStatusText(platba.stav)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{platba.poznamka}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(platba)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(platba.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}