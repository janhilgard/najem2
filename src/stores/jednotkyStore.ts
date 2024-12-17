import { create } from 'zustand';
import { initialJednotky } from '../data/initialData';
import type { Jednotka } from '../types';

interface JednotkyState {
  jednotky: Jednotka[];
  addJednotka: (data: Omit<Jednotka, 'id'>) => void;
  updateJednotka: (id: string, data: Omit<Jednotka, 'id'>) => void;
  deleteJednotka: (id: string) => void;
}

export const useJednotkyStore = create<JednotkyState>((set) => ({
  jednotky: initialJednotky,
  
  addJednotka: (data) => set((state) => ({
    jednotky: [...state.jednotky, {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),
  
  updateJednotka: (id, data) => set((state) => ({
    jednotky: state.jednotky.map((j) =>
      j.id === id ? { ...data, id } : j
    )
  })),
  
  deleteJednotka: (id) => set((state) => ({
    jednotky: state.jednotky.filter((j) => j.id !== id)
  }))
}));