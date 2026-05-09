# E2E Testleri (Playwright)

MuhasebeLab kritik kullanıcı akışları için end-to-end test seti.

## İlk kurulum

```bash
# 1. Dependencies
npm install

# 2. Browser binary'leri indir (~200 MB)
npm run test:e2e:install
```

## Çalıştırma

```bash
# Tüm testler, headless
npm run test:e2e

# UI mode — interaktif debug
npm run test:e2e:ui

# Tek tarayıcı
npx playwright test --project=chromium

# Tek dosya
npx playwright test smoke-anonim.spec.ts

# Sadece eşleşen test
npx playwright test -g "anasayfa yüklenir"

# Headed mode (görünür browser)
npx playwright test --headed

# Debug mode — adım adım
npx playwright test --debug
```

## Test dosyaları

| Dosya | Kapsam |
|---|---|
| `smoke-anonim.spec.ts` | Anonim ziyaretçi: anasayfa, navbar, üniteler, problemler, giriş, premium, tema toggle |
| `auth-akisi.spec.ts` | Form validasyonu + opsiyonel gerçek giriş (env ile) |
| `uniteler-konu-navigasyon.spec.ts` | Üniteler → ünite detay → konu sayfası akışı |
| `visual-regression.spec.ts` | Kritik sayfaların ekran görüntüsü baseline'ı |

## Visual regression baseline güncelleme

Tasarım değişikliği sonrası baseline'ı güncellemek için:

```bash
npm run test:e2e -- --update-snapshots
```

İlk koşumda otomatik üretilir. Snapshot'lar `tests/e2e/<dosya>-snapshots/` klasöründe — git'e commit edilir.

## Ortam değişkenleri

| Değişken | Amaç | Default |
|---|---|---|
| `PLAYWRIGHT_BASE_URL` | Test edilecek URL | `http://localhost:5173` |
| `TEST_USER_EMAIL` | Auth testi için gerçek hesap | (yok → skip) |
| `TEST_USER_PASSWORD` | Aynı | (yok → skip) |
| `CI` | CI modu (retry, paralel sınır) | (otomatik) |

## CI

`.github/workflows/playwright.yml` — her PR'da chromium + webkit matrisi koşar. Hata olursa:

- HTML rapor: `playwright-report-<project>` artifact
- Failure detay: `test-results-<project>` artifact (trace, screenshot, video)

## Test yazarken

- **Auth gerektiren akışlar:** `test.skip(!process.env.TEST_USER_EMAIL)` ile guard et
- **Network bekleme:** `await page.waitForLoadState('networkidle')` (ama emin değilsen `domcontentloaded` daha hızlı)
- **Selector'lar:**
  - 1. tercih: `getByRole('button', { name: /...regex.../i })`
  - 2. tercih: `getByLabel`, `getByPlaceholder`, `getByText`
  - Son tercih: CSS selector (`page.locator('.mufredat-satir')`)
- **Türkçe regex:** `/şifre/i` flag'i kullan
- **Mobil-spesifik testleri:** `test.skip(!isMobile, '...')` ile guard et
