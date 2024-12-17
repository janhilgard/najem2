import React, { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import CameraCapture from './CameraCapture';
import PhotoViewer from './PhotoViewer';
import PhotoDropzone from './PhotoDropzone';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import type { Fotografie } from '../../types';

interface PhotoGalleryProps {
  photos: Fotografie[];
  onPhotoAdd: (photo: Omit<Fotografie, 'id'>) => void;
  onPhotoDelete: (id: string) => void;
}

export default function PhotoGallery({ photos, onPhotoAdd, onPhotoDelete }: PhotoGalleryProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Fotografie | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; photoId: string | null }>({
    isOpen: false,
    photoId: null
  });

  const handleFilesAdded = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        if (imageData) {
          onPhotoAdd({
            nazev: file.name,
            datum: new Date().toISOString(),
            url: imageData,
            thumbnail: imageData
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = (imageData: string) => {
    onPhotoAdd({
      nazev: `Fotografie ${new Date().toLocaleString('cs')}`,
      datum: new Date().toISOString(),
      url: imageData,
      thumbnail: imageData
    });
  };

  const handleDeleteClick = (photoId: string) => {
    setDeleteDialog({ isOpen: true, photoId });
  };

  const confirmDelete = () => {
    if (deleteDialog.photoId) {
      onPhotoDelete(deleteDialog.photoId);
    }
    setDeleteDialog({ isOpen: false, photoId: null });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Camera button */}
        <button
          onClick={() => setShowCamera(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <Camera className="h-5 w-5" />
          <span>Fotoaparát</span>
        </button>

        {/* Dropzone */}
        <div className="flex-1">
          <PhotoDropzone onPhotosAdded={handleFilesAdded} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={photo.thumbnail}
              alt={photo.nazev}
              className="w-full h-full object-cover"
              onClick={() => setSelectedPhoto(photo)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleDeleteClick(photo.id)}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {photos.length === 0 && (
          <div className="col-span-full p-8 text-center border-2 border-dashed rounded-lg">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Zatím zde nejsou žádné fotografie</p>
            <p className="text-sm text-gray-400">
              Nahrajte fotografie nebo je pořiďte pomocí fotoaparátu
            </p>
          </div>
        )}
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={(imageData) => {
            handleCameraCapture(imageData);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, photoId: null })}
        onConfirm={confirmDelete}
        title="Smazat fotografii"
        message="Opravdu chcete smazat tuto fotografii? Tuto akci nelze vrátit zpět."
      />
    </div>
  );
}