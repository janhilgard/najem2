import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Receipt, Home, User, Building2, Plus } from 'lucide-react';
import type { Aktivita, Platba } from '../types';
import PlatbaForm from './PlatbaForm';

interface AktivityListProps {
  aktivity: Aktivita[];
  onPlatbaAdded?: (platba: Omit<Platba, 'id'>) => void;
}

export default function AktivityList({ aktivity, onPlatbaAdded }: AktivityListProps) {
  const [showPlatbaForm, setShowPlatbaForm] = useState(false);

  const getIcon = (typ: Aktivita['typ']) => {
    switch (typ) {
      case 'platba':
        return <Receipt className="h-5 w-5 text-green-500" />;
      case 'predpis':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'najemnik':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'jednotka':
        return <Building2 className="h-5 w-5 text-orange-500" />;
    }
  };

  const handlePlatbaSubmit = (data: Omit<Platba, 'id'>) => {
    onPlatbaAdded?.(data);
    setShowPlatbaForm(false);
  };

  return (
    <div>
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Poslední aktivity
        </h3>
        <button
          onClick={() => setShowPlatbaForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Přidat platbu
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {aktivity.map((aktivita) => (
          <div key={aktivita.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {getIcon(aktivita.typ)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {aktivita.najemnik.jmeno} {aktivita.najemnik.prijmeni}
                  </p>
                  {aktivita.castka && (
                    <p className="text-sm font-medium text-green-600">
                      + {aktivita.castka.toLocaleString()} Kč
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {aktivita.jednotka.nazev}
                </p>
                <p className="text-sm text-gray-500">
                  {aktivita.popis}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDistanceToNow(new Date(aktivita.datum), { 
                    addSuffix: true,
                    locale: cs 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPlatbaForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setShowPlatbaForm(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Nová platba</h2>
                <PlatbaForm
                  onSubmit={handlePlatbaSubmit}
                  onCancel={() => setShowPlatbaForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}