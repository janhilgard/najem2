import React from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const {
    videoRef,
    isReady,
    isLoading,
    error,
    takePhoto
  } = useCamera();

  const handleCapture = async () => {
    if (!isReady) return;
    
    const photo = await takePhoto();
    if (photo) {
      onCapture(photo);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Zavřít
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <div className="relative h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 inset-x-0 p-6 flex justify-center items-center gap-4 bg-gradient-to-t from-black/50 to-transparent">
          <button
            onClick={onClose}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleCapture}
            disabled={!isReady || isLoading}
            className={`p-4 rounded-full ${
              isReady && !isLoading
                ? 'bg-white text-gray-900 hover:bg-gray-100' 
                : 'bg-gray-400 text-gray-600'
            } transition-colors`}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}