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

// =====================================================================
// Moderasyon (Sprint 3)
// =====================================================================

/** Bir kullanıcıyı banla. Banlı kullanıcı yeni soru çözemez, hata bildiremez. */
export const kullaniciBanla = async (
  userId: string,
  sebep: string,
): Promise<void> => {
  const { error } = await supabase.rpc('admin_kullanici_banla', {
    _user_id: userId,
    _sebep: sebep,
  });
  if (error) throw error;
};

/** Banı kaldır. */
export const kullaniciUnbanla = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('admin_kullanici_unbanla', {
    _user_id: userId,
  });
  if (error) throw error;
};

/** Kullanıcıyı kalıcı olarak sil (KVKK madde 11). auth.users cascade ile temizler. */
export const kullaniciSil = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('admin_kullanici_sil', {
    _user_id: userId,
  });
  if (error) throw error;
};

// =====================================================================
// Şüpheli aktivite tespiti (deterministik kurallar)
// =====================================================================

export interface SupheliFlag {
  tip: 'hizli_cozum' | 'bot_benzeri' | 'yardim_bagimlisi';
  mesaj: string;
}

// =====================================================================
// İletişim (Sprint 4) — şifre sıfırlama, e-posta gönderme
// =====================================================================

/**
 * Bir kullanıcı için şifre sıfırlama e-postasını tetikler.
 * Supabase Auth built-in resetPasswordForEmail kullanır — kullanıcı email
 * ile reset linki alır.
 */
export const sifreSifirlamaTetikle = async (email: string): Promise<void> => {
  const redirectUrl = `${window.location.origin}/#/giris?reset=1`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  if (error) throw error;
};

/**
 * Admin → kullanıcı e-posta gönderir (Edge Function: gonder-email).
 * RESEND_API_KEY ve RESEND_FROM_EMAIL Supabase secret'larında olmalı.
 */
export const adminEmailGonder = async (
  to: string,
  subject: string,
  body: string,
  isHtml = false,
): Promise<void> => {
  const { data, error } = await supabase.functions.invoke('gonder-email', {
    body: { to, subject, body, isHtml },
  });
  if (error) throw error;
  if (data?.hata) throw new Error(data.hata);
};

/**
 * Bir kullanıcının çözüm geçmişine bakarak şüpheli pattern'leri tespit eder.
 * Detay sayfasında yardımcı uyarı için kullanılır.
 */
export const supheliPatternleriBul = (
  cozumler: { created_at: string; sure_saniye: number | null; kullanilan_ai: boolean; cozum_gosterildi: boolean }[],
): SupheliFlag[] => {
  const flagler: SupheliFlag[] = [];
  if (cozumler.length === 0) return flagler;

  // 1) Hızlı çözüm — son 24 saatte 30+ çözüm
  const son24Saat = Date.now() - 24 * 60 * 60 * 1000;
  const son24SaatCozumler = cozumler.filter(
    (c) => new Date(c.created_at).getTime() > son24Saat,
  );
  if (son24SaatCozumler.length >= 30) {
    flagler.push({
      tip: 'hizli_cozum',
      mesaj: `Son 24 saatte ${son24SaatCozumler.length} çözüm — alışılmadık yüksek hız.`,
    });
  }

  // 2) Bot benzeri — çözüm süresi medyanı < 5 saniye (en az 10 çözüm gerekli)
  const sureli = cozumler
    .filter((c): c is typeof c & { sure_saniye: number } => c.sure_saniye !== null && c.sure_saniye > 0)
    .map((c) => c.sure_saniye)
    .sort((a, b) => a - b);
  if (sureli.length >= 10) {
    const medyan = sureli[Math.floor(sureli.length / 2)];
    if (medyan < 5) {
      flagler.push({
        tip: 'bot_benzeri',
        mesaj: `Çözüm süresi medyanı ${medyan}s — manipülasyon veya bot ihtimali.`,
      });
    }
  }

  // 3) Yardım bağımlılığı — çözümlerin %80+'ı AI veya çözüm gösterildi
  if (cozumler.length >= 20) {
    const yardimAlinan = cozumler.filter(
      (c) => c.kullanilan_ai || c.cozum_gosterildi,
    ).length;
    const oran = yardimAlinan / cozumler.length;
    if (oran >= 0.8) {
      flagler.push({
        tip: 'yardim_bagimlisi',
        mesaj: `Çözümlerin %${Math.round(oran * 100)}'inde AI veya çözüm gösterildi.`,
      });
    }
  }

  return flagler;
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
