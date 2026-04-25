import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { EmptyState } from '../components/EmptyState';
import { useUniteler } from '../contexts/UnitelerContext';
import { ZORLUK_AD, ZORLUK_PUAN, ZORLUK_SIRA, ZORLUK_STIL } from '../data/sabitler';
import type { Ilerleme, Zorluk } from '../types';

interface Props {
  ilerleme: Ilerleme;
}

type DurumFiltre = 'hepsi' | 'cozulen' | 'cozulmeyen';
type SiralamaFld = 'sira' | 'zorluk' | 'unite' | 'durum';

export const ProblemlerSayfasi = ({ ilerleme }: Props) => {
  const nav = useNavigate();
  const { uniteler, tumSorular } = useUniteler();
  const [arama, setArama] = useState('');
  const [zorlukFiltre, setZorlukFiltre] = useState<'hepsi' | Zorluk>('hepsi');
  const [uniteFiltre, setUniteFiltre] = useState('hepsi');
  const [durumFiltre, setDurumFiltre] = useState<DurumFiltre>('hepsi');
  const [siralamaFld, setSiralamaFld] = useState<SiralamaFld>('sira');
  const [siralamaYon, setSiralamaYon] = useState<'asc' | 'desc'>('asc');

  const filtreli = useMemo(() => {
    let sonuc = [...tumSorular];
    if (zorlukFiltre !== 'hepsi') sonuc = sonuc.filter((s) => s.zorluk === zorlukFiltre);
    if (uniteFiltre !== 'hepsi') sonuc = sonuc.filter((s) => s.uniteId === uniteFiltre);
    if (durumFiltre === 'cozulen') sonuc = sonuc.filter((s) => ilerleme.cozulenler[s.id]);
    if (durumFiltre === 'cozulmeyen') sonuc = sonuc.filter((s) => !ilerleme.cozulenler[s.id]);
    if (arama.trim()) {
      const q = arama.toLocaleLowerCase('tr');
      sonuc = sonuc.filter(
        (s) =>
          s.baslik.toLocaleLowerCase('tr').includes(q) ||
          s.senaryo.toLocaleLowerCase('tr').includes(q) ||
          s.uniteAd.toLocaleLowerCase('tr').includes(q),
      );
    }
    sonuc.sort((a, b) => {
      let x = 0;
      if (siralamaFld === 'zorluk') x = ZORLUK_SIRA[a.zorluk] - ZORLUK_SIRA[b.zorluk];
      else if (siralamaFld === 'unite') x = a.uniteAd.localeCompare(b.uniteAd, 'tr');
      else if (siralamaFld === 'durum')
        x = (ilerleme.cozulenler[a.id] ? 1 : 0) - (ilerleme.cozulenler[b.id] ? 1 : 0);
      return siralamaYon === 'asc' ? x : -x;
    });
    return sonuc;
  }, [arama, zorlukFiltre, uniteFiltre, durumFiltre, siralamaFld, siralamaYon, ilerleme.cozulenler]);

  const sirala = (fld: SiralamaFld) => {
    if (siralamaFld === fld) setSiralamaYon(siralamaYon === 'asc' ? 'desc' : 'asc');
    else {
      setSiralamaFld(fld);
      setSiralamaYon('asc');
    }
  };

  const SirOk = ({ fld }: { fld: SiralamaFld }) => {
    if (siralamaFld !== fld)
      return <Icon name="ChevronsUpDown" size={10} className="text-stone-300 dark:text-zinc-700" />;
    return <Icon name={siralamaYon === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={10} />;
  };

  const cozulenSayi = tumSorular.filter((s) => ilerleme.cozulenler[s.id]).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-3 font-bold">
          Tüm Sorular
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-3 font-bold">
          Problemler
        </h1>
        <p className="text-stone-600 dark:text-zinc-400 max-w-2xl font-medium">
          {tumSorular.length} soru · {cozulenSayi} çözüldü · %
          {tumSorular.length > 0 ? Math.round((cozulenSayi / tumSorular.length) * 100) : 0} ilerleme
        </p>
      </div>

      <div className="mb-6 bg-white dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 p-4 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              <Icon name="Search" size={14} />
            </span>
            <input
              type="text"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="Ara..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium"
            />
          </div>
          <select
            value={zorlukFiltre}
            onChange={(e) => setZorlukFiltre(e.target.value as typeof zorlukFiltre)}
            className="px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 text-sm focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none rounded-lg font-medium"
          >
            <option value="hepsi">Tüm Zorluklar</option>
            <option value="kolay">Kolay</option>
            <option value="orta">Orta</option>
            <option value="zor">Zor</option>
          </select>
          <select
            value={uniteFiltre}
            onChange={(e) => setUniteFiltre(e.target.value)}
            className="px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 text-sm focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none rounded-lg font-medium"
          >
            <option value="hepsi">Tüm Üniteler</option>
            {uniteler.map((u) => (
              <option key={u.id} value={u.id}>
                {u.ad}
              </option>
            ))}
          </select>
          <select
            value={durumFiltre}
            onChange={(e) => setDurumFiltre(e.target.value as DurumFiltre)}
            className="px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 text-sm focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none rounded-lg font-medium"
          >
            <option value="hepsi">Tüm Durumlar</option>
            <option value="cozulen">Çözülenler</option>
            <option value="cozulmeyen">Henüz Çözülmemiş</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
          <button
            onClick={() => sirala('durum')}
            className="col-span-1 text-left flex items-center gap-1 hover:text-stone-900 dark:hover:text-zinc-100"
          >
            Durum <SirOk fld="durum" />
          </button>
          <div className="col-span-5">Başlık</div>
          <button
            onClick={() => sirala('unite')}
            className="col-span-3 text-left flex items-center gap-1 hover:text-stone-900 dark:hover:text-zinc-100"
          >
            Ünite <SirOk fld="unite" />
          </button>
          <button
            onClick={() => sirala('zorluk')}
            className="col-span-2 text-left flex items-center gap-1 hover:text-stone-900 dark:hover:text-zinc-100"
          >
            Zorluk <SirOk fld="zorluk" />
          </button>
          <div className="col-span-1 text-right">Puan</div>
        </div>
        {filtreli.map((s) => {
          const cozulmus = !!ilerleme.cozulenler[s.id];
          const yanlisSayi = ilerleme.yanlislar[s.id] || 0;
          const durumIkon = cozulmus ? (
            <Icon
              name="CheckCircle2"
              size={18}
              className="text-emerald-700 dark:text-emerald-400"
            />
          ) : yanlisSayi > 0 ? (
            <Icon name="XCircle" size={18} className="text-rose-500" />
          ) : (
            <Icon name="Circle" size={18} className="text-stone-300 dark:text-zinc-700" />
          );
          return (
            <button
              key={s.id}
              onClick={() =>
                nav(`/problemler/${s.id}`, {
                  state: { liste: filtreli.map((x) => x.id) },
                })
              }
              className="w-full border-b border-stone-100 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-800/50 transition text-left"
            >
              {/* Mobile (<md) — kart görünüm */}
              <div className="md:hidden px-4 py-3 flex items-start gap-3">
                <div className="pt-0.5 flex-shrink-0">{durumIkon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base leading-tight font-bold">{s.baslik}</div>
                  <div className="text-xs text-stone-500 dark:text-zinc-500 line-clamp-1 mt-0.5 font-medium">
                    {s.senaryo}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-zinc-400 font-semibold">
                      <Thiings name={s.uniteIcon} size={16} />
                      <span className="truncate max-w-[140px]">{s.uniteAd}</span>
                    </span>
                    <span
                      className={`text-[9px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[s.zorluk]}`}
                    >
                      {ZORLUK_AD[s.zorluk]}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-zinc-500 ml-auto">
                      {ZORLUK_PUAN[s.zorluk]}p
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop (md+) — tablo */}
              <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 items-center">
                <div className="col-span-1">{durumIkon}</div>
                <div className="col-span-5">
                  <div className="font-display text-base leading-tight font-bold">{s.baslik}</div>
                  <div className="text-xs text-stone-500 dark:text-zinc-500 line-clamp-1 mt-0.5 font-medium">
                    {s.senaryo}
                  </div>
                </div>
                <div className="col-span-3 flex items-center gap-2 text-sm">
                  <Thiings name={s.uniteIcon} size={24} />
                  <span className="text-stone-700 dark:text-zinc-300 truncate font-semibold">
                    {s.uniteAd}
                  </span>
                </div>
                <div className="col-span-2">
                  <span
                    className={`text-[10px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[s.zorluk]}`}
                  >
                    {ZORLUK_AD[s.zorluk]}
                  </span>
                </div>
                <div className="col-span-1 text-right font-mono text-sm text-stone-500 dark:text-zinc-500 font-bold">
                  {ZORLUK_PUAN[s.zorluk]}
                </div>
              </div>
            </button>
          );
        })}
        {filtreli.length === 0 && (
          <EmptyState
            ikon="Search"
            baslik="Filtreyle eşleşen soru yok"
            aciklama="Aramayı temizleyebilir veya farklı bir zorluk/ünite seçebilirsin."
            cta={{
              label: 'Filtreleri Temizle',
              icon: 'RefreshCw',
              onTikla: () => {
                setArama('');
                setZorlukFiltre('hepsi');
                setUniteFiltre('hepsi');
                setDurumFiltre('hepsi');
              },
            }}
          />
        )}
      </div>

      <div className="mt-4 text-xs text-stone-500 dark:text-zinc-500 font-semibold">
        {filtreli.length} / {tumSorular.length} soru gösteriliyor
      </div>
    </main>
  );
};
