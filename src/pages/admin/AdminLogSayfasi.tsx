import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import { AdminYanMenu } from '../../components/AdminYanMenu';
import {
  adminLogYukle,
  ISLEM_ETIKETLERI,
  type AdminLogKaydi,
} from '../../lib/admin-log';

const tarihFormat = (s: string): string =>
  new Date(s).toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const islemRengi = (islem: string): string => {
  if (islem.startsWith('admin_')) return 'amber';
  if (islem.includes('sil') || islem.includes('ban')) return 'rose';
  if (islem.includes('katkici')) return 'blue';
  return 'emerald';
};

const renkClass = (renk: string) => {
  switch (renk) {
    case 'amber':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
    case 'rose':
      return 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300';
    case 'blue':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    default:
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300';
  }
};

export const AdminLogSayfasi = () => {
  const [list, setList] = useState<AdminLogKaydi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [filtreIslem, setFiltreIslem] = useState<string>('');
  const [filtreAdmin, setFiltreAdmin] = useState<string>('');

  const yukle = async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      const data = await adminLogYukle(500);
      setList(data);
    } catch (e) {
      setHata((e as Error).message);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    yukle();
  }, []);

  const islemler = useMemo(
    () => Array.from(new Set(list.map((l) => l.islem))).sort(),
    [list],
  );

  const adminler = useMemo(
    () => Array.from(new Set(list.map((l) => l.admin_email))).sort(),
    [list],
  );

  const filtreli = useMemo(() => {
    return list.filter((l) => {
      if (filtreIslem && l.islem !== filtreIslem) return false;
      if (filtreAdmin && l.admin_email !== filtreAdmin) return false;
      return true;
    });
  }, [list, filtreIslem, filtreAdmin]);

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-8">
      <div className="flex gap-8">
        <AdminYanMenu />
        <main className="flex-1 min-w-0 space-y-6">
          <div className="flex items-baseline justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                Admin Log
              </h1>
              <p className="text-[13.5px] text-stone-600 dark:text-zinc-400 mt-1">
                Hangi admin ne zaman ne yaptı? Son <strong>{filtreli.length}</strong> işlem
                {(filtreIslem || filtreAdmin) && ' (filtreli)'}.
              </p>
            </div>
            <button
              onClick={yukle}
              disabled={yukleniyor}
              className="inline-flex items-center gap-2 border border-stone-300 dark:border-zinc-700 px-3 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:bg-stone-50 dark:hover:bg-zinc-800 transition disabled:opacity-50"
            >
              <Icon name="RefreshCw" size={12} className={yukleniyor ? 'animate-spin' : ''} />
              Yenile
            </button>
          </div>

          {/* Filtreler */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={filtreIslem}
              onChange={(e) => setFiltreIslem(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-[12px] outline-none focus:border-stone-900 dark:focus:border-zinc-300"
            >
              <option value="">Tüm işlemler</option>
              {islemler.map((i) => (
                <option key={i} value={i}>
                  {ISLEM_ETIKETLERI[i] ?? i}
                </option>
              ))}
            </select>
            <select
              value={filtreAdmin}
              onChange={(e) => setFiltreAdmin(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-[12px] outline-none focus:border-stone-900 dark:focus:border-zinc-300"
            >
              <option value="">Tüm admin'ler</option>
              {adminler.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            {(filtreIslem || filtreAdmin) && (
              <button
                onClick={() => {
                  setFiltreIslem('');
                  setFiltreAdmin('');
                }}
                className="text-[12px] text-stone-500 dark:text-zinc-500 hover:underline"
              >
                Filtreleri temizle
              </button>
            )}
          </div>

          {hata && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-[13px] text-rose-800 dark:text-rose-300">
              {hata}
            </div>
          )}

          {yukleniyor ? (
            <div className="text-stone-500 dark:text-zinc-500 text-sm">Yükleniyor…</div>
          ) : filtreli.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 dark:border-zinc-700 p-10 text-center text-stone-500 dark:text-zinc-500 text-sm">
              Kayıt yok.
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-stone-50 dark:bg-zinc-900 text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold">Tarih</th>
                    <th className="text-left px-4 py-3 font-bold">Admin</th>
                    <th className="text-left px-4 py-3 font-bold">İşlem</th>
                    <th className="text-left px-4 py-3 font-bold">Hedef</th>
                    <th className="text-left px-4 py-3 font-bold">Detay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-zinc-800">
                  {filtreli.map((l) => {
                    const renk = islemRengi(l.islem);
                    return (
                      <tr
                        key={l.id}
                        className="hover:bg-stone-50 dark:hover:bg-zinc-900/40"
                      >
                        <td className="px-4 py-3 font-mono text-[12px] text-stone-600 dark:text-zinc-400 whitespace-nowrap">
                          {tarihFormat(l.yapilan_at)}
                        </td>
                        <td className="px-4 py-3 font-mono text-[12px]">
                          {l.admin_email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block text-[10px] tracking-[0.15em] uppercase font-bold px-2 py-0.5 rounded ${renkClass(renk)}`}
                          >
                            {ISLEM_ETIKETLERI[l.islem] ?? l.islem}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[12px] text-stone-600 dark:text-zinc-400">
                          {l.hedef_email ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-[11.5px] text-stone-500 dark:text-zinc-500 max-w-[300px] truncate font-mono">
                          {l.detay ? JSON.stringify(l.detay) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
