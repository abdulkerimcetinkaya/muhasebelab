-- Modül 1: 27 soruyu 13 alt başlığa dağıt
--
-- Önceki migration (20260515000005) 10 yeni boş alt başlık eklemişti.
-- Bu migration mevcut 27 sorunun alt_baslik_id'sini doğru konuya günceller.
--
-- Mapping kullanıcı tarafından onaylandı (2026-05-15).

begin;

-- 1.1 Peşin mal alımı (mevcut: zaten burada — değişmedi, idempotent için yine yazıyoruz)
update sorular set alt_baslik_id = 'mal-alis-satis-1-1'
 where id in ('mh01','mh02','mh03');

-- 1.2 Peşin mal satışı (mh13 fatura üzeri iskonto — 611 çalışmıyor, peşin satış)
update sorular set alt_baslik_id = 'mal-alis-satis-1-2'
 where id in ('mh10','mh11','mh12','mh13');

-- 1.3 Kredili mal alımı (mh20 karma — kredili tarafı esas, 320 devreye giriyor)
update sorular set alt_baslik_id = 'mal-alis-satis-1-3'
 where id in ('mh19','mh20','mh21');

-- 1.5 Satıştan iade
update sorular set alt_baslik_id = 'mal-alis-satis-1-5'
 where id in ('mh04','mh14','mh16');

-- 1.6 Alıştan iade (mh27 alıştan iade düzeltmesi de buraya)
update sorular set alt_baslik_id = 'mal-alis-satis-1-6'
 where id in ('mh05','mh08','mh24','mh27');

-- 1.7 Satış iskontosu (mh07 yıllık ciro primi — 611 hesabı, satış iskontosu)
update sorular set alt_baslik_id = 'mal-alis-satis-1-7'
 where id in ('mh06','mh07');

-- 1.8 Alış iskontosu (mh22 sezon kampanyası, mh25 tedarikçiden ciro primi)
update sorular set alt_baslik_id = 'mal-alis-satis-1-8'
 where id in ('mh22','mh25');

-- 1.10 Verilen sipariş avansı
update sorular set alt_baslik_id = 'mal-alis-satis-1-10'
 where id in ('mh09','mh23','mh26');

-- 1.11 Alınan sipariş avansı (mh15 kapora mahsubu, mh17 avansın iadesi)
update sorular set alt_baslik_id = 'mal-alis-satis-1-11'
 where id in ('mh15','mh17');

-- 1.12 Konsinye mal hareketi
update sorular set alt_baslik_id = 'mal-alis-satis-1-12'
 where id in ('mh18');

commit;

notify pgrst, 'reload schema';
