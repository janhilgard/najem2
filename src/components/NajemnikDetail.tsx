import React, { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { 
  FileText, 
  X,
  Plus,
  Download,
  Trash2
} from 'lucide-react';
import type { Najemnik, Dokument, Fotografie } from '../types';
import SaldoPrehled from './SaldoPrehled';
import PhotoGallery from './photos/PhotoGallery';
import DocumentDropzone from './documents/DocumentDropzone';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface NajemnikDetailProps {
  najemnik: Najemnik;
  onClose: () => void;
  onUpdate: (najemnik: Najemnik) => void;
}

export default function NajemnikDetail({ najemnik, onClose, onUpdate }: NajemnikDetailProps) {
  const [activeTab, setActiveTab] = useState<'saldo' | 'dokumenty' | 'fotografie'>('saldo');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; dokumentId: string | null }>({
    isOpen: false,
    dokumentId: null
  });

  const handlePhotoAdd = (photoData: Omit<Fotografie, 'id'>) => {
    const newPhoto: Fotografie = {
      ...photoData,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    const updatedNajemnik: Najemnik = {
      ...najemnik,
      fotografie: [...(najemnik.fotografie || []), newPhoto]
    };
    
    onUpdate(updatedNajemnik);
  };

  const handlePhotoDelete = (photoId: string) => {
    const updatedNajemnik: Najemnik = {
      ...najemnik,
      fotografie: najemnik.fotografie?.filter(f => f.id !== photoId) || []
    };
    
    onUpdate(updatedNajemnik);
  };

  const handleDocumentsAdded = (files: File[]) => {
    const newDocuments: Dokument[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      nazev: file.name,
      typ: file.type,
      velikost: file.size,
      datum: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));

    const updatedNajemnik: Najemnik = {
      ...najemnik,
      dokumenty: [...(najemnik.dokumenty || []), ...newDocuments]
    };

    onUpdate(updatedNajemnik);
  };

  const handleDocumentDelete = (dokumentId: string) => {
    setDeleteDialog({ isOpen: true, dokumentId });
  };

  const confirmDocumentDelete = () => {
    if (deleteDialog.dokumentId) {
      const updatedNajemnik: Najemnik = {
        ...najemnik,
        dokumenty: najemnik.dokumenty?.filter(d => d.id !== deleteDialog.dokumentId) || []
      };
      
      onUpdate(updatedNajemnik);
    }
    setDeleteDialog({ isOpen: false, dokumentId: null });
  };

  const handleDocumentDownload = (dokument: Dokument) => {
    const link = document.createElement('a');
    link.href = dokument.url;
    link.download = dokument.nazev;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-3xl bg-white shadow-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {najemnik.jmeno} {najemnik.prijmeni}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 py-2 border-b">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('saldo')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'saldo'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Saldo
              </button>
              <button
                onClick={() => setActiveTab('dokumenty')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'dokumenty'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dokumenty
              </button>
              <button
                onClick={() => setActiveTab('fotografie')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'fotografie'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Fotografie
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'saldo' && (
              <div className="space-y-4">
                <SaldoPrehled
                  najemnikId={najemnik.id}
                  platby={[]}
                  predpisy={[]}
                  onPlatbaAdded={() => {}}
                />
              </div>
            )}

            {activeTab === 'dokumenty' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Dokumenty</h3>
                </div>

                <div className="flex gap-4">
                  {/* Upload button */}
                  <label className="btn btn-primary flex items-center gap-2 cursor-pointer whitespace-nowrap">
                    <Plus className="h-5 w-5" />
                    <span>Nahrát dokument</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          handleDocumentsAdded(files);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>

                  {/* Dropzone */}
                  <div className="flex-1">
                    <DocumentDropzone onDocumentsAdded={handleDocumentsAdded} />
                  </div>
                </div>

                <div className="bg-white rounded-lg border divide-y">
                  {najemnik.dokumenty?.map((dokument) => (
                    <div key={dokument.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{dokument.nazev}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(dokument.datum), 'PPP', { locale: cs })} • {(dokument.velikost / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDocumentDownload(dokument)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Stáhnout dokument"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDocumentDelete(dokument.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          title="Smazat dokument"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!najemnik.dokumenty || najemnik.dokumenty.length === 0) && (
                    <div className="p-8 text-center text-gray-500">
                      Zatím zde nejsou žádné dokumenty
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'fotografie' && (
              <PhotoGallery
                photos={najemnik.fotografie || []}
                onPhotoAdd={handlePhotoAdd}
                onPhotoDelete={handlePhotoDelete}
              />
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, dokumentId: null })}
        onConfirm={confirmDocumentDelete}
        title="Smazat dokument"
        message="Opravdu chcete smazat tento dokument? Tuto akci nelze vrátit zpět."
      />
    </div>
  );
}