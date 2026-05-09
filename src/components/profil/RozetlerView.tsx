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
        <span className="text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
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
 ? 'border-premium-deep/40 bg-premium-soft/40 dark:border-premium/40'
 : 'border-line'
 }`}
            >
              <Icon
                name={r.icon}
                size={26}
                className={`mx-auto mb-2 ${
 kazanildi
 ? 'text-premium-deep'
 : 'text-ink-quiet'
 }`}
              />
              <div
                className={`font-display text-sm leading-tight mb-1 font-bold ${
 kazanildi ? '' : 'text-ink-soft'
 }`}
              >
                {r.ad}
              </div>
              <div
                className={`text-[10.5px] leading-tight font-medium ${
 kazanildi
 ? 'text-ink-mute'
 : 'text-ink-quiet'
 }`}
              >
                {r.aciklama}
              </div>

              {kazanildi && tarih ? (
                <div className="mt-2 text-[10px] tracking-[0.18em] uppercase text-premium-deep font-bold">
                  {new Date(tarih).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              ) : rIlerleme ? (
                <div className="mt-2.5">
                  <div className="h-1 bg-surface-2 rounded overflow-hidden">
                    <div
                      className="h-full bg-brand-deep transition-all"
                      style={{ width: `${yuzde}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-ink-mute font-mono font-bold tabular-nums mt-1">
                    {rIlerleme.mevcut}/{rIlerleme.hedef}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-[10px] tracking-[0.18em] uppercase text-ink-quiet font-bold">
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
