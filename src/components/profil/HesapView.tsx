import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Icon } from '../Icon';
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
 * Eğitim bilgileri formu + uygulama ayarları (tema, dışa aktar, sıfırla).
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

  // Karne PDF — lazy import (~600KB chunk yalnız tıklama anında yüklenir)
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
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: 'basarili' | 'hata'; metin: string } | null>(null);

  // Kullanıcı adı yerel taslağı — kaydedilene kadar değişimi App'e duyurma
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
      setAdMesaj('Adın güncellendi.');
      setTimeout(() => setAdMesaj(null), 2500);
    }, 200);
  };

  // Şifre değiştirme state
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
    if (yeniSifre.length < 6) {
      setSifreMesaj({ tip: 'hata', metin: 'Yeni şifre en az 6 karakter olmalı.' });
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

    // Önce eski şifreyi doğrula — laptop açık bırakıldı senaryosunu engeller
    const dogrulama = await girisYap(user.email, eskiSifre);
    if (!dogrulama.basarili) {
      setSifreKaydediliyor(false);
      setSifreMesaj({ tip: 'hata', metin: 'Mevcut şifren hatalı.' });
      return;
    }

    // Yeni şifreyi set et
    const sonuc = await sifreyiYenile(yeniSifre);
    setSifreKaydediliyor(false);
    if (!sonuc.basarili) {
      setSifreMesaj({
        tip: 'hata',
        metin: sonuc.hata ?? 'Şifre güncellenemedi.',
      });
      return;
    }
    setSifreMesaj({ tip: 'basarili', metin: 'Şifren güncellendi.' });
    setEskiSifre('');
    setYeniSifre('');
    setYeniSifreTekrar('');
    setTimeout(() => setSifreMesaj(null), 3000);
  };

  // Hesap silme — onay modalı
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

    // Önce şifre doğrula — paylaşılan cihaz / oturum hijack senaryosunu engeller
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
    // Auth oturumunu da kapatıp landing'e döndür
    await cikisYap();
    nav('/', { replace: true });
  };

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
      setMesaj({ tip: 'basarili', metin: 'Profil bilgilerin kaydedildi.' });
      setTimeout(() => setMesaj(null), 3000);
    }
  };

  return (
    <div className="space-y-12">
      {/* Kullanıcı Adı — App-state seviyesi, ayrı kaydetme akışı */}
      <section>
        <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold mb-4">
          Görünen Ad
        </h2>
        <div className="bg-surface border border-line rounded-2xl p-6">
          <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
            Profilde gözüken ad
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={adTaslak}
              onChange={(e) => setAdTaslak(e.target.value)}
              maxLength={30}
              placeholder="Öğrenci"
              className="flex-1 bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium"
            />
            <button
              onClick={adKaydet}
              disabled={!adDegisti || adKaydediliyor}
              className="inline-flex items-center justify-center gap-2 bg-ink text-bg px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adKaydediliyor ? (
                <Icon name="Loader2" size={12} className="animate-spin" />
              ) : (
                <Icon name="Save" size={12} />
              )}
              Kaydet
            </button>
          </div>
          {adMesaj && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-success dark:text-success font-bold">
              <Icon name="Check" size={12} />
              {adMesaj}
            </div>
          )}
        </div>
      </section>

      {user && (
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold">
              Eğitim Bilgileri
            </h2>
            {profilYukleniyor && (
              <Icon name="Loader2" size={14} className="animate-spin text-ink-quiet" />
            )}
          </div>

          <div className="bg-surface border border-line rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
                  Üniversite
                </label>
                <input
                  type="text"
                  value={profil.universite}
                  onChange={(e) => onProfilDegis({ ...profil, universite: e.target.value })}
                  maxLength={80}
                  placeholder="Örn: Boğaziçi, ODTÜ..."
                  className="w-full bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
                  Bölüm
                </label>
                <input
                  type="text"
                  value={profil.bolum}
                  onChange={(e) => onProfilDegis({ ...profil, bolum: e.target.value })}
                  maxLength={80}
                  placeholder="Örn: İşletme, İktisat..."
                  className="w-full bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
                Sınıf
              </label>
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
              <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
                Hedef
              </label>
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
                <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
                  Doğum Yılı{' '}
                  <span className="text-ink-quiet">(opsiyonel)</span>
                </label>
                <input
                  type="number"
                  value={profil.dogumYili}
                  onChange={(e) => onProfilDegis({ ...profil, dogumYili: e.target.value })}
                  min={1950}
                  max={2015}
                  placeholder="1998"
                  className="w-full bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium font-mono"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={profil.bultenIzni}
                onChange={(e) => onProfilDegis({ ...profil, bultenIzni: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-line-strong text-brand focus:ring-blue-500/30 cursor-pointer"
              />
              <span className="text-sm text-ink-soft font-medium leading-snug">
                Yeni özellikler ve içerik güncellemelerinden e-posta ile haberdar olmak istiyorum.
              </span>
            </label>

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
                className="inline-flex items-center gap-2 bg-ink text-bg px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Şifre değiştir — yalnız oturum açıkken */}
      {user && (
        <section>
          <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold mb-4">
            Şifre Değiştir
          </h2>
          <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
                Mevcut Şifre
              </label>
              <div className="relative">
                <input
                  type={sifreGoster ? 'text' : 'password'}
                  value={eskiSifre}
                  onChange={(e) => setEskiSifre(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium pr-10"
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
                <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
                  Yeni Şifre
                </label>
                <input
                  type={sifreGoster ? 'text' : 'password'}
                  value={yeniSifre}
                  onChange={(e) => setYeniSifre(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium"
                  placeholder="En az 6 karakter"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-2">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type={sifreGoster ? 'text' : 'password'}
                  value={yeniSifreTekrar}
                  onChange={(e) => setYeniSifreTekrar(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium"
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
                  sifreKaydediliyor ||
                  !eskiSifre ||
                  !yeniSifre ||
                  !yeniSifreTekrar
                }
                className="inline-flex items-center gap-2 bg-ink text-bg px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        </section>
      )}

      <section>
        <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold mb-4">
          Uygulama
        </h2>
        <div className="space-y-2">
          <button
            onClick={onTemaDegistir}
            className="w-full flex items-center justify-between py-4 px-4 border border-line hover:border-ink transition active:scale-[0.998] text-left rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Icon name={ilerleme.tema === 'dark' ? 'Moon' : 'Sun'} size={16} />
              <span className="font-semibold">
                Görünüm · {ilerleme.tema === 'dark' ? 'Karanlık' : 'Açık'}
              </span>
            </div>
            <Icon name="ChevronRight" size={14} className="text-ink-quiet" />
          </button>
          <button
            onClick={karneIndir}
            disabled={karneYukleniyor}
            className="w-full flex items-center justify-between py-4 px-4 border border-line hover:border-ink transition active:scale-[0.998] text-left rounded-xl disabled:opacity-60 disabled:cursor-wait"
          >
            <div className="flex items-center gap-3">
              {karneYukleniyor ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <Icon name="FileDown" size={16} />
              )}
              <div>
                <div className="font-semibold">Karneyi PDF olarak indir</div>
                <div className="text-[11.5px] text-ink-mute font-medium mt-0.5">
                  CV-andıran akademik karne · yetkinlik · aktivite haritası · doğrulama kodu
                </div>
              </div>
            </div>
            <Icon name="ChevronRight" size={14} className="text-ink-quiet" />
          </button>
          {/* Düşük çözüm uyarısı — engelleme değil, bilgilendirme. */}
          {stat.cozulenSayi > 0 && stat.cozulenSayi < 20 && (
            <div className="px-4 py-3 mt-1 text-[12px] text-ink-soft bg-bg-tint border border-line rounded-lg leading-relaxed">
              <span className="font-bold text-ink">{stat.cozulenSayi}</span> soru çözdün.
              Karne her zaman indirilebilir, ama <span className="font-bold">20+ çözümle</span>{' '}
              daha dolu bir karne oluşur — heatmap, modül haritası ve rozetler dolmaya başlar.
            </div>
          )}
          {karneHata && (
            <div className="px-4 py-2 text-[12px] text-danger dark:text-danger font-medium">
              {karneHata}
            </div>
          )}
          <button
            onClick={onSifirla}
            className="w-full flex items-center justify-between py-4 px-4 border border-line hover:border-danger transition active:scale-[0.998] text-left group rounded-xl"
          >
            <div className="flex items-center gap-3 text-danger dark:text-danger group-hover:text-danger">
              <Icon name="Trash2" size={16} />
              <span className="font-semibold">Tüm ilerlemeyi sıfırla</span>
            </div>
            <Icon name="ChevronRight" size={14} className="text-ink-quiet" />
          </button>
        </div>
      </section>

      {/* Tehlikeli bölge — hesap silme (KVKK madde 11) */}
      {user && (
        <section className="pt-8 border-t border-danger-soft">
          <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold text-danger mb-2">
            Tehlikeli Bölge
          </h2>
          <p className="text-[13px] text-ink-soft mb-4 leading-relaxed">
            Hesabını silersen tüm ilerlemen, rozetlerin, çözümlerin geri dönülmez şekilde silinir.
            Mali kayıtlar (ödeme geçmişi) saklanır ama seninle bağlantısı kopar.
          </p>
          <button
            onClick={() => {
              setSilOnay(true);
              setSilOnayMetni('');
              setSilSifre('');
              setSilHata(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-danger-soft bg-danger-soft/40 hover:bg-danger-soft text-danger text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg active:scale-[0.98] transition"
          >
            <Icon name="Trash2" size={13} />
            Hesabımı Sil
          </button>
        </section>
      )}

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
                Bu işlem hesabını, çözümlerini, rozetlerini, profil bilgilerini kalıcı olarak siler.{' '}
                <strong>Geri dönüşü yok.</strong>
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
                  silOnayMetni.trim().toUpperCase() !== 'SİL' ||
                  !silSifre ||
                  siliniyor
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
