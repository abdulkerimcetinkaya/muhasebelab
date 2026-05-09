import { Page, expect } from '@playwright/test';

/**
 * App'in initial load tamamlanmasını bekler.
 *
 * Sebep: AnaSayfa "İçerik yükleniyor…" splash gösterir, Supabase'den
 * üniteler yüklendikten sonra navbar + asıl içerik render olur. Tests
 * bu state'i beklemezse selector'lar 30s timeout yer.
 *
 * Strateji: header (navbar) görünene kadar bekle.
 */
export async function git(page: Page, yol: string) {
  await page.goto(yol, { waitUntil: 'domcontentloaded' });
  // Navbar yüklendi = app hazır
  await expect(page.locator('header').first()).toBeVisible({ timeout: 15_000 });
}
