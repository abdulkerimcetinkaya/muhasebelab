/**
 * Smoke testleri — anonim ziyaretçi akışları.
 *
 * Selector stratejisi:
 * - Navbar testleri: page.locator('header') ile scope (Footer'da da
 *   aynı linkler var, strict mode violation)
 * - Hero CTA: AnaSayfa hem OpenBookHero (üst) hem alt CTA section'da
 *   benzer butonlara sahip → first() veya text-spesifik kullan
 * - Form labels htmlFor yok → placeholder veya input[type] ile selector
 */
import { expect, test } from '@playwright/test';
import { git } from './helpers/wait-for-app';

test.describe('Anonim ziyaretçi akışları', () => {
  test('anasayfa yüklenir, hero ve CTA görünür', async ({ page }) => {
    await git(page, '/');

    // Hero h1 italic serif: "Kayıt tutmayı / bir uzman gibi öğren"
    // SlideInWords her kelimeyi AYRI <span>'a koyduğu için "Kayıt tutmayı"
    // tek text node değil — tek kelime ile match.
    await expect(page.getByText('Kayıt', { exact: false }).first()).toBeVisible({
      timeout: 10_000,
    });

    // Hero CTA: "Soruları aç" (OpenBookHero)
    await expect(page.getByRole('button', { name: 'Soruları aç' })).toBeVisible();
    // Hero alt CTA "Hesap oluştur" (küçük o)
    await expect(page.getByRole('button', { name: /Hesap oluştur/i }).first()).toBeVisible();
  });

  test('navbar linkleri çalışır (desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile menu farklı pattern');
    await git(page, '/');

    // Header'a scope — Footer'daki aynı isimli butonlardan ayır
    const navbar = page.locator('header').first();

    await navbar.getByRole('button', { name: 'Üniteler', exact: true }).click();
    await expect(page).toHaveURL(/\/uniteler/);

    await navbar.getByRole('button', { name: 'Problemler', exact: true }).click();
    await expect(page).toHaveURL(/\/problemler/);

    await navbar.getByRole('button', { name: 'Liderlik', exact: true }).click();
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
    // Tablo, liste veya empty state
    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });
    // İçerikten herhangi bir markeri yakala
    await expect(page.getByText(/Problem|Soru|Çözüm|Henüz/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('giriş sayfası: form alanları placeholder ile bulunur', async ({ page }) => {
    await git(page, '/#/giris');

    // E-posta input — placeholder ile (label htmlFor yok)
    await expect(page.getByPlaceholder('ornek@email.com')).toBeVisible({ timeout: 10_000 });
    // Şifre input — type=password
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    // Submit
    await expect(
      page.getByRole('button', { name: /Giriş Yap|Hesap Oluştur/i }).first(),
    ).toBeVisible();
  });

  test('premium sayfası: pricing kartları görünür', async ({ page }) => {
    await git(page, '/#/premium');
    await expect(page.getByText(/Bireysel|Kurum|Premium/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('hesap planı: navbar ikonu açar (desktop, lg+ ekran)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile için ayrı test');
    await git(page, '/');

    const buton = page.locator('header').getByTitle('Hesap Planı').first();
    if (await buton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await buton.click();
      // Açılan panel'de "Tek Düzen Hesap Planı" başlığı görünür
      await expect(page.getByText('Tek Düzen Hesap Planı').first()).toBeVisible({
        timeout: 5_000,
      });
    } else {
      test.skip(true, 'Hesap Planı butonu bu viewport boyutunda gizli');
    }
  });

  test('tema toggle: light/dark değişir', async ({ page }) => {
    await git(page, '/');

    // Class document.body üzerinde toggle ediliyor (App.tsx:160)
    const body = page.locator('body');
    const baslangicDark = (await body.getAttribute('class'))?.includes('dark') ?? false;

    await page.locator('header').getByTitle(/Karanlık tema|Açık tema/).first().click();

    // 'dark' class'ı toggle olmalı
    await expect
      .poll(async () => (await body.getAttribute('class'))?.includes('dark') ?? false, {
        timeout: 3_000,
      })
      .toBe(!baslangicDark);
  });
});
