import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface DocumentDropzoneProps {
  onDocumentsAdded: (files: File[]) => void;
}

export default function DocumentDropzone({ onDocumentsAdded }: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onDocumentsAdded(files);
    }
  }, [onDocumentsAdded]);

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative h-32 border-2 border-dashed rounded-lg flex items-center justify-center
        transition-colors cursor-pointer
        ${isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
    >
      {isDragging ? (
        <div className="pointer-events-none text-center">
          <Upload className="h-6 w-6 mx-auto text-blue-500 mb-1" />
          <p className="text-blue-600 font-medium text-sm">Pusťte pro nahrání dokumentů</p>
        </div>
      ) : (
        <div className="text-center">
          <FileText className="h-6 w-6 mx-auto text-gray-400 mb-1" />
          <p className="text-sm text-gray-500">
            Přetáhněte sem dokumenty
          </p>
          <p className="text-xs text-gray-400">
            nebo klikněte pro výběr
          </p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                onDocumentsAdded(files);
              }
              e.target.value = '';
            }}
          />
        </div>
      )}
    </div>
  );
}