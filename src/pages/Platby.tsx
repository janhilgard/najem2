import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/Layout';
import PlatbyTable from '../components/PlatbyTable';
import PlatbaForm from '../components/PlatbaForm';
import Pagination from '../components/Pagination';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Notification from '../components/Notification';
import { useNotification } from '../hooks/useNotification';
import { initialPlatby } from '../data/initialData';
import type { Platba } from '../types';

export default function Platby() {
  const [platby, setPlatby] = useState<Platba[]>(initialPlatby);
  const [showForm, setShowForm] = useState(false);
  const [editingPlatba, setEditingPlatba] = useState<Platba | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { notification, showNotification, hideNotification } = useNotification();
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; platbaId: string | null }>({
    isOpen: false,
    platbaId: null
  });

  const handleAdd = (data: Omit<Platba, 'id'>) => {
    const newPlatba: Platba = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    setPlatby([...platby, newPlatba]);
    setShowForm(false);
    showNotification('Platba byla úspěšně přidána');
  };

  const handleEdit = (platba: Platba) => {
    setEditingPlatba(platba);
    setShowForm(true);
  };

  const handleUpdate = (data: Omit<Platba, 'id'>) => {
    if (!editingPlatba) return;
    const updatedPlatby = platby.map((p) =>
      p.id === editingPlatba.id ? { ...data, id: editingPlatba.id } : p
    );
    setPlatby(updatedPlatby);
    setShowForm(false);
    setEditingPlatba(undefined);
    showNotification('Platba byla úspěšně upravena');
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, platbaId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.platbaId) {
      setPlatby(platby.filter((p) => p.id !== deleteDialog.platbaId));
      showNotification('Platba byla úspěšně smazána');
    }
    setDeleteDialog({ isOpen: false, platbaId: null });
  };

  const filteredPlatby = platby.filter((platba) => {
    const searchTerm = searchQuery.toLowerCase();
    const najemnikJmeno = platba.najemnikId === '1' ? 'Jan Novák' : 'Marie Svobodová';
    return najemnikJmeno.toLowerCase().includes(searchTerm);
  });

  // Výpočet stránkování
  const totalPages = Math.ceil(filteredPlatby.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlatby = filteredPlatby.slice(startIndex, endIndex);

  return (
    <Layout>
      {notification && (
        <Notification
          message={notification}
          onClose={hideNotification}
        />
      )}
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Platby</h1>
          <button
            onClick={() => {
              setEditingPlatba(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Přidat platbu
          </button>
        </div>

        {showForm ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingPlatba ? 'Upravit platbu' : 'Nová platba'}
            </h2>
            <PlatbaForm
              platba={editingPlatba}
              onSubmit={editingPlatba ? handleUpdate : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingPlatba(undefined);
              }}
            />
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Vyhledat platbu podle nájemníka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input"
              />
            </div>
            <div className="bg-white rounded-lg shadow-md">
              <PlatbyTable
                platby={currentPlatby}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </>
        )}

        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, platbaId: null })}
          onConfirm={confirmDelete}
          title="Smazat platbu"
          message="Opravdu chcete smazat tuto platbu? Tuto akci nelze vrátit zpět."
        />
      </div>
    </Layout>
  );
}