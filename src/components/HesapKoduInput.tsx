import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HESAP_PLANI } from '../data/hesap-plani';
import { useIsPremium } from '../contexts/AuthContext';
import { Icon } from './Icon';
import type { Hesap } from '../types';

interface Props {
  value: string;
  onChange: (v: string) => void;
  rowIndex: number;
}

export const HesapKoduInput = ({ value, onChange, rowIndex }: Props) => {
  const nav = useNavigate();
  const isPremium = useIsPremium();
  const [dropdownAcik, setDropdownAcik] = useState(false);
  const [seciliIdx, setSeciliIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const oneriler = useMemo<Hesap[]>(() => {
    if (!value || value.length === 0) return [];
    const q = value.toLocaleLowerCase('tr');
    return HESAP_PLANI.filter(
      (h) => h.kod.startsWith(value) || h.ad.toLocaleLowerCase('tr').includes(q),
    ).slice(0, 7);
  }, [value]);

  useEffect(() => {
    setSeciliIdx(0);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownAcik(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const secim = (hesap: Hesap) => {
    onChange(hesap.kod);
    setDropdownAcik(false);
    setTimeout(() => {
      const borcInput = document.querySelector<HTMLInputElement>(
        `[data-row="${rowIndex}"][data-col="borc"]`,
      );
      if (borcInput) borcInput.focus();
    }, 0);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPremium) return;
    if (!dropdownAcik || oneriler.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSeciliIdx((seciliIdx + 1) % oneriler.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSeciliIdx((seciliIdx - 1 + oneriler.length) % oneriler.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (oneriler[seciliIdx]) {
        e.preventDefault();
        secim(oneriler[seciliIdx]);
      }
    } else if (e.key === 'Escape') {
      setDropdownAcik(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value.trim());
          setDropdownAcik(true);
        }}
        onFocus={() => setDropdownAcik(true)}
        onKeyDown={handleKey}
        placeholder={isPremium ? 'Kod / ad...' : 'Kod...'}
        data-row={rowIndex}
        data-col="kod"
        className={`w-full font-mono text-sm px-2 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-transparent focus:border-stone-900 dark:focus:border-zinc-400 focus:bg-white dark:focus:bg-zinc-900 outline-none transition ${!isPremium ? 'pr-7' : ''}`}
      />
      {!isPremium && dropdownAcik && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            nav('/premium');
          }}
          title="Hesap kodu otomatik tamamlama — Premium özellik"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
        >
          <Icon name="Sparkles" size={12} />
        </button>
      )}
      {isPremium && dropdownAcik && oneriler.length > 0 && (
        <div
          className="autocomplete-dropdown absolute top-full left-0 mt-1 bg-white dark:bg-zinc-900 border border-stone-900/10 dark:border-zinc-700 z-50 max-h-64 overflow-auto rounded-xl"
          style={{ minWidth: '340px' }}
        >
          {oneriler.map((h, i) => (
            <button
              key={h.kod}
              onMouseDown={(e) => {
                e.preventDefault();
                secim(h);
              }}
              onMouseEnter={() => setSeciliIdx(i)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs hover:bg-stone-50 dark:hover:bg-zinc-800 ${i === seciliIdx ? 'bg-stone-100 dark:bg-zinc-800' : ''}`}
            >
              <span className="font-mono font-semibold w-10">{h.kod}</span>
              <span className="flex-1">{h.ad}</span>
              <span
                className={`text-[9px] tracking-widest uppercase font-semibold ${
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
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
