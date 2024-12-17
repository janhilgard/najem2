import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import PlatbyTable from '../components/PlatbyTable';
import PlatbaForm from '../components/PlatbaForm';
import Pagination from '../components/Pagination';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Notification from '../components/Notification';
import SearchInput from '../components/common/SearchInput';
import PaymentTypeToggle from '../components/platby/PaymentTypeToggle';
import { useNotificationStore } from '../stores/notificationStore';
import { usePlatbyStore } from '../stores/platbyStore';
import { usePlatbyFilter } from '../hooks/usePlatbyFilter';
import type { Platba } from '../types';

export default function Platby() {
  const { platby, addPlatba, updatePlatba, deletePlatba } = usePlatbyStore();
  const { message: notification, showNotification, hideNotification } = useNotificationStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingPlatba, setEditingPlatba] = useState<Platba | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; platbaId: string | null }>({
    isOpen: false,
    platbaId: null
  });

  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filteredPlatby,
    totalPages,
    stats
  } = usePlatbyFilter(platby);

  const handleAdd = (data: Omit<Platba, 'id'>) => {
    addPlatba(data);
    setShowForm(false);
    showNotification('Platba byla úspěšně přidána');
  };

  const handleEdit = (platba: Platba) => {
    setEditingPlatba(platba);
    setShowForm(true);
  };

  const handleUpdate = (data: Omit<Platba, 'id'>) => {
    if (!editingPlatba) return;
    updatePlatba(editingPlatba.id, data);
    setShowForm(false);
    setEditingPlatba(undefined);
    showNotification('Platba byla úspěšně upravena');
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, platbaId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.platbaId) {
      deletePlatba(deleteDialog.platbaId);
      showNotification('Platba byla úspěšně smazána');
    }
    setDeleteDialog({ isOpen: false, platbaId: null });
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
            <h1 className="text-2xl font-bold text-gray-900">Platby</h1>
            
            <PaymentTypeToggle
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              stats={stats}
            />
          </div>
          
          <button
            onClick={() => {
              setEditingPlatba(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
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
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Vyhledat platbu podle nájemníka..."
              className="max-w-2xl"
            />
            
            <div className="bg-white rounded-lg shadow-md">
              <PlatbyTable
                platby={filteredPlatby}
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