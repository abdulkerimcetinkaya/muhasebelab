-- Katkıcı sistemi revizyonu:
--   - Unvanlar: akademisyen, ymm, smmm (smmm_stajer ve diger kaldırıldı)
--   - kurum NOT NULL
--   - iletisim_email NOT NULL
--   - aciklama NULL kabul edilecek (opsiyonel)

-- ─────────────────────────────────────────────────────────────────────
-- 1) Mevcut satırları yeni şemaya uydur (sistem henüz prod'da yok ama
--    güvenli olsun). smmm_stajer → smmm, diger → smmm.
-- ─────────────────────────────────────────────────────────────────────
update katkici_basvurulari
  set unvan = 'smmm'
  where unvan in ('smmm_stajer', 'diger');

-- Eski kayıtların boş kalan zorunlu alanlarına placeholder
update katkici_basvurulari
  set kurum = '—'
  where kurum is null;
update katkici_basvurulari
  set iletisim_email = '—'
  where iletisim_email is null;

-- ─────────────────────────────────────────────────────────────────────
-- 2) CHECK constraint'i yenile
-- ─────────────────────────────────────────────────────────────────────
alter table katkici_basvurulari
  drop constraint if exists katkici_basvurulari_unvan_check;

alter table katkici_basvurulari
  add constraint katkici_basvurulari_unvan_check
  check (unvan in ('akademisyen', 'ymm', 'smmm'));

-- ─────────────────────────────────────────────────────────────────────
-- 3) Sütun NULL kuralları
-- ─────────────────────────────────────────────────────────────────────
alter table katkici_basvurulari
  alter column kurum set not null,
  alter column iletisim_email set not null,
  alter column aciklama drop not null;

-- ─────────────────────────────────────────────────────────────────────
-- 4) RPC: kurum + iletisim zorunlu, aciklama opsiyonel
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

  if _ad_soyad is null or length(trim(_ad_soyad)) < 3 then
    raise exception 'Ad-soyad gerekli';
  end if;
  if _kurum is null or length(trim(_kurum)) = 0 then
    raise exception 'Kurum gerekli';
  end if;
  if _iletisim_email is null or length(trim(_iletisim_email)) = 0 then
    raise exception 'İletişim email gerekli';
  end if;

  if exists (
    select 1 from katkici_basvurulari
    where user_id = v_uid and durum in ('beklemede', 'onayli')
  ) then
    raise exception 'Aktif veya bekleyen başvuru zaten var';
  end if;

  delete from katkici_basvurulari where user_id = v_uid and durum = 'reddedildi';

  insert into katkici_basvurulari (user_id, ad_soyad, unvan, kurum, iletisim_email, aciklama)
    values (
      v_uid,
      trim(_ad_soyad),
      _unvan,
      trim(_kurum),
      trim(_iletisim_email),
      nullif(trim(coalesce(_aciklama, '')), '')
    )
    returning id into v_id;

  return v_id;
end;
$fn$;
