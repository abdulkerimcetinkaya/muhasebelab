// Profil bölümleri arasında paylaşılan tipler.
//
// EĞİTİM DURUMU YAPISI (migration 20260518000003): Düz 3 ana alan +
// 2 conditional alan.
//
//   1. egitim_durumu — lise / universite / mezun (bağımsız)
//   2. universite (okul adı) — text, her durum için kullanılabilir
//   3. sinif — lise için 9-12, üniversite için hazırlık/1-4 (mezun için yok)
//   4. dogum_tarihi — date input
//   5. meslek — sadece "mezun" seçildiyse gösterilir
//
// Persona modeli (20260518000002) iptal edildi: gerçek hayatta bir öğrenci
// aynı zamanda stajyer olabiliyor, persona binary seçim zorluyordu.
// Eğitim ve meslek artık bağımsız alanlar.

export type EgitimDurumu = '' | 'lise' | 'universite' | 'mezun';

// Sınıf — eğitim durumuna göre filtrelenir:
//   - lise: 9, 10, 11, 12
//   - üniversite: hazırlık, 1, 2, 3, 4
//   - mezun: gösterilmez
export type Sinif =
  | ''
  | 'hazirlik'
  | '1' | '2' | '3' | '4'
  | '9' | '10' | '11' | '12';

// Meslek — sadece "mezun" durumu için. 5 sade seçenek.
export type Meslek =
  | ''
  | 'smmm_stajyer'
  | 'smmm'
  | 'akademisyen'
  | 'calismiyor'
  | 'diger';

export interface ProfilBilgi {
  ad: string;
  soyad: string;
  egitimDurumu: EgitimDurumu;
  universite: string;  // okul adı (lise + üni + mezun olunan kurum)
  sinif: Sinif;
  dogumGun: string;   // '1' - '31'
  dogumAy: string;    // '1' - '12'
  dogumYil: string;   // '1950' - '2015'
  meslek: Meslek;
  bultenIzni: boolean;
}

export const PROFIL_BOS: ProfilBilgi = {
  ad: '',
  soyad: '',
  egitimDurumu: '',
  universite: '',
  sinif: '',
  dogumGun: '',
  dogumAy: '',
  dogumYil: '',
  meslek: '',
  bultenIzni: false,
};

export const EGITIM_DURUMU_LABEL: Record<Exclude<EgitimDurumu, ''>, string> = {
  lise: 'Lise',
  universite: 'Üniversite',
  mezun: 'Mezun',
};

// Lise sınıfları (9-12)
export const LISE_SINIFLARI: Exclude<Sinif, ''>[] = ['9', '10', '11', '12'];

// Üniversite sınıfları (hazırlık + 1-4)
export const UNI_SINIFLARI: Exclude<Sinif, ''>[] = ['hazirlik', '1', '2', '3', '4'];

export const SINIF_LABEL: Record<Exclude<Sinif, ''>, string> = {
  hazirlik: 'Hazırlık',
  '1': '1. Sınıf',
  '2': '2. Sınıf',
  '3': '3. Sınıf',
  '4': '4. Sınıf',
  '9': '9. Sınıf',
  '10': '10. Sınıf',
  '11': '11. Sınıf',
  '12': '12. Sınıf',
};

export const MESLEK_LABEL: Record<Exclude<Meslek, ''>, string> = {
  smmm_stajyer: 'SMMM Stajyeri',
  smmm: 'SMMM',
  akademisyen: 'Akademisyen',
  calismiyor: 'Çalışmıyorum',
  diger: 'Diğer',
};

export type Bolum = 'genel' | 'yetkinlik' | 'rozetler' | 'uyelik' | 'hesap';
