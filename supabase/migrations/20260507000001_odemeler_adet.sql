-- Bulk/kurum ödeme için adet kolonu.
--   adet = 1 → bireysel ödeme (default, mevcut davranış)
--   adet > 1 → kurum/sınıf bulk ödeme; öğrenci dağıtımı şimdilik manuel
--             (admin_premium_ayarla RPC üzerinden admin tanımlar)

alter table odemeler
  add column if not exists adet int not null default 1;

alter table odemeler
  drop constraint if exists odemeler_adet_check;
alter table odemeler
  add constraint odemeler_adet_check check (adet between 1 and 500);

comment on column odemeler.adet is
  'Toplu ödemede kullanıcı sayısı (kurum/sınıf). Bireysel için 1.';
