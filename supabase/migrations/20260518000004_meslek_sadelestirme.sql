-- Meslek listesini sadeleştir — 7 seçenek → 5.
--
-- Yeni liste: smmm_stajyer, smmm, akademisyen, calismiyor, diger
--
-- Kaldırılanlar: muhasebeci, mali_musavir → null'a düşür (kullanıcı yeniden seçer)
-- Yeniden adlandırılan: is_ariyor → calismiyor (semantik olarak aynı kapsam)
-- Eski legacy: ogrenci, mezun → null (egitim_durumu'na taşınmıştı zaten)

begin;

-- 1. Veri taşıması (önce — sonra strict constraint için temizlik)
update kullanicilar set meslek = 'calismiyor' where meslek = 'is_ariyor';
update kullanicilar set meslek = null where meslek in ('muhasebeci', 'mali_musavir', 'ogrenci', 'mezun');

-- 2. Strict constraint — sadece 5 yeni değer
alter table kullanicilar drop constraint if exists kullanicilar_meslek_check;
alter table kullanicilar
  add constraint kullanicilar_meslek_check check (
    meslek is null
    or meslek in ('smmm_stajyer', 'smmm', 'akademisyen', 'calismiyor', 'diger')
  );

commit;
