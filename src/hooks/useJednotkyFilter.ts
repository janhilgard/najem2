import { useState, useMemo } from 'react';
import type { Jednotka } from '../types';

export function useJednotkyFilter(jednotky: Jednotka[], najemnici: { jednotkaId?: string }[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showObsazene, setShowObsazene] = useState(false);

  const filteredJednotky = useMemo(() => {
    return jednotky.filter((jednotka) => {
      const isObsazena = najemnici.some(n => n.jednotkaId === jednotka.id);
      const matchesSearch = searchQuery.toLowerCase().split(' ').every(term =>
        `${jednotka.cisloJednotky} ${jednotka.dispozice} ${jednotka.ulice} ${jednotka.mesto}`
          .toLowerCase()
          .includes(term)
      );

      return matchesSearch && (showObsazene === isObsazena);
    });
  }, [jednotky, najemnici, searchQuery, showObsazene]);

  const stats = useMemo(() => {
    const obsazeneJednotky = jednotky.filter(j => 
      najemnici.some(n => n.jednotkaId === j.id)
    );
    
    return {
      volneCount: jednotky.length - obsazeneJednotky.length,
      obsazeneCount: obsazeneJednotky.length
    };
  }, [jednotky, najemnici]);

  return {
    searchQuery,
    setSearchQuery,
    showObsazene,
    setShowObsazene,
    filteredJednotky,
    stats
  };
}