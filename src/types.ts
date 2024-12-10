export interface Najemnik {
  id: string;
  jmeno: string;
  prijmeni: string;
  email: string;
  telefon: string;
  jednotkaId?: string;
  aktivni: boolean;
  dokumenty?: Dokument[];
  fotografie?: Fotografie[];
}

export interface Jednotka {
  id: string;
  cisloJednotky: string;
  dispozice: '1+kk' | '1+1' | '2+kk' | '2+1' | '3+kk' | '3+1' | '4+kk' | '4+1';
  plocha: number;
  ulice: string;
  cisloPopisne: string;
  mesto: string;
  psc: string;
}

export interface Platba {
  id: string;
  najemnikId: string;
  predpisId?: string;
  datum: string;
  castkaNajem: number;
  castkaPoplatky: number;
  castkaKauce: number;
  celkovaCastka: number;
  poznamka?: string;
  stav: 'nespárováno' | 'částečně_spárováno' | 'spárováno';
  typPlatby: 'bankovni_prevod' | 'hotovost';
}

export interface Predpis {
  id: string;
  najemnikId: string;
  mesicniNajem: number;
  zalohaSluzby: number;
  platnostOd: string;
  platnostDo: string;
  uhrazeno: number;
}

export interface Aktivita {
  id: string;
  typ: 'platba' | 'predpis' | 'najemnik' | 'jednotka';
  datum: string;
  najemnik: {
    id: string;
    jmeno: string;
    prijmeni: string;
  };
  jednotka: {
    id: string;
    nazev: string;
  };
  castka?: number;
  popis: string;
}

export interface Dokument {
  id: string;
  nazev: string;
  typ: string;
  velikost: number;
  datum: string;
  url: string;
}

export interface Fotografie {
  id: string;
  nazev: string;
  datum: string;
  url: string;
  thumbnail: string;
}