-- Profil sadeleştirme — 13 alanlık karmaşa yerine sade "Hakkında" bölümü.
--
-- Kullanıcı geri bildirimi: çok fazla alan kullanıcıyı sıkıyor, çoğu boş kalıyor.
-- 3 bölüm (Profilin + Hedefin + Tanışalım) → tek "Hakkında". Hedef, haftalik_hedef,
-- nereden_duydu, sektor, mezuniyet_yili UI'dan kalkıyor (DB kolonları KALIR —
-- veri kaybı önlenir).
--
-- 2026-05-18 v2 iterasyon: 'calisan' → 'mezun' yeniden adlandırma + meslek'e
-- 'muhasebeci' eklendi (mezun olunca meslek dropdown'ı gösteriliyor).
--
-- Bu migration idempotent — yeniden uygulanabilir, mevcut constraint'leri
-- temizleyip yeniden ekler. Eski 'calisan' değerleri 'mezun'a taşınır.

begin;

-- =====================================================================
-- 1. Yeni kolonlar (idempotent)
-- =====================================================================
alter table kullanicilar
  add column if not exists durum text,
  add column if not exists dogum_tarihi date;

-- =====================================================================
-- 2. Eski 'calisan' değerlerini 'mezun'a taşı (v2 rename)
-- =====================================================================
update kullanicilar set durum = 'mezun' where durum = 'calisan';

-- =====================================================================
-- 3. Durum check constraint — sadece 'ogrenci' veya 'mezun'
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_durum_check;
alter table kullanicilar
  add constraint kullanicilar_durum_check check (
    durum is null or durum in ('ogrenci', 'mezun')
  );

-- =====================================================================
-- 4. Doğum tarihi check (idempotent — varsa drop, yeniden ekle)
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_dogum_tarihi_check;
alter table kullanicilar
  add constraint kullanicilar_dogum_tarihi_check check (
    dogum_tarihi is null
    or dogum_tarihi between '1950-01-01' and '2015-12-31'
  );

-- =====================================================================
-- 5. Meslek check'e 'muhasebeci' ekle (mezun için meslek dropdown)
--    Eski check'i drop edip yenisini ekle.
-- =====================================================================
alter table kullanicilar drop constraint if exists kullanicilar_meslek_check;
alter table kullanicilar
  add constraint kullanicilar_meslek_check check (
    meslek is null
    or meslek in (
      'ogrenci',
      'mezun',
      'smmm_stajyer',
      'smmm',
      'muhasebeci',
      'akademisyen',
      'is_ariyor',
      'diger'
    )
  );

commit;
