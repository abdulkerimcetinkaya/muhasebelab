-- Eğitim durumu yapısı — persona modelini sadeleştir, düz 3 ana alan'a in.
--
-- ÖNCEKİ (20260518000002): 5-persona + persona-spesifik sub-fields. Gerçekçi
-- değildi: birisi "üniversite + stajyer" olamıyordu, ya birini ya diğerini
-- seçmek zorundaydı.
--
-- YENİ: Düz alanlar. Eğitim durumu (lise/üniversite/mezun) ile meslek
-- birbirinden bağımsız. UI'da gösterilen alanlar:
--   - eğitim_durumu
--   - okul adı (universite kolonu)
--   - sınıf (sadece lise + üniversite; lise için 9-12, üni için hazırlık/1-4)
--   - doğum tarihi
--   - meslek (sadece mezun seçildiyse)
--
-- Bu migration:
--   1. egitim_durumu kolonu ekler
--   2. persona kolonundan ve eski 'durum' kolonundan veri taşır
--   3. lise_sinif → sinif, lise_adi → universite taşıması yapar
--   4. sinif constraint'ini 9-12 (lise sınıfları) ile genişletir
--   5. persona ve persona-spesifik kolonları drop eder (kullanılmıyor)
--
-- Geri uyum: eski `durum` ve `bolum` kolonları korunur (UI'da gösterilmiyor
-- ama veri kaybı önlenir).

begin;

-- =====================================================================
-- 1. Yeni alan
-- =====================================================================
alter table kullanicilar
  add column if not exists egitim_durumu text;

alter table kullanicilar drop constraint if exists kullanicilar_egitim_durumu_check;
alter table kullanicilar
  add constraint kullanicilar_egitim_durumu_check check (
    egitim_durumu is null or egitim_durumu in ('lise', 'universite', 'mezun')
  );

-- =====================================================================
-- 2. Veri taşıması: persona → egitim_durumu
-- =====================================================================
update kullanicilar
set egitim_durumu = case
  when persona = 'lise' then 'lise'
  when persona = 'universite' then 'universite'
  when persona in ('stajyer', 'meslek_sahibi', 'aday') then 'mezun'
  else null
end
where egitim_durumu is null and persona is not null;

-- Hâlâ null'sa eski durum kolonundan türet
update kullanicilar
set egitim_durumu = case
  when durum = 'ogrenci' then 'universite'
  when durum in ('mezun', 'calisan') then 'mezun'
  else null
end
where egitim_durumu is null and durum is not null;

-- =====================================================================
-- 3. lise_sinif → sinif taşıması (tek sinif kolonu)
-- =====================================================================
update kullanicilar
set sinif = lise_sinif
where lise_sinif is not null and (sinif is null or sinif = '');

-- =====================================================================
-- 4. lise_adi → universite taşıması (okul adı genel)
-- =====================================================================
update kullanicilar
set universite = lise_adi
where lise_adi is not null and (universite is null or universite = '');

-- =====================================================================
-- 5. sinif constraint'i genişlet — 9-12 (lise) ekle
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_sinif_check;
alter table kullanicilar
  add constraint kullanicilar_sinif_check check (
    sinif is null or sinif in (
      'hazirlik', '1', '2', '3', '4',
      '9', '10', '11', '12',
      'mezun', 'diger'
    )
  );

-- =====================================================================
-- 6. Eski (20260518000002) persona constraint'lerini drop et
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_persona_check;
alter table kullanicilar drop constraint if exists kullanicilar_lise_sinif_check;
alter table kullanicilar drop constraint if exists kullanicilar_staj_yili_check;
alter table kullanicilar drop constraint if exists kullanicilar_staj_yer_check;
alter table kullanicilar drop constraint if exists kullanicilar_hedef_sinav_check;

-- =====================================================================
-- 7. Artık kullanılmayan kolonları drop et (veri taşınmış / boştu)
-- =====================================================================
alter table kullanicilar
  drop column if exists persona,
  drop column if exists lise_sinif,
  drop column if exists lise_adi,
  drop column if exists staj_yili,
  drop column if exists staj_yer,
  drop column if exists sirket,
  drop column if exists hedef_sinav;

commit;
