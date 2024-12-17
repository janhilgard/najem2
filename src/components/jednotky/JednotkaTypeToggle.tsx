import React from 'react';
import { Building2, Home } from 'lucide-react';

interface JednotkaTypeToggleProps {
  showObsazene: boolean;
  onToggle: (showObsazene: boolean) => void;
  volneCount: number;
  obsazeneCount: number;
}

export default function JednotkaTypeToggle({
  showObsazene,
  onToggle,
  volneCount,
  obsazeneCount
}: JednotkaTypeToggleProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          !showObsazene 
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="font-medium">Volné jednotky</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {volneCount}
        </span>
      </button>
      
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          showObsazene
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Building2 className="h-5 w-5" />
        <span className="font-medium">Obsazené jednotky</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {obsazeneCount}
        </span>
      </button>
    </div>
  );
}