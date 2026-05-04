-- Admin moderasyon — Sprint 3
-- 1) kullanicilar tablosuna ban alanları
-- 2) koru_kullanici_kolonlar trigger güncelle: banli alanı korunsun
-- 3) Banlı kullanıcılar INSERT yapamasın (ilerleme, soru_hatalari)
-- 4) RPC: admin_kullanici_banla, admin_kullanici_unbanla, admin_kullanici_sil

begin;

-- ─────────────────────────────────────────────────────────────────────
-- 1) Ban alanları
-- ─────────────────────────────────────────────────────────────────────
alter table kullanicilar add column if not exists banli boolean not null default false;
alter table kullanicilar add column if not exists ban_sebep text;
alter table kullanicilar add column if not exists ban_tarihi timestamptz;

create index if not exists kullanicilar_banli_idx on kullanicilar(banli) where banli;

-- ─────────────────────────────────────────────────────────────────────
-- 2) Trigger güncellemesi — banli alanı kullanıcı tarafından değişmesin
-- ─────────────────────────────────────────────────────────────────────
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
  -- Yeni: ban alanları sadece admin RPC üzerinden değişebilir
  new.banli := old.banli;
  new.ban_sebep := old.ban_sebep;
  new.ban_tarihi := old.ban_tarihi;
  return new;
end $fn$;

-- ─────────────────────────────────────────────────────────────────────
-- 3) Banlı kullanıcı engellemeleri
--    Banlı kullanıcı yeni ilerleme/hata bildirimi/rozet kaydı yapamaz.
--    SELECT erişimi açık kalır (kendi geçmişini görebilir, hata anladığında).
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.kullanici_banli_mi()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select banli from kullanicilar where id = auth.uid()),
    false
  );
$$;

-- ilerleme: banlı INSERT engelli
drop policy if exists "ilerleme_insert_self" on ilerleme;
create policy "ilerleme_insert_self" on ilerleme
  for insert with check (auth.uid() = user_id and not kullanici_banli_mi());

-- soru_hatalari: banlı INSERT engelli
drop policy if exists "hata_insert_self" on soru_hatalari;
create policy "hata_insert_self" on soru_hatalari
  for insert with check (auth.uid() = user_id and not kullanici_banli_mi());

-- ─────────────────────────────────────────────────────────────────────
-- 4) Admin RPC'leri — banla, unbanla, sil
-- ─────────────────────────────────────────────────────────────────────

create or replace function public.admin_kullanici_banla(
  _user_id uuid,
  _sebep text
)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  update kullanicilar
    set banli = true,
        ban_sebep = _sebep,
        ban_tarihi = now()
    where id = _user_id;

  if not found then
    raise exception 'Kullanıcı bulunamadı: %', _user_id;
  end if;
end;
$fn$;

create or replace function public.admin_kullanici_unbanla(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  update kullanicilar
    set banli = false,
        ban_sebep = null,
        ban_tarihi = null
    where id = _user_id;

  if not found then
    raise exception 'Kullanıcı bulunamadı: %', _user_id;
  end if;
end;
$fn$;

create or replace function public.admin_kullanici_sil(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  -- Admin kendini silemez (yanlışlıkla erişimi yok etmesin)
  if _user_id = auth.uid() then
    raise exception 'Admin kendi hesabını bu RPC ile silemez. Profil > hesap sil kullan.';
  end if;

  -- auth.users delete cascade ile kullanicilar siler,
  -- oradan ilerleme/aktivite/rozet/hata cascade
  -- odemeler.user_id null'a çevrilir (audit)
  delete from auth.users where id = _user_id;

  if not found then
    raise exception 'Kullanıcı bulunamadı: %', _user_id;
  end if;
end;
$fn$;

revoke all on function public.admin_kullanici_banla(uuid, text) from public;
revoke all on function public.admin_kullanici_unbanla(uuid) from public;
revoke all on function public.admin_kullanici_sil(uuid) from public;

grant execute on function public.admin_kullanici_banla(uuid, text) to authenticated;
grant execute on function public.admin_kullanici_unbanla(uuid) to authenticated;
grant execute on function public.admin_kullanici_sil(uuid) to authenticated;

notify pgrst, 'reload schema';

commit;
