import React from 'react';
import type { Jednotka } from '../types';

interface JednotkaFormProps {
  jednotka?: Jednotka;
  onSubmit: (data: Omit<Jednotka, 'id'>) => void;
  onCancel: () => void;
}

const DISPOZICE = ['1+kk', '1+1', '2+kk', '2+1', '3+kk', '3+1', '4+kk', '4+1'] as const;

export default function JednotkaForm({ jednotka, onSubmit, onCancel }: JednotkaFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      cisloJednotky: formData.get('cisloJednotky') as string,
      dispozice: formData.get('dispozice') as Jednotka['dispozice'],
      plocha: Number(formData.get('plocha')),
      ulice: formData.get('ulice') as string,
      cisloPopisne: formData.get('cisloPopisne') as string,
      mesto: formData.get('mesto') as string,
      psc: formData.get('psc') as string
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cisloJednotky" className="block text-sm font-medium text-gray-700">
            Číslo jednotky
          </label>
          <input
            type="text"
            name="cisloJednotky"
            id="cisloJednotky"
            defaultValue={jednotka?.cisloJednotky}
            required
            className="mt-1 input"
            placeholder="např. A123"
          />
        </div>
        <div>
          <label htmlFor="dispozice" className="block text-sm font-medium text-gray-700">
            Dispozice
          </label>
          <select
            name="dispozice"
            id="dispozice"
            defaultValue={jednotka?.dispozice}
            required
            className="mt-1 input"
          >
            <option value="">Vyberte dispozici</option>
            {DISPOZICE.map((dispozice) => (
              <option key={dispozice} value={dispozice}>
                {dispozice}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="plocha" className="block text-sm font-medium text-gray-700">
          Plocha (m²)
        </label>
        <input
          type="number"
          name="plocha"
          id="plocha"
          defaultValue={jednotka?.plocha}
          required
          min="0"
          step="0.1"
          className="mt-1 input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ulice" className="block text-sm font-medium text-gray-700">
            Ulice
          </label>
          <input
            type="text"
            name="ulice"
            id="ulice"
            defaultValue={jednotka?.ulice}
            required
            className="mt-1 input"
          />
        </div>
        <div>
          <label htmlFor="cisloPopisne" className="block text-sm font-medium text-gray-700">
            Číslo popisné
          </label>
          <input
            type="text"
            name="cisloPopisne"
            id="cisloPopisne"
            defaultValue={jednotka?.cisloPopisne}
            required
            className="mt-1 input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="mesto" className="block text-sm font-medium text-gray-700">
            Město
          </label>
          <input
            type="text"
            name="mesto"
            id="mesto"
            defaultValue={jednotka?.mesto}
            required
            className="mt-1 input"
          />
        </div>
        <div>
          <label htmlFor="psc" className="block text-sm font-medium text-gray-700">
            PSČ
          </label>
          <input
            type="text"
            name="psc"
            id="psc"
            defaultValue={jednotka?.psc}
            required
            pattern="[0-9]{5}"
            className="mt-1 input"
            placeholder="12345"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Zrušit
        </button>
        <button type="submit" className="btn btn-primary">
          {jednotka ? 'Upravit' : 'Přidat'} jednotku
        </button>
      </div>
    </form>
  );
}