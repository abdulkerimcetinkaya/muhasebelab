import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HESAP_PLANI } from '../data/hesap-plani';
import { useIsPremium } from '../contexts/AuthContext';
import { Icon } from './Icon';
import { TIP_ETIKETLERI, type MuavinHesap } from '../lib/muavin';
import { YeniMuavinModal } from './YeniMuavinModal';
import type { Hesap } from '../types';

type Oneri =
  | { tip: 'ana'; hesap: Hesap }
  | { tip: 'muavin'; muavin: MuavinHesap };

interface Props {
  value: string;
  onChange: (v: string) => void;
  rowIndex: number;
  /** Aktif muavin listesi — parent'tan tek sefer yüklenip prop olarak geçilir. */
  muavinler?: MuavinHesap[];
  /** Admin context'inde true → dropdown'da "+ Yeni Muavin" butonu çıkar. */
  yeniMuavinEkleyebilir?: boolean;
  /** Yeni muavin eklendiğinde parent'ın listesini güncellemek için. */
  onMuavinEklendi?: (muavin: MuavinHesap) => void;
}

export const HesapKoduInput = ({
  value,
  onChange,
  rowIndex,
  muavinler = [],
  yeniMuavinEkleyebilir = false,
  onMuavinEklendi,
}: Props) => {
  const nav = useNavigate();
  const isPremium = useIsPremium();
  const [dropdownAcik, setDropdownAcik] = useState(false);
  const [seciliIdx, setSeciliIdx] = useState(0);
  const [muavinModalAcik, setMuavinModalAcik] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sayisalMi = /^[0-9.]+$/.test(value);

  const oneriler = useMemo<Oneri[]>(() => {
    if (!value || value.length === 0) return [];

    if (sayisalMi) {
      // Prefix-match: hem ana hesap hem muavin (Free + Premium)
      const anaHesaplar: Oneri[] = HESAP_PLANI.filter((h) =>
        h.kod.startsWith(value),
      ).map((h) => ({ tip: 'ana' as const, hesap: h }));
      const muavinSatirlari: Oneri[] = muavinler
        .filter((m) => m.kod.startsWith(value))
        .map((m) => ({ tip: 'muavin' as const, muavin: m }));
      // Ana hesap önce, ardından muavinleri (gruplar halinde)
      const birlesik: Oneri[] = [];
      anaHesaplar.forEach((ah) => {
        birlesik.push(ah);
        const ahKod = ah.tip === 'ana' ? ah.hesap.kod : '';
        muavinSatirlari
          .filter((m) => m.tip === 'muavin' && m.muavin.ana_kod === ahKod)
          .forEach((m) => birlesik.push(m));
      });
      // Doğrudan muavin koduyla başlanmış olabilir (örn: "120.0") — eklenmemiş kalanları ekle
      muavinSatirlari.forEach((m) => {
        if (!birlesik.some((x) => x.tip === 'muavin' && x.muavin.kod === (m.tip === 'muavin' ? m.muavin.kod : ''))) {
          birlesik.push(m);
        }
      });
      return birlesik.slice(0, 10);
    }

    // Ad ile arama → Premium only
    if (!isPremium) return [];
    const q = value.toLocaleLowerCase('tr');
    const anaAd: Oneri[] = HESAP_PLANI.filter((h) =>
      h.ad.toLocaleLowerCase('tr').includes(q),
    ).map((h) => ({ tip: 'ana' as const, hesap: h }));
    const muavinAd: Oneri[] = muavinler
      .filter((m) => m.ad.toLocaleLowerCase('tr').includes(q))
      .map((m) => ({ tip: 'muavin' as const, muavin: m }));
    return [...muavinAd, ...anaAd].slice(0, 10);
  }, [value, sayisalMi, muavinler, isPremium]);

  // Ana hesap seçilmiş ve onun aktif muavinleri var mı? (uyarı için)
  const anaHesapUyari = useMemo(() => {
    if (!value || !/^[0-9]{3}$/.test(value)) return null;
    const muavinSayisi = muavinler.filter((m) => m.ana_kod === value).length;
    return muavinSayisi > 0 ? muavinSayisi : null;
  }, [value, muavinler]);

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

  const oneriKodu = (o: Oneri): string =>
    o.tip === 'ana' ? o.hesap.kod : o.muavin.kod;

  const secim = (oneri: Oneri) => {
    onChange(oneriKodu(oneri));
    setDropdownAcik(false);
    setTimeout(() => {
      const borcInput = document.querySelector<HTMLInputElement>(
        `[data-row="${rowIndex}"][data-col="borc"]`,
      );
      if (borcInput) borcInput.focus();
    }, 0);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  // Modal için ön-doldurma: input'taki ana hesabı varsayılan al
  const modalAnaKod = useMemo(() => {
    if (/^[0-9]{3}$/.test(value)) return value;
    if (/^[0-9]{3}\.[0-9]+$/.test(value)) return value.split('.')[0];
    return '';
  }, [value]);

  const muavinEklendi = (yeni: MuavinHesap) => {
    onMuavinEklendi?.(yeni);
    onChange(yeni.kod);
    setMuavinModalAcik(false);
  };

  // Free kullanıcı için ad arama upsell çağrısı
  const adAramaUpsellGoster = !isPremium && !sayisalMi && value.length > 0;

  return (
    <>
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
          className={`w-full font-mono text-sm px-2 py-1.5 bg-stone-50 dark:bg-zinc-800 border border-transparent focus:border-stone-900 dark:focus:border-zinc-400 focus:bg-white dark:focus:bg-zinc-900 outline-none transition ${adAramaUpsellGoster ? 'pr-7' : ''}`}
        />

        {/* Premium upsell — ad ile arama yapmaya çalışan free kullanıcı için */}
        {adAramaUpsellGoster && dropdownAcik && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              nav('/premium');
            }}
            title="Ad ile arama — Premium özellik"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
          >
            <Icon name="Sparkles" size={12} />
          </button>
        )}

        {/* Ana hesap uyarısı — kayıt yapılamaz */}
        {anaHesapUyari && (
          <div className="absolute top-full left-0 right-0 mt-1 z-40 px-2 py-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded text-[11px] font-medium text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <Icon name="AlertTriangle" size={11} className="flex-shrink-0" />
            <span>
              Ana hesaba kayıt yapılamaz — alt muavin seç ({anaHesapUyari} adet
              muavin var)
            </span>
          </div>
        )}

        {/* Dropdown */}
        {dropdownAcik && oneriler.length > 0 && (
          <div
            className="autocomplete-dropdown absolute top-full left-0 mt-1 bg-white dark:bg-zinc-900 border border-stone-900/10 dark:border-zinc-700 z-50 max-h-64 overflow-auto rounded-xl"
            style={{ minWidth: '380px' }}
          >
            {oneriler.map((o, i) =>
              o.tip === 'ana' ? (
                <button
                  key={`a-${o.hesap.kod}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    secim(o);
                  }}
                  onMouseEnter={() => setSeciliIdx(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs hover:bg-stone-50 dark:hover:bg-zinc-800 ${i === seciliIdx ? 'bg-stone-100 dark:bg-zinc-800' : ''}`}
                >
                  <span className="font-mono font-semibold w-14">
                    {o.hesap.kod}
                  </span>
                  <span className="flex-1">{o.hesap.ad}</span>
                  <span
                    className={`text-[9px] tracking-widest uppercase font-semibold ${
                      o.hesap.tur === 'AKTİF'
                        ? 'text-blue-700 dark:text-blue-400'
                        : o.hesap.tur === 'PASİF'
                          ? 'text-amber-700 dark:text-amber-400'
                          : o.hesap.tur === 'GELİR'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : o.hesap.tur === 'GİDER'
                              ? 'text-red-700 dark:text-red-400'
                              : 'text-stone-500'
                    }`}
                  >
                    {o.hesap.tur}
                  </span>
                </button>
              ) : (
                <button
                  key={`m-${o.muavin.kod}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    secim(o);
                  }}
                  onMouseEnter={() => setSeciliIdx(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2 pl-6 text-left text-xs hover:bg-stone-50 dark:hover:bg-zinc-800 border-l-2 border-stone-200 dark:border-zinc-700 ml-2 ${i === seciliIdx ? 'bg-stone-100 dark:bg-zinc-800' : ''}`}
                >
                  <span className="font-mono font-semibold w-16">
                    {o.muavin.kod}
                  </span>
                  <span className="flex-1">{o.muavin.ad}</span>
                  <span className="text-[9px] tracking-widest uppercase font-semibold text-stone-500 dark:text-zinc-500">
                    {TIP_ETIKETLERI[o.muavin.tip]}
                  </span>
                </button>
              ),
            )}

            {/* "+ Yeni Muavin" butonu — sadece admin */}
            {yeniMuavinEkleyebilir && modalAnaKod && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setDropdownAcik(false);
                  setMuavinModalAcik(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs border-t border-stone-200 dark:border-zinc-700 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold"
              >
                <Icon name="PlusCircle" size={12} />
                <span>{modalAnaKod} altına yeni muavin ekle</span>
              </button>
            )}
          </div>
        )}
      </div>

      {muavinModalAcik && (
        <YeniMuavinModal
          anaKod={modalAnaKod}
          onKapat={() => setMuavinModalAcik(false)}
          onEklendi={muavinEklendi}
        />
      )}
    </>
  );
};
