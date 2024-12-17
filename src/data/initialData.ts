import type { Najemnik, Platba, Predpis, Jednotka } from '../types';

export const initialJednotky: Jednotka[] = [
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
  },
  {
    id: '3',
    cisloJednotky: 'C789',
    dispozice: '3+1',
    plocha: 85,
    ulice: 'Polní',
    cisloPopisne: '789',
    mesto: 'Praha',
    psc: '12000'
  }
];

export const initialNajemnici: Najemnik[] = [
  {
    id: '1',
    jmeno: 'Jan',
    prijmeni: 'Novák',
    email: 'jan.novak@email.cz',
    telefon: '+420 777 888 999',
    jednotkaId: '1',
    aktivni: true
  },
  {
    id: '2',
    jmeno: 'Marie',
    prijmeni: 'Svobodová',
    email: 'marie.svobodova@email.cz',
    telefon: '+420 666 777 888',
    jednotkaId: '2',
    aktivni: true
  },
  {
    id: '3',
    jmeno: 'Petr',
    prijmeni: 'Dvořák',
    email: 'petr.dvorak@email.cz',
    telefon: '+420 555 666 777',
    aktivni: false
  }
];

export const initialPlatby: Platba[] = [
  {
    id: '1',
    najemnikId: '1',
    predpisId: '1',
    datum: '2024-03-05',
    castkaNajem: 0,
    castkaPoplatky: 3500,
    castkaKauce: 25000,
    celkovaCastka: 28500,
    poznamka: 'Kauce a služby za březen 2024',
    stav: 'částečně_spárováno',
    typPlatby: 'bankovni_prevod'
  },
  {
    id: '2',
    najemnikId: '2',
    datum: '2024-03-03',
    castkaNajem: 9000,
    castkaPoplatky: 2500,
    castkaKauce: 18000,
    celkovaCastka: 29500,
    poznamka: 'Nájem + služby za březen 2024',
    stav: 'spárováno',
    typPlatby: 'hotovost'
  }
];

export const initialPredpisy: Predpis[] = [
  {
    id: '1',
    najemnikId: '1',
    mesicniNajem: 12500,
    zalohaSluzby: 3500,
    platnostOd: '2024-03-01',
    platnostDo: '2024-12-31',
    uhrazeno: 3500
  },
  {
    id: '2',
    najemnikId: '2',
    mesicniNajem: 9000,
    zalohaSluzby: 2500,
    platnostOd: '2024-03-01',
    platnostDo: '2024-12-31',
    uhrazeno: 11500
  }
];