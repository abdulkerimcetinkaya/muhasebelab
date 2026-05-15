-- =====================================================================
-- ai_log_gunluk view'ı Türkiye saatine (Europe/Istanbul) çevir
-- =====================================================================
-- Bug: Önceki view date_trunc('day', created_at) ile UTC'de gün hesabı
-- yapıyordu. Frontend ise bugünkü tarihi Türkiye saatiyle hesaplıyor.
-- Türkiye'de gece 00:00–03:00 arası yapılan çağrılar UTC'de hala önceki
-- güne ait olduğundan "bugünkü" filter boş dönüyordu (admin sayfası
-- bugünkü kartların boş, son 7 gün toplamın dolu olduğunu rapor etti).
--
-- Fix: created_at'i Europe/Istanbul'a çevirip ::date al. AT TIME ZONE
-- sabit timezone ile IMMUTABLE — view içinde sorunsuz çalışır.

begin;

create or replace view ai_log_gunluk as
select
  (created_at at time zone 'Europe/Istanbul')::date as gun,
  ozellik,
  count(*) as cagri_sayisi,
  sum(input_token) as toplam_input_token,
  sum(output_token) as toplam_output_token,
  sum(case when premium then 1 else 0 end) as premium_cagri,
  sum(case when premium then 0 else 1 end) as free_cagri
from ai_log
group by 1, 2;

grant select on ai_log_gunluk to authenticated;

commit;

notify pgrst, 'reload schema';
