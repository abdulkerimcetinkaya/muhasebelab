import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth, useIsPremium } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { odemeBaslat, planlariYukle, type Plan } from '../lib/odeme';

const KURUM_EMAIL = 'kurum@muhasebelab.com';

const UCRETSIZ_OZELLIKLER = [
  'Tüm soruları sınırsız çöz',
  '213 soru · 15 ünite',
  '272 hesap planı + 20 mali terim',
  'Puan, streak ve rozet sistemi',
  'Günde 3 AI sorgu hakkı',
];

const PREMIUM_OZELLIKLER = [
  'Sınırsız AI Muhasebe Asistanı',
  'AI Yanlış Analizi (satır satır)',
  'Hesap kodu otomatik tamamlama',
  'Adım adım çözüm anlatımı',
  'Sınav modu (yakında)',
  'PDF çözüm defteri (yakında)',
  'Detaylı ilerleme raporu (yakında)',
];

const KURUM_OZELLIKLER = [
  'Premium\'un tüm özellikleri',
  'Toplu lisans %35\'e varan indirim',
  'Kurumsal e-fatura',
  'Tek noktadan öğrenci yönetimi',
  'Öğretmen paneli (yakında)',
  'Sınıf ortalaması raporu (yakında)',
];

const SSS: { soru: string; cevap: string }[] = [
  {
    soru: 'Ücretsiz hesapla nereye kadar gidebilirim?',
    cevap:
      'Tüm soruları sınırsız çözebilir, üniteleri tamamlayabilir, puan ve rozet kazanabilirsin. Premium sadece AI rehberliği ve ileri seviye araçları açar — ücretsiz tarafta hiçbir soru kilitli değil.',
  },
  {
    soru: 'Premium’u istediğim zaman iptal edebilir miyim?',
    cevap:
      'Evet. Profil > Premium ekranından iptal edebilirsin. İptal sonrası mevcut dönemin sonuna kadar Premium özellikler açık kalır, otomatik yenilenmez.',
  },
  {
    soru: 'Fatura kesiliyor mu?',
    cevap:
      'Evet, ödeme sonrası e-arşiv fatura email adresine gönderilir. Tutarlar KDV dahildir. Kurumsal müşteriler için e-fatura kesilebilir.',
  },
  {
    soru: 'İade alabilir miyim?',
    cevap:
      'İlk 7 gün koşulsuz iade hakkın var (Mesafeli Satış Sözleşmesi gereği). Bu süre içinde profil sayfasından iade talebi açabilirsin.',
  },
  {
    soru: 'Sınıfım/kurumum için toplu lisans nasıl alırım?',
    cevap: `Yukarıdan "Sınıf · Kurum" sekmesine geçip kişi sayını seç, anlık fiyat görünür. Teklif İste butonu ile ${KURUM_EMAIL} adresimize ön-doldurulmuş bir mail açılır, 1 iş günü içinde dönüş yaparız.`,
  },
  {
    soru: 'Hangi ödeme yöntemleri kabul ediliyor?',
    cevap:
      'iyzico altyapısı üzerinden tüm Türk bankalarının kredi/banka kartlarını kabul ediyoruz. Kart bilgileriniz MuhasebeLab’a iletilmez, doğrudan iyzico’da işlenir.',
  },
];

export const PremiumSayfasi = () => {
  const nav = useNavigate();
  const { user, premiumBitis, premiumYenile, yukleniyor } = useAuth();
  const isPremium = useIsPremium();
  const [yukleniyorAktivasyon, setYukleniyorAktivasyon] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [erkenKontenjanKalan, setErkenKontenjanKalan] = useState<number | null>(null);
  const [planlar, setPlanlar] = useState<Plan[]>([]);
  const [secilenPlan, setSecilenPlan] = useState<string | null>(null);
  const [acikSoru, setAcikSoru] = useState<number | null>(null);
  const [mod, setMod] = useState<'bireysel' | 'kurum'>('bireysel');
  const [donem, setDonem] = useState<'aylik' | 'yillik'>('yillik');
  const [kurumKisi, setKurumKisi] = useState<number>(30);

  useEffect(() => {
    if (!yukleniyor && !user) nav('/giris', { replace: true });
  }, [user, yukleniyor, nav]);

  useEffect(() => {
    let aktif = true;
    supabase.rpc('premium_kontenjan_kalan').then(({ data, error }) => {
      if (!aktif) return;
      if (error || data == null) return;
      setErkenKontenjanKalan(data as number);
    });
    return () => {
      aktif = false;
    };
  }, []);

  useEffect(() => {
    let aktif = true;
    planlariYukle()
      .then((p) => {
        if (aktif) setPlanlar(p);
      })
      .catch(() => {
        // Sessiz geç
      });
    return () => {
      aktif = false;
    };
  }, []);

  const planSatinAl = async (kod: string) => {
    if (!user) {
      nav('/giris');
      return;
    }
    setSecilenPlan(kod);
    setHata(null);
    try {
      const yanit = await odemeBaslat(kod);
      window.location.assign(yanit.paymentPageUrl);
    } catch (e) {
      setHata((e as Error).message);
      setSecilenPlan(null);
    }
  };

  const erkenAktivasyon = async () => {
    if (!user) return;
    setYukleniyorAktivasyon(true);
    setHata(null);
    try {
      const { error } = await supabase.rpc('premium_erken_erisim_aktive');
      if (error) {
        if (error.code === 'P0001') {
          setHata('Erken erişim kontenjanı doldu. Aşağıdaki planlardan birini seçebilirsin.');
          setErkenKontenjanKalan(0);
        } else if (error.code === 'P0002') {
          setHata('Premium üyeliğin zaten aktif.');
        } else {
          setHata(error.message);
        }
        return;
      }
      await premiumYenile();
      setErkenKontenjanKalan((p) => (p === null ? null : Math.max(0, p - 1)));
    } finally {
      setYukleniyorAktivasyon(false);
    }
  };

  // Plan resolution
  const aylikPlan = planlar.find((p) => p.donem === 'aylik');
  const yillikPlan = planlar.find((p) => p.donem === 'yillik');
  const aktifPlan = donem === 'aylik' ? aylikPlan : yillikPlan;

  const aylikFiyat = aylikPlan ? Number(aylikPlan.tutar) : 0;
  const yillikFiyat = yillikPlan ? Number(yillikPlan.tutar) : 0;
  const yillikAylikEsdeger = yillikPlan ? yillikFiyat / Math.max(1, yillikPlan.ay_sayisi) : 0;
  const yillikTasarrufYuzde =
    aylikFiyat > 0 && yillikAylikEsdeger > 0
      ? Math.round((1 - yillikAylikEsdeger / aylikFiyat) * 100)
      : 0;

  const fmt = (n: number) => n.toLocaleString('tr-TR');

  // Kurum hesaplama
  const baseAylikKurum = aylikFiyat || 99;
  const baseYillikAylikKurum = yillikAylikEsdeger || 79;
  const kurumDonemAy = donem === 'aylik' ? 1 : 12;
  const kurumBirim = donem === 'aylik' ? baseAylikKurum : baseYillikAylikKurum;
  const indirimYuzde =
    kurumKisi >= 250 ? 35 : kurumKisi >= 100 ? 25 : kurumKisi >= 30 ? 15 : 0;
  const bireyselToplam = Math.round(kurumBirim * kurumDonemAy * kurumKisi);
  const kurumFiyat = Math.round(bireyselToplam * (1 - indirimYuzde / 100));
  const tasarruf = bireyselToplam - kurumFiyat;
  const mailtoBody = `Merhaba,

Kurumum / sınıfım için MuhasebeLab toplu lisans almak istiyorum.

Kurum adı:
Kişi sayısı: ${kurumKisi}
Faturalandırma: ${donem === 'aylik' ? 'Aylık' : 'Yıllık'}
İlgili kişi telefonu:

Sayfada gösterilen tahminî tutar: ₺${fmt(kurumFiyat)} (${
    donem === 'aylik' ? 'aylık' : 'yıllık toplam'
  })

Teşekkürler.`;
  const mailtoUrl = `mailto:${KURUM_EMAIL}?subject=${encodeURIComponent(
    `Toplu Lisans Talebi — ${kurumKisi} kişi`,
  )}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <div className="text-center mb-10 md:mb-14">
        <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-4">
          Fiyatlandırma
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight font-bold mb-3 leading-[1.02]">
          Planını seç
        </h1>
        <p className="text-base md:text-lg text-stone-600 dark:text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
          Soru çözmek her zaman ücretsiz. Premium öğrenmeyi hızlandıran katmandır.
        </p>
      </div>

      {/* ─── BİREYSEL / SINIF TOGGLE ─────────────────────────────── */}
      <div className="flex justify-center mb-8 md:mb-10">
        <div className="inline-flex items-center bg-stone-100 dark:bg-zinc-900 rounded-full p-1">
          <button
            type="button"
            onClick={() => setMod('bireysel')}
            className={`px-5 md:px-6 py-2 text-[13px] font-bold tracking-tight rounded-full transition ${
              mod === 'bireysel'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 shadow-sm'
                : 'text-stone-500 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-300'
            }`}
          >
            Bireysel
          </button>
          <button
            type="button"
            onClick={() => setMod('kurum')}
            className={`px-5 md:px-6 py-2 text-[13px] font-bold tracking-tight rounded-full transition ${
              mod === 'kurum'
                ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 shadow-sm'
                : 'text-stone-500 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-300'
            }`}
          >
            Sınıf · Kurum
          </button>
        </div>
      </div>

      {/* ─── AYLIK / YILLIK TOGGLE ──────────────────────────────── */}
      <div className="flex justify-center mb-8 md:mb-12">
        <div className="inline-flex items-center bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-full p-1">
          <button
            type="button"
            onClick={() => setDonem('aylik')}
            className={`px-4 md:px-5 py-1.5 text-[12.5px] font-semibold tracking-tight rounded-full transition ${
              donem === 'aylik'
                ? 'bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900'
                : 'text-stone-600 dark:text-zinc-400'
            }`}
          >
            Aylık
          </button>
          <button
            type="button"
            onClick={() => setDonem('yillik')}
            className={`px-4 md:px-5 py-1.5 text-[12.5px] font-semibold tracking-tight rounded-full transition flex items-center gap-1.5 ${
              donem === 'yillik'
                ? 'bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900'
                : 'text-stone-600 dark:text-zinc-400'
            }`}
          >
            Yıllık
            {yillikTasarrufYuzde > 0 && (
              <span
                className={`text-[9px] tracking-[0.15em] uppercase font-bold px-1.5 py-0.5 rounded ${
                  donem === 'yillik'
                    ? 'bg-amber-400 text-stone-900'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                }`}
              >
                −%{yillikTasarrufYuzde}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── PREMIUM AKTİF ─────────────────────────────────────── */}
      {isPremium && premiumBitis && (
        <div className="mb-10 max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950/30 border border-amber-300/60 dark:border-amber-700/40 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Icon name="BadgeCheck" size={16} className="text-amber-700 dark:text-amber-300" />
            <span className="font-display text-base font-bold text-amber-900 dark:text-amber-100">
              Premium aktif
            </span>
          </div>
          <div className="text-[12.5px] text-amber-800 dark:text-amber-200/80 font-medium">
            Bitiş: {new Date(premiumBitis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      )}

      {/* ─── BİREYSEL: 3 KART ────────────────────────────────── */}
      {mod === 'bireysel' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-12">
          {/* ── Card 1: Ücretsiz ── */}
          <div className="rounded-3xl border-2 border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-7 md:p-8 flex flex-col">
            <div className="flex items-baseline gap-1.5 mb-1">
              <h3 className="font-display text-2xl font-bold tracking-tight">Ücretsiz</h3>
            </div>
            <div className="text-[12.5px] text-stone-500 dark:text-zinc-500 font-medium mb-6">
              Daima ücretsiz · sınırsız soru
            </div>
            <div className="mb-6">
              <span className="font-display text-5xl font-bold tracking-tight">₺0</span>
              <span className="text-sm text-stone-500 dark:text-zinc-500 font-medium ml-1">
                / ay
              </span>
            </div>
            <button
              type="button"
              disabled
              className="w-full py-3 mb-7 text-[12px] tracking-[0.2em] uppercase font-bold rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-500 cursor-not-allowed"
            >
              Mevcut Planın
            </button>
            <ul className="space-y-2.5 text-[13.5px] text-stone-700 dark:text-zinc-300">
              {UCRETSIZ_OZELLIKLER.map((o) => (
                <li key={o} className="flex items-start gap-2.5">
                  <Icon
                    name="Check"
                    size={14}
                    className="text-stone-400 dark:text-zinc-600 flex-shrink-0 mt-1"
                  />
                  <span className="leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Card 2: Premium (HIGHLIGHTED) ── */}
          <div className="relative rounded-3xl border-2 border-stone-900 dark:border-amber-400 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 p-7 md:p-8 flex flex-col shadow-2xl shadow-stone-900/20 dark:shadow-amber-500/20 md:-my-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: 'var(--copper, #b87333)',
                  color: '#fff',
                }}
              >
                En İyi Değer
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <h3 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
                Premium
                <Icon name="Sparkles" size={16} className="text-amber-400 dark:text-amber-600" />
              </h3>
            </div>
            <div className="text-[12.5px] opacity-70 font-medium mb-6">
              Yapay zeka rehberli öğrenme
            </div>
            <div className="mb-1">
              <span className="font-display text-5xl font-bold tracking-tight">
                ₺{donem === 'aylik' ? fmt(aylikFiyat) : fmt(Math.round(yillikAylikEsdeger))}
              </span>
              <span className="text-sm opacity-60 font-medium ml-1">/ ay</span>
            </div>
            <div className="text-[12px] opacity-60 font-mono mb-6 h-4">
              {donem === 'yillik' && yillikFiyat > 0 && `Yıllık ₺${fmt(yillikFiyat)} tek seferde`}
            </div>
            <button
              type="button"
              onClick={() => aktifPlan && planSatinAl(aktifPlan.kod)}
              disabled={!aktifPlan || secilenPlan !== null}
              className="w-full py-3 mb-7 text-[12px] tracking-[0.2em] uppercase font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {secilenPlan === aktifPlan?.kod ? (
                <>
                  <Icon name="Loader2" size={13} className="animate-spin" />
                  Yönlendiriliyor…
                </>
              ) : (
                <>
                  <Icon name="ArrowRight" size={13} />
                  Premium’u Başlat
                </>
              )}
            </button>
            <ul className="space-y-2.5 text-[13.5px]">
              <li className="flex items-start gap-2.5 opacity-90">
                <Icon
                  name="Check"
                  size={14}
                  className="text-amber-400 dark:text-amber-600 flex-shrink-0 mt-1"
                />
                <span className="leading-relaxed">
                  <strong>Ücretsizdeki her şey</strong>
                </span>
              </li>
              {PREMIUM_OZELLIKLER.map((o) => (
                <li key={o} className="flex items-start gap-2.5">
                  <Icon
                    name="Check"
                    size={14}
                    className="text-amber-400 dark:text-amber-600 flex-shrink-0 mt-1"
                  />
                  <span className="leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Card 3: Erken Erişim ── */}
          <div className="rounded-3xl border-2 border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-7 md:p-8 flex flex-col relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: 'var(--copper, #b87333)' }}
            />
            <div className="relative">
              <div className="flex items-baseline gap-1.5 mb-1">
                <h3 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
                  Erken Erişim
                  <Thiings name="rocket" size={20} />
                </h3>
              </div>
              <div className="text-[12.5px] text-stone-500 dark:text-zinc-500 font-medium mb-6">
                Beta dönemi · sınırlı kontenjan
              </div>
              <div className="mb-1">
                <span className="font-display text-5xl font-bold tracking-tight">₺0</span>
                <span className="text-sm text-stone-500 dark:text-zinc-500 font-medium ml-1">
                  / 1 yıl
                </span>
              </div>
              <div className="text-[12px] text-stone-500 dark:text-zinc-500 font-mono mb-6 h-4">
                {erkenKontenjanKalan !== null && erkenKontenjanKalan > 0
                  ? `${erkenKontenjanKalan} / 100 yer kaldı`
                  : erkenKontenjanKalan === 0
                    ? 'Kontenjan doldu'
                    : ''}
              </div>
              {!isPremium && erkenKontenjanKalan !== null && erkenKontenjanKalan > 0 ? (
                <button
                  type="button"
                  onClick={erkenAktivasyon}
                  disabled={yukleniyorAktivasyon}
                  className="w-full py-3 mb-7 text-[12px] tracking-[0.2em] uppercase font-bold rounded-xl bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Icon name="Sparkles" size={13} />
                  {yukleniyorAktivasyon ? 'Aktive ediliyor…' : '1 Yıl Ücretsiz Aç'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 mb-7 text-[12px] tracking-[0.2em] uppercase font-bold rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-500 cursor-not-allowed"
                >
                  Kontenjan Dolu
                </button>
              )}
              <ul className="space-y-2.5 text-[13.5px] text-stone-700 dark:text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <Icon name="Check" size={14} className="text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="leading-relaxed">
                    <strong>Premium’un tamamı</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="Check" size={14} className="text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="leading-relaxed">1 yıl boyunca ücretsiz</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="Check" size={14} className="text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="leading-relaxed">Kart bilgisi istemiyoruz</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="Check" size={14} className="text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="leading-relaxed">Karşılığında geri bildirim bekliyoruz</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ─── HATA (BİREYSEL) ──────────────────────────────────── */}
      {mod === 'bireysel' && hata && (
        <div className="mb-12 text-center text-sm text-red-700 dark:text-red-400 font-medium">
          {hata}
        </div>
      )}

      {/* ─── SINIF · KURUM CONFIGURATOR ───────────────────────── */}
      {mod === 'kurum' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-12">
          {/* ── Card 1: Tier breakdown ── */}
          <div className="rounded-3xl border-2 border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-7 md:p-8 flex flex-col">
            <div className="flex items-baseline gap-1.5 mb-1">
              <h3 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
                <Icon name="Users" size={18} />
                Tier
              </h3>
            </div>
            <div className="text-[12.5px] text-stone-500 dark:text-zinc-500 font-medium mb-6">
              Kişi sayısına göre indirim
            </div>
            <div className="space-y-2.5">
              {[
                { kisi: '30+', indirim: '%15' },
                { kisi: '100+', indirim: '%25' },
                { kisi: '250+', indirim: '%35' },
              ].map((t) => {
                const aktif =
                  (t.kisi === '30+' && kurumKisi >= 30 && kurumKisi < 100) ||
                  (t.kisi === '100+' && kurumKisi >= 100 && kurumKisi < 250) ||
                  (t.kisi === '250+' && kurumKisi >= 250);
                return (
                  <div
                    key={t.kisi}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      aktif
                        ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/20'
                        : 'border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/30'
                    }`}
                  >
                    <span className="font-mono text-sm font-semibold tracking-tight text-stone-700 dark:text-zinc-300">
                      {t.kisi} kişi
                    </span>
                    <span
                      className="font-display text-base font-bold"
                      style={{ color: 'var(--copper, #b87333)' }}
                    >
                      −{t.indirim}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-zinc-800">
              <ul className="space-y-2 text-[12.5px] text-stone-600 dark:text-zinc-400">
                {KURUM_OZELLIKLER.slice(0, 3).map((o) => (
                  <li key={o} className="flex items-start gap-2">
                    <Icon
                      name="Check"
                      size={12}
                      className="text-stone-400 flex-shrink-0 mt-1"
                    />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Card 2: Configurator (HIGHLIGHTED) ── */}
          <div className="md:col-span-2 rounded-3xl border-2 border-stone-900 dark:border-amber-400 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 p-7 md:p-8 flex flex-col shadow-2xl shadow-stone-900/20 dark:shadow-amber-500/20">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2 mb-1">
                  Sınıf · Kurum
                </h3>
                <div className="text-[12.5px] opacity-70 font-medium">
                  Sayıyı seç, indirim otomatik uygulansın
                </div>
              </div>
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: 'var(--copper, #b87333)', color: '#fff' }}
              >
                Otomatik
              </span>
            </div>

            {/* Quantity */}
            <div className="mt-7 mb-6">
              <div className="flex items-baseline justify-between mb-3">
                <label className="text-[10px] tracking-[0.25em] uppercase font-bold opacity-60">
                  Kişi sayısı
                </label>
                <span className="text-[11px] opacity-50 font-mono">10 – 500</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setKurumKisi(Math.max(10, kurumKisi - 5))}
                  className="w-11 h-11 rounded-xl bg-white/10 dark:bg-zinc-900/10 hover:bg-white/20 dark:hover:bg-zinc-900/20 transition flex items-center justify-center"
                >
                  <Icon name="Minus" size={14} />
                </button>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={kurumKisi}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (Number.isNaN(v)) return;
                    setKurumKisi(Math.min(500, Math.max(10, v)));
                  }}
                  className="flex-1 h-11 text-center font-display text-2xl font-bold tracking-tight bg-white/5 dark:bg-zinc-900/5 border border-white/15 dark:border-zinc-900/15 rounded-xl outline-none focus:border-amber-400 text-stone-50 dark:text-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setKurumKisi(Math.min(500, kurumKisi + 5))}
                  className="w-11 h-11 rounded-xl bg-white/10 dark:bg-zinc-900/10 hover:bg-white/20 dark:hover:bg-zinc-900/20 transition flex items-center justify-center"
                >
                  <Icon name="Plus" size={14} />
                </button>
              </div>
              <input
                type="range"
                min={10}
                max={300}
                step={5}
                value={Math.min(300, kurumKisi)}
                onChange={(e) => setKurumKisi(parseInt(e.target.value, 10))}
                className="w-full mt-4 accent-amber-400"
              />
            </div>

            {/* Calculation breakdown */}
            <div className="space-y-2 py-4 border-t border-white/10 dark:border-zinc-900/10 text-[13px]">
              <div className="flex items-baseline justify-between opacity-70">
                <span>
                  Bireysel toplam — {fmt(kurumKisi)} ×{' '}
                  ₺{fmt(Math.round(kurumBirim * kurumDonemAy))}
                </span>
                <span className="font-mono">₺{fmt(bireyselToplam)}</span>
              </div>
              {indirimYuzde > 0 ? (
                <div className="flex items-baseline justify-between text-amber-400 dark:text-amber-600 font-medium">
                  <span>Toplu indirim −%{indirimYuzde}</span>
                  <span className="font-mono">−₺{fmt(tasarruf)}</span>
                </div>
              ) : (
                <div className="text-[12px] opacity-50 italic">
                  30+ kişiden itibaren indirim devreye girer
                </div>
              )}
            </div>

            {/* Final price */}
            <div className="flex items-baseline justify-between py-4 border-t border-white/10 dark:border-zinc-900/10">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold opacity-60">
                {donem === 'aylik' ? 'Aylık tutar' : 'Yıllık toplam'}
              </span>
              <span
                className="font-display text-4xl font-bold tracking-tight"
                style={{ color: 'var(--copper, #d4a574)' }}
              >
                ₺{fmt(kurumFiyat)}
              </span>
            </div>

            <a
              href={mailtoUrl}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-900 px-5 py-3.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-xl transition"
            >
              <Icon name="Mail" size={13} />
              Teklif İste
            </a>
            <div className="mt-2.5 text-center text-[11px] opacity-50 font-mono">
              {KURUM_EMAIL} · 1 iş günü içinde dönüş
            </div>
          </div>
        </div>
      )}

      {/* ─── HASSAS NOT ───────────────────────────────────────── */}
      <div className="text-center text-[11.5px] text-stone-500 dark:text-zinc-500 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
        Tutarlar KDV dahildir · 7 gün koşulsuz iade · İstediğin zaman iptal · iyzico ile güvenli ödeme
      </div>

      {/* ─── SSS ───────────────────────────────────────────────── */}
      <section className="mb-12 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-2">
            Sıkça Sorulanlar
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight font-bold">
            Aklındaki sorulara cevap
          </h2>
        </div>

        <div className="divide-y divide-stone-200 dark:divide-zinc-800 border-y border-stone-200 dark:border-zinc-800">
          {SSS.map((s, i) => {
            const acik = acikSoru === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setAcikSoru(acik ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                >
                  <span className="font-display text-base md:text-lg font-semibold tracking-tight">
                    {s.soru}
                  </span>
                  <Icon
                    name={acik ? 'Minus' : 'Plus'}
                    size={16}
                    className="text-stone-400 dark:text-zinc-600 flex-shrink-0 group-hover:text-stone-700 dark:group-hover:text-zinc-300 transition"
                  />
                </button>
                {acik && (
                  <div className="pb-5 text-[14px] text-stone-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {s.cevap}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};
