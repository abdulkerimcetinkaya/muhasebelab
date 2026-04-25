import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { AdminYanMenu } from '../../components/AdminYanMenu';
import { EmptyState } from '../../components/EmptyState';
import { SkeletonSatirlar } from '../../components/Skeleton';
import { supabase } from '../../lib/supabase';
import type { SoruDurum, SorularRow, UnitesRow, Zorluk } from '../../lib/database.types';

type DurumFiltre = 'hepsi' | SoruDurum;
type ZorlukFiltre = 'hepsi' | Zorluk;

const DURUM_RENK: Record<SoruDurum, string> = {
  taslak: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
  inceleme: 'bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-300',
  onayli: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
  arsiv: 'bg-stone-200 text-stone-700 dark:bg-zinc-800 dark:text-zinc-400',
};

const ZORLUK_RENK: Record<Zorluk, string> = {
  kolay: 'text-emerald-600 dark:text-emerald-400',
  orta: 'text-amber-600 dark:text-amber-400',
  zor: 'text-rose-600 dark:text-rose-400',
};

export const AdminSorularSayfasi = () => {
  const [sorular, setSorular] = useState<SorularRow[]>([]);
  const [uniteler, setUniteler] = useState<UnitesRow[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [arama, setArama] = useState('');
  const [durumFiltre, setDurumFiltre] = useState<DurumFiltre>('hepsi');
  const [zorlukFiltre, setZorlukFiltre] = useState<ZorlukFiltre>('hepsi');
  const [uniteFiltre, setUniteFiltre] = useState<string>('hepsi');

  const yukle = async () => {
    setYukleniyor(true);
    const [soruR, uniteR] = await Promise.all([
      supabase.from('sorular').select('*').order('created_at', { ascending: false }),
      supabase.from('unites').select('*').order('sira'),
    ]);
    if (soruR.error) {
      setHata(soruR.error.message);
    } else {
      setSorular(soruR.data ?? []);
    }
    if (uniteR.data) setUniteler(uniteR.data);
    setYukleniyor(false);
  };

  useEffect(() => {
    yukle().catch((e) => {
      console.error('Sorular yüklenemedi', e);
      setHata(String(e));
      setYukleniyor(false);
    });
  }, []);

  const uniteAdMap = useMemo(() => {
    const m: Record<string, string> = {};
    uniteler.forEach((u) => {
      m[u.id] = u.ad;
    });
    return m;
  }, [uniteler]);

  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase();
    return sorular.filter((s) => {
      if (durumFiltre !== 'hepsi' && s.durum !== durumFiltre) return false;
      if (zorlukFiltre !== 'hepsi' && s.zorluk !== zorlukFiltre) return false;
      if (uniteFiltre !== 'hepsi' && s.unite_id !== uniteFiltre) return false;
      if (q && !s.baslik.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sorular, arama, durumFiltre, zorlukFiltre, uniteFiltre]);

  const sil = async (id: string, baslik: string) => {
    if (!confirm(`"${baslik}" silinecek. Çözümleri ve kullanıcı ilerlemesi de silinir. Emin misin?`)) {
      return;
    }
    const { error } = await supabase.from('sorular').delete().eq('id', id);
    if (error) {
      alert('Silinemedi: ' + error.message);
      return;
    }
    setSorular((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <AdminYanMenu />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Sorular</h1>
            <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium mt-1">
              {filtreli.length} / {sorular.length} soru görüntüleniyor
            </p>
          </div>
          <Link
            to="/admin/sorular/yeni"
            className="flex items-center gap-2 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition"
          >
            <Icon name="Plus" size={14} />
            Yeni Soru
          </Link>
        </div>

        {/* Filtreler */}
        <div className="bg-white dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Icon
              name="Search"
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="Başlık veya ID ile ara…"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium"
            />
          </div>

          <select
            value={durumFiltre}
            onChange={(e) => setDurumFiltre(e.target.value as DurumFiltre)}
            className="px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 outline-none text-sm rounded-lg font-medium"
          >
            <option value="hepsi">Tüm durumlar</option>
            <option value="taslak">Taslak</option>
            <option value="inceleme">İnceleme</option>
            <option value="onayli">Onaylı</option>
            <option value="arsiv">Arşiv</option>
          </select>

          <select
            value={zorlukFiltre}
            onChange={(e) => setZorlukFiltre(e.target.value as ZorlukFiltre)}
            className="px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 outline-none text-sm rounded-lg font-medium"
          >
            <option value="hepsi">Tüm zorluklar</option>
            <option value="kolay">Kolay</option>
            <option value="orta">Orta</option>
            <option value="zor">Zor</option>
          </select>

          <select
            value={uniteFiltre}
            onChange={(e) => setUniteFiltre(e.target.value)}
            className="px-3 py-2 bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 outline-none text-sm rounded-lg font-medium"
          >
            <option value="hepsi">Tüm üniteler</option>
            {uniteler.map((u) => (
              <option key={u.id} value={u.id}>
                {u.ad}
              </option>
            ))}
          </select>
        </div>

        {/* Hata / Yükleniyor */}
        {hata && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-sm text-rose-800 dark:text-rose-300 font-medium mb-4">
            <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        {yukleniyor ? (
          <SkeletonSatirlar satirSayisi={6} />
        ) : filtreli.length === 0 ? (
          <EmptyState
            ikon="Search"
            baslik="Filtreyle eşleşen soru yok"
            aciklama="Aramayı temizleyebilir veya farklı bir filtre uygulayabilirsin."
          />
        ) : (
          <div className="bg-white dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 dark:bg-zinc-900/50 border-b border-stone-200 dark:border-zinc-700">
                <tr className="text-left text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                  <th className="px-4 py-3">Başlık</th>
                  <th className="px-4 py-3">Ünite</th>
                  <th className="px-4 py-3">Zorluk</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtreli.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-stone-100 dark:border-zinc-800 last:border-0 hover:bg-stone-50 dark:hover:bg-zinc-800/30 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-stone-900 dark:text-zinc-100">
                        {s.baslik}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-zinc-500 font-mono mt-0.5">
                        {s.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600 dark:text-zinc-400 font-medium">
                      {uniteAdMap[s.unite_id] ?? s.unite_id}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold uppercase ${ZORLUK_RENK[s.zorluk]}`}>
                        {s.zorluk}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] tracking-wider uppercase font-bold px-2 py-1 rounded ${DURUM_RENK[s.durum]}`}
                      >
                        {s.durum}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/sorular/${s.id}`}
                          className="p-1.5 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded transition"
                          title="Düzenle"
                        >
                          <Icon name="Edit3" size={14} />
                        </Link>
                        <button
                          onClick={() => sil(s.id, s.baslik)}
                          className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded transition"
                          title="Sil"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};
