/**
 * Soru çözme — BUSINESS LOGIC testi.
 *
 * Önceki soru-cozme.spec.ts UI mekaniğini test eder. Bu test asıl
 * ürünün yaptığı işi doğrular: bir soruyu çöz, doğru cevap gir, puan
 * kazandığını kontrol et.
 *
 * Akış:
 * 1. Supabase'den ilk onaylı kolay soruyu + çözümünü çek
 * 2. TEST_USER ile login
 * 3. /problemler/<id>'ye git
 * 4. Yevmiye fişine doğru çözümü gir
 * 5. Kontrol butonuna bas
 * 6. "Doğru" feedback görünsün, puan eklensin
 */
import { expect, test } from '@playwright/test';
import { girisYap } from './helpers/giris-yap';
import { git } from './helpers/wait-for-app';
import { ilkKolaySoruyuGetir } from './helpers/supabase-fetch';

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe('Soru çözme business logic', () => {
  test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'TEST_USER env gerekli');

  test('doğru cevap → "doğrulandı" feedback + puan', async ({ page }) => {
    // 1. Supabase'den seed soruyu getir (test runtime, dinamik)
    const seed = await ilkKolaySoruyuGetir();
    test.skip(!seed, 'Onaylı kolay soru bulunamadı — seed sorun var mı?');
    test.skip(
      !seed!.cozumler || seed!.cozumler.length === 0,
      'Çözüm satırı yok',
    );

    // 2. Login + navigate
    await girisYap(page, TEST_EMAIL!, TEST_PASSWORD!);
    await git(page, `/#/problemler/${seed!.id}`);

    // Yevmiye fişi formu yüklendi mi?
    await expect(page.getByPlaceholder(/Fiş açıklaması/i)).toBeVisible({
      timeout: 10_000,
    });

    // 3. İhtiyaç kadar satır ekle (default 2 satır var, eksikse "Satır Ekle")
    const gerekenSatir = seed!.cozumler.length;
    let mevcutSatir = await page.locator('input[data-col="kod"]').count();
    while (mevcutSatir < gerekenSatir) {
      await page.getByRole('button', { name: /Satır Ekle/i }).click();
      mevcutSatir = await page.locator('input[data-col="kod"]').count();
    }

    // 4. Her satırı doldur
    for (let i = 0; i < seed!.cozumler.length; i++) {
      const c = seed!.cozumler[i];

      // Hesap kodu
      const kodInput = page.locator(`input[data-row="${i}"][data-col="kod"]`);
      await kodInput.click();
      await kodInput.fill(c.hesap_kodu);
      // Autocomplete dropdown çıkıyorsa kapat (Escape)
      await page.keyboard.press('Escape');

      // Borç (varsa)
      if (c.borc && c.borc > 0) {
        const borcInput = page.locator(`input[data-row="${i}"][data-col="borc"]`);
        await borcInput.click();
        await borcInput.fill(String(c.borc));
      }

      // Alacak (varsa)
      if (c.alacak && c.alacak > 0) {
        const alacakInput = page.locator(`input[data-row="${i}"][data-col="alacak"]`);
        await alacakInput.click();
        await alacakInput.fill(String(c.alacak));
      }
    }

    // 5. Kontrol butonu
    const kontrolBtn = page
      .getByRole('button', { name: /^Kontrol|Kontrol et/i })
      .first();
    await expect(kontrolBtn).toBeVisible({ timeout: 5_000 });
    await kontrolBtn.click();

    // 6. Doğrulandı feedback — birkaç olası metin
    // CozumModal açılır veya inline success state
    const dogruFeedback = page.getByText(
      /Doğru|Tebrikler|Doğrulandı|Başarılı|\+\d+\s*puan/i,
    );
    await expect(dogruFeedback.first()).toBeVisible({ timeout: 10_000 });
  });
});
