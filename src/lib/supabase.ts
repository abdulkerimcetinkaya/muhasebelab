import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı değil. .env.example dosyasına bakın.',
  );
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

// Şifre sıfırlama (PASSWORD_RECOVERY) event'ini module-init time'da yakala.
//
// Supabase JS, PKCE flow'da URL'deki ?code=... param'ını async olarak değişime
// sokuyor; recovery linki için bu işlem sonunda PASSWORD_RECOVERY event'i fire
// oluyor. Eğer listener React useEffect'inde subscribe edilirse mount gecikmesi
// yüzünden event kaçırılabiliyor (URL'de type=recovery yok PKCE'de — sadece code
// var, bu yüzden URL tabanlı tespit de işe yaramıyor).
//
// Çözüm: createClient'tan hemen sonra, modül seviyesinde subscribe ol. Bu sayede
// recovery event her zaman yakalanır, sessionStorage flag set edilir ve kullanıcı
// gerekirse zorla /sifre-yenile'ye yönlendirilir.
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      sessionStorage.setItem('sifre_yenileme_modu', '1');
      // Kullanıcı OnboardingGuard veya başka redirect'le yanlış yere gitmesin —
      // zorla şifre yenileme sayfasına götür. window.location.replace history
      // entry açmıyor, geri butonu loop oluşturmaz.
      if (!window.location.hash.startsWith('#/sifre-yenile')) {
        window.location.replace(window.location.origin + '/#/sifre-yenile');
      }
    }
  });
}
