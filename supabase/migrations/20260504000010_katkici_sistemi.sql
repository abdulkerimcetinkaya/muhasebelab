-- Katkıcı sistemi: meslek mensupları (SMMM) ve akademisyenler için içerik ekleme
-- Akış:
--   1. Kullanıcı /katkici-basvuru sayfasından başvurur
--   2. Admin /admin/katkicilar'dan onaylar/reddeder
--   3. Onaylanırsa is_katkici=true → soru ekleyebilir (otomatik durum=inceleme)
--   4. Admin sorular panelinden inceler ve yayına çıkarır
--   5. 5 onaylı katkıdan sonra otomatik 1 yıl Premium hediye

begin;

-- ─────────────────────────────────────────────────────────────────────
-- 1) kullanicilar.is_katkici kolonu
-- ─────────────────────────────────────────────────────────────────────
alter table kullanicilar add column if not exists is_katkici boolean not null default false;
create index if not exists kullanicilar_is_katkici_idx on kullanicilar(is_katkici) where is_katkici;

-- ─────────────────────────────────────────────────────────────────────
-- 2) sorular.ekleyen_id (yazar)
-- ─────────────────────────────────────────────────────────────────────
alter table sorular add column if not exists ekleyen_id uuid references kullanicilar(id) on delete set null;
create index if not exists sorular_ekleyen_id_idx on sorular(ekleyen_id) where ekleyen_id is not null;

-- ─────────────────────────────────────────────────────────────────────
-- 3) katkici_basvurulari tablosu
-- ─────────────────────────────────────────────────────────────────────
create table if not exists katkici_basvurulari (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references kullanicilar(id) on delete cascade,
  ad_soyad text not null check (length(ad_soyad) between 3 and 120),
  unvan text not null check (unvan in ('akademisyen', 'smmm', 'smmm_stajer', 'diger')),
  kurum text check (length(kurum) <= 200),
  iletisim_email text check (length(iletisim_email) <= 200),
  aciklama text not null check (length(aciklama) between 50 and 2000),
  durum text not null default 'beklemede'
    check (durum in ('beklemede', 'onayli', 'reddedildi')),
  red_sebep text,
  created_at timestamptz not null default now(),
  karar_at timestamptz,
  karar_veren_id uuid references kullanicilar(id) on delete set null
);

create index if not exists katkici_basvuru_durum_idx on katkici_basvurulari(durum);
create index if not exists katkici_basvuru_user_id_idx on katkici_basvurulari(user_id);

alter table katkici_basvurulari enable row level security;

-- Kullanıcı kendi başvurusunu görür
drop policy if exists "katkici_basvuru_self_read" on katkici_basvurulari;
create policy "katkici_basvuru_self_read" on katkici_basvurulari
  for select using (auth.uid() = user_id);

-- Kullanıcı kendi başvurusunu yazar (sadece beklemede ise update edilemez)
drop policy if exists "katkici_basvuru_self_insert" on katkici_basvurulari;
create policy "katkici_basvuru_self_insert" on katkici_basvurulari
  for insert with check (auth.uid() = user_id);

-- Admin tüm başvuruları görür/yazar
drop policy if exists "katkici_basvuru_admin_all" on katkici_basvurulari;
create policy "katkici_basvuru_admin_all" on katkici_basvurulari
  for all using (is_admin()) with check (is_admin());

-- Onaylı başvuruların ad_soyad+unvan'ı kamuya açık (soru sayfasında yazar gösterimi için)
drop policy if exists "katkici_basvuru_yazar_public" on katkici_basvurulari;
create policy "katkici_basvuru_yazar_public" on katkici_basvurulari
  for select using (durum = 'onayli');

-- ─────────────────────────────────────────────────────────────────────
-- 4) sorular INSERT politikası — katkıcı sadece durum='inceleme' ile ekleyebilir
--    Mevcut admin policy zaten var (sorular_admin_all)
-- ─────────────────────────────────────────────────────────────────────
drop policy if exists "sorular_katkici_insert" on sorular;
create policy "sorular_katkici_insert" on sorular
  for insert with check (
    auth.uid() is not null
    and (
      is_admin()
      or (
        durum = 'inceleme'
        and ekleyen_id = auth.uid()
        and exists (
          select 1 from kullanicilar
          where id = auth.uid() and is_katkici = true and not coalesce(banli, false)
        )
      )
    )
  );

-- Katkıcı kendi gönderdiği soruları görebilir (taslak/inceleme dahil)
drop policy if exists "sorular_katkici_self_read" on sorular;
create policy "sorular_katkici_self_read" on sorular
  for select using (
    durum = 'onayli'
    or is_admin()
    or (auth.uid() is not null and ekleyen_id = auth.uid())
  );

-- Mevcut "katalog_public_read_sorular" yayında olanları gösterir, koruyalım
-- (yukarıdaki policy zaten kapsıyor)

-- cozumler: katkıcı kendi sorusu için cozum ekleyebilir
drop policy if exists "cozumler_katkici_insert" on cozumler;
create policy "cozumler_katkici_insert" on cozumler
  for insert with check (
    is_admin()
    or exists (
      select 1 from sorular s
      where s.id = soru_id
        and s.ekleyen_id = auth.uid()
        and s.durum = 'inceleme'
    )
  );

-- ─────────────────────────────────────────────────────────────────────
-- 5) RPC: katkici_basvur — kullanıcı başvurur
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.katkici_basvur(
  _ad_soyad text,
  _unvan text,
  _kurum text,
  _iletisim_email text,
  _aciklama text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
begin
  if v_uid is null then
    raise exception 'Oturum yok';
  end if;

  -- Mevcut başvuru varsa engelle
  if exists (select 1 from katkici_basvurulari where user_id = v_uid and durum in ('beklemede', 'onayli')) then
    raise exception 'Aktif veya bekleyen başvuru zaten var';
  end if;

  -- Reddedilmiş varsa silip yeniden başvur
  delete from katkici_basvurulari where user_id = v_uid and durum = 'reddedildi';

  insert into katkici_basvurulari (user_id, ad_soyad, unvan, kurum, iletisim_email, aciklama)
    values (v_uid, _ad_soyad, _unvan, _kurum, _iletisim_email, _aciklama)
    returning id into v_id;

  return v_id;
end;
$fn$;

-- ─────────────────────────────────────────────────────────────────────
-- 6) RPC: admin_katkici_onayla
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.admin_katkici_onayla(_basvuru_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_user_id uuid;
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  select user_id into v_user_id from katkici_basvurulari
    where id = _basvuru_id and durum = 'beklemede';

  if v_user_id is null then
    raise exception 'Başvuru bulunamadı veya zaten karar verilmiş';
  end if;

  update katkici_basvurulari
    set durum = 'onayli',
        karar_at = now(),
        karar_veren_id = auth.uid(),
        red_sebep = null
    where id = _basvuru_id;

  update kullanicilar set is_katkici = true where id = v_user_id;
end;
$fn$;

-- ─────────────────────────────────────────────────────────────────────
-- 7) RPC: admin_katkici_reddet
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.admin_katkici_reddet(_basvuru_id uuid, _sebep text)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  update katkici_basvurulari
    set durum = 'reddedildi',
        red_sebep = _sebep,
        karar_at = now(),
        karar_veren_id = auth.uid()
    where id = _basvuru_id and durum = 'beklemede';

  if not found then
    raise exception 'Başvuru bulunamadı veya zaten karar verilmiş';
  end if;
end;
$fn$;

-- ─────────────────────────────────────────────────────────────────────
-- 8) RPC: admin_katkici_yetki_kaldir — admin gerekirse katkıcı yetkisini iptal eder
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.admin_katkici_yetki_kaldir(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  if not is_admin() then
    raise exception 'Yetkisiz';
  end if;

  update kullanicilar set is_katkici = false where id = _user_id;

  -- Geçerli onaylı başvuruyu da geriye çek (audit için kayıt durur)
  update katkici_basvurulari
    set durum = 'reddedildi',
        red_sebep = 'Admin tarafından yetki kaldırıldı',
        karar_at = now(),
        karar_veren_id = auth.uid()
    where user_id = _user_id and durum = 'onayli';
end;
$fn$;

-- ─────────────────────────────────────────────────────────────────────
-- 9) Trigger: 5 onaylı katkıda 1 yıl Premium hediye
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.katkici_premium_odul_tetikle()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_onayli_sayi int;
  v_mevcut_bitis timestamptz;
  v_yeni_bitis timestamptz;
begin
  -- Sadece soru taslaktan/incelemeden onayli'ya geçtiğinde say
  if (old.durum is null or old.durum != 'onayli') and new.durum = 'onayli' and new.ekleyen_id is not null then
    select count(*) into v_onayli_sayi
      from sorular
      where ekleyen_id = new.ekleyen_id and durum = 'onayli';

    -- Tam 5'inci olduğunda ödül ver (idempotent değil; sadece eşik geçildiğinde)
    if v_onayli_sayi = 5 then
      select premium_bitis into v_mevcut_bitis from kullanicilar where id = new.ekleyen_id;
      v_yeni_bitis := greatest(coalesce(v_mevcut_bitis, now()), now()) + interval '1 year';
      update kullanicilar set premium_bitis = v_yeni_bitis where id = new.ekleyen_id;
    end if;
  end if;
  return new;
end;
$fn$;

drop trigger if exists trg_katkici_premium_odul on sorular;
create trigger trg_katkici_premium_odul
  after update of durum on sorular
  for each row execute function katkici_premium_odul_tetikle();

revoke all on function public.katkici_basvur(text, text, text, text, text) from public;
revoke all on function public.admin_katkici_onayla(uuid) from public;
revoke all on function public.admin_katkici_reddet(uuid, text) from public;
revoke all on function public.admin_katkici_yetki_kaldir(uuid) from public;

grant execute on function public.katkici_basvur(text, text, text, text, text) to authenticated;
grant execute on function public.admin_katkici_onayla(uuid) to authenticated;
grant execute on function public.admin_katkici_reddet(uuid, text) to authenticated;
grant execute on function public.admin_katkici_yetki_kaldir(uuid) to authenticated;

notify pgrst, 'reload schema';

commit;
