/**
 * Üniteler → Ünite detay → Konu navigation akışı.
 *
 * Akış: /uniteler → ünite kartı → konu sayfası → soru sayfasına geçiş
 * butonu görünür. Soru çözümü auth gerektirdiği için orada durur.
 */
import { expect, test } from '@playwright/test';

test.describe('Üniteler → Ünite → Konu navigation', () => {
  test('ilk ünite kartına tıklanır → ünite sayfası açılır', async ({ page }) => {
    await page.goto('/#/uniteler');

    const ilkKart = page.locator('.mufredat-satir').first();
    await expect(ilkKart).toBeVisible();
    await ilkKart.click();

    // /uniteler/<id> URL pattern
    await expect(page).toHaveURL(/\/uniteler\/[^/]+/);
  });

  test('ünite sayfasında konu kartları görünür VEYA otomatik konu redirect olur', async ({
    page,
  }) => {
    await page.goto('/#/uniteler');
    await page.locator('.mufredat-satir').first().click();

    // Akıllı yönlendirme yapıyorsa /uniteler/x/y URL'ine geçer
    // Yoksa overview ekranı gösterir
    await page.waitForURL(/\/uniteler\/[^/]+/);

    // Sayfa içeriği yüklendi
    const baslik = page.getByRole('heading', { level: 1 });
    await expect(baslik).toBeVisible({ timeout: 5_000 });
  });

  test('konu sayfası (KonuSayfasi): banner + içerik + ilgili sorular', async ({ page }) => {
    await page.goto('/#/uniteler');
    await page.locator('.mufredat-satir').first().click();
    await page.waitForLoadState('networkidle');

    // Eğer overview yerine doğrudan bir konu sayfasına atladıysa
    if (/\/uniteler\/[^/]+\/[^/]+/.test(page.url())) {
      // KonuSayfasi banner: parlak mavi
      const banner = page.locator('.bg-brand-deep, [class*="bg-brand"]').first();
      await expect(banner).toBeVisible();

      // CTA: Soruları Çöz / Devam Et
      const cta = page.getByRole('button', { name: /Soruları Çöz|Devam Et|Bu Konu Tamamlandı/i });
      await expect(cta.first()).toBeVisible();
    }
  });

  test('breadcrumb navigation: konu → ünite → üniteler', async ({ page }) => {
    await page.goto('/#/uniteler');
    await page.locator('.mufredat-satir').first().click();
    await page.waitForLoadState('networkidle');

    // Konu sayfasındaysak breadcrumb test edilebilir
    if (/\/uniteler\/[^/]+\/[^/]+/.test(page.url())) {
      const breadcrumbUniteler = page.getByRole('button', { name: 'Üniteler', exact: true }).first();
      await breadcrumbUniteler.click();
      await expect(page).toHaveURL(/\/uniteler\/?$/);
    }
  });
});
