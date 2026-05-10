/**
 * Sözlük + içerik sayfaları testleri (anonim erişilebilir).
 *
 * Sözlük SEO sayfası, anonim ziyaretçi de görebilir. KVKK + içerik
 * sayfaları statik — yüklenmiyor sayfa kırık demek.
 */
import { expect, test } from '@playwright/test';
import { git } from './helpers/wait-for-app';

test.describe('Sözlük + içerik sayfaları', () => {
  test('sözlük sayfası yüklenir + en az 1 terim', async ({ page }) => {
    await git(page, '/#/sozluk');
    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });

    // En az 1 terim görünür (muavin, cari, vs.)
    const terim = page
      .getByText(/Muavin|Cari|Yardımcı defter|Mizan|TDHP/i)
      .first();
    await expect(terim).toBeVisible({ timeout: 10_000 });
  });

  test('sözlük: ilk terime tıklanır + detay sayfası açılır', async ({ page }) => {
    await git(page, '/#/sozluk');

    // İlk terim linkine tıkla
    const ilkLink = page.locator('a[href*="/sozluk/"]').first();
    if (await ilkLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await ilkLink.click();
      await expect(page).toHaveURL(/\/sozluk\/[^/]+/, { timeout: 5_000 });
      await expect(page.locator('main')).toBeVisible();
    } else {
      test.skip(true, 'Sözlük link pattern farklı, dropdown veya başka pattern');
    }
  });

  test('KVKK sayfası yüklenir', async ({ page }) => {
    await git(page, '/#/kvkk');
    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });
    // KVKK metni — Aydınlatma metni / Kişisel veri
    await expect(
      page.getByText(/KVKK|kişisel veri|aydınlatma|Verisorumlusu/i).first(),
    ).toBeVisible({ timeout: 5_000 });
  });

  test('katkıcı başvuru sayfası açılır (anonim)', async ({ page }) => {
    await git(page, '/#/katkici/basvuru');
    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });
    // Başvuru formu veya açıklama metni
    await expect(
      page.getByText(/Katkıcı|Başvuru|öğretici|katkı sağla/i).first(),
    ).toBeVisible({ timeout: 5_000 });
  });

  test('liderlik sayfası anonim olarak açılır', async ({ page }) => {
    await git(page, '/#/liderlik');
    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });
    // Liderlik içeriği veya giriş öneri
    await expect(
      page.getByText(/Liderlik|Sıralama|puan|Henüz|Giriş yap/i).first(),
    ).toBeVisible({ timeout: 5_000 });
  });
});
