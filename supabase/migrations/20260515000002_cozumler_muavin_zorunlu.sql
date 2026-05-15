-- Cozumler: Muavin koduyla yevmiye kaydı ZORUNLU
--
-- Kural (2026-05-15): Ana hesaba doğrudan yevmiye kaydı yapılamaz. Tüm
-- yevmiye satırları muavin (153.001 vb.) düzeyinde olmalıdır.
--
-- Mevcut durum: cozumler.kod -> hesap_plani(kod) FK'si vardı, sadece ana
-- hesap kodları kabul ediyordu (153, 191, 320 vb.).
--
-- Yeni durum: cozumler.kod -> muavin_hesaplar(kod) FK'si. Format kontrolü
-- ile sadece muavin formatı (XXX.NNN+) kabul edilir.
--
-- Bu migration ile birlikte eski 213 soru ve onlara bağlı cozumler tamamen
-- silinir (kullanıcı kararı, geri dönüş yok). Yeni içerik (Modül 1 Mal
-- Hareketleri) ayrı migration ile gelir.

begin;

-- =====================================================================
-- 1. Eski sorular ve cozumler tamamen silinsin (kullanıcı kararı)
-- =====================================================================
-- cozumler ON DELETE CASCADE ile sorulara bağlı, otomatik temizlenir
delete from sorular;

-- =====================================================================
-- 2. cozumler.kod FK'si hesap_plani -> muavin_hesaplar
-- =====================================================================
alter table cozumler drop constraint if exists cozumler_kod_fkey;

alter table cozumler
  add constraint cozumler_kod_fkey
  foreign key (kod) references muavin_hesaplar(kod)
  on delete restrict;

-- Sadece muavin formatı kabul edilir (XXX.NNN, XXX.NNN.NNN, ...)
alter table cozumler drop constraint if exists cozumler_muavin_format;
alter table cozumler
  add constraint cozumler_muavin_format
  check (kod ~ '^[0-9]{3}(\.[0-9]+)+$');

commit;

notify pgrst, 'reload schema';
