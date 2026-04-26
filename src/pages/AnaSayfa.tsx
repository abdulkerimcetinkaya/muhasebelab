import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  animate,
  type MotionValue,
} from 'framer-motion';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth } from '../contexts/AuthContext';
import { useUniteler } from '../contexts/UnitelerContext';
import { gununSorusu } from '../lib/gunun-sorusu';
import { devamEtSorusu, enCokYanlisSoru } from '../lib/oneriler';
import { bugununTarihi } from '../lib/format';
import { planlariYukle, type Plan } from '../lib/odeme';
import { ZORLUK_AD, ZORLUK_PUAN } from '../data/sabitler';
import type { Ilerleme, Istatistik, SoruWithUnite, Zorluk, Unite } from '../types';

/* ----------------------------------------------------------------------
   Yardımcılar
---------------------------------------------------------------------- */

const ZORLUK_RENK: Record<Zorluk, string> = {
  kolay: 'chip-success',
  orta: 'chip-premium',
  zor: 'chip-danger',
};

const ZorlukChip = ({ zorluk }: { zorluk: Zorluk }) => (
  <span className={`chip ${ZORLUK_RENK[zorluk]}`}>
    {ZORLUK_AD[zorluk]} · {ZORLUK_PUAN[zorluk]}p
  </span>
);

/* ----------------------------------------------------------------------
   Ana giriş
---------------------------------------------------------------------- */

interface Props {
  ilerleme: Ilerleme;
  stat: Istatistik;
}

export const AnaSayfa = ({ ilerleme, stat }: Props) => {
  const { user, yukleniyor } = useAuth();

  if (yukleniyor) {
    return (
      <main className="max-w-[1240px] mx-auto px-5 py-32 flex items-center justify-center">
        <Icon name="Loader2" size={20} className="animate-spin text-ink-mute" />
      </main>
    );
  }

  if (user) return <KullaniciPaneli ilerleme={ilerleme} stat={stat} />;
  return <AnonimAnaSayfa />;
};

/* ----------------------------------------------------------------------
   Kullanıcı paneli
---------------------------------------------------------------------- */

const KullaniciPaneli = ({ ilerleme, stat }: Props) => {
  const nav = useNavigate();
  const { uniteler, tumSorular } = useUniteler();
  const gununSoru = useMemo(() => gununSorusu(tumSorular), [tumSorular]);
  const bugun = bugununTarihi();
  const gununCozulduMu = gununSoru ? ilerleme.cozulenler[gununSoru.id]?.tarih === bugun : false;
  const devamSoru = useMemo(() => devamEtSorusu(ilerleme, tumSorular), [ilerleme, tumSorular]);
  const yanlisSoru = useMemo(() => enCokYanlisSoru(ilerleme, tumSorular), [ilerleme, tumSorular]);

  const ad = ilerleme.kullaniciAdi || 'Öğrenci';

  const aktifUnite = useMemo(() => {
    if (!devamSoru) return null;
    const u = uniteler.find((x) => x.id === devamSoru.uniteId);
    if (!u) return null;
    const cozulen = u.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
    return { unite: u, cozulen, toplam: u.sorular.length };
  }, [devamSoru, ilerleme.cozulenler, uniteler]);

  const bugunCozulen = useMemo(
    () => ilerleme.aktiviteTarihleri[bugun] || 0,
    [ilerleme.aktiviteTarihleri, bugun],
  );
  const gunlukHedef = 5;
  const hedefYuzde = Math.min(100, (bugunCozulen / gunlukHedef) * 100);
  const hedefTamam = bugunCozulen >= gunlukHedef;

  const yanlisListe = useMemo(
    () =>
      Object.entries(ilerleme.yanlislar)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([id, sayi]) => {
          const s = tumSorular.find((x) => x.id === id);
          return s ? { soru: s, sayi } : null;
        })
        .filter((x): x is { soru: SoruWithUnite; sayi: number } => x !== null),
    [ilerleme.yanlislar, tumSorular],
  );

  const henuzCozulmemis = stat.cozulenSayi === 0;
  const cozulenYuzde = stat.toplamSoru > 0 ? Math.round((stat.cozulenSayi / stat.toplamSoru) * 100) : 0;

  return (
    <main className="max-w-[1240px] mx-auto px-5 sm:px-8 py-10">
      {/* Üst bar — selamlama + tarih */}
      <section className="mb-8 rise flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-[28px] sm:text-[34px] font-bold tracking-tight text-ink leading-tight">
            Merhaba, {ad}
          </h1>
          <p className="text-[14.5px] text-ink-soft mt-1">
            {henuzCozulmemis
              ? 'Hadi ilk soruyu çözelim. Otuz saniye yetiyor.'
              : `${stat.cozulenSayi}/${stat.toplamSoru} soru çözdün — bugün ${bugunCozulen}/${gunlukHedef}.`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
          {ilerleme.streak > 0 && (
            <span className="chip chip-mint">
              <Icon name="Flame" size={11} />
              {ilerleme.streak} günlük seri
            </span>
          )}
        </div>
      </section>

      {/* Üst grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 rise-2">
        <div className="md:col-span-8">
          {aktifUnite && devamSoru ? (
            <button
              onClick={() => nav(`/problemler/${devamSoru.id}`)}
              className="w-full text-left surface-lift group p-7 sm:p-8 h-full flex flex-col min-h-[280px]"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="chip chip-primary">
                  {henuzCozulmemis ? 'Başlat' : 'Devam et'}
                </span>
                <span className="chip">{aktifUnite.unite.ad}</span>
                <ZorlukChip zorluk={devamSoru.zorluk} />
              </div>
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-[26px] sm:text-[34px] font-bold leading-[1.05] tracking-tight text-ink mb-3">
                    {devamSoru.baslik}
                  </h2>
                  <p className="text-[15px] text-ink-soft leading-relaxed line-clamp-3 max-w-2xl">
                    {devamSoru.senaryo}
                  </p>
                </div>
                <Thiings name={aktifUnite.unite.thiingsIcon} size={56} />
              </div>
              <div className="hairline mb-4 mt-auto" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[13px] text-ink-soft">
                  <div className="flex items-center gap-2">
                    <span className="font-mono tnum text-ink font-semibold">
                      {aktifUnite.cozulen}/{aktifUnite.toplam}
                    </span>
                    <span className="text-ink-mute">çözüldü</span>
                  </div>
                  <span className="text-ink-quiet">·</span>
                  <div className="w-32 h-1 bg-line rounded-full relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-ink rounded-full"
                      style={{ width: `${(aktifUnite.cozulen / aktifUnite.toplam) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-[13px] text-ink font-medium group-hover:text-accent-deep flex items-center gap-1.5 transition">
                  Çözmeye başla
                  <Icon name="ArrowRight" size={13} />
                </span>
              </div>
            </button>
          ) : (
            <div className="surface p-12 text-center h-full flex flex-col items-center justify-center min-h-[280px]">
              <Thiings name="trophy" size={56} />
              <h2 className="font-display text-[24px] font-bold tracking-tight mt-5 mb-2 text-ink">
                Tüm soruları çözdün.
              </h2>
              <p className="text-[14.5px] text-ink-soft mb-6 max-w-md">
                Yeni soruları beklerken yanlışlarını tekrar edebilirsin.
              </p>
              <button onClick={() => nav('/problemler')} className="btn btn-primary">
                Tüm Sorular
              </button>
            </div>
          )}
        </div>

        {/* Hedef kart */}
        <div className="md:col-span-4">
          <div className="surface-lift p-6 h-full flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
              <span className="eyebrow">Bugünkü hedef</span>
              {hedefTamam && <span className="chip chip-success">Tamam</span>}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display font-bold text-[64px] tnum tracking-tighter text-ink leading-none">
                {bugunCozulen}
              </span>
              <span className="font-mono tnum text-[20px] text-ink-quiet font-medium">/{gunlukHedef}</span>
            </div>
            <p className="text-[13.5px] text-ink-soft mb-5">
              {hedefTamam
                ? 'Hedefi geçtin. Bonus puanlar bekliyor.'
                : `${gunlukHedef - bugunCozulen} soru kaldı.`}
            </p>
            <div className="h-1.5 bg-line rounded-full relative mb-5 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                style={{
                  width: `${hedefYuzde}%`,
                  background: hedefTamam ? 'var(--success)' : 'var(--ink)',
                }}
              />
            </div>
            <div className="hairline mb-4" />
            <dl className="space-y-2.5 text-[13px]">
              <div className="flex items-baseline justify-between">
                <dt className="text-ink-mute">Seri</dt>
                <dd className="font-mono tnum font-semibold text-ink">{ilerleme.streak} gün</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-ink-mute">Toplam puan</dt>
                <dd className="font-mono tnum font-semibold text-ink">{ilerleme.puan}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-ink-mute">Çözülen</dt>
                <dd className="font-mono tnum font-semibold text-ink">
                  {stat.cozulenSayi}/{stat.toplamSoru}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Yan görevler */}
      {(gununSoru || yanlisSoru) && (
        <>
          <div className="flex items-baseline justify-between mb-4 mt-10 rise-3">
            <h2 className="font-display text-[20px] font-bold tracking-tight text-ink">
              Önerilen sorular
            </h2>
            <button onClick={() => nav('/problemler')} className="btn-link">
              Tüm sorular →
            </button>
          </div>
          <div className={`grid grid-cols-1 ${gununSoru && yanlisSoru ? 'md:grid-cols-2' : ''} gap-4 mb-10`}>
            {gununSoru && (
              <button
                onClick={() => nav(`/problemler/${gununSoru.id}`)}
                className="surface-lift p-6 text-left group"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip chip-premium">
                      <Icon name="Calendar" size={10} />
                      Günün Sorusu
                    </span>
                    {gununCozulduMu && <span className="chip chip-success">Çözüldü</span>}
                  </div>
                  <Thiings name={gununSoru.uniteIcon} size={36} />
                </div>
                <h3 className="font-display text-[20px] font-bold leading-tight tracking-tight text-ink mb-2 group-hover:text-accent-deep transition">
                  {gununSoru.baslik}
                </h3>
                <p className="text-[13.5px] text-ink-soft line-clamp-2 mb-4 leading-relaxed">
                  {gununSoru.senaryo}
                </p>
                <div className="hairline mb-3" />
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-mute">{gununSoru.uniteAd}</span>
                  <span className="text-ink font-medium flex items-center gap-1 group-hover:text-accent-deep transition">
                    {gununCozulduMu ? 'Tekrar' : 'Çöz'}
                    <Icon name="ArrowRight" size={12} />
                  </span>
                </div>
              </button>
            )}
            {yanlisSoru && (
              <button
                onClick={() => nav(`/problemler/${yanlisSoru.id}`)}
                className="surface-lift p-6 text-left group"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip chip-danger">
                      <Icon name="RotateCcw" size={10} />
                      Tekrarla
                    </span>
                    <span className="chip">× {ilerleme.yanlislar[yanlisSoru.id]} yanlış</span>
                  </div>
                  <Thiings name={yanlisSoru.uniteIcon} size={36} />
                </div>
                <h3 className="font-display text-[20px] font-bold leading-tight tracking-tight text-ink mb-2 group-hover:text-accent-deep transition">
                  {yanlisSoru.baslik}
                </h3>
                <p className="text-[13.5px] text-ink-soft line-clamp-2 mb-4 leading-relaxed">
                  {yanlisSoru.senaryo}
                </p>
                <div className="hairline mb-3" />
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-mute">{yanlisSoru.uniteAd}</span>
                  <span className="text-ink font-medium flex items-center gap-1 group-hover:text-accent-deep transition">
                    Yeniden
                    <Icon name="ArrowRight" size={12} />
                  </span>
                </div>
              </button>
            )}
          </div>
        </>
      )}

      {/* İstatistik tablosu */}
      <div className="surface mb-10 rise-4">
        <div className="px-6 sm:px-8 py-4 border-b border-line">
          <h2 className="font-display text-[18px] font-bold text-ink tracking-tight">İstatistikler</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-line">
          {[
            { label: 'Genel ilerleme', sayi: cozulenYuzde, suffix: '%', alt: `${stat.cozulenSayi}/${stat.toplamSoru} soru` },
            { label: 'Bugün', sayi: bugunCozulen, suffix: '', alt: 'çözülen soru' },
            { label: 'Seri', sayi: ilerleme.streak, suffix: '', alt: 'gün üst üste' },
            { label: 'Puan', sayi: ilerleme.puan, suffix: '', alt: 'toplam' },
          ].map((s, i) => (
            <div key={i} className="px-6 py-6">
              <div className="text-[11px] text-ink-mute uppercase tracking-wider font-mono mb-2">{s.label}</div>
              <div className="font-display font-bold text-[36px] sm:text-[44px] text-ink tnum leading-none mb-1.5 tracking-tight">
                {s.sayi}{s.suffix && <span className="text-[20px] text-ink-quiet font-medium ml-0.5">{s.suffix}</span>}
              </div>
              <div className="text-[12px] text-ink-mute">{s.alt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sıkıntılı sorular */}
      {yanlisListe.length > 1 && (
        <div className="surface mb-10 rise-5">
          <div className="px-6 sm:px-8 py-4 border-b border-line flex items-baseline justify-between">
            <h2 className="font-display text-[18px] font-bold text-ink tracking-tight">
              Tekrar etmen gereken sorular
            </h2>
            <button onClick={() => nav('/problemler')} className="btn-link">
              Hepsi →
            </button>
          </div>
          <div className="divide-y divide-line">
            {yanlisListe.map(({ soru, sayi }, i) => (
              <button
                key={soru.id}
                onClick={() => nav(`/problemler/${soru.id}`)}
                className="w-full flex items-center gap-4 px-6 sm:px-8 py-4 hover:bg-surface-2 transition text-left group"
              >
                <span className="font-mono tnum text-[12px] text-ink-quiet w-5 text-right">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Thiings name={soru.uniteIcon} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-[15.5px] tracking-tight truncate text-ink group-hover:text-accent-deep transition">
                    {soru.baslik}
                  </div>
                  <div className="text-[12px] text-ink-mute mt-0.5">
                    {soru.uniteAd}
                  </div>
                </div>
                <span className="chip chip-danger">× {sayi}</span>
                <Icon name="ChevronRight" size={14} className="text-ink-quiet group-hover:text-ink transition" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hızlı navigasyon */}
      <div className="surface rise-5">
        <div className="px-6 sm:px-8 py-4 border-b border-line">
          <h2 className="font-display text-[18px] font-bold text-ink tracking-tight">Sayfalar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line">
          {[
            { yol: '/uniteler', baslik: 'Üniteler', alt: 'Konu konu pratik', icon: 'LayoutGrid' },
            { yol: '/problemler', baslik: 'Tüm Sorular', alt: 'Filtrele, ara', icon: 'ListChecks' },
            { yol: '/profil', baslik: 'Profil', alt: 'Rozet · İstatistik', icon: 'User' },
          ].map((l) => (
            <button
              key={l.yol}
              onClick={() => nav(l.yol)}
              className="text-left p-6 hover:bg-surface-2 transition group flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-ink-soft group-hover:text-ink group-hover:border-line-strong transition">
                  <Icon name={l.icon} size={16} />
                </div>
                <div>
                  <div className="font-display text-[16px] font-semibold tracking-tight text-ink group-hover:text-accent-deep transition">
                    {l.baslik}
                  </div>
                  <div className="text-[12.5px] text-ink-mute mt-0.5">{l.alt}</div>
                </div>
              </div>
              <Icon name="ArrowRight" size={14} className="text-ink-quiet group-hover:text-ink group-hover:translate-x-0.5 transition" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

/* ----------------------------------------------------------------------
   Anonim ana sayfa — info-yoğun, gerçek belge
---------------------------------------------------------------------- */

const UNITE_ACIKLAMA: Record<string, string> = {
  kasa: 'Nakit tahsilat ve ödemeler — 100 hesabı',
  banka: 'Vadesiz, vadeli, kredi işlemleri — 102, 103',
  mal: 'Ticari mal alış, satış, iade — 153, 600, 610',
  senet: 'Alacak/borç senetleri — 121, 321',
  kdv: 'İndirilecek, hesaplanan, mahsup — 191, 391',
  amortisman: 'Maddi duran varlık eskime — 257',
  personel: 'Ücret tahakkuk, ödeme, bordro — 720, 760',
  'donem-sonu': 'Gelir/gider kapanışı — 690',
  'supheli-alacaklar': 'Şüpheli, değersiz alacak — 128, 129',
  reeskont: 'Senet faiz hesaplaması — 122',
  kambiyo: 'Döviz, kur farkı — 102 dovizli',
};

// Bir sample yevmiye kaydı — gerçek görünmesi için
const ORNEK_KAYIT = [
  { kod: '100', ad: 'KASA', borc: '12.000,00', alacak: '' },
  { kod: '600', ad: 'YURT İÇİ SATIŞLAR', borc: '', alacak: '10.000,00' },
  { kod: '391', ad: 'HESAPLANAN KDV', borc: '', alacak: '2.000,00' },
];

/* Arka planda yüzen hesap kodları — radar tarzı atmosfer */
const FLOATING_CODES = [
  { kod: '100 KASA', x: '8%', y: '18%' },
  { kod: '102 BANKALAR', x: '92%', y: '14%' },
  { kod: '120 ALICILAR', x: '6%', y: '64%' },
  { kod: '153 TİC. MAL', x: '95%', y: '38%' },
  { kod: '191 İND. KDV', x: '14%', y: '88%' },
  { kod: '257 BİR. AMORT.', x: '88%', y: '78%' },
  { kod: '320 SATICILAR', x: '4%', y: '40%' },
  { kod: '391 HESAP. KDV', x: '90%', y: '92%' },
  { kod: '600 YURT İÇİ SATIŞLAR', x: '12%', y: '32%' },
  { kod: '770 GENEL YÖN.', x: '94%', y: '58%' },
];

/* Sahne metni: scroll progress'e göre değişen başlık */
interface Sahne {
  start: number;
  end: number;
  baslik: string;
  altyazi?: string;
}

const SAHNELER: Sahne[] = [
  {
    start: 0,
    end: 0.28,
    baslik: 'Yevmiye kaydını',
    altyazi: 'tarayıcıdan, gerçek senaryolarla.',
  },
  {
    start: 0.28,
    end: 0.55,
    baslik: 'Senaryoyu oku.',
    altyazi: 'Borç ve alacak satırlarını sırayla işle.',
  },
  {
    start: 0.55,
    end: 0.82,
    baslik: 'Anında doğrula.',
    altyazi: 'Yanlış satır kırmızı, dengeli kayıt yeşil.',
  },
  {
    start: 0.82,
    end: 1.0,
    baslik: 'Sıkıştığında AI yanında.',
    altyazi: '212 senaryo · 11 ünite · kasadan kambiyoya.',
  },
];

/* ----------------------------------------------------------------------
   Yardımcı bileşenler
---------------------------------------------------------------------- */

/* Görüntüye girince fade + slide-up — staggered children destekli */
interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: 'div' | 'section' | 'article' | 'span';
}
const Reveal = ({ children, delay = 0, className, y = 24, as = 'div' }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const Tag = motion[as];
  return (
    <Tag
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
};

/* Sayıyı 0'dan hedefe doğru count-up animasyonu — görüntüye girince */
interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}
const CountUp = ({ to, duration = 1.6, className, prefix = '', suffix = '' }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const value = useMotionValue(0);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (inView) {
      const controls = animate(value, to, {
        duration,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => setDisplay(Math.round(v).toString()),
      });
      return () => controls.stop();
    }
  }, [inView, to, duration, value]);

  return (
    <span ref={ref} className={`counter ${className ?? ''}`}>
      {prefix}{display}{suffix}
    </span>
  );
};

/* Aktif sahneyi bul */
const useAktifSahne = (progress: MotionValue<number>) => {
  const [aktif, setAktif] = useState(0);
  useEffect(() => {
    const unsubscribe = progress.on('change', (v) => {
      const idx = SAHNELER.findIndex((s) => v >= s.start && v < s.end);
      setAktif(idx === -1 ? SAHNELER.length - 1 : idx);
    });
    return () => unsubscribe();
  }, [progress]);
  return aktif;
};

/* ----------------------------------------------------------------------
   ScrollHero — Quartermaster-tarzı pinned scroll deneyimi
---------------------------------------------------------------------- */

interface ScrollHeroProps {
  nav: (path: string) => void;
  soruSayisi: number;
  uniteSayisi: number;
  uniteler: Unite[];
}

const ScrollHero = ({ nav, soruSayisi, uniteler }: ScrollHeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Yumuşatılmış progress (jitter olmasın)
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });

  // Sahne metni
  const aktifSahne = useAktifSahne(progress);
  const sahne = SAHNELER[aktifSahne];

  // Paper sheet — ilk açılıştan itibaren görünür, scroll'la ölçek değişir
  const paperScale = useTransform(progress, [0, 0.65, 0.82, 1], [0.94, 1.0, 0.62, 0.62]);
  const paperRotate = useTransform(progress, [0, 0.15, 0.82, 1], [-1.5, 0, 0, -2]);
  const paperOpacity = useTransform(progress, [0, 0.95, 1], [1, 1, 0.55]);

  // Halkalar — start'tan görünür, scroll'la daha çok genişler
  const ringScale1 = useTransform(progress, [0, 1], [0.85, 1.5]);
  const ringScale2 = useTransform(progress, [0, 1], [0.7, 1.7]);
  const ringScale3 = useTransform(progress, [0, 1], [0.55, 1.9]);
  const ringOpacity = useTransform(progress, [0, 0.9, 1], [0.55, 0.55, 0.2]);

  // Floating codes — start'tan görünür, sahne 4'te kaybolur
  const codesOpacity = useTransform(progress, [0, 0.6, 0.9], [0.6, 0.5, 0]);

  // Satırlar — tek tek scroll'la dolar (28% → 55%)
  const row1Opacity = useTransform(progress, [0.30, 0.36], [0, 1]);
  const row2Opacity = useTransform(progress, [0.36, 0.42], [0, 1]);
  const row3Opacity = useTransform(progress, [0.42, 0.48], [0, 1]);
  const totalOpacity = useTransform(progress, [0.48, 0.54], [0, 1]);
  const aciklamaOpacity = useTransform(progress, [0.54, 0.62], [0, 1]);

  // Orbital ünite ikonları (65% → 82%)
  const orbitOpacity = useTransform(progress, [0.62, 0.72], [0, 1]);
  const orbitScale = useTransform(progress, [0.62, 0.72], [0.6, 1]);

  // AI kart slide-in (82% → 100%)
  const aiCardX = useTransform(progress, [0.82, 0.94], [120, 0]);
  const aiCardOpacity = useTransform(progress, [0.82, 0.92], [0, 1]);

  // CTA fade-in son sahnede
  const ctaOpacity = useTransform(progress, [0.88, 1.0], [0, 1]);
  const ctaY = useTransform(progress, [0.88, 1.0], [20, 0]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: '420vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Arka plan dokusu — kâğıt fiber his */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch' seed='5'/><feColorMatrix values='0 0 0 0 0.12  0 0 0 0 0.23  0 0 0 0 0.37  0 0 0 0.018 0'/></filter><rect width='280' height='280' filter='url(%23n)'/></svg>")`,
            backgroundSize: '280px',
            mixBlendMode: 'multiply',
            opacity: 0.7,
          }}
        />

        {/* Konsantrik halkalar — radar tarzı atmosfer (start'tan görünür) */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            opacity: ringOpacity,
            x: '-50%',
            y: '-50%',
          }}
        >
          {[
            { size: 600, scale: ringScale1, dashed: false },
            { size: 900, scale: ringScale2, dashed: true },
            { size: 1200, scale: ringScale3, dashed: false },
          ].map((r, i) => (
            <motion.div
              key={i}
              className="ring"
              style={{
                width: r.size,
                height: r.size,
                top: -r.size / 2,
                left: -r.size / 2,
                scale: r.scale,
                borderStyle: r.dashed ? 'dashed' : 'solid',
                borderColor: 'rgba(31, 58, 95, 0.18)',
              }}
            />
          ))}
        </motion.div>

        {/* Yüzen hesap kodları */}
        <motion.div className="absolute inset-0" style={{ opacity: codesOpacity }}>
          {FLOATING_CODES.map((c, i) => {
            const yOffset = useTransform(progress, [0, 1], [0, (i % 2 === 0 ? -40 : 40)]);
            return (
              <motion.span
                key={i}
                className="float-code"
                style={{ left: c.x, top: c.y, y: yOffset }}
              >
                {c.kod}
              </motion.span>
            );
          })}
        </motion.div>

        {/* Sahne metni — sol tarafta sticky */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 w-full">
            <div className="max-w-md lg:max-w-lg pointer-events-auto">
              <div
                key={aktifSahne}
                style={{ animation: 'sceneEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="chip chip-mint">
                    <span className="live-dot" />
                    {soruSayisi} soru aktif
                  </span>
                  <span className="font-mono text-[11px] text-ink-mute tracking-wider">
                    0{aktifSahne + 1} / 0{SAHNELER.length}
                  </span>
                </div>
                <h1
                  className="scene-text"
                  style={{ fontSize: 'clamp(40px, 5.6vw, 76px)' }}
                >
                  {sahne.baslik}
                </h1>
                {sahne.altyazi && (
                  <p className="text-[16px] sm:text-[18px] text-ink-soft leading-relaxed mt-5 max-w-md">
                    {sahne.altyazi}
                  </p>
                )}
              </div>

              {/* CTA — son sahnede görünür */}
              <motion.div
                style={{ opacity: ctaOpacity, y: ctaY }}
                className="flex flex-wrap items-center gap-4 mt-8"
              >
                <button onClick={() => nav('/problemler')} className="btn btn-primary btn-lg">
                  Hemen başla — kayıt yok
                </button>
                <button onClick={() => nav('/giris')} className="btn-link">
                  Hesap oluştur →
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* MERKEZ: Yevmiye defteri kâğıdı */}
        <div
          className="absolute top-1/2 right-[8%] sm:right-[10%] lg:right-[12%] -translate-y-1/2 w-[88vw] sm:w-[68vw] md:w-[52vw] lg:w-[44vw] max-w-[540px]"
          style={{ animation: 'paperEnter 1.0s cubic-bezier(0.16, 1, 0.3, 1) both', animationDelay: '0.15s' }}
        >
        <motion.div
          style={{
            scale: paperScale,
            rotate: paperRotate,
            opacity: paperOpacity,
            transformOrigin: 'center center',
          }}
        >
          <div className="paper-sheet p-6 sm:p-8">
            <div className="relative">
              <div className="flex items-baseline justify-between mb-1">
                <span className="doc-header">Yevmiye Defteri</span>
                <span className="doc-header">Sayfa 03 · No. 47</span>
              </div>
              <div className="hairline mb-4" />

              <div className="flex items-baseline justify-between text-[12.5px] mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-ink-mute font-mono">26.04.2026</span>
                  <span className="chip chip-mint" style={{ borderRadius: 4 }}>
                    Peşin Mal Satışı
                  </span>
                </div>
                <span className="text-ink-mute font-mono tnum">12.000,00 ₺</span>
              </div>

              {/* Tablo başlığı */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 border-y border-line text-[10.5px] uppercase tracking-wider font-mono text-ink-mute">
                <div className="col-span-2">Kod</div>
                <div className="col-span-5">Hesap Adı</div>
                <div className="col-span-2 text-right">Borç</div>
                <div className="col-span-2 text-right">Alacak</div>
                <div className="col-span-1"></div>
              </div>

              {/* Satırlar — scroll'la tek tek dolar */}
              {[
                { row: ORNEK_KAYIT[0], opacity: row1Opacity },
                { row: ORNEK_KAYIT[1], opacity: row2Opacity },
                { row: ORNEK_KAYIT[2], opacity: row3Opacity },
              ].map(({ row, opacity }, i) => (
                <motion.div
                  key={i}
                  style={{ opacity }}
                  className="grid grid-cols-12 gap-2 px-3 py-3 border-b border-line-soft font-mono tnum text-[13px] text-ink"
                >
                  <div className="col-span-2 font-semibold">{row.kod}</div>
                  <div className="col-span-5 truncate">{row.ad}</div>
                  <div className="col-span-2 text-right">{row.borc}</div>
                  <div className="col-span-2 text-right">{row.alacak}</div>
                  <div className="col-span-1 flex justify-end items-center">
                    <Icon name="Check" size={12} className="text-success" />
                  </div>
                </motion.div>
              ))}

              {/* Toplam */}
              <motion.div
                style={{ opacity: totalOpacity }}
                className="grid grid-cols-12 gap-2 px-3 py-3 border-t-2 border-line-strong font-mono tnum font-bold text-[13.5px] text-ink"
              >
                <div className="col-span-7 uppercase tracking-wider text-[10.5px] text-ink-mute font-medium pt-0.5">
                  Toplam
                </div>
                <div className="col-span-2 text-right">12.000,00</div>
                <div className="col-span-2 text-right">12.000,00</div>
                <div className="col-span-1 flex justify-end items-center">
                  <Icon name="CheckCircle2" size={14} className="text-success" />
                </div>
              </motion.div>

              {/* Açıklama */}
              <motion.div
                style={{ opacity: aciklamaOpacity }}
                className="mt-4 px-3 py-2.5 text-[12px] text-ink-soft italic font-serif border-l-2 border-success"

              >
                <span style={{ background: 'rgba(93, 138, 111, 0.06)', display: 'inline-block', padding: '2px 6px' }}>
                  İşletme, ticari mal satışından %20 KDV dahil 12.000 ₺ peşin tahsilat yapmıştır.
                </span>
              </motion.div>

              <div className="mt-5 pt-3 border-t border-line flex items-baseline justify-between text-[10.5px] text-ink-mute font-mono uppercase tracking-wider">
                <span>Hazırlayan: Sen</span>
                <span>Doğrulandı · +10p</span>
              </div>
            </div>
          </div>
        </motion.div>
        </div>

        {/* ORBITAL ÜNİTE İKONLARI — sahne 3 */}
        <motion.div
          className="absolute top-1/2 right-[8%] sm:right-[10%] lg:right-[12%] -translate-y-1/2 pointer-events-none"
          style={{ opacity: orbitOpacity, scale: orbitScale }}
        >
          {uniteler.slice(0, 11).map((u, i) => {
            const angle = (i / 11) * Math.PI * 2 - Math.PI / 2;
            const radius = 280;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.div
                key={u.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-col items-center gap-1">
                  <Thiings name={u.thiingsIcon} size={44} />
                  <span className="font-mono text-[10px] text-ink-soft tracking-wider whitespace-nowrap bg-bg/80 backdrop-blur px-1.5 py-0.5 rounded">
                    {u.ad}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* AI KART SLIDE-IN — sahne 4 */}
        <motion.div
          className="absolute right-6 sm:right-10 top-[18%] w-[280px] sm:w-[320px] pointer-events-none z-10"
          style={{ x: aiCardX, opacity: aiCardOpacity }}
        >
          <div className="glass-card p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-md bg-sky-soft flex items-center justify-center flex-shrink-0">
                <Icon name="Sparkles" size={14} className="text-sky-deep" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-mono uppercase tracking-wider text-sky-deep font-semibold">
                  AI Yardım
                </div>
                <div className="font-display text-[15px] font-bold text-ink leading-tight mt-0.5">
                  Yanlış kod tespiti
                </div>
              </div>
            </div>
            <p className="text-[13px] text-ink-soft leading-relaxed mb-3">
              <span className="font-mono font-semibold text-danger">391</span> yerine{' '}
              <span className="font-mono font-semibold text-ink">191</span> yazdın.
              Hesaplanan KDV'nin alacak tarafına gelmeli.
            </p>
            <div className="hairline mb-3" />
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="font-mono text-ink-mute">Ünite · KDV</span>
              <span className="font-mono text-success">+5p potansiyel</span>
            </div>
          </div>
        </motion.div>

        {/* Alt scroll ipucu — sadece başta */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ opacity: useTransform(progress, [0, 0.1, 0.15], [1, 1, 0]) }}
        >
          <div className="flex flex-col items-center gap-2 text-ink-mute">
            <span className="font-mono text-[10.5px] uppercase tracking-wider">Aşağı kaydır</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <Icon name="ChevronDown" size={16} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AnonimAnaSayfa = () => {
  const nav = useNavigate();
  const { uniteler, tumSorular } = useUniteler();
  const gununSoru = useMemo(() => gununSorusu(tumSorular), [tumSorular]);
  const [planlar, setPlanlar] = useState<Plan[]>([]);

  useEffect(() => {
    planlariYukle()
      .then(setPlanlar)
      .catch(() => {});
  }, []);

  const aylikPlan = planlar.find((p) => p.kod === 'aylik');
  const donemlikPlan = planlar.find((p) => p.kod === 'donemlik');
  const aylikTutar = aylikPlan ? aylikPlan.tutar.toFixed(0) : '99';
  const donemlikTutar = donemlikPlan ? donemlikPlan.tutar.toFixed(0) : '249';
  const donemlikAy = donemlikPlan?.ay_sayisi ?? 4;

  return (
    <main>
      {/* ===========================================================
          HERO — Quartermaster-tarzı pinned scroll deneyimi
          Ortada sabit yevmiye sayfası, etrafında halkalar açılır,
          satırlar tek tek dolar, sahne metni scroll'la değişir,
          AI kart sonunda slide-in olur.
      =========================================================== */}
      <ScrollHero
        nav={nav}
        soruSayisi={tumSorular.length}
        uniteSayisi={uniteler.length}
        uniteler={uniteler}
      />

      {/* ===========================================================
          NASIL ÇALIŞIR — 3 adım, atmosferik
      =========================================================== */}
      <section className="relative px-5 sm:px-8 py-20 sm:py-24 border-y border-line bg-surface-2/40 dot-grid-bg overflow-hidden">
        <div className="max-w-[1240px] mx-auto relative">
          <Reveal>
            <div className="section-divider mb-10">
              <span>§ 01 · Akış</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="flex items-baseline justify-between mb-12 flex-wrap gap-4">
              <h2 className="font-display text-[34px] sm:text-[44px] md:text-[52px] font-bold tracking-tight text-ink leading-[1.0]">
                Üç adımda <br className="md:hidden" />yevmiye kaydı.
              </h2>
              <span className="text-[15px] text-ink-soft max-w-sm">
                Senaryoyu oku, defterine işle, anında kontrol et.
                Kayıt zorunlu değil — otuz saniye yetiyor.
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Bağlantı çizgisi — masaüstünde görünür */}
            <div className="hidden md:block absolute top-[78px] left-[16%] right-[16%] h-px bg-line-strong z-0 pointer-events-none">
              <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-line-strong" />
              <span className="absolute left-1/4 -translate-x-1/2 -top-1 w-1.5 h-1.5 rounded-full bg-line" />
              <span className="absolute left-3/4 -translate-x-1/2 -top-1 w-1.5 h-1.5 rounded-full bg-line" />
            </div>

            {[
              {
                no: '01',
                baslik: 'Senaryoyu oku',
                aciklama: 'Gerçek bir işletme işlemi — peşin satış, KDV mahsubu, amortisman, maaş tahakkuku.',
                icon: 'BookOpen',
                mini: (
                  <div className="mini-paper">
                    <div className="text-ink-mute mb-1 text-[9.5px]">SENARYO · No. 12</div>
                    <div className="text-ink leading-snug font-sans text-[10.5px] not-italic">
                      İşletme, peşin mal satışından <span className="font-semibold">10.000 ₺</span> tahsilat yapmıştır.
                    </div>
                  </div>
                ),
              },
              {
                no: '02',
                baslik: 'Yevmiye kaydını gir',
                aciklama: 'Hesap kodunu yaz, borç ve alacak tutarlarını gir. Otomatik tamamlama yardımcı olur.',
                icon: 'Pencil',
                mini: (
                  <div className="mini-paper">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-baseline">
                      <span className="font-bold text-ink">100</span>
                      <span className="text-ink-soft">KASA</span>
                      <span className="text-ink tnum">12.000,00</span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-baseline mt-1">
                      <span className="font-bold text-ink">600</span>
                      <span className="text-ink-soft">SATIŞLAR</span>
                      <span className="text-ink tnum">10.000,00</span>
                    </div>
                    <div className="mt-1.5 h-1 w-2/3 bg-sky-soft rounded animate-pulse" />
                  </div>
                ),
              },
              {
                no: '03',
                baslik: 'Anında kontrol',
                aciklama: 'Yanlış satırlar kırmızı, doğrular yeşil. İpucu, resmi çözüm ve detaylı açıklama hazır.',
                icon: 'CheckCircle2',
                mini: (
                  <div className="mini-paper">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-ink-mute text-[9.5px]">SONUÇ</span>
                      <span className="text-success font-semibold text-[10px]">+10p</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-3 h-3 rounded-full bg-success-soft flex items-center justify-center">
                          <Icon name="Check" size={8} className="text-success" />
                        </span>
                        <span className="text-ink">Borç = Alacak</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-3 h-3 rounded-full bg-success-soft flex items-center justify-center">
                          <Icon name="Check" size={8} className="text-success" />
                        </span>
                        <span className="text-ink">Hesap kodları doğru</span>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((adim, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <div className="surface-lift p-7 relative bg-surface z-10">
                  <div className="flex items-baseline justify-between mb-5">
                    <span className="font-mono text-[12px] text-ink-mute tnum tracking-wider relative">
                      <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-deep opacity-60" />
                      Adım {adim.no}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-ink-soft">
                      <Icon name={adim.icon} size={15} />
                    </div>
                  </div>
                  <h3 className="font-display text-[22px] font-bold tracking-tight text-ink mb-3 leading-tight">
                    {adim.baslik}
                  </h3>
                  <p className="text-[14px] text-ink-soft leading-relaxed mb-5">
                    {adim.aciklama}
                  </p>
                  {/* Mini visualization */}
                  {adim.mini}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
          ÜNİTELER — 11 ünite, atmosferik (yüzen kodlar arka planda)
      =========================================================== */}
      <section className="relative px-5 sm:px-8 py-20 sm:py-24 overflow-hidden">
        {/* Arka planda yüzen hesap kodları — düşük opacity */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <span className="sticker-bg" style={{ left: '4%', top: '12%', transform: 'rotate(-8deg)' }}>100 · KASA</span>
          <span className="sticker-bg" style={{ right: '6%', top: '18%', transform: 'rotate(6deg)' }}>391 · HESAPLANAN KDV</span>
          <span className="sticker-bg" style={{ left: '8%', bottom: '20%', transform: 'rotate(4deg)' }}>153 · TİCARİ MAL</span>
          <span className="sticker-bg" style={{ right: '4%', bottom: '12%', transform: 'rotate(-5deg)' }}>600 · YURT İÇİ SATIŞLAR</span>
          <span className="sticker-bg" style={{ left: '40%', top: '8%', transform: 'rotate(2deg)' }}>257 · BİRİKMİŞ AMORT.</span>
        </div>

        <div className="max-w-[1240px] mx-auto relative">
          <Reveal>
            <div className="section-divider mb-10">
              <span>§ 02 · İçerik</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
              <div>
                <h2 className="font-display text-[34px] sm:text-[44px] md:text-[56px] font-bold tracking-tight text-ink leading-[1.0] mb-3">
                  <CountUp to={11} /> ünite,{' '}
                  <span className="text-ink-soft"><CountUp to={tumSorular.length} /> soru</span>.
                </h2>
                <p className="text-[15px] text-ink-soft max-w-xl leading-relaxed">
                  Her ünitede kolay → orta → zor sıralı sorular.
                  Hesap kodları her başlığın altında — Tek Düzen Hesap Planı'nın tamamı.
                </p>
              </div>
              <button onClick={() => nav('/uniteler')} className="btn btn-soft">
                Tüm üniteler →
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface overflow-hidden bg-surface">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {uniteler.map((u, i) => {
                  // hesap kodu açıklamasından sayıları çıkar
                  const aciklama = UNITE_ACIKLAMA[u.id] ?? u.aciklama ?? '—';
                  const kodMatch = aciklama.match(/—\s*(.+)$/);
                  const kodlar = kodMatch ? kodMatch[1] : '';
                  const baslangic = aciklama.replace(/—.+$/, '').trim();
                  return (
                    <button
                      key={u.id}
                      onClick={() => nav(`/uniteler/${u.id}`)}
                      className={`
                        text-left p-5 transition hover:bg-surface-2 group relative
                        border-b border-line
                        ${i % 3 !== 2 ? 'lg:border-r lg:border-line' : ''}
                        ${i % 2 !== 1 ? 'sm:max-lg:border-r sm:max-lg:border-line' : ''}
                        ${i >= uniteler.length - (uniteler.length % 3 || 3) ? 'lg:border-b-0' : ''}
                      `}
                    >
                      <div className="absolute top-3 right-3 font-mono text-[10px] text-ink-quiet tnum">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="flex items-start gap-4">
                        <Thiings name={u.thiingsIcon} size={40} />
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="font-display text-[17px] font-bold tracking-tight text-ink group-hover:text-accent-deep transition mb-1">
                            {u.ad}
                          </h3>
                          <p className="text-[12.5px] text-ink-soft leading-snug mb-2.5">
                            {baslangic || aciklama}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {kodlar && (
                              <span className="font-mono text-[10.5px] text-sky-deep font-semibold tracking-wider px-1.5 py-0.5 rounded bg-sky-soft">
                                {kodlar}
                              </span>
                            )}
                            <span className="font-mono tnum text-[11px] text-ink-mute">
                              · {u.sorular.length} soru
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===========================================================
          BUGÜNÜN SORUSU — günlük "manşet" havası
      =========================================================== */}
      {gununSoru && (
        <section className="px-5 sm:px-8 py-16 border-t border-line">
          <div className="max-w-[1240px] mx-auto">
            <Reveal>
              <div className="section-divider mb-10">
                <span>§ 03 · Bugün</span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="surface-lift relative overflow-hidden">
                {/* Sol kenar şerit — günlük yayın hissi */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-deep via-accent to-sky-deep opacity-70" />

                {/* Üst tarih şeridi */}
                <div className="px-7 sm:px-9 py-3 border-b border-line bg-surface-2 flex items-baseline justify-between">
                  <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-mute">
                    {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-mute">
                    Sayı {new Date().getDate()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center p-7 sm:p-9">
                  <div className="md:col-span-8">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="chip chip-premium">
                        <Icon name="Calendar" size={11} />
                        Manşet
                      </span>
                      <ZorlukChip zorluk={gununSoru.zorluk} />
                      <span className="chip">{gununSoru.uniteAd}</span>
                    </div>
                    <h2 className="font-display text-[28px] sm:text-[40px] md:text-[44px] font-bold leading-[1.0] tracking-tight text-ink mb-4">
                      {gununSoru.baslik}
                    </h2>
                    <p className="text-[15.5px] text-ink-soft leading-relaxed max-w-2xl mb-6">
                      {gununSoru.senaryo}
                    </p>
                    <div className="flex flex-wrap gap-4 items-baseline">
                      <button
                        onClick={() => nav(`/problemler/${gununSoru.id}`)}
                        className="btn btn-primary"
                      >
                        Bu Soruyu Çöz
                      </button>
                      <button onClick={() => nav('/problemler')} className="btn-link">
                        Diğerleri →
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-4 flex flex-col items-center md:items-end gap-3">
                    <Thiings name={gununSoru.uniteIcon} size={120} />
                    <div className="flex items-baseline gap-3 text-[12px] text-ink-mute font-mono uppercase tracking-wider">
                      <span>≈ 2 dk</span>
                      <span>·</span>
                      <span className="text-sky-deep">+{ZORLUK_PUAN[gununSoru.zorluk]}p</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===========================================================
          ÜCRETSİZ vs PREMIUM KARŞILAŞTIRMA
      =========================================================== */}
      <section className="px-5 sm:px-8 py-20 sm:py-24 border-t border-line bg-surface-2/30">
        <div className="max-w-[1240px] mx-auto">
          <Reveal>
            <div className="section-divider mb-10">
              <span>§ 04 · Tarife</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="font-display text-[34px] sm:text-[44px] md:text-[52px] font-bold tracking-tight text-ink leading-[1.0]">
                Ücretsiz vs <span className="text-premium-deep">Premium</span>
              </h2>
              <p className="text-[15px] text-ink-soft mt-4 leading-relaxed">
                Tüm sorular ücretsiz çözülebilir. Premium, sıkıştığında AI yardımını ve
                otomatik tamamlama destek katmanını açar.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
          <div className="surface overflow-hidden max-w-3xl mx-auto bg-surface">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] px-5 py-3 border-b border-line bg-surface-2 text-[11px] uppercase tracking-wider font-mono text-ink-mute">
              <div>Özellik</div>
              <div className="text-center">Ücretsiz</div>
              <div className="text-center text-premium-deep">Premium</div>
            </div>

            {[
              { ozellik: '212 sorunun tamamı', free: true, prem: true },
              { ozellik: '11 ünite, 3 zorluk', free: true, prem: true },
              { ozellik: 'Anlık doğru/yanlış kontrolü', free: true, prem: true },
              { ozellik: 'İlerleme + rozet sistemi', free: true, prem: true },
              { ozellik: 'AI yanlış cevap analizi', free: false, prem: true },
              { ozellik: 'Soru içi AI asistan', free: false, prem: true },
              { ozellik: 'Hesap kodu otomatik tamamlama', free: false, prem: true },
              { ozellik: 'Belge görselleri (fatura, dekont)', free: false, prem: true },
              { ozellik: 'Sınırsız çalışma', free: true, prem: true },
            ].map((satir, i) => (
              <div key={i} className="compare-row text-[14px]">
                <div className="text-ink">{satir.ozellik}</div>
                <div className="text-center">
                  {satir.free ? (
                    <Icon name="Check" size={15} className="text-success inline" />
                  ) : (
                    <span className="text-ink-quiet font-mono">—</span>
                  )}
                </div>
                <div className="text-center">
                  {satir.prem ? (
                    <Icon name="Check" size={15} className="text-premium-deep inline" />
                  ) : (
                    <span className="text-ink-quiet font-mono">—</span>
                  )}
                </div>
              </div>
            ))}

            {/* Fiyat satırı */}
            <div className="grid grid-cols-[1.6fr_1fr_1fr] px-5 py-5 border-t-2 border-line-strong bg-surface-2">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-ink-mute mb-1">Fiyat</div>
                <div className="text-[12.5px] text-ink-soft">Aylık abonelik / dönem aboneliği</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-[24px] text-ink tnum leading-none">₺0</div>
                <div className="text-[11px] text-ink-mute mt-1 font-mono uppercase tracking-wider">her zaman</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-[24px] text-ink tnum leading-none">
                  ₺{aylikTutar}
                  <span className="text-[14px] text-ink-quiet font-mono">/ay</span>
                </div>
                <div className="text-[11px] text-ink-mute mt-1 font-mono uppercase tracking-wider">
                  veya ₺{donemlikTutar} / {donemlikAy} ay
                </div>
              </div>
            </div>
          </div>

          </Reveal>

          <Reveal delay={0.15}>
            <div className="text-center mt-10 flex flex-wrap gap-3 justify-center">
              <button onClick={() => nav('/problemler')} className="btn btn-primary btn-lg">
                Ücretsiz Başla
              </button>
              <button onClick={() => nav('/premium')} className="btn btn-soft btn-lg">
                Premium Detaylar →
              </button>
            </div>
            <p className="text-[12px] text-ink-mute font-mono uppercase tracking-wider text-center mt-5">
              <span className="inline-block w-2 h-2 rounded-full bg-premium align-middle mr-2" />
              İlk 100 kullanıcıya bir yıl Premium bedava
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===========================================================
          SSS
      =========================================================== */}
      <section className="px-5 sm:px-8 py-20 sm:py-24 border-t border-line">
        <div className="max-w-[860px] mx-auto">
          <Reveal>
            <div className="section-divider mb-10">
              <span>§ 05 · SSS</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[34px] sm:text-[44px] md:text-[52px] font-bold tracking-tight text-ink leading-[1.0] mb-12">
              Sıkça sorulanlar.
            </h2>
          </Reveal>

          <div className="space-y-4">
            {[
              {
                s: 'Kayıt olmadan kullanabilir miyim?',
                c: 'Evet. Ana sayfadaki "Hemen başla" butonu seni problemlere götürür. İlerlemen tarayıcında saklanır. Hesap açarsan tüm veriler buluta taşınır, başka cihazda devam edersin.',
              },
              {
                s: 'Hangi konuları kapsıyor?',
                c: 'Tek Düzen Hesap Planı temelli 11 ünite: Kasa, Banka, Mal, Senet, KDV, Amortisman, Personel, Dönem Sonu, Şüpheli Alacaklar, Reeskont, Kambiyo. Toplam 212 senaryo bazlı soru.',
              },
              {
                s: 'Cevabımı nasıl kontrol ediyor?',
                c: 'Her soru için resmi yevmiye kaydı tanımlı. Senin girdiğin satırlar (hesap kodu + borç + alacak tutarı) referansla karşılaştırılır. Doğru = yeşil, yanlış = kırmızı, eksik satır → uyarı.',
              },
              {
                s: 'Premium nedir, neden var?',
                c: 'Tüm sorular ücretsizdir. Premium, sıkıştığında AI asistan, yanlış cevap analizi ve hesap kodu otomatik tamamlama gibi destek katmanlarını açar. İlk 100 kullanıcıya bir yıl bedava.',
              },
              {
                s: 'Sınav döneminde işime yarar mı?',
                c: 'Evet — özellikle vize/final öncesi haftada. Sorular gerçek sınav tipinde (kolay/orta/zor karışık), aktivite ısı haritası ve seri sayacı ile düzenli pratik kurma motivasyonunu canlı tutar.',
              },
            ].map((sss, i) => (
              <Reveal key={i} delay={0.05 * i} y={16}>
                <details className="surface group bg-surface hover:border-line-strong transition">
                  <summary className="cursor-pointer p-5 flex items-baseline justify-between gap-4 list-none">
                    <span className="flex items-baseline gap-3 flex-1">
                      <span className="font-mono text-[11px] text-ink-quiet tnum tracking-wider">
                        0{i + 1}
                      </span>
                      <span className="font-display text-[16px] sm:text-[17px] font-semibold text-ink tracking-tight group-hover:text-accent-deep transition">
                        {sss.s}
                      </span>
                    </span>
                    <Icon name="ChevronDown" size={16} className="text-ink-mute group-open:rotate-180 transition flex-shrink-0 mt-1" />
                  </summary>
                  <div className="px-5 pb-5 ml-8 text-[14.5px] text-ink-soft leading-relaxed">{sss.c}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
          KAPANIŞ — son seslenme, atmosferik
      =========================================================== */}
      <section className="relative px-5 sm:px-8 py-24 sm:py-32 border-t border-line overflow-hidden">
        {/* Hafif arka plan halkaları — hero'yu hatırlatma */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="ring" style={{ width: 400, height: 400 }} />
          <div className="ring ring-inner" style={{ width: 600, height: 600, position: 'absolute' }} />
          <div className="ring" style={{ width: 800, height: 800, position: 'absolute' }} />
        </div>

        <div className="relative max-w-[860px] mx-auto text-center">
          <Reveal>
            <div className="section-divider mb-10">
              <span>§ 06 · Başla</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="live-dot" />
              <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-ink-mute">
                {tumSorular.length} soru hazır · şu an aktif
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-[40px] sm:text-[60px] md:text-[76px] font-bold tracking-tight text-ink leading-[0.96] mb-6">
              Otuz saniyede <br className="md:hidden" />
              <span className="text-ink-soft">başla.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="text-[16px] sm:text-[18px] text-ink-soft max-w-xl mx-auto leading-relaxed mb-10">
              Üye olmadan da çalışabilirsin. İlerlemeni kaydetmek istersen
              kullanıcı adı + şifre yeter — bir saniye bile sürmüyor.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <button onClick={() => nav('/giris')} className="btn btn-primary btn-lg">
                Hesap Oluştur
              </button>
              <button onClick={() => nav('/problemler')} className="btn btn-soft btn-lg">
                Önce Soruları Gör
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="inline-flex items-baseline gap-6 text-[12.5px] font-mono uppercase tracking-[0.14em] text-ink-mute">
              <span className="flex items-center gap-2">
                <Icon name="Check" size={11} className="text-success" />
                Ücretsiz başlangıç
              </span>
              <span className="flex items-center gap-2">
                <Icon name="Check" size={11} className="text-success" />
                Kayıt zorunlu değil
              </span>
              <span className="flex items-center gap-2">
                <Icon name="Check" size={11} className="text-success" />
                İlk 100'e Premium
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
};
