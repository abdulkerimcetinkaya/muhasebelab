-- admin_ekle: bir kullanıcı admin yapılırken önceki ilerlemesi sıfırlanır
--
-- Sebep:
-- - Admin hesabı leaderboard'da görünmez (admin_only=true) ama eski çözümler
--   tablolarda kalmaya devam ediyordu.
-- - Admin test/QA için soru çözebilir; bu çözümlerin admin olmadan önceki
--   skoruyla karışması istenmiyor.
-- - Temiz başlangıç: admin yapıldığında ilerleme, aktivite, rozet, günlük
--   kontör sıfırlanır.
--
-- Audit log'a 'ilerleme_sifirlandi: true' bilgisi yazılır.

create or replace function public.admin_ekle(_user_id uuid, _roller text[] default '{operasyon}')
returns void
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_email text;
  v_eski_cozum_sayisi int;
begin
  if not is_admin('super') then
    raise exception 'Yetkisiz — sadece super admin ekleyebilir';
  end if;

  select email into v_email from auth.users where id = _user_id;
  if v_email is null then
    raise exception 'Kullanıcı (auth.users) bulunamadı';
  end if;

  -- Eski ilerlemeyi tut (sadece log için bilgi)
  select count(*)::int into v_eski_cozum_sayisi
    from ilerleme where user_id = _user_id and dogru_mu = true;

  -- Admin tablosuna ekle (rol güncelle)
  insert into adminler (user_id, email, roller, ekleyen_id)
    values (_user_id, v_email, _roller, auth.uid())
    on conflict (user_id) do update set roller = excluded.roller;

  -- admin_only flag — leaderboard ve istatistik dışı
  update kullanicilar set admin_only = true where id = _user_id;

  -- Önceki ilerlemeyi sıfırla — admin testleri eski skorlara karışmasın
  delete from ilerleme where user_id = _user_id;
  delete from aktivite where user_id = _user_id;
  delete from kazanilan_rozetler where user_id = _user_id;
  update kullanicilar
    set gunluk_cozum_sayisi = 0,
        gunluk_limit_reset = null
    where id = _user_id;

  perform admin_log_yaz('admin_ekle', _user_id,
    jsonb_build_object(
      'roller', _roller,
      'ilerleme_sifirlandi', true,
      'eski_cozum_sayisi', v_eski_cozum_sayisi
    ));
end;
$fn$;

notify pgrst, 'reload schema';
