import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/Layout';
import NajemniciTable from '../components/NajemniciTable';
import NajemnikForm from '../components/NajemnikForm';
import NajemnikDetail from '../components/NajemnikDetail';
import Notification from '../components/Notification';
import { useNotification } from '../hooks/useNotification';
import { initialNajemnici, initialPlatby, initialPredpisy } from '../data/initialData';
import type { Najemnik, Platba } from '../types';

export default function Najemnici() {
  const [najemnici, setNajemnici] = useState<Najemnik[]>(initialNajemnici);
  const [platby, setPlatby] = useState<Platba[]>(initialPlatby);
  const [showForm, setShowForm] = useState(false);
  const [editingNajemnik, setEditingNajemnik] = useState<Najemnik | undefined>();
  const [selectedNajemnik, setSelectedNajemnik] = useState<Najemnik | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const { notification, showNotification, hideNotification } = useNotification();

  const handleAdd = (data: Omit<Najemnik, 'id' | 'aktivni'>) => {
    const newNajemnik: Najemnik = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      aktivni: !!data.jednotkaId,
      dokumenty: [],
      fotografie: []
    };
    setNajemnici([...najemnici, newNajemnik]);
    setShowForm(false);
    showNotification('Nájemník byl úspěšně přidán');
  };

  const handleEdit = (najemnik: Najemnik) => {
    setEditingNajemnik(najemnik);
    setShowForm(true);
  };

  const handleUpdate = (data: Omit<Najemnik, 'id' | 'aktivni'>) => {
    if (!editingNajemnik) return;
    
    const aktivni = !!data.jednotkaId;
    
    const updatedNajemnici = najemnici.map((n) =>
      n.id === editingNajemnik.id ? { 
        ...editingNajemnik,
        ...data,
        aktivni
      } : n
    );
    setNajemnici(updatedNajemnici);
    setShowForm(false);
    setEditingNajemnik(undefined);
    showNotification('Údaje nájemníka byly úspěšně upraveny');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Opravdu chcete smazat tohoto nájemníka?')) {
      setNajemnici(najemnici.filter((n) => n.id !== id));
    }
  };

  const handleSelectNajemnik = (najemnik: Najemnik) => {
    setSelectedNajemnik(prev => prev?.id === najemnik.id ? undefined : najemnik);
  };

  const handlePlatbaAdded = (platba: Omit<Platba, 'id'>) => {
    const newPlatba: Platba = {
      ...platba,
      id: Math.random().toString(36).substr(2, 9)
    };
    setPlatby([...platby, newPlatba]);
    showNotification('Platba byla úspěšně přidána');
  };

  const filteredNajemnici = najemnici.filter((najemnik) => {
    const matchesSearch = `${najemnik.jmeno} ${najemnik.prijmeni} ${najemnik.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch && (showInactive || najemnik.aktivni);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nájemníci</h1>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Zobrazit i bývalé nájemníky
                </span>
              </label>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingNajemnik(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center gap-2"
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Vyhledat nájemníka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input"
              />
            </div>
            
            <NajemniciTable
              najemnici={filteredNajemnici}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelectNajemnik={handleSelectNajemnik}
              selectedNajemnikId={selectedNajemnik?.id}
            />
          </>
        )}

        {selectedNajemnik && (
          <NajemnikDetail
            najemnik={selectedNajemnik}
            onClose={() => setSelectedNajemnik(undefined)}
          />
        )}
      </div>
    </Layout>
  );
}