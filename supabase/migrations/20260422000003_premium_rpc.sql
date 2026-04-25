-- Premium erken erişim — kontenjan kontrolü ve atomik aktivasyon RPC'leri
-- RLS gereği kullanıcı diğer profilleri sayamaz, bu yüzden security definer fonksiyonlar kullanıyoruz.

-- =====================================================================
-- Kalan erken erişim kontenjanı (max 100)
-- =====================================================================
create or replace function public.premium_kontenjan_kalan()
returns int
language sql
security definer
set search_path = public
as $$
  select greatest(0, 100 - count(*)::int)
  from kullanicilar
  where premium_bitis is not null;
$$;

grant execute on function public.premium_kontenjan_kalan() to authenticated;

-- =====================================================================
-- Erken erişim aktivasyonu — atomik kontenjan kontrolü + 1 yıl premium
-- Hata: P0001 (kontenjan doldu) veya P0002 (zaten premium)
-- Dönüş: yeni premium_bitis tarihi
-- =====================================================================
create or replace function public.premium_erken_erisim_aktive()
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
  v_user uuid := auth.uid();
  v_mevcut timestamptz;
  v_yeni timestamptz;
begin
  if v_user is null then
    raise exception 'Oturum gerekli' using errcode = '42501';
  end if;

  select premium_bitis into v_mevcut from kullanicilar where id = v_user;
  if v_mevcut is not null and v_mevcut > now() then
    raise exception 'Premium üyelik zaten aktif' using errcode = 'P0002';
  end if;

  select count(*) into v_count from kullanicilar where premium_bitis is not null;
  if v_count >= 100 then
    raise exception 'Erken erişim kontenjanı doldu' using errcode = 'P0001';
  end if;

  v_yeni := now() + interval '1 year';
  update kullanicilar set premium_bitis = v_yeni where id = v_user;
  return v_yeni;
end $$;

grant execute on function public.premium_erken_erisim_aktive() to authenticated;
