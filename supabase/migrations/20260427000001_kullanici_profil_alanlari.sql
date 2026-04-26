-- Kullanıcı profil alanları — kayıt + onboarding sırasında toplanan bilgiler.
-- Pazar segmentasyonu, içerik kişiselleştirme ve liderlik tablosu için temel.

begin;

-- =====================================================================
-- kullanicilar tablosuna yeni kolonlar
-- =====================================================================
alter table kullanicilar
  add column if not exists universite text,
  add column if not exists bolum text,
  add column if not exists sinif text check (sinif in ('1', '2', '3', '4', 'mezun', 'diger')),
  add column if not exists hedef text check (hedef in ('vize-final', 'kpss', 'genel', 'belirsiz')),
  add column if not exists dogum_yili int check (dogum_yili between 1950 and 2015),
  add column if not exists avatar_url text,
  add column if not exists bulten_izni boolean not null default false,
  add column if not exists kvkk_kabul_tarihi timestamptz;

-- =====================================================================
-- handle_new_user trigger fonksiyonunu güncelle:
-- raw_user_meta_data'dan kullanıcı_adı + bulten_izni alır,
-- kvkk_kabul_tarihi'ni now() olarak yazar.
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.kullanicilar (
    id,
    email,
    kullanici_adi,
    bulten_izni,
    kvkk_kabul_tarihi
  )
  values (
    new.id,
    new.email,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'kullanici_adi'), ''),
      'Öğrenci'
    ),
    coalesce((new.raw_user_meta_data->>'bulten_izni')::boolean, false),
    now()
  )
  on conflict (id) do nothing;
  return new;
end $$;

-- =====================================================================
-- Pazar analizi için liderlik tablosu view (üniversite + sınıf bazında)
-- =====================================================================
create or replace view public.universite_liderlik as
select
  universite,
  count(*) as kullanici_sayisi,
  sum(coalesce(gunluk_cozum_sayisi, 0)) as toplam_cozum
from kullanicilar
where universite is not null
group by universite
order by toplam_cozum desc nulls last;

-- universite_liderlik view'ı public read (RLS'siz, view sadece toplu veri gösteriyor)
grant select on public.universite_liderlik to anon, authenticated;

commit;
