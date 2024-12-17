import React from 'react';
import { X } from 'lucide-react';
import type { Fotografie } from '../../types';

interface PhotoViewerProps {
  photo: Fotografie;
  onClose: () => void;
}

export default function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black bg-opacity-90">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="h-8 w-8" />
      </button>
      
      <img
        src={photo.url}
        alt={photo.nazev}
        className="max-w-full max-h-full object-contain"
      />
      
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-sm font-medium">{photo.nazev}</p>
        <p className="text-xs opacity-75">
          {new Date(photo.datum).toLocaleDateString('cs')}
        </p>
      </div>
    </div>
  );
}