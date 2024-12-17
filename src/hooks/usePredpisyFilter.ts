import { useState, useMemo } from 'react';
import type { Predpis } from '../types';

export function usePredpisyFilter(predpisy: Predpis[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'active' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredPredpisy = useMemo(() => {
    return predpisy.filter((predpis) => {
      // Filter by type (active/completed)
      const now = new Date();
      const platnostDo = new Date(predpis.platnostDo);
      const isActive = platnostDo >= now;

      if (selectedType === 'active' && !isActive) return false;
      if (selectedType === 'completed' && isActive) return false;

      // Filter by search query
      return searchQuery.toLowerCase().split(' ').every(term =>
        `${predpis.najemnikId} ${predpis.mesicniNajem} ${predpis.zalohaSluzby}`
          .toLowerCase()
          .includes(term)
      );
    });
  }, [predpisy, searchQuery, selectedType]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: predpisy.length,
      aktivni: predpisy.filter(p => new Date(p.platnostDo) >= now).length,
      ukoncene: predpisy.filter(p => new Date(p.platnostDo) < now).length
    };
  }, [predpisy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPredpisy.length / itemsPerPage);
  const paginatedPredpisy = filteredPredpisy.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredPredpisy: paginatedPredpisy,
    totalPages,
    stats
  };
}