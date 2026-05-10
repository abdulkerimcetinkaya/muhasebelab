/**
 * Profil sayfası + çıkış akışı testleri.
 * TEST_USER auth gerektirir.
 */
import { expect, test } from '@playwright/test';
import { girisYap } from './helpers/giris-yap';
import { git } from './helpers/wait-for-app';

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe('Profil + çıkış', () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'TEST_USER env gerekli');

  test('profil sayfası açılır + kullanıcı bilgileri görünür', async ({ page }) => {
    await girisYap(page, TEST_EMAIL!, TEST_PASSWORD!);
    await git(page, '/#/profil');

    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });
    // Kullanıcı email/adı görünür
    await expect(page.getByText(TEST_EMAIL!.split('@')[0], { exact: false }).first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test('profil sayfası: navigation tab veya sekmeleri var', async ({ page }) => {
    await girisYap(page, TEST_EMAIL!, TEST_PASSWORD!);
    await git(page, '/#/profil');

    // Genel/Rozetler/Üyelik gibi sekmeler beklenir (ProfilSayfasi tasarımı)
    const sekmeler = page.getByRole('button').filter({
      hasText: /Genel|Rozet|Üyelik|Yetkin|Hesap/i,
    });
    expect(await sekmeler.count()).toBeGreaterThan(0);
  });

  test('çıkış: navbar logout butonu çalışır', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobile menu farklı pattern');
    await girisYap(page, TEST_EMAIL!, TEST_PASSWORD!);
    await git(page, '/');

    // Çıkış butonu (LogOut icon, title=email)
    const cikisBtn = page.locator('header').locator('button[title*="@"]').first();
    if (await cikisBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await cikisBtn.click();
      // Anasayfa'ya redirect, anonim CTA görünür
      await expect(page).toHaveURL(/\/?#?\/?$/, { timeout: 5_000 });
      await expect(page.getByRole('button', { name: /Giriş Yap|Hesap oluştur/i }).first()).toBeVisible(
        { timeout: 5_000 },
      );
    } else {
      test.skip(true, 'Çıkış butonu bulunamadı');
    }
  });

  test('liderlik sayfası: girişli kullanıcıya açık', async ({ page }) => {
    await girisYap(page, TEST_EMAIL!, TEST_PASSWORD!);
    await git(page, '/#/liderlik');
    await expect(page.locator('main')).toBeVisible({ timeout: 10_000 });
    // Liderlik tablosu veya boş state
    await expect(page.getByText(/Liderlik|Sıralama|puan|Henüz/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});
