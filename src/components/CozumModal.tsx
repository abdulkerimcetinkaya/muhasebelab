import { Icon } from './Icon';
import { HESAP_PLANI } from '../data/hesap-plani';
import { paraFormat } from '../lib/format';
import { useEsc } from '../lib/hooks/use-esc';
import type { Soru } from '../types';

interface Props {
  soru: Soru;
  onKapat: () => void;
}

export const CozumModal = ({ soru, onKapat }: Props) => {
  useEsc(onKapat);
  const toplamBorc = soru.cozum.reduce((a, k) => a + (+k.borc || 0), 0);
  const toplamAlacak = soru.cozum.reduce((a, k) => a + (+k.alacak || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4"
      onClick={onKapat}
    >
      <div
        className="bg-stone-50 dark:bg-zinc-900 max-w-3xl w-full max-h-[90vh] overflow-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-stone-50 dark:bg-zinc-900 border-b border-stone-900/10 dark:border-zinc-800 px-8 py-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-1 font-bold">
              Resmi Çözüm
            </div>
            <div className="font-display text-2xl tracking-tight font-bold">{soru.baslik}</div>
          </div>
          <button
            onClick={onKapat}
            className="text-stone-500 hover:text-stone-900 dark:hover:text-zinc-100"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-8">
          <div className="bg-white dark:bg-zinc-800 border border-stone-900/20 dark:border-zinc-700 mb-6 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-stone-900/20 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-900 text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
              <div className="col-span-2">Kod</div>
              <div className="col-span-5">Hesap</div>
              <div className="col-span-2 text-right">Borç</div>
              <div className="col-span-3 text-right">Alacak</div>
            </div>
            {soru.cozum.map((k, i) => {
              const ad = HESAP_PLANI.find((h) => h.kod === k.kod)?.ad || '';
              return (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-stone-900/5 dark:border-zinc-700 text-sm"
                >
                  <div className="col-span-2 font-mono font-bold">{k.kod}</div>
                  <div className="col-span-5 font-medium">{ad}</div>
                  <div className="col-span-2 text-right font-mono font-semibold">
                    {k.borc > 0 ? paraFormat(k.borc) : ''}
                  </div>
                  <div className="col-span-3 text-right font-mono font-semibold">
                    {k.alacak > 0 ? paraFormat(k.alacak) : ''}
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-stone-50 dark:bg-zinc-900 font-mono text-sm">
              <div className="col-span-7 text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                Toplam
              </div>
              <div className="col-span-2 text-right font-bold">{paraFormat(toplamBorc)}</div>
              <div className="col-span-3 text-right font-bold">{paraFormat(toplamAlacak)}</div>
            </div>
          </div>
          <div className="border-l-4 border-stone-900 dark:border-zinc-100 pl-5 py-1">
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-2 font-bold">
              Açıklama
            </div>
            <p className="leading-relaxed font-medium">{soru.aciklama}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
