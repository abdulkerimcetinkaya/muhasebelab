-- Profil sadeleştirme — 13 alanlık karmaşa yerine 4-5 alanlık "Hakkında" bölümü.
--
-- Kullanıcı geri bildirimi: çok fazla alan kullanıcıyı sıkıyor, çoğu boş kalıyor.
-- 3 bölüm (Profilin + Hedefin + Tanışalım) → tek "Hakkında". Hedef, haftalik_hedef,
-- nereden_duydu, sektor, mezuniyet_yili UI'dan kalkıyor (DB kolonları KALIR —
-- veri kaybı önlenir, gelecekte kullanılabilir).
--
-- Bu migration sadece 2 yeni kolon ekler:
--   1. durum text — basit 2 değer ('ogrenci' | 'calisan'). Eski meslek
--      kolonunun yerine geçer (7 enum çok kapsamlıydı). meslek kolonu DROP
--      edilmez, sadece UI artık kullanmaz.
--   2. dogum_tarihi date — gün+ay+yıl. Eski dogum_yili int kolonu kalır;
--      yeni UI bu yeni date kolonunu kullanır.

begin;

alter table kullanicilar
  add column if not exists durum text check (durum in ('ogrenci', 'calisan')),
  add column if not exists dogum_tarihi date check (
    dogum_tarihi between '1950-01-01' and '2015-12-31'
  );

commit;
