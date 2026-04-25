import { Thiings } from './Thiings';
import { Icon } from './Icon';

interface Props {
  thiingsIcon?: string;
  ikon?: string;
  baslik: string;
  aciklama?: string;
  cta?: {
    label: string;
    onTikla: () => void;
    icon?: string;
  };
  ikincilCta?: {
    label: string;
    onTikla: () => void;
  };
  variant?: 'default' | 'compact';
}

export const EmptyState = ({
  thiingsIcon,
  ikon,
  baslik,
  aciklama,
  cta,
  ikincilCta,
  variant = 'default',
}: Props) => {
  const compact = variant === 'compact';
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${compact ? 'py-10 px-4' : 'py-16 px-6'}`}
    >
      <div className={compact ? 'mb-4' : 'mb-6'}>
        {thiingsIcon ? (
          <Thiings name={thiingsIcon} size={compact ? 64 : 96} />
        ) : ikon ? (
          <div
            className={`inline-flex items-center justify-center rounded-2xl bg-stone-100 dark:bg-zinc-800 ${
              compact ? 'w-14 h-14' : 'w-20 h-20'
            }`}
          >
            <Icon name={ikon} size={compact ? 24 : 32} className="text-stone-400 dark:text-zinc-600" />
          </div>
        ) : null}
      </div>
      <div
        className={`font-display font-bold tracking-tight mb-2 ${
          compact ? 'text-lg' : 'text-2xl md:text-3xl'
        }`}
      >
        {baslik}
      </div>
      {aciklama && (
        <p
          className={`text-stone-600 dark:text-zinc-400 font-medium leading-relaxed max-w-md ${
            compact ? 'text-sm mb-4' : 'text-base mb-6'
          }`}
        >
          {aciklama}
        </p>
      )}
      {(cta || ikincilCta) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {cta && (
            <button
              onClick={cta.onTikla}
              className="inline-flex items-center gap-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition"
            >
              {cta.icon && <Icon name={cta.icon} size={14} />}
              {cta.label}
            </button>
          )}
          {ikincilCta && (
            <button
              onClick={ikincilCta.onTikla}
              className="inline-flex items-center gap-2 border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold rounded-xl active:scale-[0.98] transition"
            >
              {ikincilCta.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
