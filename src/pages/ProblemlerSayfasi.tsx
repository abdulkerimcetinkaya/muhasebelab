import { useEffect, useMemo, useState } from 'react';
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

/** Bir sayfada gösterilecek soru sayısı */
const SAYFA_BOYUT = 10;

/* Sıralama oku — parent dışında tanımlı (her render'da yeniden oluşmasın) */
const SirOk = ({
  fld,
  aktifFld,
  yon,
}: {
  fld: SiralamaFld;
  aktifFld: SiralamaFld;
  yon: 'asc' | 'desc';
}) => {
  if (aktifFld !== fld) {
    return <Icon name="ChevronsUpDown" size={10} className="text-ink-quiet" />;
  }
  return <Icon name={yon === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={10} />;
};

export const ProblemlerSayfasi = ({ ilerleme }: Props) => {
  const nav = useNavigate();
  const { uniteler, tumSorular } = useUniteler();
  const [arama, setArama] = useState('');
  const [zorlukFiltre, setZorlukFiltre] = useState<'hepsi' | Zorluk>('hepsi');
  const [uniteFiltre, setUniteFiltre] = useState('hepsi');
  const [durumFiltre, setDurumFiltre] = useState<DurumFiltre>('hepsi');
  const [siralamaFld, setSiralamaFld] = useState<SiralamaFld>('sira');
  const [siralamaYon, setSiralamaYon] = useState<'asc' | 'desc'>('asc');
  const [sayfa, setSayfa] = useState(1);

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
  }, [tumSorular, arama, zorlukFiltre, uniteFiltre, durumFiltre, siralamaFld, siralamaYon, ilerleme.cozulenler]);

  // Filtre veya sıralama değişince ilk sayfaya dön — kullanıcı yanlış sayfada
  // boş veri görmesin (örn. 20. sayfadayken filtre 3 soruya düşerse).
  useEffect(() => {
    setSayfa(1);
  }, [arama, zorlukFiltre, uniteFiltre, durumFiltre, siralamaFld, siralamaYon]);

  const toplamSayfa = Math.max(1, Math.ceil(filtreli.length / SAYFA_BOYUT));
  const guvenliSayfa = Math.min(sayfa, toplamSayfa);
  const ilk = (guvenliSayfa - 1) * SAYFA_BOYUT;
  const son = Math.min(ilk + SAYFA_BOYUT, filtreli.length);
  const sayfadakiler = filtreli.slice(ilk, son);

  const sirala = (fld: SiralamaFld) => {
    if (siralamaFld === fld) setSiralamaYon(siralamaYon === 'asc' ? 'desc' : 'asc');
    else {
      setSiralamaFld(fld);
      setSiralamaYon('asc');
    }
  };

  const cozulenSayi = tumSorular.filter((s) => ilerleme.cozulenler[s.id]).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-ink-mute mb-3 font-bold">
          Tüm Sorular
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-3 font-bold">
          Problemler
        </h1>
        <p className="text-ink-soft max-w-2xl font-medium">
          {tumSorular.length} soru · {cozulenSayi} çözüldü · %
          {tumSorular.length > 0 ? Math.round((cozulenSayi / tumSorular.length) * 100) : 0} ilerleme
        </p>
      </div>

      <div className="mb-6 bg-surface border border-line p-4 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-quiet">
              <Icon name="Search" size={14} />
            </span>
            <input
              type="text"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="Ara..."
              className="w-full pl-9 pr-3 py-2 bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium"
            />
          </div>
          <select
            value={zorlukFiltre}
            onChange={(e) => setZorlukFiltre(e.target.value as typeof zorlukFiltre)}
            className="px-3 py-2 bg-bg-tint border border-line-strong text-sm focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none rounded-lg font-medium"
          >
            <option value="hepsi">Tüm Zorluklar</option>
            <option value="kolay">Kolay</option>
            <option value="orta">Orta</option>
            <option value="zor">Zor</option>
          </select>
          <select
            value={uniteFiltre}
            onChange={(e) => setUniteFiltre(e.target.value)}
            className="px-3 py-2 bg-bg-tint border border-line-strong text-sm focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none rounded-lg font-medium"
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
            className="px-3 py-2 bg-bg-tint border border-line-strong text-sm focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none rounded-lg font-medium"
          >
            <option value="hepsi">Tüm Durumlar</option>
            <option value="cozulen">Çözülenler</option>
            <option value="cozulmeyen">Henüz Çözülmemiş</option>
          </select>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-line bg-bg-tint text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold">
          <button
            onClick={() => sirala('durum')}
            className="col-span-1 text-left flex items-center gap-1 hover:text-ink"
          >
            Durum <SirOk fld="durum" aktifFld={siralamaFld} yon={siralamaYon} />
          </button>
          <div className="col-span-5">Başlık</div>
          <button
            onClick={() => sirala('unite')}
            className="col-span-3 text-left flex items-center gap-1 hover:text-ink"
          >
            Ünite <SirOk fld="unite" aktifFld={siralamaFld} yon={siralamaYon} />
          </button>
          <button
            onClick={() => sirala('zorluk')}
            className="col-span-2 text-left flex items-center gap-1 hover:text-ink"
          >
            Zorluk <SirOk fld="zorluk" aktifFld={siralamaFld} yon={siralamaYon} />
          </button>
          <div className="col-span-1 text-right">Puan</div>
        </div>
        {sayfadakiler.map((s) => {
          const cozulmus = !!ilerleme.cozulenler[s.id];
          const yanlisSayi = ilerleme.yanlislar[s.id] || 0;
          const durumIkon = cozulmus ? (
            <Icon
              name="CheckCircle2"
              size={18}
              className="text-success dark:text-success"
            />
          ) : yanlisSayi > 0 ? (
            <Icon name="XCircle" size={18} className="text-danger" />
          ) : (
            <Icon name="Circle" size={18} className="text-ink-quiet" />
          );
          return (
            <button
              key={s.id}
              onClick={() =>
                nav(`/problemler/${s.id}`, {
                  state: { liste: filtreli.map((x) => x.id) },
                })
              }
              className="w-full border-b border-line-soft hover:bg-bg-tint transition text-left"
            >
              {/* Mobile (<md) — kart görünüm */}
              <div className="md:hidden px-4 py-3 flex items-start gap-3">
                <div className="pt-0.5 flex-shrink-0">{durumIkon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base leading-tight font-bold">{s.baslik}</div>
                  <div className="text-xs text-ink-mute line-clamp-1 mt-0.5 font-medium">
                    {s.senaryo}
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-ink-soft font-semibold">
                      <Thiings name={s.uniteIcon} size={16} />
                      <span className="truncate max-w-[140px]">{s.uniteAd}</span>
                    </span>
                    <span
                      className={`text-[9px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[s.zorluk]}`}
                    >
                      {ZORLUK_AD[s.zorluk]}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-ink-mute ml-auto">
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
                  <div className="text-xs text-ink-mute line-clamp-1 mt-0.5 font-medium">
                    {s.senaryo}
                  </div>
                </div>
                <div className="col-span-3 flex items-center gap-2 text-sm">
                  <Thiings name={s.uniteIcon} size={24} />
                  <span className="text-ink-soft truncate font-semibold">
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
                <div className="col-span-1 text-right font-mono text-sm text-ink-mute font-bold">
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

      {/* Sayfalama */}
      {filtreli.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-ink-mute font-semibold">
            {ilk + 1}–{son} / {filtreli.length} soru
            {filtreli.length !== tumSorular.length && (
              <span className="text-ink-quiet"> (toplam {tumSorular.length})</span>
            )}
          </div>
          {toplamSayfa > 1 && (
            <nav className="flex items-center gap-1" aria-label="Sayfalama">
              <button
                type="button"
                onClick={() => setSayfa((p) => Math.max(1, p - 1))}
                disabled={guvenliSayfa <= 1}
                className="px-2.5 py-1.5 rounded border border-line text-[12px] font-semibold text-ink-soft hover:bg-bg-tint disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Önceki sayfa"
              >
                <Icon name="ChevronLeft" size={14} />
              </button>
              {sayfaNumaralari(guvenliSayfa, toplamSayfa).map((n, i) =>
                n === '…' ? (
                  <span
                    key={`gap-${i}`}
                    className="px-1 text-[12px] text-ink-quiet select-none"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSayfa(n)}
                    className={`min-w-[32px] px-2 py-1.5 rounded text-[12px] font-mono font-bold transition ${
                      n === guvenliSayfa
                        ? 'bg-ink text-paper'
                        : 'border border-line text-ink-soft hover:bg-bg-tint'
                    }`}
                    aria-label={`Sayfa ${n}`}
                    aria-current={n === guvenliSayfa ? 'page' : undefined}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => setSayfa((p) => Math.min(toplamSayfa, p + 1))}
                disabled={guvenliSayfa >= toplamSayfa}
                className="px-2.5 py-1.5 rounded border border-line text-[12px] font-semibold text-ink-soft hover:bg-bg-tint disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Sonraki sayfa"
              >
                <Icon name="ChevronRight" size={14} />
              </button>
            </nav>
          )}
        </div>
      )}
    </main>
  );
};

/**
 * Sayfa numarası şeridi üretir: [1, '…', 4, 5, 6, '…', 22] gibi.
 * Aktif sayfanın etrafında 1 sayfa, baş/son sabit, gerekirse … koy.
 */
function sayfaNumaralari(aktif: number, toplam: number): (number | '…')[] {
  if (toplam <= 7) return Array.from({ length: toplam }, (_, i) => i + 1);

  const set = new Set<number>([1, toplam, aktif, aktif - 1, aktif + 1]);
  const sirali = Array.from(set)
    .filter((n) => n >= 1 && n <= toplam)
    .sort((a, b) => a - b);

  const sonuc: (number | '…')[] = [];
  for (let i = 0; i < sirali.length; i++) {
    if (i > 0 && sirali[i] - sirali[i - 1] > 1) sonuc.push('…');
    sonuc.push(sirali[i]);
  }
  return sonuc;
}
