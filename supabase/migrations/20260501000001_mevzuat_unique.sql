-- MuhasebeLab — mevzuat_chunklar (kaynak, baslik) için duplicate koruması
-- Aynı kaynak+başlık ile gönderilen chunk artık üzerine yazılır (upsert),
-- yeni satır oluşturmaz. Önce mevcut duplicate'leri temizleyip sonra
-- unique constraint ekliyoruz.

-- Duplicate temizle: aynı (kaynak, baslik) çiftinden en eski (id küçük) olanları sil,
-- en yeniyi (en büyük id) tut.
delete from mevzuat_chunklar a
using mevzuat_chunklar b
where a.id < b.id
  and a.kaynak = b.kaynak
  and a.baslik = b.baslik;

-- Unique constraint
alter table mevzuat_chunklar
  add constraint mevzuat_chunklar_kaynak_baslik_uniq
  unique (kaynak, baslik);

comment on constraint mevzuat_chunklar_kaynak_baslik_uniq on mevzuat_chunklar is
  'Aynı kaynak ve başlık ile birden fazla chunk olamaz; mevzuat-embed Edge Function upsert ile davranır.';
