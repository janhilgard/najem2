import React from 'react';
import { Users, UserX } from 'lucide-react';

interface TenantTypeToggleProps {
  showInactive: boolean;
  onToggle: (showInactive: boolean) => void;
  aktivniCount: number;
  neaktivniCount: number;
}

export default function TenantTypeToggle({
  showInactive,
  onToggle,
  aktivniCount,
  neaktivniCount
}: TenantTypeToggleProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          !showInactive 
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Users className="h-5 w-5" />
        <span className="font-medium">Aktivní</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {aktivniCount}
        </span>
      </button>
      
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          showInactive
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <UserX className="h-5 w-5" />
        <span className="font-medium">Bývalí</span>
        <span className="ml-1.5 px-2 py-0.5 text-sm rounded-full bg-white shadow-sm">
          {neaktivniCount}
        </span>
      </button>
    </div>
  );
}