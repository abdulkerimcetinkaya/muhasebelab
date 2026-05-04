import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import {
  basvuruGonder,
  benimBasvurumYukle,
  DURUM_ETIKETLERI,
  UNVAN_ETIKETLERI,
  type KatkiciBasvuru,
  type YeniBasvuru,
} from '../lib/katkici';
import type { KatkiciUnvan } from '../lib/database.types';

const tarihFormat = (s: string | null): string => {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const KatkiciBasvuruSayfasi = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [yukleniyor, setYukleniyor] = useState(true);
  const [mevcut, setMevcut] = useState<KatkiciBasvuru | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [basarili, setBasarili] = useState(false);

  // Form
  const [adSoyad, setAdSoyad] = useState('');
  const [unvan, setUnvan] = useState<KatkiciUnvan>('akademisyen');
  const [kurum, setKurum] = useState('');
  const [iletisim, setIletisim] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);

  useEffect(() => {
    if (!user) {
      nav('/giris?redirect=/katkici-basvuru', { replace: true });
      return;
    }
    setYukleniyor(true);
    benimBasvurumYukle(user.id)
      .then((b) => {
        setMevcut(b);
        if (b) {
          setAdSoyad(b.ad_soyad);
          setUnvan(b.unvan);
          setKurum(b.kurum ?? '');
          setIletisim(b.iletisim_email ?? '');
          setAciklama(b.aciklama);
        }
      })
      .catch(() => setMevcut(null))
      .finally(() => setYukleniyor(false));
  }, [user, nav]);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aciklama.trim().length < 50) {
      setHata('Açıklama en az 50 karakter olmalı (uzmanlık alanın, deneyim).');
      return;
    }
    if (adSoyad.trim().length < 3) {
      setHata('Ad-soyad gerekli.');
      return;
    }
    setGonderiliyor(true);
    setHata(null);
    try {
      const yeni: YeniBasvuru = {
        ad_soyad: adSoyad.trim(),
        unvan,
        kurum: kurum.trim() || null,
        iletisim_email: iletisim.trim() || null,
        aciklama: aciklama.trim(),
      };
      await basvuruGonder(yeni);
      setBasarili(true);
      // Sayfayı yenile
      const yeniBasvuru = user ? await benimBasvurumYukle(user.id) : null;
      setMevcut(yeniBasvuru);
    } catch (e) {
      setHata(`Gönderilemedi: ${(e as Error).message}`);
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <Link
        to="/profil"
        className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 transition mb-6"
      >
        <Icon name="ArrowLeft" size={12} />
        Profil
      </Link>

      <h1 className="font-display text-4xl font-bold tracking-tight">
        Katkıcı Programı
      </h1>
      <p className="text-stone-600 dark:text-zinc-400 mt-3 leading-relaxed">
        Akademisyen, SMMM veya stajyer SMMM iseniz, MuhasebeLab'a soru ekleyerek
        binlerce öğrenciye ulaşabilirsin. Eklediğin sorular admin tarafından
        incelendikten sonra yayınlanır.{' '}
        <strong>5 onaylı sorudan sonra otomatik olarak 1 yıl ücretsiz Premium</strong>{' '}
        hediye edilir.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {[
          { ikon: 'GraduationCap', baslik: 'Akademik Katkı', metin: 'Üniversite müfredatına uygun, doğru cevaplı sorular ekle' },
          { ikon: 'BadgeCheck', baslik: 'Yazar Kredisi', metin: 'Eklediğin sorularda adın ve unvanın görünür' },
          { ikon: 'Sparkles', baslik: 'Premium Hediye', metin: '5 onaylı katkıdan sonra 1 yıl Premium ücretsiz' },
        ].map((k) => (
          <div
            key={k.baslik}
            className="bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-xl p-4"
          >
            <Icon name={k.ikon === 'GraduationCap' ? 'BadgeCheck' : k.ikon} size={20} className="text-blue-600 dark:text-blue-400" />
            <div className="font-display text-[15px] font-bold mt-2">{k.baslik}</div>
            <div className="text-[12.5px] text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
              {k.metin}
            </div>
          </div>
        ))}
      </div>

      {yukleniyor ? (
        <div className="text-sm text-stone-400 dark:text-zinc-600">Yükleniyor…</div>
      ) : mevcut ? (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-xl border ${
              mevcut.durum === 'onayli'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                : mevcut.durum === 'reddedildi'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold">
              <Icon
                name={
                  mevcut.durum === 'onayli'
                    ? 'BadgeCheck'
                    : mevcut.durum === 'reddedildi'
                      ? 'XCircle'
                      : 'Hourglass'
                }
                size={13}
              />
              Başvuru durumu: {DURUM_ETIKETLERI[mevcut.durum]}
            </div>
            <div className="mt-2 text-[13.5px]">
              <strong>{mevcut.ad_soyad}</strong> · {UNVAN_ETIKETLERI[mevcut.unvan]}
              {mevcut.kurum && ` · ${mevcut.kurum}`}
            </div>
            <div className="text-[12px] text-stone-600 dark:text-zinc-400 mt-1">
              Başvuru: {tarihFormat(mevcut.created_at)}
              {mevcut.karar_at && ` · Karar: ${tarihFormat(mevcut.karar_at)}`}
            </div>
            {mevcut.red_sebep && (
              <div className="mt-3 text-[13px] text-rose-800 dark:text-rose-300 font-medium">
                <strong>Red sebebi:</strong> {mevcut.red_sebep}
              </div>
            )}
            {mevcut.durum === 'onayli' && (
              <div className="mt-3 flex items-center gap-2">
                <Link
                  to="/katkici/soru/yeni"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg transition"
                >
                  <Icon name="PlusCircle" size={12} />
                  Soru Ekle
                </Link>
              </div>
            )}
          </div>

          {mevcut.durum === 'reddedildi' && (
            <div className="text-[13px] text-stone-600 dark:text-zinc-400">
              Red gerekçesini değerlendirip yeniden başvurabilirsin. Aşağıdaki formu
              güncelleyip tekrar gönder.
            </div>
          )}
        </div>
      ) : null}

      {(!mevcut || mevcut.durum === 'reddedildi') && !basarili && (
        <form
          onSubmit={gonder}
          className="mt-8 bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-2xl p-6 space-y-4"
        >
          <h2 className="font-display text-xl font-bold tracking-tight">
            {mevcut ? 'Yeniden Başvur' : 'Başvuru Formu'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
                Ad Soyad *
              </label>
              <input
                type="text"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                required
                maxLength={120}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
                placeholder="Doç. Dr. Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
                Unvan *
              </label>
              <select
                value={unvan}
                onChange={(e) => setUnvan(e.target.value as KatkiciUnvan)}
                required
                className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
              >
                <option value="akademisyen">Akademisyen</option>
                <option value="smmm">SMMM</option>
                <option value="smmm_stajer">SMMM Stajyeri</option>
                <option value="diger">Diğer (mesleki)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
              Kurum / Bağlı Olduğu Yer (opsiyonel)
            </label>
            <input
              type="text"
              value={kurum}
              onChange={(e) => setKurum(e.target.value)}
              maxLength={200}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
              placeholder="Boğaziçi Üniversitesi · Ankara SMMM Odası"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
              İletişim Email (opsiyonel)
            </label>
            <input
              type="email"
              value={iletisim}
              onChange={(e) => setIletisim(e.target.value)}
              maxLength={200}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-mono outline-none focus:border-stone-900 dark:focus:border-zinc-400"
              placeholder="profesyonel@kurum.edu.tr"
            />
            <div className="text-[11px] text-stone-500 dark:text-zinc-500 mt-1">
              Akademik veya mesleki email tercih edilir (doğrulama için).
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
              Açıklama (uzmanlık + deneyim) *
            </label>
            <textarea
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              required
              rows={6}
              minLength={50}
              maxLength={2000}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400 resize-none leading-relaxed"
              placeholder="Hangi konularda soru hazırlamak istiyorsun? Akademik / mesleki deneyimini kısaca anlat. (Doğrulama amaçlı)"
            />
            <div className="text-[11px] text-stone-400 dark:text-zinc-600 mt-1 text-right font-mono">
              {aciklama.length} / 2000 (en az 50)
            </div>
          </div>

          {hata && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-[13px] text-rose-800 dark:text-rose-300 font-medium">
              <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
              <span>{hata}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={gonderiliyor}
            className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-5 py-3 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
          >
            <Icon
              name={gonderiliyor ? 'Loader2' : 'Send'}
              size={12}
              className={gonderiliyor ? 'animate-spin' : ''}
            />
            {gonderiliyor ? 'Gönderiliyor' : 'Başvuruyu Gönder'}
          </button>
        </form>
      )}

      {basarili && (
        <div className="mt-6 p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-emerald-800 dark:text-emerald-300">
          <Icon name="CheckCircle2" size={18} className="inline mr-2" />
          <strong>Başvurun alındı.</strong> Admin inceleyip karar verince haberdar olacaksın.
        </div>
      )}
    </div>
  );
};
