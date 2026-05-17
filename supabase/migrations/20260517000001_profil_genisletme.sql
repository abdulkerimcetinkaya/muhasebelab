-- Profil alanları genişletme — kullanıcıyı daha yakından tanımak için.
--
-- Önceki şema sadece üniversite/bölüm/sınıf/hedef topluyordu. Onboarding
-- kaldırıldıktan sonra (PR #158) profil tamamen opsiyonel oldu ve daha
-- kapsayıcı bir kullanıcı kitlesini hedefliyoruz: öğrenci + mezun + SMMM
-- stajyer + SMMM + akademisyen + iş arayan. Bu migration:
--
-- 1. `meslek` kolonu ekler (kapsayıcı, sınıftan ayrı)
-- 2. Mezun/çalışan için ek alanlar: mezuniyet_yili, sektor, tecrube_yil
-- 3. Platform kullanım hedefi için: haftalik_hedef
-- 4. Discovery channel için: nereden_duydu (marketing intel)
-- 5. `hedef` enum'unu genişletir: bütünleme, SMMM yeterlilik, mesleki
--    tazeleme, ilk öğrenme

begin;

-- =====================================================================
-- Yeni kolonlar
-- =====================================================================
alter table kullanicilar
  add column if not exists meslek text check (
    meslek in ('ogrenci', 'mezun', 'smmm_stajyer', 'smmm', 'akademisyen', 'is_ariyor', 'diger')
  ),
  add column if not exists mezuniyet_yili int check (mezuniyet_yili between 1970 and 2030),
  add column if not exists sektor text,
  add column if not exists tecrube_yil int check (tecrube_yil between 0 and 60),
  add column if not exists nereden_duydu text check (
    nereden_duydu in ('arkadas', 'sosyal_medya', 'youtube', 'hoca', 'google', 'haber', 'diger')
  ),
  add column if not exists haftalik_hedef text check (
    haftalik_hedef in ('1-2sa', '3-5sa', '5-10sa', '10plus')
  );

-- =====================================================================
-- `hedef` enum'unu genişlet — eski check constraint'i drop edip yenisini ekle.
-- =====================================================================
do $$
declare
  v_constraint_name text;
begin
  -- Mevcut hedef check constraint'inin adını bul (Postgres farklı isimler verebilir)
  select conname into v_constraint_name
  from pg_constraint
  where conrelid = 'public.kullanicilar'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%hedef%';

  if v_constraint_name is not null then
    execute format('alter table kullanicilar drop constraint %I', v_constraint_name);
  end if;
end $$;

alter table kullanicilar
  add constraint kullanicilar_hedef_check check (
    hedef is null
    or hedef in (
      'vize-final',
      'butunleme',
      'kpss',
      'smmm-yeterlilik',
      'tazeleme',
      'genel',
      'ogrenme',
      'belirsiz'
    )
  );

commit;
