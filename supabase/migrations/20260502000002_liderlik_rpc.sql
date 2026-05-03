-- MuhasebeLab — Liderlik view'larını RPC'ye dönüştür
--
-- Sorun: bireysel_liderlik ve universite_liderlik view'ları
-- security_invoker = false (default) ile tanımlıydı + anon role'e
-- grant select verilmişti. Sonuç: view-owner (postgres) hakları ile
-- kullanicilar tablosunun RLS'ini bypass ediyor, anonim ziyaretçi
-- tüm kullanıcıların kullanici_adi / universite / sinif / avatar_url
-- bilgisini listeyebiliyordu.
--
-- Çözüm: View'ları sil, security_definer RPC'ye dönüştür.
-- RPC sadece güvenli alanları döndürür; PII (email, dogum_yili,
-- kvkk_kabul_tarihi, premium_bitis vb.) hiç dahil edilmez.

drop view if exists public.bireysel_liderlik;
drop view if exists public.universite_liderlik;

-- =====================================================================
-- Tüm zamanlar bireysel liderlik — RPC
-- =====================================================================
create or replace function public.bireysel_liderlik(_limit int default 100)
returns table (
  id uuid,
  kullanici_adi text,
  universite text,
  sinif text,
  avatar_url text,
  cozulen_soru int,
  toplam_puan int,
  rozet_sayisi int
)
language sql
security definer
set search_path = public
as $$
  select
    k.id,
    k.kullanici_adi,
    k.universite,
    k.sinif,
    k.avatar_url,
    count(distinct case when i.dogru_mu then i.soru_id end)::int as cozulen_soru,
    coalesce(sum(case
      when i.dogru_mu and s.zorluk = 'kolay' then 5
      when i.dogru_mu and s.zorluk = 'orta'  then 10
      when i.dogru_mu and s.zorluk = 'zor'   then 20
      else 0
    end), 0)::int as toplam_puan,
    (
      select count(*)::int
      from kazanilan_rozetler kr
      where kr.user_id = k.id
    ) as rozet_sayisi
  from kullanicilar k
  left join ilerleme i on i.user_id = k.id
  left join sorular s on s.id = i.soru_id and s.durum = 'onayli'
  group by k.id, k.kullanici_adi, k.universite, k.sinif, k.avatar_url
  having coalesce(sum(case
    when i.dogru_mu and s.zorluk = 'kolay' then 5
    when i.dogru_mu and s.zorluk = 'orta'  then 10
    when i.dogru_mu and s.zorluk = 'zor'   then 20
    else 0
  end), 0) > 0
  order by toplam_puan desc, cozulen_soru desc
  limit greatest(1, least(_limit, 200));
$$;

grant execute on function public.bireysel_liderlik(int) to anon, authenticated;

-- =====================================================================
-- Üniversite liderliği — toplu (PII yok, sadece üniversite başına sayım)
-- =====================================================================
create or replace function public.universite_liderlik()
returns table (
  universite text,
  kullanici_sayisi bigint,
  toplam_cozum bigint
)
language sql
security definer
set search_path = public
as $$
  select
    universite,
    count(*) as kullanici_sayisi,
    sum(coalesce(gunluk_cozum_sayisi, 0)) as toplam_cozum
  from kullanicilar
  where universite is not null
  group by universite
  order by toplam_cozum desc nulls last;
$$;

grant execute on function public.universite_liderlik() to anon, authenticated;

notify pgrst, 'reload schema';
