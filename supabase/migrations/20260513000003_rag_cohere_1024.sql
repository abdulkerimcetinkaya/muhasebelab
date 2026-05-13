-- =====================================================================
-- RAG: Embedding sağlayıcı Gemini → Cohere geçişi
-- =====================================================================
-- Gemini ücretsiz tier (100 req/gün, 30K tok/dakika) RAG indexing için
-- yeterli olmadı. Cohere embed-multilingual-v3.0 modeline geçtik —
-- Türkçe için özel tunlanmış, free trial 1000 çağrı/ay (ihtiyacımız <100).
--
-- Boyut değişikliği: 768 → 1024 (Cohere v3 native boyutu).
-- Tablo boş olduğu için ALTER COLUMN güvenli.
-- =====================================================================

drop index if exists rag_chunks_embedding_idx;
drop function if exists public.rag_ara(vector(768), int, float, text[]);

alter table rag_chunks alter column embedding type vector(1024);

create index rag_chunks_embedding_idx on rag_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function public.rag_ara(
  _embedding vector(1024),
  _limit int default 5,
  _esik float default 0.5,
  _kaynak_filtre text[] default null
)
returns table (
  chunk_id uuid,
  kaynak_id text,
  kaynak_baslik text,
  kaynak_url text,
  chunk_baslik text,
  madde_no text,
  metin text,
  benzerlik float
)
language sql stable security definer
set search_path = public
as $$
  select
    c.id as chunk_id,
    c.kaynak_id,
    k.baslik as kaynak_baslik,
    k.url as kaynak_url,
    c.baslik as chunk_baslik,
    c.madde_no,
    c.metin,
    1 - (c.embedding <=> _embedding) as benzerlik
  from rag_chunks c
  join rag_kaynaklar k on k.id = c.kaynak_id
  where (_kaynak_filtre is null or c.kaynak_id = any(_kaynak_filtre))
    and 1 - (c.embedding <=> _embedding) >= _esik
  order by c.embedding <=> _embedding
  limit _limit;
$$;

grant execute on function public.rag_ara(vector(1024), int, float, text[]) to authenticated, anon;

notify pgrst, 'reload schema';
