import { supabase } from './supabase';

export type BildirimTip = 'duyuru' | 'bilgi' | 'uyari' | 'guncelleme';
export type BildirimHedefTipi = 'herkes' | 'belirli';

export interface Bildirim {
  id: string;
  baslik: string;
  metin: string;
  tip: BildirimTip;
  link: string | null;
  yayinda: boolean;
  hedef_tipi: BildirimHedefTipi;
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
  hedef_tipi: BildirimHedefTipi;
  /** hedef_tipi='belirli' ise zorunlu — hedeflenen user_id listesi. */
  hedef_user_ids?: string[];
}

export const bildirimYarat = async (input: YeniBildirim): Promise<Bildirim> => {
  const { hedef_user_ids, ...bildirimDegerleri } = input;

  const { data, error } = await supabase
    .from(TABLO)
    .insert(bildirimDegerleri)
    .select()
    .single();
  if (error) throw error;

  const bildirim = data as Bildirim;

  // Hedef listesini ekle (hedef_tipi='belirli' ise)
  if (input.hedef_tipi === 'belirli' && hedef_user_ids && hedef_user_ids.length > 0) {
    const { error: hedefHata } = await supabase.from('bildirim_hedef').insert(
      hedef_user_ids.map((uid) => ({
        bildirim_id: bildirim.id,
        user_id: uid,
      })),
    );
    if (hedefHata) {
      // Bildirim oluşturuldu ama hedef eklenemedi — bildirimi sil ki tutarlı kalsın
      await supabase.from(TABLO).delete().eq('id', bildirim.id);
      throw hedefHata;
    }
  }

  return bildirim;
};

export const bildirimGuncelle = async (
  id: string,
  patch: Partial<Omit<YeniBildirim, 'hedef_user_ids'>>,
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
