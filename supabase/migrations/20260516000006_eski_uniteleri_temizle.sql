-- Eski Üniteleri Temizle
--
-- Şu an /uniteler sayfası 4 işletme türü kartı gösteriyor (Ticaret aktif,
-- diğer 3 "Yakında"). Tek aktif ünite mal-alis-satis (Ticaret İşletmesi).
-- Diğer ~14 ünite (Açılış Kayıtları, Hazır Değerler, KDV, Amortisman, vb.)
-- artık kullanılmıyor — UI'da görünmüyor ama admin tarafında listede
-- duruyorlar ve kullanıcıyı şaşırtıyor.
--
-- Bu migration mal-alis-satis HARİÇ tüm üniteleri ve onlara bağlı verileri
-- temizler.
--
-- Cascade haritası (init.sql + 20260514000001):
--   sorular.unite_id → unites.id ON DELETE RESTRICT  (önce sorular silinmeli)
--   cozumler.soru_id → sorular.id ON DELETE CASCADE
--   ilerleme.soru_id → sorular.id ON DELETE CASCADE
--   soru_hatalari.soru_id → sorular.id ON DELETE CASCADE
--   unite_konulari.unite_id → unites.id ON DELETE CASCADE
--   unite_modulleri.unite_id → unites.id ON DELETE CASCADE
--   modul_alt_basliklari.modul_id → unite_modulleri.id ON DELETE CASCADE
--
-- Sıra:
--   1) mal-alis-satis dışındaki sorular → cozumler/ilerleme/soru_hatalari otomatik
--   2) mal-alis-satis dışındaki üniteler → konu/modül/alt başlık otomatik

begin;

-- 1) Eski sorular ve bağımlıları (cozumler/ilerleme/soru_hatalari cascade)
delete from sorular where unite_id != 'mal-alis-satis';

-- 2) Eski üniteler ve bağımlıları (konu/modül/alt başlık cascade)
delete from unites where id != 'mal-alis-satis';

commit;

notify pgrst, 'reload schema';
