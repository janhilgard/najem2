import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/Layout';
import JednotkyTable from '../components/JednotkyTable';
import JednotkaForm from '../components/JednotkaForm';
import type { Jednotka } from '../types';

// Sample data - would come from API/database in real app
const initialJednotky: Jednotka[] = [
  {
    id: '1',
    cisloJednotky: 'A123',
    dispozice: '2+1',
    plocha: 65,
    ulice: 'Květná',
    cisloPopisne: '123',
    mesto: 'Praha',
    psc: '12000'
  },
  {
    id: '2',
    cisloJednotky: 'B45',
    dispozice: '1+kk',
    plocha: 35,
    ulice: 'Zahradní',
    cisloPopisne: '45',
    mesto: 'Praha',
    psc: '12000'
  },
  {
    id: '3',
    cisloJednotky: 'C789',
    dispozice: '3+1',
    plocha: 85,
    ulice: 'Polní',
    cisloPopisne: '789',
    mesto: 'Praha',
    psc: '12000'
  }
];

export default function Jednotky() {
  const [jednotky, setJednotky] = useState<Jednotka[]>(initialJednotky);
  const [showForm, setShowForm] = useState(false);
  const [editingJednotka, setEditingJednotka] = useState<Jednotka | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = (data: Omit<Jednotka, 'id'>) => {
    const newJednotka: Jednotka = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };
    setJednotky([...jednotky, newJednotka]);
    setShowForm(false);
  };

  const handleEdit = (jednotka: Jednotka) => {
    setEditingJednotka(jednotka);
    setShowForm(true);
  };

  const handleUpdate = (data: Omit<Jednotka, 'id'>) => {
    if (!editingJednotka) return;
    const updatedJednotky = jednotky.map((j) =>
      j.id === editingJednotka.id ? { ...data, id: editingJednotka.id } : j
    );
    setJednotky(updatedJednotky);
    setShowForm(false);
    setEditingJednotka(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Opravdu chcete smazat tuto jednotku?')) {
      setJednotky(jednotky.filter((j) => j.id !== id));
    }
  };

  const filteredJednotky = jednotky.filter((jednotka) =>
    `${jednotka.cisloJednotky} ${jednotka.ulice} ${jednotka.mesto}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Bytové jednotky</h1>
          <button
            onClick={() => {
              setEditingJednotka(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center gap-2"
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Vyhledat jednotku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input"
              />
            </div>
            <JednotkyTable
              jednotky={filteredJednotky}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </Layout>
  );
}