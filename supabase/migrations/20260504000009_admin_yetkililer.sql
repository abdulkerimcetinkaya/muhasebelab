-- Sprint 5: admin DB tablosu + ilerleme sıfırlama
-- adminler tablosu: hardcoded email yerine veritabanı bazlı admin yönetimi
-- is_admin() fonksiyonu yeniden tanımlandı

begin;

-- ─────────────────────────────────────────────────────────────────────
-- 1) adminler tablosu
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.adminler (
  user_id uuid primary key references public.kullanicilar(id) on delete cascade,
  email text not null,
  eklenen_at timestamptz not null default now(),
  ekleyen_id uuid references public.kullanicilar(id) on delete set null
);

-- Mevcut admin'i (kerim.cetinkayaa78@gmail.com) seed et
insert into public.adminler (user_id, email)
  select id, email from auth.users where email = 'kerim.cetinkayaa78@gmail.com'
  on conflict (user_id) do nothing;

-- ─────────────────────────────────────────────────────────────────────
-- 2) is_admin() yeni implementasyon (tablo bazlı)
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.adminler where user_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────────────────────────────
-- 3) RLS — sadece admin tabloyu görür/yazar
-- ─────────────────────────────────────────────────────────────────────
alter table public.adminler enable row level security;

drop policy if exists "adminler_admin_all" on public.adminler;
create policy "adminler_admin_all" on public.adminler
  for all using (is_admin()) with check (is_admin());

-- ─────────────────────────────────────────────────────────────────────
-- 4) Admin ekle/çıkar RPC'leri
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.admin_ekle(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_email text;
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  select email into v_email from auth.users where id = _user_id;
  if v_email is null then
    raise exception 'Kullanıcı (auth.users) bulunamadı';
  end if;

  insert into adminler (user_id, email, ekleyen_id)
    values (_user_id, v_email, auth.uid())
    on conflict (user_id) do nothing;
end;
$fn$;

create or replace function public.admin_cikar(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  -- Son admin silinemez
  if (select count(*) from adminler) <= 1 then
    raise exception 'Son admin çıkarılamaz — önce başka bir admin ekle';
  end if;

  -- Admin kendini çıkartabilir ama dikkat — uyarıyı UI verir
  delete from adminler where user_id = _user_id;
end;
$fn$;

-- ─────────────────────────────────────────────────────────────────────
-- 5) İlerleme sıfırlama RPC
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.admin_ilerleme_sifirla(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  delete from ilerleme where user_id = _user_id;
  delete from aktivite where user_id = _user_id;
  delete from kazanilan_rozetler where user_id = _user_id;

  update kullanicilar
    set gunluk_cozum_sayisi = 0,
        gunluk_limit_reset = null
    where id = _user_id;
end;
$fn$;

revoke all on function public.admin_ekle(uuid) from public;
revoke all on function public.admin_cikar(uuid) from public;
revoke all on function public.admin_ilerleme_sifirla(uuid) from public;

grant execute on function public.admin_ekle(uuid) to authenticated;
grant execute on function public.admin_cikar(uuid) to authenticated;
grant execute on function public.admin_ilerleme_sifirla(uuid) to authenticated;

notify pgrst, 'reload schema';

commit;
