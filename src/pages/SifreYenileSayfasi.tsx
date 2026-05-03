import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { sifreyiYenile } from '../lib/auth';
import { supabase } from '../lib/supabase';

/**
 * Recovery linkinden gelen kullanıcı yeni şifresini set eder.
 *
 * Güvenlik: Sayfa SADECE PASSWORD_RECOVERY oturum tipinden ulaşılabilir.
 * Normal oturumdaki bir kullanıcı (örn. paylaşılan cihaz, ya da saldırgan
 * kurbanın açık tarayıcısına eriştiyse) buradan şifre değiştiremez —
 * onun için Profil > Hesap > Şifre Değiştir akışı vardır (eski şifre sorar).
 */
export const SifreYenileSayfasi = () => {
  const nav = useNavigate();
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  // Oturum kontrolü: 'kontrol' (yükleniyor) | 'recovery' (izinli) | 'normal' (engelli)
  const [oturum, setOturum] = useState<'kontrol' | 'recovery' | 'normal'>('kontrol');

  useEffect(() => {
    // 1. URL hash'inde recovery token var mı? (Supabase henüz işlememişse)
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || hash.includes('access_token=')) {
      setOturum('recovery');
      return;
    }

    // 2. onAuthStateChange ile PASSWORD_RECOVERY event'ini bekle
    let recoveryGordu = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        recoveryGordu = true;
        setOturum('recovery');
      }
    });

    // 3. 2 saniye içinde recovery event gelmezse normal session demektir
    const timer = setTimeout(() => {
      if (!recoveryGordu) setOturum('normal');
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oturum !== 'recovery') return; // güvenlik: render zaten engelliyor ama defansif
    if (sifre.length < 6) {
      setHata('Şifre en az 6 karakter olmalı.');
      return;
    }
    if (sifre !== sifreTekrar) {
      setHata('Şifreler eşleşmiyor.');
      return;
    }
    setYukleniyor(true);
    setHata(null);
    const sonuc = await sifreyiYenile(sifre);
    setYukleniyor(false);
    if (!sonuc.basarili) {
      setHata(
        sonuc.hata ?? 'Şifre yenilenemedi. Link süresi dolmuş olabilir, yeniden talep et.',
      );
      return;
    }
    nav('/dashboard', { replace: true });
  };

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white dark:bg-zinc-800/50 border border-line rounded-2xl p-6 sm:p-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Yeni şifre belirle
        </h1>
        <p className="text-[13.5px] text-ink-soft leading-relaxed mb-6">
          En az 6 karakterli yeni bir şifre gir.
        </p>

        {oturum === 'kontrol' && (
          <div className="flex items-center gap-2 p-4 text-[13px] text-ink-mute font-medium">
            <Icon name="Loader2" size={14} className="animate-spin" />
            Doğrulanıyor...
          </div>
        )}

        {oturum === 'normal' && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-[13px] text-amber-900 dark:text-amber-200 font-medium">
              <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
              <span>
                Bu sayfa sadece e-posta üzerinden gelen şifre sıfırlama linki ile açılabilir.
                Mevcut şifreni değiştirmek istiyorsan Profil &gt; Hesap bölümünü kullan.
              </span>
            </div>
            <Link
              to="/sifre-sifirla"
              className="block text-center w-full bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-5 py-3 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.99] transition"
            >
              Yeni Sıfırlama Linki İste
            </Link>
          </div>
        )}

        {oturum === 'recovery' && (
          <form onSubmit={gonder} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold mb-1.5">
                Yeni Şifre
              </label>
              <input
                type="password"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                autoFocus
                className="w-full px-3 py-2.5 bg-surface-2/30 border border-line focus:border-ink-soft rounded-lg text-[14px] font-medium outline-none transition focus:ring-2 focus:ring-blue-500/15"
                placeholder="En az 6 karakter"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold mb-1.5">
                Şifre (Tekrar)
              </label>
              <input
                type="password"
                value={sifreTekrar}
                onChange={(e) => setSifreTekrar(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-3 py-2.5 bg-surface-2/30 border border-line focus:border-ink-soft rounded-lg text-[14px] font-medium outline-none transition focus:ring-2 focus:ring-blue-500/15"
                placeholder="Şifreyi tekrar gir"
              />
            </div>

            {hata && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-[13px] text-rose-800 dark:text-rose-300 font-medium">
                <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
                <span>{hata}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-5 py-3 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {yukleniyor ? (
                <>
                  <Icon name="Loader2" size={12} className="animate-spin" />
                  Kaydediliyor
                </>
              ) : (
                <>
                  <Icon name="Save" size={12} />
                  Şifreyi Yenile
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};
