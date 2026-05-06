import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { planlariYukle, type Plan } from '../lib/odeme';

const KURUM_EMAIL = 'kurum@muhasebelab.com';
const MIN_KISI = 2;
const MAX_KISI = 500;

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

  // Form alanları
  const [kurumAdi, setKurumAdi] = useState('');
  const [yetkili, setYetkili] = useState('');
  const [telefon, setTelefon] = useState('');
  const [vkn, setVkn] = useState('');
  const [adres, setAdres] = useState('');
  const [notlar, setNotlar] = useState('');
  const [fatura, setFatura] = useState<'sirket' | 'sahis'>('sirket');
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
  const aylikFiyat = aylikPlan ? Number(aylikPlan.tutar) : 99;
  const yillikFiyat = yillikPlan ? Number(yillikPlan.tutar) : 950;
  const yillikAylikEsdeger = yillikPlan ? yillikFiyat / Math.max(1, yillikPlan.ay_sayisi) : 79;
  const tasarrufYuzde =
    aylikFiyat > 0 && yillikAylikEsdeger > 0
      ? Math.round((1 - yillikAylikEsdeger / aylikFiyat) * 100)
      : 0;

  const fmt = (n: number) => n.toLocaleString('tr-TR');

  // Hesaplamalar
  const birimAylik = donem === 'aylik' ? aylikFiyat : Math.round(yillikAylikEsdeger);
  const birimToplam = donem === 'aylik' ? aylikFiyat : yillikFiyat;
  const toplam = birimToplam * kisi;
  const aylikFatura = donem === 'aylik' ? toplam : 0;
  const yillikFatura = donem === 'yillik' ? toplam : 0;

  const formGecerli = useMemo(() => {
    return (
      kurumAdi.trim().length >= 2 &&
      yetkili.trim().length >= 2 &&
      telefon.trim().length >= 7 &&
      kisi >= MIN_KISI &&
      kisi <= MAX_KISI
    );
  }, [kurumAdi, yetkili, telefon, kisi]);

  const gonder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formGecerli || gonderiliyor) return;
    setGonderiliyor(true);

    const govde = `Merhaba,

MuhasebeLab Premium kurum talebi:

— PLAN —
Faturalandırma: ${donem === 'aylik' ? 'Aylık' : 'Yıllık'}
Kişi sayısı: ${kisi}
Kişi başı (${donem === 'aylik' ? 'aylık' : 'yıllık'}): ₺${fmt(birimToplam)}
Toplam tutar: ₺${fmt(toplam)} (KDV dahil)

— KURUM —
Kurum adı: ${kurumAdi}
Fatura türü: ${fatura === 'sirket' ? 'Şirket (e-fatura)' : 'Şahıs (e-arşiv)'}
${fatura === 'sirket' ? 'VKN' : 'TCKN'}: ${vkn || '—'}
Fatura adresi: ${adres || '—'}

— İLETİŞİM —
Yetkili kişi: ${yetkili}
Telefon: ${telefon}
E-posta: ${user?.email ?? '—'}

— NOTLAR —
${notlar || '—'}
`;

    const url = `mailto:${KURUM_EMAIL}?subject=${encodeURIComponent(
      `Kurum Premium Talebi — ${kurumAdi || kisi + ' kişi'}`,
    )}&body=${encodeURIComponent(govde)}`;
    window.location.href = url;

    // Mailto açıldıktan sonra kullanıcıyı geri bırakma — istersen başka sayfaya
    setTimeout(() => setGonderiliyor(false), 800);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12">
      {/* Geri bağlantısı */}
      <Link
        to="/premium"
        className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 transition mb-6"
      >
        <Icon name="ArrowLeft" size={12} />
        Premium
      </Link>

      <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-10">
        Planını yapılandır
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-8 lg:gap-10 items-start">
        {/* ─── SOL: form ──────────────────────────────────────── */}
        <form onSubmit={gonder} className="space-y-10">
          {/* Plan ayrıntıları */}
          <section>
            <h2 className="font-display text-xl font-bold tracking-tight mb-4">
              Plan ayrıntıları
            </h2>

            {/* Faturalama seçimi (kart-stili toggle) */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setDonem('aylik')}
                className={`text-left p-4 rounded-2xl border-2 transition ${
                  donem === 'aylik'
                    ? 'border-stone-900 dark:border-amber-400 bg-white dark:bg-zinc-900/40 shadow-sm'
                    : 'border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/20 hover:border-stone-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="text-[13.5px] font-semibold tracking-tight mb-1">
                  Aylık faturalama
                </div>
                <div className="text-[12px] text-stone-500 dark:text-zinc-500 font-mono">
                  ₺{fmt(aylikFiyat)} / kişi / ay
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDonem('yillik')}
                className={`text-left p-4 rounded-2xl border-2 transition relative ${
                  donem === 'yillik'
                    ? 'border-stone-900 dark:border-amber-400 bg-white dark:bg-zinc-900/40 shadow-sm'
                    : 'border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/20 hover:border-stone-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13.5px] font-semibold tracking-tight">
                    Yıllık faturalama
                  </span>
                  {tasarrufYuzde > 0 && (
                    <span
                      className="text-[9px] tracking-[0.15em] uppercase font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'var(--copper, #b87333)', color: '#fff' }}
                    >
                      −%{tasarrufYuzde}
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-stone-500 dark:text-zinc-500 font-mono">
                  ₺{fmt(Math.round(yillikAylikEsdeger))} / kişi / ay
                </div>
              </button>
            </div>

            {/* Kullanıcı sayısı */}
            <div className="rounded-2xl border-2 border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                  Kullanıcı sayısı
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
                  className="flex-1 h-10 text-center font-display text-2xl font-bold tracking-tight bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl outline-none focus:border-stone-900 dark:focus:border-amber-400"
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

          {/* Kurum bilgileri */}
          <section>
            <h2 className="font-display text-xl font-bold tracking-tight mb-4">
              Kurum bilgileri
            </h2>

            {/* Fatura türü */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setFatura('sirket')}
                className={`p-3 text-[12.5px] font-semibold tracking-tight rounded-xl border-2 transition ${
                  fatura === 'sirket'
                    ? 'border-stone-900 dark:border-amber-400 bg-white dark:bg-zinc-900/40'
                    : 'border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/20'
                }`}
              >
                Şirket · e-fatura
              </button>
              <button
                type="button"
                onClick={() => setFatura('sahis')}
                className={`p-3 text-[12.5px] font-semibold tracking-tight rounded-xl border-2 transition ${
                  fatura === 'sahis'
                    ? 'border-stone-900 dark:border-amber-400 bg-white dark:bg-zinc-900/40'
                    : 'border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/20'
                }`}
              >
                Şahıs · e-arşiv
              </button>
            </div>

            <div className="space-y-3">
              <Field
                label={fatura === 'sirket' ? 'Şirket adı' : 'Ad Soyad'}
                value={kurumAdi}
                onChange={setKurumAdi}
                placeholder={fatura === 'sirket' ? 'Örn. Yıldız Eğitim A.Ş.' : 'Ad soyad'}
                required
              />
              <Field
                label={fatura === 'sirket' ? 'Vergi numarası (VKN)' : 'TC kimlik (TCKN)'}
                value={vkn}
                onChange={setVkn}
                placeholder={fatura === 'sirket' ? '10 haneli' : '11 haneli'}
                inputMode="numeric"
              />
              <Field
                label="Fatura adresi"
                value={adres}
                onChange={setAdres}
                placeholder="Mahalle, sokak, ilçe, il"
                multiline
              />
            </div>
          </section>

          {/* İletişim */}
          <section>
            <h2 className="font-display text-xl font-bold tracking-tight mb-4">
              İletişim bilgileri
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
                  E-posta
                </label>
                <div className="px-4 py-3 rounded-xl bg-stone-50 dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-800 text-[13.5px] font-mono text-stone-700 dark:text-zinc-300">
                  {user?.email ?? '—'}
                </div>
              </div>
              <Field
                label="Yetkili kişi"
                value={yetkili}
                onChange={setYetkili}
                placeholder="Ad soyad"
                required
              />
              <Field
                label="Telefon"
                value={telefon}
                onChange={setTelefon}
                placeholder="0532 123 45 67"
                inputMode="tel"
                required
              />
            </div>
          </section>

          {/* Notlar */}
          <section>
            <h2 className="font-display text-xl font-bold tracking-tight mb-4">
              Notlar <span className="text-[12px] text-stone-400 dark:text-zinc-600 font-medium">(opsiyonel)</span>
            </h2>
            <Field
              label="Eklemek istediklerin"
              value={notlar}
              onChange={setNotlar}
              placeholder="Özel ihtiyaçlar, başlatma tarihi, ödeme yöntemi tercihi…"
              multiline
              hideLabel
            />
          </section>
        </form>

        {/* ─── SAĞ: sticky summary ──────────────────────────── */}
        <aside className="lg:sticky lg:top-8">
          <div className="rounded-3xl border-2 border-stone-900 dark:border-amber-400 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 p-7 md:p-8 shadow-2xl shadow-stone-900/20 dark:shadow-amber-500/20">
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Kurum planı
              </h2>
              <Icon name="Sparkles" size={16} className="text-amber-400 dark:text-amber-600" />
            </div>
            <div className="text-[12px] opacity-60 font-medium mb-5">
              {donem === 'aylik' ? 'Aylık faturalama' : 'Yıllık faturalama'} ·{' '}
              {kisi} kullanıcı
            </div>

            {/* Öne çıkan özellikler */}
            <div className="text-[10px] tracking-[0.25em] uppercase font-bold opacity-60 mb-3">
              Öne çıkan özellikler
            </div>
            <ul className="space-y-2.5 text-[13px] mb-6">
              {[
                'Premium’un tüm AI özellikleri',
                'Kurumsal e-fatura',
                'Tek noktadan ödeme',
                'Öğretmen paneli (yakında)',
              ].map((o) => (
                <li key={o} className="flex items-start gap-2.5">
                  <Icon
                    name="Check"
                    size={13}
                    className="text-amber-400 dark:text-amber-600 flex-shrink-0 mt-1"
                  />
                  <span className="leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/15 dark:border-zinc-900/15 pt-5 space-y-2 text-[13px]">
              <Row
                label={`${kisi}× ${donem === 'aylik' ? 'Aylık' : 'Yıllık'} abonelik`}
                value={`₺${fmt(toplam)}`}
              />
              <Row label="Tahminî vergi" value="KDV dahil" mono />
              {aylikFatura > 0 && (
                <Row
                  label="Aylık tahsilat"
                  value={`₺${fmt(aylikFatura)}`}
                  small
                />
              )}
              {yillikFatura > 0 && (
                <Row
                  label="Yıllık tek seferde"
                  value={`₺${fmt(yillikFatura)}`}
                  small
                />
              )}
            </div>

            <div className="border-t border-white/15 dark:border-zinc-900/15 mt-5 pt-5 flex items-baseline justify-between mb-6">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold opacity-60">
                Bugün ödenmesi gereken
              </span>
              <span
                className="font-display text-3xl font-bold tracking-tight"
                style={{ color: 'var(--copper, #d4a574)' }}
              >
                ₺{fmt(toplam)}
              </span>
            </div>

            <button
              type="button"
              onClick={gonder}
              disabled={!formGecerli || gonderiliyor}
              className="w-full py-3.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon name={gonderiliyor ? 'Loader2' : 'Mail'} size={13} className={gonderiliyor ? 'animate-spin' : ''} />
              {gonderiliyor ? 'Gönderiliyor…' : 'Talebi Gönder'}
            </button>

            {!formGecerli && (
              <div className="mt-3 text-[11px] opacity-60 text-center">
                Kurum adı, yetkili ve telefon zorunlu.
              </div>
            )}

            <div className="mt-4 text-[11px] opacity-50 leading-relaxed">
              Kurum talepleri şu an manuel inceleniyor. Talebini aldıktan sonra
              1 iş günü içinde fatura ve ödeme bilgileri için döneriz. Talebin
              <strong> {KURUM_EMAIL}</strong> adresine ulaşır.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

// ─── Yardımcı bileşenler ────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  required?: boolean;
  multiline?: boolean;
  hideLabel?: boolean;
}

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  required,
  multiline,
  hideLabel,
}: FieldProps) => {
  return (
    <div>
      {!hideLabel && (
        <label className="block text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
          {label} {required && <span className="text-stone-400">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-[13.5px] outline-none focus:border-stone-900 dark:focus:border-amber-400 transition resize-none"
        />
      ) : (
        <input
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-[13.5px] outline-none focus:border-stone-900 dark:focus:border-amber-400 transition"
        />
      )}
    </div>
  );
};

const Row = ({
  label,
  value,
  mono,
  small,
}: {
  label: string;
  value: string;
  mono?: boolean;
  small?: boolean;
}) => (
  <div
    className={`flex items-baseline justify-between ${
      small ? 'text-[12px] opacity-60' : ''
    }`}
  >
    <span>{label}</span>
    <span className={mono ? 'font-mono opacity-70' : 'font-mono font-semibold'}>
      {value}
    </span>
  </div>
);
