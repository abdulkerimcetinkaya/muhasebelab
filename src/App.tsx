import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import { RozetToast } from './components/RozetToast';
import { HesapPlaniModal } from './components/HesapPlaniModal';
import { HesapPlaniYanPanel } from './components/HesapPlaniYanPanel';
import { AnaSayfa } from './pages/AnaSayfa';
import { ProblemlerSayfasi } from './pages/ProblemlerSayfasi';
import { SoruEkrani } from './pages/SoruEkrani';
import { UnitelerSayfasi } from './pages/UnitelerSayfasi';
import { UniteSayfasi } from './pages/UniteSayfasi';

const GirisSayfasi = lazy(() => import('./pages/GirisSayfasi').then((m) => ({ default: m.GirisSayfasi })));
const OnboardingSayfasi = lazy(() => import('./pages/OnboardingSayfasi').then((m) => ({ default: m.OnboardingSayfasi })));
const PremiumSayfasi = lazy(() => import('./pages/PremiumSayfasi').then((m) => ({ default: m.PremiumSayfasi })));
const PremiumSonucSayfasi = lazy(() => import('./pages/PremiumSonucSayfasi').then((m) => ({ default: m.PremiumSonucSayfasi })));
const ProfilSayfasi = lazy(() => import('./pages/ProfilSayfasi').then((m) => ({ default: m.ProfilSayfasi })));
const AdminAnaSayfa = lazy(() => import('./pages/admin/AdminAnaSayfa').then((m) => ({ default: m.AdminAnaSayfa })));
const AdminSorularSayfasi = lazy(() => import('./pages/admin/AdminSorularSayfasi').then((m) => ({ default: m.AdminSorularSayfasi })));
const AdminYeniSoruSayfasi = lazy(() => import('./pages/admin/AdminYeniSoruSayfasi').then((m) => ({ default: m.AdminYeniSoruSayfasi })));
const AdminDuzenleSoruSayfasi = lazy(() => import('./pages/admin/AdminDuzenleSoruSayfasi').then((m) => ({ default: m.AdminDuzenleSoruSayfasi })));
const AdminTopluEkleSayfasi = lazy(() => import('./pages/admin/AdminTopluEkleSayfasi').then((m) => ({ default: m.AdminTopluEkleSayfasi })));
const AdminHatalarSayfasi = lazy(() => import('./pages/admin/AdminHatalarSayfasi').then((m) => ({ default: m.AdminHatalarSayfasi })));

const SayfaYukleniyor = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-stone-400 dark:text-zinc-500 text-sm">
    Yükleniyor…
  </div>
);
import { useAuth } from './contexts/AuthContext';
import { useUniteler } from './contexts/UnitelerContext';
import { ROZETLER } from './data/rozetler';
import { ZORLUK_PUAN } from './data/sabitler';
import { bugununTarihi } from './lib/format';
import {
  ilerlemeKaydet,
  ilerlemeYukle,
  istatistikHesapla,
  varsayilanIlerleme,
} from './lib/ilerleme';
import {
  ilerlemeMigrateSupabase,
  ilerlemeYukleSupabase,
  profilKaydetSupabase,
  rozetKaydetSupabase,
  soruCozumKaydetSupabase,
  yanlisKaydetSupabase,
} from './lib/ilerleme-supabase';
import { supabase } from './lib/supabase';
import type { Ilerleme, Rozet, Soru } from './types';

const OnboardingGuard = ({
  girisYapildi,
  onboardingTamam,
  oturumYukleniyor,
}: {
  girisYapildi: boolean;
  onboardingTamam: boolean;
  oturumYukleniyor: boolean;
}) => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (oturumYukleniyor) return;
    if (!girisYapildi) return;
    if (onboardingTamam) return;
    if (pathname === '/onboarding' || pathname === '/giris') return;
    nav('/onboarding', { replace: true });
  }, [girisYapildi, onboardingTamam, oturumYukleniyor, pathname, nav]);
  return null;
};

const App = () => {
  const { user, yukleniyor: oturumYukleniyor } = useAuth();
  const {
    uniteler,
    tumSorular,
    yukleniyor: uniteYukleniyor,
    hata: uniteHata,
  } = useUniteler();
  const [ilerleme, setIlerleme] = useState<Ilerleme>(ilerlemeYukle);
  const [planAcik, setPlanAcik] = useState(false);
  const [yanPanelAcik, setYanPanelAcik] = useState(false);
  const [rozetKuyrugu, setRozetKuyrugu] = useState<Rozet[]>([]);
  const sonUserId = useRef<string | null>(null);

  // Oturum durumu değişince veriyi doğru kaynaktan tekrar yükle.
  // Uniteler yüklenmeden ilerleme yüklenemez (zorluk lookup lazım).
  useEffect(() => {
    if (oturumYukleniyor) return;
    if (uniteYukleniyor) return;
    if (user) {
      if (sonUserId.current === user.id) return;
      sonUserId.current = user.id;
      const yerel = ilerlemeYukle();
      ilerlemeMigrateSupabase(user.id, yerel)
        .then(() => ilerlemeYukleSupabase(user.id, tumSorular))
        .then(setIlerleme)
        .catch((e) => console.error('İlerleme yüklenemedi', e));
    } else {
      sonUserId.current = null;
      setIlerleme(ilerlemeYukle());
    }
  }, [user, oturumYukleniyor, uniteYukleniyor, tumSorular]);

  // localStorage cache + tema sınıfı her zaman güncel
  useEffect(() => {
    ilerlemeKaydet(ilerleme);
    document.body.classList.toggle('dark', ilerleme.tema === 'dark');
  }, [ilerleme]);

  // Yeni kazanılan rozetleri tespit et
  useEffect(() => {
    if (uniteYukleniyor) return;
    const stat = istatistikHesapla(ilerleme, uniteler, tumSorular);
    const yeniRozetler: Rozet[] = [];
    ROZETLER.forEach((r) => {
      if (!ilerleme.kazanilanRozetler[r.id] && r.kontrol(stat)) yeniRozetler.push(r);
    });
    if (yeniRozetler.length > 0) {
      setIlerleme((prev) => {
        const yeniKazanilan = { ...prev.kazanilanRozetler };
        yeniRozetler.forEach((r) => {
          yeniKazanilan[r.id] = bugununTarihi();
        });
        return { ...prev, kazanilanRozetler: yeniKazanilan };
      });
      setRozetKuyrugu((prev) => [...prev, ...yeniRozetler]);
      if (user) {
        yeniRozetler.forEach((r) =>
          rozetKaydetSupabase(user.id, r.id).catch((e) => console.error('Rozet kaydı', e)),
        );
      }
    }
  }, [ilerleme, user, uniteler, tumSorular, uniteYukleniyor]);

  const soruCozuldu = (soru: Soru) => {
    if (ilerleme.cozulenler[soru.id]) return;
    const bugun = bugununTarihi();
    const dun = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let yeniStreak = ilerleme.streak;
    if (ilerleme.sonCozumTarihi === bugun) yeniStreak = ilerleme.streak;
    else if (ilerleme.sonCozumTarihi === dun) yeniStreak = ilerleme.streak + 1;
    else yeniStreak = 1;
    const puan = ZORLUK_PUAN[soru.zorluk] || 10;
    const yeniAkt = { ...ilerleme.aktiviteTarihleri };
    yeniAkt[bugun] = (yeniAkt[bugun] || 0) + 1;
    setIlerleme({
      ...ilerleme,
      cozulenler: {
        ...ilerleme.cozulenler,
        [soru.id]: { tarih: bugun, zorluk: soru.zorluk },
      },
      puan: ilerleme.puan + puan,
      streak: yeniStreak,
      sonCozumTarihi: bugun,
      aktiviteTarihleri: yeniAkt,
    });
    if (user) {
      soruCozumKaydetSupabase(user.id, soru.id, bugun).catch((e) =>
        console.error('Çözüm kaydı', e),
      );
    }
  };

  const yanlisKaydet = (soruId: string) => {
    setIlerleme((prev) => ({
      ...prev,
      yanlislar: { ...prev.yanlislar, [soruId]: (prev.yanlislar[soruId] || 0) + 1 },
    }));
    if (user) {
      yanlisKaydetSupabase(user.id, soruId).catch((e) => console.error('Yanlış kaydı', e));
    }
  };

  const ilerlemeSifirla = async () => {
    if (!confirm('Tüm ilerleme silinecek. Emin misiniz?')) return;
    if (user) {
      await Promise.all([
        supabase.from('ilerleme').delete().eq('user_id', user.id),
        supabase.from('aktivite').delete().eq('user_id', user.id),
        supabase.from('kazanilan_rozetler').delete().eq('user_id', user.id),
      ]);
    }
    setIlerleme({
      ...varsayilanIlerleme(),
      tema: ilerleme.tema,
      kullaniciAdi: ilerleme.kullaniciAdi,
    });
  };

  const temaDegistir = () => {
    setIlerleme((prev) => {
      const yeniTema = prev.tema === 'dark' ? 'light' : 'dark';
      if (user) profilKaydetSupabase(user.id, { tema: yeniTema }).catch(() => {});
      return { ...prev, tema: yeniTema };
    });
  };

  const kullaniciAdiGuncelle = (ad: string) => {
    setIlerleme((prev) => ({ ...prev, kullaniciAdi: ad }));
    if (user) profilKaydetSupabase(user.id, { kullanici_adi: ad }).catch(() => {});
  };

  const onboardingTamamla = (ad: string, _baslangicUniteId: string | null) => {
    setIlerleme((prev) => ({ ...prev, kullaniciAdi: ad, onboardingTamam: true }));
    if (user) profilKaydetSupabase(user.id, { kullanici_adi: ad }).catch(() => {});
  };

  const veriDisaAktar = () => {
    const data = JSON.stringify(ilerleme, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muhasebelab-${bugununTarihi()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stat = istatistikHesapla(ilerleme, uniteler, tumSorular);

  if (uniteYukleniyor && uniteler.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 flex items-center justify-center">
        <div className="text-sm text-stone-500 dark:text-zinc-500 font-medium">
          İçerik yükleniyor…
        </div>
      </div>
    );
  }

  if (uniteHata && uniteler.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-display text-xl font-bold mb-2">İçerik yüklenemedi</div>
          <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium">{uniteHata}</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 transition-colors">
        <Navbar
          ilerleme={ilerleme}
          onTemaDegistir={temaDegistir}
          onHesapPlaniAc={() => setPlanAcik(true)}
        />

        <OnboardingGuard
          girisYapildi={!!user}
          onboardingTamam={!!ilerleme.onboardingTamam}
          oturumYukleniyor={oturumYukleniyor}
        />

        <Suspense fallback={<SayfaYukleniyor />}>
          <Routes>
            <Route path="/" element={<AnaSayfa ilerleme={ilerleme} stat={stat} />} />
            <Route path="/giris" element={<GirisSayfasi />} />
            <Route
              path="/onboarding"
              element={
                <OnboardingSayfasi
                  onTamamla={onboardingTamamla}
                  mevcutAd={ilerleme.kullaniciAdi}
                />
              }
            />
            <Route path="/premium" element={<PremiumSayfasi />} />
            <Route path="/premium/sonuc" element={<PremiumSonucSayfasi />} />
            <Route path="/uniteler" element={<UnitelerSayfasi ilerleme={ilerleme} />} />
            <Route path="/uniteler/:uniteId" element={<UniteSayfasi ilerleme={ilerleme} />} />
            <Route path="/problemler" element={<ProblemlerSayfasi ilerleme={ilerleme} />} />
            <Route
              path="/problemler/:soruId"
              element={
                <SoruEkrani
                  ilerleme={ilerleme}
                  onCozuldu={soruCozuldu}
                  onYanlis={yanlisKaydet}
                  onHesapPlaniYanPanel={() => setYanPanelAcik(true)}
                />
              }
            />
            <Route
              path="/profil"
              element={
                <ProfilSayfasi
                  ilerleme={ilerleme}
                  stat={stat}
                  onKullaniciAdiGuncelle={kullaniciAdiGuncelle}
                  onSifirla={ilerlemeSifirla}
                  onDisaAktar={veriDisaAktar}
                  onTemaDegistir={temaDegistir}
                />
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminAnaSayfa />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/sorular"
              element={
                <ProtectedAdminRoute>
                  <AdminSorularSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/sorular/yeni"
              element={
                <ProtectedAdminRoute>
                  <AdminYeniSoruSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/sorular/toplu-ekle"
              element={
                <ProtectedAdminRoute>
                  <AdminTopluEkleSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/hatalar"
              element={
                <ProtectedAdminRoute>
                  <AdminHatalarSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/sorular/:soruId"
              element={
                <ProtectedAdminRoute>
                  <AdminDuzenleSoruSayfasi />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </Suspense>

        <Footer />

        {planAcik && <HesapPlaniModal onKapat={() => setPlanAcik(false)} />}
        <HesapPlaniYanPanel acik={yanPanelAcik} onKapat={() => setYanPanelAcik(false)} />

        {rozetKuyrugu[0] && (
          <RozetToast
            rozet={rozetKuyrugu[0]}
            onKapat={() => setRozetKuyrugu((prev) => prev.slice(1))}
          />
        )}
      </div>
    </HashRouter>
  );
};

export default App;
