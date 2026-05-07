-- İndirim kodu sistemi
--
-- Admin kod üretir → kullanıcı checkout'ta girer → fiyat düşer.
-- İki kullanım senaryosu:
--   1) Pazarlama: "LAUNCH50" — herkese açık, %50 indirim, ilk 100 kişi
--   2) Bulk fulfillment: okul ödedi → admin "OKUL-XYZ" %100 max=30 üretir
--      → öğrenciler kodu girer → ücretsiz Premium aktive olur
--
-- %100 indirim → iyzico'ya hiç gidilmez, doğrudan aktivasyon (iyzico zaten
-- 0 TL ödeme kabul etmez).

create table if not exists indirim_kodlari (
  id uuid primary key default gen_random_uuid(),
  kod text unique not null check (length(kod) between 3 and 32),
  indirim_yuzde int not null check (indirim_yuzde between 1 and 100),
  -- null = sınırsız kullanım
  max_kullanim int check (max_kullanim is null or max_kullanim > 0),
  -- null = sınırsız geçerli
  bitis_tarihi timestamptz,
  aktif boolean not null default true,
  aciklama text,
  -- null = tüm planlar; spesifikse sadece o plan için
  plan_kodu text references planlar(kod) on delete restrict,
  created_at timestamptz not null default now(),
  olusturan_id uuid references auth.users(id) on delete set null
);

create index indirim_kodlari_kod_idx on indirim_kodlari (kod);
create index indirim_kodlari_aktif_idx on indirim_kodlari (aktif) where aktif = true;

create table if not exists indirim_kullanimlari (
  id uuid primary key default gen_random_uuid(),
  indirim_id uuid not null references indirim_kodlari(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  odeme_id uuid references odemeler(id) on delete set null,
  kullanildi_at timestamptz not null default now(),
  -- bir kullanıcı bir kodu yalnızca 1 kez kullanabilir
  unique (indirim_id, user_id)
);

create index indirim_kullanimlari_indirim_idx on indirim_kullanimlari (indirim_id);
create index indirim_kullanimlari_user_idx on indirim_kullanimlari (user_id);

-- odemeler tablosuna indirim referansı
alter table odemeler
  add column if not exists indirim_id uuid references indirim_kodlari(id) on delete set null;
alter table odemeler
  add column if not exists indirim_yuzde int check (indirim_yuzde is null or indirim_yuzde between 0 and 100);
alter table odemeler
  add column if not exists indirim_oncesi_tutar numeric(10,2);

-- =====================================================================
-- RLS
-- =====================================================================
alter table indirim_kodlari enable row level security;
alter table indirim_kullanimlari enable row level security;

-- Adminler her şeyi yapabilir
create policy "indirim_kodlari_admin_all" on indirim_kodlari
  for all using (is_admin()) with check (is_admin());

create policy "indirim_kullanimlari_admin_all" on indirim_kullanimlari
  for all using (is_admin()) with check (is_admin());

-- Kullanıcılar kendi kullanımlarını görebilir (profil sayfası için)
create policy "indirim_kullanimlari_kendi" on indirim_kullanimlari
  for select using (auth.uid() = user_id);

-- Public listing kapalı — kodlar gizli, doğrulama RPC ile yapılır

-- =====================================================================
-- RPC: indirim_dogrula
--   Frontend preview için: kullanıcı kodu girince anında check.
--   Returns: { gecerli, indirim_yuzde, sebep, indirim_id }
-- =====================================================================
create or replace function public.indirim_dogrula(
  _kod text,
  _plan_kodu text default null
) returns table (
  gecerli boolean,
  indirim_yuzde int,
  sebep text,
  indirim_id uuid
)
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_uid uuid := auth.uid();
  v_rec indirim_kodlari%rowtype;
  v_kullanim_sayisi int;
begin
  if v_uid is null then
    return query select false, 0, 'Giriş yapmalısın'::text, null::uuid;
    return;
  end if;

  select * into v_rec from indirim_kodlari where upper(kod) = upper(_kod) limit 1;
  if not found then
    return query select false, 0, 'Kod bulunamadı'::text, null::uuid;
    return;
  end if;

  if not v_rec.aktif then
    return query select false, 0, 'Kod aktif değil'::text, v_rec.id;
    return;
  end if;

  if v_rec.bitis_tarihi is not null and v_rec.bitis_tarihi < now() then
    return query select false, 0, 'Kodun süresi doldu'::text, v_rec.id;
    return;
  end if;

  -- Plan-spesifik mi kontrol et
  if v_rec.plan_kodu is not null and _plan_kodu is not null
     and v_rec.plan_kodu <> _plan_kodu then
    return query select false, 0, format('Bu kod sadece %s planı için geçerli', v_rec.plan_kodu)::text, v_rec.id;
    return;
  end if;

  -- Kullanım limiti
  if v_rec.max_kullanim is not null then
    select count(*) into v_kullanim_sayisi from indirim_kullanimlari where indirim_id = v_rec.id;
    if v_kullanim_sayisi >= v_rec.max_kullanim then
      return query select false, 0, 'Kod kullanım limiti doldu'::text, v_rec.id;
      return;
    end if;
  end if;

  -- Kullanıcı bu kodu daha önce kullanmış mı?
  if exists (select 1 from indirim_kullanimlari where indirim_id = v_rec.id and user_id = v_uid) then
    return query select false, 0, 'Bu kodu zaten kullanmışsın'::text, v_rec.id;
    return;
  end if;

  return query select true, v_rec.indirim_yuzde, 'Geçerli'::text, v_rec.id;
end;
$fn$;

grant execute on function public.indirim_dogrula(text, text) to authenticated;

-- =====================================================================
-- RPC: indirim_kullan_ucretsiz
--   %100 indirim case için: iyzico'ya gidilmez, direkt aktive ediliyor.
--   Atomik: indirim_dogrula tekrar yapar (race protection), kullanım kaydı
--   atar, premium_bitis günceller, odemeler row'u oluşturur.
-- =====================================================================
create or replace function public.indirim_kullan_ucretsiz(
  _kod text,
  _plan_kodu text
) returns table (
  basarili boolean,
  yeni_premium_bitis timestamptz,
  hata text
)
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_uid uuid := auth.uid();
  v_rec indirim_kodlari%rowtype;
  v_plan planlar%rowtype;
  v_kullanim_sayisi int;
  v_odeme_id uuid;
  v_yeni_bitis timestamptz;
  v_mevcut_bitis timestamptz;
begin
  if v_uid is null then
    return query select false, null::timestamptz, 'Giriş yapmalısın'::text;
    return;
  end if;

  -- Plan
  select * into v_plan from planlar where kod = _plan_kodu and aktif = true;
  if not found then
    return query select false, null::timestamptz, 'Plan bulunamadı'::text;
    return;
  end if;

  -- Kod (FOR UPDATE → race protection)
  select * into v_rec from indirim_kodlari where upper(kod) = upper(_kod) for update;
  if not found then
    return query select false, null::timestamptz, 'Kod bulunamadı'::text;
    return;
  end if;
  if not v_rec.aktif then
    return query select false, null::timestamptz, 'Kod aktif değil'::text;
    return;
  end if;
  if v_rec.bitis_tarihi is not null and v_rec.bitis_tarihi < now() then
    return query select false, null::timestamptz, 'Kodun süresi doldu'::text;
    return;
  end if;
  if v_rec.indirim_yuzde < 100 then
    return query select false, null::timestamptz, 'Bu RPC sadece %100 indirim kodları için'::text;
    return;
  end if;
  if v_rec.plan_kodu is not null and v_rec.plan_kodu <> _plan_kodu then
    return query select false, null::timestamptz, format('Kod sadece %s planı için geçerli', v_rec.plan_kodu)::text;
    return;
  end if;
  if v_rec.max_kullanim is not null then
    select count(*) into v_kullanim_sayisi from indirim_kullanimlari where indirim_id = v_rec.id;
    if v_kullanim_sayisi >= v_rec.max_kullanim then
      return query select false, null::timestamptz, 'Kod kullanım limiti doldu'::text;
      return;
    end if;
  end if;
  if exists (select 1 from indirim_kullanimlari where indirim_id = v_rec.id and user_id = v_uid) then
    return query select false, null::timestamptz, 'Bu kodu zaten kullanmışsın'::text;
    return;
  end if;

  -- Premium bitiş tarihini hesapla (mevcut + ay_sayisi)
  select premium_bitis into v_mevcut_bitis from kullanicilar where id = v_uid;
  v_yeni_bitis := greatest(coalesce(v_mevcut_bitis, now()), now())
                  + (v_plan.ay_sayisi || ' months')::interval;

  -- odemeler kaydı (durum='basarili', tutar=0)
  insert into odemeler (
    user_id, conversation_id, plan_kodu, tutar, para_birimi,
    donem, durum, basarili_tarih, indirim_id, indirim_yuzde,
    indirim_oncesi_tutar, adet
  )
  values (
    v_uid, 'free-' || gen_random_uuid()::text, v_plan.kod, 0, v_plan.para_birimi,
    'aylik', 'basarili', now(), v_rec.id, 100,
    v_plan.tutar, 1
  )
  returning id into v_odeme_id;

  -- Kullanım kaydı
  insert into indirim_kullanimlari (indirim_id, user_id, odeme_id)
    values (v_rec.id, v_uid, v_odeme_id);

  -- premium_bitis güncelle
  update kullanicilar set premium_bitis = v_yeni_bitis where id = v_uid;

  return query select true, v_yeni_bitis, null::text;
end;
$fn$;

grant execute on function public.indirim_kullan_ucretsiz(text, text) to authenticated;

-- =====================================================================
-- RPC: admin_indirim_kullanim_sayisi (admin liste için)
-- =====================================================================
create or replace function public.admin_indirim_kullanim_sayisi(_indirim_id uuid)
returns int
language sql
security definer
set search_path = public
as $$
  select count(*)::int from indirim_kullanimlari where indirim_id = _indirim_id;
$$;

grant execute on function public.admin_indirim_kullanim_sayisi(uuid) to authenticated;

-- Admin RLS sayesinde admin paneli direkt insert/select yapabilir
