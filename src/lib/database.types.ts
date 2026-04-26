// MuhasebeLab — Supabase tablo tipleri (manuel — supabase gen types ile değiştirilecek)
// Şema kaynağı: supabase/migrations/20260422000001_init.sql
// NOT: Supabase generic'i interface yerine type ister (Record<string, unknown> uyumu).

export type Sinif = '1' | '2' | '3' | '4' | '5' | '6' | '7';
export type HesapTur = 'AKTİF' | 'PASİF' | 'GELİR' | 'GİDER' | 'MALİYET' | 'KAPANIŞ';
export type SoruDurum = 'taslak' | 'inceleme' | 'onayli' | 'arsiv';
export type Zorluk = 'kolay' | 'orta' | 'zor';
export type OdemeDurum = 'beklemede' | 'basarili' | 'iptal' | 'iade' | 'hata';
export type OdemeDonem = 'aylik' | 'yillik';

export type HesapPlaniRow = {
  kod: string;
  ad: string;
  sinif: Sinif;
  tur: HesapTur;
  sira: number;
};

export type UnitesRow = {
  id: string;
  ad: string;
  aciklama: string | null;
  thiings_icon: string | null;
  sira: number;
  created_at: string;
};

export type SorularRow = {
  id: string;
  unite_id: string;
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

export type SoruHataRow = {
  id: string;
  soru_id: string;
  user_id: string | null;
  aciklama: string;
  durum: 'acik' | 'incelemede' | 'duzeltildi' | 'reddedildi';
  created_at: string;
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
      unites: {
        Row: UnitesRow;
        Insert: Omit<UnitesRow, 'created_at'> & { created_at?: string };
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
        Insert: Omit<IlerlemeRow, 'id' | 'created_at' | 'sure_saniye'> & {
          id?: string;
          created_at?: string;
          sure_saniye?: number | null;
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
    };
    Enums: {
      soru_durum: SoruDurum;
      zorluk: Zorluk;
      odeme_durum: OdemeDurum;
      odeme_donem: OdemeDonem;
    };
  };
};
