import { Icon } from './Icon';

type Tip = 'senaryo' | 'kontrol' | 'istatistik' | 'zorluk';

export const OzellikMockup = ({ tip }: { tip: Tip }) => {
  if (tip === 'senaryo') {
    return (
      <div className="p-6 text-xs">
        <div className="text-[9px] tracking-[0.3em] uppercase text-stone-500 mb-2 font-bold">
          Soru · Kasa-2
        </div>
        <div className="font-display text-base mb-3 font-bold">Peşin Mal Satışı</div>
        <div className="border-l-2 border-blue-700 dark:border-blue-400 pl-3 py-1 mb-4">
          <div className="text-stone-800 dark:text-zinc-200 leading-relaxed font-medium">
            İşletme, ticari mal satışından 10.000 TL + %20 KDV tutarında peşin tahsilat yapmıştır.
          </div>
        </div>
        <div className="bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-1 px-2 py-1.5 border-b border-stone-200 dark:border-zinc-700 text-[8px] tracking-widest uppercase text-stone-500 font-bold">
            <div className="col-span-2">Kod</div>
            <div className="col-span-5">Hesap</div>
            <div className="col-span-2 text-right">Borç</div>
            <div className="col-span-3 text-right">Alacak</div>
          </div>
          {[
            { k: '100', a: 'KASA', b: '12.000,00', al: '' },
            { k: '600', a: 'YURT İÇİ SATIŞLAR', b: '', al: '10.000,00' },
            { k: '391', a: 'HESAPLANAN KDV', b: '', al: '2.000,00' },
          ].map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-1 px-2 py-1.5 text-[10px] font-mono border-b border-stone-100 dark:border-zinc-700/50"
            >
              <div className="col-span-2 font-bold">{r.k}</div>
              <div className="col-span-5 truncate font-medium">{r.a}</div>
              <div className="col-span-2 text-right">{r.b}</div>
              <div className="col-span-3 text-right">{r.al}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tip === 'kontrol') {
    return (
      <div className="p-6 text-xs">
        <div className="bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-1 px-2 py-1.5 border-b border-stone-200 dark:border-zinc-700 text-[8px] tracking-widest uppercase text-stone-500 bg-stone-50 dark:bg-zinc-900 font-bold">
            <div className="col-span-2">Kod</div>
            <div className="col-span-5">Hesap</div>
            <div className="col-span-2 text-right">Borç</div>
            <div className="col-span-2 text-right">Alacak</div>
            <div className="col-span-1"></div>
          </div>
          {[
            { k: '153', a: 'TİCARİ MALLAR', b: '40.000', al: '', ok: true },
            { k: '191', a: 'İNDİRİLECEK KDV', b: '8.000', al: '', ok: true },
            { k: '320', a: 'SATICILAR', b: '', al: '48.000', ok: false },
          ].map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 gap-1 px-2 py-1.5 text-[10px] font-mono border-b border-stone-100 dark:border-zinc-700/50 ${
                r.ok === false
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : 'bg-emerald-50 dark:bg-emerald-900/20'
              }`}
            >
              <div className="col-span-2 font-bold">{r.k}</div>
              <div className="col-span-5 truncate font-medium">{r.a}</div>
              <div className="col-span-2 text-right">{r.b}</div>
              <div className="col-span-2 text-right">{r.al}</div>
              <div className="col-span-1 text-right">
                {r.ok === true && <Icon name="Check" size={10} className="text-emerald-600" />}
                {r.ok === false && <Icon name="X" size={10} className="text-red-600" />}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 border-l-2 border-red-600 pl-3 py-1 bg-red-50/50 dark:bg-red-900/10 rounded">
          <div className="text-[10px] text-red-700 dark:text-red-400 font-bold">
            Hata: 320 yerine 100 Kasa olmalıydı (peşin ödeme).
          </div>
        </div>
      </div>
    );
  }

  if (tip === 'istatistik') {
    return (
      <div className="p-6 text-xs">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { et: 'Çözülen', de: '18' },
            { et: 'Puan', de: '245' },
            { et: 'Seri', de: '7', icon: 'Flame' },
          ].map((s, i) => (
            <div
              key={i}
              className="border border-stone-200 dark:border-zinc-700 p-3 rounded-lg"
            >
              <div className="text-[8px] tracking-widest uppercase text-stone-500 mb-1 font-bold">
                {s.et}
              </div>
              <div className="font-display text-2xl font-bold flex items-center gap-1">
                {s.de}
                {s.icon && <Icon name={s.icon} size={14} className="text-orange-600" />}
              </div>
            </div>
          ))}
        </div>
        <div className="text-[9px] tracking-widest uppercase text-stone-500 mb-2 font-bold">
          Ünite İlerlemesi
        </div>
        <div className="space-y-2">
          {[
            { ad: 'Kasa', p: 100 },
            { ad: 'Banka', p: 67 },
            { ad: 'Ticari Mal', p: 33 },
            { ad: 'KDV', p: 50 },
          ].map((u, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] mb-1 font-medium">
                <span>{u.ad}</span>
                <span className="font-mono font-bold">%{u.p}</span>
              </div>
              <div className="h-1 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-700 dark:bg-blue-400"
                  style={{ width: `${u.p}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tip === 'zorluk') {
    return (
      <div className="p-6 text-xs space-y-2">
        {[
          { zor: 'Kolay', renk: 'text-emerald-700 dark:text-emerald-400', baslik: 'Sermaye Koyma', p: 5 },
          { zor: 'Kolay', renk: 'text-emerald-700 dark:text-emerald-400', baslik: 'Kasadan Bankaya', p: 5 },
          { zor: 'Orta', renk: 'text-amber-700 dark:text-amber-400', baslik: 'Peşin Mal Satışı', p: 10 },
          { zor: 'Orta', renk: 'text-amber-700 dark:text-amber-400', baslik: 'KDV Mahsubu', p: 10 },
          { zor: 'Zor', renk: 'text-rose-700 dark:text-rose-400', baslik: 'Veresiye Mal Satışı', p: 20 },
          { zor: 'Zor', renk: 'text-rose-700 dark:text-rose-400', baslik: 'Ücret Tahakkuku', p: 20 },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3">
              <Icon
                name="CheckCircle2"
                size={12}
                className={i < 3 ? 'text-emerald-600' : 'text-stone-300 dark:text-zinc-700'}
              />
              <span className="font-semibold">{s.baslik}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[9px] tracking-widest uppercase font-bold ${s.renk}`}>
                {s.zor}
              </span>
              <span className="font-mono text-stone-500 font-bold">{s.p}p</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
