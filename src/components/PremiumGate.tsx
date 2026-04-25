import { useNavigate } from 'react-router-dom';
import { useIsPremium } from '../contexts/AuthContext';
import { Icon } from './Icon';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  ozellikAdi?: string;
  aciklama?: string;
  kompakt?: boolean;
}

export const PremiumGate = ({ children, ozellikAdi, aciklama, kompakt }: Props) => {
  const isPremium = useIsPremium();
  const nav = useNavigate();

  if (isPremium) return <>{children}</>;

  if (kompakt) {
    return (
      <button
        onClick={() => nav('/premium')}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950/30 border border-amber-300/60 dark:border-amber-700/40 text-amber-900 dark:text-amber-200 text-[11px] font-bold tracking-wide uppercase hover:opacity-90 active:scale-[0.98] transition"
        title={ozellikAdi ? `${ozellikAdi} — Premium özellik` : 'Premium özellik'}
      >
        <Icon name="Sparkles" size={12} />
        Premium
      </button>
    );
  }

  return (
    <div className="relative rounded-2xl border-2 border-dashed border-amber-300/70 dark:border-amber-700/40 bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-950/20 dark:to-zinc-900 p-8 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/40 dark:to-amber-900/40 mb-3">
        <Icon name="Sparkles" size={20} className="text-amber-700 dark:text-amber-300" />
      </div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-amber-700 dark:text-amber-400 font-bold mb-2">
        Premium Özellik
      </div>
      {ozellikAdi && (
        <h3 className="font-display text-xl font-bold tracking-tight mb-2">{ozellikAdi}</h3>
      )}
      {aciklama && (
        <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium max-w-sm mx-auto mb-5">
          {aciklama}
        </p>
      )}
      <button
        onClick={() => nav('/premium')}
        className="inline-flex items-center gap-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-6 py-2.5 text-xs tracking-wide uppercase font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition shadow-md"
      >
        <Icon name="Sparkles" size={13} />
        Premium&apos;u Keşfet
      </button>
    </div>
  );
};
