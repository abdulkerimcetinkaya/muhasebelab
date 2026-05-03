-- MuhasebeLab — Self-grant Premium fix
--
-- Sorun: kullanici_own_update RLS politikası kullanıcının kendi satırının
-- TÜM kolonlarını update etmesine izin veriyordu (with check yok). Sonuç:
-- authenticated bir kullanıcı PostgREST üzerinden
--   update kullanicilar set premium_bitis='2099-12-31' where id=auth.uid()
-- çalıştırıp tüm Premium özelliklerini bedava açabiliyordu.
--
-- Çözüm: BEFORE UPDATE trigger ile premium / kota kolonlarını korumalı yap.
-- Service role (Edge function'lar, iyzico-callback, RPC'ler) trigger'ı bypass eder.
-- Kullanıcı kendi adı / üniversitesi / tema gibi alanları değiştirebilir,
-- ama premium_bitis / gunluk_cozum_sayisi / gunluk_limit_reset eskisinde kalır.

create or replace function public.koru_kullanici_kolonlar()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  jwt_role text := current_setting('request.jwt.claims', true, false)::json->>'role';
begin
  -- service_role her şeyi yazabilir (RPC'ler ve Edge Function'lar)
  if jwt_role = 'service_role' then
    return new;
  end if;

  -- Authenticated kullanıcı bu kolonları değiştiremez —
  -- premium_bitis SADECE premium_erken_erisim_aktive RPC'si ve
  -- iyzico-callback Edge Function (service_role) tarafından yazılabilir.
  new.premium_bitis := old.premium_bitis;
  new.gunluk_cozum_sayisi := old.gunluk_cozum_sayisi;
  new.gunluk_limit_reset := old.gunluk_limit_reset;

  -- Email, KVKK kabul tarihi, created_at de değişmez
  new.email := old.email;
  new.kvkk_kabul_tarihi := old.kvkk_kabul_tarihi;
  new.created_at := old.created_at;

  return new;
end $$;

drop trigger if exists kullanici_korumali_kolonlar on kullanicilar;
create trigger kullanici_korumali_kolonlar
  before update on kullanicilar
  for each row execute function public.koru_kullanici_kolonlar();

-- PostgREST schema cache reload
notify pgrst, 'reload schema';
