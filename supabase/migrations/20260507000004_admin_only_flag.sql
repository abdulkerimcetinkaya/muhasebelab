-- Admin / kullanıcı kimlik ayrımı (Faz 1)
--
-- Karar: Admin hesapları artık kullanıcı verisinden ayrı tutulur.
-- - admin_only=true → Premium gibi kullanıcı flow'larına dahil DEĞİL
-- - Leaderboard'a girmez
-- - Üniversite istatistik sayım'larında yer almaz
-- - Admin ekiplerini büyüteceğiz (Faz 2'de rol sistemi gelir)
--
-- Mevcut admin'ler otomatik admin_only=true işaretlenir.

-- =====================================================================
-- 1) Flag kolonu
-- =====================================================================
alter table kullanicilar
  add column if not exists admin_only boolean not null default false;

create index if not exists kullanicilar_admin_only_idx on kullanicilar (admin_only)
  where admin_only = true;

-- Mevcut admin'leri admin_only=true yap
update kullanicilar
  set admin_only = true
  where id in (select user_id from adminler);

-- Yeni admin eklendiğinde otomatik admin_only=true olur (admin_ekle RPC'sini güncelle)
create or replace function public.admin_ekle(_email text)
returns text
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_user_id uuid;
  v_caller_admin boolean;
begin
  -- Yetki: çağıran admin mi?
  select exists (
    select 1 from adminler where user_id = auth.uid()
  ) into v_caller_admin;
  if not v_caller_admin then
    raise exception 'Yetkisiz işlem' using errcode = 'P0001';
  end if;

  select id into v_user_id from kullanicilar where lower(email) = lower(_email);
  if v_user_id is null then
    raise exception 'Kullanıcı bulunamadı: %', _email using errcode = 'P0002';
  end if;

  insert into adminler (user_id, email, ekleyen_id)
    values (v_user_id, _email, auth.uid())
    on conflict (user_id) do nothing;

  -- admin_only=true → leaderboard ve istatistik dışı
  update kullanicilar set admin_only = true where id = v_user_id;

  return v_user_id::text;
end;
$fn$;

-- admin_cikar: admin_only flag'ini kaldırma kararı opsiyonel — varsayılan
-- olarak kaldırıyoruz (eski admin tekrar normal kullanıcı olur)
create or replace function public.admin_cikar(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_caller_admin boolean;
begin
  select exists (
    select 1 from adminler where user_id = auth.uid()
  ) into v_caller_admin;
  if not v_caller_admin then
    raise exception 'Yetkisiz işlem' using errcode = 'P0001';
  end if;

  -- Kendini çıkaramazsın (son admin koruması daha sonra eklenir)
  if _user_id = auth.uid() then
    raise exception 'Kendini çıkaramazsın' using errcode = 'P0003';
  end if;

  delete from adminler where user_id = _user_id;
  update kullanicilar set admin_only = false where id = _user_id;
end;
$fn$;

-- =====================================================================
-- 2) Liderlik RPC'lerinden admin_only kullanıcıları hariç tut
-- =====================================================================

create or replace function public.bireysel_liderlik(_limit int default 100)
returns table (
  id uuid,
  kullanici_adi text,
  universite text,
  sinif text,
  avatar_url text,
  cozulen_soru int,
  toplam_puan int,
  rozet_sayisi int
)
language sql
security definer
set search_path = public
as $$
  select
    k.id,
    k.kullanici_adi,
    k.universite,
    k.sinif,
    k.avatar_url,
    count(distinct case when i.dogru_mu then i.soru_id end)::int as cozulen_soru,
    coalesce(sum(case
      when i.dogru_mu and s.zorluk = 'kolay' then 5
      when i.dogru_mu and s.zorluk = 'orta'  then 10
      when i.dogru_mu and s.zorluk = 'zor'   then 20
      else 0
    end), 0)::int as toplam_puan,
    (
      select count(*)::int
      from kazanilan_rozetler kr
      where kr.user_id = k.id
    ) as rozet_sayisi
  from kullanicilar k
  left join ilerleme i on i.user_id = k.id
  left join sorular s on s.id = i.soru_id and s.durum = 'onayli'
  where k.admin_only = false
  group by k.id, k.kullanici_adi, k.universite, k.sinif, k.avatar_url
  having coalesce(sum(case
    when i.dogru_mu and s.zorluk = 'kolay' then 5
    when i.dogru_mu and s.zorluk = 'orta'  then 10
    when i.dogru_mu and s.zorluk = 'zor'   then 20
    else 0
  end), 0) > 0
  order by toplam_puan desc, cozulen_soru desc
  limit greatest(1, least(_limit, 200));
$$;

create or replace function public.haftalik_liderlik(_limit int default 100)
returns table (
  id uuid,
  kullanici_adi text,
  universite text,
  sinif text,
  avatar_url text,
  cozulen_soru int,
  toplam_puan int,
  rozet_sayisi int
)
language sql
security definer
set search_path = public
as $$
  select
    k.id,
    k.kullanici_adi,
    k.universite,
    k.sinif,
    k.avatar_url,
    count(distinct case when i.dogru_mu then i.soru_id end)::int as cozulen_soru,
    coalesce(sum(case
      when i.dogru_mu and s.zorluk = 'kolay' then 5
      when i.dogru_mu and s.zorluk = 'orta'  then 10
      when i.dogru_mu and s.zorluk = 'zor'   then 20
      else 0
    end), 0)::int as toplam_puan,
    (
      select count(*)::int
      from kazanilan_rozetler kr
      where kr.user_id = k.id
        and kr.kazanilan_tarih >= now() - interval '7 days'
    ) as rozet_sayisi
  from kullanicilar k
  left join ilerleme i
    on i.user_id = k.id
   and i.created_at >= now() - interval '7 days'
  left join sorular s
    on s.id = i.soru_id
   and s.durum = 'onayli'
  where k.admin_only = false
  group by k.id, k.kullanici_adi, k.universite, k.sinif, k.avatar_url
  having coalesce(sum(case
    when i.dogru_mu and s.zorluk = 'kolay' then 5
    when i.dogru_mu and s.zorluk = 'orta'  then 10
    when i.dogru_mu and s.zorluk = 'zor'   then 20
    else 0
  end), 0) > 0
  order by toplam_puan desc, cozulen_soru desc
  limit greatest(1, least(_limit, 200));
$$;

create or replace function public.aylik_liderlik(_limit int default 100)
returns table (
  id uuid,
  kullanici_adi text,
  universite text,
  sinif text,
  avatar_url text,
  cozulen_soru int,
  toplam_puan int,
  rozet_sayisi int
)
language sql
security definer
set search_path = public
as $$
  select
    k.id,
    k.kullanici_adi,
    k.universite,
    k.sinif,
    k.avatar_url,
    count(distinct case when i.dogru_mu then i.soru_id end)::int as cozulen_soru,
    coalesce(sum(case
      when i.dogru_mu and s.zorluk = 'kolay' then 5
      when i.dogru_mu and s.zorluk = 'orta'  then 10
      when i.dogru_mu and s.zorluk = 'zor'   then 20
      else 0
    end), 0)::int as toplam_puan,
    (
      select count(*)::int
      from kazanilan_rozetler kr
      where kr.user_id = k.id
        and kr.kazanilan_tarih >= now() - interval '30 days'
    ) as rozet_sayisi
  from kullanicilar k
  left join ilerleme i
    on i.user_id = k.id
   and i.created_at >= now() - interval '30 days'
  left join sorular s
    on s.id = i.soru_id
   and s.durum = 'onayli'
  where k.admin_only = false
  group by k.id, k.kullanici_adi, k.universite, k.sinif, k.avatar_url
  having coalesce(sum(case
    when i.dogru_mu and s.zorluk = 'kolay' then 5
    when i.dogru_mu and s.zorluk = 'orta'  then 10
    when i.dogru_mu and s.zorluk = 'zor'   then 20
    else 0
  end), 0) > 0
  order by toplam_puan desc, cozulen_soru desc
  limit greatest(1, least(_limit, 200));
$$;

create or replace function public.universite_liderlik()
returns table (
  universite text,
  kullanici_sayisi bigint,
  toplam_cozum bigint
)
language sql
security definer
set search_path = public
as $$
  select
    universite,
    count(*) as kullanici_sayisi,
    sum(coalesce(gunluk_cozum_sayisi, 0)) as toplam_cozum
  from kullanicilar
  where universite is not null
    and admin_only = false
  group by universite
  order by toplam_cozum desc nulls last;
$$;

-- =====================================================================
-- 3) koru_kullanici_kolonlar trigger'ına admin_only ekle
--    (kullanıcı kendi profilini güncellerken admin_only'i değiştiremez)
-- =====================================================================
create or replace function public.koru_kullanici_kolonlar()
returns trigger language plpgsql security definer
set search_path = public
as $fn$
declare
  jwt_role text;
begin
  begin
    jwt_role := nullif(current_setting('request.jwt.claims', true), '')::json->>'role';
  exception when others then
    jwt_role := null;
  end;

  if jwt_role = 'service_role'
     or current_user in ('postgres', 'supabase_admin', 'service_role') then
    return new;
  end if;

  -- Authenticated kullanıcı bu kolonları değiştiremez
  new.premium_bitis := old.premium_bitis;
  new.gunluk_cozum_sayisi := old.gunluk_cozum_sayisi;
  new.gunluk_limit_reset := old.gunluk_limit_reset;
  new.email := old.email;
  new.kvkk_kabul_tarihi := old.kvkk_kabul_tarihi;
  new.created_at := old.created_at;
  new.banli := old.banli;
  new.ban_sebep := old.ban_sebep;
  new.ban_tarihi := old.ban_tarihi;
  -- Yeni: katkıcı + admin_only flag'leri sadece admin RPC'leri ile değişir
  new.is_katkici := old.is_katkici;
  new.admin_only := old.admin_only;
  return new;
end $fn$;

notify pgrst, 'reload schema';
