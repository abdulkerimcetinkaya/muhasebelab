import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth } from '../contexts/AuthContext';
import { useUniteler } from '../contexts/UnitelerContext';
import { authDonusOku, authDonusTemizle } from '../lib/auth-donus';

interface Props {
  onTamamla: (ad: string, baslangicUniteId: string | null) => void;
  mevcutAd: string;
}

type Adim = 'hosgeldin' | 'ad' | 'unite';

export const OnboardingSayfasi = ({ onTamamla, mevcutAd }: Props) => {
  const nav = useNavigate();
  const { user, yukleniyor } = useAuth();
  const { uniteler } = useUniteler();
  const [adim, setAdim] = useState<Adim>('hosgeldin');
  const [ad, setAd] = useState(mevcutAd === 'Öğrenci' ? '' : mevcutAd);
  const [seciliUnite, setSeciliUnite] = useState<string | null>(null);

  useEffect(() => {
    if (!yukleniyor && !user) nav('/giris', { replace: true });
  }, [user, yukleniyor, nav]);

  const adGecerli = useMemo(() => {
    const t = ad.trim();
    return t.length >= 2 && t.length <= 30 && t.toLowerCase() !== 'öğrenci';
  }, [ad]);

  const tamamla = () => {
    onTamamla(ad.trim(), seciliUnite);
    const donus = authDonusOku();
    if (donus) {
      authDonusTemizle();
      nav(donus, { replace: true });
      return;
    }
    if (seciliUnite) {
      const u = uniteler.find((x) => x.id === seciliUnite);
      if (u && u.sorular.length > 0) {
        nav(`/problemler/${u.sorular[0].id}`, { replace: true });
        return;
      }
    }
    nav('/', { replace: true });
  };

  const adimNo = adim === 'hosgeldin' ? 1 : adim === 'ad' ? 2 : 3;

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all ${
              i <= adimNo
                ? 'w-12 bg-stone-900 dark:bg-zinc-100'
                : 'w-8 bg-stone-200 dark:bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {adim === 'hosgeldin' && (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Thiings name="rocket" size={120} animate="float" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight font-bold mb-4">
            Hoş geldin!
          </h1>
          <p className="text-lg text-stone-600 dark:text-zinc-400 leading-relaxed font-medium mb-10 max-w-md mx-auto">
            MuhasebeLab&apos;a katıldığın için teşekkürler. 30 saniye seni tanıyalım, sonra ilk
            sorunu çözmeye başlayalım.
          </p>
          <button
            onClick={() => setAdim('ad')}
            className="bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-8 py-3.5 text-sm tracking-wide uppercase font-bold hover:opacity-90 active:scale-[0.98] transition inline-flex items-center gap-3 rounded-xl shadow-lg"
          >
            Başla
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      )}

      {adim === 'ad' && (
        <div>
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-3 font-bold">
              Adım 2 / 3
            </div>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-3">
              Sana nasıl hitap edelim?
            </h1>
            <p className="text-stone-600 dark:text-zinc-400 font-medium">
              Profilde, rozetlerde ve liderlik tablosunda görünecek isim.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-8">
            <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-3">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              maxLength={30}
              autoFocus
              placeholder="Örn: Ahmet, Zeynep, MuhasebeKurdu..."
              className="w-full font-display text-2xl font-bold bg-stone-50 dark:bg-zinc-900 border-2 border-stone-200 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-4 py-3 rounded-xl transition"
            />
            <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium mt-2">
              2-30 karakter. İstediğin zaman profilden değiştirebilirsin.
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setAdim('hosgeldin')}
              className="px-5 py-3 border border-stone-300 dark:border-zinc-700 text-sm font-bold rounded-xl hover:border-stone-900 dark:hover:border-zinc-400 transition flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={14} />
              Geri
            </button>
            <button
              onClick={() => setAdim('unite')}
              disabled={!adGecerli}
              className="flex-1 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 py-3 text-sm tracking-wide uppercase font-bold hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2 rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Devam
              <Icon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>
      )}

      {adim === 'unite' && (
        <div>
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-3 font-bold">
              Adım 3 / 3
            </div>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-3">
              Hangi konuyla başlayalım?
            </h1>
            <p className="text-stone-600 dark:text-zinc-400 font-medium">
              Sıfırdan başlıyorsan kasa işlemleri en kolay başlangıç.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {uniteler.map((u) => {
              const secili = seciliUnite === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setSeciliUnite(u.id)}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl text-left transition ${
                    secili
                      ? 'border-stone-900 dark:border-zinc-100 bg-stone-50 dark:bg-zinc-800'
                      : 'border-stone-200 dark:border-zinc-700 hover:border-stone-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <Thiings name={u.thiingsIcon} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-bold text-sm tracking-tight truncate">
                      {u.ad}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-zinc-500 font-medium">
                      {u.sorular.length} soru
                    </div>
                  </div>
                  {secili && (
                    <Icon
                      name="CheckCircle2"
                      size={18}
                      className="text-stone-900 dark:text-zinc-100 flex-shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAdim('ad')}
              className="px-5 py-3 border border-stone-300 dark:border-zinc-700 text-sm font-bold rounded-xl hover:border-stone-900 dark:hover:border-zinc-400 transition flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={14} />
              Geri
            </button>
            <button
              onClick={tamamla}
              className="flex-1 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white py-3 text-sm tracking-wide uppercase font-bold transition flex items-center justify-center gap-2 rounded-xl shadow-md"
            >
              <Icon name="Zap" size={14} />
              {seciliUnite ? 'Hadi Başlayalım' : 'Atla, Sonra Seçerim'}
              <Icon name="ArrowRight" size={14} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
