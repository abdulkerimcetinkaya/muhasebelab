-- MuhasebeLab — koru_kullanici_kolonlar trigger düzeltme
--
-- Bug: 20260502000001 migration'ında current_setting() 3 argümanla
-- çağrılıyordu (PostgreSQL signature: 1 veya 2 argüman). Trigger her
-- UPDATE'te `function current_setting(text, boolean, boolean) does not exist`
-- exception fırlatıyor, transaction abort oluyor.
--
-- Sonuç: Authenticated kullanıcılar kullanicilar tablosunda HİÇBİR
-- alanı güncelleyemiyordu (kullanici_adi, tema, universite, vs).
-- Profil sayfası kullanılamaz hâldeydi.
--
-- Fix: 2 argümanlı current_setting + null/empty güvenli parse.
-- Ayrıca postgres direct connection (migration) bypass'ı eklendi.

create or replace function public.koru_kullanici_kolonlar()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  jwt_role text;
begin
  -- JWT'den role çek; yoksa null kalır (postgres direct, migration vb.)
  begin
    jwt_role := nullif(current_setting('request.jwt.claims', true), '')::json->>'role';
  exception when others then
    jwt_role := null;
  end;

  -- service_role her şeyi yazabilir (RPC'ler, Edge Function'lar)
  -- postgres / supabase_admin (migration, psql) da bypass eder
  if jwt_role = 'service_role'
     or current_user in ('postgres', 'supabase_admin', 'service_role') then
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

-- Trigger zaten var (20260502000001); CREATE OR REPLACE FUNCTION yeterli.

notify pgrst, 'reload schema';
