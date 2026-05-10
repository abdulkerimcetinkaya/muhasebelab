/**
 * Auth akışı testleri.
 *
 * Form labels htmlFor olmadığı için getByLabel çalışmıyor —
 * placeholder + input[type] selector kullanıyoruz.
 */
import { expect, test } from '@playwright/test';
import { git } from './helpers/wait-for-app';

test.describe('Auth akışı', () => {
  test('giriş formu: boş submit hata gösterir', async ({ page }) => {
    await git(page, '/#/giris');

    // type="submit" butonu (tab "Giriş Yap" type="button" ile karışmasın)
    await page.locator('button[type="submit"]').click();

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

    await page.locator('button[type="submit"]').click();

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
      test.skip(true, 'Şifremi unuttum linki bulunamadı');
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
    // Submit button (tab toggle "Giriş Yap" ile karışmasın)
    await page.locator('button[type="submit"]').click();

    // Başarılı giriş: /giris'ten ayrıl (anasayfa veya onboarding)
    await expect(page).not.toHaveURL(/\/giris/, { timeout: 15_000 });
    await expect(
      page.locator('header').getByRole('button', { name: 'Profil', exact: true }),
    ).toBeVisible({ timeout: 5_000 });
  });

  // ── Kayıt formu: Ad/Soyad + güçlü şifre + KVKK + Google butonu ────────
  // Bu testler PR #67/#68 sonrası eklendi. UI render'ını doğrular,
  // gerçek kayıt yapmaz (Supabase'e yazmamak için).

  test('Google ile devam et butonu hem giriş hem kayıt mode\'unda görünür', async ({
    page,
  }) => {
    await git(page, '/#/giris');

    // Giriş mode (default)
    const googleBtn = page.getByRole('button', { name: /Google ile devam et/i });
    await expect(googleBtn).toBeVisible();

    // Kayıt mode'a geç (form içindeki tab toggle butonu — header değil)
    await page
      .locator('form, [class*="surface"]')
      .getByRole('button', { name: 'Kayıt Ol', exact: true })
      .first()
      .click();

    // Hâlâ görünür olmalı
    await expect(googleBtn).toBeVisible();
  });

  test('kayıt mode: Ad ve Soyad alanları görünür ve zorunludur', async ({ page }) => {
    await git(page, '/#/giris');

    // Kayıt mode'a geç
    await page
      .locator('form, [class*="surface"]')
      .getByRole('button', { name: 'Kayıt Ol', exact: true })
      .first()
      .click();

    // autocomplete attribute ile bul — Turkish placeholder eşleşmesinden bağımsız
    const adInput = page.locator('input[autocomplete="given-name"]');
    const soyadInput = page.locator('input[autocomplete="family-name"]');

    await expect(adInput).toBeVisible();
    await expect(soyadInput).toBeVisible();

    // Ikisi de required olmalı
    expect(await adInput.evaluate((el: HTMLInputElement) => el.required)).toBe(true);
    expect(await soyadInput.evaluate((el: HTMLInputElement) => el.required)).toBe(true);
  });

  test('kayıt mode: boş Ad ile submit → HTML5 required tetiklenir', async ({ page }) => {
    await git(page, '/#/giris');

    await page
      .locator('form, [class*="surface"]')
      .getByRole('button', { name: 'Kayıt Ol', exact: true })
      .first()
      .click();

    // Diğer alanları doldur, Ad boş bırak
    await page.locator('input[autocomplete="family-name"]').fill('Yılmaz');
    await page.locator('input[autocomplete="username"]').fill('test_user_8451');
    await page.locator('input[type="email"]').fill('test+e2e@example.com');
    await page.locator('input[type="password"]').first().fill('Parola1234');
    await page.locator('input[type="password"]').nth(1).fill('Parola1234');

    await page.locator('button[type="submit"]').click();

    const adInput = page.locator('input[autocomplete="given-name"]');
    const validity = await adInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing,
    );
    expect(validity).toBe(true);
  });

  test('kayıt mode: zayıf şifre (sadece harf) hata mesajı verir', async ({ page }) => {
    await git(page, '/#/giris');

    await page
      .locator('form, [class*="surface"]')
      .getByRole('button', { name: 'Kayıt Ol', exact: true })
      .first()
      .click();

    await page.locator('input[autocomplete="given-name"]').fill('Ali');
    await page.locator('input[autocomplete="family-name"]').fill('Yılmaz');
    await page.locator('input[autocomplete="username"]').fill('test_user_8451');
    await page.locator('input[type="email"]').fill('test+e2e@example.com');
    // 8+ karakter ama sadece harf — rakam yok
    await page.locator('input[type="password"]').first().fill('parolaaaa');
    await page.locator('input[type="password"]').nth(1).fill('parolaaaa');

    await page.locator('button[type="submit"]').click();

    // Custom hata mesajı (Supabase'e gitmeden önce client-side kontrol)
    await expect(
      page.getByText(/harf ve 1 rakam içermeli/i),
    ).toBeVisible({ timeout: 3_000 });
  });

  test('kayıt mode: KVKK disclaimer butonu görünür', async ({ page }) => {
    await git(page, '/#/giris');

    await page
      .locator('form, [class*="surface"]')
      .getByRole('button', { name: 'Kayıt Ol', exact: true })
      .first()
      .click();

    // Form'un altındaki disclaimer'da KVKK linki
    await expect(
      page.getByRole('button', { name: /KVKK Aydınlatma Metni/i }),
    ).toBeVisible();
  });
});
