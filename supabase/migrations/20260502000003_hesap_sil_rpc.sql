-- MuhasebeLab — Hesap silme akışı (KVKK madde 11 zorunlu)
--
-- Kullanıcı kendi hesabını silebilsin diye security_definer RPC.
-- auth.users satırı silindiğinde kullanicilar tablosu cascade ile silinir,
-- oradan da ilerleme/aktivite/rozetler/soru_hatalari otomatik temizlenir.
--
-- Ödemeler özel durum: mali kayıt olduğu için silinmemeli (audit gerekiyor),
-- ama kullanıcıya bağlılığı koparılır (user_id null).

-- 1) odemeler.user_id'yi nullable yap, FK'yi set null'a çevir
alter table odemeler alter column user_id drop not null;
alter table odemeler drop constraint if exists odemeler_user_id_fkey;
alter table odemeler add constraint odemeler_user_id_fkey
  foreign key (user_id) references kullanicilar(id) on delete set null;

-- 2) Hesap silme RPC
create or replace function public.hesap_sil()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Oturum yok' using errcode = '42501';
  end if;
  -- auth.users delete cascade ile public.kullanicilar siler;
  -- public.kullanicilar cascade ile ilerleme, aktivite, kazanilan_rozetler,
  -- soru_hatalari'yi siler; odemeler set null ile bağlantısı kopar
  -- (mali audit için kayıt durur).
  delete from auth.users where id = uid;
end $$;

grant execute on function public.hesap_sil() to authenticated;

notify pgrst, 'reload schema';
