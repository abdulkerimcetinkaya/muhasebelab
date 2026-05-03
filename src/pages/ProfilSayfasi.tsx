import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { GenelView } from '../components/profil/GenelView';
import { HesapView } from '../components/profil/HesapView';
import { RozetlerView } from '../components/profil/RozetlerView';
import { UyelikView } from '../components/profil/UyelikView';
import { YetkinlikView } from '../components/profil/YetkinlikView';
import { HEDEF_LABEL, PROFIL_BOS, SINIF_LABEL } from '../components/profil/types';
import type { Bolum, Hedef, ProfilBilgi, Sinif } from '../components/profil/types';
import { useAuth, useIsPremium } from '../contexts/AuthContext';
import { useUniteler } from '../contexts/UnitelerContext';
import { ROZETLER } from '../data/rozetler';
import { supabase } from '../lib/supabase';
import type { Ilerleme, Istatistik } from '../types';

interface Props {
  ilerleme: Ilerleme;
  stat: Istatistik;
  onKullaniciAdiGuncelle: (ad: string) => void;
  onSifirla: () => void;
  onTemaDegistir: () => void;
}

interface BolumMeta {
  id: Bolum;
  ad: string;
  ikon: string;
}

const BOLUMLER: BolumMeta[] = [
  { id: 'genel', ad: 'Genel', ikon: 'User' },
  { id: 'yetkinlik', ad: 'Yetkinlik', ikon: 'BarChart3' },
  { id: 'rozetler', ad: 'Rozetler', ikon: 'Award' },
  { id: 'uyelik', ad: 'Üyelik', ikon: 'Sparkles' },
  { id: 'hesap', ad: 'Hesap', ikon: 'Settings' },
];

export const ProfilSayfasi = ({
  ilerleme,
  stat,
  onKullaniciAdiGuncelle,
  onSifirla,
  onTemaDegistir,
}: Props) => {
  const { uniteler } = useUniteler();
  const { user, premiumBitis } = useAuth();
  const isPremium = useIsPremium();

  const [bolum, setBolum] = useState<Bolum>('genel');
  const [profil, setProfil] = useState<ProfilBilgi>(PROFIL_BOS);
  const [profilYukleniyor, setProfilYukleniyor] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfil(PROFIL_BOS);
      return;
    }
    let aktif = true;
    setProfilYukleniyor(true);
    supabase
      .from('kullanicilar')
      .select('universite, bolum, sinif, hedef, dogum_yili, bulten_izni')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!aktif) return;
        setProfilYukleniyor(false);
        if (data) {
          setProfil({
            universite: (data as { universite: string | null }).universite ?? '',
            bolum: (data as { bolum: string | null }).bolum ?? '',
            sinif: ((data as { sinif: Sinif | null }).sinif ?? '') as Sinif,
            hedef: ((data as { hedef: Hedef | null }).hedef ?? '') as Hedef,
            dogumYili: (data as { dogum_yili: number | null }).dogum_yili?.toString() ?? '',
            bultenIzni: (data as { bulten_izni: boolean | null }).bulten_izni ?? false,
          });
        }
      });
    return () => {
      aktif = false;
    };
  }, [user]);

  const kazanilanRozetSayi = Object.keys(ilerleme.kazanilanRozetler).length;

  const sayilar: Partial<Record<Bolum, string>> = useMemo(
    () => ({
      yetkinlik: `${uniteler.length}`,
      rozetler: `${kazanilanRozetSayi}/${ROZETLER.length}`,
      uyelik: isPremium ? 'Premium' : 'Free',
    }),
    [uniteler.length, kazanilanRozetSayi, isPremium],
  );

  const avatarHarfi = (ilerleme.kullaniciAdi || '?')[0].toUpperCase();
  const avatarRenk = useMemo(() => {
    const renkler = [
      'bg-blue-700',
      'bg-emerald-700',
      'bg-rose-700',
      'bg-amber-700',
      'bg-violet-700',
      'bg-teal-700',
    ];
    let hash = 0;
    const ad = ilerleme.kullaniciAdi || 'X';
    for (let i = 0; i < ad.length; i++) hash += ad.charCodeAt(i);
    return renkler[hash % renkler.length];
  }, [ilerleme.kullaniciAdi]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-10">
        {/* Sol kolon: Avatar header (üstte) + nav (altta), birlikte sticky */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-stone-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-800/40 overflow-hidden">
            {/* Compact avatar header */}
            <div className="p-4 border-b border-stone-200 dark:border-zinc-700">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 ${avatarRenk} text-white font-display text-2xl font-bold flex items-center justify-center shadow-md flex-shrink-0 rounded-xl`}
                >
                  {avatarHarfi}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[16px] font-bold tracking-tight truncate leading-tight">
                    {ilerleme.kullaniciAdi}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-zinc-500 font-semibold mt-0.5 tabular-nums">
                    {stat.cozulenSayi} soru · {ilerleme.puan}p
                  </div>
                </div>
              </div>

              {/* Akademik etiketler */}
              {(profil.universite || profil.bolum || profil.sinif || profil.hedef) && (
                <div className="flex flex-wrap gap-1">
                  {profil.universite && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-[10.5px] font-bold text-stone-700 dark:text-zinc-300 max-w-full">
                      <Icon name="Landmark" size={10} className="flex-shrink-0" />
                      <span className="truncate">{profil.universite}</span>
                    </span>
                  )}
                  {profil.bolum && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-[10.5px] font-bold text-stone-700 dark:text-zinc-300 max-w-full">
                      <Icon name="BookOpen" size={10} className="flex-shrink-0" />
                      <span className="truncate">{profil.bolum}</span>
                    </span>
                  )}
                  {profil.sinif && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-[10.5px] font-bold text-stone-700 dark:text-zinc-300">
                      {SINIF_LABEL[profil.sinif]}
                    </span>
                  )}
                  {profil.hedef && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[10.5px] font-bold text-blue-900 dark:text-blue-200">
                      <Icon name="Milestone" size={10} className="flex-shrink-0" />
                      {HEDEF_LABEL[profil.hedef]}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Nav */}
            <ul
              className="flex lg:flex-col gap-0.5 p-2 overflow-x-auto lg:overflow-visible"
              aria-label="Profil bölümleri"
            >
              {BOLUMLER.map((b) => {
                const aktif = bolum === b.id;
                const sayi = sayilar[b.id];
                return (
                  <li key={b.id} className="flex-shrink-0 lg:flex-shrink lg:w-full">
                    <button
                      onClick={() => setBolum(b.id)}
                      aria-current={aktif ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition active:scale-[0.99] whitespace-nowrap ${
                        aktif
                          ? 'bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                          : 'hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300'
                      }`}
                    >
                      <Icon name={b.ikon} size={15} />
                      <span className="text-[13.5px] font-bold tracking-tight flex-1">
                        {b.ad}
                      </span>
                      {sayi && (
                        <span
                          className={`text-[10px] font-mono font-bold tabular-nums ${
                            aktif
                              ? 'text-stone-300 dark:text-zinc-600'
                              : 'text-stone-400 dark:text-zinc-600'
                          }`}
                        >
                          {sayi}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Sağ içerik */}
        <div className="min-w-0">
          {bolum === 'genel' && (
            <GenelView
              ilerleme={ilerleme}
              stat={stat}
              onYetkinligeGit={() => setBolum('yetkinlik')}
            />
          )}
          {bolum === 'yetkinlik' && <YetkinlikView ilerleme={ilerleme} uniteler={uniteler} />}
          {bolum === 'rozetler' && <RozetlerView ilerleme={ilerleme} stat={stat} />}
          {bolum === 'uyelik' &&
            (user ? (
              <UyelikView user={user} premiumBitis={premiumBitis} isPremium={isPremium} />
            ) : (
              <BosBolumOturumGerekli />
            ))}
          {bolum === 'hesap' && (
            <HesapView
              user={user}
              ilerleme={ilerleme}
              stat={stat}
              profil={profil}
              onProfilDegis={setProfil}
              profilYukleniyor={profilYukleniyor}
              onKullaniciAdiGuncelle={onKullaniciAdiGuncelle}
              onTemaDegistir={onTemaDegistir}
              onSifirla={onSifirla}
            />
          )}
        </div>
      </div>
    </main>
  );
};

const BosBolumOturumGerekli = () => (
  <div className="bg-white dark:bg-zinc-800/40 border border-dashed border-stone-300 dark:border-zinc-700 rounded-2xl p-10 text-center">
    <Icon
      name="LogIn"
      size={28}
      className="mx-auto mb-3 text-stone-400 dark:text-zinc-600"
    />
    <p className="text-[14px] text-stone-500 dark:text-zinc-500 font-medium">
      Bu bölümü görmek için giriş yapman gerekli.
    </p>
  </div>
);
