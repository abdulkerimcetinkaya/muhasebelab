-- Admin kullanıcıları liderlik tablosundan çıkar.
--
-- Admin'ler sistemde test/moderasyon amacıyla soru çözüyor olabilir;
-- onların puanlarının sıralamada görünmesi adil değil.
--
-- İki kontrol birlikte (defense in depth):
--   1. adminler tablosunda kayıtlı mı (kanonik admin listesi)
--   2. kullanicilar.admin_only = true (UI/RLS filtreleme bayrağı)
--
-- İkisinden biri true ise leaderboard'a dahil edilmiyor.
--
-- Sadece RPC body'leri değişti — signature aynı, CREATE OR REPLACE yeterli.

begin;

-- =====================================================================
-- 1. bireysel_liderlik
-- =====================================================================
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
    and coalesce(k.admin_only, false) = false
    and not exists (select 1 from adminler a where a.user_id = k.id)
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

-- =====================================================================
-- 2. haftalik_liderlik
-- =====================================================================
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
    and coalesce(k.admin_only, false) = false
    and not exists (select 1 from adminler a where a.user_id = k.id)
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

-- =====================================================================
-- 3. aylik_liderlik
-- =====================================================================
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
    and coalesce(k.admin_only, false) = false
    and not exists (select 1 from adminler a where a.user_id = k.id)
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

notify pgrst, 'reload schema';

commit;
