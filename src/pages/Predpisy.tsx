import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/Layout';
import PredpisyTable from '../components/PredpisyTable';
import PredpisForm from '../components/PredpisForm';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Notification from '../components/Notification';
import { useNotification } from '../hooks/useNotification';
import { initialPredpisy } from '../data/initialData';
import type { Predpis } from '../types';

export default function Predpisy() {
  const [predpisy, setPredpisy] = useState<Predpis[]>(initialPredpisy);
  const [showForm, setShowForm] = useState(false);
  const [editingPredpis, setEditingPredpis] = useState<Predpis | undefined>();
  const [showUkoncene, setShowUkoncene] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; predpisId: string | null }>({
    isOpen: false,
    predpisId: null
  });
  const { notification, showNotification, hideNotification } = useNotification();

  const handleAdd = (data: Omit<Predpis, 'id'>) => {
    const newPredpis: Predpis = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    setPredpisy([...predpisy, newPredpis]);
    setShowForm(false);
    showNotification('Předpis byl úspěšně přidán');
  };

  const handleEdit = (predpis: Predpis) => {
    setEditingPredpis(predpis);
    setShowForm(true);
  };

  const handleUpdate = (data: Omit<Predpis, 'id'>) => {
    if (!editingPredpis) return;
    const updatedPredpisy = predpisy.map((p) =>
      p.id === editingPredpis.id ? { ...data, id: editingPredpis.id } : p
    );
    setPredpisy(updatedPredpisy);
    setShowForm(false);
    setEditingPredpis(undefined);
    showNotification('Předpis byl úspěšně upraven');
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, predpisId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.predpisId) {
      setPredpisy(predpisy.filter((p) => p.id !== deleteDialog.predpisId));
      showNotification('Předpis byl úspěšně smazán');
    }
    setDeleteDialog({ isOpen: false, predpisId: null });
  };

  // Filter predpisy based on search query and showUkoncene state
  const filteredPredpisy = predpisy.filter((predpis) => {
    const isUkonceny = new Date(predpis.platnostDo) < new Date();
    const matchesSearch = searchQuery.toLowerCase().split(' ').every(term =>
      `${predpis.najemnikId} ${predpis.mesicniNajem} ${predpis.zalohaSluzby}`
        .toLowerCase()
        .includes(term)
    );

    if (!showUkoncene && isUkonceny) {
      return false;
    }

    return matchesSearch;
  });

  return (
    <Layout>
      {notification && (
        <Notification
          message={notification}
          onClose={hideNotification}
        />
      )}
      
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Předpisy plateb</h1>
            <div className="flex items-center">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showUkoncene}
                  onChange={(e) => setShowUkoncene(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Zobrazit ukončené předpisy
                </span>
              </label>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingPredpis(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center gap-2"
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Vyhledat předpis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input"
              />
            </div>
            <PredpisyTable
              predpisy={filteredPredpisy}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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