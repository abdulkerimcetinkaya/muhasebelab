import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı değil. .env.example dosyasına bakın.',
  );
}

// Şifre sıfırlama linki recovery URL'iyle gelirse, Supabase URL'i tüketmeden
// ÖNCE flag'i yakala. Supabase JS detectSessionInUrl=true ile sayfa açılışında
// tokenları işleyip URL'i temizliyor; o noktada React henüz mount olmadığı
// için onAuthStateChange listener'ı geç kalıyor. Module init time bu sorunu
// çözüyor — supabase client oluşturulmadan önce URL'i kontrol ediyoruz.
//
// Pattern: PKCE flow için ?code=... query param + ?type=recovery
//          Implicit flow için #access_token=...&type=recovery hash
if (typeof window !== 'undefined') {
  const fullUrl = window.location.href;
  if (fullUrl.includes('type=recovery')) {
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
