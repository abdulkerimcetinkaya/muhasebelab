import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SiteLoader } from './components/SiteLoader';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import { RozetToast } from './components/RozetToast';
import { HesapPlaniModal } from './components/HesapPlaniModal';
import { HesapPlaniYanPanel } from './components/HesapPlaniYanPanel';

// Tüm route sayfaları lazy — initial JS bundle'ı 1MB+ küçülüyor (BlockNote pulled by
// UniteSayfasi/SoruEkrani/KonuSayfasi yalnızca o route'a girince yüklenir).
const AnaSayfa = lazy(() => import('./pages/AnaSayfa').then((m) => ({ default: m.AnaSayfa })));
const ProblemlerSayfasi = lazy(() => import('./pages/ProblemlerSayfasi').then((m) => ({ default: m.ProblemlerSayfasi })));
const SoruEkrani = lazy(() => import('./pages/SoruEkrani').then((m) => ({ default: m.SoruEkrani })));
const UnitelerSayfasi = lazy(() => import('./pages/UnitelerSayfasi').then((m) => ({ default: m.UnitelerSayfasi })));
const UniteSayfasi = lazy(() => import('./pages/UniteSayfasi').then((m) => ({ default: m.UniteSayfasi })));

const GirisSayfasi = lazy(() => import('./pages/GirisSayfasi').then((m) => ({ default: m.GirisSayfasi })));
const SifreSifirlaSayfasi = lazy(() => import('./pages/SifreSifirlaSayfasi').then((m) => ({ default: m.SifreSifirlaSayfasi })));
const SifreYenileSayfasi = lazy(() => import('./pages/SifreYenileSayfasi').then((m) => ({ default: m.SifreYenileSayfasi })));
const OnboardingSayfasi = lazy(() => import('./pages/OnboardingSayfasi').then((m) => ({ default: m.OnboardingSayfasi })));
const PremiumSayfasi = lazy(() => import('./pages/PremiumSayfasi').then((m) => ({ default: m.PremiumSayfasi })));
const PremiumSonucSayfasi = lazy(() => import('./pages/PremiumSonucSayfasi').then((m) => ({ default: m.PremiumSonucSayfasi })));
const KurumOdemeSayfasi = lazy(() => import('./pages/KurumOdemeSayfasi').then((m) => ({ default: m.KurumOdemeSayfasi })));
const ProfilSayfasi = lazy(() => import('./pages/ProfilSayfasi').then((m) => ({ default: m.ProfilSayfasi })));
const KvkkSayfasi = lazy(() => import('./pages/KvkkSayfasi').then((m) => ({ default: m.KvkkSayfasi })));
const LiderlikSayfasi = lazy(() => import('./pages/LiderlikSayfasi').then((m) => ({ default: m.LiderlikSayfasi })));
const AdminAnaSayfa = lazy(() => import('./pages/admin/AdminAnaSayfa').then((m) => ({ default: m.AdminAnaSayfa })));
const AdminSorularSayfasi = lazy(() => import('./pages/admin/AdminSorularSayfasi').then((m) => ({ default: m.AdminSorularSayfasi })));
const AdminYeniSoruSayfasi = lazy(() => import('./pages/admin/AdminYeniSoruSayfasi').then((m) => ({ default: m.AdminYeniSoruSayfasi })));
const AdminDuzenleSoruSayfasi = lazy(() => import('./pages/admin/AdminDuzenleSoruSayfasi').then((m) => ({ default: m.AdminDuzenleSoruSayfasi })));
const AdminTopluEkleSayfasi = lazy(() => import('./pages/admin/AdminTopluEkleSayfasi').then((m) => ({ default: m.AdminTopluEkleSayfasi })));
const AdminHatalarSayfasi = lazy(() => import('./pages/admin/AdminHatalarSayfasi').then((m) => ({ default: m.AdminHatalarSayfasi })));
const AdminUnitelerSayfasi = lazy(() => import('./pages/admin/AdminUnitelerSayfasi').then((m) => ({ default: m.AdminUnitelerSayfasi })));
const AdminIcerikSayfasi = lazy(() => import('./pages/admin/AdminIcerikSayfasi').then((m) => ({ default: m.AdminIcerikSayfasi })));
const AdminKonularSayfasi = lazy(() => import('./pages/admin/AdminKonularSayfasi').then((m) => ({ default: m.AdminKonularSayfasi })));
const AdminKonuIcerikSayfasi = lazy(() => import('./pages/admin/AdminKonuIcerikSayfasi').then((m) => ({ default: m.AdminKonuIcerikSayfasi })));
const AdminModullerSayfasi = lazy(() => import('./pages/admin/AdminModullerSayfasi').then((m) => ({ default: m.AdminModullerSayfasi })));
const AdminAltBasliklarSayfasi = lazy(() => import('./pages/admin/AdminAltBasliklarSayfasi').then((m) => ({ default: m.AdminAltBasliklarSayfasi })));
const AdminMevzuatSayfasi = lazy(() => import('./pages/admin/AdminMevzuatSayfasi').then((m) => ({ default: m.AdminMevzuatSayfasi })));
const AdminBildirimlerSayfasi = lazy(() => import('./pages/admin/AdminBildirimlerSayfasi').then((m) => ({ default: m.AdminBildirimlerSayfasi })));
const AdminSozlukSayfasi = lazy(() => import('./pages/admin/AdminSozlukSayfasi').then((m) => ({ default: m.AdminSozlukSayfasi })));
const AdminMuavinHesaplarSayfasi = lazy(() => import('./pages/admin/AdminMuavinHesaplarSayfasi').then((m) => ({ default: m.AdminMuavinHesaplarSayfasi })));
const AdminKullanicilarSayfasi = lazy(() => import('./pages/admin/AdminKullanicilarSayfasi').then((m) => ({ default: m.AdminKullanicilarSayfasi })));
const AdminKullaniciDetaySayfasi = lazy(() => import('./pages/admin/AdminKullaniciDetaySayfasi').then((m) => ({ default: m.AdminKullaniciDetaySayfasi })));
const AdminYetkilileriSayfasi = lazy(() => import('./pages/admin/AdminYetkilileriSayfasi').then((m) => ({ default: m.AdminYetkilileriSayfasi })));
const AdminIstatistiklerSayfasi = lazy(() => import('./pages/admin/AdminIstatistiklerSayfasi').then((m) => ({ default: m.AdminIstatistiklerSayfasi })));
const AdminKatkicilarSayfasi = lazy(() => import('./pages/admin/AdminKatkicilarSayfasi').then((m) => ({ default: m.AdminKatkicilarSayfasi })));
const AdminIndirimKodlariSayfasi = lazy(() => import('./pages/admin/AdminIndirimKodlariSayfasi').then((m) => ({ default: m.AdminIndirimKodlariSayfasi })));
const AdminLogSayfasi = lazy(() => import('./pages/admin/AdminLogSayfasi').then((m) => ({ default: m.AdminLogSayfasi })));
const KatkiciBasvuruSayfasi = lazy(() => import('./pages/KatkiciBasvuruSayfasi').then((m) => ({ default: m.KatkiciBasvuruSayfasi })));
const KatkiciSoruEkleSayfasi = lazy(() => import('./pages/KatkiciSoruEkleSayfasi').then((m) => ({ default: m.KatkiciSoruEkleSayfasi })));
const SozlukSayfasi = lazy(() => import('./pages/SozlukSayfasi').then((m) => ({ default: m.SozlukSayfasi })));
const SozlukTerimSayfasi = lazy(() => import('./pages/SozlukTerimSayfasi').then((m) => ({ default: m.SozlukTerimSayfasi })));
const KonuSayfasi = lazy(() => import('./pages/KonuSayfasi').then((m) => ({ default: m.KonuSayfasi })));
const ModulSayfasi = lazy(() => import('./pages/ModulSayfasi').then((m) => ({ default: m.ModulSayfasi })));
const AltBaslikSayfasi = lazy(() => import('./pages/AltBaslikSayfasi').then((m) => ({ default: m.AltBaslikSayfasi })));
const DashboardSayfasi = lazy(() => import('./pages/DashboardSayfasi').then((m) => ({ default: m.DashboardSayfasi })));

const SayfaYukleniyor = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-ink-quiet text-sm">
    Yükleniyor…
  </div>
);
import { useAuth } from './contexts/AuthContext';
import { useUniteler } from './contexts/UnitelerContext';
import { ROZETLER } from './data/rozetler';
import { puanHesapla } from './data/sabitler';
import { bugununTarihi } from './lib/format';
import {
  ilerlemeKaydet,
  ilerlemeYukle,
  istatistikHesapla,
  varsayilanIlerleme,
} from './lib/ilerleme';
import {
  gunlukGirisKaydetSupabase,
  ilerlemeMigrateSupabase,
  ilerlemeYukleSupabase,
  profilKaydetSupabase,
  rozetKaydetSupabase,
  soruCozumKaydetSupabase,
  yanlisKaydetSupabase,
  type CozumYardim,
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

// Route değişiminde sayfayı tepeye al — HashRouter scroll restoration default
// olarak browser'a bırakıyor, eski scroll konumu kalabiliyor.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);
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
        // Önce login kaydını yaz, ki yukleme sırasında streak doğru hesaplansın
        .then(() => gunlukGirisKaydetSupabase(user.id, bugununTarihi()))
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

  const soruCozuldu = (soru: Soru, yardim: CozumYardim = {}) => {
    const bugun = bugununTarihi();
    const yeniPuan = puanHesapla(soru.zorluk, yardim);
    const eskiKayit = ilerleme.cozulenler[soru.id];
    const eskiPuan = eskiKayit?.puan ?? (eskiKayit ? puanHesapla(eskiKayit.zorluk) : 0);

    // Best-score: yeni puan eskiden büyükse güncelle, değilse atla.
    // İlk çözümde eskiKayit null, atlanmaz.
    if (eskiKayit && yeniPuan <= eskiPuan) {
      // Daha düşük/eşit skor — kayıt değişmesin, ama backend'e logla
      // (kullanıcı yardım kullanım istatistiğini takip edebilelim).
      if (user) {
        soruCozumKaydetSupabase(user.id, soru.id, bugun, soru.zorluk, yardim).catch((e) =>
          console.error('Çözüm kaydı', e),
        );
      }
      return;
    }

    const puanFarki = yeniPuan - eskiPuan;
    const yeniAkt = { ...ilerleme.aktiviteTarihleri };
    yeniAkt[bugun] = (yeniAkt[bugun] || 0) + 1;
    setIlerleme({
      ...ilerleme,
      cozulenler: {
        ...ilerleme.cozulenler,
        [soru.id]: {
          tarih: eskiKayit?.tarih ?? bugun, // ilk çözüm tarihini koru
          zorluk: soru.zorluk,
          puan: yeniPuan,
          yardim,
        },
      },
      puan: Math.max(0, ilerleme.puan + puanFarki),
      sonCozumTarihi: bugun,
      aktiviteTarihleri: yeniAkt,
    });
    if (user) {
      soruCozumKaydetSupabase(user.id, soru.id, bugun, soru.zorluk, yardim).catch((e) =>
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

  const onboardingTamamla = (ad: string) => {
    setIlerleme((prev) => ({ ...prev, kullaniciAdi: ad, onboardingTamam: true }));
    if (user) profilKaydetSupabase(user.id, { kullanici_adi: ad }).catch(() => {});
  };

  const stat = istatistikHesapla(ilerleme, uniteler, tumSorular);

  if (uniteYukleniyor && uniteler.length === 0) {
    return (
      <div className="min-h-screen bg-bg-tint text-ink flex items-center justify-center">
        <div className="text-sm text-ink-mute font-medium">
          İçerik yükleniyor…
        </div>
      </div>
    );
  }

  if (uniteHata && uniteler.length === 0) {
    return (
      <div className="min-h-screen bg-bg-tint text-ink flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-display text-xl font-bold mb-2">İçerik yüklenemedi</div>
          <p className="text-sm text-ink-soft font-medium">{uniteHata}</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <SiteLoader />
      <div className="min-h-screen bg-bg-tint text-ink transition-colors">
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
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AnaSayfa ilerleme={ilerleme} stat={stat} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <DashboardSayfasi ilerleme={ilerleme} stat={stat} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/giris" element={<GirisSayfasi />} />
            <Route path="/sifre-sifirla" element={<SifreSifirlaSayfasi />} />
            <Route path="/sifre-yenile" element={<SifreYenileSayfasi />} />
            <Route
              path="/onboarding"
              element={
                <OnboardingSayfasi
                  onTamamla={onboardingTamamla}
                  mevcutAd={ilerleme.kullaniciAdi}
                />
              }
            />
            <Route path="/kvkk" element={<KvkkSayfasi />} />
            <Route path="/liderlik" element={<LiderlikSayfasi />} />
            <Route path="/sozluk" element={<SozlukSayfasi />} />
            <Route path="/sozluk/:slug" element={<SozlukTerimSayfasi />} />
            <Route path="/premium" element={<PremiumSayfasi />} />
            <Route path="/premium/sonuc" element={<PremiumSonucSayfasi />} />
            <Route path="/premium/kurum-odeme" element={<KurumOdemeSayfasi />} />
            <Route path="/uniteler" element={<UnitelerSayfasi ilerleme={ilerleme} />} />
            <Route path="/uniteler/:uniteId" element={<UniteSayfasi ilerleme={ilerleme} />} />
            <Route
              path="/uniteler/:uniteId/modul/:modulId"
              element={<ModulSayfasi ilerleme={ilerleme} />}
            />
            <Route
              path="/uniteler/:uniteId/modul/:modulId/alt/:altBaslikId"
              element={<AltBaslikSayfasi ilerleme={ilerleme} />}
            />
            <Route
              path="/uniteler/:uniteId/:konuId"
              element={<KonuSayfasi ilerleme={ilerleme} />}
            />
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
              path="/admin/uniteler"
              element={
                <ProtectedAdminRoute>
                  <AdminUnitelerSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/uniteler/:uniteId/icerik"
              element={
                <ProtectedAdminRoute>
                  <AdminIcerikSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/uniteler/:uniteId/konular"
              element={
                <ProtectedAdminRoute>
                  <AdminKonularSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/uniteler/:uniteId/konular/:konuId/icerik"
              element={
                <ProtectedAdminRoute>
                  <AdminKonuIcerikSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/uniteler/:uniteId/moduller"
              element={
                <ProtectedAdminRoute>
                  <AdminModullerSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/uniteler/:uniteId/moduller/:modulId/alt-basliklar"
              element={
                <ProtectedAdminRoute>
                  <AdminAltBasliklarSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/mevzuat"
              element={
                <ProtectedAdminRoute>
                  <AdminMevzuatSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/bildirimler"
              element={
                <ProtectedAdminRoute>
                  <AdminBildirimlerSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/sozluk"
              element={
                <ProtectedAdminRoute>
                  <AdminSozlukSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/muavin-hesaplar"
              element={
                <ProtectedAdminRoute>
                  <AdminMuavinHesaplarSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/kullanicilar"
              element={
                <ProtectedAdminRoute>
                  <AdminKullanicilarSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/kullanicilar/:id"
              element={
                <ProtectedAdminRoute>
                  <AdminKullaniciDetaySayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/yetkililer"
              element={
                <ProtectedAdminRoute>
                  <AdminYetkilileriSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/istatistikler"
              element={
                <ProtectedAdminRoute>
                  <AdminIstatistiklerSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/katkicilar"
              element={
                <ProtectedAdminRoute>
                  <AdminKatkicilarSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/indirim-kodlari"
              element={
                <ProtectedAdminRoute>
                  <AdminIndirimKodlariSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/log"
              element={
                <ProtectedAdminRoute>
                  <AdminLogSayfasi />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/katkici-basvuru" element={<KatkiciBasvuruSayfasi />} />
            <Route path="/katkici/soru/yeni" element={<KatkiciSoruEkleSayfasi />} />
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

        <Analytics />
        <SpeedInsights />
      </div>
    </HashRouter>
  );
};

export default App;
