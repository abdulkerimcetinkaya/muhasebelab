import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { odemeBaslat, planlariYukle, type Plan } from '../lib/odeme';
import { indirimDogrula } from '../lib/indirim';

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

  // İndirim kodu state
  const [indirimKodu, setIndirimKodu] = useState('');
  const [indirimYuzde, setIndirimYuzde] = useState(0);
  const [indirimMesaj, setIndirimMesaj] = useState<string | null>(null);
  const [indirimDoğrulanıyor, setIndirimDoğrulanıyor] = useState(false);
  const [indirimAcik, setIndirimAcik] = useState(false);

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
  const indirimsizToplam = birim * kisi;
  const indirimMiktar = Math.round(indirimsizToplam * (indirimYuzde / 100));
  const toplam = indirimsizToplam - indirimMiktar;

  const indirimUygula = async () => {
    if (!indirimKodu.trim() || !aktifPlan) return;
    setIndirimDoğrulanıyor(true);
    setIndirimMesaj(null);
    try {
      const sonuc = await indirimDogrula(indirimKodu, aktifPlan.kod);
      if (sonuc.gecerli) {
        setIndirimYuzde(sonuc.indirim_yuzde);
        setIndirimMesaj(`%${sonuc.indirim_yuzde} indirim uygulandı`);
      } else {
        setIndirimYuzde(0);
        setIndirimMesaj(sonuc.sebep);
      }
    } catch (e) {
      setIndirimMesaj((e as Error).message);
    } finally {
      setIndirimDoğrulanıyor(false);
    }
  };

  const indirimKaldir = () => {
    setIndirimKodu('');
    setIndirimYuzde(0);
    setIndirimMesaj(null);
  };

  const odemeyeGec = async () => {
    if (!aktifPlan || gonderiliyor) return;
    setGonderiliyor(true);
    setHata(null);
    try {
      const yanit = await odemeBaslat(
        aktifPlan.kod,
        kisi,
        indirimYuzde > 0 ? indirimKodu : undefined,
      );
      if (yanit.ucretsiz) {
        // %100 indirim — iyzico bypass, doğrudan sonuç sayfasına git
        nav('/premium/sonuc?durum=basarili&ucretsiz=1');
      } else {
        window.location.assign(yanit.paymentPageUrl);
      }
    } catch (e) {
      setHata((e as Error).message);
      setGonderiliyor(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12">
      <Link
        to="/premium"
        className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.2em] uppercase font-bold text-ink-mute hover:text-ink transition mb-6"
      >
        <Icon name="ArrowLeft" size={12} />
        Premium
      </Link>

      <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-1">
        Planını yapılandır
      </h1>
      <p className="text-ink-mute text-[13.5px] font-medium mb-10">
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
 ? 'border-ink bg-surface'
 : 'border-line bg-bg-tint/40 hover:border-line-strong '
 }`}
              >
                <div className="text-[13.5px] font-semibold tracking-tight mb-1">
                  Aylık faturalama
                </div>
                <div className="text-[12px] text-ink-mute font-mono">
                  ₺{fmt(aylikFiyat)} / kullanıcı / ay
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDonem('yillik')}
                className={`text-left p-4 rounded-2xl border-2 transition relative ${
 donem === 'yillik'
 ? 'border-ink bg-surface'
 : 'border-line bg-bg-tint/40 hover:border-line-strong '
 }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13.5px] font-semibold tracking-tight">
                    Yıllık faturalama
                  </span>
                  {tasarrufYuzde > 0 && (
                    <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-1.5 py-0.5 rounded bg-success-soft text-success dark:text-success">
                      −%{tasarrufYuzde} TASARRUF
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-ink-mute font-mono">
                  ₺{fmt(Math.round(yillikAylikEsdeger))} / kullanıcı / ay
                </div>
              </button>
            </div>

            {/* Kullanıcı sayısı */}
            <div className="rounded-2xl border-2 border-line bg-bg-tint/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-ink-mute">
                  Kullanıcılar
                </label>
                <span className="text-[11px] text-ink-quiet font-mono">
                  {MIN_KISI} – {MAX_KISI}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setKisi(Math.max(MIN_KISI, kisi - 1))}
                  className="w-10 h-10 rounded-xl bg-surface border border-line hover:bg-surface-2 transition flex items-center justify-center"
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
                  className="flex-1 h-10 text-center font-display text-2xl font-bold tracking-tight bg-surface border border-line rounded-xl outline-none focus:border-ink"
                />
                <button
                  type="button"
                  onClick={() => setKisi(Math.min(MAX_KISI, kisi + 1))}
                  className="w-10 h-10 rounded-xl bg-surface border border-line hover:bg-surface-2 transition flex items-center justify-center"
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
              <label className="block text-[10px] tracking-[0.25em] uppercase font-bold text-ink-mute mb-1.5">
                E-posta
              </label>
              <div className="px-4 py-3 rounded-xl bg-bg-tint border border-line text-[13.5px] font-mono text-ink-soft">
                {user?.email ?? '—'}
              </div>
              <div className="text-[11px] text-ink-mute mt-1.5 leading-relaxed">
                Ödeme onayı ve fatura bu adrese gönderilir. Öğrenci listesi ödeme
                sonrası ayrıca alınır.
              </div>
            </div>
          </section>
        </div>

        {/* ─── SAĞ: sticky summary (nötr stil) ──────────────── */}
        <aside className="lg:sticky lg:top-8">
          <div className="rounded-3xl border border-line bg-surface p-7 md:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight mb-1">
              Kurum planı
            </h2>
            <div className="text-[12px] text-ink-mute font-medium mb-6">
              {donem === 'aylik' ? 'Aylık faturalama' : 'Yıllık faturalama'} · {kisi} kullanıcı
            </div>

            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-ink-mute mb-3">
              Öne çıkan özellikler
            </div>
            <ul className="space-y-2.5 text-[13px] mb-6">
              {PREMIUM_OZELLIKLER.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-2.5 text-ink-soft"
                >
                  <Icon
                    name="Check"
                    size={13}
                    className="text-ink-quiet flex-shrink-0 mt-1"
                  />
                  <span className="leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-line pt-5 space-y-2 text-[13px]">
              <div className="flex items-baseline justify-between text-ink-soft">
                <span>
                  {kisi}× {donem === 'aylik' ? 'Aylık' : 'Yıllık'} abonelik
                </span>
                <span className="font-mono">₺{fmt(indirimsizToplam)}</span>
              </div>
              {indirimYuzde > 0 && (
                <div className="flex items-baseline justify-between text-success dark:text-success font-medium">
                  <span>İndirim −%{indirimYuzde}</span>
                  <span className="font-mono">−₺{fmt(indirimMiktar)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between text-ink-mute">
                <span>Tahminî vergi</span>
                <span className="font-mono italic">KDV dahil</span>
              </div>
            </div>

            {/* İndirim kodu */}
            <div className="border-t border-line mt-4 pt-4">
              {!indirimAcik && indirimYuzde === 0 ? (
                <button
                  type="button"
                  onClick={() => setIndirimAcik(true)}
                  className="text-[12px] font-semibold text-ink-soft hover:text-ink transition flex items-center gap-1.5"
                >
                  <Icon name="Tag" size={12} />
                  İndirim kodum var
                </button>
              ) : indirimYuzde > 0 ? (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-success-soft border border-success-soft">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      name="BadgeCheck"
                      size={14}
                      className="text-success dark:text-success flex-shrink-0"
                    />
                    <span className="text-[12px] font-mono font-semibold text-success dark:text-success-soft truncate">
                      {indirimKodu.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-success dark:text-success">
                      −%{indirimYuzde}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={indirimKaldir}
                    className="text-[11px] text-success dark:text-success hover:underline flex-shrink-0"
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute mb-1.5">
                    İndirim kodu
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={indirimKodu}
                      onChange={(e) => setIndirimKodu(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          indirimUygula();
                        }
                      }}
                      placeholder="Kodunu yaz"
                      className="flex-1 h-10 px-3 text-[13px] font-mono uppercase bg-bg-tint border border-line rounded-lg outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      onClick={indirimUygula}
                      disabled={indirimDoğrulanıyor || !indirimKodu.trim()}
                      className="px-4 h-10 text-[11px] tracking-[0.15em] uppercase font-bold rounded-lg bg-ink text-bg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {indirimDoğrulanıyor ? '…' : 'Uygula'}
                    </button>
                  </div>
                  {indirimMesaj && (
                    <div className="mt-2 text-[11px] text-danger dark:text-danger">
                      {indirimMesaj}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-line mt-5 pt-5 flex items-baseline justify-between mb-6">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-ink-mute">
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
              className="w-full py-3.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-xl bg-ink text-bg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon
                name={gonderiliyor ? 'Loader2' : 'CreditCard'}
                size={13}
                className={gonderiliyor ? 'animate-spin' : ''}
              />
              {gonderiliyor ? 'Yönlendiriliyor…' : 'Ödemeye Geç'}
            </button>

            {hata && (
              <div className="mt-3 p-2.5 rounded-lg bg-danger-soft dark:bg-danger/20 border border-danger-soft dark:border-danger text-[12px] text-danger dark:text-danger">
                {hata}
              </div>
            )}

            <div className="mt-4 text-[11px] text-ink-mute leading-relaxed">
              7 gün koşulsuz iade · İstediğin zaman iptal · iyzico ile güvenli
              ödeme · Kart bilgilerin MuhasebeLab’a iletilmez.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
