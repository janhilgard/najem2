import { useState, useRef, useEffect } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsReady(true);
        }
      } catch (err) {
        console.error('Camera initialization error:', err);
        setError(getErrorMessage(err));
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = async (): Promise<string | null> => {
    if (!videoRef.current || !isReady) {
      setError('Kamera není připravena.');
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      canvas.remove();

      return imageData;
    } catch (err) {
      console.error('Photo capture error:', err);
      setError('Nepodařilo se pořídit fotografii.');
      return null;
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      switch (error.name) {
        case 'NotAllowedError':
          return 'Přístup k fotoaparátu byl zamítnut. Povolte prosím přístup ke kameře.';
        case 'NotFoundError':
          return 'Nebyl nalezen žádný fotoaparát.';
        case 'NotReadableError':
          return 'Fotoaparát je již používán jinou aplikací.';
        default:
          return error.message;
      }
    }
    return 'Nepodařilo se získat přístup k fotoaparátu.';
  };

  return {
    videoRef,
    isReady,
    isLoading,
    error,
    takePhoto
  };
}