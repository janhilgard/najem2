import React, { useState } from 'react';
import type { Platba } from '../types';
import { CreditCard, Wallet } from 'lucide-react';

interface PlatbaFormProps {
  platba?: Platba;
  defaultNajemnikId?: string;
  onSubmit: (data: Omit<Platba, 'id'>) => void;
  onCancel: () => void;
}

export default function PlatbaForm({ platba, defaultNajemnikId, onSubmit, onCancel }: PlatbaFormProps) {
  const [selectedNajemnik, setSelectedNajemnik] = useState(defaultNajemnikId || platba?.najemnikId || '');
  const [castkaNajem, setCastkaNajem] = useState(platba?.castkaNajem || 0);
  const [castkaPoplatky, setCastkaPoplatky] = useState(platba?.castkaPoplatky || 0);
  const [castkaKauce, setCastkaKauce] = useState(platba?.castkaKauce || 0);
  const [celkovaCastka, setCelkovaCastka] = useState(platba?.celkovaCastka || 0);
  const [typPlatby, setTypPlatby] = useState<'bankovni_prevod' | 'hotovost'>(platba?.typPlatby || 'bankovni_prevod');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Automaticky počítá součet částek
  const vypoctenaCastka = castkaNajem + castkaPoplatky + castkaKauce;

  // Kontroluje, zda celková částka odpovídá součtu dílčích částek
  React.useEffect(() => {
    if (celkovaCastka !== vypoctenaCastka) {
      setValidationError('Celková částka musí odpovídat součtu nájmu, poplatků a kauce');
    } else {
      setValidationError(null);
    }
  }, [celkovaCastka, vypoctenaCastka]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Kontrola celkové částky před odesláním
    if (celkovaCastka !== vypoctenaCastka) {
      setValidationError('Celková částka musí odpovídat součtu nájmu, poplatků a kauce');
      return;
    }

    const formData = new FormData(e.currentTarget);
    onSubmit({
      najemnikId: selectedNajemnik,
      datum: formData.get('datum') as string,
      castkaNajem,
      castkaPoplatky,
      castkaKauce,
      celkovaCastka,
      poznamka: formData.get('poznamka') as string,
      stav: 'nespárováno',
      typPlatby
    });
  };

  // Aktualizuje celkovou částku při změně dílčích částek
  const handleCastkaChange = (
    value: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
    field: 'najem' | 'poplatky' | 'kauce'
  ) => {
    setter(value);
    const newCelkovaCastka = 
      (field === 'najem' ? value : castkaNajem) +
      (field === 'poplatky' ? value : castkaPoplatky) +
      (field === 'kauce' ? value : castkaKauce);
    setCelkovaCastka(newCelkovaCastka);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!defaultNajemnikId && (
        <div>
          <label htmlFor="najemnikId" className="block text-sm font-medium text-gray-700">
            Nájemník
          </label>
          <select
            name="najemnikId"
            id="najemnikId"
            value={selectedNajemnik}
            onChange={(e) => setSelectedNajemnik(e.target.value)}
            required
            className="mt-1 input"
          >
            <option value="">Vyberte nájemníka</option>
            <option value="1">Jan Novák</option>
            <option value="2">Marie Svobodová</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="datum" className="block text-sm font-medium text-gray-700">
          Datum platby
        </label>
        <input
          type="date"
          name="datum"
          id="datum"
          defaultValue={platba?.datum}
          required
          className="mt-1 input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Typ platby
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setTypPlatby('bankovni_prevod')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              typPlatby === 'bankovni_prevod'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Bankovní převod</span>
          </button>
          <button
            type="button"
            onClick={() => setTypPlatby('hotovost')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              typPlatby === 'hotovost'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span>Hotovost</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="castkaNajem" className="block text-sm font-medium text-gray-700">
            Částka nájem (Kč)
          </label>
          <input
            type="number"
            name="castkaNajem"
            id="castkaNajem"
            value={castkaNajem}
            onChange={(e) => handleCastkaChange(Number(e.target.value), setCastkaNajem, 'najem')}
            required
            min="0"
            className="mt-1 input"
          />
        </div>
        <div>
          <label htmlFor="castkaPoplatky" className="block text-sm font-medium text-gray-700">
            Částka poplatky (Kč)
          </label>
          <input
            type="number"
            name="castkaPoplatky"
            id="castkaPoplatky"
            value={castkaPoplatky}
            onChange={(e) => handleCastkaChange(Number(e.target.value), setCastkaPoplatky, 'poplatky')}
            required
            min="0"
            className="mt-1 input"
          />
        </div>
        <div>
          <label htmlFor="castkaKauce" className="block text-sm font-medium text-gray-700">
            Částka kauce (Kč)
          </label>
          <input
            type="number"
            name="castkaKauce"
            id="castkaKauce"
            value={castkaKauce}
            onChange={(e) => handleCastkaChange(Number(e.target.value), setCastkaKauce, 'kauce')}
            required
            min="0"
            className="mt-1 input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="celkovaCastka" className="block text-sm font-medium text-gray-700">
          Celková částka (Kč)
        </label>
        <input
          type="number"
          name="celkovaCastka"
          id="celkovaCastka"
          value={celkovaCastka}
          onChange={(e) => setCelkovaCastka(Number(e.target.value))}
          required
          min="0"
          className={`mt-1 input ${validationError ? 'border-red-500' : ''}`}
        />
        {validationError && (
          <p className="mt-1 text-sm text-red-600">{validationError}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Vypočtená částka: {vypoctenaCastka.toLocaleString()} Kč
        </p>
      </div>

      <div>
        <label htmlFor="poznamka" className="block text-sm font-medium text-gray-700">
          Poznámka
        </label>
        <textarea
          name="poznamka"
          id="poznamka"
          defaultValue={platba?.poznamka}
          rows={3}
          className="mt-1 input"
          placeholder="Volitelná poznámka k platbě..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Zrušit
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!!validationError}
        >
          {platba ? 'Upravit' : 'Přidat'} platbu
        </button>
      </div>
    </form>
  );
}