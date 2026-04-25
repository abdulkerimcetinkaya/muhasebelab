# MuhasebeLab

Muhasebe öğrencileri için LeetCode tarzı interaktif pratik platformu.
Tek Düzen Hesap Planı'nı senaryo tabanlı yevmiye kaydı alıştırmalarıyla öğretir.

Gerçeğe yakın belgelerle (fatura, makbuz, dekont) çalışılır; anında kontrol,
puan + streak, rozet ve aktivite ısı haritası ile motivasyon katmanı sağlanır.

## Özellikler

- **212 hazır soru** — 11 ünite (Kasa, Banka, Mal, Senet, KDV, Amortisman,
  Personel, Dönem Sonu, Şüpheli Alacaklar, Reeskont, Kambiyo)
- **Yevmiye kontrolü** — borç/alacak dengesi, hesap kodu doğrulaması
- **AI rehber** — yanlış cevap analizi, soru içi asistan, otomatik belge üretimi
- **Premium** — İyzico ödeme entegrasyonu (aylık 99 ₺ / dönemlik 249 ₺)
- **Admin paneli** — soru ekleme, düzenleme, hata moderasyonu
- **Anonim → bulut migration** — kayıtsız başla, hesap açınca verilerin
  otomatik taşınır

## Teknik Yığın

- **Vite + React 19 + TypeScript**
- **Tailwind CSS** + PostCSS
- **react-router-dom v7** (HashRouter)
- **Supabase** — Postgres + RLS + Edge Functions + Auth
- **Vitest** — birim testler
- **lucide-react** + **Thiings** 3D PNG ikonları

## Kurulum

```bash
# Bağımlılıklar
npm install

# .env'i oluştur (örnek dosyaya bak)
cp .env.example .env
# Supabase Dashboard → Settings → API'den URL + anon key'i ekle

# Geliştirme sunucusu
npm run dev

# Üretim build'i
npm run build

# Testler
npm test
```

## Veritabanı

Supabase migrations ile yönetiliyor:

```bash
# Migration'ları uygula (Supabase CLI gerekli)
npx supabase db push
```

`supabase/migrations/` altında 8 migration var:

- `20260422000001_init` — şema + RLS
- `20260422000002_admin_rls` — admin politikaları
- `20260422000003_premium_rpc` — erken erişim aktivasyon RPC
- `20260423000001_belgeler` — fatura/makbuz/dekont tablosu
- `20260423000002_seed_static_sorular` — 11 ünite + 80 soru
- `20260425000001_ai_kullanim` — AI kullanım takibi
- `20260425000002_iyzico` — ödeme tablosu kolonları + planlar
- `20260425000003_more_sorular` — +132 ek soru
- `20260426000001_rls_sikilastir` — soru_hatalari RLS güvenlik düzeltmesi

## Edge Functions

```
supabase/functions/
├── ai-asistan          — soru içinde AI rehber
├── ai-belge-uret       — fatura/makbuz/dekont üretimi
├── ai-yanlis-analizi   — yanlış cevap açıklaması
├── iyzico-baslat       — checkout başlatma
└── iyzico-callback     — ödeme doğrulama + premium aktivasyon
```

## Belgeler

- [DOKUMANTASYON.md](DOKUMANTASYON.md) — kullanıcıya yönelik dokümantasyon
- [PAZAR-ANALIZI.md](PAZAR-ANALIZI.md) — hedef kitle, fiyat, konumlanma
- [SISTEM-HARITASI.md](SISTEM-HARITASI.md) — yol haritası
- [OZELLIK-MATRISI.csv](OZELLIK-MATRISI.csv) — özellik karşılaştırması

## Yol Haritası

**v1.0 (MVP — tamamlandı):** İyzico ödeme, dönüşüm akışı, 212 soru
**v1.1+:** Sınav modu, öğretmen paneli, T hesabı görselleştirmesi,
liderlik tablosu, SEO sözlük

## Lisans

Şu an için tüm hakları saklıdır. Lisanslama netleşince burada güncellenecek.
