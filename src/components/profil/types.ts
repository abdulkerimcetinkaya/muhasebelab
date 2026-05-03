// Profil bölümleri arasında paylaşılan tipler.
export type Sinif = '' | '1' | '2' | '3' | '4' | 'mezun' | 'diger';
export type Hedef = '' | 'vize-final' | 'kpss' | 'genel' | 'belirsiz';

export interface ProfilBilgi {
  universite: string;
  bolum: string;
  sinif: Sinif;
  hedef: Hedef;
  dogumYili: string;
  bultenIzni: boolean;
}

export const PROFIL_BOS: ProfilBilgi = {
  universite: '',
  bolum: '',
  sinif: '',
  hedef: '',
  dogumYili: '',
  bultenIzni: false,
};

export const SINIF_LABEL: Record<Exclude<Sinif, ''>, string> = {
  '1': '1. Sınıf',
  '2': '2. Sınıf',
  '3': '3. Sınıf',
  '4': '4. Sınıf',
  mezun: 'Mezun',
  diger: 'Diğer',
};

export const HEDEF_LABEL: Record<Exclude<Hedef, ''>, string> = {
  'vize-final': 'Vize / Final',
  kpss: 'KPSS',
  genel: 'Genel pratik',
  belirsiz: 'Henüz belirsiz',
};

export type Bolum = 'genel' | 'yetkinlik' | 'rozetler' | 'uyelik' | 'hesap';
