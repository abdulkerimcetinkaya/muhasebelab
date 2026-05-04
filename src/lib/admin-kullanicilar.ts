import { supabase } from './supabase';
import type {
  AktiviteRow,
  IlerlemeRow,
  KazanilanRozetRow,
  KullaniciRow,
  OdemeRow,
} from './database.types';

export type Kullanici = KullaniciRow;

export interface KullaniciOzet extends Kullanici {
  cozum_sayisi: number; // ilerleme satırı sayısı
  rozet_sayisi: number;
  premium_aktif: boolean;
  son_aktivite_tarihi: string | null;
}

export interface KullaniciDetay extends Kullanici {
  cozumler: IlerlemeRow[];
  rozetler: KazanilanRozetRow[];
  aktivite: AktiviteRow[];
  odemeler: OdemeRow[];
}

/** Premium aktif mi? premium_bitis bugünden büyük mü? */
const premiumAktifMi = (kullanici: Kullanici): boolean => {
  if (!kullanici.premium_bitis) return false;
  return new Date(kullanici.premium_bitis) > new Date();
};

/**
 * Tüm kullanıcıları özet bilgileriyle yükle.
 * Performans için ilerleme/rozet sayıları paralel çekiliyor.
 */
export const tumKullanicilariYukle = async (): Promise<KullaniciOzet[]> => {
  const [kullaniciRes, ilerlemeRes, rozetRes, aktiviteRes] = await Promise.all([
    supabase.from('kullanicilar').select('*').order('created_at', { ascending: false }),
    supabase.from('ilerleme').select('user_id'),
    supabase.from('kazanilan_rozetler').select('user_id'),
    supabase.from('aktivite').select('user_id, tarih'),
  ]);

  if (kullaniciRes.error) throw kullaniciRes.error;
  if (ilerlemeRes.error) throw ilerlemeRes.error;
  if (rozetRes.error) throw rozetRes.error;
  if (aktiviteRes.error) throw aktiviteRes.error;

  const ilerlemeSayim = new Map<string, number>();
  (ilerlemeRes.data ?? []).forEach((r) => {
    ilerlemeSayim.set(r.user_id, (ilerlemeSayim.get(r.user_id) ?? 0) + 1);
  });

  const rozetSayim = new Map<string, number>();
  (rozetRes.data ?? []).forEach((r) => {
    rozetSayim.set(r.user_id, (rozetSayim.get(r.user_id) ?? 0) + 1);
  });

  const sonAktivite = new Map<string, string>();
  (aktiviteRes.data ?? []).forEach((r) => {
    const mevcut = sonAktivite.get(r.user_id);
    if (!mevcut || r.tarih > mevcut) {
      sonAktivite.set(r.user_id, r.tarih);
    }
  });

  return (kullaniciRes.data ?? []).map((k) => ({
    ...(k as Kullanici),
    cozum_sayisi: ilerlemeSayim.get(k.id) ?? 0,
    rozet_sayisi: rozetSayim.get(k.id) ?? 0,
    premium_aktif: premiumAktifMi(k as Kullanici),
    son_aktivite_tarihi: sonAktivite.get(k.id) ?? null,
  }));
};

// =====================================================================
// Premium yönetimi (Sprint 2)
// =====================================================================

/**
 * Admin: bir kullanıcının premium_bitis tarihini ayarlar.
 * SECURITY DEFINER RPC ile koru_kullanici_kolonlar trigger'ı bypass edilir.
 * @param yeniBitis null = premium iptal, tarih = o tarihte bitecek premium
 */
export const premiumAyarla = async (
  userId: string,
  yeniBitis: Date | null,
): Promise<string | null> => {
  const { data, error } = await supabase.rpc('admin_premium_ayarla', {
    _user_id: userId,
    _yeni_bitis: yeniBitis ? yeniBitis.toISOString() : null,
  });
  if (error) throw error;
  return data as string | null;
};

/** Bugünden başlayarak _ay_ ay süre veren premium hediye et. */
export const premiumHediyeEt = async (
  userId: string,
  ay: number,
): Promise<string | null> => {
  const bitis = new Date();
  bitis.setMonth(bitis.getMonth() + ay);
  return premiumAyarla(userId, bitis);
};

/**
 * Mevcut premium bitişine ay ekler. Premium yoksa veya geçmişse bugünden başlar.
 */
export const premiumUzat = async (
  userId: string,
  mevcutBitis: string | null,
  ekAy: number,
): Promise<string | null> => {
  const baslangic =
    mevcutBitis && new Date(mevcutBitis) > new Date()
      ? new Date(mevcutBitis)
      : new Date();
  baslangic.setMonth(baslangic.getMonth() + ekAy);
  return premiumAyarla(userId, baslangic);
};

/** Premium'u tamamen iptal et (premium_bitis = null). */
export const premiumIptal = async (userId: string): Promise<void> => {
  await premiumAyarla(userId, null);
};

/** Bir kullanıcının tüm detayları (ilerleme, rozet, aktivite, ödemeler). */
export const kullaniciDetayYukle = async (
  userId: string,
): Promise<KullaniciDetay | null> => {
  const [kullaniciRes, cozumRes, rozetRes, aktiviteRes, odemeRes] = await Promise.all([
    supabase.from('kullanicilar').select('*').eq('id', userId).maybeSingle(),
    supabase
      .from('ilerleme')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase.from('kazanilan_rozetler').select('*').eq('user_id', userId),
    supabase
      .from('aktivite')
      .select('*')
      .eq('user_id', userId)
      .order('tarih', { ascending: false }),
    supabase
      .from('odemeler')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  ]);

  if (kullaniciRes.error) throw kullaniciRes.error;
  if (!kullaniciRes.data) return null;
  if (cozumRes.error) throw cozumRes.error;
  if (rozetRes.error) throw rozetRes.error;
  if (aktiviteRes.error) throw aktiviteRes.error;
  if (odemeRes.error) throw odemeRes.error;

  return {
    ...(kullaniciRes.data as Kullanici),
    cozumler: (cozumRes.data ?? []) as IlerlemeRow[],
    rozetler: (rozetRes.data ?? []) as KazanilanRozetRow[],
    aktivite: (aktiviteRes.data ?? []) as AktiviteRow[],
    odemeler: (odemeRes.data ?? []) as OdemeRow[],
  };
};
