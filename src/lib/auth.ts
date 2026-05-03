import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { authDonusTemizle } from './auth-donus';

export interface AuthSonuc {
  basarili: boolean;
  hata?: string;
  user?: User | null;
}

const cevirHata = (mesaj: string): string => {
  if (mesaj.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
  if (mesaj.includes('User already registered')) return 'Bu e-posta ile bir hesap zaten var.';
  if (mesaj.includes('Email not confirmed')) return 'E-posta adresini önce doğrulamalısın.';
  if (mesaj.includes('Password should be at least'))
    return 'Şifre en az 6 karakter olmalı.';
  if (mesaj.includes('Unable to validate email address'))
    return 'Geçerli bir e-posta adresi gir.';
  return mesaj;
};

export interface KayitBilgileri {
  email: string;
  sifre: string;
  kullaniciAdi: string;
  bultenIzni: boolean;
}

export const kayitOl = async (kayit: KayitBilgileri): Promise<AuthSonuc> => {
  const { data, error } = await supabase.auth.signUp({
    email: kayit.email,
    password: kayit.sifre,
    options: {
      data: {
        kullanici_adi: kayit.kullaniciAdi.trim(),
        bulten_izni: kayit.bultenIzni,
      },
    },
  });
  if (error) return { basarili: false, hata: cevirHata(error.message) };
  return { basarili: true, user: data.user };
};

export const girisYap = async (email: string, sifre: string): Promise<AuthSonuc> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: sifre });
  if (error) return { basarili: false, hata: cevirHata(error.message) };
  return { basarili: true, user: data.user };
};

export const cikisYap = async (): Promise<AuthSonuc> => {
  authDonusTemizle();
  const { error } = await supabase.auth.signOut();
  if (error) return { basarili: false, hata: cevirHata(error.message) };
  return { basarili: true };
};

/**
 * Kullanıcıya şifre sıfırlama e-postası yollar. Link kullanıcıyı
 * `${origin}/#/sifre-yenile` rotasına götürür; recovery oturumu
 * Supabase tarafından otomatik kurulur, kullanıcı yeni şifresini girer.
 */
export const sifreSifirlamaIste = async (email: string): Promise<AuthSonuc> => {
  const redirectTo = `${window.location.origin}/#/sifre-yenile`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { basarili: false, hata: cevirHata(error.message) };
  return { basarili: true };
};

/**
 * Recovery oturumu açıkken kullanıcının yeni şifresini set eder.
 * SifreYenileSayfasi'nda kullanılır.
 */
export const sifreyiYenile = async (yeniSifre: string): Promise<AuthSonuc> => {
  const { data, error } = await supabase.auth.updateUser({ password: yeniSifre });
  if (error) return { basarili: false, hata: cevirHata(error.message) };
  return { basarili: true, user: data.user };
};

export const oturumAl = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const oturumDinle = (cb: (session: Session | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
};
