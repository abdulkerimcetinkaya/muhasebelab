import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import { AdminYanMenu } from '../../components/AdminYanMenu';
import {
  adminCikar,
  adminEkle,
  tumAdminleriYukle,
  tumKullanicilariYukle,
  type Admin,
  type KullaniciOzet,
} from '../../lib/admin-kullanicilar';
import { useAuth } from '../../contexts/AuthContext';

const tarihFormat = (s: string): string =>
  new Date(s).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export const AdminYetkilileriSayfasi = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  const [ekleModalAcik, setEkleModalAcik] = useState(false);
  const [aramaQ, setAramaQ] = useState('');
  const [kullaniciList, setKullaniciList] = useState<KullaniciOzet[]>([]);
  const [kullaniciYukleniyor, setKullaniciYukleniyor] = useState(false);

  const yukle = async () => {
    setYukleniyor(true);
    setHata(null);
    try {
      const data = await tumAdminleriYukle();
      setAdmins(data);
    } catch (e) {
      setHata(`Yüklenemedi: ${(e as Error).message}`);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    yukle();
  }, []);

  useEffect(() => {
    if (ekleModalAcik && kullaniciList.length === 0 && !kullaniciYukleniyor) {
      setKullaniciYukleniyor(true);
      tumKullanicilariYukle()
        .then(setKullaniciList)
        .catch(() => setKullaniciList([]))
        .finally(() => setKullaniciYukleniyor(false));
    }
  }, [ekleModalAcik, kullaniciList.length, kullaniciYukleniyor]);

  const adminUserIdSet = useMemo(
    () => new Set(admins.map((a) => a.user_id)),
    [admins],
  );

  const filtreliKullanici = useMemo(() => {
    let list = kullaniciList.filter((k) => !adminUserIdSet.has(k.id));
    if (aramaQ.trim()) {
      const q = aramaQ.toLowerCase();
      list = list.filter(
        (k) =>
          k.kullanici_adi.toLowerCase().includes(q) ||
          (k.email ?? '').toLowerCase().includes(q),
      );
    }
    return list.slice(0, 30);
  }, [kullaniciList, adminUserIdSet, aramaQ]);

  const yetkiVer = async (k: KullaniciOzet) => {
    try {
      await adminEkle(k.id);
      await yukle();
      setEkleModalAcik(false);
      setAramaQ('');
    } catch (e) {
      alert(`Eklenemedi: ${(e as Error).message}`);
    }
  };

  const yetkiKaldir = async (admin: Admin) => {
    const kendiMi = admin.user_id === user?.id;
    const onayMetni = kendiMi
      ? 'Kendi admin yetkini kaldırmak üzeresin. Bunu yaparsan bu sayfaya bir daha giremezsin (başka bir admin eklemediysen).\n\nDevam edilsin mi?'
      : `${admin.email} kullanıcısının admin yetkisi kaldırılsın mı?`;
    if (!confirm(onayMetni)) return;
    try {
      await adminCikar(admin.user_id);
      await yukle();
    } catch (e) {
      alert(`Kaldırılamadı: ${(e as Error).message}`);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-8">
      <div className="flex gap-8">
        <AdminYanMenu />
        <main className="flex-1 min-w-0 space-y-6">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                Admin Yetkilileri
              </h1>
              <p className="text-[13.5px] text-stone-600 dark:text-zinc-400 mt-1">
                Toplam <strong>{admins.length}</strong> admin · admin tüm içerik ve kullanıcı yönetimi yetkisine sahip
              </p>
            </div>
            <button
              onClick={() => setEkleModalAcik(true)}
              className="inline-flex items-center gap-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition"
            >
              <Icon name="UserPlus" size={12} />
              Admin Ekle
            </button>
          </div>

          {hata && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-[13px] text-rose-800 dark:text-rose-300 font-medium">
              <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
              <span>{hata}</span>
            </div>
          )}

          {yukleniyor ? (
            <div className="text-sm text-stone-400 dark:text-zinc-600">Yükleniyor…</div>
          ) : (
            <div className="overflow-x-auto border border-stone-200 dark:border-zinc-700 rounded-xl">
              <table className="w-full text-[13px]">
                <thead className="bg-stone-50 dark:bg-zinc-800/50 text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                  <tr>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Eklenen Tarih</th>
                    <th className="text-center p-3">Sen?</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => {
                    const benMi = a.user_id === user?.id;
                    const sonAdmin = admins.length === 1;
                    return (
                      <tr
                        key={a.user_id}
                        className="border-t border-stone-200 dark:border-zinc-700"
                      >
                        <td className="p-3 font-mono">{a.email}</td>
                        <td className="p-3 text-stone-600 dark:text-zinc-400">
                          {tarihFormat(a.eklenen_at)}
                        </td>
                        <td className="p-3 text-center">
                          {benMi && (
                            <span className="inline-flex items-center text-[10px] tracking-wider uppercase font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded">
                              sen
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => yetkiKaldir(a)}
                            disabled={sonAdmin}
                            title={
                              sonAdmin
                                ? 'Son admin çıkarılamaz'
                                : benMi
                                  ? 'Kendi yetkini kaldır'
                                  : 'Yetkiyi kaldır'
                            }
                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Icon name="X" size={14} />
                          </button>
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

      {ekleModalAcik && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
          onClick={() => setEkleModalAcik(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight">
                  Admin Ekle
                </h2>
                <p className="text-[12px] text-stone-500 dark:text-zinc-500 mt-0.5">
                  Aramadan kullanıcı seç → admin yetkisi verilir
                </p>
              </div>
              <button
                onClick={() => setEkleModalAcik(false)}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            <input
              type="text"
              value={aramaQ}
              onChange={(e) => setAramaQ(e.target.value)}
              autoFocus
              placeholder="Kullanıcı adı veya email"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
            />

            <div className="border border-stone-200 dark:border-zinc-700 rounded-lg max-h-72 overflow-auto">
              {kullaniciYukleniyor ? (
                <div className="text-[13px] text-stone-400 dark:text-zinc-600 p-3">
                  Yükleniyor…
                </div>
              ) : filtreliKullanici.length === 0 ? (
                <div className="text-[13px] text-stone-400 dark:text-zinc-600 p-3">
                  Eşleşen kullanıcı yok.
                </div>
              ) : (
                filtreliKullanici.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => yetkiVer(k)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-stone-50 dark:hover:bg-zinc-800/50 border-b last:border-b-0 border-stone-100 dark:border-zinc-800"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[13px]">{k.kullanici_adi}</div>
                      <div className="text-[11px] font-mono text-stone-500 dark:text-zinc-500 truncate">
                        {k.email ?? '—'}
                      </div>
                    </div>
                    <Icon name="UserPlus" size={14} className="flex-shrink-0 text-stone-400" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
