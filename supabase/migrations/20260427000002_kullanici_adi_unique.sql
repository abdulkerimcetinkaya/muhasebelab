-- Kullanıcı adını benzersiz yap (case-insensitive).
-- Mevcut "Öğrenci" default'lu satırlar varsa önce uniqualaştırılır.

begin;

-- =====================================================================
-- Aynı isme sahip eski kayıtları uniqualaştır (id'nin ilk 8 hanesi suffix)
-- =====================================================================
with duplicates as (
  select id,
         row_number() over (
           partition by lower(kullanici_adi)
           order by created_at
         ) as rn
  from kullanicilar
)
update kullanicilar k
   set kullanici_adi = k.kullanici_adi || '_' || substring(k.id::text, 1, 8)
  from duplicates d
 where k.id = d.id
   and d.rn > 1;

-- =====================================================================
-- Case-insensitive unique index
-- =====================================================================
create unique index if not exists kullanicilar_kullanici_adi_unique
  on kullanicilar (lower(kullanici_adi));

-- =====================================================================
-- Trigger güncelle — boş ad geldiğinde unique fallback (id'den türet)
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_ad text;
begin
  v_ad := nullif(trim(new.raw_user_meta_data->>'kullanici_adi'), '');
  if v_ad is null then
    v_ad := 'Kullanici_' || substring(new.id::text, 1, 8);
  end if;

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
    v_ad,
    coalesce((new.raw_user_meta_data->>'bulten_izni')::boolean, false),
    now()
  )
  on conflict (id) do nothing;
  return new;
end $$;

-- =====================================================================
-- Public RPC: kullanıcı adı kullanılabilir mi?
-- Anonim çağrı yapabilir (kayıt sırasında debounced kontrol için).
-- Kişisel veri sızdırmaz (sadece var/yok bilgisi).
-- =====================================================================
create or replace function public.kullanici_adi_uygun(_ad text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from kullanicilar
    where lower(kullanici_adi) = lower(trim(_ad))
  );
$$;

grant execute on function public.kullanici_adi_uygun(text) to anon, authenticated;

commit;
