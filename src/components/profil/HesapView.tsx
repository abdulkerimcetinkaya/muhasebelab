import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Icon } from '../Icon';
import { InitialsAvatar } from '../InitialsAvatar';
import { useIsPremium } from '../../contexts/AuthContext';
import { useUniteler } from '../../contexts/UnitelerContext';
import { cikisYap, girisYap, sifreyiYenile } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { Ilerleme, Istatistik } from '../../types';
import {
  EGITIM_DURUMU_LABEL,
  LISE_SINIFLARI,
  MESLEK_LABEL,
  SINIF_LABEL,
  UNI_SINIFLARI,
} from './types';
import type {
  EgitimDurumu,
  Meslek,
  ProfilBilgi,
  Sinif,
} from './types';

// Hakkında bölümü için satır şablonu — label-sol/control-sağ, mobilde stacklenir.
// first/last padding sıfırlanır → card içinde ilk satır ve son satır rahat oturur.
const ProfilSatir = ({
  etiket,
  children,
}: {
  etiket: string;
  children: ReactNode;
}) => (
  <div className="py-4 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[120px_1fr] sm:gap-5 sm:items-center">
    <label className="block text-[12.5px] font-medium text-ink-soft mb-1.5 sm:mb-0">
      {etiket}
    </label>
    <div>{children}</div>
  </div>
);

// Seçilebilir pill butonu — persona, sınıf, staj_yer vb tüm pill row'larında kullanılır.
const SecimPill = ({
  aktif,
  onClick,
  children,
  boyut = 'normal',
}: {
  aktif: boolean;
  onClick: () => void;
  children: ReactNode;
  boyut?: 'normal' | 'kompakt';
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`${
      boyut === 'kompakt' ? 'px-3 py-1.5 text-[12px]' : 'px-3.5 py-1.5 text-[12.5px]'
    } font-semibold rounded-full border transition active:scale-[0.97] ${
      aktif
        ? 'border-ink bg-ink text-bg'
        : 'border-line hover:border-line-strong text-ink-soft'
    }`}
  >
    {children}
  </button>
);

// 3 parça → tek ISO date string ve geri dönüşüm — date input ile çalışmak için.
const dogumIso = (p: ProfilBilgi): string => {
  if (!p.dogumYil || !p.dogumAy || !p.dogumGun) return '';
  return `${p.dogumYil}-${p.dogumAy.padStart(2, '0')}-${p.dogumGun.padStart(2, '0')}`;
};

const isoToParcala = (
  iso: string,
): Pick<ProfilBilgi, 'dogumGun' | 'dogumAy' | 'dogumYil'> => {
  if (!iso) return { dogumGun: '', dogumAy: '', dogumYil: '' };
  const [yil, ay, gun] = iso.split('-');
  return {
    dogumYil: yil ?? '',
    dogumAy: String(parseInt(ay ?? '0', 10)),
    dogumGun: String(parseInt(gun ?? '0', 10)),
  };
};

interface Props {
  user: User | null;
  ilerleme: Ilerleme;
  stat: Istatistik;
  profil: ProfilBilgi;
  onProfilDegis: (yeni: ProfilBilgi) => void;
  profilYukleniyor: boolean;
  onKullaniciAdiGuncelle: (ad: string) => Promise<void>;
  onTemaDegistir: () => void;
  onSifirla: () => void;
}

/**
 * Hesap ayarları görünümü — sadeleştirilmiş yapı (migration 20260518000001):
 *
 * 1. Hesap     — avatar + takma ad (unique) + ad/soyad + e-posta + üyelik
 * 2. Hakkında  — durum (öğrenci/çalışan) + doğum tarihi + conditional alanlar
 *                (öğrenci: okul/bölüm/sınıf · çalışan: deneyim)
 * 3. Güvenlik  — şifre değiştir + 2FA placeholder
 * 4. Tercihler — tema + bülten izni
 * 5. Verilerim — karne PDF + ilerleme sıfırla
 * 6. Tehlikeli — hesap silme
 *
 * Eski 13 alanlık karmaşa (Profilin/Hedefin/Tanışalım) yerine 4-5 alanlık
 * "Hakkında". Hedef/HaftalikHedef/Sektör/NeredenDuydu UI'dan kaldırıldı
 * (DB kolonları kalır — gelecekte gerekirse tekrar gösterilir).
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
  // Hesap — Takma ad (App state seviyesi, ayrı kaydetme akışı, unique)
  // ─────────────────────────────────────────────────────────────
  const [adTaslak, setAdTaslak] = useState(ilerleme.kullaniciAdi);
  const [adKaydediliyor, setAdKaydediliyor] = useState(false);
  const [adMesaj, setAdMesaj] = useState<
    { tip: 'basarili' | 'hata'; metin: string } | null
  >(null);
  useEffect(() => {
    setAdTaslak(ilerleme.kullaniciAdi);
  }, [ilerleme.kullaniciAdi]);
  const adDegisti = adTaslak.trim() !== ilerleme.kullaniciAdi.trim();

  // Hesap kartı Kaydet butonu: takma_ad + ad + soyad birlikte. (Önceden sadece
  // takma_ad kaydediyordu; ad/soyad inputları görünüyor ama save akışı
  // Hakkında butonuna bağlıydı — kullanıcı "kaydolmuyor" diyordu.)
  const adKaydet = async () => {
    const yeni = adTaslak.trim() || 'Öğrenci';
    setAdKaydediliyor(true);
    setAdMesaj(null);
    try {
      // 1. Takma ad: state + DB (App.tsx üzerinden, unique check throw eder)
      if (adDegisti) {
        await onKullaniciAdiGuncelle(yeni);
      }
      // 2. Ad + Soyad: doğrudan DB (sadece giriş yapan kullanıcı için)
      if (user) {
        const { error } = await supabase
          .from('kullanicilar')
          .update({
            ad: profil.ad.trim() || null,
            soyad: profil.soyad.trim() || null,
          })
          .eq('id', user.id);
        if (error) throw error;
      }
      setAdMesaj({ tip: 'basarili', metin: 'Hesap bilgilerin güncellendi.' });
      setTimeout(() => setAdMesaj(null), 2500);
    } catch (e) {
      const err = e as { code?: string; message?: string };
      const cakisma =
        err.code === '23505' ||
        (err.message ?? '').toLowerCase().includes('duplicate') ||
        (err.message ?? '').toLowerCase().includes('unique');
      setAdMesaj({
        tip: 'hata',
        metin: cakisma
          ? 'Bu takma ad zaten kullanılıyor. Başka bir tane dene.'
          : 'Kaydedilemedi: ' + (err.message ?? 'bilinmeyen hata'),
      });
    } finally {
      setAdKaydediliyor(false);
    }
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

    // Doğum tarihi — 3 parça birleştirilip ISO date string'ine dönüştürülür.
    // Üçünden biri eksikse tarih null (kullanıcı hiçbir şey girmemiş gibi).
    let dogumTarihi: string | null = null;
    if (profil.dogumGun && profil.dogumAy && profil.dogumYil) {
      const yil = parseInt(profil.dogumYil, 10);
      const ay = parseInt(profil.dogumAy, 10);
      const gun = parseInt(profil.dogumGun, 10);
      if (isNaN(yil) || isNaN(ay) || isNaN(gun)) {
        setKaydediliyor(false);
        setMesaj({ tip: 'hata', metin: 'Doğum tarihi hatalı.' });
        return;
      }
      // Geçerli tarih mi? (örn. 31 Şubat reddedilmeli)
      const d = new Date(yil, ay - 1, gun);
      if (d.getFullYear() !== yil || d.getMonth() !== ay - 1 || d.getDate() !== gun) {
        setKaydediliyor(false);
        setMesaj({ tip: 'hata', metin: 'Geçerli bir tarih gir (örn. 31 Şubat yok).' });
        return;
      }
      if (yil < 1950 || yil > 2015) {
        setKaydediliyor(false);
        setMesaj({ tip: 'hata', metin: 'Doğum yılı 1950-2015 arasında olmalı.' });
        return;
      }
      dogumTarihi = `${yil}-${String(ay).padStart(2, '0')}-${String(gun).padStart(2, '0')}`;
    }

    // Eğitim durumu yapısı (migration 20260518000003) — düz alanlar.
    // Sınıf eğitim durumuna göre filtre: mezunsa null. Meslek sadece mezunsa.
    // Supabase auto-gen types henüz regenerate edilmedi — any cast.
    const ogrenciMi = profil.egitimDurumu === 'lise' || profil.egitimDurumu === 'universite';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      ad: profil.ad.trim() || null,
      soyad: profil.soyad.trim() || null,
      egitim_durumu: profil.egitimDurumu === '' ? null : profil.egitimDurumu,
      universite: profil.universite.trim() || null,
      sinif: ogrenciMi && profil.sinif !== '' ? profil.sinif : null,
      dogum_tarihi: dogumTarihi,
      meslek:
        profil.egitimDurumu === 'mezun' && profil.meslek !== '' ? profil.meslek : null,
      bulten_izni: profil.bultenIzni,
    };

    const { error } = await supabase.from('kullanicilar').update(payload).eq('id', user.id);
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
          // bolum + hedef alanları UI'dan kaldırıldı — karne PDF için boş string geç
          bolum: '',
          sinif: profil.sinif,
          hedef: '',
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

          {/* Takma ad — unique, lower(kullanici_adi) üzerinde index */}
          <div className="mb-5">
            <label className={labelClass}>Takma Ad</label>
            <input
              type="text"
              value={adTaslak}
              onChange={(e) => setAdTaslak(e.target.value)}
              maxLength={30}
              placeholder="kerim"
              className={inputClass}
            />
            <p className="text-[11.5px] text-ink-mute mt-1.5 leading-snug">
              Sıralamalarda ve paylaşımlarda gözüken adın. Benzersiz olmalı.
            </p>
          </div>

          {/* Ad + Soyad — yukarıdaki "Kaydet" butonu ile birlikte kaydolur */}
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

          {/* Kaydet — takma_ad + ad + soyad birlikte */}
          <div className="mt-6 pt-5 border-t border-line-soft">
            {adMesaj && (
              <div
                className={`mb-3 flex items-start gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium ${
                  adMesaj.tip === 'basarili'
                    ? 'bg-success-soft border border-success-soft text-success'
                    : 'bg-danger-soft border border-danger-soft text-danger'
                }`}
              >
                <Icon
                  name={adMesaj.tip === 'basarili' ? 'CheckCircle2' : 'AlertCircle'}
                  size={15}
                  className="flex-shrink-0 mt-0.5"
                />
                <span>{adMesaj.metin}</span>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={adKaydet}
                disabled={adKaydediliyor}
                className={primaryBtnClass}
              >
                {adKaydediliyor ? (
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
        </div>
      </section>

      {/* ──── 2. HAKKINDA — minimalist satır düzeni, native date input ──── */}
      {user && (
        <section>
          <div className="flex items-baseline justify-between mb-1.5">
            <h2 className={sectionTitleClass + ' mb-0'}>Hakkında</h2>
            {profilYukleniyor && (
              <Icon name="Loader2" size={14} className="animate-spin text-ink-quiet" />
            )}
          </div>
          <p className="text-[12.5px] text-ink-mute mb-4 leading-snug">
            Seni biraz tanıyalım — hepsi opsiyonel.
          </p>

          {/* Card içinde satırlar — Tercihler/Verilerim ile aynı pattern (divide-y) */}
          <div className={sectionCardClass + ' divide-y divide-line-soft'}>
            {/* Eğitim durumu — bağımsız 3'lü pill */}
            <ProfilSatir etiket="Eğitim">
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(EGITIM_DURUMU_LABEL) as Exclude<EgitimDurumu, ''>[]).map(
                  (kod) => (
                    <SecimPill
                      key={kod}
                      aktif={profil.egitimDurumu === kod}
                      onClick={() => {
                        const yeniDurum = profil.egitimDurumu === kod ? '' : kod;
                        // Eğitim durumu değişince sınıf'ı temizle — eski sınıf
                        // yeni durumla uyumsuz olabilir (örn: lise 9 → mezun)
                        onProfilDegis({
                          ...profil,
                          egitimDurumu: yeniDurum,
                          sinif: '',
                        });
                      }}
                    >
                      {EGITIM_DURUMU_LABEL[kod]}
                    </SecimPill>
                  ),
                )}
              </div>
            </ProfilSatir>

            {/* Okul adı — her zaman göster (lise / üni / mezun olunan kurum) */}
            <ProfilSatir etiket="Okul">
              <input
                type="text"
                value={profil.universite}
                onChange={(e) => onProfilDegis({ ...profil, universite: e.target.value })}
                maxLength={80}
                placeholder={
                  profil.egitimDurumu === 'lise'
                    ? 'Lise adı'
                    : profil.egitimDurumu === 'universite'
                      ? 'Üniversite adı'
                      : 'Mezun olduğun okul (opsiyonel)'
                }
                className={inputClass}
              />
            </ProfilSatir>

            {/* Sınıf — sadece lise / üniversite seçiliyse */}
            {(profil.egitimDurumu === 'lise' || profil.egitimDurumu === 'universite') && (
              <ProfilSatir etiket="Sınıf">
                <div className="flex flex-wrap gap-1.5">
                  {(profil.egitimDurumu === 'lise' ? LISE_SINIFLARI : UNI_SINIFLARI).map(
                    (kod) => (
                      <SecimPill
                        key={kod}
                        boyut="kompakt"
                        aktif={profil.sinif === kod}
                        onClick={() =>
                          onProfilDegis({
                            ...profil,
                            sinif: profil.sinif === kod ? '' : (kod as Sinif),
                          })
                        }
                      >
                        {SINIF_LABEL[kod]}
                      </SecimPill>
                    ),
                  )}
                </div>
              </ProfilSatir>
            )}

            {/* Doğum tarihi — tek native date input */}
            <ProfilSatir etiket="Doğum yılı">
              <input
                type="date"
                value={dogumIso(profil)}
                min="1950-01-01"
                max="2015-12-31"
                onChange={(e) => onProfilDegis({ ...profil, ...isoToParcala(e.target.value) })}
                className={`${inputClass} max-w-[200px] font-mono`}
              />
            </ProfilSatir>

            {/* Meslek — sadece mezun seçiliyse */}
            {profil.egitimDurumu === 'mezun' && (
              <ProfilSatir etiket="Meslek">
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(MESLEK_LABEL) as Exclude<Meslek, ''>[]).map((kod) => (
                    <SecimPill
                      key={kod}
                      boyut="kompakt"
                      aktif={profil.meslek === kod}
                      onClick={() =>
                        onProfilDegis({
                          ...profil,
                          meslek: profil.meslek === kod ? '' : kod,
                        })
                      }
                    >
                      {MESLEK_LABEL[kod]}
                    </SecimPill>
                  ))}
                </div>
              </ProfilSatir>
            )}

            {/* Mesaj + Kaydet — card içinde, satırlardan ayrı bir blok */}
            <div className="pt-4">
              {mesaj && (
                <div
                  className={`mb-3 flex items-start gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium ${
                    mesaj.tip === 'basarili'
                      ? 'bg-success-soft border border-success-soft text-success'
                      : 'bg-danger-soft border border-danger-soft text-danger'
                  }`}
                >
                  <Icon
                    name={mesaj.tip === 'basarili' ? 'CheckCircle2' : 'AlertCircle'}
                    size={15}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <span>{mesaj.metin}</span>
                </div>
              )}
              <div className="flex justify-end">
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
          {/* Tema — pill toggle (sun/moon, ink knob, brand bg-tint track) */}
          <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <div>
              <div className="text-[13.5px] font-semibold text-ink">Görünüm</div>
              <div className="text-[11.5px] text-ink-mute font-medium mt-0.5">
                {ilerleme.tema === 'dark' ? 'Karanlık tema aktif' : 'Açık tema aktif'}
              </div>
            </div>
            <button
              type="button"
              onClick={onTemaDegistir}
              aria-label={
                ilerleme.tema === 'dark'
                  ? 'Açık temaya geç'
                  : 'Karanlık temaya geç'
              }
              role="switch"
              aria-checked={ilerleme.tema === 'dark'}
              className="relative w-[60px] h-[30px] rounded-full bg-bg-tint border border-line-strong hover:border-ink/50 transition flex-shrink-0"
            >
              {/* Sun — sol */}
              <Icon
                name="Sun"
                size={12}
                className={`absolute left-[8px] top-1/2 -translate-y-1/2 transition-colors ${
                  ilerleme.tema === 'dark' ? 'text-ink-mute' : 'text-ink-quiet'
                }`}
              />
              {/* Moon — sağ */}
              <Icon
                name="Moon"
                size={12}
                className={`absolute right-[8px] top-1/2 -translate-y-1/2 transition-colors ${
                  ilerleme.tema === 'dark' ? 'text-ink-quiet' : 'text-ink-mute'
                }`}
              />
              {/* Knob — aktif tarafın üzerine sliding ink daire */}
              <span
                className="absolute top-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full bg-ink shadow-sm transition-transform duration-200 ease-out"
                style={{
                  left: '2px',
                  transform: `translateY(-50%) translateX(${
                    ilerleme.tema === 'dark' ? '30px' : '0px'
                  })`,
                }}
              />
            </button>
          </div>

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
