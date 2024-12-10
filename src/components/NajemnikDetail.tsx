import React, { useState } from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { 
  FileText, 
  Image, 
  Upload, 
  Download, 
  Trash2, 
  X,
  Plus
} from 'lucide-react';
import type { Najemnik, Dokument, Fotografie } from '../types';
import SaldoPrehled from './SaldoPrehled';

interface NajemnikDetailProps {
  najemnik: Najemnik;
  onClose: () => void;
}

export default function NajemnikDetail({ najemnik, onClose }: NajemnikDetailProps) {
  const [activeTab, setActiveTab] = useState<'saldo' | 'dokumenty' | 'fotografie'>('saldo');
  const [selectedImage, setSelectedImage] = useState<Fotografie | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Here you would typically upload the file to your server
      console.log('Uploading files:', files);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Here you would typically upload the images to your server
      console.log('Uploading images:', files);
    }
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
                  platby={[]} // Pass actual platby data
                  predpisy={[]} // Pass actual predpisy data
                  onPlatbaAdded={() => {}} // Pass actual handler
                />
              </div>
            )}

            {activeTab === 'dokumenty' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Dokumenty</h3>
                  <label className="btn btn-primary flex items-center gap-2 cursor-pointer">
                    <Upload className="h-5 w-5" />
                    <span>Nahrát dokument</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                    />
                  </label>
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
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Fotografie</h3>
                  <label className="btn btn-primary flex items-center gap-2 cursor-pointer">
                    <Plus className="h-5 w-5" />
                    <span>Přidat fotografie</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {najemnik.fotografie?.map((foto) => (
                    <div
                      key={foto.id}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                      onClick={() => setSelectedImage(foto)}
                    >
                      <img
                        src={foto.thumbnail}
                        alt={foto.nazev}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <button className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Image className="h-8 w-8" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!najemnik.fotografie || najemnik.fotografie.length === 0) && (
                    <div className="col-span-full p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
                      Zatím zde nejsou žádné fotografie
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-90" onClick={() => setSelectedImage(null)} />
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.nazev}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-medium">{selectedImage.nazev}</p>
              <p className="text-xs opacity-75">
                {format(new Date(selectedImage.datum), 'PPP', { locale: cs })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}