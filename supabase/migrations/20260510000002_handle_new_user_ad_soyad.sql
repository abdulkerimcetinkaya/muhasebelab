-- =====================================================================
-- handle_new_user: ad/soyad'ı raw_user_meta_data'dan oku
-- =====================================================================
-- Email kayıt: kayıt formundan ad / soyad metadata'da gelir
-- Google OAuth: Google given_name / family_name (ya da name) gelir
-- Trigger her iki kaynaktan kullanicilar.ad ve .soyad'ı doldurur.
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_ad text;
  v_first_name text;
  v_last_name text;
  v_full_name text;
  v_space_pos int;
begin
  -- Kullanıcı adı (mevcut davranış korunuyor)
  v_ad := nullif(trim(new.raw_user_meta_data->>'kullanici_adi'), '');
  if v_ad is null then
    v_ad := 'Kullanici_' || substring(new.id::text, 1, 8);
  end if;

  -- Ad / Soyad: önce e-posta kayıt formundan (ad / soyad)
  v_first_name := nullif(trim(new.raw_user_meta_data->>'ad'), '');
  v_last_name  := nullif(trim(new.raw_user_meta_data->>'soyad'), '');

  -- Sonra Google OAuth (given_name / family_name)
  if v_first_name is null then
    v_first_name := nullif(trim(new.raw_user_meta_data->>'given_name'), '');
  end if;
  if v_last_name is null then
    v_last_name := nullif(trim(new.raw_user_meta_data->>'family_name'), '');
  end if;

  -- Son çare: Google sadece tek "name" döndürdüyse onu böl
  if v_first_name is null and v_last_name is null then
    v_full_name := nullif(trim(new.raw_user_meta_data->>'name'), '');
    if v_full_name is not null then
      v_space_pos := position(' ' in v_full_name);
      if v_space_pos > 0 then
        v_first_name := trim(substring(v_full_name from 1 for v_space_pos - 1));
        v_last_name  := nullif(trim(substring(v_full_name from v_space_pos + 1)), '');
      else
        v_first_name := v_full_name;
      end if;
    end if;
  end if;

  insert into public.kullanicilar (
    id,
    email,
    kullanici_adi,
    ad,
    soyad,
    bulten_izni,
    kvkk_kabul_tarihi
  )
  values (
    new.id,
    new.email,
    v_ad,
    v_first_name,
    v_last_name,
    coalesce((new.raw_user_meta_data->>'bulten_izni')::boolean, true),
    now()
  )
  on conflict (id) do nothing;
  return new;
end $$;

notify pgrst, 'reload schema';
