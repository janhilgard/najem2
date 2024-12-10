import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, onClose, duration = 3000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white border-l-4 border-green-500 shadow-md rounded-lg p-4 flex items-center space-x-3">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <p className="text-sm text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}