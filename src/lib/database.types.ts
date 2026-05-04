// MuhasebeLab — Supabase tablo tipleri (manuel — supabase gen types ile değiştirilecek)
// Şema kaynağı: supabase/migrations/20260422000001_init.sql
// NOT: Supabase generic'i interface yerine type ister (Record<string, unknown> uyumu).

export type Sinif = '1' | '2' | '3' | '4' | '5' | '6' | '7';
export type HesapTur = 'AKTİF' | 'PASİF' | 'GELİR' | 'GİDER' | 'MALİYET' | 'KAPANIŞ';
export type SoruDurum = 'taslak' | 'inceleme' | 'onayli' | 'arsiv';
export type Zorluk = 'kolay' | 'orta' | 'zor';
export type OdemeDurum = 'beklemede' | 'basarili' | 'iptal' | 'iade' | 'hata';
export type OdemeDonem = 'aylik' | 'yillik';
export type MuavinTip = 'musteri' | 'tedarikci' | 'banka' | 'personel' | 'kasa' | 'stok' | 'diger';

export type HesapPlaniRow = {
  kod: string;
  ad: string;
  sinif: Sinif;
  tur: HesapTur;
  sira: number;
};

export type MuavinHesapRow = {
  kod: string;
  ana_kod: string;
  ad: string;
  tip: MuavinTip;
  aciklama: string | null;
  sira: number;
  aktif: boolean;
  created_at: string;
  updated_at: string;
};

export type UnitesRow = {
  id: string;
  ad: string;
  aciklama: string | null;
  thiings_icon: string | null;
  sira: number;
  icerik: unknown | null;
  icerik_guncellendi: string | null;
  created_at: string;
};

export type SorularRow = {
  id: string;
  unite_id: string;
  konu_id: string | null;
  baslik: string;
  zorluk: Zorluk;
  senaryo: string;
  ipucu: string | null;
  aciklama: string | null;
  durum: SoruDurum;
  kaynak: string | null;
  yayinlanma_tarihi: string | null;
  belgeler: unknown;
  created_at: string;
  updated_at: string;
};

export type UniteKonusuRow = {
  id: string;
  unite_id: string;
  ad: string;
  aciklama: string | null;
  icerik: unknown | null;
  icerik_guncellendi: string | null;
  sira: number;
  created_at: string;
  updated_at: string;
};

export type CozumlerRow = {
  id: string;
  soru_id: string;
  sira: number;
  kod: string;
  borc: number;
  alacak: number;
};

export type RozetlerKatalogRow = {
  id: string;
  ad: string;
  aciklama: string;
  icon: string;
  sira: number;
};

export type KullaniciRow = {
  id: string;
  kullanici_adi: string;
  email: string | null;
  tema: 'light' | 'dark';
  premium_bitis: string | null;
  gunluk_limit_reset: string | null;
  gunluk_cozum_sayisi: number;
  // Profil — onboarding ve profil sayfasında doldurulur (20260427000001 migration)
  universite: string | null;
  bolum: string | null;
  sinif: '1' | '2' | '3' | '4' | 'mezun' | 'diger' | null;
  hedef: 'vize-final' | 'kpss' | 'genel' | 'belirsiz' | null;
  dogum_yili: number | null;
  avatar_url: string | null;
  bulten_izni: boolean;
  kvkk_kabul_tarihi: string | null;
  created_at: string;
  updated_at: string;
};

export type IlerlemeRow = {
  id: string;
  user_id: string;
  soru_id: string;
  dogru_mu: boolean;
  sure_saniye: number | null;
  // 20260503000007 migration — yardım takibi + best-score puanlama
  kullanilan_ai: boolean;
  cozum_gosterildi: boolean;
  kazanilan_puan: number | null;
  created_at: string;
};

export type KazanilanRozetRow = {
  user_id: string;
  rozet_id: string;
  kazanilan_tarih: string;
};

export type AktiviteRow = {
  user_id: string;
  tarih: string;
  cozulen_sayi: number;
};

export type OdemeRow = {
  id: string;
  user_id: string;
  iyzico_ref: string | null;
  tutar: number;
  para_birimi: string;
  donem: OdemeDonem;
  durum: OdemeDurum;
  basarili_tarih: string | null;
  ham_yanit: unknown;
  created_at: string;
  conversation_id: string | null;
  plan_kodu: string | null;
  callback_token: string | null;
  hata_mesaji: string | null;
};

export type PlanRow = {
  kod: string;
  ad: string;
  aciklama: string | null;
  donem: OdemeDonem;
  ay_sayisi: number;
  tutar: number;
  para_birimi: string;
  aktif: boolean;
  sira: number;
};

export type MevzuatChunkRow = {
  id: string;
  kaynak: string;
  baslik: string;
  url: string | null;
  metin: string;
  embedding: unknown;          // pgvector — TS tarafında opaque
  guncellendi: string | null;
  created_at: string;
};

export type SoruHataRow = {
  id: string;
  soru_id: string;
  user_id: string | null;
  aciklama: string;
  durum: 'acik' | 'incelemede' | 'duzeltildi' | 'reddedildi';
  created_at: string;
};

export type BildirimTip = 'duyuru' | 'bilgi' | 'uyari' | 'guncelleme';

export type BildirimRow = {
  id: string;
  baslik: string;
  metin: string;
  tip: BildirimTip;
  link: string | null;
  yayinda: boolean;
  olusturan_id: string | null;
  created_at: string;
};

export type BildirimOkunduRow = {
  bildirim_id: string;
  user_id: string;
  okundu_at: string;
};

export type SozlukTerimiRow = {
  slug: string;
  baslik: string;
  kisa_aciklama: string;
  uzun_icerik: string;
  ornek: string | null;
  ilgili_terimler: string[];
  ilgili_unite_ids: number[];
  ilgili_hesap_kodlari: string[];
  goruntuleme_sayisi: number;
  yayinda: boolean;
  created_at: string;
  updated_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      hesap_plani: {
        Row: HesapPlaniRow;
        Insert: HesapPlaniRow;
        Update: Partial<HesapPlaniRow>;
        Relationships: [];
      };
      muavin_hesaplar: {
        Row: MuavinHesapRow;
        Insert: Omit<MuavinHesapRow, 'created_at' | 'updated_at' | 'aciklama' | 'sira' | 'aktif'> & {
          created_at?: string;
          updated_at?: string;
          aciklama?: string | null;
          sira?: number;
          aktif?: boolean;
        };
        Update: Partial<MuavinHesapRow>;
        Relationships: [];
      };
      unites: {
        Row: UnitesRow;
        Insert: Omit<UnitesRow, 'created_at' | 'icerik' | 'icerik_guncellendi'> & {
          created_at?: string;
          icerik?: unknown | null;
          icerik_guncellendi?: string | null;
        };
        Update: Partial<UnitesRow>;
        Relationships: [];
      };
      sorular: {
        Row: SorularRow;
        Insert: Omit<SorularRow, 'created_at' | 'updated_at' | 'belgeler' | 'durum'> & {
          created_at?: string;
          updated_at?: string;
          belgeler?: unknown;
          durum?: SoruDurum;
        };
        Update: Partial<SorularRow>;
        Relationships: [];
      };
      cozumler: {
        Row: CozumlerRow;
        Insert: Omit<CozumlerRow, 'id'> & { id?: string };
        Update: Partial<CozumlerRow>;
        Relationships: [];
      };
      rozetler_katalog: {
        Row: RozetlerKatalogRow;
        Insert: RozetlerKatalogRow;
        Update: Partial<RozetlerKatalogRow>;
        Relationships: [];
      };
      kullanicilar: {
        Row: KullaniciRow;
        Insert: Omit<KullaniciRow, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<KullaniciRow>;
        Relationships: [];
      };
      ilerleme: {
        Row: IlerlemeRow;
        Insert: Omit<
          IlerlemeRow,
          | 'id'
          | 'created_at'
          | 'sure_saniye'
          | 'kullanilan_ai'
          | 'cozum_gosterildi'
          | 'kazanilan_puan'
        > & {
          id?: string;
          created_at?: string;
          sure_saniye?: number | null;
          kullanilan_ai?: boolean;
          cozum_gosterildi?: boolean;
          kazanilan_puan?: number | null;
        };
        Update: Partial<IlerlemeRow>;
        Relationships: [];
      };
      kazanilan_rozetler: {
        Row: KazanilanRozetRow;
        Insert: Omit<KazanilanRozetRow, 'kazanilan_tarih'> & { kazanilan_tarih?: string };
        Update: Partial<KazanilanRozetRow>;
        Relationships: [];
      };
      aktivite: {
        Row: AktiviteRow;
        Insert: AktiviteRow;
        Update: Partial<AktiviteRow>;
        Relationships: [];
      };
      odemeler: {
        Row: OdemeRow;
        Insert: Omit<OdemeRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<OdemeRow>;
        Relationships: [];
      };
      soru_hatalari: {
        Row: SoruHataRow;
        Insert: Omit<SoruHataRow, 'id' | 'created_at' | 'durum'> & {
          id?: string;
          created_at?: string;
          durum?: SoruHataRow['durum'];
        };
        Update: Partial<SoruHataRow>;
        Relationships: [];
      };
      planlar: {
        Row: PlanRow;
        Insert: PlanRow;
        Update: Partial<PlanRow>;
        Relationships: [];
      };
      mevzuat_chunklar: {
        Row: MevzuatChunkRow;
        Insert: Omit<MevzuatChunkRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MevzuatChunkRow>;
        Relationships: [];
      };
      unite_konulari: {
        Row: UniteKonusuRow;
        Insert: Omit<UniteKonusuRow, 'created_at' | 'updated_at' | 'icerik' | 'icerik_guncellendi' | 'aciklama' | 'sira'> & {
          created_at?: string;
          updated_at?: string;
          icerik?: unknown | null;
          icerik_guncellendi?: string | null;
          aciklama?: string | null;
          sira?: number;
        };
        Update: Partial<UniteKonusuRow>;
        Relationships: [];
      };
      bildirimler: {
        Row: BildirimRow;
        Insert: Omit<BildirimRow, 'id' | 'created_at' | 'olusturan_id' | 'tip' | 'link' | 'yayinda'> & {
          id?: string;
          created_at?: string;
          olusturan_id?: string | null;
          tip?: BildirimTip;
          link?: string | null;
          yayinda?: boolean;
        };
        Update: Partial<BildirimRow>;
        Relationships: [];
      };
      bildirim_okundu: {
        Row: BildirimOkunduRow;
        Insert: Omit<BildirimOkunduRow, 'okundu_at'> & { okundu_at?: string };
        Update: Partial<BildirimOkunduRow>;
        Relationships: [];
      };
      sozluk_terimleri: {
        Row: SozlukTerimiRow;
        Insert: Omit<
          SozlukTerimiRow,
          | 'created_at'
          | 'updated_at'
          | 'goruntuleme_sayisi'
          | 'yayinda'
          | 'ilgili_terimler'
          | 'ilgili_unite_ids'
          | 'ilgili_hesap_kodlari'
          | 'ornek'
        > & {
          created_at?: string;
          updated_at?: string;
          goruntuleme_sayisi?: number;
          yayinda?: boolean;
          ilgili_terimler?: string[];
          ilgili_unite_ids?: number[];
          ilgili_hesap_kodlari?: string[];
          ornek?: string | null;
        };
        Update: Partial<SozlukTerimiRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      premium_kontenjan_kalan: {
        Args: Record<string, never>;
        Returns: number;
      };
      premium_erken_erisim_aktive: {
        Args: Record<string, never>;
        Returns: string;
      };
      kullanici_adi_uygun: {
        Args: { _ad: string };
        Returns: boolean;
      };
      sozluk_goruntule: {
        Args: { _slug: string };
        Returns: void;
      };
      hesap_sil: {
        Args: Record<string, never>;
        Returns: void;
      };
      admin_premium_ayarla: {
        Args: { _user_id: string; _yeni_bitis: string | null };
        Returns: string | null;
      };
    };
    Enums: {
      soru_durum: SoruDurum;
      zorluk: Zorluk;
      odeme_durum: OdemeDurum;
      odeme_donem: OdemeDonem;
    };
  };
};
