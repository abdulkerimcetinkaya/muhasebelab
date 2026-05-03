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
 * Bir alt-konunun çalışma sayfası — LeetCode-tarzı yapı:
 *  - Sol sticky nav: aynı ünitenin tüm konuları + ilerleme işareti
 *  - Sağ ana içerik: mikro anlatım (BlockNote) + bu konunun soruları
 *  - Alt: sıradaki konu kartı
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
        <button
          onClick={() => nav('/uniteler')}
          className="text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 font-semibold"
        >
          Üniteler
        </button>
        <Icon name="ChevronRight" size={12} className="text-stone-400 dark:text-zinc-600" />
        <button
          onClick={() => nav(`/uniteler/${unite.id}`)}
          className="text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 font-semibold"
        >
          {unite.ad}
        </button>
        <Icon name="ChevronRight" size={12} className="text-stone-400 dark:text-zinc-600" />
        <span className="text-stone-900 dark:text-zinc-100 font-bold">{konu.ad}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Sol nav — aynı ünitenin tüm konuları */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3 px-2">
              <Thiings name={unite.thiingsIcon} size={28} />
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                  Ünite
                </div>
                <button
                  onClick={() => nav(`/uniteler/${unite.id}`)}
                  className="font-display text-[14px] font-bold tracking-tight text-stone-900 dark:text-zinc-100 hover:text-blue-700 dark:hover:text-blue-400 transition truncate block w-full text-left leading-tight"
                  title={unite.ad}
                >
                  {unite.ad}
                </button>
              </div>
            </div>
            <div className="border-t border-stone-200 dark:border-zinc-700 pt-3">
              <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2 px-2">
                Konular
              </div>
              <ul className="space-y-0.5">
                {konular.map((k, i) => {
                  const aktif = k.id === konu.id;
                  const kSoru = k.sorular.length;
                  const kCozulen = k.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
                  const kTamam = konuTamamlandiMi(k, ilerleme);
                  const kBaslandi = kCozulen > 0 && !kTamam;
                  const kKilitli = konuKilitliMi(konular, k, ilerleme);
                  return (
                    <li key={k.id}>
                      <button
                        onClick={() => nav(`/uniteler/${unite.id}/${k.id}`)}
                        className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition ${
                          aktif
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100'
                            : kKilitli
                              ? 'opacity-55 hover:opacity-80 text-stone-600 dark:text-zinc-500'
                              : 'hover:bg-stone-50 dark:hover:bg-zinc-800/60 text-stone-700 dark:text-zinc-300'
                        }`}
                      >
                        <span className="flex-shrink-0">
                          {kKilitli ? (
                            <Icon
                              name="Lock"
                              size={13}
                              className="text-stone-400 dark:text-zinc-600"
                            />
                          ) : kTamam ? (
                            <TamamRozeti size={14} />
                          ) : kBaslandi ? (
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
                          {kCozulen}/{kSoru}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        {/* Sağ ana içerik */}
        <div className="min-w-0">
          {/* Yumuşak kilit banner'ı — kilitli konuya direkt geldiyse uyar */}
          {kilitliyse && acanKonu && (
            <div className="mb-5 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/70 dark:bg-amber-950/20 text-[13px] text-amber-900 dark:text-amber-200 flex items-start gap-3">
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
                  konusunu bitir, kilit otomatik açılır. İstersen yine de buradan
                  okuyup soruları çözebilirsin.
                </div>
              </div>
            </div>
          )}

          {/* Konu başlığı */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                Konu {String(aktifIndex + 1).padStart(2, '0')} / {konular.length}
              </span>
              {tamamlandi && (
                <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-bold text-blue-900 dark:text-blue-300">
                  <TamamRozeti size={12} />
                  Tamamlandı
                </span>
              )}
              {kilitliyse && (
                <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 dark:text-amber-500">
                  <Icon name="Lock" size={11} />
                  Kilitli
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold leading-tight mb-2">
              {konu.ad}
            </h1>
            {konu.aciklama && (
              <p className="text-[15px] text-stone-600 dark:text-zinc-400 leading-relaxed font-medium max-w-2xl">
                {konu.aciklama}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {ilkCozulmemis && (
                <button
                  onClick={() => nav(`/problemler/${ilkCozulmemis.id}`)}
                  className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-5 py-2.5 text-[12.5px] tracking-wide uppercase font-bold transition inline-flex items-center gap-2 rounded-lg shadow"
                >
                  <Icon name="Zap" size={13} />
                  {cozulen > 0 ? 'Devam Et' : 'Soruya Başla'}
                  <Icon name="ArrowRight" size={13} />
                </button>
              )}
              <div className="flex items-center gap-2 text-[12px] text-stone-500 dark:text-zinc-500 font-semibold">
                <div className="w-32 h-1.5 bg-stone-100 dark:bg-zinc-800 rounded overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      tamamlandi
                        ? 'bg-blue-900 dark:bg-blue-600'
                        : 'bg-blue-700 dark:bg-blue-500'
                    }`}
                    style={{ width: `${yuzde}%` }}
                  />
                </div>
                <span className="font-mono tabular-nums">
                  {cozulen}/{toplam}
                </span>
              </div>
            </div>
          </div>

          {/* Mikro anlatım */}
          {anlatimVar ? (
            <section className="mb-10">
              <div className="bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 rounded-2xl px-2 py-2 sm:px-4 sm:py-4">
                <IcerikGoruntuleyici key={konu.id} icerik={konu.icerik} />
              </div>
            </section>
          ) : (
            <section className="mb-10">
              <div className="bg-white dark:bg-zinc-900/40 border border-dashed border-stone-300 dark:border-zinc-700 rounded-2xl px-6 py-8 text-center">
                <div className="text-[10px] tracking-[0.22em] uppercase text-stone-400 dark:text-zinc-600 font-bold mb-2">
                  Anlatım
                </div>
                <p className="text-[14px] text-stone-500 dark:text-zinc-500 max-w-md mx-auto leading-relaxed">
                  Bu konunun anlatımı henüz hazırlanmadı. Sorulara doğrudan başlayabilirsin.
                </p>
              </div>
            </section>
          )}

          {/* Sorular */}
          {toplam > 0 ? (
            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-display text-xl font-bold tracking-tight">Sorular</h2>
                <span className="text-xs text-stone-500 dark:text-zinc-500 font-semibold">
                  {toplam} adet
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {konu.sorular.map((s, i) => {
                  const cozulmus = !!ilerleme.cozulenler[s.id];
                  const yanlisSayi = ilerleme.yanlislar[s.id] || 0;
                  return (
                    <button
                      key={s.id}
                      onClick={() => nav(`/problemler/${s.id}`)}
                      className="text-left bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-4 transition active:scale-[0.99] group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600 font-bold font-mono">
                          Soru {String(i + 1).padStart(2, '0')}
                        </span>
                        {cozulmus ? (
                          <TamamRozeti size={15} />
                        ) : yanlisSayi > 0 ? (
                          <Icon name="XCircle" size={15} className="text-rose-500" />
                        ) : (
                          <Icon
                            name="Circle"
                            size={15}
                            className="text-stone-300 dark:text-zinc-700"
                          />
                        )}
                      </div>
                      <h3 className="font-display text-[15px] font-bold tracking-tight mb-1.5 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition leading-snug">
                        {s.baslik}
                      </h3>
                      <p className="text-[12px] text-stone-500 dark:text-zinc-500 leading-relaxed font-medium line-clamp-2 mb-2.5">
                        {s.senaryo}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[s.zorluk]}`}
                        >
                          {ZORLUK_AD[s.zorluk]}
                        </span>
                        <span className="font-mono text-[10px] text-stone-400 dark:text-zinc-600 font-bold">
                          {ZORLUK_PUAN[s.zorluk]}p
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <section>
              <div className="bg-white dark:bg-zinc-900/40 border border-dashed border-stone-300 dark:border-zinc-700 rounded-2xl px-6 py-8 text-center">
                <p className="text-[14px] text-stone-500 dark:text-zinc-500 leading-relaxed">
                  Bu konuya henüz soru bağlanmadı.
                </p>
              </div>
            </section>
          )}

          {/* Önceki / sonraki konu */}
          {(oncekiKonu || sonrakiKonu) && (
            <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {oncekiKonu ? (
                <button
                  onClick={() => nav(`/uniteler/${unite.id}/${oncekiKonu.id}`)}
                  className="group text-left bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-4 transition"
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
                  className={`group text-right bg-white dark:bg-zinc-800/60 border rounded-xl p-4 transition ${
                    tamamlandi
                      ? 'border-blue-300 dark:border-blue-700/50 hover:border-blue-600'
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
    </main>
  );
};
