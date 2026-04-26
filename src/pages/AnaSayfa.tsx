import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { OzellikMockup } from '../components/OzellikMockup';
import { useAuth } from '../contexts/AuthContext';
import { useUniteler } from '../contexts/UnitelerContext';
import { gununSorusu } from '../lib/gunun-sorusu';
import { devamEtSorusu, enCokYanlisSoru } from '../lib/oneriler';
import { bugununTarihi } from '../lib/format';
import { planlariYukle, type Plan } from '../lib/odeme';
import { ZORLUK_AD, ZORLUK_PUAN } from '../data/sabitler';
import type { Ilerleme, Istatistik, SoruWithUnite, Zorluk } from '../types';

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

/* Thiings vignette — qvery'nin el çizimi illüstrasyonunun bizdeki karşılığı.
   3D ikonlardan oluşan, hafif rotasyonlu, blob arkalı bir kompozisyon. */
const HeroVignette = () => (
  <div className="relative w-full aspect-square max-w-[520px] mx-auto">
    {/* Blobs */}
    <div className="blob-mint w-[300px] h-[300px] left-[-10%] top-[10%] blob-drift" />
    <div className="blob-peach w-[260px] h-[260px] right-[-5%] bottom-[5%] blob-drift-2" />

    {/* Merkez ikon — büyük calculator */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="thiings-float">
        <Thiings name="calculator" size={240} />
      </div>
    </div>

    {/* Yörünge ikonları */}
    <div className="absolute left-[6%] top-[8%] z-20 thiings-float-2">
      <Thiings name="kasa" size={92} />
    </div>
    <div className="absolute right-[4%] top-[14%] z-20 thiings-float-3">
      <Thiings name="banka" size={84} />
    </div>
    <div className="absolute right-[12%] bottom-[10%] z-20 thiings-float-4">
      <Thiings name="trophy" size={88} />
    </div>
    <div className="absolute left-[10%] bottom-[6%] z-20 thiings-float">
      <Thiings name="tl" size={80} />
    </div>

    {/* Dekoratif tırnak */}
    <span className="quote-mark absolute left-[2%] top-[2%] z-0 text-[140px] opacity-50 select-none rotate-[-8deg]">
      "
    </span>
    <span className="quote-mark quote-mark-peach absolute right-[6%] bottom-[2%] z-0 text-[120px] opacity-50 select-none rotate-[12deg]">
      "
    </span>
  </div>
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
      <main className="max-w-[1320px] mx-auto px-5 py-32 flex items-center justify-center">
        <Icon name="Loader2" size={20} className="animate-spin text-ink-mute" />
      </main>
    );
  }

  if (user) return <KullaniciPaneli ilerleme={ilerleme} stat={stat} />;
  return <AnonimAnaSayfa />;
};

/* ----------------------------------------------------------------------
   Kullanıcı dashboard'u
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

  const selamlama = (() => {
    const saat = new Date().getHours();
    if (saat < 6) return 'İyi geceler';
    if (saat < 12) return 'Günaydın';
    if (saat < 18) return 'İyi günler';
    return 'İyi akşamlar';
  })();

  const henuzCozulmemis = stat.cozulenSayi === 0;
  const cozulenYuzde = stat.toplamSoru > 0 ? Math.round((stat.cozulenSayi / stat.toplamSoru) * 100) : 0;

  return (
    <main className="max-w-[1320px] mx-auto px-3 sm:px-5 py-8 sm:py-12">
      {/* Selamlama */}
      <section className="mb-8 rise relative">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="eyebrow eyebrow-mint">{selamlama}</span>
          <span className="live-dot" />
        </div>
        <h1 className="font-display text-[44px] sm:text-[68px] md:text-[88px] leading-[0.9] font-bold tracking-[-0.035em] text-ink">
          {ad}, <span className="text-ink-mute">bugün ne </span>
          <span className="marker">çözüyoruz</span>
          <span className="text-ink-mute">?</span>
        </h1>
      </section>

      {/* Üst grid — devam edilecek + hedef */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 rise-2">
        <div className="md:col-span-8">
          {aktifUnite && devamSoru ? (
            <button
              onClick={() => nav(`/problemler/${devamSoru.id}`)}
              className="w-full text-left surface-lift group p-7 sm:p-9 relative overflow-hidden h-full flex flex-col min-h-[280px]"
            >
              <div className="absolute -right-10 -top-10 blob-mint w-[260px] h-[260px] opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="relative flex items-start justify-between gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="chip chip-primary">
                      <Icon name="ArrowRight" size={11} />
                      {henuzCozulmemis ? 'İlk Soru' : 'Devam Et'}
                    </span>
                    <ZorlukChip zorluk={devamSoru.zorluk} />
                  </div>
                  <h2 className="font-display text-[28px] sm:text-[36px] md:text-[42px] leading-[0.98] tracking-[-0.03em] font-bold text-ink mb-3">
                    {devamSoru.baslik}
                  </h2>
                  <p className="text-[15.5px] text-ink-soft leading-relaxed line-clamp-2 max-w-2xl">
                    {devamSoru.senaryo}
                  </p>
                </div>
                <div className="hidden sm:block flex-shrink-0">
                  <Thiings name={aktifUnite.unite.thiingsIcon} size={84} />
                </div>
              </div>
              <div className="relative mt-auto pt-5 dotted-line">
                <div className="flex items-center justify-between gap-3 pt-5">
                  <div className="flex items-center gap-2 text-[13px] text-ink-soft">
                    <span className="font-medium">{aktifUnite.unite.ad}</span>
                    <span className="text-ink-quiet">·</span>
                    <span className="font-mono tnum text-ink font-bold">
                      {aktifUnite.cozulen}/{aktifUnite.toplam}
                    </span>
                    <div className="ml-2 flex-1 h-1.5 bg-bg-tint rounded-full overflow-hidden max-w-[140px]">
                      <div
                        className="h-full bg-mint-deep rounded-full transition-all"
                        style={{ width: `${(aktifUnite.cozulen / aktifUnite.toplam) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[14px] font-bold text-ink group-hover:text-mint-deep transition">
                    Çöz
                    <Icon name="ArrowRight" size={14} className="group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <div className="surface p-10 text-center h-full flex flex-col items-center justify-center min-h-[280px]">
              <Thiings name="trophy" size={80} />
              <h2 className="font-display text-[28px] font-bold tracking-tight mt-5 mb-3 text-ink">
                Tüm soruları çözdün
              </h2>
              <p className="text-[15px] text-ink-soft mb-6 max-w-md">
                Yeni soruları beklerken yanlışlarını tekrar edebilirsin.
              </p>
              <button onClick={() => nav('/problemler')} className="btn btn-primary">
                Tüm Sorular
                <Icon name="ArrowRight" size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-4">
          <div className="surface-lift p-7 h-full flex flex-col relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 blob-peach w-[200px] h-[200px] opacity-60" />
            <div className="relative flex items-baseline justify-between mb-4">
              <span className="eyebrow eyebrow-peach">Bugünkü Hedef</span>
              {hedefTamam && <span className="chip chip-success">✓</span>}
            </div>
            <div className="relative flex items-baseline gap-1 mb-1">
              <span className="huge-number text-[88px] text-ink">{bugunCozulen}</span>
              <span className="font-display font-bold text-[28px] text-ink-quiet ml-1">
                /{gunlukHedef}
              </span>
            </div>
            <p className="relative text-[14px] text-ink-soft mb-5">
              {hedefTamam
                ? 'Hedefi geçtin. Bonus puanlar bekliyor.'
                : `${gunlukHedef - bugunCozulen} soru kaldı.`}
            </p>
            <div className="relative h-2 bg-bg-tint rounded-full overflow-hidden mb-6">
              <div
                className="h-full transition-all duration-700 rounded-full"
                style={{
                  width: `${hedefYuzde}%`,
                  background: hedefTamam ? 'var(--jade)' : 'var(--mint-deep)',
                }}
              />
            </div>
            <div className="relative grid grid-cols-2 gap-3 mt-auto">
              <div className="rounded-2xl bg-mint-soft px-3 py-3">
                <div className="text-[10.5px] text-mint-deep uppercase tracking-wider font-bold mb-1">
                  Seri
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-[24px] tnum text-ink">
                    {ilerleme.streak}
                  </span>
                  <span className="text-[12px] text-ink-mute">gün</span>
                  {ilerleme.streak > 0 && <span className="live-dot ml-auto" />}
                </div>
              </div>
              <div className="rounded-2xl bg-peach-soft px-3 py-3">
                <div className="text-[10.5px] text-peach-deep uppercase tracking-wider font-bold mb-1">
                  Puan
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-[24px] tnum text-ink">
                    {ilerleme.puan}
                  </span>
                  <Icon name="Trophy" size={12} className="text-premium-deep ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yan görevler */}
      {(gununSoru || yanlisSoru) && (
        <div className={`grid grid-cols-1 ${gununSoru && yanlisSoru ? 'md:grid-cols-2' : ''} gap-4 mb-4 rise-3`}>
          {gununSoru && (
            <button
              onClick={() => nav(`/problemler/${gununSoru.id}`)}
              className="surface-lift p-6 text-left group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 blob-peach w-[160px] h-[160px] opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip chip-premium">
                    <Icon name="Calendar" size={11} />
                    Günün Sorusu
                  </span>
                  {gununCozulduMu && (
                    <span className="chip chip-success">
                      <Icon name="Check" size={11} />
                      Çözüldü
                    </span>
                  )}
                </div>
                <Thiings name={gununSoru.uniteIcon} size={48} />
              </div>
              <h3 className="relative font-display text-[22px] leading-[1.05] tracking-tight font-bold text-ink mb-2 group-hover:text-mint-deep transition">
                {gununSoru.baslik}
              </h3>
              <p className="relative text-[14px] text-ink-soft line-clamp-2 mb-4">
                {gununSoru.senaryo}
              </p>
              <div className="relative flex items-center justify-between text-[12.5px]">
                <span className="text-ink-mute font-medium">{gununSoru.uniteAd}</span>
                <span className="text-ink font-bold flex items-center gap-1 group-hover:text-mint-deep group-hover:translate-x-0.5 transition">
                  {gununCozulduMu ? 'Tekrar' : 'Çöz'}
                  <Icon name="ArrowRight" size={12} />
                </span>
              </div>
            </button>
          )}
          {yanlisSoru && (
            <button
              onClick={() => nav(`/problemler/${yanlisSoru.id}`)}
              className="surface-lift p-6 text-left group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 blob-mint w-[160px] h-[160px] opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip chip-danger">
                    <Icon name="RotateCcw" size={11} />
                    Tekrarla
                  </span>
                  <span className="chip">× {ilerleme.yanlislar[yanlisSoru.id]}</span>
                </div>
                <Thiings name={yanlisSoru.uniteIcon} size={48} />
              </div>
              <h3 className="relative font-display text-[22px] leading-[1.05] tracking-tight font-bold text-ink mb-2 group-hover:text-mint-deep transition">
                {yanlisSoru.baslik}
              </h3>
              <p className="relative text-[14px] text-ink-soft line-clamp-2 mb-4">
                {yanlisSoru.senaryo}
              </p>
              <div className="relative flex items-center justify-between text-[12.5px]">
                <span className="text-ink-mute font-medium">{yanlisSoru.uniteAd}</span>
                <span className="text-ink font-bold flex items-center gap-1 group-hover:text-mint-deep group-hover:translate-x-0.5 transition">
                  Yeniden
                  <Icon name="ArrowRight" size={12} />
                </span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* İstatistik şeridi */}
      <div className="surface-lift p-6 sm:p-8 mb-4 rise-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="eyebrow eyebrow-mint mb-2">İlerleme</div>
            <div className="huge-number text-[44px] sm:text-[56px] text-ink mb-1">
              {cozulenYuzde}
              <span className="text-[24px] text-ink-mute font-display ml-0.5">%</span>
            </div>
            <div className="text-[12.5px] text-ink-mute">{stat.cozulenSayi} / {stat.toplamSoru} soru</div>
          </div>
          <div>
            <div className="eyebrow eyebrow-peach mb-2">Bugün</div>
            <div className="huge-number text-[44px] sm:text-[56px] text-ink mb-1">{bugunCozulen}</div>
            <div className="text-[12.5px] text-ink-mute">çözülen soru</div>
          </div>
          <div>
            <div className="eyebrow mb-2">Seri</div>
            <div className="huge-number text-[44px] sm:text-[56px] text-ink mb-1 flex items-baseline gap-1.5">
              {ilerleme.streak}
              {ilerleme.streak > 0 && <span className="live-dot self-center" style={{ width: 12, height: 12 }} />}
            </div>
            <div className="text-[12.5px] text-ink-mute">gün üst üste</div>
          </div>
          <div>
            <div className="eyebrow mb-2">Puan</div>
            <div className="huge-number text-[44px] sm:text-[56px] text-ink mb-1">{ilerleme.puan}</div>
            <div className="text-[12.5px] text-ink-mute">toplam</div>
          </div>
        </div>
      </div>

      {/* Sıkıntılı sorular */}
      {yanlisListe.length > 1 && (
        <div className="surface mb-4 rise-5">
          <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold tracking-tight text-ink">
              Sıkıntı yaşadığın sorular
            </h2>
            <button
              onClick={() => nav('/problemler')}
              className="text-[13px] text-ink-soft hover:text-mint-deep transition flex items-center gap-1 font-semibold"
            >
              Hepsi
              <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <div>
            {yanlisListe.map(({ soru, sayi }, i) => (
              <button
                key={soru.id}
                onClick={() => nav(`/problemler/${soru.id}`)}
                className="w-full flex items-center gap-4 px-6 sm:px-8 py-3.5 hover:bg-bg-tint transition text-left group"
              >
                <span className="font-mono tnum text-[12px] text-ink-quiet w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Thiings name={soru.uniteIcon} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[16px] tracking-tight truncate text-ink group-hover:text-mint-deep transition">
                    {soru.baslik}
                  </div>
                  <div className="text-[12px] text-ink-mute font-medium">
                    {soru.uniteAd}
                  </div>
                </div>
                <span className="chip chip-danger">× {sayi}</span>
                <Icon name="ChevronRight" size={14} className="text-ink-quiet group-hover:text-mint-deep transition" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hızlı navigasyon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rise-5">
        {[
          { yol: '/uniteler', baslik: 'Üniteler', alt: 'Konu konu pratik', icon: 'LayoutGrid', renk: 'mint' },
          { yol: '/problemler', baslik: 'Tüm Sorular', alt: 'Filtrele, ara', icon: 'ListChecks', renk: 'peach' },
          { yol: '/profil', baslik: 'Profil', alt: 'Rozet · İstatistik', icon: 'User', renk: 'jade' },
        ].map((l) => (
          <button
            key={l.yol}
            onClick={() => nav(l.yol)}
            className="surface-lift p-5 text-left group flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  l.renk === 'mint'
                    ? 'var(--mint-soft)'
                    : l.renk === 'peach'
                      ? 'var(--peach-soft)'
                      : 'var(--jade-soft)',
                color:
                  l.renk === 'mint'
                    ? 'var(--mint-deep)'
                    : l.renk === 'peach'
                      ? 'var(--peach-deep)'
                      : 'var(--jade)',
              }}
            >
              <Icon name={l.icon} size={20} />
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-[17px] tracking-tight text-ink group-hover:text-mint-deep transition">
                {l.baslik}
              </div>
              <div className="text-[12.5px] text-ink-mute mt-0.5">{l.alt}</div>
            </div>
            <Icon name="ArrowRight" size={16} className="text-ink-quiet group-hover:text-mint-deep group-hover:translate-x-0.5 transition" />
          </button>
        ))}
      </div>
    </main>
  );
};

/* ----------------------------------------------------------------------
   Anonim ana sayfa — qvery yapısı uyarlaması
---------------------------------------------------------------------- */

const OZELLIKLER = [
  {
    icon: 'calculator',
    eyebrow: 'Senaryolar',
    baslik: 'Gerçek hayat işlemleri.',
    aciklama:
      'Ders kitabındaki yapmacık örnekler değil. Peşin mal satışı, KDV mahsubu, amortisman, maaş tahakkuku — işletmelerde gerçekten karşına çıkacak işlemler.',
    mockup: 'senaryo' as const,
    blob: 'mint' as const,
  },
  {
    icon: 'rocket',
    eyebrow: 'Anlık doğrulama',
    baslik: 'Yanlışı görmeden geçemezsin.',
    aciklama:
      'Yanlış satırlar kırmızı, doğrular yeşil. Her soruda ipucu, resmi çözüm, detaylı açıklama. Yapay zekâ asistanı sıkıştığında yanında.',
    mockup: 'kontrol' as const,
    blob: 'peach' as const,
  },
  {
    icon: 'chart',
    eyebrow: 'Takip',
    baslik: 'İlerlemen ölçülebilir.',
    aciklama:
      'Hangi üniteyi bitirdin, hangi konularda zayıfsın, kaç gündür üst üste çalışıyorsun — hepsi panelde. Rozetler ve seri puanlarıyla motivasyon hep taze.',
    mockup: 'istatistik' as const,
    blob: 'mint' as const,
  },
  {
    icon: 'trophy',
    eyebrow: 'Zorluk',
    baslik: 'Üç seviye, doğru ritim.',
    aciklama:
      'Temel kayıtlardan başla, karmaşık işlemlere yürü. Kolay, orta ve zor soru dağılımı sayesinde hem temel pekişir hem de sınav tipi sorulara hazırlanırsın.',
    mockup: 'zorluk' as const,
    blob: 'peach' as const,
  },
];

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

  return (
    <main>
      {/* ===========================================================
          HERO — qvery: sol metin + sağ illüstrasyon
      =========================================================== */}
      <section className="relative px-3 sm:px-5 pt-8 sm:pt-12 pb-16 sm:pb-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Sol: Metin */}
            <div className="lg:col-span-6 relative z-10">
              <div className="rise">
                <span className="eyebrow eyebrow-mint inline-flex items-center gap-2 mb-6">
                  <span className="live-dot" />
                  Ücretsiz · {tumSorular.length} soru hazır
                </span>
              </div>
              <h1 className="font-display font-bold tracking-[-0.04em] leading-[0.92] text-ink rise-2"
                  style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>
                Yevmiye kaydını
                <br />
                <span className="marker">çözmeyi</span>{' '}
                <span className="text-ink">öğren.</span>
              </h1>
              <p className="text-[17px] sm:text-[19px] text-ink-soft leading-relaxed max-w-xl mt-7 rise-3">
                MuhasebeLab, Tek Düzen Hesap Planı'nı senaryo bazlı
                problemlerle pratiğe döker. Senaryoyu okur, defterine işler,
                anında doğrularsın. Kayıtsız başla — kaydolmak istersen
                otuz saniye sürer.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-10 rise-4">
                <button onClick={() => nav('/problemler')} className="btn btn-primary btn-lg">
                  Hemen Çözmeye Başla
                </button>
                <button onClick={() => nav('/giris')} className="btn-link inline-flex items-center gap-1.5 group">
                  Hesap Oluştur
                  <Icon name="ChevronRight" size={14} className="group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>

            {/* Sağ: Thiings vignette */}
            <div className="lg:col-span-6 relative rise-3">
              <HeroVignette />
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
          ÇARPICI ALINTI — qvery'nin "50% of search traffic" bölümü
      =========================================================== */}
      <section className="relative px-3 sm:px-5 py-16 sm:py-24">
        <div className="max-w-[980px] mx-auto relative">
          <span className="quote-mark absolute -left-4 -top-12 text-[180px] opacity-40 select-none rotate-[-6deg] pointer-events-none">
            "
          </span>
          <span className="quote-mark quote-mark-peach absolute -right-4 bottom-0 text-[160px] opacity-40 select-none rotate-[6deg] pointer-events-none">
            "
          </span>

          <h2 className="text-center font-display font-bold tracking-[-0.03em] leading-[1.05] text-ink"
              style={{ fontSize: 'clamp(28px, 4.2vw, 56px)' }}>
            "Muhasebe ezberlenecek bir konu değil — bir{' '}
            <span className="marker marker-peach">meslek</span>. Yapılarak öğrenilir."
          </h2>
          <p className="text-center mt-6 text-[15px] text-ink-mute font-medium">
            Türkiye'deki muhasebe akademisinin ortak hissi
          </p>

          {/* Avatar testimonial card */}
          <div className="mt-12 max-w-2xl mx-auto surface p-6 sm:p-7 relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-mint flex items-center justify-center flex-shrink-0">
                <Thiings name="calculator" size={48} />
              </div>
              <div>
                <div className="font-display font-bold text-[16px] text-ink">MuhasebeLab Editörü</div>
                <div className="text-[12.5px] text-ink-mute">@muhasebelab</div>
              </div>
            </div>
            <p className="text-[15.5px] text-ink-soft leading-relaxed">
              Bunu küçümsediğimizi söyleyemem. Yevmiye defteri tutmadan muhasebeciliği
              öğretmek, futbol sahası görmeden taktik anlatmak gibi. Bu yüzden burada
              senaryolar gerçek, geri bildirim anlık.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================================================
          BUGÜNÜN SORUSU — kompakt featured card
      =========================================================== */}
      {gununSoru && (
        <section className="px-3 sm:px-5 pb-16">
          <div className="max-w-[1320px] mx-auto">
            <div className="surface-lift p-7 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-7 items-center relative overflow-hidden">
              <div className="blob-mint w-[300px] h-[300px] -right-10 -top-10 blob-drift opacity-50" />

              <div className="md:col-span-8 relative">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="chip chip-premium">
                    <Icon name="Calendar" size={11} />
                    Bugünün Sorusu
                  </span>
                  <ZorlukChip zorluk={gununSoru.zorluk} />
                  <span className="chip chip-mint">{gununSoru.uniteAd}</span>
                </div>
                <h2 className="font-display text-[28px] sm:text-[40px] md:text-[48px] leading-[0.98] tracking-[-0.03em] font-bold text-ink mb-3">
                  {gununSoru.baslik}
                </h2>
                <p className="text-[15.5px] sm:text-[16.5px] text-ink-soft leading-relaxed max-w-2xl">
                  {gununSoru.senaryo}
                </p>
              </div>
              <div className="md:col-span-4 relative flex flex-col gap-3 md:items-end">
                <Thiings name={gununSoru.uniteIcon} size={132} />
                <button
                  onClick={() => nav(`/problemler/${gununSoru.id}`)}
                  className="btn btn-primary btn-lg w-full md:w-auto"
                >
                  Bu Soruyu Çöz
                  <Icon name="ArrowRight" size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===========================================================
          ÖZELLİKLER — qvery: alternating illustration + text
      =========================================================== */}
      <section className="px-3 sm:px-5 py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <span className="eyebrow eyebrow-peach mb-3 inline-block">Nasıl çalışır</span>
            <h2 className="font-display font-bold tracking-[-0.035em] leading-[0.96] text-ink mt-3 max-w-3xl mx-auto"
                style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
              Pratik yapmadan
              <br />
              <span className="marker">muhasebeci</span> olunmaz.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-ink-soft max-w-xl mx-auto mt-6 leading-relaxed">
              Ders kitabını kapatıp yevmiye defterine geçtiğin an, asıl öğrenme başlar.
            </p>
          </div>

          <div className="space-y-20 sm:space-y-28">
            {OZELLIKLER.map((o, i) => {
              const sagdaIllustrasyon = i % 2 === 0;
              return (
                <div
                  key={i}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
                >
                  {/* İllüstrasyon */}
                  <div className={`relative ${sagdaIllustrasyon ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div
                      className={`absolute inset-0 rounded-[40px] ${
                        o.blob === 'mint' ? 'bg-mint-soft' : 'bg-peach-soft'
                      }`}
                      style={{ transform: 'rotate(-2deg)' }}
                    />
                    <div className="relative surface-lift overflow-hidden">
                      <div className="px-5 py-3 border-b border-line bg-surface-2 flex items-center justify-between">
                        <span className="font-mono text-[11.5px] text-ink-mute">muhasebelab.app</span>
                        <span className="font-mono text-[10.5px] text-ink-quiet tracking-wider">
                          {String(i + 1).padStart(2, '0')} / {String(OZELLIKLER.length).padStart(2, '0')}
                        </span>
                      </div>
                      <OzellikMockup tip={o.mockup} />
                    </div>
                  </div>

                  {/* Metin */}
                  <div className={`${sagdaIllustrasyon ? 'lg:order-1' : 'lg:order-2'}`}>
                    <span className={`eyebrow ${o.blob === 'mint' ? 'eyebrow-mint' : 'eyebrow-peach'} mb-4 inline-block`}>
                      {o.eyebrow}
                    </span>
                    <h3 className="font-display text-[32px] sm:text-[44px] md:text-[56px] leading-[0.96] tracking-[-0.035em] font-bold text-ink mb-5">
                      {o.baslik}
                    </h3>
                    <p className="text-[16px] sm:text-[17px] text-ink-soft leading-relaxed max-w-xl">
                      {o.aciklama}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <Thiings name={o.icon} size={64} />
                      <div className="dotted-line flex-1 max-w-[120px]" />
                      <span className="font-mono text-[12px] text-ink-mute tnum">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================================================
          STATS BANNER
      =========================================================== */}
      <section className="px-3 sm:px-5 py-16">
        <div className="max-w-[1320px] mx-auto">
          <div className="surface-lift p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
            <div className="blob-mint w-[300px] h-[300px] -left-20 -top-20 blob-drift opacity-50" />
            <div className="blob-peach w-[260px] h-[260px] -right-16 -bottom-16 blob-drift-2 opacity-50" />

            {[
              { sayi: tumSorular.length.toString(), etiket: 'Hazır soru', alt: 'gerçek senaryolarla' },
              { sayi: uniteler.length.toString(), etiket: 'Konu ünitesi', alt: 'kasadan kambiyoya' },
              { sayi: '₺0', etiket: 'Başlangıç', alt: 'üyelik isteğe bağlı' },
            ].map((s, i) => (
              <div key={i} className="relative text-center md:text-left">
                <div className="huge-number text-[72px] sm:text-[88px] text-ink mb-2 leading-[0.85]">
                  {s.sayi}
                </div>
                <div className="text-[15px] font-bold text-ink mb-1">{s.etiket}</div>
                <div className="text-[13px] text-ink-mute italic">{s.alt}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
          PREMIUM
      =========================================================== */}
      <section className="px-3 sm:px-5 py-16">
        <div className="max-w-[1320px] mx-auto">
          <div className="surface-lift p-8 sm:p-12 md:p-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-center relative overflow-hidden">
            <div className="absolute -right-10 -top-20 opacity-20 pointer-events-none">
              <Thiings name="trophy" size={300} />
            </div>
            <div className="blob-peach w-[400px] h-[400px] -left-32 -bottom-32 opacity-40" />

            <div className="md:col-span-7 relative">
              <div className="flex items-center gap-2 mb-5">
                <span className="chip chip-premium">
                  <Icon name="Sparkles" size={11} />
                  Premium
                </span>
                <span className="chip chip-jade">
                  <span className="live-dot" />
                  İlk 100'e ücretsiz yıl
                </span>
              </div>
              <h2 className="font-display font-bold tracking-[-0.035em] leading-[0.95] mb-6 text-ink"
                  style={{ fontSize: 'clamp(36px, 5.5vw, 64px)' }}>
                Yapay zekâ <span className="marker marker-peach">yanında</span> çalışır.
              </h2>
              <p className="text-[16px] sm:text-[17px] leading-relaxed max-w-xl mb-8 text-ink-soft">
                Yanlış cevap analizi, soru içi AI asistanı, hesap kodu otomatik
                tamamlama, sınırsız çalışma. Premium ile gelir; ilk yüz
                kullanıcıya bir yıl bedava.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => nav('/premium')} className="btn btn-primary btn-lg">
                  Premium'u Keşfet
                  <Icon name="ArrowRight" size={15} />
                </button>
                <button onClick={() => nav('/problemler')} className="btn btn-soft btn-lg">
                  Önce Ücretsiz Dene
                </button>
              </div>
            </div>

            <div className="md:col-span-5 relative">
              <div className="surface p-6 mb-3 relative">
                <div className="text-[11px] uppercase tracking-wider font-bold text-ink-mute mb-2">Aylık</div>
                <div className="flex items-baseline gap-1">
                  <span className="huge-number text-[44px] text-ink">
                    {aylikPlan ? aylikPlan.tutar.toFixed(0) : 99}
                  </span>
                  <span className="font-display font-bold text-[22px] text-ink-mute">₺</span>
                  <span className="text-[12px] text-ink-mute ml-2">/ ay</span>
                </div>
              </div>

              <div className="surface p-6 relative ring-2 ring-mint">
                <div className="absolute -top-2 right-4 chip chip-mint shadow-md">
                  En avantajlı
                </div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-mint-deep mb-2">
                  Dönemlik {donemlikPlan && `(${donemlikPlan.ay_sayisi} ay)`}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="huge-number text-[44px] text-ink">
                    {donemlikPlan ? donemlikPlan.tutar.toFixed(0) : 249}
                  </span>
                  <span className="font-display font-bold text-[22px] text-mint-deep">₺</span>
                </div>
              </div>

              <p className="text-[12.5px] text-ink-mute mt-4 leading-relaxed text-center md:text-left">
                Vergiler dahil · iyzico ile güvenli ödeme · dilediğin zaman iptal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
          KAPANIŞ
      =========================================================== */}
      <section className="px-3 sm:px-5 pb-16 sm:pb-24 pt-8">
        <div className="max-w-[900px] mx-auto text-center relative">
          <div className="flex justify-center mb-6">
            <div className="thiings-float">
              <Thiings name="rocket" size={88} />
            </div>
          </div>
          <h2 className="font-display font-bold tracking-[-0.035em] leading-[0.95] text-ink mt-2 mb-6"
              style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
            Otuz saniye, bir hesap,{' '}
            <span className="marker">bir bütün dönem</span>.
          </h2>
          <p className="text-[16px] sm:text-[18px] text-ink-soft max-w-xl mx-auto leading-relaxed mb-10">
            Üye olmadan başlayabilirsin. İlerlemeni kaydetmek istersen
            otuz saniyelik kayıt yeterli — bir kullanıcı adı, bir şifre.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => nav('/giris')} className="btn btn-primary btn-lg">
              <Icon name="UserPlus" size={16} />
              Hesap Oluştur
            </button>
            <button onClick={() => nav('/problemler')} className="btn-link inline-flex items-center gap-1.5 group">
              Önce Soruları Gör
              <Icon name="ChevronRight" size={14} className="group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
