-- =====================================================================
-- Tüm mevcut onaylı soruları arşive çek
-- =====================================================================
-- Karar (16 Mayıs 2026): mevcut 213 soruyu sıfırlıyoruz, yeni soru
-- seti baştan eklenecek. Soruları SILMIYORUZ — durum='arsiv' ile
-- pasife alıyoruz. Frontend `eq('durum', 'onayli')` filtresi gereği
-- arsiv sorular hiçbir yerde görünmez.
--
-- Geri alma: bu migration'ı çalıştırdıktan sonra istersen
--   update sorular set durum='onayli' where durum='arsiv';
-- ile geri alınabilir (ama yeni soru seti eklenecekse bu yapılmaz).
--
-- Kullanıcı ilerleme datası (ilerleme, soru_hatalari) etkilenmez —
-- FK CASCADE silme YOK çünkü sadece durum değişiyor.

begin;

update sorular
set durum = 'arsiv'
where durum = 'onayli';

commit;

notify pgrst, 'reload schema';
