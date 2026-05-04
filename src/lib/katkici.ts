import { supabase } from './supabase';
import type {
  KatkiciBasvuruRow,
  KatkiciDurum,
  KatkiciUnvan,
} from './database.types';

export type KatkiciBasvuru = KatkiciBasvuruRow;

export const UNVAN_ETIKETLERI: Record<KatkiciUnvan, string> = {
  akademisyen: 'Akademisyen',
  smmm: 'SMMM',
  smmm_stajer: 'SMMM Stajyeri',
  diger: 'Diğer',
};

export const DURUM_ETIKETLERI: Record<KatkiciDurum, string> = {
  beklemede: 'Beklemede',
  onayli: 'Onaylı',
  reddedildi: 'Reddedildi',
};

// =====================================================================
// Kullanıcı tarafı
// =====================================================================

export interface YeniBasvuru {
  ad_soyad: string;
  unvan: KatkiciUnvan;
  kurum: string | null;
  iletisim_email: string | null;
  aciklama: string;
}

/** Kendi başvurum (varsa). */
export const benimBasvurumYukle = async (
  userId: string,
): Promise<KatkiciBasvuru | null> => {
  const { data, error } = await supabase
    .from('katkici_basvurulari')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data as KatkiciBasvuru | null) ?? null;
};

/** Yeni başvuru gönder. */
export const basvuruGonder = async (input: YeniBasvuru): Promise<string> => {
  const { data, error } = await supabase.rpc('katkici_basvur', {
    _ad_soyad: input.ad_soyad,
    _unvan: input.unvan,
    _kurum: input.kurum,
    _iletisim_email: input.iletisim_email,
    _aciklama: input.aciklama,
  });
  if (error) throw error;
  return data as string;
};

// =====================================================================
// Admin tarafı
// =====================================================================

/** Tüm başvurular (admin için). */
export const tumBasvurulariYukle = async (): Promise<KatkiciBasvuru[]> => {
  const { data, error } = await supabase
    .from('katkici_basvurulari')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as KatkiciBasvuru[];
};

/** Bekleyen başvuru sayısı (admin paneline göstermek için). */
export const bekleyenBasvuruSayisi = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('katkici_basvurulari')
    .select('id', { count: 'exact', head: true })
    .eq('durum', 'beklemede');
  if (error) throw error;
  return count ?? 0;
};

export const basvuruOnayla = async (basvuruId: string): Promise<void> => {
  const { error } = await supabase.rpc('admin_katkici_onayla', {
    _basvuru_id: basvuruId,
  });
  if (error) throw error;
};

export const basvuruReddet = async (
  basvuruId: string,
  sebep: string,
): Promise<void> => {
  const { error } = await supabase.rpc('admin_katkici_reddet', {
    _basvuru_id: basvuruId,
    _sebep: sebep,
  });
  if (error) throw error;
};

export const katkiciYetkisiKaldir = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('admin_katkici_yetki_kaldir', {
    _user_id: userId,
  });
  if (error) throw error;
};

/**
 * Bir kullanıcının onaylı katkı (eklediği yayınlanan soru) sayısı.
 * Profilde "5 onayda Premium" göstergesi için kullanılır.
 */
export const onayliKatkiSayisi = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('sorular')
    .select('id', { count: 'exact', head: true })
    .eq('ekleyen_id', userId)
    .eq('durum', 'onayli');
  if (error) throw error;
  return count ?? 0;
};
