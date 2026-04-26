import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth } from '../contexts/AuthContext';
import { useUniteler } from '../contexts/UnitelerContext';
import { supabase } from '../lib/supabase';
import { authDonusOku, authDonusTemizle } from '../lib/auth-donus';

interface Props {
  onTamamla: (ad: string) => void;
  mevcutAd: string;
}

type Adim = 'hosgeldin' | 'tani' | 'unite';

interface ProfilBilgi {
  universite: string;
  bolum: string;
  sinif: '' | '1' | '2' | '3' | '4' | 'mezun' | 'diger';
  hedef: '' | 'vize-final' | 'kpss' | 'genel' | 'belirsiz';
}

const SINIF_SECENEKLERI: { kod: ProfilBilgi['sinif']; ad: string }[] = [
  { kod: '1', ad: '1. Sınıf' },
  { kod: '2', ad: '2. Sınıf' },
  { kod: '3', ad: '3. Sınıf' },
  { kod: '4', ad: '4. Sınıf' },
  { kod: 'mezun', ad: 'Mezun' },
  { kod: 'diger', ad: 'Diğer' },
];

const HEDEF_SECENEKLERI: { kod: ProfilBilgi['hedef']; ad: string; alt: string }[] = [
  { kod: 'vize-final', ad: 'Vize / Final', alt: 'Üniversite sınavlarına hazırlanıyorum' },
  { kod: 'kpss', ad: 'KPSS', alt: 'Muhasebe alanından kamu sınavı' },
  { kod: 'genel', ad: 'Genel pratik', alt: 'Sürekli pratik yaparak gelişmek' },
  { kod: 'belirsiz', ad: 'Henüz belirsiz', alt: 'Önce keşfetmek istiyorum' },
];

export const OnboardingSayfasi = ({ onTamamla, mevcutAd }: Props) => {
  const nav = useNavigate();
  const { user, yukleniyor } = useAuth();
  const { uniteler } = useUniteler();
  const [adim, setAdim] = useState<Adim>('hosgeldin');
  const [profil, setProfil] = useState<ProfilBilgi>({
    universite: '',
    bolum: '',
    sinif: '',
    hedef: '',
  });
  const [seciliUnite, setSeciliUnite] = useState<string | null>(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  useEffect(() => {
    if (!yukleniyor && !user) nav('/giris', { replace: true });
  }, [user, yukleniyor, nav]);

  const tamamla = async () => {
    if (!user) return;
    setKaydediliyor(true);

    // Profil bilgilerini Supabase'e yaz — boş alanlar atlanır
    const guncelleme: {
      universite?: string;
      bolum?: string;
      sinif?: '1' | '2' | '3' | '4' | 'mezun' | 'diger';
      hedef?: 'vize-final' | 'kpss' | 'genel' | 'belirsiz';
    } = {};
    if (profil.universite.trim()) guncelleme.universite = profil.universite.trim();
    if (profil.bolum.trim()) guncelleme.bolum = profil.bolum.trim();
    if (profil.sinif) guncelleme.sinif = profil.sinif;
    if (profil.hedef) guncelleme.hedef = profil.hedef;

    if (Object.keys(guncelleme).length > 0) {
      const { error } = await supabase
        .from('kullanicilar')
        .update(guncelleme)
        .eq('id', user.id);
      if (error) console.error('Profil kaydedilemedi:', error.message);
    }

    onTamamla(mevcutAd);
    setKaydediliyor(false);

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

  const adimNo = adim === 'hosgeldin' ? 1 : adim === 'tani' ? 2 : 3;

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
            Hoş geldin{mevcutAd && mevcutAd !== 'Öğrenci' ? `, ${mevcutAd}` : ''}!
          </h1>
          <p className="text-lg text-stone-600 dark:text-zinc-400 leading-relaxed font-medium mb-10 max-w-md mx-auto">
            MuhasebeLab&apos;a katıldığın için teşekkürler. 30 saniye seni tanıyalım, sonra ilk
            sorunu çözmeye başlayalım.
          </p>
          <button
            onClick={() => setAdim('tani')}
            className="bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-8 py-3.5 text-sm tracking-wide uppercase font-bold hover:opacity-90 active:scale-[0.98] transition inline-flex items-center gap-3 rounded-xl shadow-lg"
          >
            Başla
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      )}

      {adim === 'tani' && (
        <div>
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-3 font-bold">
              Adım 2 / 3
            </div>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-3">
              Seni biraz tanıyalım
            </h1>
            <p className="text-stone-600 dark:text-zinc-400 font-medium">
              Bu bilgiler sana uygun içeriği ve liderlik tablosunu sunmamızı sağlar.{' '}
              <span className="text-stone-500 dark:text-zinc-500">Hepsi opsiyonel.</span>
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2">
                Üniversite
              </label>
              <input
                type="text"
                value={profil.universite}
                onChange={(e) => setProfil({ ...profil, universite: e.target.value })}
                maxLength={80}
                placeholder="Örn: Boğaziçi, ODTÜ, İTÜ, Anadolu AÖF..."
                className="w-full bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2">
                Bölüm
              </label>
              <input
                type="text"
                value={profil.bolum}
                onChange={(e) => setProfil({ ...profil, bolum: e.target.value })}
                maxLength={80}
                placeholder="Örn: İşletme, İktisat, Maliye..."
                className="w-full bg-stone-50 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none px-3 py-2.5 rounded-lg text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2">
                Sınıf
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SINIF_SECENEKLERI.map((s) => (
                  <button
                    key={s.kod}
                    type="button"
                    onClick={() => setProfil({ ...profil, sinif: s.kod })}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border-2 transition ${
                      profil.sinif === s.kod
                        ? 'border-stone-900 dark:border-zinc-100 bg-stone-50 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100'
                        : 'border-stone-200 dark:border-zinc-700 hover:border-stone-400 dark:hover:border-zinc-600 text-stone-600 dark:text-zinc-400'
                    }`}
                  >
                    {s.ad}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2">
                Hedef
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HEDEF_SECENEKLERI.map((h) => (
                  <button
                    key={h.kod}
                    type="button"
                    onClick={() => setProfil({ ...profil, hedef: h.kod })}
                    className={`px-3 py-2.5 text-left rounded-lg border-2 transition ${
                      profil.hedef === h.kod
                        ? 'border-stone-900 dark:border-zinc-100 bg-stone-50 dark:bg-zinc-800'
                        : 'border-stone-200 dark:border-zinc-700 hover:border-stone-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div
                      className={`text-sm font-bold ${
                        profil.hedef === h.kod
                          ? 'text-stone-900 dark:text-zinc-100'
                          : 'text-stone-700 dark:text-zinc-300'
                      }`}
                    >
                      {h.ad}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-zinc-500 font-medium mt-0.5">
                      {h.alt}
                    </div>
                  </button>
                ))}
              </div>
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
              className="flex-1 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 py-3 text-sm tracking-wide uppercase font-bold hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2 rounded-xl shadow-md"
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
              onClick={() => setAdim('tani')}
              className="px-5 py-3 border border-stone-300 dark:border-zinc-700 text-sm font-bold rounded-xl hover:border-stone-900 dark:hover:border-zinc-400 transition flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={14} />
              Geri
            </button>
            <button
              onClick={tamamla}
              disabled={kaydediliyor}
              className="flex-1 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white py-3 text-sm tracking-wide uppercase font-bold transition flex items-center justify-center gap-2 rounded-xl shadow-md disabled:opacity-60"
            >
              {kaydediliyor && <Icon name="Loader2" size={14} className="animate-spin" />}
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
