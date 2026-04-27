import { useState } from 'react';
import { Icon } from './Icon';
import type { KonuAnlatim, KonuOrnekSatir } from '../data/konu-anlatim';

interface Props {
  anlatim: KonuAnlatim;
  uniteId: string;
  uniteAd: string;
  /**
   * Açılış davranışı:
   *  - 'oto'   → ilk ziyarette açık, sonrasında kapalı (localStorage)
   *  - 'acik'  → her zaman açık başlar
   *  - 'kapali'→ her zaman kapalı başlar (Konuyu Tekrar Gör butonu)
   */
  davranis?: 'oto' | 'acik' | 'kapali';
}

const tutarFormat = (n: number) =>
  n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const FLAG = (uniteId: string) => `konu-anlatim-${uniteId}-gorulmus`;

export const KonuAnlatimKart = ({
  anlatim,
  uniteId,
  uniteAd,
  davranis = 'oto',
}: Props) => {
  const [acik, setAcik] = useState(() => {
    if (davranis === 'acik') return true;
    if (davranis === 'kapali') return false;
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(FLAG(uniteId)) !== '1';
  });

  const toggle = () => {
    setAcik((v) => {
      const yeni = !v;
      if (typeof window !== 'undefined' && !yeni) {
        localStorage.setItem(FLAG(uniteId), '1');
      }
      return yeni;
    });
  };

  return (
    <section className="border border-stone-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900/40 overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left hover:bg-stone-50/60 dark:hover:bg-zinc-800/40 transition"
        aria-expanded={acik}
      >
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 flex items-center justify-center">
          <Icon name="BookOpen" size={18} className="text-amber-700 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-1 font-bold">
            Konu Anlatımı
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-zinc-100 leading-snug">
            {uniteAd} — kısa rehber
          </h3>
        </div>
        <Icon
          name={acik ? 'ChevronUp' : 'ChevronDown'}
          size={18}
          className="text-stone-400 dark:text-zinc-500 flex-shrink-0"
        />
      </button>

      {acik && (
        <div className="px-5 sm:px-6 pb-6 sm:pb-7 space-y-7">
          {/* Giriş */}
          <p className="text-base leading-relaxed text-stone-700 dark:text-zinc-300 font-medium">
            {anlatim.giris}
          </p>

          {/* Ne için */}
          <div className="border-l-2 border-amber-300 dark:border-amber-700/60 pl-4 py-1">
            <div className="text-[10px] tracking-[0.22em] uppercase text-amber-700 dark:text-amber-400 mb-1.5 font-bold">
              Bu üniteyi neden öğrenmelisin
            </div>
            <p className="text-sm leading-relaxed text-stone-600 dark:text-zinc-400 font-medium">
              {anlatim.neIcin}
            </p>
          </div>

          {/* Hesaplar */}
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 mb-3 font-bold">
              Kullanılan ana hesaplar
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {anlatim.hesaplar.map((h) => (
                <div
                  key={h.kod}
                  className="flex items-start gap-3 p-3 border border-stone-200 dark:border-zinc-700 rounded-lg bg-stone-50/40 dark:bg-zinc-800/30"
                >
                  <span className="font-mono text-[11px] font-bold text-stone-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-stone-200 dark:border-zinc-700 flex-shrink-0">
                    {h.kod}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-bold text-stone-800 dark:text-zinc-200 leading-tight mb-0.5">
                      {h.ad}
                    </div>
                    <div className="text-[11.5px] text-stone-500 dark:text-zinc-500 leading-snug font-medium">
                      {h.rol}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tipik kayıt */}
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 mb-2 font-bold">
              Tipik kayıt
            </div>
            <h4 className="font-display text-[15px] font-bold tracking-tight text-stone-900 dark:text-zinc-100 mb-1">
              {anlatim.ornek.baslik}
            </h4>
            <p className="text-[13px] leading-relaxed text-stone-600 dark:text-zinc-400 mb-3 font-medium">
              {anlatim.ornek.senaryo}
            </p>
            <OrnekKayitTablo satirlar={anlatim.ornek.satirlar} />
            {anlatim.ornek.yorum && (
              <p className="text-[12.5px] leading-relaxed text-stone-500 dark:text-zinc-500 mt-3 italic">
                {anlatim.ornek.yorum}
              </p>
            )}
          </div>

          {/* Püf noktaları */}
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 mb-3 font-bold">
              Püf noktaları
            </div>
            <ul className="space-y-2">
              {anlatim.pufNoktalari.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[13px] leading-relaxed text-stone-700 dark:text-zinc-300 font-medium"
                >
                  <Icon
                    name="Check"
                    size={13}
                    className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={toggle}
              className="text-[11.5px] tracking-[0.18em] uppercase text-stone-500 dark:text-zinc-500 font-bold hover:text-stone-900 dark:hover:text-zinc-200 transition flex items-center gap-1.5"
            >
              Konuyu kapat
              <Icon name="ChevronUp" size={12} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const OrnekKayitTablo = ({ satirlar }: { satirlar: KonuOrnekSatir[] }) => {
  const toplamBorc = satirlar.reduce((t, s) => t + (s.borc ?? 0), 0);
  const toplamAlacak = satirlar.reduce((t, s) => t + (s.alacak ?? 0), 0);

  return (
    <div className="border border-stone-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
      <div className="grid grid-cols-[80px_1fr_110px_110px] gap-px bg-stone-200 dark:bg-zinc-700 text-[10px] tracking-[0.18em] uppercase font-bold text-stone-500 dark:text-zinc-500">
        <div className="bg-stone-50 dark:bg-zinc-800 px-3 py-2">Kod</div>
        <div className="bg-stone-50 dark:bg-zinc-800 px-3 py-2">Hesap Adı</div>
        <div className="bg-stone-50 dark:bg-zinc-800 px-3 py-2 text-right">Borç</div>
        <div className="bg-stone-50 dark:bg-zinc-800 px-3 py-2 text-right">Alacak</div>
      </div>
      {satirlar.map((s, i) => (
        <div
          key={i}
          className="grid grid-cols-[80px_1fr_110px_110px] gap-px bg-stone-100 dark:bg-zinc-800 text-[12.5px]"
        >
          <div className="bg-white dark:bg-zinc-900 px-3 py-2 font-mono font-bold text-stone-900 dark:text-zinc-100">
            {s.kod}
          </div>
          <div className="bg-white dark:bg-zinc-900 px-3 py-2 text-stone-700 dark:text-zinc-300">
            {s.ad}
          </div>
          <div className="bg-white dark:bg-zinc-900 px-3 py-2 text-right font-mono tabular-nums text-stone-900 dark:text-zinc-100">
            {s.borc ? tutarFormat(s.borc) : ''}
          </div>
          <div className="bg-white dark:bg-zinc-900 px-3 py-2 text-right font-mono tabular-nums text-stone-900 dark:text-zinc-100">
            {s.alacak ? tutarFormat(s.alacak) : ''}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[80px_1fr_110px_110px] gap-px bg-stone-200 dark:bg-zinc-700 text-[11px] tracking-[0.18em] uppercase font-bold">
        <div className="bg-stone-50 dark:bg-zinc-800 px-3 py-2 col-span-2 text-stone-500 dark:text-zinc-500">
          Toplam
        </div>
        <div className="bg-stone-50 dark:bg-zinc-800 px-3 py-2 text-right font-mono tabular-nums text-stone-900 dark:text-zinc-100">
          {tutarFormat(toplamBorc)}
        </div>
        <div className="bg-stone-50 dark:bg-zinc-800 px-3 py-2 text-right font-mono tabular-nums text-stone-900 dark:text-zinc-100">
          {tutarFormat(toplamAlacak)}
        </div>
      </div>
    </div>
  );
};
