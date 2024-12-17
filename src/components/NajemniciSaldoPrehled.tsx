import React from 'react';
import { WalletCards, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateTenantBalance } from '../utils/finance';
import { useNajemniciStore } from '../stores/najemniciStore';
import { usePlatbyStore } from '../stores/platbyStore';
import { usePredpisyStore } from '../stores/predpisyStore';

export default function NajemniciSaldoPrehled() {
  const { najemnici } = useNajemniciStore();
  const { platby } = usePlatbyStore();
  const { predpisy } = usePredpisyStore();

  const aktivniNajemnici = najemnici.filter(n => n.aktivni);
  
  // Calculate summary statistics
  const summary = aktivniNajemnici.reduce((acc, najemnik) => {
    const saldo = calculateTenantBalance(najemnik.id, platby, predpisy);
    if (saldo > 0) {
      acc.celkovyDluh += saldo;
      acc.pocetDluzniku++;
    } else if (saldo < 0) {
      acc.celkovyPreplatek += Math.abs(saldo);
      acc.pocetPreplatku++;
    }
    return acc;
  }, {
    celkovyDluh: 0,
    celkovyPreplatek: 0,
    pocetDluzniku: 0,
    pocetPreplatku: 0
  });

  // Helper function to get current predpis for najemnik
  const getCurrentPredpis = (najemnikId: string) => {
    const now = new Date();
    return predpisy.find(predpis => 
      predpis.najemnikId === najemnikId &&
      now >= new Date(predpis.platnostOd) &&
      now <= new Date(predpis.platnostDo)
    );
  };
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WalletCards className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Přehled salda nájemníků</h3>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            {summary.pocetDluzniku > 0 && (
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <span className="text-gray-500">Celkový dluh:</span>
                  <span className="ml-2 font-medium text-red-600">
                    {summary.celkovyDluh.toLocaleString()} Kč
                  </span>
                  <span className="text-xs text-gray-500 block">
                    ({summary.pocetDluzniku} {summary.pocetDluzniku === 1 ? 'dlužník' : 
                      summary.pocetDluzniku < 5 ? 'dlužníci' : 'dlužníků'})
                  </span>
                </div>
              </div>
            )}
            {summary.pocetPreplatku > 0 && (
              <div className="flex items-center">
                <TrendingDown className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <span className="text-gray-500">Celkový přeplatek:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {summary.celkovyPreplatek.toLocaleString()} Kč
                  </span>
                  <span className="text-xs text-gray-500 block">
                    ({summary.pocetPreplatku} {summary.pocetPreplatku === 1 ? 'přeplatek' : 
                      summary.pocetPreplatku < 5 ? 'přeplatky' : 'přeplatků'})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nájemník
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nájem
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Poplatky
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Předpis celkem
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Saldo
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {aktivniNajemnici.map((najemnik) => {
            const saldo = calculateTenantBalance(najemnik.id, platby, predpisy);
            const currentPredpis = getCurrentPredpis(najemnik.id);
            const maSaldo = saldo !== 0;
            
            return (
              <tr key={najemnik.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {najemnik.jmeno} {najemnik.prijmeni}
                    </div>
                    <div className="text-sm text-gray-500">{najemnik.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {currentPredpis ? `${currentPredpis.mesicniNajem.toLocaleString()} Kč` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {currentPredpis ? `${currentPredpis.zalohaSluzby.toLocaleString()} Kč` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {currentPredpis ? 
                    `${(currentPredpis.mesicniNajem + currentPredpis.zalohaSluzby).toLocaleString()} Kč` : 
                    '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm font-medium ${
                    saldo > 0 ? 'text-red-600' : 
                    saldo < 0 ? 'text-green-600' : 
                    'text-gray-500'
                  }`}>
                    {maSaldo ? (
                      <>
                        {saldo > 0 ? '+' : ''}{saldo.toLocaleString()} Kč
                        <span className="text-xs block text-right">
                          {saldo > 0 ? 'dluh' : 'přeplatek'}
                        </span>
                      </>
                    ) : (
                      'Vyrovnáno'
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}