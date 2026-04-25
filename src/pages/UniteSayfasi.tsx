import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useUniteler } from '../contexts/UnitelerContext';
import { ZORLUK_AD, ZORLUK_PUAN, ZORLUK_STIL } from '../data/sabitler';
import type { Ilerleme } from '../types';

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

  const toplam = unite.sorular.length;
  const cozulen = unite.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
  const yuzde = toplam > 0 ? Math.round((cozulen / toplam) * 100) : 0;

  const sirayaGoreSorular = [...unite.sorular].sort((a, b) => {
    const aCoz = ilerleme.cozulenler[a.id] ? 1 : 0;
    const bCoz = ilerleme.cozulenler[b.id] ? 1 : 0;
    return aCoz - bCoz;
  });
  const ilkCozulmemis = sirayaGoreSorular.find((s) => !ilerleme.cozulenler[s.id]);

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
          {ilkCozulmemis && (
            <button
              onClick={() => nav(`/problemler/${ilkCozulmemis.id}`)}
              className="mt-6 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3 text-sm tracking-wide uppercase font-bold transition inline-flex items-center gap-2 rounded-xl shadow-md"
            >
              <Icon name="Zap" size={14} />
              {cozulen > 0 ? 'Devam Et' : 'Çözmeye Başla'}
              <Icon name="ArrowRight" size={14} />
            </button>
          )}
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
        </aside>
      </div>

      <section className="mb-12">
        <div className="border border-dashed border-stone-300 dark:border-zinc-700 rounded-2xl p-8 bg-stone-50/50 dark:bg-zinc-900/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center">
              <Icon name="BookOpen" size={18} className="text-stone-500 dark:text-zinc-400" />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-2 font-bold">
                Konu Anlatımı
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight mb-2">
                Bu konunun teorik anlatımı yakında.
              </h3>
              <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed font-medium">
                Şimdilik aşağıdaki sorularla pratik yaparak öğrenebilirsin. Her sorunun ipucu,
                resmi çözümü ve detaylı açıklaması var.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-bold tracking-tight">Sorular</h2>
          <span className="text-xs text-stone-500 dark:text-zinc-500 font-semibold">
            {toplam} adet
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {unite.sorular.map((s, i) => {
            const cozulmus = !!ilerleme.cozulenler[s.id];
            const yanlisSayi = ilerleme.yanlislar[s.id] || 0;
            return (
              <button
                key={s.id}
                onClick={() => nav(`/problemler/${s.id}`)}
                className="text-left bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-5 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600 font-bold font-mono">
                    Soru {String(i + 1).padStart(2, '0')}
                  </span>
                  {cozulmus ? (
                    <Icon
                      name="CheckCircle2"
                      size={16}
                      className="text-emerald-700 dark:text-emerald-400"
                    />
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
    </main>
  );
};
