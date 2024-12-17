import { create } from 'zustand';
import { initialPlatby } from '../data/initialData';
import type { Platba } from '../types';

interface PlatbyState {
  platby: Platba[];
  addPlatba: (data: Omit<Platba, 'id'>) => void;
  updatePlatba: (id: string, data: Omit<Platba, 'id'>) => void;
  deletePlatba: (id: string) => void;
}

export const usePlatbyStore = create<PlatbyState>((set) => ({
  platby: initialPlatby,
  
  addPlatba: (data) => set((state) => ({
    platby: [...state.platby, {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),
  
  updatePlatba: (id, data) => set((state) => ({
    platby: state.platby.map((p) =>
      p.id === id ? { ...data, id } : p
    )
  })),
  
  deletePlatba: (id) => set((state) => ({
    platby: state.platby.filter((p) => p.id !== id)
  }))
}));