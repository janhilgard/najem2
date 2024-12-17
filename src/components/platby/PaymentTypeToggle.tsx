import React from 'react';
import { CreditCard, Wallet, Coins } from 'lucide-react';

interface PaymentTypeToggleProps {
  selectedType: 'all' | 'bankovni_prevod' | 'hotovost';
  onTypeChange: (type: 'all' | 'bankovni_prevod' | 'hotovost') => void;
  stats: {
    total: number;
    prevodemCount: number;
    hotovostCount: number;
  };
}

export default function PaymentTypeToggle({
  selectedType,
  onTypeChange,
  stats
}: PaymentTypeToggleProps) {
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
        <Coins className="h-5 w-5" />
        <span className="font-medium">Všechny platby</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {stats.total}
        </span>
      </button>
      
      <button
        onClick={() => onTypeChange('bankovni_prevod')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          selectedType === 'bankovni_prevod'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <CreditCard className="h-5 w-5" />
        <span className="font-medium">Bankovní převody</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {stats.prevodemCount}
        </span>
      </button>
      
      <button
        onClick={() => onTypeChange('hotovost')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          selectedType === 'hotovost'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Wallet className="h-5 w-5" />
        <span className="font-medium">Hotovostní platby</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {stats.hotovostCount}
        </span>
      </button>
    </div>
  );
}