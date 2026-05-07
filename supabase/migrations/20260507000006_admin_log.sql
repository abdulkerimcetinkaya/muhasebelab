-- Faz 3: admin audit log
--
-- Hangi admin ne zaman ne yaptı? Hangi user'ı etkiledi?
-- Tüm admin RPC'leri çağrıldığında bir satır insert edilir.

create table if not exists public.admin_log (
  id uuid primary key default gen_random_uuid(),
  -- işlemi yapan admin
  admin_id uuid not null references auth.users(id) on delete set null,
  admin_email text not null,
  -- işlem türü (örn: 'premium_ayarla', 'kullanici_banla', 'admin_ekle')
  islem text not null,
  -- işlemin etkilediği user (varsa)
  hedef_user_id uuid references auth.users(id) on delete set null,
  hedef_email text,
  -- ek detay (her işlemin kendine özgü alanı): jsonb
  detay jsonb,
  -- ne zaman
  yapilan_at timestamptz not null default now()
);

create index admin_log_admin_idx on admin_log (admin_id, yapilan_at desc);
create index admin_log_hedef_idx on admin_log (hedef_user_id, yapilan_at desc) where hedef_user_id is not null;
create index admin_log_islem_idx on admin_log (islem, yapilan_at desc);

alter table admin_log enable row level security;

-- Admin'ler logu görür (her admin değil, sadece super)
create policy "admin_log_super_select" on admin_log
  for select using (is_admin('super'));

-- Insert sadece security definer fonksiyonlar tarafından (kullanıcı direkt insert edemez)
-- Bu yüzden insert policy yok.

-- =====================================================================
-- Helper: log yaz
-- =====================================================================
create or replace function public.admin_log_yaz(
  _islem text,
  _hedef_user_id uuid default null,
  _detay jsonb default null
) returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_admin_email text;
  v_hedef_email text;
begin
  if auth.uid() is null then
    return; -- system call, log atma
  end if;

  select email into v_admin_email from auth.users where id = auth.uid();
  if _hedef_user_id is not null then
    select email into v_hedef_email from auth.users where id = _hedef_user_id;
  end if;

  insert into admin_log (admin_id, admin_email, islem, hedef_user_id, hedef_email, detay)
    values (auth.uid(), coalesce(v_admin_email, '?'), _islem, _hedef_user_id, v_hedef_email, _detay);
end;
$fn$;

-- =====================================================================
-- Mevcut admin RPC'lerini log_yaz çağrılı olarak güncelle
-- =====================================================================

create or replace function public.admin_premium_ayarla(
  _user_id uuid,
  _yeni_bitis timestamptz
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;
  update kullanicilar set premium_bitis = _yeni_bitis where id = _user_id;
  perform admin_log_yaz('premium_ayarla', _user_id,
    jsonb_build_object('yeni_bitis', _yeni_bitis));
  return _yeni_bitis;
end;
$fn$;

create or replace function public.admin_ilerleme_sifirla(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;

  delete from ilerleme where user_id = _user_id;
  delete from aktivite where user_id = _user_id;
  delete from kazanilan_rozetler where user_id = _user_id;

  update kullanicilar
    set gunluk_cozum_sayisi = 0,
        gunluk_limit_reset = null
    where id = _user_id;

  perform admin_log_yaz('ilerleme_sifirla', _user_id, null);
end;
$fn$;

create or replace function public.admin_ekle(_user_id uuid, _roller text[] default '{operasyon}')
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_email text;
begin
  if not is_admin('super') then
    raise exception 'Yetkisiz — sadece super admin ekleyebilir';
  end if;

  select email into v_email from auth.users where id = _user_id;
  if v_email is null then
    raise exception 'Kullanıcı (auth.users) bulunamadı';
  end if;

  insert into adminler (user_id, email, roller, ekleyen_id)
    values (_user_id, v_email, _roller, auth.uid())
    on conflict (user_id) do update set roller = excluded.roller;

  update kullanicilar set admin_only = true where id = _user_id;

  perform admin_log_yaz('admin_ekle', _user_id,
    jsonb_build_object('roller', _roller));
end;
$fn$;

create or replace function public.admin_cikar(_user_id uuid)
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

  if (select count(*) from adminler) <= 1 then
    raise exception 'Son admin çıkarılamaz';
  end if;

  select email into v_email from auth.users where id = _user_id;

  delete from adminler where user_id = _user_id;
  update kullanicilar set admin_only = false where id = _user_id;

  perform admin_log_yaz('admin_cikar', _user_id,
    jsonb_build_object('email', v_email));
end;
$fn$;

create or replace function public.admin_rolleri_guncelle(_user_id uuid, _roller text[])
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_eski_roller text[];
begin
  if not is_admin('super') then
    raise exception 'Yetkisiz — sadece super admin rolleri değiştirebilir';
  end if;

  if not 'super' = ANY(_roller) then
    if (select count(*) from adminler where 'super' = ANY(roller)) <= 1
       and exists (select 1 from adminler where user_id = _user_id and 'super' = ANY(roller)) then
      raise exception 'Son super admin''den super rolü alamazsın';
    end if;
  end if;

  select roller into v_eski_roller from adminler where user_id = _user_id;
  update adminler set roller = _roller where user_id = _user_id;

  perform admin_log_yaz('admin_roller_guncelle', _user_id,
    jsonb_build_object('eski_roller', v_eski_roller, 'yeni_roller', _roller));
end;
$fn$;

create or replace function public.admin_katkici_onayla(_basvuru_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_user_id uuid;
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;
  update katkici_basvurulari
    set durum = 'onayli',
        karar_at = now(),
        karar_veren_id = auth.uid()
    where id = _basvuru_id and durum = 'beklemede'
    returning user_id into v_user_id;
  if v_user_id is not null then
    update kullanicilar set is_katkici = true where id = v_user_id;
    perform admin_log_yaz('katkici_onayla', v_user_id,
      jsonb_build_object('basvuru_id', _basvuru_id));
  end if;
end;
$fn$;

create or replace function public.admin_katkici_reddet(_basvuru_id uuid, _sebep text)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_user_id uuid;
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;
  select user_id into v_user_id from katkici_basvurulari where id = _basvuru_id;
  update katkici_basvurulari
    set durum = 'reddedildi',
        red_sebep = _sebep,
        karar_at = now(),
        karar_veren_id = auth.uid()
    where id = _basvuru_id;
  if v_user_id is not null then
    perform admin_log_yaz('katkici_reddet', v_user_id,
      jsonb_build_object('basvuru_id', _basvuru_id, 'sebep', _sebep));
  end if;
end;
$fn$;

create or replace function public.admin_katkici_yetki_kaldir(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;
  update kullanicilar set is_katkici = false where id = _user_id;
  perform admin_log_yaz('katkici_yetki_kaldir', _user_id, null);
end;
$fn$;

create or replace function public.admin_kullanici_banla(_user_id uuid, _sebep text)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;

  update kullanicilar
    set banli = true,
        ban_sebep = _sebep,
        ban_tarihi = now()
    where id = _user_id;

  if not found then
    raise exception 'Kullanıcı bulunamadı: %', _user_id;
  end if;

  perform admin_log_yaz('kullanici_banla', _user_id,
    jsonb_build_object('sebep', _sebep));
end;
$fn$;

create or replace function public.admin_kullanici_unbanla(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;

  update kullanicilar
    set banli = false,
        ban_sebep = null,
        ban_tarihi = null
    where id = _user_id;

  if not found then
    raise exception 'Kullanıcı bulunamadı: %', _user_id;
  end if;

  perform admin_log_yaz('kullanici_unbanla', _user_id, null);
end;
$fn$;

-- admin_kullanici_sil: hassas işlem — log atılır ama auth.users cascade
-- delete olduğu için hedef_user_id null olabilir. log'a hedef_email ile
-- referans bırakırız.
create or replace function public.admin_kullanici_sil(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_email text;
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;

  select email into v_email from auth.users where id = _user_id;

  -- Önce log yaz (kullanıcı silinmeden, hedef_email kayıtlı kalır)
  perform admin_log_yaz('kullanici_sil', null,
    jsonb_build_object('silinen_email', v_email, 'silinen_id', _user_id));

  -- auth.users cascade delete kullanicilar + ilgili tablolara yansır
  delete from auth.users where id = _user_id;
end;
$fn$;

notify pgrst, 'reload schema';
