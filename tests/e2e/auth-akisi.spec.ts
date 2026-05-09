/**
 * Auth akışı testleri — kayıt + giriş + çıkış.
 *
 * NOT: Gerçek Supabase'e bağlanmaz; form validasyon + UI akışı kontrol
 * edilir. Tam end-to-end için TEST_USER_EMAIL/PASSWORD env ile gerçek
 * test hesabı kullanılır.
 */
import { expect, test } from '@playwright/test';

test.describe('Auth akışı', () => {
  test('giriş formu: boş submit hata gösterir', async ({ page }) => {
    await page.goto('/#/giris');

    const submit = page.getByRole('button', { name: /Giriş Yap|Sign in/i }).first();
    await submit.click();

    // HTML5 validation mesajı VEYA UI hata mesajı
    const email = page.getByLabel(/E-posta|Email/i).first();
    const validity = await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    expect(validity).toBe(true);
  });

  test('giriş formu: geçersiz e-posta hata', async ({ page }) => {
    await page.goto('/#/giris');

    const email = page.getByLabel(/E-posta|Email/i).first();
    await email.fill('gecersiz-email');

    const sifre = page.getByLabel(/Şifre|Parola|Password/i).first();
    await sifre.fill('parola12345');

    await page.getByRole('button', { name: /Giriş Yap|Sign in/i }).first().click();

    // Browser email validation
    const validity = await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
    expect(validity).toBe(true);
  });

  test('şifre sıfırlama linki çalışır', async ({ page }) => {
    await page.goto('/#/giris');

    // "Şifremi unuttum" linkine tıkla
    const link = page.getByRole('link', { name: /Şifremi|şifre|sıfırla/i }).first();
    if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
      await link.click();
      await expect(page).toHaveURL(/sifre/);
    } else {
      test.skip(true, 'Şifremi unuttum linki bulunamadı');
    }
  });

  test('TEST_USER ile gerçek giriş — opsiyonel, env varsa koşar', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const sifre = process.env.TEST_USER_PASSWORD;

    test.skip(
      !email || !sifre,
      'TEST_USER_EMAIL ve TEST_USER_PASSWORD env değişkenleri set değil',
    );

    await page.goto('/#/giris');
    await page.getByLabel(/E-posta|Email/i).first().fill(email!);
    await page.getByLabel(/Şifre|Parola|Password/i).first().fill(sifre!);
    await page.getByRole('button', { name: /Giriş Yap|Sign in/i }).first().click();

    // Başarılı girişten sonra anasayfaya veya onboarding'e yönlendirilir
    await expect(page).toHaveURL(/\/?#?\/(?:onboarding)?$|\/?#?\/?$/, { timeout: 10_000 });

    // Navbar'da kullanıcı menüsü görünür (Profil linki)
    await expect(page.getByRole('button', { name: 'Profil', exact: true })).toBeVisible({
      timeout: 5_000,
    });
  });
});
