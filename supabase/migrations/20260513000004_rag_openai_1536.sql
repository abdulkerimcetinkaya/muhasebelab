-- =====================================================================
-- RAG: Embedding sağlayıcı Cohere → OpenAI text-embedding-3-small
-- =====================================================================
-- Cohere trial tier'ı RAG indexing için yetersiz çıktı (dakikada 100K
-- token limit). OpenAI tier 1: 5K RPM, 5M TPM — pratikte limit yok.
--
-- Boyut: 1024 → 1536 (OpenAI text-embedding-3-small native boyutu).
-- Tablo boş olduğu için ALTER güvenli.
-- =====================================================================

drop index if exists rag_chunks_embedding_idx;
drop function if exists public.rag_ara(vector(1024), int, float, text[]);

alter table rag_chunks alter column embedding type vector(1536);

create index rag_chunks_embedding_idx on rag_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function public.rag_ara(
  _embedding vector(1536),
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

grant execute on function public.rag_ara(vector(1536), int, float, text[]) to authenticated, anon;

notify pgrst, 'reload schema';
