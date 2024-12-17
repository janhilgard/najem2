import React from 'react';
import { FileText, FileCheck, FileX } from 'lucide-react';

interface PredpisTypeToggleProps {
  selectedType: 'all' | 'active' | 'completed';
  onTypeChange: (type: 'all' | 'active' | 'completed') => void;
  stats: {
    total: number;
    aktivni: number;
    ukoncene: number;
  };
}

export default function PredpisTypeToggle({
  selectedType,
  onTypeChange,
  stats
}: PredpisTypeToggleProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onTypeChange('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          selectedType === 'all'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <FileText className="h-5 w-5" />
        <span className="font-medium">Všechny předpisy</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {stats.total}
        </span>
      </button>
      
      <button
        onClick={() => onTypeChange('active')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          selectedType === 'active'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <FileCheck className="h-5 w-5" />
        <span className="font-medium">Aktivní předpisy</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {stats.aktivni}
        </span>
      </button>
      
      <button
        onClick={() => onTypeChange('completed')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          selectedType === 'completed'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <FileX className="h-5 w-5" />
        <span className="font-medium">Ukončené předpisy</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {stats.ukoncene}
        </span>
      </button>
    </div>
  );
}