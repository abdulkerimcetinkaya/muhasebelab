-- =====================================================================
-- RAG: Embedding modeli OpenAI 1536d → Gemini text-embedding-004 768d
-- =====================================================================
-- Strateji değişikliği: OpenAI yerine Gemini kullanıyoruz (ücretsiz tier).
-- Gemini text-embedding-004 modeli 768 boyutlu vektör üretir.
--
-- Bu migration sadece embedding kolonunu + index'i + RPC imzasını değiştirir.
-- Tablo ilk yükleme sırasında dolmadığı için (önceki run OpenAI quota
-- hatasıyla iptal) ALTER COLUMN güvenli.
-- =====================================================================

-- Önce eski index'i ve RPC'yi düşür (kolon tipini değiştirebilmek için)
drop index if exists rag_chunks_embedding_idx;
drop function if exists public.rag_ara(vector(1536), int, float, text[]);

-- Embedding kolonu boyutunu değiştir
-- Tablo boşsa direkt geçer; içinde veri varsa pgvector dim mismatch hatası verir.
alter table rag_chunks alter column embedding type vector(768);

-- Yeni boyutla index'i yeniden oluştur
create index rag_chunks_embedding_idx on rag_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- RPC'yi yeni imzayla yeniden oluştur (vector(768))
create or replace function public.rag_ara(
  _embedding vector(768),
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

grant execute on function public.rag_ara(vector(768), int, float, text[]) to authenticated, anon;

notify pgrst, 'reload schema';
