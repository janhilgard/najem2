import React from 'react';
import type { Najemnik, Jednotka } from '../types';

interface NajemnikFormProps {
  najemnik?: Najemnik;
  onSubmit: (data: Omit<Najemnik, 'id' | 'aktivni'>) => void;
  onCancel: () => void;
}

// Simulace dat jednotek - v reálné aplikaci by přišla z API/databáze
const dostupneJednotky: Jednotka[] = [
  {
    id: '1',
    cisloJednotky: 'A123',
    dispozice: '2+1',
    plocha: 65,
    ulice: 'Květná',
    cisloPopisne: '123',
    mesto: 'Praha',
    psc: '12000'
  },
  {
    id: '2',
    cisloJednotky: 'B45',
    dispozice: '1+kk',
    plocha: 35,
    ulice: 'Zahradní',
    cisloPopisne: '45',
    mesto: 'Praha',
    psc: '12000'
  }
];

export default function NajemnikForm({ najemnik, onSubmit, onCancel }: NajemnikFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      jmeno: formData.get('jmeno') as string,
      prijmeni: formData.get('prijmeni') as string,
      email: formData.get('email') as string,
      telefon: formData.get('telefon') as string,
      jednotkaId: formData.get('jednotkaId') as string || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="jmeno" className="block text-sm font-medium text-gray-700">
            Jméno
          </label>
          <input
            type="text"
            name="jmeno"
            id="jmeno"
            defaultValue={najemnik?.jmeno}
            required
            className="mt-1 input"
          />
        </div>
        <div>
          <label htmlFor="prijmeni" className="block text-sm font-medium text-gray-700">
            Příjmení
          </label>
          <input
            type="text"
            name="prijmeni"
            id="prijmeni"
            defaultValue={najemnik?.prijmeni}
            required
            className="mt-1 input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue={najemnik?.email}
          required
          className="mt-1 input"
        />
      </div>
      <div>
        <label htmlFor="telefon" className="block text-sm font-medium text-gray-700">
          Telefon
        </label>
        <input
          type="tel"
          name="telefon"
          id="telefon"
          defaultValue={najemnik?.telefon}
          required
          className="mt-1 input"
        />
      </div>
      <div>
        <label htmlFor="jednotkaId" className="block text-sm font-medium text-gray-700">
          Přiřazená jednotka
        </label>
        <select
          name="jednotkaId"
          id="jednotkaId"
          defaultValue={najemnik?.jednotkaId || ''}
          className="mt-1 input"
        >
          <option value="">Bez přiřazené jednotky</option>
          {dostupneJednotky.map((jednotka) => (
            <option key={jednotka.id} value={jednotka.id}>
              {jednotka.dispozice} - {jednotka.ulice} {jednotka.cisloPopisne}, {jednotka.mesto}
            </option>
          ))}
        </select>
        {!najemnik?.jednotkaId && (
          <p className="mt-1 text-sm text-gray-500">
            Nájemník bez přiřazené jednotky bude označen jako bývalý nájemník.
          </p>
        )}
      </div>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Zrušit
        </button>
        <button type="submit" className="btn btn-primary">
          {najemnik ? 'Upravit' : 'Přidat'} nájemníka
        </button>
      </div>
    </form>
  );
}