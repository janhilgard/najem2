import { create } from 'zustand';
import { initialNajemnici } from '../data/initialData';
import type { Najemnik, Fotografie } from '../types';

interface NajemniciState {
  najemnici: Najemnik[];
  addNajemnik: (data: Omit<Najemnik, 'id' | 'aktivni'>) => void;
  updateNajemnik: (najemnik: Najemnik) => void;
  deleteNajemnik: (id: string) => void;
  addPhoto: (najemnikId: string, photo: Omit<Fotografie, 'id'>) => void;
  deletePhoto: (najemnikId: string, photoId: string) => void;
}

export const useNajemniciStore = create<NajemniciState>((set) => ({
  najemnici: initialNajemnici,
  
  addNajemnik: (data) => set((state) => ({
    najemnici: [...state.najemnici, {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      aktivni: !!data.jednotkaId,
      dokumenty: [],
      fotografie: []
    }]
  })),
  
  updateNajemnik: (updatedNajemnik) => set((state) => ({
    najemnici: state.najemnici.map((n) => 
      n.id === updatedNajemnik.id ? updatedNajemnik : n
    )
  })),
  
  deleteNajemnik: (id) => set((state) => ({
    najemnici: state.najemnici.filter((n) => n.id !== id)
  })),
  
  addPhoto: (najemnikId, photoData) => set((state) => ({
    najemnici: state.najemnici.map((najemnik) => {
      if (najemnik.id !== najemnikId) return najemnik;
      
      const newPhoto: Fotografie = {
        ...photoData,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      return {
        ...najemnik,
        fotografie: [...(najemnik.fotografie || []), newPhoto]
      };
    })
  })),
  
  deletePhoto: (najemnikId, photoId) => set((state) => ({
    najemnici: state.najemnici.map((najemnik) => {
      if (najemnik.id !== najemnikId) return najemnik;
      
      return {
        ...najemnik,
        fotografie: najemnik.fotografie?.filter(f => f.id !== photoId) || []
      };
    })
  }))
}));