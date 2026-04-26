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
    <main className="max-w-[1240px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
      {/* Selamlama */}
      <section className="mb-10 rise">
        <div className="flex items-baseline gap-2.5 mb-4">
          <span className="eyebrow">{selamlama}</span>
          <span className="text-ink-quiet">·</span>
          <span className="folio tnum">{new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' })}</span>
        </div>
        <h1 className="font-display text-[56px] sm:text-[80px] md:text-[104px] leading-[0.96] tracking-[-0.025em] text-ink">
          {ad}, <span className="emph text-ink-soft">bugün ne çözüyoruz?</span>
        </h1>
      </section>

      <div className="hairline mb-10" />

      {/* Üst grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12 rise-2">
        <div className="md:col-span-8">
          {aktifUnite && devamSoru ? (
            <button
              onClick={() => nav(`/problemler/${devamSoru.id}`)}
              className="w-full text-left surface-lift group p-7 sm:p-9 h-full flex flex-col min-h-[300px]"
            >
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="folio">№ {henuzCozulmemis ? '01' : aktifUnite.cozulen + 1}</span>
                    <span className="text-ink-quiet">·</span>
                    <span className="eyebrow">{henuzCozulmemis ? 'İlk Soru' : 'Devam Edilecek'}</span>
                    <ZorlukChip zorluk={devamSoru.zorluk} />
                  </div>
                  <h2 className="font-display text-[32px] sm:text-[44px] leading-[1.0] tracking-[-0.025em] text-ink mb-4">
                    {devamSoru.baslik}
                  </h2>
                  <p className="text-[15.5px] text-ink-soft leading-relaxed line-clamp-2 max-w-2xl">
                    {devamSoru.senaryo}
                  </p>
                </div>
                <Thiings name={aktifUnite.unite.thiingsIcon} size={56} />
              </div>
              <div className="hairline mb-5 mt-auto" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[13px] text-ink-soft">
                  <span>{aktifUnite.unite.ad}</span>
                  <span className="text-ink-quiet">·</span>
                  <span className="font-mono tnum text-ink">
                    {aktifUnite.cozulen}<span className="text-ink-quiet">/</span>{aktifUnite.toplam}
                  </span>
                  <div className="ml-1 w-24 h-px bg-line relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-ink"
                      style={{ width: `${(aktifUnite.cozulen / aktifUnite.toplam) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-[13px] text-ink-soft group-hover:text-ink transition flex items-center gap-1.5">
                  Çözmeye başla
                  <Icon name="ArrowRight" size={13} className="group-hover:translate-x-0.5 transition" />
                </span>
              </div>
            </button>
          ) : (
            <div className="surface p-12 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
              <Thiings name="trophy" size={56} />
              <h2 className="font-display text-[32px] tracking-tight mt-6 mb-3 text-ink">
                Tüm soruları çözdün.
              </h2>
              <p className="font-display italic text-[16px] text-ink-soft mb-7 max-w-md">
                Yeni soruları beklerken yanlışlarını tekrar edebilirsin.
              </p>
              <button onClick={() => nav('/problemler')} className="btn btn-primary">
                Tüm Sorular
              </button>
            </div>
          )}
        </div>

        {/* Hedef sidebar */}
        <div className="md:col-span-4">
          <div className="surface-lift p-7 h-full flex flex-col">
            <div className="flex items-baseline justify-between mb-5">
              <span className="eyebrow">Bugünkü Hedef</span>
              {hedefTamam && <span className="chip chip-success">Tamamlandı</span>}
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="huge-number text-[88px] text-ink">{bugunCozulen}</span>
              <span className="font-display italic text-[28px] text-ink-quiet">/{gunlukHedef}</span>
            </div>
            <p className="text-[14px] text-ink-soft mb-6 leading-snug">
              {hedefTamam
                ? 'Hedefi geçtin. Bonus puanlar bekliyor.'
                : `${gunlukHedef - bugunCozulen} soru kaldı.`}
            </p>
            <div className="h-px bg-line relative mb-6">
              <div
                className="absolute inset-y-[-1px] left-0 bg-ink transition-all duration-700"
                style={{ width: `${hedefYuzde}%`, height: 2 }}
              />
            </div>
            <div className="hairline mb-5" />
            <dl className="space-y-3">
              <div className="flex items-baseline justify-between">
                <dt className="eyebrow">Seri</dt>
                <dd className="flex items-baseline gap-1.5">
                  <span className="font-mono tnum text-[15px] text-ink">{ilerleme.streak}</span>
                  <span className="text-[12px] text-ink-mute">gün</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="eyebrow">Toplam Puan</dt>
                <dd className="font-mono tnum text-[15px] text-ink">{ilerleme.puan}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="eyebrow">Çözülen</dt>
                <dd className="font-mono tnum text-[15px] text-ink">
                  {stat.cozulenSayi}<span className="text-ink-quiet">/</span>{stat.toplamSoru}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Yan görevler */}
      {(gununSoru || yanlisSoru) && (
        <>
          <div className="flex items-baseline justify-between mb-5 rise-3">
            <h2 className="font-display text-[24px] tracking-tight text-ink">Yan görevler</h2>
            <button onClick={() => nav('/problemler')} className="btn-link">
              Tüm sorular →
            </button>
          </div>
          <div className={`grid grid-cols-1 ${gununSoru && yanlisSoru ? 'md:grid-cols-2' : ''} gap-6 mb-12`}>
            {gununSoru && (
              <button
                onClick={() => nav(`/problemler/${gununSoru.id}`)}
                className="surface-lift p-7 text-left group"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip chip-premium">
                      <Icon name="Calendar" size={10} />
                      Günün Sorusu
                    </span>
                    {gununCozulduMu && <span className="chip chip-success">Çözüldü</span>}
                  </div>
                  <Thiings name={gununSoru.uniteIcon} size={40} />
                </div>
                <h3 className="font-display text-[26px] leading-[1.05] tracking-tight text-ink mb-3 group-hover:text-ink-soft transition">
                  {gununSoru.baslik}
                </h3>
                <p className="text-[14px] text-ink-soft line-clamp-2 mb-5 leading-relaxed">
                  {gununSoru.senaryo}
                </p>
                <div className="hairline mb-4" />
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-mute">{gununSoru.uniteAd}</span>
                  <span className="text-ink-soft group-hover:text-ink flex items-center gap-1 transition">
                    {gununCozulduMu ? 'Tekrar' : 'Çöz'}
                    <Icon name="ArrowRight" size={12} className="group-hover:translate-x-0.5 transition" />
                  </span>
                </div>
              </button>
            )}
            {yanlisSoru && (
              <button
                onClick={() => nav(`/problemler/${yanlisSoru.id}`)}
                className="surface-lift p-7 text-left group"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip chip-danger">
                      <Icon name="RotateCcw" size={10} />
                      Tekrarla
                    </span>
                    <span className="chip">× {ilerleme.yanlislar[yanlisSoru.id]}</span>
                  </div>
                  <Thiings name={yanlisSoru.uniteIcon} size={40} />
                </div>
                <h3 className="font-display text-[26px] leading-[1.05] tracking-tight text-ink mb-3 group-hover:text-ink-soft transition">
                  {yanlisSoru.baslik}
                </h3>
                <p className="text-[14px] text-ink-soft line-clamp-2 mb-5 leading-relaxed">
                  {yanlisSoru.senaryo}
                </p>
                <div className="hairline mb-4" />
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-mute">{yanlisSoru.uniteAd}</span>
                  <span className="text-ink-soft group-hover:text-ink flex items-center gap-1 transition">
                    Yeniden
                    <Icon name="ArrowRight" size={12} className="group-hover:translate-x-0.5 transition" />
                  </span>
                </div>
              </button>
            )}
          </div>
        </>
      )}

      {/* İstatistik şeridi — bilanço hissi */}
      <div className="surface mb-12 rise-4">
        <div className="px-7 sm:px-9 py-5 border-b border-line flex items-baseline justify-between">
          <h2 className="font-display text-[20px] text-ink tracking-tight">Hesap Özeti</h2>
          <span className="folio">Tab. III</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-line">
          {[
            { label: 'İlerleme', sayi: cozulenYuzde, suffix: '%', alt: `${stat.cozulenSayi}/${stat.toplamSoru}` },
            { label: 'Bugün', sayi: bugunCozulen, suffix: '', alt: 'çözülen' },
            { label: 'Seri', sayi: ilerleme.streak, suffix: '', alt: 'gün' },
            { label: 'Puan', sayi: ilerleme.puan, suffix: '', alt: 'toplam' },
          ].map((s, i) => (
            <div key={i} className="px-7 py-7">
              <div className="eyebrow mb-3">{s.label}</div>
              <div className="huge-number text-[44px] sm:text-[52px] text-ink mb-1.5">
                {s.sayi}
                {s.suffix && <span className="text-[24px] text-ink-quiet font-display italic ml-0.5">{s.suffix}</span>}
              </div>
              <div className="text-[12px] text-ink-mute font-mono">{s.alt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sıkıntılı sorular */}
      {yanlisListe.length > 1 && (
        <div className="surface mb-12 rise-5">
          <div className="px-7 sm:px-9 py-5 border-b border-line flex items-baseline justify-between">
            <h2 className="font-display text-[20px] text-ink tracking-tight">
              Sıkıntı yaşadığın sorular
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
                className="w-full flex items-center gap-5 px-7 sm:px-9 py-4 hover:bg-surface-2 transition text-left group"
              >
                <span className="folio tnum w-6 text-right">{String(i + 1).padStart(2, '0')}</span>
                <Thiings name={soru.uniteIcon} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[18px] tracking-tight truncate text-ink group-hover:text-ink-soft transition">
                    {soru.baslik}
                  </div>
                  <div className="text-[12px] text-ink-mute font-mono uppercase tracking-wider mt-0.5">
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
        <div className="px-7 sm:px-9 py-5 border-b border-line">
          <h2 className="font-display text-[20px] text-ink tracking-tight">Sayfa yönlendirmeleri</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line">
          {[
            { yol: '/uniteler', baslik: 'Üniteler', alt: 'Konu konu pratik', no: 'I' },
            { yol: '/problemler', baslik: 'Tüm Sorular', alt: 'Filtrele, ara', no: 'II' },
            { yol: '/profil', baslik: 'Profil', alt: 'Rozet · İstatistik', no: 'III' },
          ].map((l) => (
            <button
              key={l.yol}
              onClick={() => nav(l.yol)}
              className="text-left p-7 hover:bg-surface-2 transition group flex items-baseline justify-between gap-4"
            >
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="roman text-[15px]">{l.no}.</span>
                  <span className="font-display text-[20px] tracking-tight text-ink group-hover:text-ink-soft transition">
                    {l.baslik}
                  </span>
                </div>
                <div className="text-[12.5px] text-ink-mute font-mono ml-7">{l.alt}</div>
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
   Anonim ana sayfa — elit editorial landing
---------------------------------------------------------------------- */

const OZELLIKLER = [
  {
    icon: 'calculator',
    no: 'I',
    eyebrow: 'Madde I · Senaryolar',
    baslik: 'Gerçek hayat işlemleri.',
    aciklama:
      'Ders kitabındaki yapmacık örnekler değil. Peşin mal satışı, KDV mahsubu, amortisman, maaş tahakkuku — işletmelerde gerçekten karşına çıkacak işlemler.',
    mockup: 'senaryo' as const,
  },
  {
    icon: 'rocket',
    no: 'II',
    eyebrow: 'Madde II · Doğrulama',
    baslik: 'Yanlışı görmeden geçemezsin.',
    aciklama:
      'Yanlış satırlar kırmızı, doğrular yeşil. Her soruda ipucu, resmi çözüm, detaylı açıklama. Yapay zekâ asistanı sıkıştığında yanında.',
    mockup: 'kontrol' as const,
  },
  {
    icon: 'chart',
    no: 'III',
    eyebrow: 'Madde III · Takip',
    baslik: 'İlerlemen ölçülebilir.',
    aciklama:
      'Hangi üniteyi bitirdin, hangi konularda zayıfsın, kaç gündür üst üste çalışıyorsun — hepsi panelde. Rozetler ve seri puanları motivasyonu canlı tutar.',
    mockup: 'istatistik' as const,
  },
  {
    icon: 'trophy',
    no: 'IV',
    eyebrow: 'Madde IV · Ritim',
    baslik: 'Üç seviye, doğru ritim.',
    aciklama:
      'Temel kayıtlardan başla, karmaşık işlemlere yürü. Kolay, orta ve zor soru dağılımı sayesinde hem temel pekişir hem de sınav tipi sorulara hazırlanırsın.',
    mockup: 'zorluk' as const,
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
          HERO — typographic, centered, restraint
      =========================================================== */}
      <section className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32">
        {/* Üst meta */}
        <div className="flex items-baseline justify-between gap-4 mb-12 rise">
          <span className="folio">Editio I — MMXXVI</span>
          <span className="folio">No. 01</span>
        </div>
        <div className="hairline mb-16 rise" />

        {/* Ana başlık */}
        <div className="text-center max-w-[1100px] mx-auto rise-2">
          <h1 className="font-display tracking-[-0.025em] text-ink leading-[0.96]"
              style={{ fontSize: 'clamp(56px, 9vw, 152px)' }}>
            Yevmiye defterini
            <br />
            <span className="emph text-ink-soft">tutmayı öğren</span>
            <span className="text-ink">.</span>
          </h1>
        </div>

        {/* Alt metin */}
        <p className="text-center text-[17px] sm:text-[19px] text-ink-soft max-w-[640px] mx-auto mt-12 leading-[1.55] rise-3">
          MuhasebeLab, Tek Düzen Hesap Planı'nı senaryo bazlı problemlerle pratiğe döker.
          Senaryoyu okur, defterine işler, anında doğrularsın.{' '}
          <span className="emph text-ink">Kayıtsız başla</span> — kaydolmak istersen otuz saniye sürer.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 rise-4">
          <button onClick={() => nav('/problemler')} className="btn btn-primary btn-lg">
            Çözmeye Başla
          </button>
          <button onClick={() => nav('/giris')} className="btn-link">
            Hesap Oluştur →
          </button>
        </div>

        {/* Stats — minimal */}
        <div className="mt-24 sm:mt-32 max-w-3xl mx-auto rise-5">
          <div className="hairline mb-8" />
          <div className="grid grid-cols-3 gap-8">
            {[
              { sayi: tumSorular.length.toString(), etiket: 'Soru', alt: 'gerçek senaryolarla' },
              { sayi: uniteler.length.toString(), etiket: 'Ünite', alt: 'kasadan kambiyoya' },
              { sayi: '₺0', etiket: 'Başlangıç', alt: 'üyelik isteğe bağlı' },
            ].map((s, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="huge-number text-[48px] sm:text-[64px] text-ink mb-1">{s.sayi}</div>
                <div className="eyebrow">{s.etiket}</div>
                <div className="font-display italic text-[13px] text-ink-mute mt-1">{s.alt}</div>
              </div>
            ))}
          </div>
          <div className="hairline mt-8" />
        </div>
      </section>

      {/* ===========================================================
          PULL QUOTE
      =========================================================== */}
      <section className="px-5 sm:px-8 py-20 sm:py-32 bg-surface-2 border-y border-line">
        <div className="max-w-[920px] mx-auto text-center">
          <span className="folio mb-6 inline-block">Açış cümlesi</span>
          <blockquote className="font-display text-ink leading-[1.12] tracking-[-0.015em]"
              style={{ fontSize: 'clamp(28px, 4.5vw, 56px)' }}>
            "Muhasebe ezberlenecek bir konu değil — bir{' '}
            <span className="emph">meslek</span>.{' '}
            <span className="emph">Yapılarak</span> öğrenilir."
          </blockquote>
          <div className="fleuron mt-10">
            <span>§</span>
          </div>
          <p className="text-[14px] text-ink-mute font-mono uppercase tracking-wider mt-6">
            Türkiye'deki muhasebe akademisinin ortak hissi
          </p>
        </div>
      </section>

      {/* ===========================================================
          BUGÜNÜN SORUSU
      =========================================================== */}
      {gununSoru && (
        <section className="px-5 sm:px-8 pt-20 sm:pt-28">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex items-baseline justify-between mb-6">
              <span className="eyebrow">Bugünün Sorusu</span>
              <span className="folio">II.</span>
            </div>
            <div className="hairline mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              <div className="md:col-span-8">
                <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                  <span className="chip">{gununSoru.uniteAd}</span>
                  <ZorlukChip zorluk={gununSoru.zorluk} />
                </div>
                <h2 className="font-display tracking-[-0.02em] leading-[1.0] text-ink mb-5"
                    style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}>
                  {gununSoru.baslik}
                </h2>
                <p className="text-[16px] sm:text-[17px] text-ink-soft leading-relaxed max-w-2xl">
                  {gununSoru.senaryo}
                </p>
                <div className="mt-8 flex items-center gap-4">
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
              <div className="md:col-span-4 md:pl-10 md:border-l md:border-line">
                <Thiings name={gununSoru.uniteIcon} size={120} />
                <div className="mt-6 space-y-2 text-[13px] text-ink-soft">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow">Tarih</span>
                    <span className="font-mono tnum">{new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow">Puan</span>
                    <span className="font-mono tnum">{ZORLUK_PUAN[gununSoru.zorluk]}p</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow">Süre</span>
                    <span className="font-display italic">≈ 2 dk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===========================================================
          ÖZELLİKLER — alternating, refined
      =========================================================== */}
      <section className="px-5 sm:px-8 pt-32 pb-20 sm:pb-28">
        <div className="max-w-[1240px] mx-auto">
          {/* Bölüm başlığı */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="eyebrow inline-block mb-4">Bölüm III · Nasıl çalışır</span>
            <h2 className="font-display tracking-[-0.025em] leading-[1.0] text-ink"
                style={{ fontSize: 'clamp(40px, 6vw, 88px)' }}>
              Pratik yapmadan{' '}
              <span className="emph">muhasebeci</span> olunmaz.
            </h2>
            <p className="text-[16px] sm:text-[18px] text-ink-soft mt-7 leading-relaxed max-w-xl mx-auto">
              Ders kitabını kapatıp yevmiye defterine geçtiğin an,
              asıl öğrenme başlar.
            </p>
          </div>

          <div className="space-y-24 sm:space-y-32">
            {OZELLIKLER.map((o, i) => {
              const sagdaIllustrasyon = i % 2 === 0;
              return (
                <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  {/* İllüstrasyon (mockup) */}
                  <div className={`lg:col-span-7 ${sagdaIllustrasyon ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="surface overflow-hidden">
                      <div className="px-5 py-2.5 border-b border-line flex items-center justify-between bg-surface-2">
                        <span className="font-mono text-[11px] text-ink-mute">muhasebelab.app</span>
                        <span className="font-mono text-[10.5px] text-ink-quiet tracking-wider">
                          Fig. {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <OzellikMockup tip={o.mockup} />
                    </div>
                  </div>

                  {/* Metin */}
                  <div className={`lg:col-span-5 ${sagdaIllustrasyon ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="font-display italic text-[64px] sm:text-[80px] leading-none text-ink-soft">
                        {o.no}
                      </span>
                      <Thiings name={o.icon} size={36} />
                    </div>
                    <span className="eyebrow inline-block mb-4">{o.eyebrow}</span>
                    <h3 className="font-display text-[32px] sm:text-[44px] leading-[1.04] tracking-[-0.02em] text-ink mb-5">
                      {o.baslik}
                    </h3>
                    <p className="text-[15.5px] sm:text-[16.5px] text-ink-soft leading-relaxed max-w-xl">
                      {o.aciklama}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===========================================================
          PREMIUM — hairline kart
      =========================================================== */}
      <section className="px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-[1240px] mx-auto">
          <div className="surface">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-7 p-8 sm:p-12 md:p-14 md:border-r md:border-line">
                <div className="flex items-center gap-3 mb-6">
                  <span className="chip chip-premium">Premium</span>
                  <span className="folio">İlk 100 kullanıcıya bir yıl bedava</span>
                </div>
                <h2 className="font-display tracking-[-0.02em] leading-[1.0] text-ink mb-6"
                    style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
                  Yapay zekâ <span className="emph text-ink-soft">yanında çalışır.</span>
                </h2>
                <p className="text-[16px] sm:text-[17px] leading-relaxed max-w-xl text-ink-soft mb-8">
                  Yanlış cevap analizi, soru içi yapay zekâ asistanı, hesap kodu otomatik
                  tamamlama, sınırsız çalışma. Premium ile gelir.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => nav('/premium')} className="btn btn-primary btn-lg">
                    Premium'u Keşfet
                  </button>
                  <button onClick={() => nav('/problemler')} className="btn-link">
                    Önce Ücretsiz Dene →
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 p-8 sm:p-12 md:p-14 bg-surface-2">
                <div className="eyebrow mb-6">Tarife</div>
                <div className="hairline mb-7" />

                <div className="space-y-7">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-display text-[18px] text-ink">Aylık</span>
                      <span className="font-mono tnum text-[24px] text-ink">
                        {aylikPlan ? aylikPlan.tutar.toFixed(0) : 99}
                        <span className="text-[14px] text-ink-mute ml-0.5">₺</span>
                      </span>
                    </div>
                    <div className="font-display italic text-[13px] text-ink-mute">
                      tek ay, dilediğin zaman iptal
                    </div>
                  </div>

                  <div className="hairline" />

                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-display text-[18px] text-ink">
                        Dönemlik{donemlikPlan ? ` (${donemlikPlan.ay_sayisi} ay)` : ' (4 ay)'}
                      </span>
                      <span className="font-mono tnum text-[24px] text-ink">
                        {donemlikPlan ? donemlikPlan.tutar.toFixed(0) : 249}
                        <span className="text-[14px] text-ink-mute ml-0.5">₺</span>
                      </span>
                    </div>
                    <div className="font-display italic text-[13px] text-accent-deep">
                      bir tüm dönem · daha avantajlı
                    </div>
                  </div>

                  <div className="hairline" />

                  <div className="text-[12px] text-ink-mute font-mono uppercase tracking-wider">
                    Vergiler dahil · iyzico ile ödeme
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
      <section className="px-5 sm:px-8 pb-24 sm:pb-32 pt-12">
        <div className="max-w-[860px] mx-auto text-center">
          <div className="hairline mb-12" />
          <span className="eyebrow inline-block mb-6">Bölüm sonu</span>
          <h2 className="font-display tracking-[-0.025em] leading-[1.0] text-ink mb-8"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
            Otuz saniye, bir hesap,
            <br />
            <span className="emph">bir bütün dönem</span>.
          </h2>
          <p className="text-[16px] sm:text-[18px] text-ink-soft max-w-xl mx-auto leading-relaxed mb-10">
            Üye olmadan başlayabilirsin. İlerlemeni kaydetmek istersen
            otuz saniyelik kayıt yeterli.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => nav('/giris')} className="btn btn-primary btn-lg">
              Hesap Oluştur
            </button>
            <button onClick={() => nav('/problemler')} className="btn-link">
              Önce Soruları Gör →
            </button>
          </div>
          <div className="fleuron mt-16">
            <span>§</span>
          </div>
        </div>
      </section>
    </main>
  );
};
