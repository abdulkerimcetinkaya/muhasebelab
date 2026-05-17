import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı değil. .env.example dosyasına bakın.',
  );
}

// Şifre sıfırlama tespiti — modül yüklenir yüklenmez URL'i kontrol et.
//
// auth.ts'deki sifreSifirlamaIste, redirectTo'ya `?recovery=1` query param'ı
// ekliyor. Supabase email'i bu URL'e yönlendiriyor (PKCE code'unu append edip):
//
//   https://muhasebeakademi.com/?recovery=1&code=xxx
//
// Bu kontrol Supabase JS'in `?code=`'u tüketip URL'i temizlemesinden ÖNCE
// çalışıyor; recovery=1 marker'ını yakalayıp sessionStorage'a flag yazıyor.
// OnboardingGuard bu flag'i okuyup kullanıcıyı /sifre-yenile'ye yönlendiriyor.
//
// onAuthStateChange + PASSWORD_RECOVERY event tabanlı çözüme göre çok daha
// güvenilir: event PKCE'de bazen geç fire ediyor / kaçırılabiliyor; query
// param ise URL'de garanti var ve sync olarak okunabiliyor.
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  if (params.get('recovery') === '1') {
    sessionStorage.setItem('sifre_yenileme_modu', '1');
  }
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // PKCE: kod query param'da gelir (?code=...), HashRouter ile çakışmaz.
    // Implicit flow fragment kullanır (#access_token=...) → HashRouter karıştırır.
    flowType: 'pkce',
  },
});
