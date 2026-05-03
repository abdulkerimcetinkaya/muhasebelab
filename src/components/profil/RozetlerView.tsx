import { useMemo } from 'react';
import { Icon } from '../Icon';
import { ROZETLER } from '../../data/rozetler';
import type { Ilerleme, Istatistik } from '../../types';

interface Props {
  ilerleme: Ilerleme;
  stat: Istatistik;
}

/**
 * Rozet vitrini — kazanılanlar amber + tarih, kazanılmayanlar gri + progress bar.
 */
export const RozetlerView = ({ ilerleme, stat }: Props) => {
  const kazanilanRozetSayi = Object.keys(ilerleme.kazanilanRozetler).length;

  // Stat referansı stabil değil mi (App'ten her renderda yeni nesne) —
  // useMemo ROZETLER iterasyonu için minimum koruma
  const ilerlemeler = useMemo(
    () =>
      ROZETLER.map((r) => ({
        rozet: r,
        ilerleme: r.ilerleme ? r.ilerleme(stat) : null,
      })),
    [stat],
  );

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold">Rozetler</h2>
        <span className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
          {kazanilanRozetSayi}/{ROZETLER.length} kazanıldı
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ilerlemeler.map(({ rozet: r, ilerleme: rIlerleme }) => {
          const kazanildi = !!ilerleme.kazanilanRozetler[r.id];
          const tarih = ilerleme.kazanilanRozetler[r.id];
          const yuzde =
            rIlerleme && rIlerleme.hedef > 0
              ? Math.min(100, Math.round((rIlerleme.mevcut / rIlerleme.hedef) * 100))
              : 0;
          return (
            <div
              key={r.id}
              className={`p-4 border text-center transition rounded-xl ${
                kazanildi
                  ? 'border-amber-600/40 bg-amber-50/40 dark:bg-amber-900/10 dark:border-amber-400/40'
                  : 'border-stone-200 dark:border-zinc-800'
              }`}
            >
              <Icon
                name={r.icon}
                size={26}
                className={`mx-auto mb-2 ${
                  kazanildi
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-stone-400 dark:text-zinc-600'
                }`}
              />
              <div
                className={`font-display text-sm leading-tight mb-1 font-bold ${
                  kazanildi ? '' : 'text-stone-600 dark:text-zinc-500'
                }`}
              >
                {r.ad}
              </div>
              <div
                className={`text-[10.5px] leading-tight font-medium ${
                  kazanildi
                    ? 'text-stone-500 dark:text-zinc-500'
                    : 'text-stone-400 dark:text-zinc-600'
                }`}
              >
                {r.aciklama}
              </div>

              {kazanildi && tarih ? (
                <div className="mt-2 text-[10px] tracking-[0.18em] uppercase text-amber-700 dark:text-amber-400 font-bold">
                  {new Date(tarih).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              ) : rIlerleme ? (
                <div className="mt-2.5">
                  <div className="h-1 bg-stone-100 dark:bg-zinc-800 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-700 dark:bg-blue-500 transition-all"
                      style={{ width: `${yuzde}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-zinc-500 font-mono font-bold tabular-nums mt-1">
                    {rIlerleme.mevcut}/{rIlerleme.hedef}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-[10px] tracking-[0.18em] uppercase text-stone-400 dark:text-zinc-600 font-bold">
                  Kilitli
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
