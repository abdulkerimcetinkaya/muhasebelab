-- Faz 2: rol bazlı admin yetki sistemi
--
-- Rol modeli (3 rol):
--   - 'super'     → her şey + admin atama/çıkarma yetkisi
--   - 'icerik'    → sorular, üniteler, konular, mevzuat, sözlük, hesap planı
--   - 'operasyon' → premium, ban, sil, hata bildirimleri, katkıcı başvuruları,
--                   bildirimler, indirim kodları, ödemeler
--
-- is_admin(role) çağrıları:
--   - is_admin()             → her admin true (geriye dönük uyum)
--   - is_admin('icerik')     → super VEYA icerik
--   - is_admin('operasyon')  → super VEYA operasyon
--   - is_admin('super')      → sadece super
--
-- Mevcut admin'ler super olarak seed edilir.

-- =====================================================================
-- 1) roller kolonu
-- =====================================================================
alter table adminler
  add column if not exists roller text[] not null default '{}';

create or replace function public.adminler_roller_check()
returns trigger language plpgsql as $fn$
begin
  -- Geçerli roller: super, icerik, operasyon
  if exists (
    select 1 from unnest(new.roller) r
    where r not in ('super', 'icerik', 'operasyon')
  ) then
    raise exception 'Geçersiz rol — sadece super/icerik/operasyon kabul edilir';
  end if;
  return new;
end;
$fn$;

drop trigger if exists adminler_roller_check_tg on adminler;
create trigger adminler_roller_check_tg
  before insert or update on adminler
  for each row execute function public.adminler_roller_check();

-- Mevcut admin'leri super yap
update adminler set roller = '{super}'
  where array_length(roller, 1) is null or roller = '{}';

-- =====================================================================
-- 2) is_admin(role) — opsiyonel rol parametresi
-- =====================================================================
create or replace function public.is_admin(_role text default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.adminler
    where user_id = auth.uid()
      and (
        _role is null
        or 'super' = ANY(roller)
        or _role = ANY(roller)
      )
  );
$$;

grant execute on function public.is_admin(text) to authenticated, anon;

-- =====================================================================
-- 3) admin_ekle: rol parametreli
-- =====================================================================
create or replace function public.admin_ekle(_user_id uuid, _roller text[] default '{operasyon}')
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_email text;
begin
  -- Sadece super admin yeni admin ekleyebilir
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
end;
$fn$;

-- admin_rolleri_guncelle: super admin başkasının rollerini değiştirir
create or replace function public.admin_rolleri_guncelle(_user_id uuid, _roller text[])
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin('super') then
    raise exception 'Yetkisiz — sadece super admin rolleri değiştirebilir';
  end if;

  -- Son super admin'in super rolünü kaldıramazsın
  if not 'super' = ANY(_roller) then
    if (select count(*) from adminler where 'super' = ANY(roller)) <= 1
       and exists (select 1 from adminler where user_id = _user_id and 'super' = ANY(roller)) then
      raise exception 'Son super admin''den super rolü alamazsın';
    end if;
  end if;

  update adminler set roller = _roller where user_id = _user_id;
end;
$fn$;

grant execute on function public.admin_ekle(uuid, text[]) to authenticated;
grant execute on function public.admin_rolleri_guncelle(uuid, text[]) to authenticated;

-- =====================================================================
-- 4) RLS policies — rol bazlı erişim
--    Sadece kritik tablolar için. Diğerleri is_admin() (any admin) kalır.
-- =====================================================================

-- adminler: SADECE super
drop policy if exists "adminler_admin_all" on public.adminler;
create policy "adminler_super_all" on public.adminler
  for all using (is_admin('super')) with check (is_admin('super'));

-- İçerik (sorular, cozumler, unites, hesap_plani, mevzuat_chunklar,
-- sozluk_terimleri, unite_konulari, muavin_hesaplar)
drop policy if exists "sorular_admin_all" on sorular;
create policy "sorular_icerik_all" on sorular
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

drop policy if exists "cozumler_admin_all" on cozumler;
create policy "cozumler_icerik_all" on cozumler
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

drop policy if exists "unites_admin_all" on unites;
create policy "unites_icerik_all" on unites
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

drop policy if exists "hesap_plani_admin_all" on hesap_plani;
create policy "hesap_plani_icerik_all" on hesap_plani
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

-- Operasyon (kullanıcı yönetimi, premium, moderasyon, bildirim, indirim,
-- katkıcı, hata)
drop policy if exists "soru_hatalari_admin_all" on soru_hatalari;
create policy "soru_hatalari_operasyon_all" on soru_hatalari
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

drop policy if exists "indirim_kodlari_admin_all" on indirim_kodlari;
create policy "indirim_kodlari_operasyon_all" on indirim_kodlari
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

drop policy if exists "indirim_kullanimlari_admin_all" on indirim_kullanimlari;
create policy "indirim_kullanimlari_operasyon_all" on indirim_kullanimlari
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

-- =====================================================================
-- 5) Admin RPC'lerinin role check'leri güçlendirilir
-- =====================================================================

-- premium yönetimi → operasyon
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
  return _yeni_bitis;
end;
$fn$;

-- ilerleme sıfırlama → operasyon
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
end;
$fn$;

-- katkıcı yönetimi → operasyon
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
  end if;
end;
$fn$;

create or replace function public.admin_katkici_reddet(_basvuru_id uuid, _sebep text)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin('operasyon') then
    raise exception 'Yetkisiz — operasyon rolü gerekli';
  end if;
  update katkici_basvurulari
    set durum = 'reddedildi',
        red_sebep = _sebep,
        karar_at = now(),
        karar_veren_id = auth.uid()
    where id = _basvuru_id;
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
end;
$fn$;

notify pgrst, 'reload schema';
