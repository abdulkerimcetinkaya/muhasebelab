import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth } from '../contexts/AuthContext';

// İyzico callback Edge Function bizi bu sayfaya yönlendirir.
// Query: ?durum=basarili | hata | iptal & detay=...
type SyncDurum = 'yukleniyor' | 'tamam' | 'hata';

export const PremiumSonucSayfasi = () => {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { premiumYenile } = useAuth();
  const durum = (params.get('durum') ?? 'hata') as 'basarili' | 'hata' | 'iptal';
  const detay = params.get('detay');
  const [syncDurum, setSyncDurum] = useState<SyncDurum>('yukleniyor');

  useEffect(() => {
    if (durum !== 'basarili') {
      setSyncDurum('tamam');
      return;
    }
    let aktif = true;
    setSyncDurum('yukleniyor');
    premiumYenile()
      .then(() => {
        if (aktif) setSyncDurum('tamam');
      })
      .catch(() => {
        if (aktif) setSyncDurum('hata');
      });
    return () => {
      aktif = false;
    };
  }, [durum, premiumYenile]);

  const yenidenDene = () => {
    setSyncDurum('yukleniyor');
    premiumYenile()
      .then(() => setSyncDurum('tamam'))
      .catch(() => setSyncDurum('hata'));
  };

  if (durum === 'basarili') {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/40 dark:to-amber-900/40 mb-6">
          <Thiings name="trophy" size={48} />
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-amber-700 dark:text-amber-400 font-bold mb-3">
          Ödeme Başarılı
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight font-bold mb-4">
          Premium üyeliğin aktif!
        </h1>
        <p className="text-lg text-stone-600 dark:text-zinc-400 leading-relaxed font-medium mb-6">
          Tüm Premium özellikler artık açık. AI yanlış analizi, sınırsız asistan, hesap kodu
          otomatik tamamlama hemen kullanıma hazır.
        </p>

        {syncDurum === 'yukleniyor' && (
          <div className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-500 font-medium mb-6">
            <Icon name="Loader2" size={14} className="animate-spin" />
            Üyelik bilgileri senkronlanıyor…
          </div>
        )}

        {syncDurum === 'hata' && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-left">
            <div className="flex items-start gap-3">
              <Icon
                name="AlertCircle"
                size={18}
                className="text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
                  Üyelik bilgilerin senkronlanamadı
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-200/80 font-medium leading-relaxed mb-3">
                  Ödemen başarılı, fakat tarayıcına aktarılamadı. Premium özellikleri kullanmak
                  için yenile.
                </div>
                <button
                  onClick={yenidenDene}
                  className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-bold text-amber-900 dark:text-amber-100 bg-amber-200/80 dark:bg-amber-900/40 hover:bg-amber-300 dark:hover:bg-amber-900/60 px-3 py-1.5 rounded-lg transition"
                >
                  <Icon name="RefreshCw" size={12} />
                  Yeniden Dene
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => nav('/problemler')}
            className="inline-flex items-center gap-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition"
          >
            <Icon name="ListChecks" size={14} />
            Soru Çöz
          </button>
          <Link
            to="/profil"
            className="inline-flex items-center gap-2 border border-stone-300 dark:border-zinc-700 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 transition"
          >
            <Icon name="User" size={14} />
            Profilim
          </Link>
        </div>
      </main>
    );
  }

  const baslik = durum === 'iptal' ? 'Ödeme iptal edildi' : 'Ödeme tamamlanamadı';
  const mesaj =
    durum === 'iptal'
      ? 'Ödeme akışını iptal ettin. Hazır olduğunda yeniden deneyebilirsin.'
      : 'Bir aksilik oldu. Kart bilgilerini kontrol edip tekrar dene; ücret kesildiyse otomatik olarak iade edilecek.';

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-stone-100 dark:bg-zinc-800 mb-6">
        <Icon name="AlertTriangle" size={36} className="text-stone-600 dark:text-zinc-400" />
      </div>
      <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-3">
        Ödeme {durum === 'iptal' ? 'İptal' : 'Hata'}
      </div>
      <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-4">{baslik}</h1>
      <p className="text-base text-stone-600 dark:text-zinc-400 leading-relaxed font-medium mb-2">
        {mesaj}
      </p>
      {detay && (
        <p className="text-xs text-stone-500 dark:text-zinc-500 font-mono mb-6 bg-stone-100 dark:bg-zinc-800 inline-block px-3 py-1.5 rounded-lg">
          {detay}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          onClick={() => nav('/premium')}
          className="inline-flex items-center gap-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition"
        >
          <Icon name="RefreshCw" size={14} />
          Yeniden Dene
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-stone-300 dark:border-zinc-700 px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 transition"
        >
          <Icon name="Home" size={14} />
          Ana Sayfa
        </Link>
      </div>
    </main>
  );
};
