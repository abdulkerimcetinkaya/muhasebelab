import { Page, expect } from '@playwright/test';
import { git } from './wait-for-app';

/**
 * TEST_USER ile login yap. Test başında çağrılır.
 *
 * Login sonrası DB'den ilerleme yüklenir + localStorage'a yazılır
 * (asenkron). Diğer sayfalara navigate etmeden önce bu sync'in
 * bitmesini bekleriz; aksi halde OnboardingGuard yeni page.goto'da
 * eski state'le tetiklenip /onboarding'e zorla atar.
 */
export async function girisYap(page: Page, email: string, sifre: string) {
  await git(page, '/#/giris');
  await page.getByPlaceholder('ornek@email.com').fill(email);
  await page.locator('input[type="password"]').first().fill(sifre);
  await page.locator('button[type="submit"]').click();

  // /giris'ten ayrılmasını bekle (anasayfa veya onboarding)
  await expect(page).not.toHaveURL(/\/giris/, { timeout: 15_000 });

  // localStorage'da onboardingTamam=true görünene kadar bekle.
  // STORAGE_KEY: mli_progress_v3 (src/data/sabitler.ts)
  await expect
    .poll(
      async () => {
        const raw = await page.evaluate(() => localStorage.getItem('mli_progress_v3'));
        if (!raw) return false;
        try {
          const ilerleme = JSON.parse(raw);
          return ilerleme.onboardingTamam === true;
        } catch {
          return false;
        }
      },
      { timeout: 15_000, message: 'DB sync bekleniyor (onboardingTamam=true)' },
    )
    .toBe(true);
}
