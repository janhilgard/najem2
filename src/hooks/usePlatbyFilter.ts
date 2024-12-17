import { useState, useMemo } from 'react';
import type { Platba } from '../types';

export function usePlatbyFilter(platby: Platba[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'bankovni_prevod' | 'hotovost'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredPlatby = useMemo(() => {
    return platby.filter((platba) => {
      // Filter by payment type
      if (selectedType !== 'all' && platba.typPlatby !== selectedType) {
        return false;
      }

      // Filter by search query
      const najemnikJmeno = platba.najemnikId === '1' ? 'Jan Novák' : 'Marie Svobodová';
      return searchQuery.toLowerCase().split(' ').every(term =>
        `${najemnikJmeno} ${platba.celkovaCastka} ${platba.poznamka || ''}`
          .toLowerCase()
          .includes(term)
      );
    });
  }, [platby, searchQuery, selectedType]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: platby.length,
    prevodemCount: platby.filter(p => p.typPlatby === 'bankovni_prevod').length,
    hotovostCount: platby.filter(p => p.typPlatby === 'hotovost').length
  }), [platby]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPlatby.length / itemsPerPage);
  const paginatedPlatby = filteredPlatby.slice(
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
    filteredPlatby: paginatedPlatby,
    totalPages,
    stats
  };
}