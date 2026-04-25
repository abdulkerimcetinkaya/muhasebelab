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
   Editorial yardımcı bileşenler
---------------------------------------------------------------------- */

const ZORLUK_ROZET: Record<Zorluk, string> = {
  kolay: 'text-verdigris',
  orta: 'text-ochre',
  zor: 'text-bordeaux',
};

const Eyebrow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`eyebrow ${className}`}>{children}</div>
);

const Fleuron = ({ glyph = '§' }: { glyph?: string }) => (
  <div className="fleuron my-6">
    <span className="italic">{glyph}</span>
  </div>
);

const HairlineRule = ({ thick = false, className = '' }: { thick?: boolean; className?: string }) => (
  <hr className={`${thick ? 'rule-bold' : 'rule'} ${className}`} />
);

const ZorlukRozet = ({ zorluk }: { zorluk: Zorluk }) => (
  <span className={`font-display italic text-[12px] tracking-wide ${ZORLUK_ROZET[zorluk]}`}>
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
      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-32 flex items-center justify-center">
        <Icon name="Loader2" size={20} className="animate-spin text-ink-soft" />
      </main>
    );
  }

  if (user) return <KullaniciPaneli ilerleme={ilerleme} stat={stat} />;
  return <AnonimAnaSayfa />;
};

/* ----------------------------------------------------------------------
   Kullanıcı paneli — editorial dashboard
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

  return (
    <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
      {/* Selamlama başlığı */}
      <section className="mb-12 ed-rise">
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <div>
            <Eyebrow>{selamlama}</Eyebrow>
            <h1 className="font-display text-[56px] sm:text-[88px] md:text-[120px] leading-[0.86] font-bold tracking-[-0.03em] mt-3 text-ink">
              {ad}
              <span className="text-bordeaux">.</span>
            </h1>
          </div>
          <span className="folio">Sayfa I</span>
        </div>
        <HairlineRule thick className="mt-8" />
        <p className="font-display italic text-[18px] sm:text-[20px] text-ink-soft max-w-3xl mt-6 leading-snug">
          {henuzCozulmemis
            ? 'Hadi ilk soruyu çözelim. Otuz saniyede bitiyor.'
            : hedefTamam
              ? `Bugünkü hedefi tamamladın. ${ilerleme.streak} gündür seri devam ediyor.`
              : ilerleme.streak > 0
                ? `${ilerleme.streak} gündür üst üste çalışıyorsun. Bugün ${bugunCozulen}/${gunlukHedef} soru.`
                : 'Bugün küçük bir başlangıç yap, seri kurmaya başla.'}
        </p>
      </section>

      {/* İki sütun: ana kart + sidebar hedef */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 mb-16 ed-rise-2">
        <section>
          {aktifUnite && devamSoru ? (
            <button
              onClick={() => nav(`/problemler/${devamSoru.id}`)}
              className="w-full text-left ed-card group p-7 sm:p-10 relative overflow-hidden hover:bg-paper-deep transition"
            >
              <div className="flex items-start justify-between gap-6 mb-7">
                <div className="flex-1 min-w-0">
                  <Eyebrow className="mb-3">
                    {henuzCozulmemis ? 'İlk Soru · Bölüm I' : 'Devam Edilecek · Bölüm II'}
                  </Eyebrow>
                  <div className="flex items-center gap-3 mb-4 text-[12px] tracking-[0.16em] uppercase font-display font-semibold text-ink-soft">
                    <Thiings name={aktifUnite.unite.thiingsIcon} size={28} />
                    <span>{aktifUnite.unite.ad}</span>
                    <span className="text-ink-mute">·</span>
                    <span className="font-mono tnum text-ink">
                      {aktifUnite.cozulen}/{aktifUnite.toplam}
                    </span>
                  </div>
                  <h2 className="font-display text-[28px] sm:text-[40px] leading-[0.95] tracking-[-0.025em] font-bold text-ink mb-4">
                    {devamSoru.baslik}
                  </h2>
                  <p className="font-body text-[16px] sm:text-[17px] text-ink-soft leading-relaxed line-clamp-3 max-w-xl">
                    {devamSoru.senaryo}
                  </p>
                </div>
              </div>
              <HairlineRule className="mb-5" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ZorlukRozet zorluk={devamSoru.zorluk} />
                  <span className="text-ink-mute">·</span>
                  <span className="eyebrow group-hover:text-bordeaux transition">
                    Çözmeye Başla
                  </span>
                </div>
                <Icon
                  name="ArrowRight"
                  size={18}
                  className="text-ink-soft group-hover:text-bordeaux group-hover:translate-x-1 transition"
                />
              </div>
            </button>
          ) : (
            <div className="ed-card p-12 text-center">
              <div className="inline-block mb-6">
                <Thiings name="trophy" size={80} />
              </div>
              <h2 className="font-display text-[32px] font-bold tracking-tight mb-3 text-ink">
                Tüm soruları çözdün.
              </h2>
              <p className="font-display italic text-[16px] text-ink-soft mb-7 max-w-md mx-auto">
                Yeni soruları beklerken yanlışlarını tekrar edebilirsin.
              </p>
              <button onClick={() => nav('/problemler')} className="btn-ink">
                Tüm Sorular
              </button>
            </div>
          )}
        </section>

        {/* Sidebar — Bugünkü hedef */}
        <aside className="ed-card p-7 self-start">
          <div className="flex items-baseline justify-between mb-5">
            <Eyebrow>Bugünkü Hedef</Eyebrow>
            <span className="folio text-[10px]">{bugun.split('-').slice(1).reverse().join('.')}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-5">
            <span className="font-display text-[80px] leading-none font-bold tracking-[-0.03em] text-ink tnum">
              {bugunCozulen}
            </span>
            <span className="font-mono tnum text-[20px] text-ink-mute font-bold">
              / {gunlukHedef}
            </span>
          </div>
          <div className="h-[6px] bg-paper-deep border border-rule-strong relative overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 transition-all"
              style={{
                width: `${hedefYuzde}%`,
                background: hedefTamam ? 'var(--verdigris)' : 'var(--bordeaux)',
              }}
            />
          </div>
          <p className="font-display italic text-[14px] text-ink-soft leading-snug mb-6">
            {hedefTamam
              ? 'Hedefi tamamladın. İstersen daha fazla çözebilirsin.'
              : `${gunlukHedef - bugunCozulen} soru daha. Bugünü kaçırmadan kapat.`}
          </p>
          <HairlineRule className="mb-5" />
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-[10px]">Seri</span>
              <span className="font-mono tnum font-bold text-[18px] text-ink">
                {ilerleme.streak}
                <span className="font-display italic text-[12px] text-ink-mute ml-1.5 not-italic font-normal">
                  gün
                </span>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-[10px]">Toplam Puan</span>
              <span className="font-mono tnum font-bold text-[18px] text-ink">
                {ilerleme.puan}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-[10px]">Çözülen</span>
              <span className="font-mono tnum font-bold text-[18px] text-ink">
                {stat.cozulenSayi}
                <span className="text-ink-mute font-normal">/{stat.toplamSoru}</span>
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Yan görevler */}
      {(gununSoru || yanlisSoru) && (
        <section className="mb-16 ed-rise-3">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="eyebrow-lg">Yan Görevler</h2>
            <button
              onClick={() => nav('/problemler')}
              className="eyebrow flex items-center gap-1.5 hover:text-bordeaux transition"
            >
              Tüm sorular
              <Icon name="ArrowRight" size={11} />
            </button>
          </div>
          <HairlineRule thick className="mb-6" />
          <div className={`grid grid-cols-1 ${gununSoru && yanlisSoru ? 'md:grid-cols-2' : ''} gap-0 md:gap-8`}>
            {gununSoru && (
              <button
                onClick={() => nav(`/problemler/${gununSoru.id}`)}
                className="text-left p-7 border-t border-rule-bold md:border-t-0 md:border-r md:last:border-r-0 md:pr-8 group hover:bg-paper-inset transition"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="seal-ochre">
                    <Icon name="Calendar" size={11} />
                    Günün Sorusu
                  </span>
                  {gununCozulduMu && (
                    <span className="seal-verdigris">
                      <Icon name="Check" size={11} />
                      Çözüldü
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2 text-[11px] tracking-[0.18em] uppercase font-display font-semibold text-ink-soft">
                  <Thiings name={gununSoru.uniteIcon} size={20} />
                  {gununSoru.uniteAd}
                  <span className="text-ink-mute">·</span>
                  <ZorlukRozet zorluk={gununSoru.zorluk} />
                </div>
                <h3 className="font-display text-[24px] leading-[1.05] font-bold tracking-tight text-ink mb-2 group-hover:text-bordeaux transition">
                  {gununSoru.baslik}
                </h3>
                <p className="font-body text-[15px] text-ink-soft line-clamp-2 mb-5">
                  {gununSoru.senaryo}
                </p>
                <span className="eyebrow inline-flex items-center gap-2 group-hover:text-bordeaux transition">
                  {gununCozulduMu ? 'Tekrar Çöz' : 'Bugünü Çöz'}
                  <Icon name="ArrowRight" size={11} />
                </span>
              </button>
            )}
            {yanlisSoru && (
              <button
                onClick={() => nav(`/problemler/${yanlisSoru.id}`)}
                className={`text-left p-7 border-t border-rule-bold ${gununSoru ? 'md:border-t-0 md:pl-8' : ''} group hover:bg-paper-inset transition`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="seal-bordeaux">
                    <Icon name="RotateCcw" size={11} />
                    Yanlışını Tekrarla
                  </span>
                  <span className="font-mono tnum text-[12px] text-bordeaux font-bold">
                    × {ilerleme.yanlislar[yanlisSoru.id]}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2 text-[11px] tracking-[0.18em] uppercase font-display font-semibold text-ink-soft">
                  <Thiings name={yanlisSoru.uniteIcon} size={20} />
                  {yanlisSoru.uniteAd}
                  <span className="text-ink-mute">·</span>
                  <ZorlukRozet zorluk={yanlisSoru.zorluk} />
                </div>
                <h3 className="font-display text-[24px] leading-[1.05] font-bold tracking-tight text-ink mb-2 group-hover:text-bordeaux transition">
                  {yanlisSoru.baslik}
                </h3>
                <p className="font-body text-[15px] text-ink-soft line-clamp-2 mb-5">
                  {yanlisSoru.senaryo}
                </p>
                <span className="eyebrow inline-flex items-center gap-2 group-hover:text-bordeaux transition">
                  Yeniden Dene
                  <Icon name="ArrowRight" size={11} />
                </span>
              </button>
            )}
          </div>
          <HairlineRule thick className="mt-0 md:hidden" />
        </section>
      )}

      {/* Sıkıntı yaşadığın sorular */}
      {yanlisListe.length > 1 && (
        <section className="mb-16 ed-rise-4">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="eyebrow-lg">Sıkıntı Yaşadığın Sorular</h2>
            <span className="folio text-[10px]">Tab. III</span>
          </div>
          <HairlineRule thick className="mb-0" />
          <div className="border-x border-rule-bold border-b">
            {yanlisListe.map(({ soru, sayi }, i) => (
              <button
                key={soru.id}
                onClick={() => nav(`/problemler/${soru.id}`)}
                className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-paper-inset transition text-left ${
                  i < yanlisListe.length - 1 ? 'border-b border-rule' : ''
                }`}
              >
                <span className="font-display italic text-[14px] text-ink-mute w-8 text-right">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Thiings name={soru.uniteIcon} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[17px] tracking-tight truncate text-ink">
                    {soru.baslik}
                  </div>
                  <div className="text-[10.5px] tracking-[0.22em] uppercase font-display font-semibold text-ink-mute mt-0.5">
                    {soru.uniteAd}
                  </div>
                </div>
                <span className="font-mono tnum text-[14px] text-bordeaux font-bold flex-shrink-0">
                  × {sayi}
                </span>
                <Icon name="ChevronRight" size={14} className="text-ink-mute" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Hızlı bağlantılar */}
      <section className="ed-rise-5">
        <Eyebrow className="mb-5">Sayfa Yönlendirmeleri</Eyebrow>
        <HairlineRule thick className="mb-0" />
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {[
            { yol: '/uniteler', baslik: 'Üniteler', alt: 'Konuya göre sorular', kisa: 'I.' },
            { yol: '/problemler', baslik: 'Tüm Sorular', alt: 'Filtreleyerek ara', kisa: 'II.' },
            { yol: '/profil', baslik: 'Profil', alt: 'Rozet · İstatistik', kisa: 'III.' },
          ].map((l, i) => (
            <button
              key={l.yol}
              onClick={() => nav(l.yol)}
              className={`text-left p-6 border-rule-bold border-x border-b ${i === 0 ? '' : 'sm:border-l-0'} hover:bg-paper-inset transition group flex items-baseline gap-4`}
            >
              <span className="font-display italic text-[18px] text-ink-mute">{l.kisa}</span>
              <div className="flex-1">
                <div className="font-display font-bold text-[20px] tracking-tight text-ink group-hover:text-bordeaux transition">
                  {l.baslik}
                </div>
                <div className="font-display italic text-[13px] text-ink-soft mt-0.5">
                  {l.alt}
                </div>
              </div>
              <Icon name="ArrowRight" size={14} className="text-ink-mute group-hover:text-bordeaux group-hover:translate-x-1 transition" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

/* ----------------------------------------------------------------------
   Anonim ana sayfa — gazete birinci sayfası
---------------------------------------------------------------------- */

const OZELLIKLER = [
  {
    icon: 'calculator',
    no: 'I',
    eyebrow: 'Madde I',
    baslik: 'Gerçek Hayat Senaryoları.',
    aciklama:
      'Ders kitaplarındaki yapmacık örnekler değil. Peşin mal satışı, KDV mahsubu, amortisman ayırma, maaş tahakkuku — işletmelerde gerçekten karşına çıkacak işlemler.',
    mockup: 'senaryo' as const,
  },
  {
    icon: 'rocket',
    no: 'II',
    eyebrow: 'Madde II',
    baslik: 'Anlık Geri Bildirim.',
    aciklama:
      'Yanlış satırlar kırmızı işaretlenir, doğrular yeşil. Her soruda ipucu, resmi çözüm ve detaylı açıklama. Nerede yanıldığını görmeden geçmezsin.',
    mockup: 'kontrol' as const,
  },
  {
    icon: 'chart',
    no: 'III',
    eyebrow: 'Madde III',
    baslik: 'İlerleme Takibi.',
    aciklama:
      'Hangi üniteyi bitirdin, hangi konularda zayıfsın, kaç gündür üst üste çalışıyorsun — hepsi istatistik panelinde. Rozetler ve puan sistemiyle motivasyon hep taze.',
    mockup: 'istatistik' as const,
  },
  {
    icon: 'trophy',
    no: 'IV',
    eyebrow: 'Madde IV',
    baslik: 'Üç Zorluk Seviyesi.',
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
    <main className="paper-warm">
      {/* ===========================================================
          HERO — gazete birinci sayfası
      =========================================================== */}
      <section className="relative max-w-[1400px] mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20">
        {/* Üst künye */}
        <div className="flex items-baseline justify-between gap-6 mb-8 ed-rise">
          <span className="folio">Editio I · MMXXVI · Sayı 1</span>
          <span className="folio">Sayfa 1</span>
        </div>
        <HairlineRule thick className="mb-1" />
        <HairlineRule className="mb-12" />

        {/* Ana başlık */}
        <div className="ed-rise-2">
          <h1 className="font-display font-bold tracking-[-0.04em] leading-[0.83] text-ink text-[64px] sm:text-[112px] md:text-[160px] lg:text-[200px] xl:text-[224px]">
            <span className="block">Yevmiye</span>
            <span className="block">
              <em className="font-display-italic text-bordeaux">
                defterini
              </em>
            </span>
            <span className="block">tut.</span>
          </h1>
        </div>

        {/* Künye altı: 3 sütun */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 ed-rise-3">
          {/* Lede paragraph */}
          <div className="md:col-span-7">
            <HairlineRule className="mb-5" />
            <div className="flex items-baseline gap-3 mb-4">
              <span className="folio">Önsöz</span>
              <span className="text-rule-strong">·</span>
              <Eyebrow>Tek Düzen Hesap Planı Atölyesi</Eyebrow>
            </div>
            <p className="font-body text-[18px] sm:text-[20px] leading-[1.5] text-ink drop-cap">
              Muhasebe, ezberlenecek bir konu değil; uygulanarak öğrenilen bir
              meslek. <em className="text-bordeaux">MuhasebeLab</em>, Türkiye'deki tek düzen hesap planını gerçek
              işletme senaryolarıyla karşına çıkarır. Senaryoyu okur, yevmiye
              defterine işler, anında doğrularsın. Kayıt zorunlu değil — saniyeler
              içinde başla.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <button onClick={() => nav('/problemler')} className="btn-seal">
                Çözmeye Başla
              </button>
              <button onClick={() => nav('/giris')} className="btn-hairline">
                Hesap Oluştur
              </button>
            </div>
            <p className="mt-5 font-display italic text-[14px] text-ink-soft">
              Üye olmadan da çalışabilirsin · İlerlemen 30 saniyede buluta taşınır
            </p>
          </div>

          {/* Sağ sidebar — Bu sayıda */}
          <div className="md:col-span-5 md:pl-10 md:border-l md:border-rule-bold">
            <div className="flex items-baseline justify-between mb-3">
              <Eyebrow>Bu Sayıda</Eyebrow>
              <span className="folio text-[10px]">İçindekiler</span>
            </div>
            <HairlineRule thick className="mb-5" />
            <ul className="space-y-3.5 font-body text-[16px] leading-snug">
              <li className="flex items-baseline gap-3">
                <span className="font-mono tnum font-bold text-[14px] w-12 text-ink">
                  {tumSorular.length}
                </span>
                <span className="text-ink">soru, gerçek senaryolarla.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono tnum font-bold text-[14px] w-12 text-ink">
                  {uniteler.length}
                </span>
                <span className="text-ink">ünite, kasadan kambiyoya.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono tnum font-bold text-[14px] w-12 text-ink">3</span>
                <span className="text-ink">zorluk: kolay, orta, zor.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono tnum font-bold text-[14px] w-12 text-ink">∞</span>
                <span className="text-ink">tekrar; pekişene kadar.</span>
              </li>
              <li className="flex items-baseline gap-3 pt-2 border-t border-rule">
                <span className="font-display italic text-[14px] w-12 text-ochre">₺0</span>
                <span className="text-ink-soft italic font-display">
                  başlangıç ücretsiz, üyelik isteğe bağlı.
                </span>
              </li>
            </ul>

            <Fleuron glyph="✦" />

            <div className="font-display italic text-[14px] text-ink-soft leading-snug">
              "Defter tutmak, bir işletmeyi anlamanın en sade yolu.
              Burada her gün biraz daha iyisini öğreniyorsun."
            </div>
            <div className="mt-3 eyebrow text-[10px]">— Editör</div>
          </div>
        </div>
      </section>

      {/* ===========================================================
          BUGÜNÜN MAKALESİ — günün sorusu
      =========================================================== */}
      {gununSoru && (
        <section className="border-y border-rule-bold bg-paper-inset">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
            <div className="flex items-baseline justify-between gap-6 mb-6 flex-wrap">
              <div className="flex items-baseline gap-3">
                <Eyebrow className="text-bordeaux">Bugünün Makalesi</Eyebrow>
                <span className="folio text-[10px]">Front · 02</span>
              </div>
              <span className="folio text-[10px]">
                Tarih · {new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' })}
              </span>
            </div>
            <HairlineRule thick className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 mb-4">
                  <Thiings name={gununSoru.uniteIcon} size={36} />
                  <div>
                    <div className="eyebrow text-[10px]">{gununSoru.uniteAd}</div>
                    <ZorlukRozet zorluk={gununSoru.zorluk} />
                  </div>
                </div>
                <h2 className="font-display text-[36px] sm:text-[52px] leading-[0.95] font-bold tracking-[-0.025em] text-ink mb-4">
                  {gununSoru.baslik}
                </h2>
                <p className="font-body text-[17px] sm:text-[18px] leading-relaxed text-ink-soft max-w-2xl">
                  {gununSoru.senaryo}
                </p>
              </div>
              <div className="md:col-span-4 md:pl-8 md:border-l md:border-rule-bold flex flex-col gap-4">
                <button
                  onClick={() => nav(`/problemler/${gununSoru.id}`)}
                  className="btn-seal w-full justify-center text-center"
                >
                  Bu Soruyu Çöz
                </button>
                <button
                  onClick={() => nav('/problemler')}
                  className="btn-hairline w-full justify-center text-center"
                >
                  Diğer Sorular
                </button>
                <p className="font-display italic text-[13px] text-ink-soft leading-snug">
                  Her gün yeni bir senaryo. Çözdüğünde puan kazan, seri uzasın.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===========================================================
          ÖRNEK FOLYO — yevmiye defterinden bir kayıt
      =========================================================== */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="text-center mb-12">
          <Eyebrow>Örnek Folyo · 03</Eyebrow>
          <h2 className="font-display text-[48px] sm:text-[72px] md:text-[96px] leading-[0.92] tracking-[-0.03em] font-bold text-ink mt-4">
            Borç <em className="font-display-italic text-bordeaux">=</em> Alacak,
            <br />
            <span className="text-ink-soft">her zaman.</span>
          </h2>
          <div className="fleuron mt-6">
            <span>✦</span>
          </div>
        </div>

        <div className="ed-card max-w-4xl mx-auto">
          {/* Folyo başlığı */}
          <div className="border-b border-rule-bold p-5 sm:p-7 flex items-baseline justify-between flex-wrap gap-3">
            <div>
              <div className="eyebrow mb-1">Yevmiye Defteri · Madde 03</div>
              <h3 className="font-display text-[24px] sm:text-[28px] font-bold tracking-tight text-ink">
                Peşin Mal Satışı
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <ZorlukRozet zorluk="orta" />
              <span className="folio text-[10px]">Folio III</span>
            </div>
          </div>

          {/* Senaryo */}
          <div className="px-5 sm:px-7 py-5 border-b border-rule bg-paper">
            <div className="flex gap-4 items-start">
              <span className="font-display text-[14px] italic text-ink-mute leading-tight pt-1">¶</span>
              <p className="font-body text-[16px] sm:text-[17px] leading-relaxed text-ink">
                İşletme, ticari mal satışından{' '}
                <span className="font-mono tnum font-bold text-bordeaux">10.000,00 ₺ + %20 KDV</span>{' '}
                tutarında peşin tahsilat yapmıştır. Yevmiye kaydını yapınız.
              </p>
            </div>
          </div>

          {/* Tablo başlığı */}
          <div className="grid grid-cols-12 gap-2 px-5 sm:px-7 py-2.5 border-b border-rule-bold bg-paper-deep">
            <div className="col-span-2 eyebrow text-[10px]">Kod</div>
            <div className="col-span-5 eyebrow text-[10px]">Hesap Adı</div>
            <div className="col-span-2 eyebrow text-[10px] text-right">Borç</div>
            <div className="col-span-2 eyebrow text-[10px] text-right">Alacak</div>
            <div className="col-span-1"></div>
          </div>

          {[
            { k: '100', a: 'KASA', b: '12.000,00', al: '' },
            { k: '600', a: 'YURT İÇİ SATIŞLAR', b: '', al: '10.000,00' },
            { k: '391', a: 'HESAPLANAN KDV', b: '', al: '2.000,00' },
          ].map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 px-5 sm:px-7 py-3 border-b border-rule font-mono tnum text-[14px] sm:text-[15px]"
            >
              <div className="col-span-2 font-bold text-ink">{r.k}</div>
              <div className="col-span-5 truncate text-ink">{r.a}</div>
              <div className="col-span-2 text-right text-ink">{r.b}</div>
              <div className="col-span-2 text-right text-ink">{r.al}</div>
              <div className="col-span-1 flex justify-end items-center">
                <Icon name="Check" size={13} className="text-verdigris" />
              </div>
            </div>
          ))}
          <div className="grid grid-cols-12 gap-2 px-5 sm:px-7 py-3.5 border-t-2 border-rule-bold bg-paper-deep font-mono tnum font-bold text-[15px]">
            <div className="col-span-7 eyebrow text-[10px] flex items-center">Toplam</div>
            <div className="col-span-2 text-right text-ink">12.000,00</div>
            <div className="col-span-2 text-right text-ink">12.000,00</div>
            <div className="col-span-1 flex justify-end items-center">
              <Icon name="CheckCircle2" size={15} className="text-verdigris" />
            </div>
          </div>

          {/* Alt durum */}
          <div className="px-5 sm:px-7 py-4 flex items-center justify-between flex-wrap gap-3 border-t border-rule bg-paper-inset">
            <span className="font-display italic text-[14px] text-verdigris">
              Borç = Alacak · Kayıt dengeli
            </span>
            <span className="seal-verdigris">
              <Icon name="Check" size={11} />
              Doğru · +10p
            </span>
          </div>
        </div>
      </section>

      {/* ===========================================================
          ÖZELLİKLER — numaralı maddeler
      =========================================================== */}
      <section className="border-t border-rule-bold bg-paper-inset/30 py-20 sm:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="mb-16 max-w-3xl">
            <Eyebrow>Bölüm IV · Nasıl Çalışır</Eyebrow>
            <h2 className="font-display text-[44px] sm:text-[64px] md:text-[88px] leading-[0.94] tracking-[-0.025em] font-bold text-ink mt-4">
              Pratik yapmadan{' '}
              <em className="font-display-italic text-bordeaux">
                muhasebeci
              </em>{' '}
              olunmaz.
            </h2>
            <HairlineRule thick className="mt-8" />
          </div>

          <div className="space-y-24">
            {OZELLIKLER.map((o, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="lg:col-span-7 ed-card">
                  <div className="border-b border-rule-strong px-4 py-2 flex items-center justify-between bg-paper-deep">
                    <span className="font-display italic text-[12px] text-ink-soft">
                      muhasebelab.app · özellik · {o.no}
                    </span>
                    <span className="folio text-[10px]">FIG. {String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <OzellikMockup tip={o.mockup} />
                </div>
                <div className="lg:col-span-5">
                  <div className="flex items-baseline gap-5 mb-6">
                    <span className="font-display italic text-[88px] sm:text-[112px] leading-none text-bordeaux opacity-90">
                      {o.no}
                    </span>
                    <Thiings name={o.icon} size={60} />
                  </div>
                  <Eyebrow className="mb-3">{o.eyebrow}</Eyebrow>
                  <h3 className="font-display text-[32px] sm:text-[44px] leading-[0.98] tracking-[-0.025em] font-bold text-ink mb-5">
                    {o.baslik}
                  </h3>
                  <p className="font-body text-[17px] sm:text-[18px] text-ink-soft leading-relaxed">
                    {o.aciklama}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================
          PREMIUM — abonelik ilanı
      =========================================================== */}
      <section className="border-t border-rule-bold py-20 sm:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="ed-card relative overflow-hidden">
            {/* Sol köşe damgası */}
            <div className="absolute -left-6 -top-6 opacity-10 pointer-events-none">
              <Thiings name="trophy" size={200} />
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-7 p-8 sm:p-12 md:p-16 md:border-r md:border-rule-bold">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="seal-ochre">
                    <Icon name="Sparkles" size={11} />
                    Premium
                  </span>
                  <span className="folio text-[10px]">İlan · 05</span>
                </div>
                <h2 className="font-display text-[40px] sm:text-[60px] md:text-[80px] leading-[0.92] tracking-[-0.025em] font-bold text-ink mb-6">
                  Yapay zekâ
                  <br />
                  <em className="font-display-italic text-ochre">
                    yanında.
                  </em>
                </h2>
                <p className="font-body text-[17px] sm:text-[18px] leading-relaxed text-ink-soft max-w-xl mb-8">
                  Yanlış cevap analizi, soru içi AI asistanı, hesap kodu otomatik
                  tamamlama ve sınırsız çalışma — Premium ile gelir. İlk yüz
                  kullanıcıya{' '}
                  <em className="text-ochre">bir yıl ücretsiz</em>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => nav('/premium')} className="btn-seal" style={{ background: 'var(--ochre)', borderColor: 'var(--ochre)' }}>
                    Premium'u Keşfet
                  </button>
                  <button onClick={() => nav('/problemler')} className="btn-hairline">
                    Önce Ücretsiz Dene
                  </button>
                </div>
              </div>

              {/* Fiyat kolonu */}
              <div className="md:col-span-5 p-8 sm:p-12 md:p-14 bg-paper-deep border-t md:border-t-0 border-rule-bold">
                <Eyebrow className="mb-6">Abonelik Tarifesi</Eyebrow>
                <HairlineRule thick className="mb-6" />

                <div className="space-y-7">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-display text-[20px] font-bold text-ink">Aylık</span>
                      <span className="font-mono tnum font-bold text-[28px] text-ink">
                        {aylikPlan ? `${aylikPlan.tutar.toFixed(0)} ₺` : '99 ₺'}
                      </span>
                    </div>
                    <div className="font-display italic text-[13px] text-ink-soft">
                      tek ay, dilediğin zaman iptal
                    </div>
                  </div>

                  <HairlineRule />

                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-display text-[20px] font-bold text-ink">
                        Dönemlik{donemlikPlan ? ` (${donemlikPlan.ay_sayisi} ay)` : ' (4 ay)'}
                      </span>
                      <span className="font-mono tnum font-bold text-[28px] text-ink">
                        {donemlikPlan ? `${donemlikPlan.tutar.toFixed(0)} ₺` : '249 ₺'}
                      </span>
                    </div>
                    <div className="font-display italic text-[13px] text-ochre">
                      bir tüm dönem · daha avantajlı
                    </div>
                  </div>

                  <HairlineRule className="mb-2" />

                  <div className="text-[12px] eyebrow tracking-[0.2em] text-ink-mute">
                    Vergiler dahil · iyzico ile güvenli ödeme
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
          KAPANIŞ — Bugün abone olun
      =========================================================== */}
      <section className="border-t border-rule-bold bg-paper">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
          <Eyebrow>Bölüm Sonu</Eyebrow>
          <h2 className="font-display text-[44px] sm:text-[64px] md:text-[80px] leading-[0.92] tracking-[-0.025em] font-bold text-ink mt-4 mb-6">
            Başlamak için{' '}
            <em className="font-display-italic text-bordeaux">
              tek tıklama
            </em>{' '}
            yeter.
          </h2>
          <div className="fleuron mb-8">
            <span>✦</span>
          </div>
          <p className="font-display italic text-[18px] sm:text-[20px] text-ink-soft max-w-xl mx-auto leading-snug mb-10">
            Üye olmadan başlayabilirsin. İlerlemeni kaydetmek için sadece
            otuz saniye sürer; bir kullanıcı adı, bir şifre, bitti.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => nav('/giris')} className="btn-seal">
              Hesap Oluştur
            </button>
            <button onClick={() => nav('/problemler')} className="btn-hairline">
              Önce Soruları Gör
            </button>
          </div>
          <div className="mt-10 eyebrow text-[10px] text-ink-mute">— Son —</div>
        </div>
      </section>
    </main>
  );
};
