-- =====================================================================
-- Ad / Soyad alanları + bülten izni default değişikliği
-- =====================================================================
-- Auth iyileştirme sprintı PR-A:
-- - Onboarding artık ad + soyad alacak (zorunlu)
-- - Anasayfa "Merhaba, {ad}" karşılaması için
-- - Bülten izni default = true (kayıt olunca otomatik abone)
-- - Mevcut kullanıcılar için kvkk_kabul_tarihi backfill
-- =====================================================================

-- Ad/Soyad alanları (nullable — eski kullanıcılar için)
alter table kullanicilar
  add column if not exists ad text,
  add column if not exists soyad text;

-- Bülten izni default = true. Mevcut kullanıcılar için de doldur
-- (kayıt olurken örtük rıza varsayımı — disclaimer formda yazıyor)
alter table kullanicilar alter column bulten_izni set default true;
update kullanicilar set bulten_izni = true where bulten_izni is null;

-- KVKK kabul tarihi: kayıt anında kabul edilmiş sayılır (form'da disclaimer)
update kullanicilar
   set kvkk_kabul_tarihi = created_at
 where kvkk_kabul_tarihi is null;

-- koru_kullanici_kolonlar trigger'ı varsa ad/soyad kolonlarını da yansıtsın
-- (Bu trigger PR #34/#35'te eklenmişti; kullanıcının kendi profilini
-- güncellerken yetkisiz alanları korur)

-- Schema cache reload
notify pgrst, 'reload schema';
