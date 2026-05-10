import { Page, expect } from '@playwright/test';
import { git } from './wait-for-app';

/**
 * TEST_USER ile login yap. Test başında çağrılır.
 * Env yoksa otomatik skip için kullanan testte kontrol edilmeli.
 */
export async function girisYap(page: Page, email: string, sifre: string) {
  await git(page, '/#/giris');
  await page.getByPlaceholder('ornek@email.com').fill(email);
  await page.locator('input[type="password"]').first().fill(sifre);
  await page.locator('button[type="submit"]').click();

  // /giris'ten ayrılmasını bekle (anasayfa veya onboarding)
  await expect(page).not.toHaveURL(/\/giris/, { timeout: 15_000 });
}
