import { supabase } from './supabase';
import type { Belge, CozumSatir } from '../types';

export interface AIMesaj {
  role: 'user' | 'assistant';
  content: string;
}

interface AIYanit {
  metin: string;
  token?: number;
  kalan?: number | null;
  premium?: boolean;
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
    if (ctx && typeof ctx.json === 'function') {
      try {
        const body = await ctx.json();
        if (body?.premium_gerekli) {
          throw new AIKotaHatasi(body.limit ?? 3);
        }
        if (body?.hata) throw new Error(body.hata);
      } catch (parseErr) {
        if (parseErr instanceof AIKotaHatasi) throw parseErr;
        if (parseErr instanceof Error && parseErr.message) throw parseErr;
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
