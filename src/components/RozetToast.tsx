import { useEffect } from 'react';
import { Icon } from './Icon';
import { Thiings } from './Thiings';
import type { Rozet } from '../types';

interface Props {
  rozet: Rozet;
  onKapat: () => void;
}

export const RozetToast = ({ rozet, onKapat }: Props) => {
  useEffect(() => {
    const t = setTimeout(onKapat, 4000);
    return () => clearTimeout(t);
  }, [onKapat]);

  return (
    <div className="toast-enter fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-5 py-4 shadow-2xl flex items-center gap-4 border-l-4 border-amber-500 rounded-xl">
      <Thiings name="trophy" size={44} />
      <div className="pr-2">
        <div className="text-[9px] tracking-[0.3em] uppercase text-amber-400 mb-0.5 font-semibold">
          Rozet Kazanıldı
        </div>
        <div className="font-display text-xl leading-none font-semibold">{rozet.ad}</div>
        <div className="text-xs opacity-70 mt-1">{rozet.aciklama}</div>
      </div>
      <button onClick={onKapat} className="opacity-60 hover:opacity-100">
        <Icon name="X" size={14} />
      </button>
    </div>
  );
};
