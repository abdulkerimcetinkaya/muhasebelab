import { supabase } from './supabase';

export type BildirimTip = 'duyuru' | 'bilgi' | 'uyari' | 'guncelleme';

export interface Bildirim {
  id: string;
  baslik: string;
  metin: string;
  tip: BildirimTip;
  link: string | null;
  yayinda: boolean;
  olusturan_id: string | null;
  created_at: string;
}

export interface BildirimWithRead extends Bildirim {
  okundu: boolean;
}

const TABLO = 'bildirimler';
const OKUNDU = 'bildirim_okundu';

/** Kullanıcı tarafı: yayındaki son N bildirimi + okuma durumunu getir. */
export const bildirimleriYukle = async (
  userId: string,
  limit = 20,
): Promise<BildirimWithRead[]> => {
  const { data, error } = await supabase
    .from(TABLO)
    .select('*')
    .eq('yayinda', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;

  const list = (data ?? []) as Bildirim[];
  if (list.length === 0) return [];

  const { data: okundu, error: okErr } = await supabase
    .from(OKUNDU)
    .select('bildirim_id')
    .eq('user_id', userId)
    .in(
      'bildirim_id',
      list.map((b) => b.id),
    );
  if (okErr) throw okErr;

  const okundularSet = new Set((okundu ?? []).map((o) => o.bildirim_id as string));
  return list.map((b) => ({ ...b, okundu: okundularSet.has(b.id) }));
};

/** Tek bildirimi okundu işaretle (idempotent). */
export const bildirimOku = async (userId: string, bildirimId: string): Promise<void> => {
  const { error } = await supabase
    .from(OKUNDU)
    .upsert(
      { bildirim_id: bildirimId, user_id: userId },
      { onConflict: 'bildirim_id,user_id' },
    );
  if (error) throw error;
};

/** Birden çok bildirimi okundu işaretle. */
export const tumBildirimleriOku = async (
  userId: string,
  bildirimIds: string[],
): Promise<void> => {
  if (bildirimIds.length === 0) return;
  const { error } = await supabase
    .from(OKUNDU)
    .upsert(
      bildirimIds.map((id) => ({ bildirim_id: id, user_id: userId })),
      { onConflict: 'bildirim_id,user_id' },
    );
  if (error) throw error;
};

// ─── Admin tarafı ──────────────────────────────────────────────────────────

export interface YeniBildirim {
  baslik: string;
  metin: string;
  tip: BildirimTip;
  link: string | null;
  yayinda: boolean;
}

export const bildirimYarat = async (input: YeniBildirim): Promise<Bildirim> => {
  const { data, error } = await supabase
    .from(TABLO)
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Bildirim;
};

export const bildirimGuncelle = async (
  id: string,
  patch: Partial<YeniBildirim>,
): Promise<void> => {
  const { error } = await supabase.from(TABLO).update(patch).eq('id', id);
  if (error) throw error;
};

export const bildirimSil = async (id: string): Promise<void> => {
  const { error } = await supabase.from(TABLO).delete().eq('id', id);
  if (error) throw error;
};

export const tumBildirimleriYukleAdmin = async (): Promise<Bildirim[]> => {
  const { data, error } = await supabase
    .from(TABLO)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Bildirim[];
};
