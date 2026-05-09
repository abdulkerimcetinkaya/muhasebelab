/**
 * Smoke testleri — anonim ziyaretçi akışları.
 *
 * Hedef: kritik public sayfaların yüklendiğini doğrulamak. Selector'lar
 * gerçek render edilmiş HTML'e göre seçildi (placeholder, text, role).
 */
import { expect, test } from '@playwright/test';
import { git } from './helpers/wait-for-app';

test.describe('Anonim ziyaretçi akışları', () => {
  test('anasayfa yüklenir, hero ve CTA görünür', async ({ page }) => {
    await git(page, '/');

    // Hero başlığı: italic serif h1 — ya "Kayıt tutmayı" ya da "uzman gibi"
    // SlideInWords nedeniyle text fragmente bölündü, locator.first ile yakala
    await expect(page.getByText(/Kayıt tutmayı/).first()).toBeVisible({ timeout: 10_000 });

    // Anonim hero CTA
    await expect(page.getByRole('button', { name: /Soruları aç/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Hesap oluştur/i })).toBeVisible();
  });

  test('navbar linkleri çalışır (desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile menu farklı pattern — ayrı test gerekli');
    await git(page, '/');

    // Üniteler
    await page.getByRole('button', { name: 'Üniteler', exact: true }).click();
    await expect(page).toHaveURL(/\/uniteler/);

    // Problemler
    await page.getByRole('button', { name: 'Problemler', exact: true }).click();
    await expect(page).toHaveURL(/\/problemler/);

    // Liderlik
    await page.getByRole('button', { name: 'Liderlik', exact: true }).click();
    await expect(page).toHaveURL(/\/liderlik/);
  });

  test('üniteler sayfası: en az 1 ünite kartı görünür', async ({ page }) => {
    await git(page, '/#/uniteler');
    const kartlar = page.locator('.mufredat-satir');
    await expect(kartlar.first()).toBeVisible({ timeout: 10_000 });
    expect(await kartlar.count()).toBeGreaterThan(0);
  });

  test('problemler sayfası açılır', async ({ page }) => {
    await git(page, '/#/problemler');
    // Tablo, liste veya empty state — herhangi bir <main> içerik yeterli
    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Problem|Soru|Henüz/i).first()).toBeVisible();
  });

  test('giriş sayfası: form alanları placeholder ile bulunur', async ({ page }) => {
    await git(page, '/#/giris');

    // Labels htmlFor yok — placeholder ile selector
    await expect(page.getByPlaceholder('ornek@email.com')).toBeVisible({ timeout: 10_000 });
    // Şifre input: type=password (placeholder yok, type ile)
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    // Submit butonu (Giriş Yap veya Hesap Oluştur)
    await expect(
      page.getByRole('button', { name: /Giriş Yap|Hesap Oluştur/i }).first(),
    ).toBeVisible();
  });

  test('premium sayfası: pricing kartları görünür', async ({ page }) => {
    await git(page, '/#/premium');
    await expect(page.getByText(/Premium|Bireysel|Kurum/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('hesap planı modal: navbar ikonu açar (desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile menu içinde, ayrı test pattern');
    await git(page, '/');
    // Hesap Planı butonu sadece lg ekranda visible
    const buton = page.getByTitle('Hesap Planı').first();
    if (await buton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await buton.click();
      // Modal açıldı — full-screen overlay veya yan panel
      await expect(page.getByText(/Hesap Planı/i).first()).toBeVisible({ timeout: 5_000 });
    } else {
      test.skip(true, 'Hesap Planı butonu lg breakpoint altında — viewport küçük');
    }
  });

  test('tema toggle: light/dark değişir', async ({ page }) => {
    await git(page, '/');
    const html = page.locator('html');
    const baslangic = (await html.getAttribute('class')) || '';

    await page.getByTitle(/Karanlık tema|Açık tema/i).first().click();
    // class değişti
    await expect.poll(async () => (await html.getAttribute('class')) || '', { timeout: 3_000 }).not.toBe(baslangic);
  });
});
