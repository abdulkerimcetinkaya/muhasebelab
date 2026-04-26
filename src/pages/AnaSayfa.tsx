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
   Yardımcı bileşenler
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
      <main className="max-w-[1320px] mx-auto px-5 py-32 flex items-center justify-center">
        <Icon name="Loader2" size={20} className="animate-spin text-ink-mute" />
      </main>
    );
  }

  if (user) return <KullaniciPaneli ilerleme={ilerleme} stat={stat} />;
  return <AnonimAnaSayfa />;
};

/* ----------------------------------------------------------------------
   Kullanıcı paneli — bento dashboard
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
      <section className="mb-8 rise">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="eyebrow-primary">{selamlama}</span>
          <span className="live-dot" />
        </div>
        <h1 className="font-display text-[44px] sm:text-[68px] md:text-[88px] leading-[0.9] font-bold tracking-[-0.035em] text-ink">
          {ad},
          <span className="text-ink-mute"> bugün ne çözüyoruz?</span>
        </h1>
      </section>

      {/* Bento grid — top tier */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mb-4 rise-2">
        {/* Devam edilecek soru — büyük kart */}
        <div className="md:col-span-8">
          {aktifUnite && devamSoru ? (
            <button
              onClick={() => nav(`/problemler/${devamSoru.id}`)}
              className="w-full text-left surface-lift group p-7 sm:p-8 relative overflow-hidden h-full flex flex-col min-h-[280px]"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 80% 60% at 100% 100%, var(--primary-tint), transparent 70%)',
                }}
              />
              <div className="relative flex items-start justify-between gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="chip-primary chip">
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
                <div className="hidden sm:flex flex-shrink-0">
                  <Thiings name={aktifUnite.unite.thiingsIcon} size={72} />
                </div>
              </div>
              <div className="relative mt-auto pt-5 border-t border-line flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[13px] text-ink-soft">
                  <span className="font-medium">{aktifUnite.unite.ad}</span>
                  <span className="text-ink-quiet">·</span>
                  <span className="font-mono tnum text-ink">
                    {aktifUnite.cozulen}/{aktifUnite.toplam}
                  </span>
                  <div className="ml-2 flex-1 h-1 bg-line rounded-full overflow-hidden max-w-[120px]">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(aktifUnite.cozulen / aktifUnite.toplam) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink group-hover:text-primary transition">
                  Çöz
                  <Icon name="ArrowRight" size={14} className="group-hover:translate-x-0.5 transition" />
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

        {/* Bugünkü hedef — orta kart */}
        <div className="md:col-span-4">
          <div className="surface-lift p-7 h-full flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
              <span className="eyebrow">Bugünkü Hedef</span>
              {hedefTamam && <span className="chip chip-success">Tamamlandı ✓</span>}
            </div>

            <div className="flex items-baseline gap-1 mb-1">
              <span className="huge-number text-[80px] sm:text-[96px] text-ink">
                {bugunCozulen}
              </span>
              <span className="font-display font-bold text-[28px] text-ink-quiet ml-1 tracking-tight">
                /{gunlukHedef}
              </span>
            </div>
            <p className="text-[14px] text-ink-soft mb-5 leading-snug">
              {hedefTamam
                ? 'Hedefi geçtin. Bonus puanlar bekliyor.'
                : `${gunlukHedef - bugunCozulen} soru kaldı.`}
            </p>

            {/* Progress bar */}
            <div className="h-2 bg-line rounded-full overflow-hidden mb-6">
              <div
                className="h-full transition-all duration-700 rounded-full"
                style={{
                  width: `${hedefYuzde}%`,
                  background: hedefTamam
                    ? 'linear-gradient(90deg, var(--energy-deep), var(--energy))'
                    : 'linear-gradient(90deg, var(--primary), var(--primary-deep))',
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="rounded-2xl bg-surface-2 px-3 py-3 border border-line-soft">
                <div className="text-[10.5px] text-ink-mute uppercase tracking-wider font-semibold mb-1">Seri</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-[24px] tnum text-ink">{ilerleme.streak}</span>
                  <span className="text-[12px] text-ink-mute">gün</span>
                  {ilerleme.streak > 0 && <span className="live-dot ml-auto" />}
                </div>
              </div>
              <div className="rounded-2xl bg-surface-2 px-3 py-3 border border-line-soft">
                <div className="text-[10.5px] text-ink-mute uppercase tracking-wider font-semibold mb-1">Puan</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-[24px] tnum text-ink">{ilerleme.puan}</span>
                  <Icon name="Trophy" size={12} className="text-premium ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yan görevler — 2x */}
      {(gununSoru || yanlisSoru) && (
        <div className={`grid grid-cols-1 ${gununSoru && yanlisSoru ? 'md:grid-cols-2' : ''} gap-3 sm:gap-4 mb-4 rise-3`}>
          {gununSoru && (
            <button
              onClick={() => nav(`/problemler/${gununSoru.id}`)}
              className="surface-lift p-6 text-left group"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
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
                <Thiings name={gununSoru.uniteIcon} size={40} />
              </div>
              <h3 className="font-display text-[22px] leading-[1.05] tracking-tight font-bold text-ink mb-2 group-hover:text-primary transition">
                {gununSoru.baslik}
              </h3>
              <p className="text-[14px] text-ink-soft line-clamp-2 mb-4">
                {gununSoru.senaryo}
              </p>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-ink-mute font-medium">{gununSoru.uniteAd}</span>
                <span className="text-ink font-semibold flex items-center gap-1 group-hover:text-primary group-hover:translate-x-0.5 transition">
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
                    <Icon name="RotateCcw" size={11} />
                    Tekrarla
                  </span>
                  <span className="chip">× {ilerleme.yanlislar[yanlisSoru.id]}</span>
                </div>
                <Thiings name={yanlisSoru.uniteIcon} size={40} />
              </div>
              <h3 className="font-display text-[22px] leading-[1.05] tracking-tight font-bold text-ink mb-2 group-hover:text-primary transition">
                {yanlisSoru.baslik}
              </h3>
              <p className="text-[14px] text-ink-soft line-clamp-2 mb-4">
                {yanlisSoru.senaryo}
              </p>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-ink-mute font-medium">{yanlisSoru.uniteAd}</span>
                <span className="text-ink font-semibold flex items-center gap-1 group-hover:text-primary group-hover:translate-x-0.5 transition">
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
            <div className="eyebrow mb-2">İlerleme</div>
            <div className="huge-number text-[44px] sm:text-[56px] text-ink mb-1">{cozulenYuzde}<span className="text-[24px] text-ink-mute font-display ml-0.5">%</span></div>
            <div className="text-[12.5px] text-ink-mute">{stat.cozulenSayi} / {stat.toplamSoru} soru</div>
          </div>
          <div>
            <div className="eyebrow mb-2">Bugün</div>
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

      {/* Sıkıntı yaşadığın sorular */}
      {yanlisListe.length > 1 && (
        <div className="surface mb-4 rise-5">
          <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold tracking-tight text-ink">Sıkıntı yaşadığın sorular</h2>
            <button
              onClick={() => nav('/problemler')}
              className="text-[13px] text-ink-soft hover:text-primary transition flex items-center gap-1 font-medium"
            >
              Hepsi
              <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <div className="border-t border-line">
            {yanlisListe.map(({ soru, sayi }, i) => (
              <button
                key={soru.id}
                onClick={() => nav(`/problemler/${soru.id}`)}
                className={`w-full flex items-center gap-4 px-6 sm:px-8 py-3.5 hover:bg-surface-2 transition text-left group ${
                  i < yanlisListe.length - 1 ? 'border-b border-line-soft' : ''
                }`}
              >
                <span className="font-mono tnum text-[12px] text-ink-quiet w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Thiings name={soru.uniteIcon} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[16px] tracking-tight truncate text-ink group-hover:text-primary transition">
                    {soru.baslik}
                  </div>
                  <div className="text-[12px] text-ink-mute font-medium">
                    {soru.uniteAd}
                  </div>
                </div>
                <span className="chip chip-danger">× {sayi}</span>
                <Icon name="ChevronRight" size={14} className="text-ink-quiet group-hover:text-primary transition" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hızlı navigasyon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 rise-5">
        {[
          { yol: '/uniteler', baslik: 'Üniteler', alt: 'Konu konu pratik', icon: 'LayoutGrid', renk: 'primary' },
          { yol: '/problemler', baslik: 'Tüm Sorular', alt: 'Filtrele, ara', icon: 'ListChecks', renk: 'energy' },
          { yol: '/profil', baslik: 'Profil', alt: 'Rozet · İstatistik', icon: 'User', renk: 'premium' },
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
                  l.renk === 'primary'
                    ? 'var(--primary-soft)'
                    : l.renk === 'energy'
                      ? 'var(--energy-soft)'
                      : 'var(--premium-soft)',
                color:
                  l.renk === 'primary'
                    ? 'var(--primary)'
                    : l.renk === 'energy'
                      ? 'var(--energy-deep)'
                      : 'var(--premium-deep)',
              }}
            >
              <Icon name={l.icon} size={20} />
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-[17px] tracking-tight text-ink group-hover:text-primary transition">
                {l.baslik}
              </div>
              <div className="text-[12.5px] text-ink-mute mt-0.5">{l.alt}</div>
            </div>
            <Icon name="ArrowRight" size={16} className="text-ink-quiet group-hover:text-primary group-hover:translate-x-0.5 transition" />
          </button>
        ))}
      </div>
    </main>
  );
};

/* ----------------------------------------------------------------------
   Anonim ana sayfa — fintech landing
---------------------------------------------------------------------- */

const OZELLIKLER = [
  {
    icon: 'calculator',
    no: '01',
    eyebrow: 'Senaryo',
    baslik: 'Gerçek hayat işlemleri.',
    aciklama:
      'Ders kitaplarındaki yapmacık örnekler değil. Peşin mal satışı, KDV mahsubu, amortisman ayırma — işletmelerde gerçekten karşına çıkacak işlemler.',
    mockup: 'senaryo' as const,
    renk: 'primary',
  },
  {
    icon: 'rocket',
    no: '02',
    eyebrow: 'Anlık geri bildirim',
    baslik: 'Yanlışı görmeden geçemezsin.',
    aciklama:
      'Yanlış satırlar kırmızı işaretlenir, doğrular yeşil. Her soruda ipucu, resmi çözüm ve detaylı açıklama. AI asistan da yanında.',
    mockup: 'kontrol' as const,
    renk: 'energy',
  },
  {
    icon: 'chart',
    no: '03',
    eyebrow: 'Takip',
    baslik: 'İlerlemen ölçülebilir.',
    aciklama:
      'Hangi üniteyi bitirdin, hangi konularda zayıfsın, kaç gündür üst üste çalışıyorsun — hepsi panelde. Rozetler ve seri puanlarıyla motivasyon hep taze.',
    mockup: 'istatistik' as const,
    renk: 'premium',
  },
  {
    icon: 'trophy',
    no: '04',
    eyebrow: 'Zorluk',
    baslik: 'Üç seviye, doğru ritim.',
    aciklama:
      'Temel kayıtlardan başla, karmaşık işlemlere yürü. Kolay, orta ve zor soru dağılımı sayesinde hem temel pekişir hem de sınav tipi sorulara hazırlanırsın.',
    mockup: 'zorluk' as const,
    renk: 'success',
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
          HERO
      =========================================================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg pointer-events-none">
          <div className="w-full h-full" />
        </div>
        <div className="relative max-w-[1320px] mx-auto px-3 sm:px-5 pt-12 sm:pt-16 pb-12 sm:pb-20">
          {/* Üst rozet */}
          <div className="flex justify-center mb-7 rise">
            <span className="chip chip-energy text-[12px] py-1.5 px-3.5">
              <span className="live-dot" />
              {tumSorular.length} soru · 11 ünite · şu an aktif
            </span>
          </div>

          {/* Ana başlık */}
          <h1 className="text-center font-display font-bold tracking-[-0.04em] leading-[0.95] text-ink rise-2"
              style={{ fontSize: 'clamp(48px, 9vw, 132px)' }}>
            Yevmiye kaydını
            <br />
            <span className="relative inline-block">
              <span className="ink-underline" style={{
                backgroundImage: 'linear-gradient(transparent 78%, var(--energy) 78%, var(--energy) 96%, transparent 96%)',
              }}>çözmenin</span>
            </span>
            <br />
            <span className="text-ink-mute">en hızlı yolu.</span>
          </h1>

          {/* Alt metin */}
          <p className="text-center text-[16.5px] sm:text-[19px] text-ink-soft max-w-2xl mx-auto mt-8 leading-relaxed rise-3">
            Tek Düzen Hesap Planı'nı senaryo bazlı problemlerle pratiğe dök.
            Senaryoyu okur, defterine işler, anında doğrularsın.
            Kayıtsız başla, otuz saniyede hesap aç.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 justify-center mt-10 rise-4">
            <button onClick={() => nav('/problemler')} className="btn btn-primary btn-lg">
              <Icon name="Zap" size={16} />
              Hemen Çözmeye Başla
            </button>
            <button onClick={() => nav('/giris')} className="btn btn-ghost btn-lg">
              Hesap Oluştur
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>

          {/* Sosyal kanıt — istatistik şeridi */}
          <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-3 sm:gap-5 max-w-3xl mx-auto rise-5">
            {[
              { sayi: tumSorular.length.toString(), etiket: 'Hazır soru' },
              { sayi: uniteler.length.toString(), etiket: 'Konu ünitesi' },
              { sayi: '₺0', etiket: 'Başlangıç', alt: 'üye olmak isteğe bağlı' },
            ].map((s, i) => (
              <div key={i} className="surface px-5 py-6 text-center">
                <div className="huge-number text-[40px] sm:text-[56px] text-ink mb-1">
                  {s.sayi}
                </div>
                <div className="text-[12px] text-ink-mute font-medium uppercase tracking-wider">
                  {s.etiket}
                </div>
                {s.alt && (
                  <div className="text-[11px] text-ink-quiet mt-0.5 italic">{s.alt}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
          BUGÜNÜN SORUSU
      =========================================================== */}
      {gununSoru && (
        <section className="px-3 sm:px-5 pb-12 sm:pb-16">
          <div className="max-w-[1320px] mx-auto">
            <div className="surface-lift p-7 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-7 items-center">
              <div className="md:col-span-8">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="chip chip-premium">
                    <Icon name="Calendar" size={11} />
                    Bugünün Sorusu
                  </span>
                  <ZorlukChip zorluk={gununSoru.zorluk} />
                  <span className="chip">{gununSoru.uniteAd}</span>
                </div>
                <h2 className="font-display text-[28px] sm:text-[40px] md:text-[48px] leading-[0.98] tracking-[-0.03em] font-bold text-ink mb-3">
                  {gununSoru.baslik}
                </h2>
                <p className="text-[15.5px] sm:text-[16.5px] text-ink-soft leading-relaxed max-w-2xl">
                  {gununSoru.senaryo}
                </p>
              </div>
              <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
                <Thiings name={gununSoru.uniteIcon} size={120} />
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
          NASIL ÇALIŞIR — bento yerleşim
      =========================================================== */}
      <section className="px-3 sm:px-5 py-12 sm:py-20">
        <div className="max-w-[1320px] mx-auto">
          {/* Bölüm başlığı */}
          <div className="text-center mb-12 sm:mb-16">
            <span className="eyebrow-primary mb-3 inline-block">Nasıl çalışır</span>
            <h2 className="font-display text-[40px] sm:text-[60px] md:text-[80px] leading-[0.95] tracking-[-0.035em] font-bold text-ink mt-3 max-w-3xl mx-auto">
              Pratik yapmadan{' '}
              <span className="ink-underline">muhasebeci</span>{' '}
              olunmaz.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-ink-soft max-w-xl mx-auto mt-5 leading-relaxed">
              Ders kitabını kapatıp yevmiye defterine geçtiğin an, asıl öğrenme başlar.
            </p>
          </div>

          {/* 4 madde — alternating layout */}
          <div className="space-y-4 sm:space-y-6">
            {OZELLIKLER.map((o, i) => (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch"
              >
                <div className={`lg:col-span-7 surface-lift overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-surface-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11.5px] tnum text-ink-mute">muhasebelab.app</span>
                    </div>
                    <span className="font-mono text-[10.5px] text-ink-quiet tracking-wider">
                      FIG. {o.no}
                    </span>
                  </div>
                  <OzellikMockup tip={o.mockup} />
                </div>
                <div className={`lg:col-span-5 surface p-7 sm:p-9 flex flex-col justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="flex items-baseline gap-4 mb-5">
                    <span
                      className="huge-number text-[80px] sm:text-[112px]"
                      style={{
                        color:
                          o.renk === 'primary'
                            ? 'var(--primary)'
                            : o.renk === 'energy'
                              ? 'var(--energy-deep)'
                              : o.renk === 'premium'
                                ? 'var(--premium)'
                                : 'var(--success)',
                        opacity: 0.9,
                      }}
                    >
                      {o.no}
                    </span>
                    <Thiings name={o.icon} size={56} />
                  </div>
                  <span className="eyebrow mb-3">{o.eyebrow}</span>
                  <h3 className="font-display text-[28px] sm:text-[36px] leading-[1.0] tracking-[-0.03em] font-bold text-ink mb-4">
                    {o.baslik}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-ink-soft leading-relaxed">
                    {o.aciklama}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
          PREMIUM
      =========================================================== */}
      <section className="px-3 sm:px-5 py-12 sm:py-16">
        <div className="max-w-[1320px] mx-auto">
          <div
            className="rounded-[28px] p-7 sm:p-12 md:p-16 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0F1115 0%, #1A1822 100%)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Gradient mesh decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 90% 10%, rgba(245, 158, 11, 0.35), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 100%, rgba(190, 242, 100, 0.2), transparent 60%)',
              }}
            />
            <div className="absolute -right-20 -top-20 opacity-25 pointer-events-none">
              <Thiings name="trophy" size={280} />
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="chip text-[11px]"
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#FBBF24',
                      borderColor: 'transparent',
                    }}
                  >
                    <Icon name="Sparkles" size={11} />
                    Premium
                  </span>
                  <span
                    className="chip text-[11px]"
                    style={{
                      background: 'rgba(190, 242, 100, 0.15)',
                      color: '#D9F99D',
                      borderColor: 'transparent',
                      fontWeight: 700,
                    }}
                  >
                    İlk 100'e ücretsiz yıl
                  </span>
                </div>
                <h2
                  className="font-display font-bold tracking-[-0.035em] leading-[0.95] mb-6"
                  style={{
                    color: '#F5F4EF',
                    fontSize: 'clamp(36px, 6vw, 72px)',
                  }}
                >
                  Yapay zekâ
                  <br />
                  <span style={{ color: '#FBBF24' }}>yanında çalışır.</span>
                </h2>
                <p
                  className="text-[16px] sm:text-[17px] leading-relaxed max-w-xl mb-8"
                  style={{ color: '#B0B3BC' }}
                >
                  Yanlış cevap analizi, soru içi AI asistanı, hesap kodu otomatik
                  tamamlama, sınırsız çalışma. Premium ile gelir; ilk yüz
                  kullanıcıya bir yıl bedava.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => nav('/premium')}
                    className="btn btn-lg"
                    style={{
                      background: 'var(--energy)',
                      color: '#0F1115',
                      border: '1px solid var(--energy-deep)',
                      fontWeight: 700,
                      boxShadow: '0 12px 28px -8px rgba(190, 242, 100, 0.5)',
                    }}
                  >
                    Premium'u Keşfet
                    <Icon name="ArrowRight" size={15} />
                  </button>
                  <button
                    onClick={() => nav('/problemler')}
                    className="btn btn-lg"
                    style={{
                      background: 'transparent',
                      color: '#F5F4EF',
                      border: '1px solid rgba(245, 244, 239, 0.2)',
                    }}
                  >
                    Önce Ücretsiz Dene
                  </button>
                </div>
              </div>

              {/* Fiyat kartı */}
              <div className="md:col-span-5 md:pl-6">
                <div
                  className="rounded-3xl p-6 backdrop-blur-md h-full flex flex-col gap-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: '#FBBF24' }}>
                    Tarife
                  </div>

                  <div
                    className="rounded-2xl p-5"
                    style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                  >
                    <div className="text-[13px] mb-1" style={{ color: '#B0B3BC' }}>Aylık</div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="huge-number"
                        style={{ color: '#F5F4EF', fontSize: 40 }}
                      >
                        {aylikPlan ? aylikPlan.tutar.toFixed(0) : 99}
                      </span>
                      <span className="font-display font-bold text-[20px]" style={{ color: '#B0B3BC' }}>₺</span>
                      <span className="text-[12px] ml-2" style={{ color: '#6E717A' }}>/ay</span>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-5 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(190, 242, 100, 0.12), rgba(245, 158, 11, 0.08))',
                      border: '1px solid rgba(190, 242, 100, 0.25)',
                    }}
                  >
                    <div className="absolute top-3 right-3">
                      <span
                        className="chip"
                        style={{
                          background: 'var(--energy)',
                          color: '#0F1115',
                          fontWeight: 700,
                          fontSize: 10,
                        }}
                      >
                        En avantajlı
                      </span>
                    </div>
                    <div className="text-[13px] mb-1" style={{ color: '#D9F99D' }}>
                      Dönemlik {donemlikPlan && `(${donemlikPlan.ay_sayisi} ay)`}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="huge-number"
                        style={{ color: '#F5F4EF', fontSize: 40 }}
                      >
                        {donemlikPlan ? donemlikPlan.tutar.toFixed(0) : 249}
                      </span>
                      <span className="font-display font-bold text-[20px]" style={{ color: '#D9F99D' }}>₺</span>
                    </div>
                  </div>

                  <div className="text-[11.5px] mt-2 leading-relaxed" style={{ color: '#6E717A' }}>
                    Vergiler dahil · iyzico ile güvenli ödeme · dilediğin zaman iptal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
          KAPANIŞ
      =========================================================== */}
      <section className="px-3 sm:px-5 pb-16 sm:pb-24 pt-8">
        <div className="max-w-[900px] mx-auto text-center">
          <span className="eyebrow-primary mb-4 inline-block">Hadi başla</span>
          <h2 className="font-display font-bold tracking-[-0.035em] leading-[0.95] text-ink mt-4 mb-6"
              style={{ fontSize: 'clamp(40px, 7vw, 88px)' }}>
            Otuz saniye, bir hesap,
            <br />
            <span className="ink-underline">bir bütün dönem</span>.
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
            <button onClick={() => nav('/problemler')} className="btn btn-ghost btn-lg">
              Önce Soruları Gör
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
