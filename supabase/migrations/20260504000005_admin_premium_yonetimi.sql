-- Admin premium yönetimi — Sprint 2
-- admin_premium_ayarla RPC: is_admin() yetkisi olan kullanıcılar premium_bitis
-- alanını ayarlayabilir. SECURITY DEFINER ile koru_kullanici_kolonlar trigger'ı
-- bypass edilir (function postgres user olarak çalışır → current_user = 'postgres').

begin;

create or replace function public.admin_premium_ayarla(
  _user_id uuid,
  _yeni_bitis timestamptz
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_yeni timestamptz;
begin
  if not is_admin() then
    raise exception 'Yetkisiz: sadece admin premium ayarlayabilir';
  end if;

  update kullanicilar
    set premium_bitis = _yeni_bitis
    where id = _user_id
    returning premium_bitis into v_yeni;

  if not found then
    raise exception 'Kullanıcı bulunamadı: %', _user_id;
  end if;

  return v_yeni;
end;
$fn$;

revoke all on function public.admin_premium_ayarla(uuid, timestamptz) from public;
grant execute on function public.admin_premium_ayarla(uuid, timestamptz) to authenticated;

commit;
