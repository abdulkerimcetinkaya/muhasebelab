import { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { HESAP_PLANI } from '../data/hesap-plani';
import { GRUP_ISIMLERI, SINIF_ISIMLERI } from '../data/sabitler';
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

  // İki seviyeli gruplandırma: sınıf → grup (2 haneli) → hesaplar
  const gruplanmis = useMemo(() => {
    const g: Record<string, Record<string, Hesap[]>> = {};
    filtrelenmis.forEach((h) => {
      const grup = h.kod.substring(0, 2);
      if (!g[h.sinif]) g[h.sinif] = {};
      if (!g[h.sinif][grup]) g[h.sinif][grup] = [];
      g[h.sinif][grup].push(h);
    });
    return g;
  }, [filtrelenmis]);

  return (
    <>
      <div className="border-b border-ink/10 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-ink-mute mb-1 font-bold">
            Referans
          </div>
          <div className="font-display text-2xl tracking-tight font-bold">Tek Düzen Hesap Planı</div>
        </div>
        <button onClick={onKapat} className="text-ink-mute hover:text-ink">
          <Icon name="X" size={20} />
        </button>
      </div>
      <div className="px-6 py-4 border-b border-ink/10 flex gap-3 flex-wrap items-center flex-shrink-0">
        <div className="relative flex-1 min-w-[160px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-quiet">
            <Icon name="Search" size={14} />
          </span>
          <input
            type="text"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Kod veya ad ara..."
            className="w-full pl-9 pr-3 py-2 bg-surface border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {['hepsi', '1', '2', '3', '4', '5', '6', '7'].map((s) => (
            <button
              key={s}
              onClick={() => setSeciliSinif(s)}
              className={`px-2.5 py-1.5 text-xs tracking-wider transition rounded-lg font-bold ${
 seciliSinif === s
 ? 'bg-ink text-bg '
 : 'bg-surface border border-line-strong hover:border-ink '
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
              <div className="flex items-baseline gap-3 mb-3 pb-2 border-b border-ink/20">
                <div className="font-display text-xl font-bold">{sinif}</div>
                <div className="text-xs tracking-wide text-ink-soft uppercase font-bold">
                  {SINIF_ISIMLERI[sinif]}
                </div>
              </div>
              {Object.keys(gruplanmis[sinif])
                .sort()
                .map((grup) => (
                  <div key={grup} className="mb-4">
                    <div className="flex items-baseline gap-2 mt-3 mb-1.5">
                      <div className="font-mono text-sm font-bold text-ink-soft">
                        {grup}
                      </div>
                      <div className="text-[11px] tracking-wide text-ink-mute uppercase font-bold">
                        {GRUP_ISIMLERI[grup] ?? ''}
                      </div>
                    </div>
                    <div className={modal ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6' : ''}>
                      {gruplanmis[sinif][grup].map((h) => (
                        <div
                          key={h.kod}
                          className="flex items-center gap-3 py-1.5 border-b border-ink/5 text-sm"
                        >
                          <div className="font-mono font-bold w-10">{h.kod}</div>
                          <div className="flex-1 text-xs font-medium">{h.ad}</div>
                          <div
                            className={`text-[9px] tracking-widest uppercase font-bold ${
 h.tur === 'AKTİF'
 ? 'text-brand dark:text-brand-mute'
 : h.tur === 'PASİF'
 ? 'text-premium-deep'
 : h.tur === 'GELİR'
 ? 'text-success dark:text-success'
 : h.tur === 'GİDER'
 ? 'text-danger dark:text-danger'
 : 'text-ink-mute'
 }`}
                          >
                            {h.tur}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        {filtrelenmis.length === 0 && (
          <div className="text-center text-ink-quiet py-12 font-medium">
            Sonuç bulunamadı.
          </div>
        )}
      </div>
    </>
  );
};
