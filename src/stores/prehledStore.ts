import { create } from 'zustand';
import { calculateTenantBalance } from '../utils/finance';
import type { Aktivita } from '../types';
import { useJednotkyStore } from './jednotkyStore';
import { useNajemniciStore } from './najemniciStore';
import { usePlatbyStore } from './platbyStore';
import { usePredpisyStore } from './predpisyStore';

interface Stats {
  celkemJednotek: number;
  obsazeneJednotky: number;
  celkemNajemniku: number;
  mesicniPrijem: number;
  neuhrazenePlatby: number;
}

interface PrehledState {
  aktivity: Aktivita[];
  getStats: () => Stats;
  addAktivita: (aktivita: Omit<Aktivita, 'id'>) => void;
}

export const usePrehledStore = create<PrehledState>((set, get) => ({
  aktivity: [],

  getStats: () => {
    // Get current state from all stores
    const { jednotky } = useJednotkyStore.getState();
    const { najemnici } = useNajemniciStore.getState();
    const { platby } = usePlatbyStore.getState();
    const { predpisy } = usePredpisyStore.getState();

    // Calculate active tenants and occupied units
    const aktivniNajemnici = najemnici.filter(n => n.aktivni);
    const obsazeneJednotkyIds = new Set(aktivniNajemnici
      .map(n => n.jednotkaId)
      .filter(Boolean));

    // Calculate unpaid balances
    const neuhrazenePlatby = aktivniNajemnici.reduce((total, najemnik) => {
      const saldo = calculateTenantBalance(najemnik.id, platby, predpisy);
      return total + (saldo > 0 ? saldo : 0);
    }, 0);

    // Calculate monthly income from active prescriptions (rent only)
    const now = new Date();
    const mesicniPrijem = predpisy.reduce((total, predpis) => {
      const platnostOd = new Date(predpis.platnostOd);
      const platnostDo = new Date(predpis.platnostDo);
      
      if (now >= platnostOd && now <= platnostDo) {
        const najemnik = najemnici.find(n => n.id === predpis.najemnikId);
        if (najemnik?.aktivni) {
          // Include only rent in monthly income (without utility fees)
          return total + predpis.mesicniNajem;
        }
      }
      return total;
    }, 0);

    return {
      celkemJednotek: jednotky.length,
      obsazeneJednotky: obsazeneJednotkyIds.size,
      celkemNajemniku: aktivniNajemnici.length,
      mesicniPrijem,
      neuhrazenePlatby
    };
  },

  addAktivita: (aktivita) => set((state) => ({
    aktivity: [{
      ...aktivita,
      id: Math.random().toString(36).substr(2, 9)
    }, ...state.aktivity]
  }))
}));