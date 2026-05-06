import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { odemeBaslat, planlariYukle, type Plan } from '../lib/odeme';

const MIN_KISI = 2;
const MAX_KISI = 500;

const PREMIUM_OZELLIKLER = [
  'Sınırsız AI Muhasebe Asistanı',
  'AI Yanlış Analizi',
  'Hesap kodu otomatik tamamlama',
  'Adım adım çözüm anlatımı',
];

export const KurumOdemeSayfasi = () => {
  const nav = useNavigate();
  const { user, yukleniyor: authYukleniyor } = useAuth();
  const [params] = useSearchParams();

  const [planlar, setPlanlar] = useState<Plan[]>([]);
  const [donem, setDonem] = useState<'aylik' | 'yillik'>(
    (params.get('donem') as 'aylik' | 'yillik') ?? 'yillik',
  );
  const [kisi, setKisi] = useState<number>(
    Math.max(MIN_KISI, parseInt(params.get('kisi') ?? '5', 10) || 5),
  );
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  useEffect(() => {
    if (!authYukleniyor && !user) {
      nav('/giris?redirect=/premium/kurum-odeme', { replace: true });
    }
  }, [user, authYukleniyor, nav]);

  useEffect(() => {
    let aktif = true;
    planlariYukle()
      .then((p) => aktif && setPlanlar(p))
      .catch(() => {
        // sessiz geç
      });
    return () => {
      aktif = false;
    };
  }, []);

  const aylikPlan = planlar.find((p) => p.donem === 'aylik');
  const yillikPlan = planlar.find((p) => p.donem === 'yillik');
  const aktifPlan = donem === 'aylik' ? aylikPlan : yillikPlan;

  const aylikFiyat = aylikPlan ? Number(aylikPlan.tutar) : 0;
  const yillikFiyat = yillikPlan ? Number(yillikPlan.tutar) : 0;
  const yillikAylikEsdeger = yillikPlan ? yillikFiyat / Math.max(1, yillikPlan.ay_sayisi) : 0;
  const tasarrufYuzde =
    aylikFiyat > 0 && yillikAylikEsdeger > 0
      ? Math.round((1 - yillikAylikEsdeger / aylikFiyat) * 100)
      : 0;

  const fmt = (n: number) => n.toLocaleString('tr-TR');
  const birim = donem === 'aylik' ? aylikFiyat : yillikFiyat;
  const toplam = birim * kisi;

  const odemeyeGec = async () => {
    if (!aktifPlan || gonderiliyor) return;
    setGonderiliyor(true);
    setHata(null);
    try {
      const yanit = await odemeBaslat(aktifPlan.kod, kisi);
      window.location.assign(yanit.paymentPageUrl);
    } catch (e) {
      setHata((e as Error).message);
      setGonderiliyor(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12">
      <Link
        to="/premium"
        className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 transition mb-6"
      >
        <Icon name="ArrowLeft" size={12} />
        Premium
      </Link>

      <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-1">
        Planını yapılandır
      </h1>
      <p className="text-stone-500 dark:text-zinc-500 text-[13.5px] font-medium mb-10">
        Sınıf · Kurum için toplu ödeme
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 lg:gap-10 items-start">
        {/* ─── SOL: form ──────────────────────────────────────── */}
        <div className="space-y-9">
          {/* Plan ayrıntıları */}
          <section>
            <h2 className="font-display text-lg font-bold tracking-tight mb-4">
              Plan ayrıntıları
            </h2>

            {/* Faturalama: 2 selectable kart */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setDonem('aylik')}
                className={`text-left p-4 rounded-2xl border-2 transition ${
                  donem === 'aylik'
                    ? 'border-stone-900 dark:border-zinc-100 bg-white dark:bg-zinc-900/40'
                    : 'border-stone-200 dark:border-zinc-800 bg-stone-50/40 dark:bg-zinc-900/20 hover:border-stone-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="text-[13.5px] font-semibold tracking-tight mb-1">
                  Aylık faturalama
                </div>
                <div className="text-[12px] text-stone-500 dark:text-zinc-500 font-mono">
                  ₺{fmt(aylikFiyat)} / kullanıcı / ay
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDonem('yillik')}
                className={`text-left p-4 rounded-2xl border-2 transition relative ${
                  donem === 'yillik'
                    ? 'border-stone-900 dark:border-zinc-100 bg-white dark:bg-zinc-900/40'
                    : 'border-stone-200 dark:border-zinc-800 bg-stone-50/40 dark:bg-zinc-900/20 hover:border-stone-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13.5px] font-semibold tracking-tight">
                    Yıllık faturalama
                  </span>
                  {tasarrufYuzde > 0 && (
                    <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                      −%{tasarrufYuzde} TASARRUF
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-stone-500 dark:text-zinc-500 font-mono">
                  ₺{fmt(Math.round(yillikAylikEsdeger))} / kullanıcı / ay
                </div>
              </button>
            </div>

            {/* Kullanıcı sayısı */}
            <div className="rounded-2xl border-2 border-stone-200 dark:border-zinc-800 bg-stone-50/40 dark:bg-zinc-900/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                  Kullanıcılar
                </label>
                <span className="text-[11px] text-stone-400 dark:text-zinc-600 font-mono">
                  {MIN_KISI} – {MAX_KISI}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setKisi(Math.max(MIN_KISI, kisi - 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-700 transition flex items-center justify-center"
                  aria-label="Azalt"
                >
                  <Icon name="Minus" size={14} />
                </button>
                <input
                  type="number"
                  min={MIN_KISI}
                  max={MAX_KISI}
                  value={kisi}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (Number.isNaN(v)) return;
                    setKisi(Math.min(MAX_KISI, Math.max(MIN_KISI, v)));
                  }}
                  className="flex-1 h-10 text-center font-display text-2xl font-bold tracking-tight bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl outline-none focus:border-stone-900 dark:focus:border-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => setKisi(Math.min(MAX_KISI, kisi + 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-700 transition flex items-center justify-center"
                  aria-label="Arttır"
                >
                  <Icon name="Plus" size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* İletişim bilgileri */}
          <section>
            <h2 className="font-display text-lg font-bold tracking-tight mb-4">
              İletişim bilgileri
            </h2>

            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
                E-posta
              </label>
              <div className="px-4 py-3 rounded-xl bg-stone-50 dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-800 text-[13.5px] font-mono text-stone-700 dark:text-zinc-300">
                {user?.email ?? '—'}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-zinc-500 mt-1.5 leading-relaxed">
                Ödeme onayı ve fatura bu adrese gönderilir. Öğrenci listesi ödeme
                sonrası ayrıca alınır.
              </div>
            </div>
          </section>
        </div>

        {/* ─── SAĞ: sticky summary (nötr stil) ──────────────── */}
        <aside className="lg:sticky lg:top-8">
          <div className="rounded-3xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-7 md:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight mb-1">
              Kurum planı
            </h2>
            <div className="text-[12px] text-stone-500 dark:text-zinc-500 font-medium mb-6">
              {donem === 'aylik' ? 'Aylık faturalama' : 'Yıllık faturalama'} · {kisi} kullanıcı
            </div>

            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-3">
              Öne çıkan özellikler
            </div>
            <ul className="space-y-2.5 text-[13px] mb-6">
              {PREMIUM_OZELLIKLER.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-2.5 text-stone-700 dark:text-zinc-300"
                >
                  <Icon
                    name="Check"
                    size={13}
                    className="text-stone-400 dark:text-zinc-600 flex-shrink-0 mt-1"
                  />
                  <span className="leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-stone-200 dark:border-zinc-800 pt-5 space-y-2 text-[13px]">
              <div className="flex items-baseline justify-between text-stone-700 dark:text-zinc-300">
                <span>
                  {kisi}× {donem === 'aylik' ? 'Aylık' : 'Yıllık'} abonelik
                </span>
                <span className="font-mono">₺{fmt(toplam)}</span>
              </div>
              <div className="flex items-baseline justify-between text-stone-500 dark:text-zinc-500">
                <span>Tahminî vergi</span>
                <span className="font-mono italic">KDV dahil</span>
              </div>
            </div>

            <div className="border-t border-stone-200 dark:border-zinc-800 mt-5 pt-5 flex items-baseline justify-between mb-6">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                Bugün ödenmesi gereken
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">
                ₺{fmt(toplam)}
              </span>
            </div>

            <button
              type="button"
              onClick={odemeyeGec}
              disabled={gonderiliyor || !aktifPlan}
              className="w-full py-3.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-xl bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon
                name={gonderiliyor ? 'Loader2' : 'CreditCard'}
                size={13}
                className={gonderiliyor ? 'animate-spin' : ''}
              />
              {gonderiliyor ? 'Yönlendiriliyor…' : 'Ödemeye Geç'}
            </button>

            {hata && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-[12px] text-red-700 dark:text-red-300">
                {hata}
              </div>
            )}

            <div className="mt-4 text-[11px] text-stone-500 dark:text-zinc-500 leading-relaxed">
              7 gün koşulsuz iade · İstediğin zaman iptal · iyzico ile güvenli
              ödeme · Kart bilgilerin MuhasebeLab’a iletilmez.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
