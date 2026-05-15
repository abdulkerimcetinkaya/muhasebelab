-- Modül 2 "Vergi Boyutu"nu opsiyonel yap
--
-- Vergi konusu (KDV, stopaj, damga, beyanname) mal hareketlerinden bağımsız
-- öğrenilebilir — öğrenci M1'i tamamlamadan da M2'ye girebilmeli.
--
-- Kilit mantığı (modul-kilit.ts) güncellendi: opsiyonel modüller bağımsız
-- konular olarak her zaman açıktır. Bu update mevcut M2'yi opsiyonel
-- işaretler ki UI'da kilitli görünmesin.

begin;

update unite_modulleri
set opsiyonel = true
where id = 'mal-alis-satis-m2';

commit;

notify pgrst, 'reload schema';
