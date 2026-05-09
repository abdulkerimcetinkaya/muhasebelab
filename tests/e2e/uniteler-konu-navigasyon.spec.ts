/**
 * Üniteler → Ünite → Konu navigation akışı.
 */
import { expect, test } from '@playwright/test';
import { git } from './helpers/wait-for-app';

test.describe('Üniteler → Ünite → Konu navigation', () => {
  test('ilk ünite kartına tıklanır → ünite sayfası açılır', async ({ page }) => {
    await git(page, '/#/uniteler');
    const ilkKart = page.locator('.mufredat-satir').first();
    await expect(ilkKart).toBeVisible({ timeout: 10_000 });
    await ilkKart.click();
    await expect(page).toHaveURL(/\/uniteler\/[^/]+/);
  });

  test('ünite sayfasında içerik render olur', async ({ page }) => {
    await git(page, '/#/uniteler');
    await page.locator('.mufredat-satir').first().click();
    await page.waitForURL(/\/uniteler\/[^/]+/);
    // h1 veya h2 — sayfa içeriği render oldu
    await expect(page.locator('main h1, main h2').first()).toBeVisible({ timeout: 10_000 });
  });

  test('konu sayfası açılırsa: CTA butonu görünür', async ({ page }) => {
    await git(page, '/#/uniteler');
    await page.locator('.mufredat-satir').first().click();
    await page.waitForLoadState('networkidle');

    if (/\/uniteler\/[^/]+\/[^/]+/.test(page.url())) {
      await expect(
        page.getByRole('button', { name: /Soruları Çöz|Devam Et|Bu Konu Tamamlandı/i }).first(),
      ).toBeVisible({ timeout: 5_000 });
    } else {
      test.skip(true, 'Smart redirect olmadı (kullanıcı ilerleme yok)');
    }
  });
});
