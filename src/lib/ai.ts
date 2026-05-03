import { supabase } from './supabase';
import type { Belge, CozumSatir } from '../types';

export interface AIMesaj {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIKaynak {
  kaynak: string;       // 'TDHP-MSUGT', 'VUK', 'KDV-UT' ...
  baslik: string;       // 'Madde 234', '100 - KASA'
  url: string | null;
  benzerlik: number;    // 0..1
}

interface AIYanit {
  metin: string;
  token?: number;
  kalan?: number | null;
  premium?: boolean;
  kaynaklar?: AIKaynak[];
}

export interface MevzuatChunk {
  kaynak: string;
  baslik: string;
  url?: string;
  metin: string;
  guncellendi?: string;
}

interface EmbedSonuc {
  eklendi: number;
  hata: number;
  eklenenler: { kaynak: string; baslik: string }[];
  hatalar: { index: number; baslik: string; hata: string }[];
}

export class AIKotaHatasi extends Error {
  limit: number;
  constructor(limit: number) {
    super(`Günlük AI sorgu hakkın doldu (${limit}/gün). Premium ile sınırsız.`);
    this.name = 'AIKotaHatasi';
    this.limit = limit;
  }
}

const edgeFetch = async <T>(yol: string, govde: Record<string, unknown>): Promise<T> => {
  const { data: oturum } = await supabase.auth.getSession();
  const token = oturum.session?.access_token;
  if (!token) throw new Error('Giriş yapmanız gerekiyor');

  const { data, error } = await supabase.functions.invoke<T & { hata?: string }>(yol, {
    body: govde,
  });

  if (error) {
    const ctx = (error as { context?: Response }).context;
    if (ctx) {
      // Body'yi text olarak oku — JSON ise parse et, değilse ham metni göster
      let bodyText = '';
      try {
        bodyText = await ctx.text();
      } catch {
        // ignore
      }
      if (bodyText) {
        let parsed: { premium_gerekli?: boolean; limit?: number; hata?: string; detay?: string } | null = null;
        try {
          parsed = JSON.parse(bodyText);
        } catch {
          // JSON değil, plain text
        }
        if (parsed?.premium_gerekli) {
          throw new AIKotaHatasi(parsed.limit ?? 3);
        }
        if (parsed?.hata) {
          const detay = parsed.detay ? ` — ${parsed.detay}` : '';
          throw new Error(`${parsed.hata}${detay}`);
        }
        // JSON değil veya hata field'ı yok → raw body'yi göster (status code dahil)
        throw new Error(`Edge Function ${ctx.status}: ${bodyText.slice(0, 300)}`);
      }
    }
    throw new Error(error.message);
  }
  if (data && (data as { hata?: string }).hata) {
    throw new Error((data as { hata: string }).hata);
  }
  return data as T;
};

export const aiYanlisAnalizi = (params: {
  soruBaslik: string;
  senaryo: string;
  dogruCozum: CozumSatir[];
  kullaniciCevap: CozumSatir[];
}): Promise<AIYanit> => edgeFetch<AIYanit>('ai-yanlis-analizi', params);

export const aiAsistan = (params: {
  mesajlar: AIMesaj[];
  baglam?: { soruBaslik?: string; senaryo?: string };
}): Promise<AIYanit> => edgeFetch<AIYanit>('ai-asistan', params);

export const aiBelgeUret = (params: {
  soruBaslik: string;
  senaryo: string;
  aciklama?: string;
  cozum: CozumSatir[];
}): Promise<{ belgeler: Belge[]; token?: number }> =>
  edgeFetch<{ belgeler: Belge[]; token?: number }>('ai-belge-uret', params);

/** Admin: Mevzuat chunk'larını embedleyip mevzuat_chunklar tablosuna yaz */
export const mevzuatEmbed = (params: {
  chunklar: MevzuatChunk[];
}): Promise<EmbedSonuc> => edgeFetch<EmbedSonuc>('mevzuat-embed', params);
