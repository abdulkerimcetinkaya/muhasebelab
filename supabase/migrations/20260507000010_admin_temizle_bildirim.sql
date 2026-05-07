-- Bug fix:
-- 1) Mevcut admin'lerin eski ilerleme verisi sıfırlanmamış (PR #34 sonradan
--    geldiği için). Tek seferlik temizlik.
-- 2) admin_ekle çağrıldığında yeni admin'e bildirim gönderilsin
--    (admin yapıldığını başka türlü anlayamıyor).

-- =====================================================================
-- 1) Tek seferlik temizlik: mevcut admin'ler için ilerleme silme
-- =====================================================================
delete from ilerleme where user_id in (select user_id from adminler);
delete from aktivite where user_id in (select user_id from adminler);
delete from kazanilan_rozetler where user_id in (select user_id from adminler);
update kullanicilar
  set gunluk_cozum_sayisi = 0,
      gunluk_limit_reset = null
  where id in (select user_id from adminler);

-- =====================================================================
-- 2) admin_ekle: bildirim gönder
-- =====================================================================
create or replace function public.admin_ekle(_user_id uuid, _roller text[] default '{operasyon}')
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_email text;
  v_eski_cozum_sayisi int;
  v_bildirim_id uuid;
  v_rol_listesi text;
begin
  if not is_admin('super') then
    raise exception 'Yetkisiz — sadece super admin ekleyebilir';
  end if;

  select email into v_email from auth.users where id = _user_id;
  if v_email is null then
    raise exception 'Kullanıcı (auth.users) bulunamadı';
  end if;

  select count(*)::int into v_eski_cozum_sayisi
    from ilerleme where user_id = _user_id and dogru_mu = true;

  insert into adminler (user_id, email, roller, ekleyen_id)
    values (_user_id, v_email, _roller, auth.uid())
    on conflict (user_id) do update set roller = excluded.roller;

  update kullanicilar set admin_only = true where id = _user_id;

  -- Önceki ilerlemeyi sıfırla
  delete from ilerleme where user_id = _user_id;
  delete from aktivite where user_id = _user_id;
  delete from kazanilan_rozetler where user_id = _user_id;
  update kullanicilar
    set gunluk_cozum_sayisi = 0,
        gunluk_limit_reset = null
    where id = _user_id;

  -- Kullanıcıya bildirim gönder
  v_rol_listesi := array_to_string(_roller, ', ');
  insert into bildirimler (baslik, metin, tip, link, hedef_tipi, olusturan_id)
    values (
      'Admin yetkisi aldın!',
      format('Sana admin yetkisi verildi (rol: %s). /admin yolundan yönetim paneline ulaşabilirsin. Bu hesap artık leaderboard''a girmeyecek; öğrenmek için ayrı bir hesap kullanman önerilir.', v_rol_listesi),
      'duyuru',
      '/admin',
      'belirli',
      auth.uid()
    )
    returning id into v_bildirim_id;

  insert into bildirim_hedef (bildirim_id, user_id)
    values (v_bildirim_id, _user_id);

  perform admin_log_yaz('admin_ekle', _user_id,
    jsonb_build_object(
      'roller', _roller,
      'ilerleme_sifirlandi', true,
      'eski_cozum_sayisi', v_eski_cozum_sayisi,
      'bildirim_gonderildi', true
    ));
end;
$fn$;

notify pgrst, 'reload schema';
