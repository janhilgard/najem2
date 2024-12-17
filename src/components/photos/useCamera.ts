import { useState, useRef, useEffect } from 'react';

interface UseCameraOptions {
  onError?: (error: string) => void;
}

export function useCamera({ onError }: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const startCamera = async () => {
    if (isInitializing) return;
    setIsInitializing(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsReady(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      onError?.(getErrorMessage(err));
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  };

  const capturePhoto = async (): Promise<string | null> => {
    if (!videoRef.current || !isReady) {
      onError?.('Kamera není připravena.');
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      canvas.remove();
      
      return imageData;
    } catch (err) {
      console.error('Error capturing photo:', err);
      onError?.('Nepodařilo se pořídit fotografii.');
      return null;
    }
  };

  const getErrorMessage = (error: any): string => {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        return 'Přístup k fotoaparátu byl zamítnut. Povolte prosím přístup ke kameře.';
      }
      if (error.name === 'NotFoundError') {
        return 'Nebyl nalezen žádný fotoaparát.';
      }
      if (error.name === 'NotReadableError') {
        return 'Fotoaparát je již používán jinou aplikací.';
      }
    }
    return 'Nepodařilo se získat přístup k fotoaparátu.';
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    isReady,
    isInitializing,
    startCamera,
    stopCamera,
    capturePhoto
  };
}