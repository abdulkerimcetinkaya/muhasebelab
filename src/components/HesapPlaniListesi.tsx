import { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { HESAP_PLANI } from '../data/hesap-plani';
import { SINIF_ISIMLERI } from '../data/sabitler';
import type { Hesap } from '../types';

interface Props {
  onKapat: () => void;
  modal?: boolean;
}

export const HesapPlaniListesi = ({ onKapat, modal = false }: Props) => {
  const [arama, setArama] = useState('');
  const [seciliSinif, setSeciliSinif] = useState<string>('hepsi');

  const filtrelenmis = useMemo<Hesap[]>(() => {
    let sonuc: Hesap[] = HESAP_PLANI;
    if (seciliSinif !== 'hepsi') sonuc = sonuc.filter((h) => h.sinif === seciliSinif);
    if (arama.trim()) {
      const a = arama.toLocaleLowerCase('tr');
      sonuc = sonuc.filter((h) => h.kod.includes(a) || h.ad.toLocaleLowerCase('tr').includes(a));
    }
    return sonuc;
  }, [arama, seciliSinif]);

  const gruplanmis = useMemo(() => {
    const g: Record<string, Hesap[]> = {};
    filtrelenmis.forEach((h) => {
      if (!g[h.sinif]) g[h.sinif] = [];
      g[h.sinif].push(h);
    });
    return g;
  }, [filtrelenmis]);

  return (
    <>
      <div className="border-b border-stone-900/10 dark:border-zinc-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-1 font-bold">
            Referans
          </div>
          <div className="font-display text-2xl tracking-tight font-bold">Tek Düzen Hesap Planı</div>
        </div>
        <button onClick={onKapat} className="text-stone-500 hover:text-stone-900 dark:hover:text-zinc-100">
          <Icon name="X" size={20} />
        </button>
      </div>
      <div className="px-6 py-4 border-b border-stone-900/10 dark:border-zinc-800 flex gap-3 flex-wrap items-center flex-shrink-0">
        <div className="relative flex-1 min-w-[160px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <Icon name="Search" size={14} />
          </span>
          <input
            type="text"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Kod veya ad ara..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {['hepsi', '1', '2', '3', '5', '6', '7'].map((s) => (
            <button
              key={s}
              onClick={() => setSeciliSinif(s)}
              className={`px-2.5 py-1.5 text-xs tracking-wider transition rounded-lg font-bold ${
                seciliSinif === s
                  ? 'bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400'
              }`}
            >
              {s === 'hepsi' ? 'HEPSİ' : s}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto px-6 py-4">
        {Object.keys(gruplanmis)
          .sort()
          .map((sinif) => (
            <div key={sinif} className="mb-6">
              <div className="flex items-baseline gap-3 mb-2 pb-2 border-b border-stone-900/20 dark:border-zinc-700">
                <div className="font-display text-xl font-bold">{sinif}</div>
                <div className="text-xs tracking-wide text-stone-600 dark:text-zinc-400 uppercase font-bold">
                  {SINIF_ISIMLERI[sinif]}
                </div>
              </div>
              <div className={modal ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6' : ''}>
                {gruplanmis[sinif].map((h) => (
                  <div
                    key={h.kod}
                    className="flex items-center gap-3 py-1.5 border-b border-stone-900/5 dark:border-zinc-800 text-sm"
                  >
                    <div className="font-mono font-bold w-10">{h.kod}</div>
                    <div className="flex-1 text-xs font-medium">{h.ad}</div>
                    <div
                      className={`text-[9px] tracking-widest uppercase font-bold ${
                        h.tur === 'AKTİF'
                          ? 'text-blue-700 dark:text-blue-400'
                          : h.tur === 'PASİF'
                            ? 'text-amber-700 dark:text-amber-400'
                            : h.tur === 'GELİR'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : h.tur === 'GİDER'
                                ? 'text-red-700 dark:text-red-400'
                                : 'text-stone-500'
                      }`}
                    >
                      {h.tur}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        {filtrelenmis.length === 0 && (
          <div className="text-center text-stone-400 dark:text-zinc-600 py-12 font-medium">
            Sonuç bulunamadı.
          </div>
        )}
      </div>
    </>
  );
};
