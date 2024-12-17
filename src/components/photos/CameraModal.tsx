import React, { useEffect } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { useCamera } from './useCamera';

interface CameraModalProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const { 
    videoRef, 
    isReady, 
    isInitializing,
    startCamera, 
    stopCamera, 
    capturePhoto 
  } = useCamera({
    onError: (error) => {
      alert(error);
      onClose();
    }
  });

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = async () => {
    if (!isReady) return;

    const imageData = await capturePhoto();
    if (imageData) {
      onCapture(imageData);
      onClose();
    }
  };

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
            disabled={!isReady || isInitializing}
            className={`p-4 rounded-full ${
              isReady && !isInitializing
                ? 'bg-white text-gray-900 hover:bg-gray-100' 
                : 'bg-gray-400 text-gray-600'
            } transition-colors relative`}
          >
            {isInitializing ? (
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