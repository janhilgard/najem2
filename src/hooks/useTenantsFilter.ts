import { useState, useMemo } from 'react';
import type { Najemnik } from '../types';

export function useTenantsFilter(najemnici: Najemnik[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const filteredNajemnici = useMemo(() => {
    return najemnici.filter((najemnik) => {
      const matchesSearch = searchQuery.toLowerCase().split(' ').every(term =>
        `${najemnik.jmeno} ${najemnik.prijmeni} ${najemnik.email}`
          .toLowerCase()
          .includes(term)
      );
      return matchesSearch && (showInactive || najemnik.aktivni);
    });
  }, [najemnici, searchQuery, showInactive]);

  const stats = useMemo(() => ({
    aktivniCount: najemnici.filter(n => n.aktivni).length,
    neaktivniCount: najemnici.filter(n => !n.aktivni).length
  }), [najemnici]);

  return {
    searchQuery,
    setSearchQuery,
    showInactive,
    setShowInactive,
    filteredNajemnici,
    stats
  };
}