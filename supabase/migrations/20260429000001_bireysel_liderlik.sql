-- Bireysel liderlik tablosu — kullanıcı bazında sıralama.
-- Tüm zamanlar (view) + haftalık/aylık (RPC) varyantlar.
--
-- Güvenlik notu: view ve RPC sadece güvenli alanları döndürür.
-- email, doğum_yılı, kvkk_kabul_tarihi DAHİL EDİLMEZ.

begin;

-- =====================================================================
-- Tüm zamanlar liderlik view
-- =====================================================================
create or replace view public.bireysel_liderlik as
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
group by k.id, k.kullanici_adi, k.universite, k.sinif, k.avatar_url;

grant select on public.bireysel_liderlik to anon, authenticated;

-- =====================================================================
-- Haftalık liderlik — son 7 gün doğru çözümler
-- =====================================================================
create or replace function public.haftalik_liderlik(_limit int default 100)
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

grant execute on function public.haftalik_liderlik(int) to anon, authenticated;

-- =====================================================================
-- Aylık liderlik — son 30 gün doğru çözümler
-- =====================================================================
create or replace function public.aylik_liderlik(_limit int default 100)
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

grant execute on function public.aylik_liderlik(int) to anon, authenticated;

-- =====================================================================
-- Performans için index (haftalık/aylık filtreleme)
-- =====================================================================
create index if not exists ilerleme_created_idx on ilerleme (created_at desc);

commit;
