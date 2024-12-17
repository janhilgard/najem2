import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import PredpisyTable from '../components/PredpisyTable';
import PredpisForm from '../components/PredpisForm';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Notification from '../components/Notification';
import SearchInput from '../components/common/SearchInput';
import PredpisTypeToggle from '../components/predpisy/PredpisTypeToggle';
import Pagination from '../components/Pagination';
import { useNotificationStore } from '../stores/notificationStore';
import { usePredpisyStore } from '../stores/predpisyStore';
import { usePredpisyFilter } from '../hooks/usePredpisyFilter';

export default function Predpisy() {
  const { predpisy, addPredpis, updatePredpis, deletePredpis } = usePredpisyStore();
  const { message: notification, showNotification, hideNotification } = useNotificationStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingPredpis, setEditingPredpis] = useState<Predpis | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; predpisId: string | null }>({
    isOpen: false,
    predpisId: null
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
    filteredPredpisy,
    totalPages,
    stats
  } = usePredpisyFilter(predpisy);

  const handleAdd = (data: Omit<Predpis, 'id'>) => {
    addPredpis(data);
    setShowForm(false);
    showNotification('Předpis byl úspěšně přidán');
  };

  const handleEdit = (predpis: Predpis) => {
    setEditingPredpis(predpis);
    setShowForm(true);
  };

  const handleUpdate = (data: Omit<Predpis, 'id'>) => {
    if (!editingPredpis) return;
    updatePredpis(editingPredpis.id, data);
    setShowForm(false);
    setEditingPredpis(undefined);
    showNotification('Předpis byl úspěšně upraven');
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, predpisId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.predpisId) {
      deletePredpis(deleteDialog.predpisId);
      showNotification('Předpis byl úspěšně smazán');
    }
    setDeleteDialog({ isOpen: false, predpisId: null });
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
            <h1 className="text-2xl font-bold text-gray-900">Předpisy plateb</h1>
            
            <PredpisTypeToggle
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              stats={stats}
            />
          </div>
          
          <button
            onClick={() => {
              setEditingPredpis(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Přidat předpis
          </button>
        </div>

        {showForm ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingPredpis ? 'Upravit předpis' : 'Nový předpis'}
            </h2>
            <PredpisForm
              predpis={editingPredpis}
              onSubmit={editingPredpis ? handleUpdate : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingPredpis(undefined);
              }}
            />
          </div>
        ) : (
          <>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Vyhledat předpis..."
              className="max-w-2xl"
            />
            
            <div className="bg-white rounded-lg shadow-md">
              <PredpisyTable
                predpisy={filteredPredpisy}
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
          onClose={() => setDeleteDialog({ isOpen: false, predpisId: null })}
          onConfirm={confirmDelete}
          title="Smazat předpis"
          message="Opravdu chcete smazat tento předpis? Tuto akci nelze vrátit zpět."
        />
      </div>
    </Layout>
  );
}