import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { girisYap, kayitOl } from '../lib/auth';
import { authDonusOku } from '../lib/auth-donus';
import {
  adYapisalKontrol,
  adUygunMu,
  oneriUret,
  uygunOnerileriBul,
} from '../lib/kullanici-adi';

type Mod = 'giris' | 'kayit';
type AdDurum = 'bos' | 'kontrol' | 'uygun' | 'kullanimda' | 'gecersiz';

export const GirisSayfasi = () => {
  const nav = useNavigate();
  const { user, yukleniyor: oturumYukleniyor } = useAuth();
  const [mod, setMod] = useState<Mod>('giris');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [bultenIzni, setBultenIzni] = useState(false);

  const [adDurum, setAdDurum] = useState<AdDurum>('bos');
  const [adHata, setAdHata] = useState<string | null>(null);
  const [oneriler, setOneriler] = useState<string[]>([]);

  const [hata, setHata] = useState<string | null>(null);
  const [bilgi, setBilgi] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sifreGoster, setSifreGoster] = useState(false);

  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!oturumYukleniyor && user) {
      const donus = authDonusOku() ?? '/';
      nav(donus, { replace: true });
    }
  }, [user, oturumYukleniyor, nav]);

  // Kullanıcı adı debounced kontrolü (sadece kayıt modunda)
  useEffect(() => {
    if (mod !== 'kayit') return;
    const ad = kullaniciAdi.trim();

    if (ad.length === 0) {
      setAdDurum('bos');
      setAdHata(null);
      setOneriler([]);
      return;
    }

    const yapisal = adYapisalKontrol(ad);
    if (!yapisal.gecerli) {
      setAdDurum('gecersiz');
      setAdHata(yapisal.hata ?? null);
      setOneriler([]);
      return;
    }

    setAdDurum('kontrol');
    setAdHata(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      const uygun = await adUygunMu(ad);
      if (uygun) {
        setAdDurum('uygun');
        setOneriler([]);
      } else {
        setAdDurum('kullanimda');
        const aday = oneriUret(ad);
        const uygunOneriler = await uygunOnerileriBul(aday);
        setOneriler(uygunOneriler);
      }
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [kullaniciAdi, mod]);

  const sifreEsit = sifre.length > 0 && sifre === sifreTekrar;
  const sifreUyusmazlik = sifreTekrar.length > 0 && sifre !== sifreTekrar;

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata(null);
    setBilgi(null);

    if (!email.trim() || !sifre) {
      setHata('E-posta ve şifre gerekli.');
      return;
    }

    if (mod === 'kayit') {
      const yapisal = adYapisalKontrol(kullaniciAdi);
      if (!yapisal.gecerli) {
        setHata(yapisal.hata ?? 'Kullanıcı adı geçersiz.');
        return;
      }
      if (adDurum === 'kullanimda') {
        setHata('Bu kullanıcı adı alınmış. Önerilenlerden birini seçebilirsin.');
        return;
      }
      if (sifre !== sifreTekrar) {
        setHata('Şifreler eşleşmiyor.');
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
      setSifreTekrar('');
      return;
    }
  };

  const modDegistir = (yeni: Mod) => {
    setMod(yeni);
    setHata(null);
    setBilgi(null);
    setSifreTekrar('');
    if (yeni === 'giris') {
      setKullaniciAdi('');
      setOneriler([]);
      setAdDurum('bos');
    }
  };

  const oneriyiSec = (oneri: string) => {
    setKullaniciAdi(oneri);
  };

  // ── Kullanıcı adı durum göstergesi (input sağ tarafı) ─────────────
  const adGosterge = () => {
    if (adDurum === 'kontrol')
      return <Icon name="Loader2" size={14} className="text-stone-400 animate-spin" />;
    if (adDurum === 'uygun')
      return <Icon name="CheckCircle2" size={14} className="text-emerald-600" />;
    if (adDurum === 'kullanimda' || adDurum === 'gecersiz')
      return <Icon name="AlertCircle" size={14} className="text-rose-500" />;
    return null;
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-[440px]">
        {/* Marka çizgisi */}
        <div className="flex items-baseline justify-center gap-2 mb-10">
          <span className="font-display text-[28px] font-bold tracking-[-0.02em] text-ink leading-none">
            muhasebelab
          </span>
          <span
            className="font-serif italic text-[32px] leading-none"
            style={{ color: 'var(--copper)' }}
          >
            §
          </span>
        </div>

        {/* Kart */}
        <div className="surface p-7 sm:p-9 bg-surface">
          {/* Başlık */}
          <div className="mb-7">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-mute mb-2">
              §&nbsp;{mod === 'giris' ? '01 · Giriş' : '01 · Kayıt'}
            </div>
            <h1 className="font-display text-[32px] sm:text-[36px] tracking-tight leading-[1.05] font-bold text-ink">
              {mod === 'giris' ? (
                <>
                  Hoş <span className="font-display-italic text-copper-deep">geldin</span>.
                </>
              ) : (
                <>
                  Hesap <span className="font-display-italic text-copper-deep">oluştur</span>.
                </>
              )}
            </h1>
            <p className="text-[14px] text-ink-soft leading-relaxed mt-2 font-medium">
              {mod === 'giris'
                ? 'Yevmiye kayıtlarına devam etmek için giriş yap.'
                : 'Ücretsiz hesabını oluştur, ilerlemeni bulutta sakla.'}
            </p>
          </div>

          {/* Mod sekmesi */}
          <div className="flex border border-line rounded-lg p-1 mb-6 bg-surface-2/40">
            <button
              type="button"
              onClick={() => modDegistir('giris')}
              className={`flex-1 py-2 text-[12px] font-bold tracking-wide rounded-md transition ${
                mod === 'giris'
                  ? 'bg-ink text-paper shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => modDegistir('kayit')}
              className={`flex-1 py-2 text-[12px] font-bold tracking-wide rounded-md transition ${
                mod === 'kayit'
                  ? 'bg-ink text-paper shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <form onSubmit={gonder} className="space-y-4">
            {mod === 'kayit' && (
              <div>
                <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold mb-1.5">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={kullaniciAdi}
                    onChange={(e) => setKullaniciAdi(e.target.value)}
                    autoComplete="username"
                    required
                    minLength={2}
                    maxLength={30}
                    className={`w-full pl-3 pr-9 py-2.5 bg-surface-2/30 border rounded-lg text-[14px] font-medium outline-none transition focus:ring-2 focus:ring-blue-500/15 ${
                      adDurum === 'kullanimda' || adDurum === 'gecersiz'
                        ? 'border-rose-300 focus:border-rose-500'
                        : adDurum === 'uygun'
                          ? 'border-emerald-300 focus:border-emerald-500'
                          : 'border-line focus:border-ink-soft'
                    }`}
                    placeholder="ahmet, zeynep_28, muhasebe_kurdu..."
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">{adGosterge()}</div>
                </div>

                {adHata && (
                  <div className="mt-1.5 text-[12px] text-rose-700 dark:text-rose-400 font-medium">
                    {adHata}
                  </div>
                )}

                {adDurum === 'uygun' && (
                  <div className="mt-1.5 text-[12px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Bu kullanıcı adı uygun.
                  </div>
                )}

                {adDurum === 'kullanimda' && (
                  <div className="mt-2">
                    <div className="text-[12px] text-rose-700 dark:text-rose-400 font-medium mb-1.5">
                      Bu kullanıcı adı alınmış.
                    </div>
                    {oneriler.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="font-mono text-[10px] tracking-wider uppercase text-ink-mute self-center">
                          Öneri:
                        </span>
                        {oneriler.map((o) => (
                          <button
                            key={o}
                            type="button"
                            onClick={() => oneriyiSec(o)}
                            className="text-[12px] font-mono px-2 py-0.5 bg-surface-2/60 hover:bg-surface-2 border border-line rounded-md transition text-ink"
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {adDurum === 'bos' && (
                  <div className="mt-1.5 text-[11px] text-ink-mute font-medium">
                    2-30 karakter. Profilden değiştirebilirsin.
                  </div>
                )}
              </div>
            )}

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
                className="w-full px-3 py-2.5 bg-surface-2/30 border border-line focus:border-ink-soft rounded-lg text-[14px] font-medium outline-none transition focus:ring-2 focus:ring-blue-500/15"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
                  Şifre
                </label>
                {mod === 'giris' && (
                  <button
                    type="button"
                    onClick={() => nav('/sifre-sifirla')}
                    className="text-[11px] text-blue-700 dark:text-blue-400 hover:underline font-bold"
                  >
                    Şifremi unuttum
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={sifreGoster ? 'text' : 'password'}
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  autoComplete={mod === 'giris' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  className="w-full pl-3 pr-10 py-2.5 bg-surface-2/30 border border-line focus:border-ink-soft rounded-lg text-[14px] font-medium outline-none transition focus:ring-2 focus:ring-blue-500/15"
                  placeholder="En az 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setSifreGoster((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-mute hover:text-ink transition"
                  tabIndex={-1}
                >
                  <Icon name={sifreGoster ? 'EyeOff' : 'Eye'} size={14} />
                </button>
              </div>
            </div>

            {mod === 'kayit' && (
              <div>
                <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold mb-1.5">
                  Şifre (Tekrar)
                </label>
                <div className="relative">
                  <input
                    type={sifreGoster ? 'text' : 'password'}
                    value={sifreTekrar}
                    onChange={(e) => setSifreTekrar(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className={`w-full pl-3 pr-9 py-2.5 bg-surface-2/30 border rounded-lg text-[14px] font-medium outline-none transition focus:ring-2 focus:ring-blue-500/15 ${
                      sifreUyusmazlik
                        ? 'border-rose-300 focus:border-rose-500'
                        : sifreEsit
                          ? 'border-emerald-300 focus:border-emerald-500'
                          : 'border-line focus:border-ink-soft'
                    }`}
                    placeholder="Şifreyi tekrar gir"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {sifreUyusmazlik && (
                      <Icon name="AlertCircle" size={14} className="text-rose-500" />
                    )}
                    {sifreEsit && (
                      <Icon name="CheckCircle2" size={14} className="text-emerald-600" />
                    )}
                  </div>
                </div>
                {sifreUyusmazlik && (
                  <div className="mt-1.5 text-[12px] text-rose-700 dark:text-rose-400 font-medium">
                    Şifreler eşleşmiyor.
                  </div>
                )}
              </div>
            )}

            {mod === 'kayit' && (
              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-[13px]">
                  <input
                    type="checkbox"
                    checked={kvkkOnay}
                    onChange={(e) => setKvkkOnay(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-line text-blue-700 focus:ring-blue-500/30 cursor-pointer"
                    required
                  />
                  <span className="text-ink-soft leading-snug font-medium">
                    <button
                      type="button"
                      onClick={() => window.open('#/kvkk', '_blank')}
                      className="text-copper-deep hover:underline font-bold"
                    >
                      KVKK Aydınlatma Metni
                    </button>
                    'ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.{' '}
                    <span className="text-rose-700">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-[13px]">
                  <input
                    type="checkbox"
                    checked={bultenIzni}
                    onChange={(e) => setBultenIzni(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-line text-blue-700 focus:ring-blue-500/30 cursor-pointer"
                  />
                  <span className="text-ink-mute leading-snug font-medium">
                    Yeni özelliklerden e-posta ile haberdar olmak istiyorum.{' '}
                    <span className="text-ink-mute">(opsiyonel)</span>
                  </span>
                </label>
              </div>
            )}

            {hata && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-[13px] text-rose-800 dark:text-rose-300 font-medium">
                <Icon name="AlertCircle" size={15} className="flex-shrink-0 mt-0.5" />
                <span>{hata}</span>
              </div>
            )}

            {bilgi && (
              <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg text-[13px] text-emerald-800 dark:text-emerald-300 font-medium">
                <Icon name="CheckCircle2" size={15} className="flex-shrink-0 mt-0.5" />
                <span>{bilgi}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full py-2.5 bg-ink text-paper font-bold text-[12px] tracking-[0.18em] uppercase rounded-lg hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
            >
              {yukleniyor && <Icon name="Loader2" size={14} className="animate-spin" />}
              {mod === 'giris' ? 'Giriş Yap' : 'Hesabı Oluştur'}
              {!yukleniyor && <Icon name="ArrowRight" size={13} />}
            </button>
          </form>
        </div>

        {/* Alt şerit */}
        <div className="mt-5 text-center">
          <span className="font-mono text-[11px] text-ink-mute">
            {mod === 'giris' ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}{' '}
          </span>
          <button
            onClick={() => modDegistir(mod === 'giris' ? 'kayit' : 'giris')}
            className="font-mono text-[11px] text-ink hover:text-copper-deep font-bold tracking-wide transition"
          >
            {mod === 'giris' ? 'Kayıt ol →' : '← Giriş yap'}
          </button>
        </div>
      </div>
    </main>
  );
};
