# MuhasebeLab Projesi

## Proje Özeti
Muhasebe öğrencileri için LeetCode tarzı interaktif pratik platformu.
Tek Düzen Hesap Planı'nı senaryo tabanlı yevmiye kaydı alıştırmalarıyla öğretir.

Gerçeğe yakın belgelerle (fatura, makbuz, dekont) çalışılır; anında kontrol,
puan + streak, rozet, aktivite ısı haritası ile motivasyon katmanı sağlanır.

## Teknik Yapı
- **Vite + React 19 + TypeScript** (tek HTML + CDN mimarisi terk edildi; eski sürüm
  [src/_legacy-reference.html](src/_legacy-reference.html) içinde referans olarak duruyor)
- **Tailwind CSS** + PostCSS + Autoprefixer
- **react-router-dom v7** — `HashRouter` (`#/`, `#/problemler/:id`, `#/uniteler/:id`,
  `#/profil`, `#/giris`, `#/onboarding`, `#/premium`, `#/admin/*`)
- **Supabase**: Auth (e-posta/şifre), Postgres + RLS, Edge Functions
- Anonim kullanıcı → `localStorage` (`mli_progress_v3`); oturum açınca veri
  otomatik buluta taşınır (`ilerlemeMigrateSupabase`)
- **Fraunces** (display) + **Inter Tight** (body) fontları
- **Thiings** 3D PNG ikonları (`public/icons/`) + `lucide-react` UI ikonları

## Kod Organizasyonu

```
src/
├── App.tsx                   — router + üst seviye state + rozet kontrolü
├── main.tsx
├── components/               — 20 bileşen (Navbar, Footer, modallar, form parçaları,
│                                AIAsistanYanPanel, PremiumGate, HataBildirModal…)
├── pages/
│   ├── AnaSayfa, ProblemlerSayfasi, SoruEkrani, UnitelerSayfasi, UniteSayfasi,
│   │   ProfilSayfasi, GirisSayfasi, OnboardingSayfasi, PremiumSayfasi
│   └── admin/                — AdminAnaSayfa, Sorular, YeniSoru, DuzenleSoru,
│                                TopluEkle, Hatalar (6 sayfa)
├── contexts/                 — AuthContext, UnitelerContext
├── data/                     — hesap-plani.ts, rozetler.ts, sabitler.ts
│                               (üniteler ve sorular Supabase'den yükleniyor;
│                                uniteler-loader.ts fallback ile çalışır)
├── lib/
│   ├── supabase.ts, auth.ts, admin.ts, database.types.ts
│   ├── ilerleme.ts           — localStorage tabanlı ilerleme
│   ├── ilerleme-supabase.ts  — bulut senkron + migration
│   ├── uniteler-loader.ts    — ünite/soru yükleme
│   ├── kontrol.ts            — yevmiye doğrulama
│   ├── gunun-sorusu.ts       — günün sorusu seçim mantığı
│   ├── oneriler.ts           — "devam et" / "tekrar et" önerileri
│   ├── ai.ts                 — Edge Function çağrıları
│   └── format.ts
└── types/index.ts

supabase/
├── migrations/               — 5 migration:
│   ├── 20260422000001_init                — şema + RLS
│   ├── 20260422000002_admin_rls           — admin politikaları
│   ├── 20260422000003_premium_rpc         — erken erişim aktivasyon RPC (ilk 100 kişiye 1 yıl)
│   ├── 20260423000001_belgeler            — fatura/makbuz/dekont tablosu
│   └── 20260423000002_seed_static_sorular — 11 ünite + 80 soru
├── functions/                — Edge Functions:
│   ├── ai-asistan            — soru içinde AI rehber
│   ├── ai-belge-uret         — belge üretimi
│   └── ai-yanlis-analizi     — yanlış cevap açıklaması
└── seed.sql
```

## Veri Yapısı
- `HESAP_PLANI` — Tek Düzen Hesap Planı (kod, ad, sınıf, tür) — kodda tutulur
- `uniteler` tablosu — 11 ünite (Kasa, Banka, Mal, Senet, KDV, Amortisman,
  Personel, Dönem Sonu, Şüpheli Alacaklar, Reeskont, Kambiyo)
- `sorular` tablosu — **80 soru** seed edilmiş; admin panelinden eklenebilir
  (`durum`: taslak/inceleme/onayli/arsiv)
- `ROZETLER` — 12 başarı rozeti (kodda)
- Zorluk puanları: kolay 5p, orta 10p, zor 20p (`ZORLUK_PUAN`)

## Kullanıcı Tercihleri
- **Türkçe** cevap ver (kod, yorum, commit, UI — hepsi)
- **Dolgun** font stili (Fraunces bold) — incelik tercih edilmiyor
- Akademik ama modern ton
- **Beyaz + mavi** renk paleti (açık tema baskın)
- **Thiings 3D** ikonları kullan (emoji değil)
- Estetik: klasik + editorial + modern harmonisi

## Mevcut Durum (2026-04-24)

### Tamamlanan
- Vite/TS/React 19 migrasyonu
- Supabase Auth + bulut senkron + anonim→bulut migration
- Admin paneli (6 sayfa): tekil/toplu soru ekleme, düzenleme, hata moderasyonu
- Premium altyapısı: özellik bazlı `PremiumGate` + erken erişim RPC + fiyatlandırma sayfası (günlük soru limiti **yok**, karar: hibrit freemium)
- AI Edge Functions (3): asistan, belge üretimi, yanlış analizi
- Belge sistemi (fatura/makbuz/dekont): tablo, editor, modal
- Hata bildir: kullanıcı UI + admin moderasyon listesi
- Günün sorusu, "devam et" önerisi, yanlış yapılanları tekrar et
- Onboarding akışı
- 11 ünite, 80 soru (Aşama 4 içerik hedefleri büyük ölçüde karşılandı)

### Yol haritası (pazar analizi sonrası öncelikli — [PAZAR-ANALIZI.md](PAZAR-ANALIZI.md))

**Karar (24 Nisan 2026):** Hedef **en kısa sürede ürün çıkarmak**. Öğretmen
paneli ve sınav modu MVP'de değil — v1.1+. MVP B2C öğrenci lansmanı.

**P0 — MVP shipi için gerekli (sıralı)**
1. **İyzico ödeme entegrasyonu** — `odemeler` tablosu var, Edge Function +
   ödeme akışı + abonelik yönetimi yok. Gelir yoksa ürün değil.
2. **Landing + onboarding friksiyonu** — ziyaretçiyi kayda, kaydolanı
   Premium'a çevirecek akış iyileştirmesi.
3. **Soru sayısı 80 → 120-150** — pazar analizi pilot eşiği (100 minimum).
   Admin paneli + `soru-uret.md` prompt'u ile hızlı üretilebilir.

**P1 — Lansman sonrası (v1.1+)**
4. Sınav modu + karışık soru modu
5. Öğretmen/sınıf paneli (dağıtım kanalı için kritik ama büyük iş)
6. Hesap sınıfları/grupları seviye haritası
7. Konu anlatım sayfaları
8. T hesabı görselleştirmesi
9. Liderlik tablosu + haftalık challenge
10. Sözlük / SSS / hesap planı tam sayfa (SEO)

## Referans Dosyalar
- [PAZAR-ANALIZI.md](PAZAR-ANALIZI.md) — 24 Nisan pazar analizi, hedef kitle,
  SAM/SOM, rekabet, fiyat, konumlanma. Ürün kararlarında baz alınır.
- [DOKUMANTASYON.md](DOKUMANTASYON.md) — kullanıcıya yönelik, güncel (23 Nisan)
- [SISTEM-HARITASI.md](SISTEM-HARITASI.md) — 22 Nisan tarihli; soru sayısı/ünite
  verileri eski, **genel yol haritası kısmı hâlâ geçerli**
- [content/prompts/soru-uret.md](content/prompts/soru-uret.md) — yeni soru üretirken
  Claude'a verilecek prompt şablonu
