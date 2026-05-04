import { supabase } from './supabase';
import type { MuavinHesapRow, MuavinTip } from './database.types';

export type MuavinHesap = MuavinHesapRow;

export const TIP_ETIKETLERI: Record<MuavinTip, string> = {
  musteri: 'Müşteri',
  tedarikci: 'Tedarikçi',
  banka: 'Banka',
  personel: 'Personel',
  kasa: 'Kasa',
  stok: 'Stok',
  diger: 'Diğer',
};

export const TIP_LISTESI: MuavinTip[] = [
  'musteri',
  'tedarikci',
  'banka',
  'personel',
  'kasa',
  'stok',
  'diger',
];

const TABLO = 'muavin_hesaplar';

/** Admin için — aktif/pasif tüm muavinler, kod sırasına göre. */
export const tumMuavinleriYukle = async (): Promise<MuavinHesap[]> => {
  const { data, error } = await supabase
    .from(TABLO)
    .select('*')
    .order('kod', { ascending: true });
  if (error) throw error;
  return (data ?? []) as MuavinHesap[];
};

/** Sadece aktif muavinler — soru editöründe ve dropdown'larda kullanılır. */
export const aktifMuavinleriYukle = async (): Promise<MuavinHesap[]> => {
  const { data, error } = await supabase
    .from(TABLO)
    .select('*')
    .eq('aktif', true)
    .order('kod', { ascending: true });
  if (error) throw error;
  return (data ?? []) as MuavinHesap[];
};

/** Belirli bir ana hesabın aktif muavinleri (örn: 120 → 120.001, 120.002...). */
export const anaHesabinMuavinleri = async (anaKod: string): Promise<MuavinHesap[]> => {
  const { data, error } = await supabase
    .from(TABLO)
    .select('*')
    .eq('ana_kod', anaKod)
    .eq('aktif', true)
    .order('kod', { ascending: true });
  if (error) throw error;
  return (data ?? []) as MuavinHesap[];
};

export type YeniMuavin = {
  kod: string;
  ana_kod: string;
  ad: string;
  tip: MuavinTip;
  aciklama?: string | null;
  sira?: number;
  aktif?: boolean;
};

export const muavinYarat = async (input: YeniMuavin): Promise<MuavinHesap> => {
  const { data, error } = await supabase
    .from(TABLO)
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as MuavinHesap;
};

export const muavinGuncelle = async (
  kod: string,
  patch: Partial<YeniMuavin>,
): Promise<void> => {
  const { error } = await supabase.from(TABLO).update(patch).eq('kod', kod);
  if (error) throw error;
};

export const muavinSil = async (kod: string): Promise<void> => {
  const { error } = await supabase.from(TABLO).delete().eq('kod', kod);
  if (error) throw error;
};

/**
 * Bir ana hesap için bir sonraki müsait muavin kodunu üretir.
 * 120 → ilk muavin yoksa 120.001, varsa 120.{son+1} (zero-padded 3 haneli).
 */
export const sonrakiMuavinKodu = async (anaKod: string): Promise<string> => {
  const { data, error } = await supabase
    .from(TABLO)
    .select('kod')
    .eq('ana_kod', anaKod)
    .order('kod', { ascending: false })
    .limit(1);
  if (error) throw error;
  if (!data || data.length === 0) {
    return `${anaKod}.001`;
  }
  const sonKod = data[0].kod as string;
  const parcalar = sonKod.split('.');
  const sonSayi = parseInt(parcalar[parcalar.length - 1], 10);
  parcalar[parcalar.length - 1] = String(sonSayi + 1).padStart(3, '0');
  return parcalar.join('.');
};
