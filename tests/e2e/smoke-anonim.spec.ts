/**
 * Smoke testleri — anonim ziyaretçi akışları.
 *
 * Hedef: kritik public sayfaların yüklendiğini ve temel navigation'ın
 * çalıştığını doğrulamak. Auth gerektirmez.
 */
import { expect, test } from '@playwright/test';

test.describe('Anonim ziyaretçi akışları', () => {
  test('anasayfa yüklenir, hero ve CTA görünür', async ({ page }) => {
    await page.goto('/');

    // Hero başlığı (italic serif)
    await expect(page.getByRole('heading', { name: /Kayıt tutmayı/i })).toBeVisible();

    // Anonim kullanıcıya özel CTA
    await expect(page.getByRole('button', { name: /Soruları aç|Önce Soruları Gör/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Hesap Oluştur|Giriş Yap/i })).toBeVisible();
  });

  test('navbar linkleri çalışır', async ({ page }) => {
    await page.goto('/');

    // Üniteler
    await page.getByRole('button', { name: 'Üniteler', exact: true }).click();
    await expect(page).toHaveURL(/\/uniteler/);
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();

    // Problemler
    await page.getByRole('button', { name: 'Problemler', exact: true }).click();
    await expect(page).toHaveURL(/\/problemler/);

    // Liderlik
    await page.getByRole('button', { name: 'Liderlik', exact: true }).click();
    await expect(page).toHaveURL(/\/liderlik/);

    // Geri anasayfa
    await page.getByRole('button', { name: 'Anasayfa', exact: true }).click();
    await expect(page).toHaveURL(/\/?#?\/?$/);
  });

  test('üniteler sayfası: en az 1 ünite kartı görünür', async ({ page }) => {
    await page.goto('/#/uniteler');

    // mufredat-satir kartlarından en az biri
    const kartlar = page.locator('.mufredat-satir');
    await expect(kartlar.first()).toBeVisible();
    expect(await kartlar.count()).toBeGreaterThan(0);
  });

  test('problemler sayfası: tablo yüklenir', async ({ page }) => {
    await page.goto('/#/problemler');

    // Tablo başlık satırı veya boş state
    const tablo = page.locator('table, [role="table"]');
    const bosState = page.getByText(/Henüz soru/i);
    await expect(tablo.or(bosState).first()).toBeVisible();
  });

  test('giriş sayfası açılır + zorunlu alanlar var', async ({ page }) => {
    await page.goto('/#/giris');

    await expect(page.getByLabel(/E-posta|Email/i).first()).toBeVisible();
    await expect(page.getByLabel(/Şifre|Parola|Password/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Giriş|Sign in/i }).first()).toBeVisible();
  });

  test('premium sayfası: pricing kartları görünür', async ({ page }) => {
    await page.goto('/#/premium');

    // En az 1 plan kartı (chatGPT-style)
    await expect(page.getByText(/Bireysel|Kurum|Premium/i).first()).toBeVisible();
  });

  test('hesap planı modal: navbar ikonu açar', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile menu farklı pattern — ayrı test');

    await page.goto('/');
    await page.getByTitle(/Hesap Planı/i).first().click();

    // Modal aç (overlay)
    await expect(page.getByRole('dialog').or(page.locator('[role="dialog"]'))).toBeVisible();
  });

  test('tema toggle: light/dark değişir', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const baslangicTema = await html.getAttribute('class');

    // Tema butonuna tıkla (Sun/Moon ikonu)
    await page.getByTitle(/Karanlık tema|Açık tema/i).first().click();

    // class'ın değişmesini bekle
    await expect(html).not.toHaveAttribute('class', baslangicTema || '');
  });
});
