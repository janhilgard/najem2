import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { Predpis } from '../types';

interface PredpisyTableProps {
  predpisy: Predpis[];
  onEdit: (predpis: Predpis) => void;
  onDelete: (id: string) => void;
}

export default function PredpisyTable({ predpisy, onEdit, onDelete }: PredpisyTableProps) {
  // Helper function to get tenant name - in real app would fetch from API/database
  const getNajemnikJmeno = (najemnikId: string) => {
    const najemnici: Record<string, string> = {
      '1': 'Jan Novák',
      '2': 'Marie Svobodová',
      '3': 'Petr Dvořák'
    };
    return najemnici[najemnikId] || 'Neznámý nájemník';
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nájemník</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Měsíční nájem</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Záloha služby</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platnost od</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platnost do</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {predpisy.map((predpis) => (
            <tr key={predpis.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {getNajemnikJmeno(predpis.najemnikId)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{predpis.mesicniNajem.toLocaleString()} Kč</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{predpis.zalohaSluzby.toLocaleString()} Kč</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(predpis.platnostOd).toLocaleDateString('cs')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(predpis.platnostDo).toLocaleDateString('cs')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(predpis)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(predpis.id)}
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