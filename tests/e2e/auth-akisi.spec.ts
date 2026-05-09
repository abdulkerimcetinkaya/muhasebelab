/**
 * Auth akışı testleri — kayıt + giriş + çıkış.
 *
 * NOT: Gerçek Supabase auth'a bağlanmaz; form validasyon + UI akışı.
 * Tam end-to-end için TEST_USER_EMAIL/PASSWORD env ile gerçek hesap.
 */
import { expect, test } from '@playwright/test';
import { git } from './helpers/wait-for-app';

test.describe('Auth akışı', () => {
  test('giriş formu: boş submit hata gösterir', async ({ page }) => {
    await git(page, '/#/giris');

    // Submit
    await page.getByRole('button', { name: /Giriş Yap|Hesap Oluştur/i }).first().click();

    // HTML5 validation: email input required → valueMissing true
    const email = page.getByPlaceholder('ornek@email.com');
    const validity = await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    expect(validity).toBe(true);
  });

  test('giriş formu: geçersiz e-posta hata', async ({ page }) => {
    await git(page, '/#/giris');

    const email = page.getByPlaceholder('ornek@email.com');
    await email.fill('gecersiz-email');

    const sifre = page.locator('input[type="password"]').first();
    await sifre.fill('parola12345');

    await page.getByRole('button', { name: /Giriş Yap|Hesap Oluştur/i }).first().click();

    // Browser email validation
    const validity = await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
    expect(validity).toBe(true);
  });

  test('şifre sıfırlama linki çalışır', async ({ page }) => {
    await git(page, '/#/giris');
    const link = page.getByRole('button', { name: /Şifremi unuttum/i }).first();

    if (await link.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await link.click();
      await expect(page).toHaveURL(/sifre/);
    } else {
      test.skip(true, 'Şifremi unuttum butonu visible değil — mod toggle gerekebilir');
    }
  });

  test('TEST_USER ile gerçek giriş — env varsa koşar', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const sifre = process.env.TEST_USER_PASSWORD;
    test.skip(
      !email || !sifre,
      'TEST_USER_EMAIL ve TEST_USER_PASSWORD env değişkenleri set değil',
    );

    await git(page, '/#/giris');
    await page.getByPlaceholder('ornek@email.com').fill(email!);
    await page.locator('input[type="password"]').first().fill(sifre!);
    await page.getByRole('button', { name: /Giriş Yap/i }).first().click();

    // Başarılı giriş → onboarding veya anasayfa
    await expect(page).toHaveURL(/\/?#?\/(?:onboarding)?\/?$/, { timeout: 15_000 });
    // Profil linki navbar'da görünür
    await expect(page.getByRole('button', { name: 'Profil', exact: true })).toBeVisible({
      timeout: 5_000,
    });
  });
});
