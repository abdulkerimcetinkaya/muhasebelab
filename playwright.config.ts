import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// .env'i manuel yükle — test process'inin process.env'ine inject et.
// Vite kendi .env'ini okur ama Playwright Node process ayrı, otomatik
// okumuyor. Dotenv dep eklemek yerine basit parser.
const envDosya = resolve(dirname(fileURLToPath(import.meta.url)), '.env');
try {
  const icerik = readFileSync(envDosya, 'utf-8');
  for (const satir of icerik.split('\n')) {
    const eslesme = satir.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (eslesme) {
      const [, anahtar, deger] = eslesme;
      if (!process.env[anahtar]) {
        // Tırnak içindeki değerleri de destekle
        process.env[anahtar] = deger.trim().replace(/^["']|["']$/g, '');
      }
    }
  }
} catch {
  // .env yoksa devam — CI gibi ortamlar env'leri başka yerden alır
}

/**
 * MuhasebeLab — Playwright E2E test config
 *
 * Çalıştırma:
 *   npm run test:e2e            # Tüm testler (headless)
 *   npm run test:e2e:ui         # UI mode (interactive)
 *   npm run test:e2e:install    # İlk kurulum (browser binary'leri)
 *
 * Hedef: smoke test seviyesinde — kritik kullanıcı akışları (kayıt, soru
 * çözme, ödeme akışı navigasyonu). Tam regresyon değil; CI'da hızlı koş.
 *
 * Tarayıcılar: Chromium (en yaygın), Firefox (Gecko regresyon), WebKit
 * (Safari/iOS). Local dev'de sadece Chromium koşmak isterseniz:
 *   npx playwright test --project=chromium
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Paralel koşum
  fullyParallel: true,

  // CI'da `test.only` kalmasın
  forbidOnly: !!process.env.CI,

  // CI'da flaky retry, local'de tek koşum
  retries: process.env.CI ? 2 : 0,

  // CI'da paralel worker sınırla (resource savings)
  workers: process.env.CI ? 2 : undefined,

  // Reporter: list (CLI) + html (artifacts)
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  // Default timeout
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  use: {
    // Tarayıcı bağlanacağı base URL
    // PLAYWRIGHT_BASE_URL set ise (örn. Vercel preview) onu kullan
    // CI: localhost:4173 (preview server)
    // Local: localhost:5173 (dev server)
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL ||
      (process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173'),

    // Hata olursa trace + screenshot + video
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Türkçe locale (tr-TR formatları için)
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobil regresyon (smoke seviyesinde)
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],

  // Sunucu otomatik kaldır:
  // - CI: production preview (npm run preview, port 4173)
  // - Local: dev server (npm run dev, port 5173)
  // - PLAYWRIGHT_BASE_URL set edilmişse hiç ayağa kaldırma (remote test)
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : process.env.CI
      ? {
          command: 'npm run build && npm run preview -- --port 4173',
          url: 'http://localhost:4173',
          reuseExistingServer: false,
          timeout: 120_000,
        }
      : {
          command: 'npm run dev',
          url: 'http://localhost:5173',
          reuseExistingServer: true,
          timeout: 60_000,
        },
});
