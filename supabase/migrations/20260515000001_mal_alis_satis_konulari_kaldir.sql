-- Mal Alış Satış: Eski "Konu" katmanı kaldırıldı (modül yapısı yerine geçti)
--
-- Bağlam: 2026-05-14'te mal-alis-satis için 9 modül + 56 alt başlıklı atölye
-- yapısı kuruldu (20260514000001_unite_modulleri). Eski 6 konu (Stok Kavramı,
-- Mal Alış, Alıştan İade, Mal Satış, Satıştan İade, Satılan Mal Maliyeti)
-- artık gereksiz — UI'da gizleniyordu, şimdi DB'den de temizleniyor.
--
-- Etkiler:
-- - 6 konunun BlockNote içerikleri silinir (anlatım metni — kullanılmıyordu).
-- - Bu konulara bağlı sorulardaki konu_id otomatik NULL'a düşer
--   (ON DELETE SET NULL — sorular ünitede kalır).
-- - Sorular ekleme/düzenleme formundaki "Alt-konu" dropdown'u kaldırıldı,
--   yeni "Atölye Alt Başlığı" dropdown'u kullanılıyor.
--
-- unite_konulari tablosunun kendisi silinmiyor (başka ünitelerde
-- kullanım için altyapı kalıyor — şu an boş ama açık).

delete from unite_konulari
 where unite_id = 'mal-alis-satis';

notify pgrst, 'reload schema';
