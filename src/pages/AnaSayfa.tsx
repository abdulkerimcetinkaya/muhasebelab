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

/* Pilier-style ünite seçici için zenginleştirilmiş içerik */
interface PilierIcerik {
  baslik: string;
  ozet: string;
  kodlar: string[];
  konular: string[];
  ornekSenaryo: string;
}

const PILIER_ICERIK: Record<string, PilierIcerik> = {
  kasa: {
    baslik: 'Kasa İşlemleri',
    ozet: 'Nakit tahsilat ve ödemelerin temel hesabı. Her muhasebe defterinin sıfır noktası.',
    kodlar: ['100'],
    konular: ['Peşin satış tahsilatı', 'Peşin alım ödemesi', 'Kasa fazlası/eksiği', 'Bankaya yatırma'],
    ornekSenaryo: 'İşletme, 12.000 ₺ peşin tahsilat yapmış. 100 KASA hesabı borçlandırılır.',
  },
  banka: {
    baslik: 'Banka İşlemleri',
    ozet: 'Vadesiz mevduat, vadeli hesap, kredi kullanımı, EFT/havale.',
    kodlar: ['102', '103', '300'],
    konular: ['Banka tahsilatı', 'Kredi kullanımı', 'Faiz tahakkuku', 'EFT/havale'],
    ornekSenaryo: 'İşletme, bankadan 250.000 ₺ kısa vadeli kredi kullanmış. 102 BANKALAR borç, 300 BANKA KREDİLERİ alacak.',
  },
  mal: {
    baslik: 'Ticari Mal',
    ozet: 'Mal alış, satış, iade, fire — perakende ve toptan işletme zincirinin kalbi.',
    kodlar: ['153', '600', '610', '611', '621'],
    konular: ['Peşin/veresiye alış', 'Peşin/veresiye satış', 'Satıştan iade', 'Satılan malın maliyeti'],
    ornekSenaryo: 'Mal satışından 10.000 ₺ + KDV peşin tahsilat. 100 KASA borç; 600 SATIŞLAR + 391 HESAPLANAN KDV alacak.',
  },
  senet: {
    baslik: 'Alacak ve Borç Senetleri',
    ozet: 'Vadeli ödeme/tahsilatın belgesi. Alıcıdan alınır, satıcıya verilir.',
    kodlar: ['121', '321'],
    konular: ['Senet karşılığı satış', 'Senet karşılığı alış', 'Senet tahsilatı', 'Senet ciro/iskonto'],
    ornekSenaryo: 'Müşteriden 30 gün vadeli 15.000 ₺ senet alındı. 121 ALACAK SENETLERİ borç, 600 SATIŞLAR alacak.',
  },
  kdv: {
    baslik: 'KDV (İndirilecek + Hesaplanan)',
    ozet: 'Alımda indirilecek (191), satışta hesaplanan (391). Ay sonunda mahsuplaşır.',
    kodlar: ['191', '391'],
    konular: ['İndirilecek KDV (191)', 'Hesaplanan KDV (391)', 'KDV mahsubu', 'Devreden KDV (190)'],
    ornekSenaryo: 'Mal satışında %20 KDV hesaplandı: 391 HESAPLANAN KDV alacak; alımda 191 İNDİRİLECEK KDV borç.',
  },
  amortisman: {
    baslik: 'Amortisman',
    ozet: 'Maddi duran varlığın faydalı ömründe yıpranma payı. Bilanço ve gelir tablosunu etkiler.',
    kodlar: ['257', '770'],
    konular: ['Normal amortisman', 'Azalan bakiye', 'Birikmiş amortisman (257)', 'Gider tahakkuku'],
    ornekSenaryo: 'Demirbaş için 5.000 ₺ amortisman hesaplandı. 770 GENEL YÖN. GİD. borç, 257 BİRİKMİŞ AMORT. alacak.',
  },
  personel: {
    baslik: 'Personel ve Ücret',
    ozet: 'Brüt ücret, SGK kesintileri, gelir vergisi, net ücret. Tahakkuk + ödeme iki adımda.',
    kodlar: ['335', '360', '361', '720', '770'],
    konular: ['Ücret tahakkuku', 'SGK işveren payı', 'Gelir vergisi tevkifatı', 'Net ücret ödemesi'],
    ornekSenaryo: 'Personel brüt 20.000 ₺. 720 GİD./770 borç; 335 ÖDENECEK ÜCRET + 360 ÖDENECEK VERGİ + 361 SGK alacak.',
  },
  'donem-sonu': {
    baslik: 'Dönem Sonu Kapanış',
    ozet: 'Gelir ve gider hesaplarının 690 üzerinden 690 → 692 → 590/591 akışıyla kapanışı.',
    kodlar: ['690', '691', '692', '590', '591'],
    konular: ['Gelir hesaplarının kapanışı', 'Gider hesaplarının kapanışı', 'Dönem kâr/zararı', 'Yedek aktarımı'],
    ornekSenaryo: '600 SATIŞLAR ve 621 SATILAN MAL MALİYETİ 690 DÖNEM K/Z hesabına aktarılır.',
  },
  'supheli-alacaklar': {
    baslik: 'Şüpheli ve Değersiz Alacaklar',
    ozet: 'Tahsil olasılığı düşen alacaklar için karşılık ayrılır, dava açılır, gerekirse silinir.',
    kodlar: ['128', '129', '654'],
    konular: ['Şüpheli alacak (128)', 'Şüpheli alacak karşılığı (129)', 'Karşılık iptali', 'Değersiz alacak silimi'],
    ornekSenaryo: '120 ALICILAR\'da 8.000 ₺ tahsil edilemiyor. 128 ŞÜPHELİ ALACAKLAR borç, 120 alacak.',
  },
  reeskont: {
    baslik: 'Reeskont',
    ozet: 'Vadeli senedin bugünkü değerini bulmak için iç iskonto hesabı.',
    kodlar: ['122', '322', '647', '657'],
    konular: ['Alacak senedi reeskontu', 'Borç senedi reeskontu', 'İç iskonto formülü', 'Faiz tahakkuku'],
    ornekSenaryo: '90 günlük 50.000 ₺ senet için %15 reeskont: 1.808 ₺. 657 REESKONT FAİZ GİD. borç, 122 alacak.',
  },
  kambiyo: {
    baslik: 'Kambiyo (Döviz)',
    ozet: 'Döviz alış-satış, kur farkı kâr/zararı, döviz hesapları.',
    kodlar: ['102', '320', '646', '656'],
    konular: ['Döviz tahsilat (USD/EUR)', 'Kur değerleme', 'Kur farkı kârı (646)', 'Kur farkı zararı (656)'],
    ornekSenaryo: 'USD ile 5.000 dolar tahsilat (kur 32). 102 BANKALAR (DOLAR) 160.000 ₺ borç.',
  },
};

// Bir sample yevmiye kaydı — gerçek görünmesi için
const ORNEK_KAYIT = [
  { kod: '100', ad: 'KASA', borc: '12.000,00', alacak: '' },
  { kod: '600', ad: 'YURT İÇİ SATIŞLAR', borc: '', alacak: '10.000,00' },
  { kod: '391', ad: 'HESAPLANAN KDV', borc: '', alacak: '2.000,00' },
];

/* Arka planda yüzen hesap kodları — radar tarzı atmosfer */
// Orbital için kısa etiketler — uzun ünite adları sayfa kenarına taşmasın
const ORBITAL_KISA_AD: Record<string, string> = {
  kasa: 'Kasa',
  banka: 'Banka',
  mal: 'Ticari Mal',
  senet: 'Çek / Senet',
  kdv: 'KDV',
  amortisman: 'Amortisman',
  personel: 'Personel',
  'donem-sonu': 'Dönem Sonu',
  'supheli-alacaklar': 'Şüpheli Alacak',
  reeskont: 'Reeskont',
  kambiyo: 'Kambiyo',
};

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

interface FloatingCodeProps {
  progress: MotionValue<number>;
  kod: string;
  x: string;
  y: string;
  index: number;
}

/* Hero arkasında yüzen hesap kodu — scroll'a göre y-parallax */
const FloatingCode = ({ progress, kod, x, y, index }: FloatingCodeProps) => {
  const yOffset = useTransform(progress, [0, 1], [0, index % 2 === 0 ? -40 : 40]);
  return (
    <motion.span
      className="float-code"
      style={{ left: x, top: y, y: yOffset }}
    >
      {kod}
    </motion.span>
  );
};

const UnderlinedWord = ({ children }: { children: string }) => (
  <span className="under-mark">
    {children}
    <svg viewBox="0 0 200 14" preserveAspectRatio="none">
      <path d="M 5 9 Q 50 2, 100 7 T 195 6" />
    </svg>
  </span>
);

const SAHNELER: (Sahne & { vurguBaslik: ReactNode })[] = [
  {
    start: 0,
    end: 0.28,
    baslik: 'Yevmiye kaydını',
    vurguBaslik: (
      <>
        Yevmiye kaydını <UnderlinedWord>çözmenin</UnderlinedWord> en hızlı yolu.
      </>
    ),
    altyazi: 'Tarayıcıdan, gerçek senaryolarla.',
  },
  {
    start: 0.28,
    end: 0.55,
    baslik: 'Senaryoyu oku.',
    vurguBaslik: (
      <>
        Senaryoyu <UnderlinedWord>oku</UnderlinedWord>.
      </>
    ),
    altyazi: 'Borç ve alacak satırlarını sırayla işle.',
  },
  {
    start: 0.55,
    end: 0.82,
    baslik: 'Anında doğrula.',
    vurguBaslik: (
      <>
        Anında <UnderlinedWord>doğrula</UnderlinedWord>.
      </>
    ),
    altyazi: 'Yanlış satır kırmızı, dengeli kayıt yeşil.',
  },
  {
    start: 0.82,
    end: 1.0,
    baslik: 'Sıkıştığında AI yanında.',
    vurguBaslik: (
      <>
        Sıkıştığında <UnderlinedWord>AI yanında</UnderlinedWord>.
      </>
    ),
    altyazi: 'Kasadan kambiyoya, sürekli envantere — gerçek senaryolar.',
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

  // Paper sheet — sahne 1-2'de görünür; sahne 3 boyunca (orbital sahnesi)
  // gizlenir; sahne 4'te (AI kart) tekrar belirir.
  const paperScale = useTransform(progress, [0, 0.55, 0.82, 1], [0.94, 1.0, 0.62, 0.62]);
  const paperRotate = useTransform(progress, [0, 0.15, 0.82, 1], [-1.5, 0, 0, -2]);
  const paperOpacity = useTransform(
    progress,
    [0, 0.6, 0.66, 0.78, 0.84, 1],
    [1, 1, 0, 0, 1, 0.85],
  );

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

  // Orbital ünite ikonları — yalnızca sahne 3'te görünür; sahne 4'e
  // geçerken paper geri gelirken orbital fade out olur.
  const orbitOpacity = useTransform(progress, [0.62, 0.72, 0.78, 0.84], [0, 1, 1, 0]);
  const orbitScale = useTransform(progress, [0.62, 0.72, 0.78, 0.84], [0.6, 1, 1, 0.7]);

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
          {FLOATING_CODES.map((c, i) => (
            <FloatingCode key={i} progress={progress} kod={c.kod} x={c.x} y={c.y} index={i} />
          ))}
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
                  style={{ fontSize: 'clamp(40px, 5.6vw, 72px)', lineHeight: 1.05 }}
                >
                  {(sahne as { vurguBaslik?: ReactNode }).vurguBaslik ?? sahne.baslik}
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

        {/* ORBITAL ÜNİTE İKONLARI — paper'ın eski yerinde; sahne 3'te paper
            opacity 0 olduğu için çakışma yok, sahne 4'te orbital fade out olur. */}
        <motion.div
          className="absolute top-1/2 right-[28%] sm:right-[30%] lg:right-[34%] -translate-y-1/2 pointer-events-none"
          style={{ opacity: orbitOpacity, scale: orbitScale }}
        >
          {uniteler.slice(0, 11).map((u, i) => {
            const angle = (i / 11) * Math.PI * 2 - Math.PI / 2;
            const radius = 160;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const kisaAd = ORBITAL_KISA_AD[u.id] ?? u.ad;
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
                  <Thiings name={u.thiingsIcon} size={40} />
                  <span className="font-mono text-[10px] text-ink-soft tracking-wider whitespace-nowrap bg-bg/80 backdrop-blur px-1.5 py-0.5 rounded">
                    {kisaAd}
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
  const [planlar, setPlanlar] = useState<Plan[]>([]);

  useEffect(() => {
    planlariYukle()
      .then(setPlanlar)
      .catch(() => {});
  }, []);

  const aylikPlan = planlar.find((p) => p.kod === 'aylik');
  const aylikTutar = aylikPlan ? aylikPlan.tutar.toFixed(0) : '99';

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
          TRUST STRIP — üniversite/program logoları
      =========================================================== */}
      <section className="border-y border-line py-8 px-5 sm:px-8 bg-surface-2/30">
        <div className="max-w-[1240px] mx-auto">
          <Reveal>
            <div className="text-center mb-6">
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute">
                Türkiye'deki üniversite muhasebe öğrencileri tarafından kullanılıyor
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="trust-strip">
              {[
                { ad: 'Boğaziçi', alt: 'İşletme' },
                { ad: 'İTÜ', alt: 'İşletme Müh.' },
                { ad: 'ODTÜ', alt: 'İİBF' },
                { ad: 'Hacettepe', alt: 'İktisat' },
                { ad: 'Marmara', alt: 'İşletme' },
                { ad: 'Bilkent', alt: 'İktisat' },
                { ad: 'Anadolu', alt: 'AÖF' },
              ].map((l) => (
                <span key={l.ad} className="trust-logo">
                  {l.ad}
                  <span>{l.alt}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===========================================================
          § 01 · İÇERİK — Pilier-tarzı interaktif ünite seçici
      =========================================================== */}
      <UniteSeciciSection
        uniteler={uniteler}
        toplamSoru={tumSorular.length}
        onTumune={() => nav('/uniteler')}
        onUnite={(id) => nav(`/uniteler/${id}`)}
      />

      {/* ===========================================================
          § 02 · TARİFE — kompakt fiyat şeridi
      =========================================================== */}
      <section className="px-5 sm:px-8 py-12 sm:py-14 border-t border-line bg-surface-2/30">
        <div className="max-w-[1240px] mx-auto">
          <Reveal>
            <div className="surface bg-surface flex items-center justify-between gap-5 flex-wrap p-5 sm:p-6">
              <div className="flex-1 min-w-[260px]">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
                  Tarife
                </div>
                <h3 className="font-display text-[20px] sm:text-[22px] font-bold text-ink mt-1 leading-tight">
                  Ücretsiz başla, dilersen{' '}
                  <span className="font-display-italic text-copper-deep">Premium</span>'a geç.
                </h3>
                <p className="text-[13px] text-ink-soft mt-1.5 leading-snug">
                  Tüm sorular ücretsiz. Premium → AI asistan, yanlış analizi, otomatik
                  tamamlama.
                  <span className="inline-block ml-2 text-copper-deep font-mono uppercase tracking-[0.16em] text-[10.5px] font-bold">
                    İlk 100 kişiye 1 yıl bedava
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4 sm:gap-5">
                <div className="text-right sm:text-center">
                  <div className="font-display text-[22px] sm:text-[26px] font-bold text-ink leading-none tnum">
                    ₺0
                  </div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-mute mt-1">
                    her zaman
                  </div>
                </div>
                <span className="font-mono text-[16px] text-line-strong leading-none">·</span>
                <div className="text-right sm:text-center">
                  <div className="font-display text-[22px] sm:text-[26px] font-bold text-ink leading-none tnum">
                    ₺{aylikTutar}
                    <span className="text-[12px] font-mono text-ink-quiet ml-0.5">/ay</span>
                  </div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-copper-deep mt-1">
                    premium
                  </div>
                </div>
                <button
                  onClick={() => nav('/premium')}
                  className="btn btn-soft ml-1 sm:ml-2"
                >
                  Detay →
                </button>
              </div>
            </div>
          </Reveal>
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
              <span>§ 03 · Başla</span>
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

/* ----------------------------------------------------------------------
   § 02 · Pilier-Style Ünite Seçici
   Ventriloc'un "Pilier 1, 2, 3, 4" interaktif tab seçicinin muhasebe
   eşdeğeri: 11 ünitenin tıklanabilir tab'ları + altta dinamik içerik.
---------------------------------------------------------------------- */

interface UniteSeciciProps {
  uniteler: Unite[];
  toplamSoru: number;
  onTumune: () => void;
  onUnite: (id: string) => void;
}

const UniteSeciciSection = ({ uniteler, toplamSoru, onTumune, onUnite }: UniteSeciciProps) => {
  return (
    <section className="relative px-5 sm:px-8 py-24 sm:py-32 overflow-hidden">
      <div className="max-w-[1240px] mx-auto relative">
        {/* Üst başlık */}
        <div className="text-center max-w-2xl mx-auto mb-24 lg:mb-32">
          <Reveal>
            <div className="section-divider mb-8">
              <span>§ 01 · İçerik</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[40px] sm:text-[56px] md:text-[68px] font-bold tracking-tight text-ink leading-[0.96]">
              <CountUp to={uniteler.length} /> bölüm,{' '}
              <span className="font-display-italic text-copper-deep">adım adım</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[16px] sm:text-[17px] text-ink-soft mt-6 leading-relaxed">
              Sıfırdan başla — kasa ve banka kayıtlarıyla. İleri konulara git —
              reeskont, kambiyo, dönem sonu.{' '}
              <strong className="text-ink font-semibold">{toplamSoru}</strong> senaryo,
              kolaydan zora sıralı.
            </p>
          </Reveal>
        </div>

        {/* Zigzag sahneler */}
        <div className="zigzag-track">
          {/* Dikey timeline çizgisi */}
          <div className="zigzag-line" aria-hidden />

          {uniteler.map((u, i) => (
            <UniteSahne
              key={u.id}
              unite={u}
              index={i}
              toplam={uniteler.length}
              ters={i % 2 === 1}
              onTik={() => onUnite(u.id)}
            />
          ))}
        </div>

        {/* Alt CTA */}
        <Reveal delay={0.05}>
          <div className="text-center mt-24 sm:mt-32">
            <span className="block font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-5 font-bold">
              Liste sonu
            </span>
            <button onClick={onTumune} className="btn btn-primary btn-lg">
              Tüm Soruları Gör →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

interface UniteSahneProps {
  unite: Unite;
  index: number;
  toplam: number;
  ters: boolean;
  onTik: () => void;
}

const UniteSahne = ({ unite, index, toplam, ters, onTik }: UniteSahneProps) => {
  const ozet = PILIER_ICERIK[unite.id]?.ozet ?? '';
  const numStr = String(index + 1).padStart(2, '0');
  const totStr = String(toplam).padStart(2, '0');

  return (
    <div className={`zigzag-sahne ${ters ? 'zigzag-ters' : ''}`}>
      {/* Timeline noktası — orta */}
      <div className="zigzag-dot" aria-hidden>
        <span>{numStr}</span>
      </div>

      {/* Görsel taraf */}
      <Reveal y={28} delay={0.05} className="zigzag-gorsel-col">
        <div className="zigzag-gorsel">
          <div className="zigzag-bg-num" aria-hidden>{numStr}</div>
          <div className="zigzag-icon">
            <Thiings name={unite.thiingsIcon} size={144} />
          </div>
          <span className="zigzag-corner zigzag-corner-tl">§ {numStr}</span>
          <span className="zigzag-corner zigzag-corner-br">{unite.sorular.length} soru</span>
        </div>
      </Reveal>

      {/* Metin taraf */}
      <Reveal y={28} delay={0.15} className="zigzag-metin-col">
        <div className="zigzag-metin">
          <div className="zigzag-meta">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
              Ünite {numStr} / {totStr}
            </span>
            <span className="zigzag-meta-cizgi" />
          </div>
          <h3 className="zigzag-baslik">{unite.ad}</h3>
          {ozet && <p className="zigzag-aciklama">{ozet}</p>}
          <div className="zigzag-zorluk-stripe">
            <span className="zigzag-zorluk z-kolay" />
            <span className="zigzag-zorluk z-orta" />
            <span className="zigzag-zorluk z-zor" />
            <span className="zigzag-zorluk-etiket">
              kolay <span className="text-ink-quiet">→</span> zor
            </span>
          </div>
          <button onClick={onTik} className="zigzag-kesfet">
            <span>Bu üniteyi keşfet</span>
            <Icon name="ArrowRight" size={13} />
          </button>
        </div>
      </Reveal>
    </div>
  );
};
