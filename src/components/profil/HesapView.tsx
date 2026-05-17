import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Icon } from '../Icon';
import { InitialsAvatar } from '../InitialsAvatar';
import { useIsPremium } from '../../contexts/AuthContext';
import { useUniteler } from '../../contexts/UnitelerContext';
import { cikisYap, girisYap, sifreyiYenile } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { Ilerleme, Istatistik } from '../../types';
import { HEDEF_LABEL, SINIF_LABEL } from './types';
import type { Hedef, ProfilBilgi, Sinif } from './types';

interface Props {
  user: User | null;
  ilerleme: Ilerleme;
  stat: Istatistik;
  profil: ProfilBilgi;
  onProfilDegis: (yeni: ProfilBilgi) => void;
  profilYukleniyor: boolean;
  onKullaniciAdiGuncelle: (ad: string) => void;
  onTemaDegistir: () => void;
  onSifirla: () => void;
}

/**
 * Hesap ayarları görünümü — modern SaaS pattern'inde yeniden yapılandırıldı:
 *
 * 1. Hesap     — avatar + görünen ad + ad/soyad + e-posta + üyelik durumu
 * 2. Eğitim    — üniversite, bölüm, sınıf, hedef, doğum yılı
 * 3. Güvenlik  — şifre değiştir + 2FA (yakında placeholder)
 * 4. Tercihler — tema + bülten izni
 * 5. Verilerim — karne PDF indir + ilerleme sıfırla
 * 6. Tehlikeli — hesap silme (kırmızı border, izolasyonlu)
 *
 * Linear/Vercel pattern: her bölüm card, section başına Save butonu, e-posta
 * read-only (değiştirilemez).
 */
export const HesapView = ({
  user,
  ilerleme,
  stat,
  profil,
  onProfilDegis,
  profilYukleniyor,
  onKullaniciAdiGuncelle,
  onTemaDegistir,
  onSifirla,
}: Props) => {
  const { uniteler } = useUniteler();
  const isPremium = useIsPremium();

  // ─────────────────────────────────────────────────────────────
  // Hesap — Görünen Ad (App state seviyesi, ayrı kaydetme akışı)
  // ─────────────────────────────────────────────────────────────
  const [adTaslak, setAdTaslak] = useState(ilerleme.kullaniciAdi);
  const [adKaydediliyor, setAdKaydediliyor] = useState(false);
  const [adMesaj, setAdMesaj] = useState<string | null>(null);
  useEffect(() => {
    setAdTaslak(ilerleme.kullaniciAdi);
  }, [ilerleme.kullaniciAdi]);
  const adDegisti = adTaslak.trim() !== ilerleme.kullaniciAdi.trim();

  const adKaydet = () => {
    const yeni = adTaslak.trim() || 'Öğrenci';
    setAdKaydediliyor(true);
    onKullaniciAdiGuncelle(yeni);
    setTimeout(() => {
      setAdKaydediliyor(false);
      setAdMesaj('Görünen adın güncellendi.');
      setTimeout(() => setAdMesaj(null), 2500);
    }, 200);
  };

  // ─────────────────────────────────────────────────────────────
  // E-posta kopya
  // ─────────────────────────────────────────────────────────────
  const [emailKopyalandi, setEmailKopyalandi] = useState(false);
  const emailKopyala = async () => {
    if (!user?.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      setEmailKopyalandi(true);
      setTimeout(() => setEmailKopyalandi(false), 1500);
    } catch {
      // sessizce yut — clipboard API yoksa
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Eğitim bilgileri kaydetme (ad, soyad, üniversite, bölüm, sınıf, hedef, doğum yılı)
  // ─────────────────────────────────────────────────────────────
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: 'basarili' | 'hata'; metin: string } | null>(null);

  const kaydet = async () => {
    if (!user) return;
    setKaydediliyor(true);
    setMesaj(null);

    const dogumYiliNum = profil.dogumYili.trim() ? parseInt(profil.dogumYili.trim(), 10) : null;
    if (dogumYiliNum !== null && (isNaN(dogumYiliNum) || dogumYiliNum < 1950 || dogumYiliNum > 2015)) {
      setKaydediliyor(false);
      setMesaj({ tip: 'hata', metin: 'Doğum yılı 1950-2015 arasında olmalı.' });
      return;
    }

    const { error } = await supabase
      .from('kullanicilar')
      .update({
        ad: profil.ad.trim() || null,
        soyad: profil.soyad.trim() || null,
        universite: profil.universite.trim() || null,
        bolum: profil.bolum.trim() || null,
        sinif: profil.sinif === '' ? null : profil.sinif,
        hedef: profil.hedef === '' ? null : profil.hedef,
        dogum_yili: dogumYiliNum,
        bulten_izni: profil.bultenIzni,
      })
      .eq('id', user.id);
    setKaydediliyor(false);

    if (error) {
      setMesaj({ tip: 'hata', metin: 'Kaydedilemedi: ' + error.message });
    } else {
      setMesaj({ tip: 'basarili', metin: 'Bilgilerin kaydedildi.' });
      setTimeout(() => setMesaj(null), 3000);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Şifre değiştirme
  // ─────────────────────────────────────────────────────────────
  const [eskiSifre, setEskiSifre] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [sifreKaydediliyor, setSifreKaydediliyor] = useState(false);
  const [sifreMesaj, setSifreMesaj] = useState<
    { tip: 'basarili' | 'hata'; metin: string } | null
  >(null);

  const sifreDegistir = async () => {
    setSifreMesaj(null);
    // Güçlü şifre kuralı — kayıt + şifre yenileme akışıyla aynı
    const sifreGuclu = /^(?=.*[A-Za-zÇĞİÖŞÜçğıöşü])(?=.*\d).{8,}$/.test(yeniSifre);
    if (!sifreGuclu) {
      setSifreMesaj({
        tip: 'hata',
        metin: 'Şifre en az 8 karakter olmalı, en az 1 harf ve 1 rakam içermeli.',
      });
      return;
    }
    if (yeniSifre !== yeniSifreTekrar) {
      setSifreMesaj({ tip: 'hata', metin: 'Yeni şifreler eşleşmiyor.' });
      return;
    }
    if (eskiSifre === yeniSifre) {
      setSifreMesaj({ tip: 'hata', metin: 'Yeni şifre eskisinden farklı olmalı.' });
      return;
    }
    if (!user?.email) {
      setSifreMesaj({ tip: 'hata', metin: 'Oturum bilgisi bulunamadı.' });
      return;
    }
    setSifreKaydediliyor(true);

    // Önce eski şifreyi doğrula
    const dogrulama = await girisYap(user.email, eskiSifre);
    if (!dogrulama.basarili) {
      setSifreKaydediliyor(false);
      setSifreMesaj({ tip: 'hata', metin: 'Mevcut şifren hatalı.' });
      return;
    }

    const sonuc = await sifreyiYenile(yeniSifre);
    setSifreKaydediliyor(false);
    if (!sonuc.basarili) {
      setSifreMesaj({ tip: 'hata', metin: sonuc.hata ?? 'Şifre güncellenemedi.' });
      return;
    }
    setSifreMesaj({ tip: 'basarili', metin: 'Şifren güncellendi.' });
    setEskiSifre('');
    setYeniSifre('');
    setYeniSifreTekrar('');
    setTimeout(() => setSifreMesaj(null), 3000);
  };

  // ─────────────────────────────────────────────────────────────
  // Karne PDF indir — lazy
  // ─────────────────────────────────────────────────────────────
  const [karneYukleniyor, setKarneYukleniyor] = useState(false);
  const [karneHata, setKarneHata] = useState<string | null>(null);
  const karneIndir = async () => {
    setKarneYukleniyor(true);
    setKarneHata(null);
    try {
      const { karneyiIndir } = await import('../../lib/karne-pdf');
      await karneyiIndir({
        ilerleme,
        stat,
        uniteler,
        profil: {
          universite: profil.universite,
          bolum: profil.bolum,
          sinif: profil.sinif,
          hedef: profil.hedef,
        },
      });
    } catch (e) {
      setKarneHata(`PDF üretilemedi: ${(e as Error).message}`);
    } finally {
      setKarneYukleniyor(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Hesap silme — onay modalı
  // ─────────────────────────────────────────────────────────────
  const nav = useNavigate();
  const [silOnay, setSilOnay] = useState(false);
  const [silOnayMetni, setSilOnayMetni] = useState('');
  const [silSifre, setSilSifre] = useState('');
  const [siliniyor, setSiliniyor] = useState(false);
  const [silHata, setSilHata] = useState<string | null>(null);

  const hesabiSil = async () => {
    if (!user?.email) {
      setSilHata('Oturum bilgisi bulunamadı.');
      return;
    }
    setSiliniyor(true);
    setSilHata(null);

    const dogrulama = await girisYap(user.email, silSifre);
    if (!dogrulama.basarili) {
      setSiliniyor(false);
      setSilHata('Şifre hatalı.');
      return;
    }

    const { error } = await supabase.rpc('hesap_sil');
    if (error) {
      setSiliniyor(false);
      setSilHata(`Hesap silinemedi: ${error.message}`);
      return;
    }
    await cikisYap();
    nav('/', { replace: true });
  };

  // ─────────────────────────────────────────────────────────────
  // Ortak class string'leri
  // ─────────────────────────────────────────────────────────────
  const inputClass =
    'w-full bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium transition';
  const labelClass =
    'block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2';
  const sectionTitleClass =
    'font-display text-xl md:text-2xl tracking-tight font-bold mb-4';
  const sectionCardClass =
    'bg-surface border border-line rounded-2xl p-6';
  const primaryBtnClass =
    'inline-flex items-center gap-2 bg-ink text-bg px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed';

  const goruntuAd =
    [profil.ad, profil.soyad].filter(Boolean).join(' ').trim() ||
    ilerleme.kullaniciAdi ||
    user?.email?.split('@')[0] ||
    'Öğrenci';

  return (
    <div className="space-y-10">
      {/* ──── 1. HESAP ──── */}
      <section>
        <h2 className={sectionTitleClass}>Hesap</h2>
        <div className={sectionCardClass}>
          {/* Üst şerit — avatar + isim + email + üyelik pill */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-line-soft">
            <InitialsAvatar ad={goruntuAd} size={56} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-[18px] font-bold tracking-tight text-ink leading-tight">
                  {goruntuAd}
                </span>
                {isPremium ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase"
                    style={{ background: 'var(--copper-soft)', color: 'var(--copper-deep)' }}
                  >
                    <Icon name="BadgeCheck" size={10} />
                    Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-surface-2 text-ink-mute">
                    Free
                  </span>
                )}
              </div>
              <div className="text-[12px] text-ink-soft font-mono mt-1 truncate">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Görünen Ad */}
          <div className="mb-5">
            <label className={labelClass}>Görünen Ad</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={adTaslak}
                onChange={(e) => setAdTaslak(e.target.value)}
                maxLength={30}
                placeholder="Öğrenci"
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={adKaydet}
                disabled={!adDegisti || adKaydediliyor}
                className={primaryBtnClass}
              >
                {adKaydediliyor ? (
                  <Icon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <Icon name="Save" size={12} />
                )}
                Kaydet
              </button>
            </div>
            <p className="text-[11.5px] text-ink-mute mt-1.5 leading-snug">
              Sıralamalar, paylaşımlar ve karnede gözüken takma adın.
            </p>
            {adMesaj && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-success dark:text-success font-bold">
                <Icon name="Check" size={12} />
                {adMesaj}
              </div>
            )}
          </div>

          {/* Ad + Soyad (Supabase'e ayrı kaydet butonunda gider — Eğitim bilgileriyle birlikte) */}
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Ad</label>
                <input
                  type="text"
                  value={profil.ad}
                  onChange={(e) => onProfilDegis({ ...profil, ad: e.target.value })}
                  maxLength={50}
                  placeholder="Adın"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Soyad</label>
                <input
                  type="text"
                  value={profil.soyad}
                  onChange={(e) => onProfilDegis({ ...profil, soyad: e.target.value })}
                  maxLength={50}
                  placeholder="Soyadın"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* E-posta — read-only */}
          {user && (
            <div>
              <label className={labelClass}>E-posta</label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email ?? ''}
                  readOnly
                  className={`${inputClass} pr-12 bg-surface-2/50 cursor-not-allowed text-ink-soft font-mono`}
                />
                <button
                  type="button"
                  onClick={emailKopyala}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-md text-ink-mute hover:text-ink hover:bg-bg-tint transition"
                  title={emailKopyalandi ? 'Kopyalandı' : 'Kopyala'}
                >
                  <Icon name={emailKopyalandi ? 'Check' : 'Copy'} size={13} />
                </button>
              </div>
              <p className="text-[11.5px] text-ink-mute mt-1.5 leading-snug">
                Bu adres şu an değiştirilemez. Yardım için{' '}
                <a
                  href="mailto:bilgi@muhasebeakademi.com"
                  className="underline hover:text-ink"
                >
                  bilgi@muhasebeakademi.com
                </a>
                .
              </p>
            </div>
          )}

          {/* Ad/Soyad değiştiyse kaydet uyarısı — Eğitim Bilgileri ortak butonu kullanıyor */}
          {user && (profil.ad || profil.soyad) && (
            <div className="mt-5 pt-5 border-t border-line-soft flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[12px] text-ink-mute leading-snug">
                Ad, Soyad ve eğitim bilgilerin tek seferde aşağıdaki <strong>Kaydet</strong> butonuyla saklanır.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ──── 2. EĞİTİM BİLGİLERİ ──── */}
      {user && (
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className={sectionTitleClass + ' mb-0'}>Eğitim Bilgileri</h2>
            {profilYukleniyor && (
              <Icon name="Loader2" size={14} className="animate-spin text-ink-quiet" />
            )}
          </div>

          <div className={sectionCardClass + ' space-y-5'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Üniversite</label>
                <input
                  type="text"
                  value={profil.universite}
                  onChange={(e) => onProfilDegis({ ...profil, universite: e.target.value })}
                  maxLength={80}
                  placeholder="Örn: Boğaziçi, ODTÜ..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Bölüm</label>
                <input
                  type="text"
                  value={profil.bolum}
                  onChange={(e) => onProfilDegis({ ...profil, bolum: e.target.value })}
                  maxLength={80}
                  placeholder="Örn: İşletme, İktisat..."
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Sınıf</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(Object.keys(SINIF_LABEL) as Exclude<Sinif, ''>[]).map((kod) => (
                  <button
                    key={kod}
                    type="button"
                    onClick={() =>
                      onProfilDegis({ ...profil, sinif: profil.sinif === kod ? '' : kod })
                    }
                    className={`px-2.5 py-2 text-xs font-bold rounded-lg border-2 transition ${
                      profil.sinif === kod
                        ? 'border-ink bg-bg-tint text-ink'
                        : 'border-line hover:border-ink text-ink-soft'
                    }`}
                  >
                    {SINIF_LABEL[kod]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Hedef</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(HEDEF_LABEL) as Exclude<Hedef, ''>[]).map((kod) => (
                  <button
                    key={kod}
                    type="button"
                    onClick={() =>
                      onProfilDegis({ ...profil, hedef: profil.hedef === kod ? '' : kod })
                    }
                    className={`px-2.5 py-2 text-xs font-bold rounded-lg border-2 transition ${
                      profil.hedef === kod
                        ? 'border-ink bg-bg-tint text-ink'
                        : 'border-line hover:border-ink text-ink-soft'
                    }`}
                  >
                    {HEDEF_LABEL[kod]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  Doğum Yılı <span className="text-ink-quiet normal-case tracking-normal">(opsiyonel)</span>
                </label>
                <input
                  type="number"
                  value={profil.dogumYili}
                  onChange={(e) => onProfilDegis({ ...profil, dogumYili: e.target.value })}
                  min={1950}
                  max={2015}
                  placeholder="1998"
                  className={inputClass + ' font-mono'}
                />
              </div>
            </div>

            {mesaj && (
              <div
                className={`flex items-start gap-2 p-3 rounded-lg text-sm font-medium ${
                  mesaj.tip === 'basarili'
                    ? 'bg-success-soft border border-success-soft text-success'
                    : 'bg-danger-soft border border-danger-soft text-danger'
                }`}
              >
                <Icon
                  name={mesaj.tip === 'basarili' ? 'CheckCircle2' : 'AlertCircle'}
                  size={16}
                  className="flex-shrink-0 mt-0.5"
                />
                <span>{mesaj.metin}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={kaydet}
                disabled={kaydediliyor || profilYukleniyor}
                className={primaryBtnClass}
              >
                {kaydediliyor ? (
                  <>
                    <Icon name="Loader2" size={12} className="animate-spin" />
                    Kaydediliyor
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={12} />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ──── 3. GÜVENLİK ──── */}
      {user && (
        <section>
          <h2 className={sectionTitleClass}>Güvenlik</h2>
          <div className={sectionCardClass + ' space-y-4'}>
            <div>
              <h3 className="text-[13px] font-bold text-ink mb-1">Şifre Değiştir</h3>
              <p className="text-[11.5px] text-ink-mute mb-4 leading-snug">
                Yeni şifren en az 8 karakter olmalı; 1 harf + 1 rakam içermeli.
              </p>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Mevcut Şifre</label>
                  <div className="relative">
                    <input
                      type={sifreGoster ? 'text' : 'password'}
                      value={eskiSifre}
                      onChange={(e) => setEskiSifre(e.target.value)}
                      autoComplete="current-password"
                      className={inputClass + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setSifreGoster((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-quiet hover:text-ink-soft transition"
                      tabIndex={-1}
                    >
                      <Icon name={sifreGoster ? 'EyeOff' : 'Eye'} size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Yeni Şifre</label>
                    <input
                      type={sifreGoster ? 'text' : 'password'}
                      value={yeniSifre}
                      onChange={(e) => setYeniSifre(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      className={inputClass}
                      placeholder="8+ karakter, 1 harf, 1 rakam"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Yeni Şifre (Tekrar)</label>
                    <input
                      type={sifreGoster ? 'text' : 'password'}
                      value={yeniSifreTekrar}
                      onChange={(e) => setYeniSifreTekrar(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      className={inputClass}
                    />
                  </div>
                </div>

                {sifreMesaj && (
                  <div
                    className={`flex items-start gap-2 p-3 rounded-lg text-sm font-medium ${
                      sifreMesaj.tip === 'basarili'
                        ? 'bg-success-soft border border-success-soft text-success'
                        : 'bg-danger-soft border border-danger-soft text-danger'
                    }`}
                  >
                    <Icon
                      name={sifreMesaj.tip === 'basarili' ? 'CheckCircle2' : 'AlertCircle'}
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <span>{sifreMesaj.metin}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={sifreDegistir}
                    disabled={
                      sifreKaydediliyor || !eskiSifre || !yeniSifre || !yeniSifreTekrar
                    }
                    className={primaryBtnClass}
                  >
                    {sifreKaydediliyor ? (
                      <>
                        <Icon name="Loader2" size={12} className="animate-spin" />
                        Güncelleniyor
                      </>
                    ) : (
                      <>
                        <Icon name="Save" size={12} />
                        Şifreyi Değiştir
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2FA placeholder */}
            <div className="pt-5 border-t border-line-soft">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-bg-tint flex items-center justify-center text-ink-mute">
                  <Icon name="Shield" size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-ink">İki Adımlı Doğrulama</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-surface-2 text-ink-mute">
                      Yakında
                    </span>
                  </div>
                  <p className="text-[11.5px] text-ink-mute mt-0.5 leading-snug">
                    Hesabını ekstra güvenlik katmanıyla koru. Telefon uygulaması ile tek seferlik kod.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ──── 4. TERCİHLER ──── */}
      <section>
        <h2 className={sectionTitleClass}>Tercihler</h2>
        <div className={sectionCardClass + ' divide-y divide-line-soft'}>
          {/* Tema */}
          <button
            onClick={onTemaDegistir}
            className="w-full flex items-center justify-between py-3.5 first:pt-0 last:pb-0 text-left group"
          >
            <div className="flex items-center gap-3">
              <Icon
                name={ilerleme.tema === 'dark' ? 'Moon' : 'Sun'}
                size={16}
                className="text-ink-soft"
              />
              <div>
                <div className="text-[13.5px] font-semibold text-ink">Görünüm</div>
                <div className="text-[11.5px] text-ink-mute font-medium mt-0.5">
                  {ilerleme.tema === 'dark' ? 'Karanlık tema aktif' : 'Açık tema aktif'}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-ink-mute group-hover:text-ink transition">
              {ilerleme.tema === 'dark' ? '→ Açık' : '→ Karanlık'}
            </span>
          </button>

          {/* Bülten */}
          {user && (
            <label className="flex items-start gap-3 cursor-pointer py-3.5 first:pt-0 last:pb-0">
              <input
                type="checkbox"
                checked={profil.bultenIzni}
                onChange={(e) => onProfilDegis({ ...profil, bultenIzni: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-line-strong text-brand focus:ring-blue-500/30 cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-ink">
                  E-posta bülteni
                </div>
                <div className="text-[11.5px] text-ink-mute leading-snug mt-0.5">
                  Yeni özellikler ve içerik güncellemelerini ayda 1-2 mail ile öğren. İstediğin zaman kapatabilirsin.
                </div>
              </div>
            </label>
          )}
        </div>
      </section>

      {/* ──── 5. VERİLERİM ──── */}
      <section>
        <h2 className={sectionTitleClass}>Verilerim</h2>
        <div className={sectionCardClass + ' divide-y divide-line-soft'}>
          <button
            onClick={karneIndir}
            disabled={karneYukleniyor}
            className="w-full flex items-center justify-between py-3.5 first:pt-0 text-left disabled:opacity-60 disabled:cursor-wait group"
          >
            <div className="flex items-center gap-3">
              {karneYukleniyor ? (
                <Icon name="Loader2" size={16} className="animate-spin text-ink-soft" />
              ) : (
                <Icon name="FileDown" size={16} className="text-ink-soft" />
              )}
              <div>
                <div className="text-[13.5px] font-semibold text-ink">Karnemi PDF indir</div>
                <div className="text-[11.5px] text-ink-mute font-medium mt-0.5 leading-snug">
                  CV-andıran akademik karne · yetkinlik · aktivite haritası · doğrulama kodu
                </div>
              </div>
            </div>
            <Icon name="ChevronRight" size={14} className="text-ink-quiet group-hover:text-ink transition flex-shrink-0" />
          </button>

          {stat.cozulenSayi > 0 && stat.cozulenSayi < 20 && (
            <div className="py-3 text-[12px] text-ink-soft leading-relaxed">
              <span className="font-bold text-ink">{stat.cozulenSayi}</span> soru çözdün. Karne her zaman indirilebilir, ama <span className="font-bold">20+ çözümle</span> daha dolu bir karne oluşur — heatmap, modül haritası ve rozetler dolmaya başlar.
            </div>
          )}
          {karneHata && (
            <div className="py-3 text-[12px] text-danger font-medium">{karneHata}</div>
          )}

          <button
            onClick={onSifirla}
            className="w-full flex items-center justify-between py-3.5 last:pb-0 text-left group"
          >
            <div className="flex items-center gap-3">
              <Icon name="RotateCcw" size={16} className="text-ink-soft" />
              <div>
                <div className="text-[13.5px] font-semibold text-ink">İlerlememi sıfırla</div>
                <div className="text-[11.5px] text-ink-mute font-medium mt-0.5 leading-snug">
                  Tüm çözümlerin, rozetlerin ve aktivite geçmişin sıfırlanır. Hesap silinmez.
                </div>
              </div>
            </div>
            <Icon name="ChevronRight" size={14} className="text-ink-quiet group-hover:text-ink transition flex-shrink-0" />
          </button>
        </div>
      </section>

      {/* ──── 6. TEHLİKELİ BÖLGE ──── (KVKK madde 11) */}
      {user && (
        <section className="mt-16">
          <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold text-danger mb-2">
            Tehlikeli Bölge
          </h2>
          <p className="text-[13px] text-ink-soft mb-4 leading-relaxed">
            Hesabını silersen tüm ilerlemen, rozetlerin, çözümlerin geri dönülmez şekilde silinir. Mali kayıtlar (ödeme geçmişi) saklanır ama seninle bağlantısı kopar.
          </p>
          <div className="border border-danger/40 bg-danger-soft/20 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Icon name="AlertTriangle" size={18} className="text-danger flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[13.5px] font-bold text-ink">Hesabımı kalıcı olarak sil</div>
                <div className="text-[11.5px] text-ink-mute mt-0.5 leading-snug">
                  Bu işlem geri alınamaz. Onaylamak için <span className="font-mono font-bold">SİL</span> yazman ve şifreni girmen gerekir.
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSilOnay(true);
                setSilOnayMetni('');
                setSilSifre('');
                setSilHata(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-danger/40 hover:bg-danger-soft text-danger text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg active:scale-[0.98] transition flex-shrink-0"
            >
              <Icon name="Trash2" size={13} />
              Hesabımı Sil
            </button>
          </div>
        </section>
      )}

      {/* Hesap silme onay modalı — değişiklik yok, sadece daha temiz nested yapı */}
      {silOnay && (
        <div
          className="fixed inset-0 z-[120] bg-ink/55 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          onClick={() => !siliniyor && setSilOnay(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface border border-danger-soft rounded-2xl shadow-2xl my-auto"
          >
            <div className="p-5 border-b border-line">
              <div className="flex items-center gap-2 text-danger mb-2">
                <Icon name="AlertTriangle" size={18} />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold">
                  Geri alınamaz
                </span>
              </div>
              <h2 className="font-display text-xl font-bold tracking-tight">
                Hesabını silmek üzeresin
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-[13.5px] text-ink-soft leading-relaxed">
                Bu işlem hesabını, çözümlerini, rozetlerini, profil bilgilerini kalıcı olarak siler. <strong>Geri dönüşü yok.</strong>
              </p>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold mb-2">
                  Onaylamak için <span className="font-mono text-danger">SİL</span> yaz
                </label>
                <input
                  type="text"
                  value={silOnayMetni}
                  onChange={(e) => setSilOnayMetni(e.target.value)}
                  className="w-full px-3 py-2.5 bg-bg-tint border border-line-strong focus:border-danger dark:focus:border-danger rounded-lg text-sm font-mono outline-none"
                  placeholder="SİL"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold mb-2">
                  Şifren
                </label>
                <input
                  type="password"
                  value={silSifre}
                  onChange={(e) => setSilSifre(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 bg-bg-tint border border-line-strong focus:border-danger dark:focus:border-danger rounded-lg text-sm font-medium outline-none"
                  placeholder="Mevcut şifreni gir"
                />
              </div>
              {silHata && (
                <div className="flex items-start gap-2 p-3 bg-danger-soft border border-danger-soft rounded-lg text-[13px] text-danger font-medium">
                  <Icon name="AlertCircle" size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{silHata}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-line">
              <button
                onClick={() => setSilOnay(false)}
                disabled={siliniyor}
                className="px-4 py-2 text-[12px] font-bold text-ink-soft hover:bg-surface-2 rounded-lg transition disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                onClick={hesabiSil}
                disabled={
                  silOnayMetni.trim().toUpperCase() !== 'SİL' || !silSifre || siliniyor
                }
                className="inline-flex items-center gap-2 bg-danger hover:bg-danger dark:bg-danger dark:hover:bg-danger text-bg px-4 py-2 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {siliniyor ? (
                  <>
                    <Icon name="Loader2" size={13} className="animate-spin" />
                    Siliniyor
                  </>
                ) : (
                  <>
                    <Icon name="Trash2" size={13} />
                    Hesabımı Sil
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
