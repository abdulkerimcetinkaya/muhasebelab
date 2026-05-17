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
      .select('ad, soyad, universite, bolum, sinif, hedef, dogum_yili, bulten_izni')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!aktif) return;
        setProfilYukleniyor(false);
        if (data) {
          setProfil({
            ad: (data as { ad: string | null }).ad ?? '',
            soyad: (data as { soyad: string | null }).soyad ?? '',
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

  // Profil tamamlanma yüzdesi — onboarding kaldırıldığı için kullanıcı
  // eksik alanları profil üzerinden tamamlasın diye nazikçe yönlendiriyoruz.
  // Zorunlu alan yok; sadece "tamamlandığında daha kişisel" değer önerisi.
  // Tüm 6 alan profil state'inde (Supabase'den fetch edilir + HesapView'de düzenlenir).
  const profilTamamlanmaSkor = useMemo(() => {
    const alanlar = [
      !!profil.ad,
      !!profil.soyad,
      !!profil.universite,
      !!profil.bolum,
      !!profil.sinif,
      !!profil.hedef,
    ];
    const dolan = alanlar.filter(Boolean).length;
    return { dolan, toplam: alanlar.length, yuzde: Math.round((dolan / alanlar.length) * 100) };
  }, [profil.ad, profil.soyad, profil.universite, profil.bolum, profil.sinif, profil.hedef]);
  const profilEksik = profilTamamlanmaSkor.yuzde < 100;

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
      'bg-brand-deep',
      'bg-success',
      'bg-danger',
      'bg-premium-deep',
      'bg-brand-deep',
      'bg-success',
    ];
    let hash = 0;
    const ad = ilerleme.kullaniciAdi || 'X';
    for (let i = 0; i < ad.length; i++) hash += ad.charCodeAt(i);
    return renkler[hash % renkler.length];
  }, [ilerleme.kullaniciAdi]);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Tamamlanma banner'ı — eski onboarding flow yerine, isteğe bağlı tamamlamaya nazik nudge */}
      {profilEksik && !profilYukleniyor && user && (
        <button
          onClick={() => setBolum('hesap')}
          className="w-full mb-6 group flex items-center gap-4 px-4 sm:px-5 py-3.5 rounded-2xl border border-brand-soft bg-brand-soft/40 hover:bg-brand-soft/60 transition text-left"
          aria-label="Hesap sekmesine git, eksik alanları tamamla"
        >
          <div className="relative flex-shrink-0">
            <svg width="40" height="40" viewBox="0 0 40 40" className="rotate-[-90deg]">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3.5" fill="none" />
              <circle
                cx="20" cy="20" r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${(profilTamamlanmaSkor.yuzde / 100) * 100.53} 100.53`}
                className="text-brand-deep dark:text-brand transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold tabular-nums text-brand-deep dark:text-brand">
              {profilTamamlanmaSkor.yuzde}%
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-bold text-ink leading-snug">
              Profilini tamamla
            </div>
            <div className="text-[12.5px] text-ink-soft leading-snug mt-0.5">
              {profilTamamlanmaSkor.dolan}/{profilTamamlanmaSkor.toplam} alan dolduruldu. Eğitim bilgilerini ekle, sana daha iyi öneriler getirebilelim.
            </div>
          </div>
          <Icon
            name="ChevronRight"
            size={16}
            className="text-ink-mute group-hover:text-ink transition flex-shrink-0"
          />
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-10">
        {/* Sol kolon: Avatar header (üstte) + nav (altta), birlikte sticky */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line rounded-2xl bg-surface overflow-hidden">
            {/* Compact avatar header */}
            <div className="p-4 border-b border-line">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 ${avatarRenk} text-bg font-display text-2xl font-bold flex items-center justify-center shadow-md flex-shrink-0 rounded-xl`}
                >
                  {avatarHarfi}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[16px] font-bold tracking-tight truncate leading-tight">
                    {ilerleme.kullaniciAdi}
                  </div>
                  <div className="text-[11px] text-ink-mute font-semibold mt-0.5 tabular-nums">
                    {stat.cozulenSayi} soru · {ilerleme.puan}p
                  </div>
                </div>
              </div>

              {/* Akademik etiketler */}
              {(profil.universite || profil.bolum || profil.sinif || profil.hedef) && (
                <div className="flex flex-wrap gap-1">
                  {profil.universite && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-2 text-[10.5px] font-bold text-ink-soft max-w-full">
                      <Icon name="Landmark" size={10} className="flex-shrink-0" />
                      <span className="truncate">{profil.universite}</span>
                    </span>
                  )}
                  {profil.bolum && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-2 text-[10.5px] font-bold text-ink-soft max-w-full">
                      <Icon name="BookOpen" size={10} className="flex-shrink-0" />
                      <span className="truncate">{profil.bolum}</span>
                    </span>
                  )}
                  {profil.sinif && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-2 text-[10.5px] font-bold text-ink-soft">
                      {SINIF_LABEL[profil.sinif]}
                    </span>
                  )}
                  {profil.hedef && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-soft text-[10.5px] font-bold text-brand-deep dark:text-brand-soft">
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
 ? 'bg-ink text-bg '
 : 'hover:bg-surface-2 text-ink-soft'
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
 ? 'text-ink-quiet'
 : 'text-ink-quiet'
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
  <div className="bg-surface border border-dashed border-line-strong rounded-2xl p-10 text-center">
    <Icon
      name="LogIn"
      size={28}
      className="mx-auto mb-3 text-ink-quiet"
    />
    <p className="text-[14px] text-ink-mute font-medium">
      Bu bölümü görmek için giriş yapman gerekli.
    </p>
  </div>
);
