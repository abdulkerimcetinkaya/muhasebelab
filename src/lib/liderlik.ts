import { supabase } from './supabase';
import type { LiderlikDonem, LiderlikRow } from '../types';

interface RawRow {
  id: string;
  kullanici_adi: string | null;
  universite: string | null;
  sinif: string | null;
  avatar_url: string | null;
  cozulen_soru: number | null;
  toplam_puan: number | null;
  rozet_sayisi: number | null;
}

const normalize = (rows: RawRow[]): LiderlikRow[] =>
  rows.map((r) => ({
    id: r.id,
    kullaniciAdi: r.kullanici_adi || 'Öğrenci',
    universite: r.universite,
    sinif: r.sinif,
    avatarUrl: r.avatar_url,
    cozulenSoru: r.cozulen_soru ?? 0,
    toplamPuan: r.toplam_puan ?? 0,
    rozetSayisi: r.rozet_sayisi ?? 0,
  }));

/**
 * Liderlik tablosunu döndürür. Puana göre azalan sıralı.
 * Anonim ve giriş yapmış kullanıcılar için açık. Tüm dönemler RPC üzerinden
 * çalışır — RPC'ler security_definer ile yalnızca güvenli alanları döndürür
 * (email/dogum_yili/premium_bitis gibi PII dahil değil).
 */
export const liderlikYukle = async (
  donem: LiderlikDonem,
  limit = 100,
): Promise<LiderlikRow[]> => {
  const rpc =
    donem === 'tum'
      ? 'bireysel_liderlik'
      : donem === 'hafta'
        ? 'haftalik_liderlik'
        : 'aylik_liderlik';
  // Bu RPC'ler database.types.ts'te tanımlı değil — runtime'da çalışırlar.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)(rpc, { _limit: limit });
  if (error) throw error;
  return normalize((data ?? []) as RawRow[]);
};

/**
 * Bir kullanıcının sıralamadaki yerini bulur (top-limit içinde).
 * Yoksa null döner.
 */
export const kullaniciSiralamasi = (
  liste: LiderlikRow[],
  userId: string | null | undefined,
): { sira: number; row: LiderlikRow } | null => {
  if (!userId) return null;
  const idx = liste.findIndex((r) => r.id === userId);
  if (idx === -1) return null;
  return { sira: idx + 1, row: liste[idx] };
};
