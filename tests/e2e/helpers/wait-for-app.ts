import { Page, expect } from '@playwright/test';

/**
 * App'in initial load tamamlanmasını bekler.
 *
 * Sebep: AnaSayfa "İçerik yükleniyor…" splash gösterir, Supabase'den
 * üniteler yüklendikten sonra navbar + asıl içerik render olur. Tests
 * bu state'i beklemezse selector'lar 30s timeout yer.
 *
 * Strateji: navbar'daki "MuhasebeLab" logosu görünene kadar bekle (her
 * sayfada var, hidrasyon tamamlandığında render olur).
 */
export async function appHazirOlsun(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Logo görünene kadar bekle (~max 15s) — splash sona erince navbar gelir
  await expect(page.getByRole('button', { name: /MuhasebeLab|Anasayfa/i }).first()).toBeVisible({
    timeout: 15_000,
  });
}

/**
 * Belirtilen yola git ve app'in render olmasını bekle.
 */
export async function git(page: Page, yol: string) {
  await page.goto(yol, { waitUntil: 'domcontentloaded' });
  // Navbar'ın yüklenmesi = app hazır
  await expect(page.locator('header').first()).toBeVisible({ timeout: 15_000 });
}
