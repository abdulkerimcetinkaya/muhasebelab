import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { HESAP_PLANI } from '../data/hesap-plani';
import {
  TIP_ETIKETLERI,
  TIP_LISTESI,
  muavinYarat,
  sonrakiMuavinKodu,
  type MuavinHesap,
} from '../lib/muavin';
import type { MuavinTip } from '../lib/database.types';

interface Props {
  /** Modal açıldığında ön-seçili olacak ana hesap kodu (örn: 120). */
  anaKod: string;
  onKapat: () => void;
  onEklendi: (yeni: MuavinHesap) => void;
}

const tipTahmini = (anaKod: string): MuavinTip => {
  // 120, 220 → musteri | 320, 420 → tedarikci | 102 → banka | 100 → kasa
  // 335, 196 → personel | 153, 150, 152 → stok | diğer → diger
  if (anaKod === '120' || anaKod === '220') return 'musteri';
  if (anaKod === '320' || anaKod === '420') return 'tedarikci';
  if (anaKod === '102') return 'banka';
  if (anaKod === '100') return 'kasa';
  if (anaKod === '335' || anaKod === '196') return 'personel';
  if (['150', '151', '152', '153'].includes(anaKod)) return 'stok';
  return 'diger';
};

export const YeniMuavinModal = ({ anaKod: anaKodInit, onKapat, onEklendi }: Props) => {
  const [anaKod, setAnaKod] = useState(anaKodInit);
  const [kod, setKod] = useState('');
  const [ad, setAd] = useState('');
  const [tip, setTip] = useState<MuavinTip>(tipTahmini(anaKodInit));
  const [aciklama, setAciklama] = useState('');
  const [hata, setHata] = useState<string | null>(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  // Ana hesap değişince kod ve tipi yeniden öner
  useEffect(() => {
    let iptal = false;
    if (!anaKod) {
      setKod('');
      return;
    }
    setTip(tipTahmini(anaKod));
    sonrakiMuavinKodu(anaKod)
      .then((onerilen) => {
        if (!iptal) setKod(onerilen);
      })
      .catch(() => {
        if (!iptal) setKod(`${anaKod}.001`);
      });
    return () => {
      iptal = true;
    };
  }, [anaKod]);

  // ESC ile kapatma
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onKapat();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onKapat]);

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anaKod || !kod || !ad.trim()) {
      setHata('Ana hesap, kod ve ad zorunlu.');
      return;
    }
    if (!/^[0-9]{3}(\.[0-9]+)+$/.test(kod)) {
      setHata('Kod sadece numerik olabilir (örn: 120.001).');
      return;
    }
    if (!kod.startsWith(anaKod + '.')) {
      setHata(`Kod, ana hesap (${anaKod}) ile başlamalı.`);
      return;
    }
    setKaydediliyor(true);
    setHata(null);
    try {
      const yeni = await muavinYarat({
        kod,
        ana_kod: anaKod,
        ad: ad.trim(),
        tip,
        aciklama: aciklama.trim() || null,
      });
      onEklendi(yeni);
    } catch (err) {
      setHata(`Eklenemedi: ${(err as Error).message}`);
    } finally {
      setKaydediliyor(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
      onClick={onKapat}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              Yeni Muavin Ekle
            </h2>
            <p className="text-[12px] text-stone-500 dark:text-zinc-500 mt-0.5">
              Bu cariyi/alt hesabı bir kez ekle, tüm sorularda kullanabil.
            </p>
          </div>
          <button
            onClick={onKapat}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <form onSubmit={kaydet} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
                Ana Hesap
              </label>
              <select
                value={anaKod}
                onChange={(e) => setAnaKod(e.target.value)}
                required
                className="w-full px-2.5 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-[13px] font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
              >
                <option value="">— seç —</option>
                {HESAP_PLANI.map((h) => (
                  <option key={h.kod} value={h.kod}>
                    {h.kod} — {h.ad}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
                Muavin Kodu
              </label>
              <input
                type="text"
                value={kod}
                onChange={(e) => setKod(e.target.value)}
                required
                placeholder="120.001"
                className="w-full px-2.5 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-[13px] font-mono outline-none focus:border-stone-900 dark:focus:border-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
              Ad
            </label>
            <input
              type="text"
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              autoFocus
              required
              placeholder="ABC Ticaret Ltd. Şti."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
              Tip
            </label>
            <select
              value={tip}
              onChange={(e) => setTip(e.target.value as MuavinTip)}
              required
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
            >
              {TIP_LISTESI.map((t) => (
                <option key={t} value={t}>
                  {TIP_ETIKETLERI[t]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-1.5">
              Açıklama (opsiyonel)
            </label>
            <input
              type="text"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Vergi no: 1234567890, vb."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-[13px] font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
            />
          </div>

          {hata && (
            <div className="flex items-start gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-[12px] text-rose-800 dark:text-rose-300 font-medium">
              <Icon name="AlertCircle" size={14} className="flex-shrink-0 mt-0.5" />
              <span>{hata}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onKapat}
              className="px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold border border-stone-300 dark:border-zinc-700 rounded-lg hover:bg-stone-50 dark:hover:bg-zinc-800 transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={kaydediliyor}
              className="inline-flex items-center gap-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-5 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
            >
              <Icon
                name={kaydediliyor ? 'Loader2' : 'Plus'}
                size={12}
                className={kaydediliyor ? 'animate-spin' : ''}
              />
              {kaydediliyor ? 'Ekleniyor' : 'Ekle ve Seç'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
