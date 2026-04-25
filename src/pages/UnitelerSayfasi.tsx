import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useUniteler } from '../contexts/UnitelerContext';
import type { Ilerleme } from '../types';

interface Props {
  ilerleme: Ilerleme;
}

export const UnitelerSayfasi = ({ ilerleme }: Props) => {
  const nav = useNavigate();
  const { uniteler } = useUniteler();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-3 font-bold">
          Konu Başlıkları
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight font-bold mb-3">
          Üniteler
        </h1>
        <p className="text-stone-600 dark:text-zinc-400 max-w-2xl font-medium">
          {uniteler.length} ünite ile Tek Düzen Hesap Planı'nın temel başlıklarını adım adım çalış.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniteler.map((u) => {
          const toplam = u.sorular.length;
          const cozulen = u.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
          const yuzde = toplam > 0 ? Math.round((cozulen / toplam) * 100) : 0;
          const tamamlandi = cozulen === toplam && toplam > 0;
          return (
            <button
              key={u.id}
              onClick={() => nav(`/uniteler/${u.id}`)}
              className="text-left bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-2xl p-6 transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <Thiings name={u.thiingsIcon} size={48} />
                {tamamlandi && (
                  <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                    <Icon name="CheckCircle2" size={10} />
                    Bitti
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl font-bold tracking-tight mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                {u.ad}
              </h2>
              <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed font-medium mb-4 line-clamp-2">
                {u.aciklama}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-stone-500 dark:text-zinc-500 font-bold">
                  {cozulen} / {toplam} soru
                </span>
                <span className="font-mono font-bold text-stone-700 dark:text-zinc-300">
                  %{yuzde}
                </span>
              </div>
              <div className="mt-2 h-1 bg-stone-100 dark:bg-zinc-800 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-700 dark:bg-blue-500 transition-all"
                  style={{ width: `${yuzde}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
};
