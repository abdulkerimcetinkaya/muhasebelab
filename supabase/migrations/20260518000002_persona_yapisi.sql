-- Persona yapısı — Hakkında bölümünü kullanıcı kitlesine göre yeniden modelle.
--
-- Önceki yapı (durum: ogrenci/mezun) çok genel kalıyordu:
--   - Lise öğrencisini hiç görmüyordu
--   - SMMM stajyeri sadece "Mezun → meslek dropdown" altında gizliydi
--   - Aday/tazeleme (sınava hazırlanan, iş arayan) için yer yoktu
--
-- Yeni yapı: 5 persona, her birinin kendine özel sub-fields'ı var:
--   - lise           → lise_sinif (9/10/11/12) + lise_adi
--   - universite     → universite + bolum + sinif (hazirlik/1/2/3/4)
--   - stajyer        → staj_yili (1/2/3) + staj_yer + sirket
--   - meslek_sahibi  → meslek + tecrube_yil + sirket
--   - aday           → hedef_sinav
--
-- Eski kolonlar (durum, meslek, universite, bolum, sinif, tecrube_yil) korunur.
-- Veri taşıması: durum + meslek'ten persona türetilir.
--
-- Idempotent — yeniden uygulanabilir.

begin;

-- =====================================================================
-- 1. Yeni kolonlar
-- =====================================================================
alter table kullanicilar
  add column if not exists persona text,
  add column if not exists lise_sinif text,
  add column if not exists lise_adi text,
  add column if not exists staj_yili text,
  add column if not exists staj_yer text,
  add column if not exists sirket text,
  add column if not exists hedef_sinav text;

-- =====================================================================
-- 2. Persona check constraint
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_persona_check;
alter table kullanicilar
  add constraint kullanicilar_persona_check check (
    persona is null or persona in (
      'lise', 'universite', 'stajyer', 'meslek_sahibi', 'aday'
    )
  );

-- =====================================================================
-- 3. Lise sınıf check (9-12)
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_lise_sinif_check;
alter table kullanicilar
  add constraint kullanicilar_lise_sinif_check check (
    lise_sinif is null or lise_sinif in ('9', '10', '11', '12')
  );

-- =====================================================================
-- 4. Staj yılı check (1-3)
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_staj_yili_check;
alter table kullanicilar
  add constraint kullanicilar_staj_yili_check check (
    staj_yili is null or staj_yili in ('1', '2', '3')
  );

-- =====================================================================
-- 5. Staj yer check
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_staj_yer_check;
alter table kullanicilar
  add constraint kullanicilar_staj_yer_check check (
    staj_yer is null or staj_yer in ('smmm_buro', 'sirket', 'kamu', 'diger')
  );

-- =====================================================================
-- 6. Hedef sınav check
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_hedef_sinav_check;
alter table kullanicilar
  add constraint kullanicilar_hedef_sinav_check check (
    hedef_sinav is null or hedef_sinav in (
      'smmm_yeterlilik', 'kpss', 'is_basvuru', 'genel'
    )
  );

-- =====================================================================
-- 7. Mevcut sınıf check'ini genişlet — Hazırlık ekle
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_sinif_check;
alter table kullanicilar
  add constraint kullanicilar_sinif_check check (
    sinif is null or sinif in ('hazirlik', '1', '2', '3', '4', 'mezun', 'diger')
  );

-- =====================================================================
-- 8. Meslek check'ini genişlet — Mali Müşavir ekle (Diğer'ler korunur)
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_meslek_check;
alter table kullanicilar
  add constraint kullanicilar_meslek_check check (
    meslek is null
    or meslek in (
      'ogrenci', 'mezun', 'smmm_stajyer', 'smmm',
      'muhasebeci', 'akademisyen', 'mali_musavir',
      'is_ariyor', 'diger'
    )
  );

-- =====================================================================
-- 9. Veri taşıması — mevcut durum + meslek'ten persona türet
-- =====================================================================
update kullanicilar
set persona = case
  when meslek = 'smmm_stajyer' then 'stajyer'
  when meslek in ('smmm', 'muhasebeci', 'akademisyen', 'mali_musavir') then 'meslek_sahibi'
  when meslek = 'is_ariyor' then 'aday'
  when durum = 'ogrenci' then 'universite'
  when durum = 'mezun' then 'meslek_sahibi'
  else null
end
where persona is null and (durum is not null or meslek is not null);

commit;
