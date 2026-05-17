// Profil bölümleri arasında paylaşılan tipler.
//
// SADELEŞTİRME (migration 20260518000001): Eski 13 alanlık karmaşa
// (Profilin/Hedefin/Tanışalım) yerine sade "Hakkında" yapısı:
//   - Durum (Öğrenci / Çalışan)
//   - Doğum tarihi (gün + ay + yıl)
//   - Öğrenciyse: universite + bolum + sinif
//   - Çalışansa: tecrube_yil
//
// Eski enum'lar (Hedef, Meslek, HaftalikHedef, NeredenDuydu) ve type'lar
// kaldırıldı — DB kolonları geriye uyumluluk için duruyor ama TS tarafında
// kullanılmıyor.

export type Sinif = '' | '1' | '2' | '3' | '4' | 'mezun' | 'diger';
export type Durum = '' | 'ogrenci' | 'calisan';

export interface ProfilBilgi {
  ad: string;
  soyad: string;
  durum: Durum;
  dogumGun: string;  // '1' - '31'
  dogumAy: string;   // '1' - '12'
  dogumYil: string;  // '1950' - '2015'
  universite: string;
  bolum: string;
  sinif: Sinif;
  tecrubeYil: string; // '0' - '60'
  bultenIzni: boolean;
}

export const PROFIL_BOS: ProfilBilgi = {
  ad: '',
  soyad: '',
  durum: '',
  dogumGun: '',
  dogumAy: '',
  dogumYil: '',
  universite: '',
  bolum: '',
  sinif: '',
  tecrubeYil: '',
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

export const AY_LABEL: Record<string, string> = {
  '1': 'Ocak',
  '2': 'Şubat',
  '3': 'Mart',
  '4': 'Nisan',
  '5': 'Mayıs',
  '6': 'Haziran',
  '7': 'Temmuz',
  '8': 'Ağustos',
  '9': 'Eylül',
  '10': 'Ekim',
  '11': 'Kasım',
  '12': 'Aralık',
};

export type Bolum = 'genel' | 'yetkinlik' | 'rozetler' | 'uyelik' | 'hesap';
