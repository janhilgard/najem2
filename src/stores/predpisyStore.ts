import { create } from 'zustand';
import { initialPredpisy } from '../data/initialData';
import type { Predpis } from '../types';

interface PredpisyState {
  predpisy: Predpis[];
  addPredpis: (data: Omit<Predpis, 'id'>) => void;
  updatePredpis: (id: string, data: Omit<Predpis, 'id'>) => void;
  deletePredpis: (id: string) => void;
}

export const usePredpisyStore = create<PredpisyState>((set) => ({
  predpisy: initialPredpisy,
  
  addPredpis: (data) => set((state) => ({
    predpisy: [...state.predpisy, {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),
  
  updatePredpis: (id, data) => set((state) => ({
    predpisy: state.predpisy.map((p) =>
      p.id === id ? { ...data, id } : p
    )
  })),
  
  deletePredpis: (id) => set((state) => ({
    predpisy: state.predpisy.filter((p) => p.id !== id)
  }))
}));