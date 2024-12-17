import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import NajemniciTable from '../components/NajemniciTable';
import NajemnikForm from '../components/NajemnikForm';
import NajemnikDetail from '../components/NajemnikDetail';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Notification from '../components/Notification';
import SearchInput from '../components/common/SearchInput';
import TenantTypeToggle from '../components/najemnici/TenantTypeToggle';
import Pagination from '../components/Pagination';
import { useNotificationStore } from '../stores/notificationStore';
import { useNajemniciStore } from '../stores/najemniciStore';
import { useTenantsFilter } from '../hooks/useTenantsFilter';
import type { Najemnik } from '../types';

export default function Najemnici() {
  const { najemnici, addNajemnik, updateNajemnik, deleteNajemnik } = useNajemniciStore();
  const { message: notification, showNotification, hideNotification } = useNotificationStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingNajemnik, setEditingNajemnik] = useState<Najemnik | undefined>();
  const [selectedNajemnik, setSelectedNajemnik] = useState<Najemnik | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; najemnikId: string | null }>({
    isOpen: false,
    najemnikId: null
  });
  
  const {
    searchQuery,
    setSearchQuery,
    showInactive,
    setShowInactive,
    filteredNajemnici,
    stats
  } = useTenantsFilter(najemnici);

  // Calculate pagination
  const totalPages = Math.ceil(filteredNajemnici.length / itemsPerPage);
  const paginatedNajemnici = filteredNajemnici.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = (data: Omit<Najemnik, 'id' | 'aktivni'>) => {
    addNajemnik(data);
    setShowForm(false);
    showNotification('Nájemník byl úspěšně přidán');
  };

  const handleEdit = (najemnik: Najemnik) => {
    setEditingNajemnik(najemnik);
    setSelectedNajemnik(undefined);
    setShowForm(true);
  };

  const handleUpdate = (data: Omit<Najemnik, 'id' | 'aktivni'>) => {
    if (!editingNajemnik) return;
    
    const aktivni = !!data.jednotkaId;
    const updatedNajemnik = {
      ...editingNajemnik,
      ...data,
      aktivni,
      dokumenty: editingNajemnik.dokumenty || [],
      fotografie: editingNajemnik.fotografie || []
    };
    
    updateNajemnik(updatedNajemnik);
    setShowForm(false);
    setEditingNajemnik(undefined);
    showNotification('Údaje nájemníka byly úspěšně upraveny');
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, najemnikId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.najemnikId) {
      deleteNajemnik(deleteDialog.najemnikId);
      showNotification('Nájemník byl úspěšně smazán');
    }
    setDeleteDialog({ isOpen: false, najemnikId: null });
  };

  const handleSelectNajemnik = (najemnik: Najemnik) => {
    if (showForm) return;
    setSelectedNajemnik(prev => prev?.id === najemnik.id ? undefined : najemnik);
  };

  const handleDetailUpdate = (updatedNajemnik: Najemnik) => {
    updateNajemnik(updatedNajemnik);
    setSelectedNajemnik(updatedNajemnik);
    showNotification('Údaje nájemníka byly úspěšně upraveny');
  };

  return (
    <Layout>
      {notification && (
        <Notification
          message={notification}
          onClose={hideNotification}
        />
      )}
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-4 w-full sm:w-auto">
            <h1 className="text-2xl font-bold text-gray-900">Nájemníci</h1>
            
            <TenantTypeToggle
              showInactive={showInactive}
              onToggle={setShowInactive}
              aktivniCount={stats.aktivniCount}
              neaktivniCount={stats.neaktivniCount}
            />
          </div>
          
          <button
            onClick={() => {
              setEditingNajemnik(undefined);
              setSelectedNajemnik(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Přidat nájemníka
          </button>
        </div>

        {showForm ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingNajemnik ? 'Upravit nájemníka' : 'Nový nájemník'}
            </h2>
            <NajemnikForm
              najemnik={editingNajemnik}
              onSubmit={editingNajemnik ? handleUpdate : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingNajemnik(undefined);
              }}
            />
          </div>
        ) : (
          <>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Vyhledat nájemníka..."
              className="max-w-2xl"
            />
            
            <div className="bg-white rounded-lg shadow-md">
              <NajemniciTable
                najemnici={paginatedNajemnici}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelectNajemnik={handleSelectNajemnik}
                selectedNajemnikId={selectedNajemnik?.id}
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

        {selectedNajemnik && !showForm && (
          <NajemnikDetail
            najemnik={selectedNajemnik}
            onClose={() => setSelectedNajemnik(undefined)}
            onUpdate={handleDetailUpdate}
          />
        )}

        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, najemnikId: null })}
          onConfirm={confirmDelete}
          title="Smazat nájemníka"
          message="Opravdu chcete smazat tohoto nájemníka? Tuto akci nelze vrátit zpět."
        />
      </div>
    </Layout>
  );
}