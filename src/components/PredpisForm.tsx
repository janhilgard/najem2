import React from 'react';
import type { Predpis } from '../types';

interface PredpisFormProps {
  predpis?: Predpis;
  onSubmit: (data: Omit<Predpis, 'id'>) => void;
  onCancel: () => void;
}

export default function PredpisForm({ predpis, onSubmit, onCancel }: PredpisFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      najemnikId: formData.get('najemnikId') as string,
      mesicniNajem: Number(formData.get('mesicniNajem')),
      zalohaSluzby: Number(formData.get('zalohaSluzby')),
      platnostOd: formData.get('platnostOd') as string,
      platnostDo: formData.get('platnostDo') as string,
      uhrazeno: predpis?.uhrazeno || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="najemnikId" className="block text-sm font-medium text-gray-700">
          Nájemník
        </label>
        <select
          name="najemnikId"
          id="najemnikId"
          defaultValue={predpis?.najemnikId}
          required
          className="mt-1 input"
        >
          <option value="">Vyberte nájemníka</option>
          {/* In real app, fetch tenants from API/database */}
          <option value="1">Jan Novák</option>
          <option value="2">Marie Svobodová</option>
          <option value="3">Petr Dvořák</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="mesicniNajem" className="block text-sm font-medium text-gray-700">
            Měsíční nájem (Kč)
          </label>
          <input
            type="number"
            name="mesicniNajem"
            id="mesicniNajem"
            defaultValue={predpis?.mesicniNajem}
            required
            min="0"
            className="mt-1 input"
          />
        </div>
        <div>
          <label htmlFor="zalohaSluzby" className="block text-sm font-medium text-gray-700">
            Záloha na služby (Kč)
          </label>
          <input
            type="number"
            name="zalohaSluzby"
            id="zalohaSluzby"
            defaultValue={predpis?.zalohaSluzby}
            required
            min="0"
            className="mt-1 input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="platnostOd" className="block text-sm font-medium text-gray-700">
            Platnost od
          </label>
          <input
            type="date"
            name="platnostOd"
            id="platnostOd"
            defaultValue={predpis?.platnostOd}
            required
            className="mt-1 input"
          />
        </div>
        <div>
          <label htmlFor="platnostDo" className="block text-sm font-medium text-gray-700">
            Platnost do
          </label>
          <input
            type="date"
            name="platnostDo"
            id="platnostDo"
            defaultValue={predpis?.platnostDo}
            required
            className="mt-1 input"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Zrušit
        </button>
        <button type="submit" className="btn btn-primary">
          {predpis ? 'Upravit' : 'Přidat'} předpis
        </button>
      </div>
    </form>
  );
}