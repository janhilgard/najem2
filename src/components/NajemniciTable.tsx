import React from 'react';
import { Edit, Trash2, FileText } from 'lucide-react';
import type { Najemnik, Platba, Predpis } from '../types';
import { calculateTenantBalance } from '../utils/finance';

interface NajemniciTableProps {
  najemnici: Najemnik[];
  onEdit: (najemnik: Najemnik) => void;
  onDelete: (id: string) => void;
  onSelectNajemnik: (najemnik: Najemnik) => void;
  selectedNajemnikId?: string;
}

// Simulace dat jednotek - v reálné aplikaci by přišla z API/databáze
const jednotkyMap: Record<string, string> = {
  '1': 'Byt 2+1 - Květná 123',
  '2': 'Byt 1+kk - Zahradní 45',
  '3': 'Byt 3+1 - Polní 789'
};

// Simulace dat plateb - v reálné aplikaci by přišla z API/databáze
const platby: Platba[] = [
  {
    id: '1',
    najemnikId: '1',
    datum: '2024-03-05',
    castkaNajem: 12500,
    castkaPoplatky: 3500,
    castkaKauce: 25000,
    celkovaCastka: 41000,
    stav: 'spárováno'
  },
  {
    id: '2',
    najemnikId: '2',
    datum: '2024-03-03',
    castkaNajem: 9000,
    castkaPoplatky: 2500,
    castkaKauce: 18000,
    celkovaCastka: 29500,
    stav: 'spárováno'
  }
];

// Simulace dat předpisů - v reálné aplikaci by přišla z API/databáze
const predpisy: Predpis[] = [
  {
    id: '1',
    najemnikId: '1',
    mesicniNajem: 12500,
    zalohaSluzby: 3500,
    platnostOd: '2024-03-01',
    platnostDo: '2024-12-31',
    uhrazeno: 0
  },
  {
    id: '2',
    najemnikId: '2',
    mesicniNajem: 9000,
    zalohaSluzby: 2500,
    platnostOd: '2024-03-01',
    platnostDo: '2024-12-31',
    uhrazeno: 0
  }
];

export default function NajemniciTable({ 
  najemnici, 
  onEdit, 
  onDelete, 
  onSelectNajemnik,
  selectedNajemnikId 
}: NajemniciTableProps) {
  // Helper function to get tenant's security deposit
  const getKauceStatus = (najemnikId: string) => {
    const najemnikovaPlatba = platby.find(
      platba => platba.najemnikId === najemnikId && platba.castkaKauce > 0
    );
    return najemnikovaPlatba?.castkaKauce || 0;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jméno</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jednotka</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kauce</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {najemnici.map((najemnik) => {
            const saldo = calculateTenantBalance(najemnik.id, platby, predpisy);
            const isSelected = selectedNajemnikId === najemnik.id;
            
            return (
              <tr key={najemnik.id} className={`hover:bg-gray-50 ${najemnik.aktivni ? '' : 'bg-gray-50'}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {najemnik.jmeno} {najemnik.prijmeni}
                      </div>
                      <div className={`text-xs ${najemnik.aktivni ? 'text-green-600' : 'text-red-600'}`}>
                        {najemnik.aktivni ? 'Aktivní' : 'Bývalý nájemník'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{najemnik.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{najemnik.telefon}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {najemnik.jednotkaId ? jednotkyMap[najemnik.jednotkaId] : 'Bez přiřazené jednotky'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getKauceStatus(najemnik.id).toLocaleString()} Kč
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${saldo > 0 ? 'text-red-600' : saldo < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {saldo === 0 ? 'Vyrovnáno' : `${Math.abs(saldo).toLocaleString()} Kč ${saldo > 0 ? 'dluh' : 'přeplatek'}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onSelectNajemnik(najemnik)}
                    className={`text-blue-600 hover:text-blue-900 mr-3 ${isSelected ? 'bg-blue-50 rounded-full p-1' : ''}`}
                    title={isSelected ? 'Skrýt výpis' : 'Zobrazit výpis'}
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(najemnik)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(najemnik.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}