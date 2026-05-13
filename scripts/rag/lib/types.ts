/**
 * RAG pipeline'ında geçen tüm ortak tipler.
 */

export type Kategori = 'kanun' | 'standart' | 'teblig' | 'rehber';
export type Format = 'pdf' | 'html';
export type Durum = 'beklemede' | 'isleniyor' | 'tamamlandi' | 'hata';

export interface Kaynak {
  id: string;
  baslik: string;
  kategori: Kategori;
  yayinci: string;
  url: string;
  format: Format;
  yayim_tarihi?: string;
  konular?: string[];
  kritiklik?: 'yuksek' | 'orta' | 'normal';
  not?: string;
  /** True ise bu kaynak bir indeks sayfasıdır — pipeline alt-linkleri ayıklar */
  kompozit?: boolean;
}

export interface SourcesConfig {
  kaynaklar: Kaynak[];
}

export interface IndirilmisKaynak {
  kaynak: Kaynak;
  /** Ham bayt buffer veya HTML string */
  icerik: Buffer | string;
  /** SHA-256(icerik) — incremental update için */
  hash: string;
}

export interface CikartilmisKaynak {
  kaynak: Kaynak;
  /** Düz metne dönüştürülmüş tam içerik */
  metin: string;
  hash: string;
}

export interface Chunk {
  kaynak_id: string;
  sira: number;
  baslik: string | null;
  madde_no: string | null;
  metin: string;
  token_sayisi: number;
  /** SHA-256(metin) — dedupe için */
  metin_hash: string;
}

export interface EmbeddedChunk extends Chunk {
  embedding: number[];
}
