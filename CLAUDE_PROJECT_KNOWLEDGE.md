# MuhasebeLab — Project Knowledge Base

> Claude.ai → Projects → senin projen → "Project knowledge" alanına bu dosyayı **upload** et. Diğer .md dosyalarını da ek olarak yükleyebilirsin (hepsi paralel kullanılır).

---

## 1. Ürün Özeti

**MuhasebeLab** — Türk üniversite muhasebe öğrencileri için LeetCode tarzı interaktif yevmiye atölyesi.

**Hedef kitle:** Türkiye'deki muhasebe/işletme/iktisat lisans öğrencileri (Boğaziçi, ODTÜ, İTÜ, Anadolu AÖF gibi).

**Vaat:** Tek Düzen Hesap Planı'nı senaryo bazlı, gerçek belgelerle (fatura, makbuz, dekont) çalışarak öğret. Anında doğrulama, puan + streak, rozet, aktivite ısı haritası ile motivasyon katmanı.

**Domain:** muhasebelab (henüz alınmadı, Vercel default URL ile başlanabilir).

---

## 2. Veri Yapısı

### Hesap Planı (TDHP)

- **268 hesap** (kod, ad, sınıf, tür)
- **58 grup başlığı** (ör. "10 · Hazır Değerler", "11 · Menkul Kıymetler"...)
- **7 sınıf**: 1 Dönen Varlıklar, 2 Duran Varlıklar, 3 KV Yabancı Kaynaklar, 4 UV Yabancı Kaynaklar, 5 Öz Kaynaklar, 6 Gelir Tablosu, 7 Maliyet
- Hem `src/data/hesap-plani.ts` (kod) hem Supabase `hesap_plani` tablosu (FK için)
- Referans: Fuat Hoca PDF broşürü (1992 MSUGT temelli)

3 seviyeli hiyerarşi: **sınıf > grup > hesap** — Hesap Planı modal'ında bu düzen gösteriliyor.

### Üniteler & Sorular

11 ünite, **213 soru** (production Supabase'de):
- Kasa İşlemleri (~20)
- Banka İşlemleri (~20)
- Ticari Mal Alım-Satımı (~21)
- Çek ve Senetler (~20)
- KDV Hesapları (~20)
- Duran Varlıklar ve Amortisman (~20)
- Personel ve Ücret (~20)
- Dönem Sonu İşlemleri (~17)
- Şüpheli Alacaklar (~17)
- Reeskont İşlemleri (~17)
- Kambiyo İşlemleri (~17)

Zorluk: kolay 5p, orta 10p, zor 20p.

Sorular `durum`: taslak | inceleme | onayli | arsiv. Admin panelinden yönetiliyor.

### Belgeler

`belgeler` tablosu var: fatura, perakende-fis, çek, senet, dekont. Soru içinde JSON olarak saklı, `BelgeModal` ile gösteriliyor.

---

## 3. Erişim Modeli (Önemli — Yasal)

**Soru çözmek kayıt zorunlu.** Anonim ziyaretçi:
- ✅ Soruları/üniteleri/hesap planını görüntüler
- ❌ Çözemez
- ❌ İlerleme/puan/rozet kazanamaz

`SoruEkrani.tsx`'te `if (!user) return <GirisDuvari soru={soru} />` koşulu var. `authDonusYaz` mekanizması: kullanıcı önce çözmek istediği soruya gelirse, login sonrası geri dönüş URL'i tutulur.

KVKK Aydınlatma Metni `/kvkk` route'unda mevcut (6698 sayılı kanuna uygun). Kayıt sırasında **zorunlu onay**.

---

## 4. Kayıt + Onboarding Akışı

### Kayıt Ekranı (GirisSayfasi.tsx)

Alanlar:
1. **Kullanıcı adı** — zorunlu, 2-30 karakter, regex kontrolü, **DB'de UNIQUE**, debounced uygunluk kontrolü, alınmışsa **3 öneri chip'i** sunulur (örn: kerim alınmışsa kerim_26, kerim.14, kerim545)
2. **E-posta** — zorunlu
3. **Şifre** — min 6 karakter, göz ikonu (Eye/EyeOff)
4. **Şifre Tekrar** — real-time eşleşme kontrolü, kırmızı/yeşil border
5. **KVKK onayı** — zorunlu checkbox, link açılır
6. **Bülten izni** — opt-in checkbox

Backend: `kayitOl(KayitBilgileri)` — Supabase Auth `signUp` + `options.data` ile kullanıcı_adı + bülten_izni metadata. `handle_new_user` trigger okur.

### Onboarding (OnboardingSayfasi.tsx)

3 adım: hosgeldin → tani → unite.

**Tanı adımı** (hepsi opsiyonel):
- Üniversite (text input)
- Bölüm (text input)
- Sınıf: 1/2/3/4/Mezun/Diğer (toggle butonlar)
- Hedef: Vize/Final | KPSS | Genel pratik | Belirsiz (toggle kart)

Veriler `kullanicilar` tablosuna update ediliyor (`universite`, `bolum`, `sinif`, `hedef`, `dogum_yili`, `bulten_izni`, `kvkk_kabul_tarihi`).

### Profil Sayfası (ProfilSayfasi.tsx)

"Eğitim Bilgileri" panelinde aynı alanları kullanıcı sonradan da düzenleyebilir + doğum yılı + avatar URL.

---

## 5. Anasayfa Yapısı (Sade)

Önceden 8 bölüm vardı, şu an **5 bölüm**:

1. **Hero (ScrollHero)** — yevmiye fişi animasyonu, 4 sahne, 420vh sticky pinned. Sahneler: ① boş yevmiye → ② tek satır dolar → ③ 3 satır + denge → ④ AI yanında. `useScroll` + `useTransform` (framer-motion).

2. **Üniversite logoları** — sosyal kanıt şeridi (Boğaziçi, İTÜ, ODTÜ, Hacettepe, Marmara, Bilkent, Anadolu).

3. **§ 01 · İçerik (UniteSeciciSection)** — 11 ünite **zigzag scroll reveal**. Sağ-sol alternating sahneler, ortadan dikey timeline çizgisi (lg+), her sahnenin tam ortasında 56px daire (`01..11`). Görsel kart: mavi tonlu gölge orb (radial gradient sky-deep, 18px blur, 7s breathing animation) + dev transparent numara arka planda. Metin: ünite adı + açıklama + 3-renkli zorluk stripe + "Bu üniteyi keşfet" pill buton. `Reveal` (useInView) ile fade-in + slide-up.

4. **§ 06 · Başla (CTA)** — "Hesap Oluştur / Önce Soruları Gör".

5. **Footer** — açık temada açık paletli, dark'ta koyu. Mega § sembolü sağ-altta.

**Kaldırılan bölümler** (kullanıcının "karmaşık" geri bildirimi sonrası): § 01 · Mimari (TDHP diyagram), § 03 · Bugün, § 04 · Tarife, § 05 · SSS.

---

## 6. Renk Paleti & Tipografi

```css
--bg: #f4f5f8;          /* cool pearl */
--surface: #ffffff;
--surface-2: #eef0f4;
--ink: #1f3a5f;         /* deep navy */
--ink-soft: #4a5d75;
--ink-mute: #8a96a8;
--copper: #b8732b;       /* bakır accent */
--copper-deep: #9a5f1f;
--sky-deep: #5a87b0;
--sky: #9cd5ff;
--line: #e2e4ea;
--line-strong: #c8ccd4;
```

Dark mode: `darkMode: 'class'` (Tailwind), `<body class="dark">` ile aktif.

**Fontlar:**
- `font-display` = **Geist** (bold sans, başlıklar)
- `font-display-italic` = **Instrument Serif** italic (vurgu kelimeler)
- `font-mono` = **JetBrains Mono** (etiketler, hesap kodları, tutarlar)

---

## 7. Teknik Detaylar

### Stack

- Vite + React 19 + TypeScript
- Tailwind CSS + PostCSS + Autoprefixer
- React Router v7 — `HashRouter`
- Supabase JS SDK (Auth + Postgres + Edge Functions)
- framer-motion (hero animasyonları)
- Lucide-react (UI ikonları), Thiings 3D PNG (`public/icons/`) — ana sayfada Thiings yerine zigzag mavi orb kullanıldı
- Vitest (54 test geçer)

### Routes

```
#/                        — anasayfa
#/giris                   — kayıt + giriş
#/onboarding              — kayıt sonrası 3-adım
#/kvkk                    — KVKK aydınlatma metni
#/uniteler                — tüm üniteler
#/uniteler/:uniteId       — tek ünite + soruları
#/problemler              — tüm sorular liste
#/problemler/:soruId      — soru çözme ekranı
#/profil                  — kullanıcı profili (kayıt gerektirir)
#/premium                 — premium plan sayfası
#/premium/sonuc           — ödeme sonuç
#/admin                   — admin panel (5 alt sayfa)
```

### Supabase Migrations (10 adet, hepsi production'da)

```
20260422000001_init                    — şema + RLS
20260422000002_admin_rls               — admin politikaları
20260422000003_premium_rpc             — erken erişim aktivasyon RPC (ilk 100 kişiye 1 yıl)
20260423000000_hesap_plani_seed        — 268 hesap (TDHP)
20260423000001_belgeler                — fatura/makbuz/dekont tablosu
20260423000002_seed_static_sorular     — 11 ünite + 98 statik soru
20260425000001_ai_kullanim             — AI çağrı sayacı
20260425000002_iyzico                  — ödeme tablosu (entegrasyon henüz yok)
20260425000003_more_sorular            — 115 ek soru (toplam 213)
20260426000001_rls_sikilastir          — RLS policy güçlendirme
20260427000001_kullanici_profil_alanlari — profil kolonları + handle_new_user trigger
20260427000002_kullanici_adi_unique     — unique constraint + kullanici_adi_uygun RPC
```

### Edge Functions (3 adet)

- `ai-asistan` — soru çözerken AI rehber, free 3 sorgu/gün
- `ai-belge-uret` — belge (fatura, dekont) görseli üretici
- `ai-yanlis-analizi` — yanlış cevap açıklayıcı

Hepsi Google Gemini 2.0 Flash kullanıyor (`_shared/anthropic.ts` — geçmiş uyumluluk için isim öyle). `GEMINI_API_KEY` Supabase secret olarak set edilmiş.

### Önemli Dosyalar

```
src/
├── App.tsx                   — router + state + rozet kontrolü
├── components/               — 20+ bileşen
├── pages/
│   ├── AnaSayfa.tsx          — ScrollHero + UniteSeciciSection (zigzag)
│   ├── GirisSayfasi.tsx      — kayıt formu (kullanıcı adı + öneri + KVKK + şifre tekrar)
│   ├── OnboardingSayfasi.tsx — 3 adım onboarding
│   ├── ProfilSayfasi.tsx     — eğitim bilgileri paneli + ödeme geçmişi
│   ├── KvkkSayfasi.tsx       — 6698 aydınlatma metni
│   ├── ProblemlerSayfasi, SoruEkrani, UnitelerSayfasi, UniteSayfasi, PremiumSayfasi
│   └── admin/                — 6 admin sayfa
├── contexts/
│   ├── AuthContext.tsx       — user + premiumBitis
│   └── UnitelerContext.tsx   — uniteler + tumSorular cache + Supabase yükleme
├── data/
│   ├── hesap-plani.ts        — 268 hesap statik
│   ├── sabitler.ts           — SINIF_ISIMLERI + GRUP_ISIMLERI (58)
│   └── rozetler.ts           — 12 rozet
├── lib/
│   ├── auth.ts               — kayitOl(KayitBilgileri), girisYap, cikisYap
│   ├── kullanici-adi.ts      — uygunluk kontrol + öneri üretici
│   ├── ilerleme-supabase.ts  — bulut senkron + migration
│   ├── kontrol.ts            — yevmiye doğrulama mantığı
│   ├── ai.ts                 — Edge Function çağrıları
│   ├── auth-donus.ts         — login sonrası geri dönüş URL
│   └── format.ts             — tarih/sayı formatlama
└── types/index.ts            — Hesap, Soru, Belge, Ilerleme, Istatistik...
```

---

## 8. Yol Haritası

### P0 (MVP shipi için sıralı)

1. **Tam test** — kayıt → onboarding → soru çözme → puan → rozet birden fazla cihazda. Yasal sorumluluk için ödeme öncesi.
2. **İyzico entegrasyonu** — `odemeler` tablosu hazır, Edge Function + abonelik akışı yok.
3. **Landing/onboarding friksiyon iyileştirmesi**

### Tamamlanan (eski P0)

- ~~Soru sayısı 80 → 150~~ — 213'e çıkıldı
- ~~TDHP tam~~ — 268 hesap, 58 grup, 3 seviye hiyerarşi
- ~~Ventriloc esinli reskin~~
- ~~Zigzag içerik bölümü~~

### P1+ (Lansman sonrası)

- Sınav modu + karışık soru
- Öğretmen/sınıf paneli
- Konu anlatım sayfaları
- T hesabı görselleştirme
- Liderlik tablosu (`universite_liderlik` view zaten hazır)
- Sözlük / SSS / hesap planı tam sayfa (SEO)

---

## 9. Stil Tercihleri

- **Dil:** Türkçe (kod, yorum, commit, UI metni hepsi)
- **Yazı stili:** dolgun, akademik ama modern, klasik + editorial
- **Renk:** beyaz + mavi + bakır accent
- **İkon:** Lucide (UI), Thiings (gerekirse), **emoji yok**
- **Tipografi:** mono uppercase küçük etiket + bold display başlık + italic serif vurgu

---

## 10. GitHub & Deploy

- Repo: https://github.com/abdulkerimcetinkaya/muhasebelab (public)
- Henüz Vercel deploy yok — kullanıcı yasal süreç (KVKK + İyzico) tamamlanınca yayına almak istiyor
- Local dev: `npm run dev` (Vite, http://localhost:5173)
- Build: `npm run build`
- Test: `npm test -- --run` (54/54 geçer)
- Migration push: `npx supabase db push`
- Edge function deploy: `npx supabase functions deploy <name>`

---

## 11. Bilinen Açık Sorunlar

- **Çift sahnelerde (2, 4, 6) zigzag hizalama** — kullanıcı "yazılar tam kartın karşısına gelmiyor" dedi, kısmi düzeltme yapıldı (`min-height: 220px`, `justify-content: center`) ama tam çözülmedi. `align-items: stretch` veya kart yüksekliği eşleme denenebilir.
- **Premium butonu** İyzico Edge Function olmadığı için bastığında hata verir. Yayına almadan önce ya Edge Function yapılmalı ya buton "Yakında" olarak gizlenmeli.
- **Mobile responsive** sınanmadı (özellikle hero ScrollHero yatay/dikey).
