import { supabase } from './supabase';
import type { Belge, CozumSatir } from '../types';

export interface AIMesaj {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIKaynak {
  kaynak: string;             // örn. "Vergi Usul Kanunu (213 sayılı)"
  baslik: string;             // örn. "Madde 274 — Emtia"
  madde_no?: string | null;   // örn. "274" (chunk seviyesinde madde/paragraf no)
  url: string | null;
  benzerlik: number;          // 0..1
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

/**
 * Streaming sürüm — AI cevabı token-token gelir.
 * onChunk her parçada çağrılır, onDone final metayla biter (kalan, premium).
 * AIKotaHatasi fırlatabilir (kotanın bittiği durum).
 */
export const aiAsistanStream = async (
  params: {
    mesajlar: AIMesaj[];
    baglam?: { soruBaslik?: string; senaryo?: string };
  },
  onChunk: (text: string) => void,
  onDone?: (meta: { kalan?: number | null; premium?: boolean }) => void,
): Promise<void> => {
  const { data: oturum } = await supabase.auth.getSession();
  const token = oturum.session?.access_token;
  if (!token) throw new Error('Giriş yapmanız gerekiyor');

  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supaUrl) throw new Error('VITE_SUPABASE_URL tanımlı değil');
  const url = `${supaUrl.replace(/\/$/, '')}/functions/v1/ai-asistan?stream=1`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok || !res.body) {
    // 4xx / 5xx: body'yi parse edip uygun hata fırlat
    const body = await res.text().catch(() => '');
    try {
      const parsed = JSON.parse(body) as { premium_gerekli?: boolean; limit?: number; hata?: string };
      if (parsed?.premium_gerekli) throw new AIKotaHatasi(parsed.limit ?? 3);
      throw new Error(parsed?.hata ?? `Stream hatası ${res.status}`);
    } catch (e) {
      if (e instanceof AIKotaHatasi) throw e;
      throw new Error(`Stream hatası ${res.status}: ${body.slice(0, 200)}`);
    }
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let meta: { kalan?: number | null; premium?: boolean } = {};
  let bittiSignal = false;

  while (!bittiSignal) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed.startsWith('data:')) continue;
      const json = trimmed.slice(5).trim();
      if (!json) continue;
      try {
        const data = JSON.parse(json) as
          | { type: 'meta'; kalan?: number | null; premium?: boolean }
          | { type: 'chunk'; text: string }
          | { type: 'done' }
          | { type: 'error'; message: string };
        if (data.type === 'meta') {
          meta = { kalan: data.kalan, premium: data.premium };
        } else if (data.type === 'chunk') {
          onChunk(data.text);
        } else if (data.type === 'error') {
          throw new Error(data.message);
        } else if (data.type === 'done') {
          bittiSignal = true;
        }
      } catch (parseErr) {
        // Parse hatası — sadece logla, devam et
        console.warn('SSE parse hatası:', parseErr);
      }
    }
  }

  onDone?.(meta);
};

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
