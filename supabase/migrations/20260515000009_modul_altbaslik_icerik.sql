-- Modül ve alt başlık seviyesinde "konu anlatımı" alanı
--
-- Ünitelerde olduğu gibi (uniteler.icerik), modül ve alt başlıklara da
-- BlockNote Block[] formatında zengin içerik eklenebilsin. Admin panelden
-- düzenlenir, sayfada IcerikGoruntuleyici ile read-only render edilir.
--
-- icerik_guncellendi: AdminIcerikSayfasi'ndaki auto-save akışı son
-- güncelleme zamanını gösterebilsin.
--
-- RLS değişikliği yok — mevcut policy'ler (admin yazar, herkes okur)
-- yeni kolonları otomatik kapsar.

begin;

alter table unite_modulleri
  add column if not exists icerik jsonb,
  add column if not exists icerik_guncellendi timestamptz;

alter table modul_alt_basliklari
  add column if not exists icerik jsonb,
  add column if not exists icerik_guncellendi timestamptz;

commit;

notify pgrst, 'reload schema';
