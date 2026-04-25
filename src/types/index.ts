export type HesapTuru = 'AKTİF' | 'PASİF' | 'GELİR' | 'GİDER' | 'MALİYET' | 'KAPANIŞ';
export type HesapSinif = '1' | '2' | '3' | '4' | '5' | '6' | '7';

export interface Hesap {
  kod: string;
  ad: string;
  sinif: HesapSinif;
  tur: HesapTuru;
}

export type Zorluk = 'kolay' | 'orta' | 'zor';

export interface CozumSatir {
  kod: string;
  borc: number;
  alacak: number;
}

export type BelgeTuru = 'fatura' | 'perakende-fis' | 'cek' | 'senet' | 'dekont';

export interface FaturaKalem {
  aciklama: string;
  miktar: number;
  birim: string;
  birimFiyat: number;
  iskontoOrani?: number;
}

export interface TarafBilgi {
  unvan: string;
  vkn?: string;
  tcKimlik?: string;
  vergiDairesi?: string;
  adres?: string;
}

export interface FaturaBelge {
  tur: 'fatura';
  baslik?: string;
  faturaTipi?: 'satis' | 'alis' | 'iade';
  faturaNo: string;
  tarih: string;
  ettn?: string;
  satici: TarafBilgi;
  alici: TarafBilgi;
  kalemler: FaturaKalem[];
  kdvOrani: number;
  ekKdvDahilTutar?: number;
  tevkifatPay?: number;
  tevkifatPayda?: number;
  tevkifatAciklama?: string;
  not?: string;
  odemeBilgisi?: string;
}

export interface PerakendeFisKalem {
  aciklama: string;
  miktar: number;
  birimFiyat: number;
  kdvOrani: number;
}

export interface PerakendeFisBelge {
  tur: 'perakende-fis';
  baslik?: string;
  fisNo: string;
  tarih: string;
  saat?: string;
  zNo?: string;
  ettn?: string;
  isletme: TarafBilgi;
  kalemler: PerakendeFisKalem[];
  odemeYontemi?: 'NAKIT' | 'KART' | 'KARMA';
  not?: string;
}

export interface CekBelge {
  tur: 'cek';
  baslik?: string;
  cekNo: string;
  bankaAdi: string;
  subeAdi?: string;
  subeKodu?: string;
  hesapNo?: string;
  iban?: string;
  duzenlemeTarihi: string;
  duzenlemeYeri?: string;
  vadeTarihi: string;
  tutar: number;
  lehtar: string;
  kesideci: TarafBilgi;
  not?: string;
}

export interface SenetBelge {
  tur: 'senet';
  baslik?: string;
  senetTipi?: 'bono' | 'police';
  senetNo: string;
  duzenlemeTarihi: string;
  duzenlemeYeri?: string;
  vadeTarihi: string;
  vadeYeri?: string;
  tutar: number;
  lehtar: TarafBilgi;
  borclu: TarafBilgi;
  not?: string;
}

export type DekontIslemTuru =
  | 'HAVALE'
  | 'EFT'
  | 'KREDI_KULLANIMI'
  | 'KREDI_TAKSIT'
  | 'MASRAF'
  | 'FAIZ_GELIRI'
  | 'POS_TAHSILATI';

export interface DekontBelge {
  tur: 'dekont';
  baslik?: string;
  bankaAdi: string;
  subeAdi?: string;
  subeKodu?: string;
  dekontNo: string;
  islemTarihi: string;
  islemSaati?: string;
  valor?: string;
  islemTuru: DekontIslemTuru;
  aciklama: string;
  hesapSahibi: TarafBilgi;
  hesapNo?: string;
  iban?: string;
  karsiTaraf?: TarafBilgi;
  karsiIban?: string;
  tutar: number;
  bsmv?: number;
  masraf?: number;
  netTutar?: number;
  yon: 'BORC' | 'ALACAK';
  bakiye?: number;
  not?: string;
}

export type Belge = FaturaBelge | PerakendeFisBelge | CekBelge | SenetBelge | DekontBelge;

export interface Soru {
  id: string;
  baslik: string;
  zorluk: Zorluk;
  senaryo: string;
  ipucu: string;
  aciklama: string;
  cozum: CozumSatir[];
  belgeler?: Belge[];
}

export interface SoruWithUnite extends Soru {
  uniteId: string;
  uniteAd: string;
  uniteIcon: string;
}

export interface Unite {
  id: string;
  ad: string;
  thiingsIcon: string;
  aciklama: string;
  sorular: Soru[];
}

export interface UserRow {
  kod: string;
  borc: string | number;
  alacak: string | number;
  aciklama?: string;
}

export type FisTuru = 'M' | 'T' | 'Ö' | 'A' | 'K' | 'V';

export interface FisBilgi {
  yevmiyeNo: string;
  tarih: string;
  fisTuru: FisTuru;
  belgeNo: string;
  aciklama: string;
}

export interface CozulenKayit {
  tarih: string;
  zorluk: Zorluk;
}

export interface Ilerleme {
  kullaniciAdi: string;
  cozulenler: Record<string, CozulenKayit>;
  yanlislar: Record<string, number>;
  puan: number;
  streak: number;
  sonCozumTarihi: string | null;
  aktiviteTarihleri: Record<string, number>;
  kazanilanRozetler: Record<string, string>;
  tema: 'light' | 'dark';
  onboardingTamam?: boolean;
}

export interface Istatistik {
  cozulenSayi: number;
  toplamSoru: number;
  zorCozum: number;
  ortaCozum: number;
  kolayCozum: number;
  uniteTamamlanmis: Record<string, boolean>;
  puan: number;
  streak: number;
}

export interface Rozet {
  id: string;
  ad: string;
  aciklama: string;
  icon: string;
  kontrol: (s: Istatistik) => boolean;
}
