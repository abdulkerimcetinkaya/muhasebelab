import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { IcerikGoruntuleyici } from '../components/IcerikGoruntuleyici';
import { TamamRozeti } from '../components/TamamRozeti';
import { useUniteler } from '../contexts/UnitelerContext';
import { ZORLUK_AD, ZORLUK_PUAN, ZORLUK_STIL } from '../data/sabitler';
import { konuKilitliMi, konuTamamlandiMi } from '../lib/konu-kilit';
import type { Ilerleme } from '../types';

const icerikDolu = (icerik: unknown | null | undefined): boolean =>
  Array.isArray(icerik) && icerik.length > 0;

interface Props {
  ilerleme: Ilerleme;
}

export const UniteSayfasi = ({ ilerleme }: Props) => {
  const { uniteId } = useParams<{ uniteId: string }>();
  const nav = useNavigate();
  const { uniteler } = useUniteler();
  const unite = uniteler.find((u) => u.id === uniteId);

  useEffect(() => {
    if (!unite) nav('/uniteler', { replace: true });
  }, [unite, nav]);

  if (!unite) return null;

  const konular = unite.konular ?? [];
  const konulariVar = konular.length > 0;

  // Konuya bağlanmamış sorular (eski seed) — geriye dönük uyum için ünite seviyesinde listelenir
  const baglanmamisSorular = unite.sorular.filter((s) => !s.konuId);

  const toplam = unite.sorular.length;
  const cozulen = unite.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
  const yuzde = toplam > 0 ? Math.round((cozulen / toplam) * 100) : 0;

  // İlk tamamlanmamış konu — "Devam Et" butonu için. Yumuşak kilit:
  // sıralı ilerleyişi öneriyoruz, dolayısıyla "ilk tamamlanmamış" doğal olarak
  // "açık olan" konuya denk gelir.
  const ilkTamamlanmamisKonu = konulariVar
    ? konular.find((k) => !konuTamamlandiMi(k, ilerleme))
    : null;

  const sirayaGoreSorular = [...unite.sorular].sort((a, b) => {
    const aCoz = ilerleme.cozulenler[a.id] ? 1 : 0;
    const bCoz = ilerleme.cozulenler[b.id] ? 1 : 0;
    return aCoz - bCoz;
  });
  const ilkCozulmemis = sirayaGoreSorular.find((s) => !ilerleme.cozulenler[s.id]);

  const anlatimVar = icerikDolu(unite.icerik);
  const aktifIndex = uniteler.findIndex((u) => u.id === unite.id);
  const sonrakiUnite = aktifIndex >= 0 ? uniteler[aktifIndex + 1] : null;
  const tamamlandi = toplam > 0 && cozulen === toplam;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <button
        onClick={() => nav('/uniteler')}
        className="flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 mb-6 font-semibold"
      >
        <Icon name="ArrowLeft" size={14} />
        <span>Tüm Üniteler</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <Thiings name={unite.thiingsIcon} size={64} />
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-1 font-bold">
                Ünite
              </div>
              <h1 className="font-display text-4xl md:text-5xl tracking-tight font-bold leading-none">
                {unite.ad}
              </h1>
            </div>
          </div>
          <p className="text-lg text-stone-600 dark:text-zinc-400 leading-relaxed font-medium max-w-2xl">
            {unite.aciklama}
          </p>
          {konulariVar && ilkTamamlanmamisKonu ? (
            <button
              onClick={() => nav(`/uniteler/${unite.id}/${ilkTamamlanmamisKonu.id}`)}
              className="mt-6 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3 text-sm tracking-wide uppercase font-bold transition inline-flex items-center gap-2 rounded-xl shadow-md"
            >
              <Icon name="Zap" size={14} />
              {cozulen > 0 ? 'Devam Et' : 'Çalışmaya Başla'}
              <Icon name="ArrowRight" size={14} />
            </button>
          ) : !konulariVar && ilkCozulmemis ? (
            <button
              onClick={() => nav(`/problemler/${ilkCozulmemis.id}`)}
              className="mt-6 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3 text-sm tracking-wide uppercase font-bold transition inline-flex items-center gap-2 rounded-xl shadow-md"
            >
              <Icon name="Zap" size={14} />
              {cozulen > 0 ? 'Devam Et' : 'Çözmeye Başla'}
              <Icon name="ArrowRight" size={14} />
            </button>
          ) : null}
        </div>

        <aside className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-6 self-start">
          <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-4 font-bold">
            İlerleme
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-display text-4xl font-bold tracking-tight">{cozulen}</span>
            <span className="font-mono text-sm text-stone-500 dark:text-zinc-500 font-bold">
              / {toplam} soru
            </span>
          </div>
          <div className="h-2 bg-stone-100 dark:bg-zinc-800 rounded overflow-hidden mb-4">
            <div
              className="h-full bg-blue-700 dark:bg-blue-500 transition-all"
              style={{ width: `${yuzde}%` }}
            />
          </div>
          <div className="text-xs text-stone-500 dark:text-zinc-500 font-semibold">
            %{yuzde} tamamlandı
          </div>
          {konulariVar && (
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-zinc-700 text-[11px] text-stone-500 dark:text-zinc-500 font-semibold">
              {konular.length} alt-konu
            </div>
          )}
        </aside>
      </div>

      {/* Konu kartları — yeni LeetCode-tarzı yapı */}
      {konulariVar && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-2xl font-bold tracking-tight">Konular</h2>
              <span className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                Sırayla ilerle
              </span>
            </div>
            <span className="text-xs text-stone-500 dark:text-zinc-500 font-semibold">
              {konular.length} adet
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {konular.map((k, i) => {
              const kSoru = k.sorular.length;
              const kCozulen = k.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
              const kYuzde = kSoru > 0 ? Math.round((kCozulen / kSoru) * 100) : 0;
              const kTamam = konuTamamlandiMi(k, ilerleme);
              const kBaslandi = kCozulen > 0 && !kTamam;
              const kIcerikVar = icerikDolu(k.icerik);
              const kKilitli = konuKilitliMi(konular, k, ilerleme);
              return (
                <button
                  key={k.id}
                  onClick={() => nav(`/uniteler/${unite.id}/${k.id}`)}
                  className={`text-left bg-white dark:bg-zinc-800/60 border rounded-xl p-5 transition active:scale-[0.99] group ${
                    kKilitli
                      ? 'border-stone-200 dark:border-zinc-800 opacity-60 hover:opacity-90'
                      : kTamam
                        ? 'border-blue-300 dark:border-blue-700/50 hover:border-blue-600'
                        : 'border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600 font-bold font-mono">
                      Konu {String(i + 1).padStart(2, '0')}
                    </span>
                    {kKilitli ? (
                      <Icon name="Lock" size={15} className="text-stone-400 dark:text-zinc-600" />
                    ) : kTamam ? (
                      <TamamRozeti size={16} />
                    ) : kBaslandi ? (
                      <Icon name="CircleDashed" size={16} className="text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Icon name="Circle" size={16} className="text-stone-300 dark:text-zinc-700" />
                    )}
                  </div>
                  <h3
                    className={`font-display text-lg font-bold tracking-tight mb-1.5 transition ${
                      kKilitli
                        ? 'text-stone-500 dark:text-zinc-500'
                        : 'group-hover:text-blue-700 dark:group-hover:text-blue-400'
                    }`}
                  >
                    {k.ad}
                  </h3>
                  {k.aciklama && (
                    <p className="text-xs text-stone-500 dark:text-zinc-500 leading-relaxed font-medium line-clamp-2 mb-3">
                      {k.aciklama}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-3 mt-3">
                    <div className="flex-1 h-1.5 bg-stone-100 dark:bg-zinc-800 rounded overflow-hidden">
                      <div
                        className={`h-full transition-all ${kTamam ? 'bg-blue-900 dark:bg-blue-600' : 'bg-blue-700 dark:bg-blue-500'}`}
                        style={{ width: `${kYuzde}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-stone-500 dark:text-zinc-500 font-bold tabular-nums whitespace-nowrap">
                      {kCozulen}/{kSoru}
                    </span>
                  </div>
                  {kKilitli ? (
                    <div className="mt-2 text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold flex items-center gap-1.5">
                      <Icon name="Lock" size={10} />
                      Önceki konu bitince açılır
                    </div>
                  ) : !kIcerikVar ? (
                    <div className="mt-2 text-[10px] tracking-[0.2em] uppercase text-amber-700 dark:text-amber-500 font-bold">
                      Anlatım hazırlanıyor
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Eski ünite seviyesi anlatımı — sadece konu yapısı yoksa göster */}
      {!konulariVar && anlatimVar && (
        <section className="mb-12">
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">Konu Anlatımı</h2>
            <span className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
              Editöryel
            </span>
          </div>
          <div className="bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 rounded-2xl px-2 py-2 sm:px-4 sm:py-4">
            <IcerikGoruntuleyici icerik={unite.icerik} />
          </div>
        </section>
      )}

      {!konulariVar && !anlatimVar && (
        <section className="mb-12">
          <div className="bg-white dark:bg-zinc-900/40 border border-dashed border-stone-300 dark:border-zinc-700 rounded-2xl px-6 py-10 text-center">
            <div className="text-[10px] tracking-[0.22em] uppercase text-stone-400 dark:text-zinc-600 font-bold mb-2">
              Konu Anlatımı
            </div>
            <p className="text-[14px] text-stone-500 dark:text-zinc-500 max-w-md mx-auto leading-relaxed">
              Bu ünite için içerik henüz hazırlanmadı. Sorulara doğrudan başlayabilirsin —
              anlatım yakında eklenecek.
            </p>
          </div>
        </section>
      )}

      {/* Soru listesi:
          - Konu yapısı yoksa: tüm sorular ünite seviyesinde
          - Konu yapısı varsa: sadece konuya bağlanmamış olanlar (eski seed) */}
      {(!konulariVar || baglanmamisSorular.length > 0) && (
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {konulariVar ? 'Genel Sorular' : 'Sorular'}
            </h2>
            <span className="text-xs text-stone-500 dark:text-zinc-500 font-semibold">
              {(konulariVar ? baglanmamisSorular : unite.sorular).length} adet
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(konulariVar ? baglanmamisSorular : unite.sorular).map((s, i) => {
              const cozulmus = !!ilerleme.cozulenler[s.id];
              const yanlisSayi = ilerleme.yanlislar[s.id] || 0;
              return (
                <button
                  key={s.id}
                  onClick={() => nav(`/problemler/${s.id}`)}
                  className="text-left bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-5 transition active:scale-[0.99] group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600 font-bold font-mono">
                      Soru {String(i + 1).padStart(2, '0')}
                    </span>
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
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-tight mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                    {s.baslik}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-500 leading-relaxed font-medium line-clamp-2 mb-3">
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
      )}

      {sonrakiUnite && (
        <section className="mt-16">
          <button
            onClick={() => nav(`/uniteler/${sonrakiUnite.id}`)}
            className={`w-full text-left rounded-2xl p-6 sm:p-8 border transition group ${
              tamamlandi
                ? 'bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-zinc-900 border-blue-300 dark:border-blue-700/40 hover:border-blue-500'
                : 'bg-white dark:bg-zinc-900/40 border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="min-w-0">
                {tamamlandi ? (
                  <div className="flex items-center gap-2 mb-3">
                    <TamamRozeti size={14} />
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-blue-900 dark:text-blue-300">
                      Bu üniteyi tamamladın
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-3">
                    Sıradaki ünite
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Thiings name={sonrakiUnite.thiingsIcon} size={48} />
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-100 mb-1 leading-tight">
                      {sonrakiUnite.ad}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed font-medium line-clamp-2">
                      {sonrakiUnite.aciklama}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 text-stone-500 dark:text-zinc-500 group-hover:text-stone-900 dark:group-hover:text-zinc-100 transition">
                <span className="hidden sm:inline text-[11px] tracking-[0.18em] uppercase font-bold">
                  Geç
                </span>
                <Icon name="ArrowRight" size={20} />
              </div>
            </div>
          </button>
        </section>
      )}
    </main>
  );
};
