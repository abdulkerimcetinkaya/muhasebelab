-- MuhasebeLab — Tüm seed soruları ve üniteleri temizler (sıfırdan başlama).
--
-- Kapsam:
--   * sorular tablosu (213 satır) → silinir
--     ↳ cozumler        : on delete cascade → otomatik temizlenir
--     ↳ aktivite        : on delete cascade → kullanıcı çözüm geçmişi temizlenir
--     ↳ soru_hatalari   : on delete cascade → açık hata bildirimleri temizlenir
--   * unites tablosu (15 satır) → silinir
--
-- KORUNUR:
--   * hesap_plani (268 hesap, FK olarak çözüm satırlarında kullanılıyordu — referanslar
--     cozumler ile birlikte zaten gitti, plan kayıtları olduğu gibi durur)
--   * kullanicilar, ilerleme (cozulenler jsonb içinde eski ID'ler kalır ama frontend
--     soru-yok kontrolü yapıyor, zararsız)
--   * rozetler_katalog, kazanilan_rozetler, odemeler
--
-- Yıkıcı, geri alınamaz — bu migration push edildikten sonra içerik sıfırdan
-- admin paneli üzerinden eklenecek.

delete from sorular;
delete from unites;
