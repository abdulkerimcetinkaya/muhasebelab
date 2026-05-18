-- Muavin hesapları (alt hesaplar — "120.001", "153.003" gibi) tamamen kaldır.
-- Kullanıcı kararı: artık ihtiyaç yok, MVP'de muavin yok, sadece TDHP ana
-- hesapları kullanılacak.
--
-- Bağlı veri:
--   - cozumler.kod FK ile muavin_hesaplar.kod'a bağlı (RESTRICT) → muavin
--     kullanan 6 arşiv sorusu (mh22-mh27) var, hepsi alt_baslik_id=null ve
--     durum='arsiv' — silmemiz güvenli.
--   - Bu soruların cozumler/ilerleme/hata kayıtları CASCADE ile temizlenir.
--
-- Sözlük terimleri (muavin/cari/yardımcı defter/muavin mizanı) sözlükte
-- kalır — kavram öğretisi devam eder, sadece veri kaldırılır.

begin;

-- 1. Muavin kod referansı olan tüm soruları sil (cozumler/ilerleme/hata CASCADE)
delete from sorular where id in (
  select distinct c.soru_id from cozumler c
  where exists (select 1 from muavin_hesaplar m where m.kod = c.kod)
);

-- 2. Muavin hesaplarını sil (FK temizlendi, RESTRICT artık engel değil)
delete from muavin_hesaplar;

commit;
