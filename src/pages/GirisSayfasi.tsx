import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth } from '../contexts/AuthContext';
import { girisYap, kayitOl } from '../lib/auth';
import { authDonusOku } from '../lib/auth-donus';

type Mod = 'giris' | 'kayit';

export const GirisSayfasi = () => {
  const nav = useNavigate();
  const { user, yukleniyor: oturumYukleniyor } = useAuth();
  const [mod, setMod] = useState<Mod>('giris');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [bultenIzni, setBultenIzni] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [bilgi, setBilgi] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!oturumYukleniyor && user) {
      const donus = authDonusOku() ?? '/';
      nav(donus, { replace: true });
    }
  }, [user, oturumYukleniyor, nav]);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata(null);
    setBilgi(null);

    if (!email.trim() || !sifre) {
      setHata('E-posta ve şifre gerekli.');
      return;
    }

    if (mod === 'kayit') {
      const ad = kullaniciAdi.trim();
      if (ad.length < 2 || ad.length > 30) {
        setHata('Kullanıcı adı 2-30 karakter olmalı.');
        return;
      }
      if (ad.toLowerCase() === 'öğrenci') {
        setHata('Lütfen kendine özgü bir kullanıcı adı seç.');
        return;
      }
      if (!kvkkOnay) {
        setHata('Devam etmek için KVKK Aydınlatma Metni\'ni onaylamalısın.');
        return;
      }
    }

    setYukleniyor(true);
    const sonuc =
      mod === 'giris'
        ? await girisYap(email.trim(), sifre)
        : await kayitOl({
            email: email.trim(),
            sifre,
            kullaniciAdi: kullaniciAdi.trim(),
            bultenIzni,
          });
    setYukleniyor(false);

    if (!sonuc.basarili) {
      setHata(sonuc.hata ?? 'Bilinmeyen hata.');
      return;
    }
    if (mod === 'kayit' && !sonuc.user?.email_confirmed_at) {
      setBilgi('Hesap oluşturuldu. E-postanı doğrulamak için gelen kutunu kontrol et.');
      setSifre('');
      return;
    }
  };

  const modDegistir = (yeni: Mod) => {
    setMod(yeni);
    setHata(null);
    setBilgi(null);
  };

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <div className="inline-block mb-4">
          <Thiings name="calculator" size={64} />
        </div>
        <h1 className="font-display text-4xl tracking-tight font-bold mb-2">
          {mod === 'giris' ? 'Hoş Geldin' : 'Hesap Oluştur'}
        </h1>
        <p className="text-stone-600 dark:text-zinc-400 text-sm font-medium">
          {mod === 'giris'
            ? 'Devam etmek için giriş yap.'
            : 'Ücretsiz hesap oluştur, ilerlemen senkronlansın.'}
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl p-6">
        <div className="flex border border-stone-200 dark:border-zinc-700 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => modDegistir('giris')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition ${
              mod === 'giris'
                ? 'bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => modDegistir('kayit')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition ${
              mod === 'kayit'
                ? 'bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={gonder} className="space-y-4">
          {mod === 'kayit' && (
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={kullaniciAdi}
                onChange={(e) => setKullaniciAdi(e.target.value)}
                autoComplete="username"
                required
                minLength={2}
                maxLength={30}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium"
                placeholder="Profilde gözükecek isim"
              />
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium mt-1.5">
                2-30 karakter. Profilden değiştirebilirsin.
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              autoComplete={mod === 'giris' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium"
              placeholder="En az 6 karakter"
            />
          </div>

          {mod === 'kayit' && (
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={kvkkOnay}
                  onChange={(e) => setKvkkOnay(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 dark:border-zinc-600 text-blue-700 focus:ring-blue-500/30 cursor-pointer"
                  required
                />
                <span className="text-stone-700 dark:text-zinc-300 leading-snug font-medium">
                  <button
                    type="button"
                    onClick={() => window.open('#/kvkk', '_blank')}
                    className="text-blue-700 dark:text-blue-400 hover:underline font-bold"
                  >
                    KVKK Aydınlatma Metni
                  </button>
                  'ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.{' '}
                  <span className="text-rose-700 dark:text-rose-400">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={bultenIzni}
                  onChange={(e) => setBultenIzni(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-stone-300 dark:border-zinc-600 text-blue-700 focus:ring-blue-500/30 cursor-pointer"
                />
                <span className="text-stone-600 dark:text-zinc-400 leading-snug font-medium">
                  Yeni özellikler ve içerik güncellemelerinden haberdar olmak için e-posta
                  almak istiyorum. <span className="text-stone-500 dark:text-zinc-500">(opsiyonel)</span>
                </span>
              </label>
            </div>
          )}

          {hata && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-sm text-rose-800 dark:text-rose-300 font-medium">
              <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
              <span>{hata}</span>
            </div>
          )}

          {bilgi && (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg text-sm text-emerald-800 dark:text-emerald-300 font-medium">
              <Icon name="CheckCircle2" size={16} className="flex-shrink-0 mt-0.5" />
              <span>{bilgi}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full py-2.5 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {yukleniyor && <Icon name="Loader2" size={14} className="animate-spin" />}
            {mod === 'giris' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-xs text-stone-500 dark:text-zinc-500 font-medium">
        {mod === 'giris' ? 'Hesabın yok mu? ' : 'Hesabın var mı? '}
        <button
          onClick={() => modDegistir(mod === 'giris' ? 'kayit' : 'giris')}
          className="text-stone-900 dark:text-zinc-100 font-bold hover:underline"
        >
          {mod === 'giris' ? 'Kayıt ol' : 'Giriş yap'}
        </button>
      </div>
    </main>
  );
};
