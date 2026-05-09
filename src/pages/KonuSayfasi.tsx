import { useEffect } from 'react';
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
      {/* ÜST BANNER (DergiPark esin) — full-width, parlak mavi          */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="text-white" style={{ backgroundColor: '#1d4ed8' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] mb-5 flex-wrap text-blue-100/80">
            <button
              onClick={() => nav('/uniteler')}
              className="hover:text-white transition font-semibold"
            >
              Üniteler
            </button>
            <Icon name="ChevronRight" size={11} className="opacity-60" />
            <button
              onClick={() => nav(`/uniteler/${unite.id}?overview=1`)}
              className="hover:text-white transition font-semibold"
            >
              {unite.ad}
            </button>
            <Icon name="ChevronRight" size={11} className="opacity-60" />
            <span className="text-white font-bold truncate max-w-xs">
              {konu.ad}
            </span>
          </nav>

          <div className="flex items-start gap-6">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.3em] uppercase font-bold mb-3 text-blue-100">
                KONU ANLATIMI · {unite.ad.toUpperCase()}
              </div>

              <h1 className="font-display text-3xl md:text-5xl tracking-tight font-bold leading-[1.1] mb-3">
                {konu.ad}
              </h1>

              {konu.aciklama && (
                <p className="text-[14.5px] md:text-[15px] text-blue-50/90 leading-relaxed font-medium max-w-2xl mb-5">
                  {konu.aciklama}
                </p>
              )}

              {/* Meta satırı */}
              <div className="flex items-center gap-4 mb-6 flex-wrap text-[12px] text-blue-100/80 font-mono">
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
                    <span className="inline-flex items-center gap-1.5 text-emerald-200">
                      <TamamRozeti size={11} />
                      Tamamlandı
                    </span>
                  </>
                )}
                {kilitliyse && (
                  <>
                    <span className="opacity-50">·</span>
                    <span className="inline-flex items-center gap-1 text-amber-200">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg shadow-lg bg-white text-blue-900 hover:bg-blue-50 transition"
                  >
                    <Icon name="Zap" size={13} />
                    {cozulen > 0 ? 'Devam Et' : 'Soruları Çöz'}
                    <Icon name="ArrowRight" size={13} />
                  </button>
                ) : tamamlandi ? (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 bg-emerald-600/30 text-emerald-50 px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg"
                  >
                    <TamamRozeti size={13} />
                    Bu Konu Tamamlandı
                  </button>
                ) : null}

                <button
                  onClick={() => nav(`/uniteler/${unite.id}?overview=1`)}
                  className="inline-flex items-center gap-2 border border-blue-300/40 hover:bg-blue-700/40 px-4 py-2.5 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg transition"
                >
                  <Icon name="ArrowLeft" size={12} />
                  Üniteye Dön
                </button>
              </div>
            </div>

            {/* Sağ: ünite ikonu */}
            <div className="hidden md:flex flex-shrink-0 items-center justify-center w-[100px] h-[140px] rounded-lg bg-blue-700/40 border border-blue-300/30">
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
      {/* İÇERİK — tek kolon, geniş                                     */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-10">
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
        </div>
      </div>
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
