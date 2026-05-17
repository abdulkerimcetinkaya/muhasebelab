-- Liderlik RPC'lerine okul/üniversite filtresi ekle.
--
-- 3 RPC (bireysel_liderlik, haftalik_liderlik, aylik_liderlik) yeni
-- `_universite text default null` parametresini kabul eder. null ise tüm
-- kullanıcılar (mevcut davranış), dolu ise sadece o üniversite/okul'daki
-- kullanıcılar listelenir.
--
-- Karşılaştırma case-insensitive ve trim'li (kullanıcıların 'boğaziçi' vs
-- 'Boğaziçi' yazımı sorun olmasın).
--
-- Signature değiştiği için DROP + CREATE gerekli (CREATE OR REPLACE
-- param listesini değiştirmeye izin vermiyor).

begin;

-- =====================================================================
-- 1. bireysel_liderlik — tüm zamanlar
-- =====================================================================
drop function if exists public.bireysel_liderlik(int);

create or replace function public.bireysel_liderlik(
  _limit int default 100,
  _universite text default null
)
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
  where (_universite is null or lower(trim(k.universite)) = lower(trim(_universite)))
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

grant execute on function public.bireysel_liderlik(int, text) to anon, authenticated;

-- =====================================================================
-- 2. haftalik_liderlik — son 7 gün
-- =====================================================================
drop function if exists public.haftalik_liderlik(int);

create or replace function public.haftalik_liderlik(
  _limit int default 100,
  _universite text default null
)
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
        and kr.kazanilan_tarih >= now() - interval '7 days'
    ) as rozet_sayisi
  from kullanicilar k
  left join ilerleme i
    on i.user_id = k.id
   and i.created_at >= now() - interval '7 days'
  left join sorular s
    on s.id = i.soru_id
   and s.durum = 'onayli'
  where (_universite is null or lower(trim(k.universite)) = lower(trim(_universite)))
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

grant execute on function public.haftalik_liderlik(int, text) to anon, authenticated;

-- =====================================================================
-- 3. aylik_liderlik — son 30 gün
-- =====================================================================
drop function if exists public.aylik_liderlik(int);

create or replace function public.aylik_liderlik(
  _limit int default 100,
  _universite text default null
)
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
        and kr.kazanilan_tarih >= now() - interval '30 days'
    ) as rozet_sayisi
  from kullanicilar k
  left join ilerleme i
    on i.user_id = k.id
   and i.created_at >= now() - interval '30 days'
  left join sorular s
    on s.id = i.soru_id
   and s.durum = 'onayli'
  where (_universite is null or lower(trim(k.universite)) = lower(trim(_universite)))
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

grant execute on function public.aylik_liderlik(int, text) to anon, authenticated;

notify pgrst, 'reload schema';

commit;
