// Profil bölümleri arasında paylaşılan tipler.
export type Sinif = '' | '1' | '2' | '3' | '4' | 'mezun' | 'diger';

// Platform kullanım hedefi — genişletilmiş set (migration 20260517000001).
// Eski 4 seçenek (vize-final/kpss/genel/belirsiz) yetersizdi; yeni hedef
// kümesi öğrenci + mezun + meslek hayatı kapsayacak şekilde geniş.
export type Hedef =
  | ''
  | 'vize-final'
  | 'butunleme'
  | 'kpss'
  | 'smmm-yeterlilik'
  | 'tazeleme'
  | 'genel'
  | 'ogrenme'
  | 'belirsiz';

// Meslek / kullanıcı durumu — "sınıf"tan ayrı, kapsayıcı.
// Sınıf hâlâ öğrenciler için ayrı alan (1/2/3/4 vs. mezun).
export type Meslek =
  | ''
  | 'ogrenci'
  | 'mezun'
  | 'smmm_stajyer'
  | 'smmm'
  | 'akademisyen'
  | 'is_ariyor'
  | 'diger';

export type HaftalikHedef = '' | '1-2sa' | '3-5sa' | '5-10sa' | '10plus';

export type NeredenDuydu =
  | ''
  | 'arkadas'
  | 'sosyal_medya'
  | 'youtube'
  | 'hoca'
  | 'google'
  | 'haber'
  | 'diger';

export interface ProfilBilgi {
  ad: string;
  soyad: string;
  meslek: Meslek;
  universite: string;
  bolum: string;
  sinif: Sinif;
  mezuniyetYili: string;
  sektor: string;
  tecrubeYil: string;
  hedef: Hedef;
  haftalikHedef: HaftalikHedef;
  neredenDuydu: NeredenDuydu;
  dogumYili: string;
  bultenIzni: boolean;
}

export const PROFIL_BOS: ProfilBilgi = {
  ad: '',
  soyad: '',
  meslek: '',
  universite: '',
  bolum: '',
  sinif: '',
  mezuniyetYili: '',
  sektor: '',
  tecrubeYil: '',
  hedef: '',
  haftalikHedef: '',
  neredenDuydu: '',
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
  'vize-final': 'Vize / Final hazırlığı',
  butunleme: 'Bütünleme hazırlığı',
  kpss: 'KPSS Muhasebe',
  'smmm-yeterlilik': 'SMMM Yeterlilik sınavı',
  tazeleme: 'Mesleki bilgi tazeleme',
  genel: 'Genel pratik',
  ogrenme: 'İlk öğrenme / merak',
  belirsiz: 'Henüz belirsiz',
};

export const MESLEK_LABEL: Record<Exclude<Meslek, ''>, string> = {
  ogrenci: 'Öğrenci',
  mezun: 'Mezun',
  smmm_stajyer: 'SMMM Stajyeri',
  smmm: 'SMMM / Mali Müşavir',
  akademisyen: 'Akademisyen',
  is_ariyor: 'İş Arıyorum',
  diger: 'Diğer',
};

export const HAFTALIK_HEDEF_LABEL: Record<Exclude<HaftalikHedef, ''>, string> = {
  '1-2sa': '1-2 saat',
  '3-5sa': '3-5 saat',
  '5-10sa': '5-10 saat',
  '10plus': '10+ saat',
};

export const NEREDEN_DUYDU_LABEL: Record<Exclude<NeredenDuydu, ''>, string> = {
  arkadas: 'Bir arkadaşımdan',
  sosyal_medya: 'Instagram / X / TikTok',
  youtube: 'YouTube',
  hoca: 'Üniversitedeki hocamdan',
  google: 'Google aramasından',
  haber: 'Haber / blog yazısından',
  diger: 'Başka bir yerden',
};

export type Bolum = 'genel' | 'yetkinlik' | 'rozetler' | 'uyelik' | 'hesap';
