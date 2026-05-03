import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { sifreSifirlamaIste } from '../lib/auth';

/**
 * Şifremi unuttum akışı — kullanıcı e-postasını girer, Supabase
 * sıfırlama linkini e-posta ile gönderir. Link `/sifre-yenile` rotasına
 * götürür ve recovery oturumu açar.
 */
export const SifreSifirlaSayfasi = () => {
  const [email, setEmail] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [gonderildi, setGonderildi] = useState(false);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setHata('E-posta adresi gerekli.');
      return;
    }
    setYukleniyor(true);
    setHata(null);
    const sonuc = await sifreSifirlamaIste(email.trim());
    setYukleniyor(false);
    if (!sonuc.basarili) {
      setHata(sonuc.hata ?? 'Beklenmeyen hata.');
      return;
    }
    setGonderildi(true);
  };

  if (gonderildi) {
    return (
      <main className="max-w-md mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white dark:bg-zinc-800/50 border border-line rounded-2xl p-6 sm:p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 mb-4">
            <Icon name="Check" size={20} className="text-emerald-700 dark:text-emerald-400" strokeWidth={3} />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight mb-2">E-posta yolda</h1>
          <p className="text-[14px] text-ink-soft leading-relaxed mb-6">
            <span className="font-mono font-bold">{email}</span> adresine şifre sıfırlama linki
            gönderdik. Posta kutunu kontrol et — spam klasörüne de bakmayı unutma.
          </p>
          <Link
            to="/giris"
            className="inline-flex items-center gap-2 text-[12px] font-bold text-blue-700 dark:text-blue-400 hover:underline"
          >
            <Icon name="ArrowLeft" size={12} />
            Giriş sayfasına dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white dark:bg-zinc-800/50 border border-line rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Şifremi unuttum
          </h1>
          <p className="text-[13.5px] text-ink-soft leading-relaxed">
            E-posta adresini gir, şifreni yenilemen için bir link yollayalım.
          </p>
        </div>

        <form onSubmit={gonder} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              autoFocus
              className="w-full px-3 py-2.5 bg-surface-2/30 border border-line focus:border-ink-soft rounded-lg text-[14px] font-medium outline-none transition focus:ring-2 focus:ring-blue-500/15"
              placeholder="ornek@email.com"
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
                Gönderiliyor
              </>
            ) : (
              <>
                <Icon name="Send" size={12} />
                Sıfırlama Linki Gönder
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-line text-center">
          <Link
            to="/giris"
            className="inline-flex items-center gap-2 text-[12px] font-bold text-ink-mute hover:text-ink transition"
          >
            <Icon name="ArrowLeft" size={12} />
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </main>
  );
};
