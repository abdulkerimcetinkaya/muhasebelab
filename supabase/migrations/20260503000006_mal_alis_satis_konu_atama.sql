-- MuhasebeLab — Mevcut + yeni mal-alış-satış sorularını konu_id ile eşleştir
--
-- Konular: stok-kavrami, mal-alis, alistan-iade, mal-satis, satistan-iade,
--          satilan-mal-maliyeti
--
-- Strateji: her sorunun başlığı/içeriği temelinde manuel atama. Bu migration
-- idempotent — UPDATE'ler tekrar çalışırsa aynı sonucu verir.

-- ─── Mevcut mal-1...mal-8 (statik seed) ────────────────────────────────────
update sorular set konu_id = 'mal-alis'              where id = 'mal-1';
update sorular set konu_id = 'mal-alis'              where id = 'mal-2';
update sorular set konu_id = 'mal-alis'              where id = 'mal-3';
update sorular set konu_id = 'mal-satis'             where id = 'mal-4';
update sorular set konu_id = 'satistan-iade'         where id = 'mal-5';
update sorular set konu_id = 'mal-satis'             where id = 'mal-6';
update sorular set konu_id = 'alistan-iade'          where id = 'mal-7';
update sorular set konu_id = 'satilan-mal-maliyeti' where id = 'mal-8';

-- ─── Mevcut mal-ek-1...mal-ek-12 (AI eklenen genişletme paketi) ────────────
update sorular set konu_id = 'mal-alis'              where id = 'mal-ek-1';
update sorular set konu_id = 'mal-alis'              where id = 'mal-ek-2';
update sorular set konu_id = 'mal-satis'             where id = 'mal-ek-3';
update sorular set konu_id = 'mal-satis'             where id = 'mal-ek-4';
update sorular set konu_id = 'mal-alis'              where id = 'mal-ek-5';
update sorular set konu_id = 'mal-alis'              where id = 'mal-ek-6';
update sorular set konu_id = 'satistan-iade'         where id = 'mal-ek-7';
update sorular set konu_id = 'mal-alis'              where id = 'mal-ek-8';
update sorular set konu_id = 'mal-alis'              where id = 'mal-ek-9';
update sorular set konu_id = 'mal-satis'             where id = 'mal-ek-10';
update sorular set konu_id = 'alistan-iade'          where id = 'mal-ek-11';
update sorular set konu_id = 'alistan-iade'          where id = 'mal-ek-12';

-- ─── Yeni mas-* (20260503000005 migration'ında eklenenler) ─────────────────
update sorular set konu_id = 'stok-kavrami'          where id = 'mas-stk-1';
update sorular set konu_id = 'stok-kavrami'          where id = 'mas-stk-2';
update sorular set konu_id = 'mal-alis'              where id = 'mas-als-1';
update sorular set konu_id = 'mal-alis'              where id = 'mas-als-2';
update sorular set konu_id = 'alistan-iade'          where id = 'mas-aid-1';
update sorular set konu_id = 'alistan-iade'          where id = 'mas-aid-2';
update sorular set konu_id = 'mal-satis'             where id = 'mas-stj-1';
update sorular set konu_id = 'mal-satis'             where id = 'mas-stj-2';
update sorular set konu_id = 'satistan-iade'         where id = 'mas-sid-1';
update sorular set konu_id = 'satistan-iade'         where id = 'mas-sid-2';
update sorular set konu_id = 'satilan-mal-maliyeti' where id = 'mas-smm-1';
update sorular set konu_id = 'satilan-mal-maliyeti' where id = 'mas-smm-2';

-- ─── Güvence: unite_id de doğru olsun (eski "mal"de takılı kalanlar varsa) ─
update sorular
   set unite_id = 'mal-alis-satis'
 where unite_id = 'mal'
   and id like 'mal%';

notify pgrst, 'reload schema';
