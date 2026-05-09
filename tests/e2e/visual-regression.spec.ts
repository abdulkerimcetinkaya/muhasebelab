/**
 * Visual regression — kritik sayfaların ekran görüntüsü baseline'ı.
 *
 * İlk koşumda baseline screenshot'ları üretilir (snapshots/ klasörü).
 * Sonraki koşumlarda mevcut görünümle karşılaştırılır.
 *
 * Baseline güncelleme:
 *   npm run test:e2e -- --update-snapshots
 *
 * NOT: Pixel-perfect compare yerine threshold tolerance ile çalışır.
 * Animation, font yükleme gibi flaky kaynaklar disable edilir.
 */
import { expect, test } from '@playwright/test';

// Animasyonları durdur, font yükleme bekle — flaky'liği azalt
test.beforeEach(async ({ page }) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
});

test.describe('Visual regression — kritik sayfalar', () => {
  test('anasayfa (anonim)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('anasayfa-anonim.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('üniteler sayfası', async ({ page }) => {
    await page.goto('/#/uniteler');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('uniteler.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('giriş sayfası', async ({ page }) => {
    await page.goto('/#/giris');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('giris.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('premium sayfası', async ({ page }) => {
    await page.goto('/#/premium');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot('premium.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    });
  });
});
