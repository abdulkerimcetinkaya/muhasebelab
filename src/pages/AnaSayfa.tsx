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
import { ZORLUK_AD, ZORLUK_PUAN, ZORLUK_STIL } from '../data/sabitler';
import type { Ilerleme, Istatistik, SoruWithUnite } from '../types';

interface OneriKartProps {
  etiket: string;
  etiketRenk: string;
  etiketIcon: string;
  rozet?: string;
  rozetRenk?: string;
  soru: SoruWithUnite;
  cta: string;
  ctaRenk: string;
  onTikla: () => void;
}

const OneriKart = ({
  etiket,
  etiketRenk,
  etiketIcon,
  rozet,
  rozetRenk,
  soru,
  cta,
  ctaRenk,
  onTikla,
}: OneriKartProps) => (
  <button
    onClick={onTikla}
    className="text-left bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-2xl p-6 transition flex flex-col h-full group"
  >
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <Icon name={etiketIcon} size={14} className={etiketRenk} />
      <span className={`text-[10px] tracking-[0.3em] uppercase font-bold ${etiketRenk}`}>
        {etiket}
      </span>
      {rozet && (
        <span
          className={`inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded ${rozetRenk}`}
        >
          {rozet}
        </span>
      )}
    </div>
    <div className="flex items-center gap-2 mb-2">
      <Thiings name={soru.uniteIcon} size={24} />
      <span className="text-[10px] text-stone-500 dark:text-zinc-500 font-bold tracking-wider uppercase truncate">
        {soru.uniteAd}
      </span>
      <span
        className={`text-[9px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[soru.zorluk]}`}
      >
        {ZORLUK_AD[soru.zorluk]} · {ZORLUK_PUAN[soru.zorluk]}p
      </span>
    </div>
    <h3 className="font-display text-xl font-bold tracking-tight mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
      {soru.baslik}
    </h3>
    <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium leading-relaxed line-clamp-2 mb-4 flex-1">
      {soru.senaryo}
    </p>
    <span
      className={`inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold ${ctaRenk}`}
    >
      {cta}
      <Icon name="ArrowRight" size={12} />
    </span>
  </button>
);

interface Props {
  ilerleme: Ilerleme;
  stat: Istatistik;
}

export const AnaSayfa = ({ ilerleme, stat }: Props) => {
  const { user, yukleniyor } = useAuth();

  if (yukleniyor) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center">
        <Icon name="Loader2" size={20} className="animate-spin text-stone-500" />
      </main>
    );
  }

  if (user) return <KullaniciPaneli ilerleme={ilerleme} stat={stat} />;
  return <AnonimAnaSayfa />;
};

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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <section className="mb-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-2 font-bold">
          {selamlama}
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold leading-none mb-3">
          {ad}
        </h1>
        <p className="text-base text-stone-600 dark:text-zinc-400 font-medium">
          {henuzCozulmemis
            ? 'Hadi ilk soruyu çözelim. 30 saniyede bitiyor.'
            : hedefTamam
              ? `Bugünkü hedefi tamamladın. ${ilerleme.streak} gündür seri devam ediyor.`
              : ilerleme.streak > 0
                ? `${ilerleme.streak} gündür üst üste çalışıyorsun. Bugün ${bugunCozulen}/${gunlukHedef} soru.`
                : 'Bugün küçük bir başlangıç yap, seri kurmaya başla.'}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <section className="lg:col-span-2">
          {aktifUnite && devamSoru ? (
            <button
              onClick={() => nav(`/problemler/${devamSoru.id}`)}
              className="w-full text-left bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-600 dark:to-blue-800 text-white rounded-2xl p-7 md:p-8 shadow-xl hover:shadow-2xl transition group"
            >
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-blue-200 mb-2 font-bold">
                    {henuzCozulmemis ? 'İlk Soru' : 'Devam Et'}
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-blue-100">
                    <Thiings name={aktifUnite.unite.thiingsIcon} size={28} />
                    <span>{aktifUnite.unite.ad}</span>
                    <span className="font-mono text-xs opacity-70">
                      · {aktifUnite.cozulen}/{aktifUnite.toplam}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl tracking-tight font-bold leading-tight mb-3">
                    {devamSoru.baslik}
                  </h2>
                  <p className="text-sm text-blue-100/80 font-medium leading-relaxed line-clamp-2 max-w-xl">
                    {devamSoru.senaryo}
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 group-hover:bg-white/25 transition flex-shrink-0">
                  <Icon name="ArrowRight" size={22} className="text-white" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`uppercase tracking-[0.2em] font-bold px-2 py-1 rounded bg-white/15 ${ZORLUK_STIL[devamSoru.zorluk]}`}
                  style={{ color: 'white' }}
                >
                  {ZORLUK_AD[devamSoru.zorluk]} · {ZORLUK_PUAN[devamSoru.zorluk]}p
                </span>
                <span className="uppercase tracking-[0.2em] font-bold inline-flex items-center gap-1.5">
                  <Icon name="Zap" size={12} /> Çözmeye Başla
                </span>
              </div>
            </button>
          ) : (
            <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-8 text-center">
              <Thiings name="trophy" size={64} />
              <h2 className="font-display text-2xl font-bold tracking-tight mt-4 mb-2">
                Tüm soruları çözdün!
              </h2>
              <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium mb-5">
                Yeni soruları beklerken yanlışlarını tekrar edebilirsin.
              </p>
              <button
                onClick={() => nav('/problemler')}
                className="bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-5 py-2.5 text-xs tracking-wide uppercase font-bold rounded-lg"
              >
                Tüm Sorular
              </button>
            </div>
          )}
        </section>

        <aside className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-6">
          <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-4 font-bold">
            Bugünkü Hedef
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="font-display text-5xl font-bold tracking-tight">{bugunCozulen}</span>
            <span className="font-mono text-base text-stone-400 dark:text-zinc-600 font-bold">
              / {gunlukHedef}
            </span>
          </div>
          <div className="h-2 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all ${hedefTamam ? 'bg-emerald-600' : 'bg-blue-700 dark:bg-blue-500'}`}
              style={{ width: `${hedefYuzde}%` }}
            />
          </div>
          <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium leading-relaxed mb-5">
            {hedefTamam
              ? 'Hedefi tamamladın. İstersen daha fazla çözebilirsin.'
              : `${gunlukHedef - bugunCozulen} soru daha. Bugünü kaçırmadan kapat.`}
          </div>
          <div className="pt-4 border-t border-stone-100 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-stone-600 dark:text-zinc-400 font-medium">
                <Icon
                  name="Flame"
                  size={13}
                  className={ilerleme.streak > 0 ? 'text-orange-600' : 'text-stone-400 dark:text-zinc-600'}
                />
                Seri
              </span>
              <span className="font-mono font-bold">{ilerleme.streak} gün</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-stone-600 dark:text-zinc-400 font-medium">
                <Icon name="Trophy" size={13} className="text-amber-600" />
                Toplam Puan
              </span>
              <span className="font-mono font-bold">{ilerleme.puan}</span>
            </div>
          </div>
        </aside>
      </div>

      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
            Yan Görevler
          </h2>
          <button
            onClick={() => nav('/problemler')}
            className="text-xs text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 font-semibold flex items-center gap-1"
          >
            Tüm sorular <Icon name="ArrowRight" size={12} />
          </button>
        </div>
        <div className={`grid grid-cols-1 ${gununSoru && yanlisSoru ? 'md:grid-cols-2' : ''} gap-4`}>
          {gununSoru && (
            <OneriKart
              etiket="Günün Sorusu"
              etiketRenk="text-amber-600 dark:text-amber-400"
              etiketIcon="Calendar"
              rozet={gununCozulduMu ? '✓ Çözüldü' : undefined}
              rozetRenk="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
              soru={gununSoru}
              cta={gununCozulduMu ? 'Tekrar Çöz' : 'Bugünü Çöz'}
              ctaRenk="text-amber-700 dark:text-amber-400"
              onTikla={() => nav(`/problemler/${gununSoru.id}`)}
            />
          )}
          {yanlisSoru && (
            <OneriKart
              etiket="Yanlışını Tekrar Et"
              etiketRenk="text-rose-600 dark:text-rose-400"
              etiketIcon="RotateCcw"
              rozet={`× ${ilerleme.yanlislar[yanlisSoru.id]}`}
              rozetRenk="bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300"
              soru={yanlisSoru}
              cta="Yeniden Dene"
              ctaRenk="text-rose-600 dark:text-rose-400"
              onTikla={() => nav(`/problemler/${yanlisSoru.id}`)}
            />
          )}
        </div>
      </section>

      {yanlisListe.length > 1 && (
        <section className="mb-10">
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-4">
            Sıkıntı Yaşadığın Sorular
          </h2>
          <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl divide-y divide-stone-100 dark:divide-zinc-800 overflow-hidden">
            {yanlisListe.map(({ soru, sayi }) => (
              <button
                key={soru.id}
                onClick={() => nav(`/problemler/${soru.id}`)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 dark:hover:bg-zinc-800 transition text-left"
              >
                <Thiings name={soru.uniteIcon} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm tracking-tight truncate">
                    {soru.baslik}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                    {soru.uniteAd}
                  </div>
                </div>
                <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold flex-shrink-0">
                  × {sayi}
                </span>
                <Icon name="ChevronRight" size={14} className="text-stone-300 dark:text-zinc-600" />
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mb-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => nav('/uniteler')}
            className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-5 transition flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <Icon name="LayoutGrid" size={18} className="text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-tight">Üniteler</div>
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium">
                Konuya göre sorular
              </div>
            </div>
          </button>
          <button
            onClick={() => nav('/problemler')}
            className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-5 transition flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
              <Icon name="ListChecks" size={18} className="text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-tight">Tüm Sorular</div>
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium">
                Filtreyle ara
              </div>
            </div>
          </button>
          <button
            onClick={() => nav('/profil')}
            className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-5 transition flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={18} className="text-violet-700 dark:text-violet-400" />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-tight">Profil</div>
              <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium">
                İstatistik · Rozet · Geçmiş
              </div>
            </div>
          </button>
        </div>
      </section>
    </main>
  );
};

const OZELLIKLER = [
  {
    icon: 'calculator',
    baslik: 'Gerçek Hayat Senaryoları',
    aciklama:
      'Ders kitaplarındaki yapmacık örnekler değil. Peşin mal satışı, KDV mahsubu, amortisman ayırma, maaş tahakkuku — işletmelerde gerçekten karşına çıkacak işlemler.',
    mockup: 'senaryo' as const,
  },
  {
    icon: 'rocket',
    baslik: 'Anlık Geri Bildirim',
    aciklama:
      'Yanlış satırlar kırmızı işaretlenir, doğrular yeşil. Her soruda ipucu, resmi çözüm ve detaylı açıklama. Nerede yanıldığını görmeden geçmezsin.',
    mockup: 'kontrol' as const,
  },
  {
    icon: 'chart',
    baslik: 'İlerleme Takibi',
    aciklama:
      'Hangi üniteyi bitirdin, hangi konularda zayıfsın, kaç gündür üst üste çalışıyorsun — hepsi istatistik panelinde. Rozetler ve puan sistemiyle motivasyon hep taze.',
    mockup: 'istatistik' as const,
  },
  {
    icon: 'trophy',
    baslik: 'Üç Zorluk Seviyesi',
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
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 md:pt-24 pb-20 md:pb-24 paper-texture overflow-hidden">
        <div className="absolute left-4 md:left-12 top-32 pointer-events-none hidden md:block">
          <Thiings name="dolar" size={120} animate="float" />
        </div>
        <div className="absolute right-4 md:right-12 top-20 pointer-events-none hidden md:block">
          <Thiings name="tl" size={140} animate="float-2" />
        </div>
        <div className="absolute left-8 md:left-24 bottom-8 pointer-events-none hidden lg:block">
          <Thiings name="euro" size={100} animate="float-3" />
        </div>
        <div className="absolute right-8 md:right-24 bottom-16 pointer-events-none hidden lg:block">
          <Thiings name="yen" size={90} animate="float-4" />
        </div>

        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-6 font-bold">
            <span className="w-8 h-px bg-stone-400 dark:bg-zinc-600"></span>
            Editio I · MMXXVI
            <span className="w-8 h-px bg-stone-400 dark:bg-zinc-600"></span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight max-w-5xl mx-auto font-bold">
            <span className="block gradient-blue">Muhasebe yeteneklerinizi</span>
            <span className="block mt-2">bir uzman gibi geliştirin.</span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-xl text-stone-600 dark:text-zinc-400 leading-relaxed font-medium">
            Tek Düzen Hesap Planı ile kodlama değil, kayıt. Senaryoları okuyun, yevmiye defterine
            işleyin, anında doğrulayın.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
            <span className="font-mono text-stone-900 dark:text-zinc-100">
              {tumSorular.length}
            </span>
            <span>soru</span>
            <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-zinc-600" />
            <span className="font-mono text-stone-900 dark:text-zinc-100">{uniteler.length}</span>
            <span>ünite</span>
            <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-zinc-600" />
            <span>Ücretsiz</span>
          </div>
          <div className="mt-10 flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => nav('/problemler')}
              className="bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-8 py-4 text-sm tracking-wide uppercase font-bold hover:bg-stone-800 dark:hover:bg-white transition inline-flex items-center gap-3 rounded-xl shadow-lg"
            >
              <Icon name="Zap" size={14} />
              Hemen Çözmeye Başla
            </button>
            <button
              onClick={() => nav('/giris')}
              className="border-2 border-stone-300 dark:border-zinc-700 px-8 py-4 text-sm tracking-wide uppercase font-bold hover:border-stone-900 dark:hover:border-zinc-400 transition rounded-xl inline-flex items-center gap-2"
            >
              <Icon name="UserPlus" size={14} />
              Hesap Oluştur
            </button>
          </div>
          <div className="mt-6 text-xs text-stone-500 dark:text-zinc-500 font-medium">
            Kayıt zorunlu değil — istersen hemen başla, ilerlemeni kaydetmek için 30 saniyede hesap aç.
          </div>
        </div>
      </section>

      {gununSoru && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Calendar" size={14} className="text-amber-600" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-amber-700 dark:text-amber-400 font-bold">
                    Günün Sorusu
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Thiings name={gununSoru.uniteIcon} size={28} />
                  <span className="text-xs text-stone-500 dark:text-zinc-500 font-bold tracking-wide uppercase">
                    {gununSoru.uniteAd}
                  </span>
                  <span
                    className={`text-[10px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[gununSoru.zorluk]}`}
                  >
                    {ZORLUK_AD[gununSoru.zorluk]} · {ZORLUK_PUAN[gununSoru.zorluk]}p
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl tracking-tight font-bold mb-2">
                  {gununSoru.baslik}
                </h2>
                <p className="text-stone-600 dark:text-zinc-400 font-medium leading-relaxed line-clamp-2">
                  {gununSoru.senaryo}
                </p>
              </div>
              <button
                onClick={() => nav(`/problemler/${gununSoru.id}`)}
                className="flex-shrink-0 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3 text-sm tracking-wide uppercase font-bold transition inline-flex items-center gap-2 rounded-xl shadow-md"
              >
                Çözmeye Başla
                <Icon name="ArrowRight" size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="screen-mockup">
          <div className="screen-mockup-bar">
            <div className="screen-mockup-dot"></div>
            <div className="screen-mockup-dot"></div>
            <div className="screen-mockup-dot"></div>
            <div className="ml-4 text-[10px] font-mono text-stone-500 font-semibold">
              muhasebelab.app / problemler / pesin-mal-satisi
            </div>
          </div>
          <div className="p-6 md:p-10">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded">
                  <Icon name="FileText" size={12} />
                  Soru · Mal-3
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 dark:text-amber-400">
                  Orta · 10p
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-400 dark:text-zinc-600 font-semibold">
                Yevmiye Kaydı
              </span>
            </div>
            <div className="font-display text-2xl md:text-3xl tracking-tight font-bold mb-3">
              Peşin Mal Satışı
            </div>
            <div className="border-l-2 border-blue-700 dark:border-blue-400 pl-4 py-2 mb-6 bg-blue-50/40 dark:bg-blue-950/20 rounded-r">
              <div className="text-sm md:text-base text-stone-800 dark:text-zinc-200 leading-relaxed font-medium">
                İşletme, ticari mal satışından <span className="font-mono font-bold">10.000 ₺ + %20 KDV</span> tutarında peşin tahsilat yapmıştır. Yevmiye kaydını yapınız.
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-stone-200 dark:border-zinc-700 text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold bg-stone-50 dark:bg-zinc-800/50">
                <div className="col-span-2">Kod</div>
                <div className="col-span-5">Hesap Adı</div>
                <div className="col-span-2 text-right">Borç</div>
                <div className="col-span-2 text-right">Alacak</div>
                <div className="col-span-1"></div>
              </div>
              {[
                { k: '100', a: 'KASA', b: '12.000,00', al: '', ok: true },
                { k: '600', a: 'YURT İÇİ SATIŞLAR', b: '', al: '10.000,00', ok: true },
                { k: '391', a: 'HESAPLANAN KDV', b: '', al: '2.000,00', ok: true },
              ].map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-2 px-4 py-2.5 text-xs md:text-sm font-mono border-b border-stone-100 dark:border-zinc-800 last:border-b-0"
                >
                  <div className="col-span-2 font-bold">{r.k}</div>
                  <div className="col-span-5 truncate font-medium">{r.a}</div>
                  <div className="col-span-2 text-right">{r.b}</div>
                  <div className="col-span-2 text-right">{r.al}</div>
                  <div className="col-span-1 flex justify-end items-center">
                    <Icon name="Check" size={12} className="text-emerald-600" />
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-xs md:text-sm font-mono border-t-2 border-stone-900/10 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800/30 font-bold">
                <div className="col-span-7">TOPLAM</div>
                <div className="col-span-2 text-right">12.000,00</div>
                <div className="col-span-2 text-right">12.000,00</div>
                <div className="col-span-1 flex justify-end items-center">
                  <Icon name="CheckCircle2" size={14} className="text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase font-bold text-emerald-700 dark:text-emerald-400">
                <Icon name="CheckCircle2" size={14} />
                Borç = Alacak · Kayıt dengeli
              </div>
              <span className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg">
                <Icon name="Check" size={12} />
                Doğru Cevap · +10p
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-16">
          <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-4 font-bold">
            Nasıl Çalışır
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold">
            Öğrenmek için{' '}
            <em className="font-display-soft italic text-blue-700 dark:text-blue-400">
              pratik yapın.
            </em>
          </h2>
        </div>

        <div className="space-y-24">
          {OZELLIKLER.map((o, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="screen-mockup">
                <div className="screen-mockup-bar">
                  <div className="screen-mockup-dot"></div>
                  <div className="screen-mockup-dot"></div>
                  <div className="screen-mockup-dot"></div>
                </div>
                <OzellikMockup tip={o.mockup} />
              </div>
              <div>
                <div className="mb-6">
                  <Thiings name={o.icon} size={80} />
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-3 font-bold">
                  Özellik · {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 leading-tight font-bold">
                  {o.baslik}
                </h3>
                <p className="text-lg text-stone-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {o.aciklama}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-amber-200 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-950/30 dark:via-zinc-900 dark:to-amber-950/30 p-8 md:p-12">
          <div className="absolute -right-6 -top-6 opacity-30 pointer-events-none">
            <Thiings name="trophy" size={160} />
          </div>
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-amber-700 dark:text-amber-400 font-bold mb-4">
              <Icon name="Sparkles" size={14} />
              Premium
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight font-bold mb-4 leading-tight">
              Sıkıştığında{' '}
              <em className="font-display-soft italic text-amber-700 dark:text-amber-400">
                yapay zekâ
              </em>{' '}
              yanında.
            </h2>
            <p className="text-base md:text-lg text-stone-700 dark:text-zinc-300 leading-relaxed font-medium mb-6">
              Yanlış cevap analizi, AI asistan ipuçları ve hesap kodu otomatik tamamlama Premium ile
              gelir.
              {aylikPlan && donemlikPlan ? (
                <>
                  {' '}
                  Aylık <span className="font-mono font-bold">{aylikPlan.tutar.toFixed(0)} ₺</span>,
                  dönemlik ({donemlikPlan.ay_sayisi} ay){' '}
                  <span className="font-mono font-bold">{donemlikPlan.tutar.toFixed(0)} ₺</span>.
                </>
              ) : (
                ' Aylık ve dönemlik abonelik seçenekleri.'
              )}{' '}
              İlk 100 kullanıcıya 1 yıl ücretsiz.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => nav('/premium')}
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold transition inline-flex items-center gap-2 rounded-xl shadow-md"
              >
                <Icon name="Sparkles" size={14} />
                Premium'u Keşfet
              </button>
              <button
                onClick={() => nav('/problemler')}
                className="border border-stone-300 dark:border-zinc-700 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:border-stone-900 dark:hover:border-zinc-400 transition rounded-xl"
              >
                Önce Ücretsiz Dene
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <div className="border-t border-stone-900/10 dark:border-zinc-800 pt-16">
          <div className="flex justify-center mb-6">
            <Thiings name="rocket" size={80} animate="float" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 font-bold">
            Başlamaya{' '}
            <em className="font-display-soft italic text-blue-700 dark:text-blue-400">
              hazır mısın?
            </em>
          </h2>
          <p className="text-lg text-stone-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto font-medium">
            Ücretsiz hesap aç, ilerlemeni kaydet, rozet kazan. 30 saniye sürer.
          </p>
          <button
            onClick={() => nav('/giris')}
            className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-10 py-4 text-sm tracking-wide uppercase font-bold transition inline-flex items-center gap-3 rounded-xl shadow-xl shadow-blue-700/20"
          >
            <Icon name="UserPlus" size={14} />
            Hesap Oluştur
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      </section>

    </main>
  );
};
