import React, { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { ArrowUpCircle, ArrowDownCircle, Plus } from 'lucide-react';
import PlatbaForm from './PlatbaForm';
import { usePlatbyStore } from '../stores/platbyStore';
import { usePredpisyStore } from '../stores/predpisyStore';
import type { Platba } from '../types';

interface SaldoPrehledProps {
  najemnikId: string;
}

type PohybSalda = {
  id: string;
  datum: string;
  typ: 'platba' | 'predpis';
  castka: number;
  popis: string;
};

export default function SaldoPrehled({ najemnikId }: SaldoPrehledProps) {
  const [showPlatbaForm, setShowPlatbaForm] = useState(false);
  const { platby, addPlatba } = usePlatbyStore();
  const { predpisy } = usePredpisyStore();

  // Převedeme platby a předpisy na jednotný formát pohybů
  const pohyby: PohybSalda[] = [
    ...platby
      .filter(platba => platba.najemnikId === najemnikId)
      .map(platba => ({
        id: `platba-${platba.id}`,
        datum: platba.datum,
        typ: 'platba' as const,
        castka: platba.castkaNajem + platba.castkaPoplatky,
        popis: `Přijatá platba${platba.poznamka ? ` - ${platba.poznamka}` : ''}`
      })),
    
    ...predpisy
      .filter(predpis => predpis.najemnikId === najemnikId)
      .map(predpis => ({
        id: `predpis-${predpis.id}`,
        datum: predpis.platnostOd,
        typ: 'predpis' as const,
        castka: -(predpis.mesicniNajem + predpis.zalohaSluzby),
        popis: `Předpis platby za období ${format(new Date(predpis.platnostOd), 'LLLL yyyy', { locale: cs })}`
      }))
  ].sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());

  // Výpočet průběžného zůstatku
  let zustatek = 0;
  const pohybySZustatkem = pohyby.map(pohyb => {
    zustatek += pohyb.castka;
    return { ...pohyb, zustatek };
  });

  const handlePlatbaSubmit = (data: Omit<Platba, 'id'>) => {
    addPlatba(data);
    setShowPlatbaForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Přehled pohybů salda
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
          {pohybySZustatkem.map((pohyb) => (
            <div key={pohyb.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {pohyb.typ === 'platba' ? (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {pohyb.popis}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(pohyb.datum), 'PPP', { locale: cs })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${pohyb.castka >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pohyb.castka >= 0 ? '+' : ''}{pohyb.castka.toLocaleString()} Kč
                  </p>
                  <p className={`text-xs ${pohyb.zustatek >= 0 ? 'text-gray-500' : 'text-red-500'}`}>
                    Zůstatek: {pohyb.zustatek.toLocaleString()} Kč
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPlatbaForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nová platba</h2>
          <PlatbaForm
            defaultNajemnikId={najemnikId}
            onSubmit={handlePlatbaSubmit}
            onCancel={() => setShowPlatbaForm(false)}
          />
        </div>
      )}
    </div>
  );
}