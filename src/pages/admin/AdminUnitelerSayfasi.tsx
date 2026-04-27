import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import { AdminYanMenu } from '../../components/AdminYanMenu';
import { Thiings } from '../../components/Thiings';
import { EmptyState } from '../../components/EmptyState';
import { SkeletonSatirlar } from '../../components/Skeleton';
import { supabase } from '../../lib/supabase';
import type { UnitesRow } from '../../lib/database.types';

interface UniteIstatistik extends UnitesRow {
  soruSayisi: number;
}

const IKON_SECENEK = [
  'acilis',
  'hazir-degerler',
  'mal-alis',
  'mal-satis',
  'ticari-alacaklar',
  'ticari-borclar',
  'kdv',
  'personel',
  'mdv',
  'amortisman',
  'reeskont-karsilik',
  'stok-degerleme',
  'yabanci-kaynaklar',
  'gelir-tablosu',
  'donem-sonu-kapanis',
  // Yedek/dekoratif
  'calculator',
  'rocket',
  'trophy',
  'chart',
  'tl',
  'dolar',
  'euro',
];

interface FormDurum {
  acik: boolean;
  duzenleniyor: UnitesRow | null;
}

export const AdminUnitelerSayfasi = () => {
  const [uniteler, setUniteler] = useState<UniteIstatistik[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [arama, setArama] = useState('');
  const [form, setForm] = useState<FormDurum>({ acik: false, duzenleniyor: null });

  const yukle = async () => {
    setYukleniyor(true);
    const uniteR = await supabase.from('unites').select('*').order('sira');
    if (uniteR.error) {
      setHata(uniteR.error.message);
      setYukleniyor(false);
      return;
    }
    const sayim = await supabase.from('sorular').select('unite_id');
    const dagilim: Record<string, number> = {};
    (sayim.data ?? []).forEach((r) => {
      dagilim[r.unite_id] = (dagilim[r.unite_id] ?? 0) + 1;
    });
    setUniteler(
      (uniteR.data ?? []).map((u) => ({ ...u, soruSayisi: dagilim[u.id] ?? 0 })),
    );
    setHata(null);
    setYukleniyor(false);
  };

  useEffect(() => {
    yukle().catch((e) => {
      console.error('Üniteler yüklenemedi', e);
      setHata(String(e));
      setYukleniyor(false);
    });
  }, []);

  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase();
    if (!q) return uniteler;
    return uniteler.filter(
      (u) =>
        u.id.toLowerCase().includes(q) ||
        u.ad.toLowerCase().includes(q) ||
        (u.aciklama ?? '').toLowerCase().includes(q),
    );
  }, [uniteler, arama]);

  const sil = async (u: UnitesRow, soruSayisi: number) => {
    if (soruSayisi > 0) {
      alert(
        `"${u.ad}" ünitesinde ${soruSayisi} soru var. Önce bu soruları başka üniteye taşı veya sil, sonra tekrar dene.`,
      );
      return;
    }
    if (!confirm(`"${u.ad}" ünitesini silmek istediğinden emin misin?`)) return;
    const r = await supabase.from('unites').delete().eq('id', u.id);
    if (r.error) {
      alert('Silme hatası: ' + r.error.message);
      return;
    }
    yukle();
  };

  const siraDegistir = async (u: UnitesRow, yeniSira: number) => {
    if (yeniSira === u.sira) return;
    const r = await supabase.from('unites').update({ sira: yeniSira }).eq('id', u.id);
    if (r.error) {
      alert('Sıra güncelleme hatası: ' + r.error.message);
      return;
    }
    yukle();
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <AdminYanMenu />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Üniteler</h1>
          <button
            onClick={() => setForm({ acik: true, duzenleniyor: null })}
            className="btn btn-primary"
          >
            <Icon name="PlusCircle" size={14} />
            Yeni Ünite
          </button>
        </div>
        <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium mb-6">
          Üniteleri ekle, düzenle, sil ve sıralarını değiştir. Sorular bağlı olan üniteler
          silinemez.
        </p>

        <div className="mb-4">
          <div className="relative max-w-md">
            <Icon
              name="Search"
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-600"
            />
            <input
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="Ad, ID veya açıklama ara…"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
            />
          </div>
        </div>

        {hata && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-sm text-rose-800 dark:text-rose-300">
            {hata}
          </div>
        )}

        {yukleniyor ? (
          <SkeletonSatirlar satirSayisi={6} />
        ) : filtreli.length === 0 ? (
          <EmptyState
            ikon="Package"
            baslik="Ünite bulunamadı"
            aciklama={arama ? 'Aramana uygun ünite yok.' : 'Henüz hiç ünite yok. Yeni Ünite ile başla.'}
          />
        ) : (
          <div className="border border-stone-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50">
            <div className="grid grid-cols-[64px_56px_1fr_120px_140px] gap-3 px-4 py-2.5 bg-stone-50 dark:bg-zinc-800/40 border-b border-stone-200 dark:border-zinc-700 text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
              <div>Sıra</div>
              <div>İkon</div>
              <div>Ünite</div>
              <div className="text-right">Soru</div>
              <div className="text-right">İşlem</div>
            </div>
            {filtreli.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-[64px_56px_1fr_120px_140px] gap-3 px-4 py-3 items-center border-b border-stone-200 dark:border-zinc-800 last:border-b-0 hover:bg-stone-50/60 dark:hover:bg-zinc-800/30 transition"
              >
                <div>
                  <input
                    type="number"
                    defaultValue={u.sira}
                    onBlur={(e) => siraDegistir(u, parseInt(e.target.value, 10) || u.sira)}
                    className="w-12 px-2 py-1 text-sm font-mono bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded text-center focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
                  />
                </div>
                <div>
                  <Thiings name={u.thiings_icon ?? 'square'} size={36} />
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-[15px] tracking-tight text-stone-900 dark:text-zinc-100 truncate">
                    {u.ad}
                  </div>
                  <div className="font-mono text-[11px] text-stone-400 dark:text-zinc-600 mt-0.5">
                    {u.id}
                  </div>
                  {u.aciklama && (
                    <div className="text-[12.5px] text-stone-500 dark:text-zinc-500 line-clamp-1 mt-1 max-w-2xl">
                      {u.aciklama}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-mono text-[14px] font-bold text-stone-700 dark:text-zinc-300 tabular-nums">
                    {u.soruSayisi}
                  </span>
                  {u.soruSayisi === 0 && (
                    <div className="text-[9.5px] tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                      Boş
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => setForm({ acik: true, duzenleniyor: u })}
                    className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded transition"
                    title="Düzenle"
                  >
                    <Icon name="Pencil" size={14} />
                  </button>
                  <button
                    onClick={() => sil(u, u.soruSayisi)}
                    disabled={u.soruSayisi > 0}
                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition text-rose-600 dark:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title={u.soruSayisi > 0 ? `${u.soruSayisi} soru bağlı, silemezsin` : 'Sil'}
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {form.acik && (
          <UniteForm
            duzenleniyor={form.duzenleniyor}
            onKapat={() => setForm({ acik: false, duzenleniyor: null })}
            onKaydet={() => {
              setForm({ acik: false, duzenleniyor: null });
              yukle();
            }}
            mevcutSiralar={uniteler.map((u) => u.sira)}
          />
        )}
      </div>
    </main>
  );
};

interface UniteFormProps {
  duzenleniyor: UnitesRow | null;
  onKapat: () => void;
  onKaydet: () => void;
  mevcutSiralar: number[];
}

const UniteForm = ({ duzenleniyor, onKapat, onKaydet, mevcutSiralar }: UniteFormProps) => {
  const yeni = !duzenleniyor;
  const [id, setId] = useState(duzenleniyor?.id ?? '');
  const [ad, setAd] = useState(duzenleniyor?.ad ?? '');
  const [aciklama, setAciklama] = useState(duzenleniyor?.aciklama ?? '');
  const [thiingsIcon, setThiingsIcon] = useState(duzenleniyor?.thiings_icon ?? 'rocket');
  const [sira, setSira] = useState(
    duzenleniyor?.sira ?? Math.max(0, ...mevcutSiralar) + 1,
  );
  const [kaydediyor, setKaydediyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  const idGecerli = /^[a-z0-9-]+$/.test(id);

  const kaydet = async () => {
    if (!ad.trim()) {
      setHata('Ünite adı zorunlu');
      return;
    }
    if (yeni && !idGecerli) {
      setHata('ID küçük harf, rakam ve tire içerebilir (örn: hazir-degerler)');
      return;
    }
    setKaydediyor(true);
    setHata(null);
    const veri = {
      id: id.trim(),
      ad: ad.trim(),
      aciklama: aciklama.trim() || null,
      thiings_icon: thiingsIcon,
      sira,
    };
    const r = yeni
      ? await supabase.from('unites').insert(veri)
      : await supabase.from('unites').update(veri).eq('id', duzenleniyor!.id);
    setKaydediyor(false);
    if (r.error) {
      setHata(r.error.message);
      return;
    }
    onKaydet();
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-stone-950/55 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      onClick={onKapat}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded-2xl shadow-2xl my-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-zinc-700">
          <div>
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1">
              {yeni ? 'Yeni' : 'Düzenle'}
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              {yeni ? 'Yeni Ünite' : duzenleniyor.ad}
            </h2>
          </div>
          <button
            onClick={onKapat}
            className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Alan
            etiket="ID (slug)"
            yardim={
              yeni
                ? 'URL\'de ve veritabanında kullanılır. Sonradan değiştirilemez. Örnek: hazir-degerler'
                : 'Mevcut ünitenin ID\'si — değiştirilemez.'
            }
          >
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={!yeni}
              placeholder="hazir-degerler"
              className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-lg disabled:opacity-60 focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
            />
          </Alan>

          <Alan etiket="Ünite Adı *">
            <input
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              placeholder="Hazır Değerler (Kasa, Banka, Çekler)"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
            />
          </Alan>

          <Alan etiket="Açıklama" yardim="Üniteler sayfasında satır altında görünür.">
            <textarea
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              rows={3}
              placeholder="100, 101, 102, 103, 108 hesapları — günlük tahsilat ve ödemeler…"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-lg resize-none focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
            />
          </Alan>

          <div className="grid grid-cols-2 gap-3">
            <Alan etiket="Sıra">
              <input
                type="number"
                value={sira}
                onChange={(e) => setSira(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
              />
            </Alan>

            <Alan etiket="İkon">
              <div className="flex items-center gap-2">
                <select
                  value={thiingsIcon}
                  onChange={(e) => setThiingsIcon(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm font-mono bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
                >
                  {IKON_SECENEK.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <Thiings name={thiingsIcon} size={36} />
              </div>
            </Alan>
          </div>

          {hata && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-sm text-rose-800 dark:text-rose-300">
              {hata}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-5 border-t border-stone-200 dark:border-zinc-700">
          <button
            onClick={onKapat}
            className="btn"
            disabled={kaydediyor}
          >
            İptal
          </button>
          <button
            onClick={kaydet}
            disabled={kaydediyor || !ad.trim()}
            className="btn btn-primary"
          >
            {kaydediyor ? 'Kaydediliyor…' : yeni ? 'Ekle' : 'Güncelle'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Alan = ({
  etiket,
  yardim,
  children,
}: {
  etiket: string;
  yardim?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1.5 block">
      {etiket}
    </span>
    {children}
    {yardim && (
      <span className="block text-[11.5px] text-stone-500 dark:text-zinc-500 mt-1.5 leading-snug">
        {yardim}
      </span>
    )}
  </label>
);
