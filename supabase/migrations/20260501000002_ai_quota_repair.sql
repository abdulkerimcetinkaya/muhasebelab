-- ai_quota_artir RPC'sini PostgREST schema cache'inde garantili görünür kılar.
-- Bazen migration'lar uygulanmasına rağmen PostgREST cache stale kalıyor;
-- function aynen yeniden tanımlanır + reload tetiklenir.

create or replace function ai_quota_artir(_max int default 3)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _sayac int;
begin
  if _uid is null then
    return json_build_object('izin_var', false, 'sayac', 0, 'limit', _max, 'hata', 'oturum yok');
  end if;

  insert into ai_kullanim (kullanici_id, tarih, sayac)
  values (_uid, current_date, 0)
  on conflict (kullanici_id, tarih) do nothing;

  select sayac into _sayac
  from ai_kullanim
  where kullanici_id = _uid and tarih = current_date
  for update;

  if _sayac >= _max then
    return json_build_object('izin_var', false, 'sayac', _sayac, 'limit', _max);
  end if;

  update ai_kullanim
  set sayac = sayac + 1
  where kullanici_id = _uid and tarih = current_date;

  return json_build_object('izin_var', true, 'sayac', _sayac + 1, 'limit', _max);
end;
$$;

revoke all on function ai_quota_artir(int) from public;
grant execute on function ai_quota_artir(int) to authenticated;

-- PostgREST schema cache yenile
notify pgrst, 'reload schema';
