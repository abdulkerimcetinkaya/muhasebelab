-- Bug fix: kullanıcı her giriş yaptığında onboarding tekrar açılıyor
--
-- Sorun: ilerleme-supabase.ts onboardingTamam'ı şu derive ediyordu:
--   "çözülmüş soru var mı VEYA kullanici_adi 'Öğrenci' değil mi"
-- Onboarding alanları (üniversite/bölüm/sınıf/hedef) opsiyonel olduğu için
-- yeni kullanıcı onboarding bitirip soru çözmeden çıkarsa, tekrar girişte
-- onboarding'e yeniden gönderilir.
--
-- Çözüm: kalıcı `onboarding_tamam_at` timestamp kolonu. Kullanıcı onboarding'i
-- bitirdiğinde set edilir. Tekrar set edilmesini engellemek için trigger.

alter table kullanicilar
  add column if not exists onboarding_tamam_at timestamptz;

-- Mevcut kullanıcılar: hesabı varsa onboarding bitmiş say (geriye dönük uyum)
update kullanicilar
  set onboarding_tamam_at = coalesce(created_at, now())
  where onboarding_tamam_at is null;

-- koru_kullanici_kolonlar trigger'ını güncelle:
--   - onboarding_tamam_at sadece bir kez set edilebilir (immutable after set)
--   - Bu sayede UI yanlışlıkla NULL'a çekemez
create or replace function public.koru_kullanici_kolonlar()
returns trigger language plpgsql security definer
set search_path = public
as $fn$
declare
  jwt_role text;
begin
  begin
    jwt_role := nullif(current_setting('request.jwt.claims', true), '')::json->>'role';
  exception when others then
    jwt_role := null;
  end;

  if jwt_role = 'service_role'
     or current_user in ('postgres', 'supabase_admin', 'service_role') then
    return new;
  end if;

  -- Korunan alanlar
  new.premium_bitis := old.premium_bitis;
  new.gunluk_cozum_sayisi := old.gunluk_cozum_sayisi;
  new.gunluk_limit_reset := old.gunluk_limit_reset;
  new.email := old.email;
  new.kvkk_kabul_tarihi := old.kvkk_kabul_tarihi;
  new.created_at := old.created_at;
  new.banli := old.banli;
  new.ban_sebep := old.ban_sebep;
  new.ban_tarihi := old.ban_tarihi;
  new.is_katkici := old.is_katkici;
  new.admin_only := old.admin_only;

  -- onboarding_tamam_at: bir kez set edildiyse kullanıcı UI'dan değiştiremez,
  -- sadece NULL'dan dolu hâle geçişe izin (onboarding tamam ediliyor)
  if old.onboarding_tamam_at is not null then
    new.onboarding_tamam_at := old.onboarding_tamam_at;
  end if;

  return new;
end $fn$;

notify pgrst, 'reload schema';
