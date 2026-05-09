import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { IcerikGoruntuleyici } from '../components/IcerikGoruntuleyici';
import { TamamRozeti } from '../components/TamamRozeti';
import { useUniteler } from '../contexts/UnitelerContext';
import { ZORLUK_AD, ZORLUK_PUAN, ZORLUK_STIL } from '../data/sabitler';
import { kilidiAcanKonu, konuKilitliMi, konuTamamlandiMi } from '../lib/konu-kilit';
import type { Ilerleme } from '../types';

const icerikDolu = (icerik: unknown | null | undefined): boolean =>
  Array.isArray(icerik) && icerik.length > 0;

interface Props {
  ilerleme: Ilerleme;
}

/**
 * DergiPark-tarzı akademik makale layout'u — konu detay sayfası.
 * - Üst koyu banner: konu başlığı, meta, CTA butonları
 * - Sol ana içerik: öz, anahtar kelimeler, içerik, ilgili sorular, ayrıntılar
 * - Sağ sticky sidebar: ünite konuları, ilerleme, paylaş
 * - Mobil: sidebar hamburger ile açılır (overlay)
 */
export const KonuSayfasi = ({ ilerleme }: Props) => {
  const { uniteId, konuId } = useParams<{ uniteId: string; konuId: string }>();
  const nav = useNavigate();
  const { uniteler } = useUniteler();
  const [sidebarAcik, setSidebarAcik] = useState(false);

  const unite = uniteler.find((u) => u.id === uniteId);
  const konular = unite?.konular ?? [];
  const konu = konular.find((k) => k.id === konuId);

  useEffect(() => {
    if (!unite) {
      nav('/uniteler', { replace: true });
      return;
    }
    if (!konu) {
      nav(`/uniteler/${uniteId}`, { replace: true });
    }
  }, [unite, konu, uniteId, nav]);

  // Konu değişince sidebar'ı kapat
  useEffect(() => {
    setSidebarAcik(false);
  }, [konuId]);

  // Konu listesini ve ilerleme verisini hook tabanına al — early return önce
  const konularEnriched = useMemo(() => {
    return konular.map((k) => {
      const kSoru = k.sorular.length;
      const kCozulen = k.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
      return {
        ...k,
        soruSayisi: kSoru,
        cozulen: kCozulen,
        tamam: konuTamamlandiMi(k, ilerleme),
        baslandi: kCozulen > 0,
        kilitli: konuKilitliMi(konular, k, ilerleme),
      };
    });
  }, [konular, ilerleme]);

  if (!unite || !konu) return null;

  const aktifIndex = konular.findIndex((k) => k.id === konu.id);
  const sonrakiKonu = aktifIndex >= 0 ? konular[aktifIndex + 1] : null;
  const oncekiKonu = aktifIndex > 0 ? konular[aktifIndex - 1] : null;

  const toplam = konu.sorular.length;
  const cozulen = konu.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
  const yuzde = toplam > 0 ? Math.round((cozulen / toplam) * 100) : 0;
  const tamamlandi = toplam > 0 && cozulen === toplam;

  const ilkCozulmemis = konu.sorular.find((s) => !ilerleme.cozulenler[s.id]);
  const anlatimVar = icerikDolu(konu.icerik);
  const kilitliyse = konuKilitliMi(konular, konu, ilerleme);
  const acanKonu = kilidiAcanKonu(konular, konu, ilerleme);

  const tahminiOkumaSuresi = anlatimVar ? '~10-15 dk' : null;

  // Anahtar kelimeler — konu adı + ünite adından parse, ileride hesap kodları eklenir
  const anahtarKelimeler = [unite.ad, konu.ad].filter(Boolean);

  return (
    <main className="bg-stone-50 dark:bg-zinc-950 min-h-screen">
      {/* ════════════════════════════════════════════════════════════ */}
      {/* ÜST BANNER (DergiPark esin) — full-width, koyu                 */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="bg-stone-900 dark:bg-zinc-900 text-stone-50 dark:text-zinc-100 border-b-2" style={{ borderBottomColor: 'var(--copper, #b87333)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] mb-5 flex-wrap text-stone-400 dark:text-zinc-500">
            <button
              onClick={() => nav('/uniteler')}
              className="hover:text-stone-50 dark:hover:text-zinc-100 transition font-semibold"
            >
              Üniteler
            </button>
            <Icon name="ChevronRight" size={11} className="opacity-60" />
            <button
              onClick={() => nav(`/uniteler/${unite.id}`)}
              className="hover:text-stone-50 dark:hover:text-zinc-100 transition font-semibold"
            >
              {unite.ad}
            </button>
            <Icon name="ChevronRight" size={11} className="opacity-60" />
            <span className="text-stone-50 dark:text-zinc-100 font-bold truncate max-w-xs">
              {konu.ad}
            </span>
          </nav>

          <div className="flex items-start gap-6">
            {/* Sol: ana banner içerik */}
            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] tracking-[0.3em] uppercase font-bold mb-3"
                style={{ color: 'var(--copper, #d4a574)' }}
              >
                KONU ANLATIMI · {unite.ad.toUpperCase()}
              </div>

              <h1 className="font-display text-3xl md:text-5xl tracking-tight font-bold leading-[1.1] mb-3">
                {konu.ad}
              </h1>

              {konu.aciklama && (
                <p className="text-[14.5px] md:text-[15px] text-stone-300 dark:text-zinc-400 leading-relaxed font-medium max-w-2xl mb-5">
                  {konu.aciklama}
                </p>
              )}

              {/* Meta satırı */}
              <div className="flex items-center gap-4 mb-6 flex-wrap text-[12px] text-stone-400 dark:text-zinc-500 font-mono">
                <span>
                  Konu {String(aktifIndex + 1).padStart(2, '0')} / {konular.length}
                </span>
                <span className="opacity-50">·</span>
                <span>{toplam} soru</span>
                {tahminiOkumaSuresi && (
                  <>
                    <span className="opacity-50">·</span>
                    <span>{tahminiOkumaSuresi}</span>
                  </>
                )}
                {tamamlandi && (
                  <>
                    <span className="opacity-50">·</span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <TamamRozeti size={11} />
                      Tamamlandı
                    </span>
                  </>
                )}
                {kilitliyse && (
                  <>
                    <span className="opacity-50">·</span>
                    <span className="inline-flex items-center gap-1 text-amber-400">
                      <Icon name="Lock" size={11} />
                      Kilitli
                    </span>
                  </>
                )}
              </div>

              {/* CTA Butonları */}
              <div className="flex items-center gap-2 flex-wrap">
                {ilkCozulmemis ? (
                  <button
                    onClick={() => nav(`/problemler/${ilkCozulmemis.id}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg shadow-lg hover:opacity-90 transition"
                    style={{ backgroundColor: 'var(--copper, #b87333)', color: '#fff' }}
                  >
                    <Icon name="Zap" size={13} />
                    {cozulen > 0 ? 'Devam Et' : 'Soruları Çöz'}
                    <Icon name="ArrowRight" size={13} />
                  </button>
                ) : tamamlandi ? (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-300 px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg"
                  >
                    <TamamRozeti size={13} />
                    Bu Konu Tamamlandı
                  </button>
                ) : null}

                <button
                  onClick={() => nav(`/uniteler/${unite.id}`)}
                  className="inline-flex items-center gap-2 border border-stone-700 dark:border-zinc-700 hover:bg-stone-800 dark:hover:bg-zinc-800 px-4 py-2.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg transition"
                >
                  <Icon name="ArrowLeft" size={12} />
                  Üniteye Dön
                </button>

                {/* Mobil hamburger — sidebar aç */}
                <button
                  type="button"
                  onClick={() => setSidebarAcik(true)}
                  className="lg:hidden ml-auto inline-flex items-center gap-2 border border-stone-700 dark:border-zinc-700 hover:bg-stone-800 dark:hover:bg-zinc-800 px-3 py-2.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg transition"
                  aria-label="Konular menüsü"
                >
                  <Icon name="Menu" size={13} />
                  Konular
                </button>
              </div>
            </div>

            {/* Sağ: ünite ikonu (DergiPark'taki dergi kapağı muadili) — desktop only */}
            <div className="hidden md:flex flex-shrink-0 items-center justify-center w-[100px] h-[140px] rounded-lg bg-stone-800/60 dark:bg-zinc-800/60 border border-stone-700 dark:border-zinc-700">
              <Thiings name={unite.thiingsIcon} size={56} />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* KİLİT UYARI BANNER'I                                          */}
      {/* ════════════════════════════════════════════════════════════ */}
      {kilitliyse && acanKonu && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/70 dark:bg-amber-950/20 text-[13px] text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <Icon name="Lock" size={14} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold mb-0.5">Bu konu henüz kilitli</div>
              <div className="text-[12.5px] leading-relaxed">
                Önce{' '}
                <button
                  onClick={() => nav(`/uniteler/${unite.id}/${acanKonu.id}`)}
                  className="font-bold underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-100 transition"
                >
                  {acanKonu.ad}
                </button>{' '}
                konusunu bitir, kilit otomatik açılır. İstersen yine de buradan okuyup soruları
                çözebilirsin.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* İÇERİK GRID (sol main + sağ sidebar)                          */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* ───── SOL: Ana içerik ───── */}
          <div className="min-w-0 space-y-10">
            {/* Öz */}
            {konu.aciklama && (
              <section>
                <SectionTitle>Öz</SectionTitle>
                <p className="text-[15px] text-stone-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {konu.aciklama}
                </p>
              </section>
            )}

            {/* Anahtar Kelimeler */}
            {anahtarKelimeler.length > 0 && (
              <section>
                <SectionTitle>Anahtar Kelimeler</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {anahtarKelimeler.map((k) => (
                    <span
                      key={k}
                      className="text-[12px] font-mono px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-zinc-300"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* İçerik */}
            <section>
              <SectionTitle>İçerik</SectionTitle>
              {anlatimVar ? (
                <div className="bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 rounded-2xl px-2 py-2 sm:px-4 sm:py-4">
                  <IcerikGoruntuleyici key={konu.id} icerik={konu.icerik} />
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900/40 border border-dashed border-stone-300 dark:border-zinc-700 rounded-2xl px-6 py-8 text-center">
                  <p className="text-[14px] text-stone-500 dark:text-zinc-500 leading-relaxed">
                    Bu konunun anlatımı henüz hazırlanmadı. Sorulara doğrudan başlayabilirsin.
                  </p>
                </div>
              )}
            </section>

            {/* İlgili Sorular — DergiPark "Kaynakça" muadili: numbered list */}
            {toplam > 0 && (
              <section>
                <SectionTitle>İlgili Sorular</SectionTitle>
                <ol className="rounded-2xl bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 divide-y divide-stone-200 dark:divide-zinc-800 overflow-hidden">
                  {konu.sorular.map((s, i) => {
                    const cozulmus = !!ilerleme.cozulenler[s.id];
                    const yanlisSayi = ilerleme.yanlislar[s.id] || 0;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => nav(`/problemler/${s.id}`)}
                          className="w-full flex items-start gap-4 px-4 sm:px-5 py-3.5 text-left hover:bg-stone-50 dark:hover:bg-zinc-800/40 transition group"
                        >
                          <span className="font-mono text-[12px] text-stone-400 dark:text-zinc-600 font-bold tabular-nums w-6 flex-shrink-0 mt-0.5">
                            {i + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-display font-bold text-[14.5px] tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition leading-snug">
                              {s.baslik}
                            </div>
                            <div className="text-[12px] text-stone-500 dark:text-zinc-500 leading-relaxed font-medium line-clamp-1 mt-0.5">
                              {s.senaryo}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span
                                className={`text-[10px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[s.zorluk]}`}
                              >
                                {ZORLUK_AD[s.zorluk]}
                              </span>
                              <span className="font-mono text-[10px] text-stone-400 dark:text-zinc-600 font-bold">
                                {ZORLUK_PUAN[s.zorluk]}p
                              </span>
                              {yanlisSayi > 0 && !cozulmus && (
                                <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-rose-600 dark:text-rose-400">
                                  {yanlisSayi} hata
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="flex-shrink-0 mt-1">
                            {cozulmus ? (
                              <TamamRozeti size={16} />
                            ) : yanlisSayi > 0 ? (
                              <Icon name="XCircle" size={16} className="text-rose-500" />
                            ) : (
                              <Icon
                                name="Circle"
                                size={16}
                                className="text-stone-300 dark:text-zinc-700"
                              />
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            {/* Ayrıntılar — DergiPark metadata table muadili */}
            <section>
              <SectionTitle>Ayrıntılar</SectionTitle>
              <div className="rounded-2xl bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 overflow-hidden">
                <DetayRow etiket="Ünite" deger={unite.ad} />
                <DetayRow
                  etiket="Konu Sırası"
                  deger={`${aktifIndex + 1} / ${konular.length}`}
                />
                <DetayRow etiket="Toplam Soru" deger={`${toplam}`} />
                <DetayRow etiket="Çözülen" deger={`${cozulen} (%${yuzde})`} />
                <DetayRow
                  etiket="Durum"
                  deger={
                    tamamlandi
                      ? 'Tamamlandı'
                      : kilitliyse
                        ? 'Kilitli'
                        : cozulen > 0
                          ? 'Devam ediyor'
                          : 'Başlanmadı'
                  }
                />
              </div>
            </section>

            {/* Önceki / sonraki konu */}
            {(oncekiKonu || sonrakiKonu) && (
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {oncekiKonu ? (
                  <button
                    onClick={() => nav(`/uniteler/${unite.id}/${oncekiKonu.id}`)}
                    className="group text-left bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-4 transition"
                  >
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1.5">
                      <Icon name="ArrowLeft" size={11} />
                      Önceki konu
                    </div>
                    <div className="font-display text-[15px] font-bold tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                      {oncekiKonu.ad}
                    </div>
                  </button>
                ) : (
                  <span />
                )}
                {sonrakiKonu ? (
                  <button
                    onClick={() => nav(`/uniteler/${unite.id}/${sonrakiKonu.id}`)}
                    className={`group text-right bg-white dark:bg-zinc-900/40 border rounded-xl p-4 transition ${
                      tamamlandi
                        ? 'border-emerald-300 dark:border-emerald-700/50 hover:border-emerald-600'
                        : 'border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-end gap-2 text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1.5">
                      {tamamlandi ? 'Sıradaki konu' : 'Sonraki konu'}
                      <Icon name="ArrowRight" size={11} />
                    </div>
                    <div className="font-display text-[15px] font-bold tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                      {sonrakiKonu.ad}
                    </div>
                  </button>
                ) : (
                  <span />
                )}
              </section>
            )}
          </div>

          {/* ───── SAĞ: Sticky sidebar (desktop) ───── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              {/* Bu Ünitedeki Konular */}
              <SidebarKonuListesi
                unite={unite}
                konularEnriched={konularEnriched}
                aktifKonuId={konu.id}
                onSelect={(id) => nav(`/uniteler/${unite.id}/${id}`)}
              />

              {/* İlerleme */}
              <SidebarIlerleme
                cozulen={cozulen}
                toplam={toplam}
                yuzde={yuzde}
                tamamlandi={tamamlandi}
              />

              {/* Paylaş */}
              <SidebarPaylas konuAd={konu.ad} uniteAd={unite.ad} />
            </div>
          </aside>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MOBİL HAMBURGER OVERLAY                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      {sidebarAcik && (
        <div
          className="fixed inset-0 z-[100] lg:hidden flex"
          role="dialog"
        >
          {/* Backdrop */}
          <button
            type="button"
            onClick={() => setSidebarAcik(false)}
            className="flex-1 bg-black/40 backdrop-blur-sm"
            aria-label="Kapat"
          />
          {/* Drawer (sağdan) */}
          <div className="w-[300px] max-w-[85vw] bg-stone-50 dark:bg-zinc-950 border-l border-stone-200 dark:border-zinc-800 overflow-y-auto p-4 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold tracking-tight">Bu Ünite</h2>
              <button
                type="button"
                onClick={() => setSidebarAcik(false)}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition"
                aria-label="Kapat"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <SidebarKonuListesi
              unite={unite}
              konularEnriched={konularEnriched}
              aktifKonuId={konu.id}
              onSelect={(id) => {
                nav(`/uniteler/${unite.id}/${id}`);
                setSidebarAcik(false);
              }}
            />
            <SidebarIlerleme
              cozulen={cozulen}
              toplam={toplam}
              yuzde={yuzde}
              tamamlandi={tamamlandi}
            />
            <SidebarPaylas konuAd={konu.ad} uniteAd={unite.ad} />
          </div>
        </div>
      )}
    </main>
  );
};

// ─── Yardımcı bileşenler ────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-3 pb-2 border-b border-stone-200 dark:border-zinc-800">
    {children}
  </h2>
);

const DetayRow = ({ etiket, deger }: { etiket: string; deger: string }) => (
  <div className="flex items-baseline justify-between px-4 py-2.5 border-b border-stone-100 dark:border-zinc-800 last:border-0">
    <span className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
      {etiket}
    </span>
    <span className="text-[13px] text-stone-800 dark:text-zinc-200 font-medium font-mono">
      {deger}
    </span>
  </div>
);

interface KonuEnriched {
  id: string;
  ad: string;
  soruSayisi: number;
  cozulen: number;
  tamam: boolean;
  baslandi: boolean;
  kilitli: boolean;
}

const SidebarKonuListesi = ({
  unite,
  konularEnriched,
  aktifKonuId,
  onSelect,
}: {
  unite: { ad: string; thiingsIcon: string };
  konularEnriched: KonuEnriched[];
  aktifKonuId: string;
  onSelect: (id: string) => void;
}) => (
  <div className="bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 rounded-2xl p-4">
    <div className="flex items-center gap-2 mb-3 px-2">
      <Thiings name={unite.thiingsIcon} size={28} />
      <div className="min-w-0">
        <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
          Bu Ünite
        </div>
        <div className="font-display text-[14px] font-bold tracking-tight text-stone-900 dark:text-zinc-100 leading-tight truncate">
          {unite.ad}
        </div>
      </div>
    </div>
    <div className="border-t border-stone-200 dark:border-zinc-700 pt-3">
      <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2 px-2">
        Konular
      </div>
      <ul className="space-y-0.5">
        {konularEnriched.map((k, i) => {
          const aktif = k.id === aktifKonuId;
          return (
            <li key={k.id}>
              <button
                onClick={() => onSelect(k.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition ${
                  aktif
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100'
                    : k.kilitli
                      ? 'opacity-55 hover:opacity-80 text-stone-600 dark:text-zinc-500'
                      : 'hover:bg-stone-50 dark:hover:bg-zinc-800/60 text-stone-700 dark:text-zinc-300'
                }`}
              >
                <span className="flex-shrink-0">
                  {k.kilitli ? (
                    <Icon
                      name="Lock"
                      size={13}
                      className="text-stone-400 dark:text-zinc-600"
                    />
                  ) : k.tamam ? (
                    <TamamRozeti size={14} />
                  ) : k.baslandi ? (
                    <Icon
                      name="CircleDashed"
                      size={14}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  ) : (
                    <Icon
                      name="Circle"
                      size={14}
                      className="text-stone-300 dark:text-zinc-700"
                    />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] tracking-wider text-stone-400 dark:text-zinc-600 font-bold mr-1.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[13px] ${aktif ? 'font-bold' : 'font-semibold'} truncate`}
                  >
                    {k.ad}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-stone-400 dark:text-zinc-600 font-bold tabular-nums flex-shrink-0">
                  {k.cozulen}/{k.soruSayisi}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
);

const SidebarIlerleme = ({
  cozulen,
  toplam,
  yuzde,
  tamamlandi,
}: {
  cozulen: number;
  toplam: number;
  yuzde: number;
  tamamlandi: boolean;
}) => (
  <div className="bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 rounded-2xl p-4">
    <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-3">
      İlerleme
    </div>
    <div className="flex items-baseline justify-between mb-2">
      <span className="font-display text-2xl font-bold tracking-tight">
        {cozulen}
        <span className="text-stone-400 dark:text-zinc-600 text-base">/{toplam}</span>
      </span>
      <span
        className={`text-[12px] font-mono font-bold ${tamamlandi ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-zinc-500'}`}
      >
        %{yuzde}
      </span>
    </div>
    <div className="h-1.5 bg-stone-100 dark:bg-zinc-800 rounded overflow-hidden">
      <div
        className={`h-full transition-all ${tamamlandi ? 'bg-emerald-600' : 'bg-blue-700 dark:bg-blue-500'}`}
        style={{ width: `${yuzde}%` }}
      />
    </div>
  </div>
);

const SidebarPaylas = ({ konuAd, uniteAd }: { konuAd: string; uniteAd: string }) => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = `${konuAd} — ${uniteAd} | MuhasebeLab`;
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 1500);
    } catch {
      // sessiz geç
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 rounded-2xl p-4">
      <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-3">
        Paylaş
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] tracking-[0.15em] uppercase font-bold rounded-lg border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800/60 transition"
        >
          <Icon name="Send" size={12} />
          Twitter
        </a>
        <button
          type="button"
          onClick={kopyala}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] tracking-[0.15em] uppercase font-bold rounded-lg border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800/60 transition"
        >
          <Icon name={kopyalandi ? 'Check' : 'FileText'} size={12} />
          {kopyalandi ? 'Kopyalandı' : 'Linki Kopyala'}
        </button>
      </div>
    </div>
  );
};
