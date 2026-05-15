-- =====================================================================
-- AI LOG — her AI çağrısının token detayı (özellik bazında)
-- =====================================================================
-- Karar (16 Mayıs 2026): mevcut ai_kullanim tablosu sadece günlük çağrı
-- sayısı tutuyor; maliyet izleme için yetersiz. Bu tablo her çağrıyı
-- özellik + token bilgisiyle loglar. Sadece admin SELECT.
--
-- Insert sadece `ai_log_yaz` RPC üzerinden (security definer) — Edge
-- Function'lar buradan yazar.

begin;

create table if not exists ai_log (
  id bigserial primary key,
  kullanici_id uuid references auth.users(id) on delete set null,
  ozellik text not null check (ozellik in ('yanlis_analizi', 'asistan', 'belge_uret')),
  input_token int not null default 0 check (input_token >= 0),
  output_token int not null default 0 check (output_token >= 0),
  premium boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists ai_log_created_at_idx on ai_log (created_at desc);
create index if not exists ai_log_ozellik_idx on ai_log (ozellik, created_at desc);
-- date_trunc fonksiyonel indeksi IMMUTABLE olmadığı için kullanılamaz;
-- ai_log_created_at_idx zaten gün-bazlı sorguları cover ediyor.

alter table ai_log enable row level security;

-- Sadece admin okuyabilir
drop policy if exists "ai_log_admin_select" on ai_log;
create policy "ai_log_admin_select" on ai_log
  for select using (is_admin());

-- Yazma yasak — sadece ai_log_yaz RPC üzerinden

-- =====================================================================
-- RPC: ai_log_yaz — Edge Function'lar her çağrıdan sonra çağırır
-- =====================================================================
create or replace function ai_log_yaz(
  _ozellik text,
  _input_token int,
  _output_token int,
  _premium boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then return; end if;
  if _ozellik not in ('yanlis_analizi', 'asistan', 'belge_uret') then return; end if;

  insert into ai_log (kullanici_id, ozellik, input_token, output_token, premium)
  values (auth.uid(), _ozellik, greatest(coalesce(_input_token, 0), 0), greatest(coalesce(_output_token, 0), 0), coalesce(_premium, false));
end;
$$;

revoke all on function ai_log_yaz(text, int, int, boolean) from public;
grant execute on function ai_log_yaz(text, int, int, boolean) to authenticated;

-- =====================================================================
-- View: ai_log_gunluk — admin dashboard'u için günlük özet
-- (özellik bazında çağrı sayısı + toplam token)
-- =====================================================================
create or replace view ai_log_gunluk as
select
  date_trunc('day', created_at)::date as gun,
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
