import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { Jednotka } from '../types';

interface JednotkyTableProps {
  jednotky: Jednotka[];
  onEdit: (jednotka: Jednotka) => void;
  onDelete: (id: string) => void;
}

export default function JednotkyTable({ jednotky, onEdit, onDelete }: JednotkyTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Číslo jednotky</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispozice</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plocha</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresa</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jednotky.map((jednotka) => (
            <tr key={jednotka.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{jednotka.cisloJednotky}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{jednotka.dispozice}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{jednotka.plocha} m²</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {jednotka.ulice} {jednotka.cisloPopisne}
                </div>
                <div className="text-sm text-gray-500">
                  {jednotka.psc} {jednotka.mesto}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(jednotka)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(jednotka.id)}
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