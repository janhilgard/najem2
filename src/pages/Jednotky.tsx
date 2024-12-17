import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import JednotkyTable from '../components/JednotkyTable';
import JednotkaForm from '../components/JednotkaForm';
import SearchInput from '../components/common/SearchInput';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Notification from '../components/Notification';
import Pagination from '../components/Pagination';
import { useNotificationStore } from '../stores/notificationStore';
import { useJednotkyStore } from '../stores/jednotkyStore';
import { useNajemniciStore } from '../stores/najemniciStore';
import type { Jednotka } from '../types';

export default function Jednotky() {
  const { jednotky, addJednotka, updateJednotka, deleteJednotka } = useJednotkyStore();
  const { najemnici } = useNajemniciStore();
  const { message: notification, showNotification, hideNotification } = useNotificationStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingJednotka, setEditingJednotka] = useState<Jednotka | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; jednotkaId: string | null }>({
    isOpen: false,
    jednotkaId: null
  });

  // Filter units based on search query
  const filteredJednotky = jednotky.filter((jednotka) => {
    return searchQuery.toLowerCase().split(' ').every(term =>
      `${jednotka.cisloJednotky} ${jednotka.dispozice} ${jednotka.ulice} ${jednotka.mesto}`
        .toLowerCase()
        .includes(term)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredJednotky.length / itemsPerPage);
  const paginatedJednotky = filteredJednotky.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = (data: Omit<Jednotka, 'id'>) => {
    addJednotka(data);
    setShowForm(false);
    showNotification('Jednotka byla úspěšně přidána');
  };

  const handleEdit = (jednotka: Jednotka) => {
    setEditingJednotka(jednotka);
    setShowForm(true);
  };

  const handleUpdate = (data: Omit<Jednotka, 'id'>) => {
    if (!editingJednotka) return;
    updateJednotka(editingJednotka.id, data);
    setShowForm(false);
    setEditingJednotka(undefined);
    showNotification('Jednotka byla úspěšně upravena');
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, jednotkaId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.jednotkaId) {
      deleteJednotka(deleteDialog.jednotkaId);
      showNotification('Jednotka byla úspěšně smazána');
    }
    setDeleteDialog({ isOpen: false, jednotkaId: null });
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bytové jednotky</h1>
            <p className="mt-1 text-sm text-gray-500">
              Celkem jednotek: {jednotky.length}
            </p>
          </div>
          
          <button
            onClick={() => {
              setEditingJednotka(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Přidat jednotku
          </button>
        </div>

        {showForm ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingJednotka ? 'Upravit jednotku' : 'Nová jednotka'}
            </h2>
            <JednotkaForm
              jednotka={editingJednotka}
              onSubmit={editingJednotka ? handleUpdate : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingJednotka(undefined);
              }}
            />
          </div>
        ) : (
          <>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Vyhledat jednotku..."
              className="max-w-2xl"
            />
            
            <div className="bg-white rounded-lg shadow-md">
              <JednotkyTable
                jednotky={paginatedJednotky}
                najemnici={najemnici}
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
          onClose={() => setDeleteDialog({ isOpen: false, jednotkaId: null })}
          onConfirm={confirmDelete}
          title="Smazat jednotku"
          message="Opravdu chcete smazat tuto jednotku? Tuto akci nelze vrátit zpět."
        />
      </div>
    </Layout>
  );
}