-- MuhasebeLab — Mevzuat RAG altyapısı
-- Embedding modeli: HuggingFace `intfloat/multilingual-e5-small` (384-dim, Türkçe destek var).
-- Edge Function `ai-asistan` kullanıcı mesajını embed edip mevzuat_ara() ile en yakın
-- chunk'ları çeker, sistem prompt'una inject eder.

create extension if not exists vector;

-- =====================================================================
-- TABLO
-- =====================================================================

create table if not exists mevzuat_chunklar (
  id uuid primary key default gen_random_uuid(),
  kaynak text not null,                 -- 'TDHP-MSUGT', 'VUK', 'KDV-UT', 'GIB-SIRKULER', 'TTK', 'GVK', 'KVK'
  baslik text not null,                 -- 'Madde 234', '100 - KASA', 'KDV Tevkifat'
  url text,                             -- mevzuat.gov.tr veya gib.gov.tr referans linki
  metin text not null,                  -- 400-800 token chunk gövdesi
  embedding vector(384) not null,       -- multilingual-e5-small çıktısı
  guncellendi date,                     -- mevzuatın yürürlük/güncellenme tarihi
  created_at timestamptz not null default now()
);

create index mevzuat_chunklar_kaynak_idx on mevzuat_chunklar (kaynak);

-- IVFFlat cosine index — 100 list, küçük dataset için yeter
create index mevzuat_chunklar_embedding_idx
  on mevzuat_chunklar using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

comment on table mevzuat_chunklar is
  'Türk muhasebe ve vergi mevzuatı RAG havuzu. Admin panelden eklenir, public okunur.';

-- =====================================================================
-- ARAMA RPC — kullanıcı sorusu vector'üne en yakın chunk'lar
-- =====================================================================

create or replace function mevzuat_ara(
  sorgu_emb vector(384),
  limit_n int default 5
)
returns table (
  id uuid,
  kaynak text,
  baslik text,
  url text,
  metin text,
  benzerlik float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    id,
    kaynak,
    baslik,
    url,
    metin,
    1 - (embedding <=> sorgu_emb) as benzerlik
  from mevzuat_chunklar
  order by embedding <=> sorgu_emb
  limit limit_n;
$$;

comment on function mevzuat_ara is
  'Verilen 384-dim embedding vektörüne cosine benzerliği en yüksek mevzuat chunkını döner.';

-- =====================================================================
-- RLS — public select, admin tam yetki
-- =====================================================================

alter table mevzuat_chunklar enable row level security;

create policy "mevzuat_public_read" on mevzuat_chunklar
  for select using (true);

create policy "mevzuat_admin_all" on mevzuat_chunklar
  for all
  using (is_admin())
  with check (is_admin());
