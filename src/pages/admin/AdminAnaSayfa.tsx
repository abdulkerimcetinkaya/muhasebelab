import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { AdminYanMenu } from '../../components/AdminYanMenu';
import { supabase } from '../../lib/supabase';

interface Sayilar {
  toplam: number;
  taslak: number;
  inceleme: number;
  onayli: number;
  arsiv: number;
  kullanici: number;
  hata: number;
}

const baslangic: Sayilar = {
  toplam: 0,
  taslak: 0,
  inceleme: 0,
  onayli: 0,
  arsiv: 0,
  kullanici: 0,
  hata: 0,
};

export const AdminAnaSayfa = () => {
  const [sayilar, setSayilar] = useState<Sayilar>(baslangic);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const yukle = async () => {
      const [toplamR, taslakR, incelemeR, onayliR, arsivR, kullaniciR, hataR] = await Promise.all([
        supabase.from('sorular').select('id', { count: 'exact', head: true }),
        supabase.from('sorular').select('id', { count: 'exact', head: true }).eq('durum', 'taslak'),
        supabase.from('sorular').select('id', { count: 'exact', head: true }).eq('durum', 'inceleme'),
        supabase.from('sorular').select('id', { count: 'exact', head: true }).eq('durum', 'onayli'),
        supabase.from('sorular').select('id', { count: 'exact', head: true }).eq('durum', 'arsiv'),
        supabase.from('kullanicilar').select('id', { count: 'exact', head: true }),
        supabase.from('soru_hatalari').select('id', { count: 'exact', head: true }).eq('durum', 'acik'),
      ]);
      setSayilar({
        toplam: toplamR.count ?? 0,
        taslak: taslakR.count ?? 0,
        inceleme: incelemeR.count ?? 0,
        onayli: onayliR.count ?? 0,
        arsiv: arsivR.count ?? 0,
        kullanici: kullaniciR.count ?? 0,
        hata: hataR.count ?? 0,
      });
      setYukleniyor(false);
    };
    yukle().catch((e) => {
      console.error('Admin istatistik', e);
      setYukleniyor(false);
    });
  }, []);

  const kart = (etiket: string, sayi: number, icon: string, renk: string) => (
    <div className="bg-white dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
          {etiket}
        </div>
        <Icon name={icon} size={16} className={renk} />
      </div>
      <div className="font-display text-3xl font-bold tracking-tight">
        {yukleniyor ? '—' : sayi}
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <AdminYanMenu />
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-1">Admin Paneli</h1>
        <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium mb-8">
          Soruları yönet, yeni içerik ekle, hata bildirimlerini incele.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kart('Toplam Soru', sayilar.toplam, 'FileText', 'text-stone-500')}
          {kart('Onaylı', sayilar.onayli, 'CheckCircle2', 'text-emerald-600')}
          {kart('Taslak', sayilar.taslak, 'Edit3', 'text-amber-600')}
          {kart('İnceleme', sayilar.inceleme, 'Eye', 'text-sky-600')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kart('Kullanıcı', sayilar.kullanici, 'Users', 'text-violet-600')}
          <Link
            to="/admin/hatalar"
            className="block bg-white dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-700 rounded-xl p-5 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                Açık Hata Bildirimi
              </div>
              <Icon name="AlertCircle" size={16} className="text-rose-600" />
            </div>
            <div className="font-display text-3xl font-bold tracking-tight">
              {yukleniyor ? '—' : sayilar.hata}
            </div>
          </Link>
          {kart('Arşiv', sayilar.arsiv, 'Archive', 'text-stone-400')}
        </div>
      </div>
    </main>
  );
};
