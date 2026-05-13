-- =====================================================================
-- RAG (Retrieval-Augmented Generation) altyapısı — pgvector tabanlı
-- =====================================================================
-- Türk muhasebe mevzuatı (VUK, GVK, KVK, KDV, TTK, SGK, TMS/TFRS,
-- VUK Genel Tebliğleri) chunk'larını embedding ile saklar.
--
-- Akış:
--   1. GitHub Actions workflow PDF'leri indirir, metne çevirir,
--      200-800 token chunk'lara böler, OpenAI ile embedding üretir.
--   2. Embedding'ler bu tabloya upsert edilir (içerik hash'ine göre
--      dedupe — değişmeyen chunk yeniden gömülmez).
--   3. ai-asistan Edge Function kullanıcı sorusunu embedding'e çevirir,
--      pg_vector cosine similarity ile en yakın 5 chunk'ı çeker,
--      bunları sistem prompt'una enjekte eder.
-- =====================================================================

create extension if not exists vector;

-- =====================================================================
-- rag_kaynaklar — her bir mevzuat/standart/tebliğin meta verisi
-- =====================================================================
create table rag_kaynaklar (
  id text primary key,                    -- slug: 'vuk', 'gvk', 'tms-2-stoklar', ...
  baslik text not null,                   -- 'Vergi Usul Kanunu'
  kategori text not null check (kategori in (
    'kanun',          -- VUK, GVK, KVK, KDV, TTK, 5510, 4857
    'standart',       -- TMS 2, TMS 16, TMS 37, TFRS 15
    'teblig',         -- MSUGT, VUK Genel Tebliğleri
    'rehber'          -- KGK rehberleri (ileride)
  )),
  yayinci text not null,                  -- 'Resmi Gazete', 'KGK', 'GİB'
  url text not null,                      -- orijinal kaynak linki (cevabın altında gösterilir)
  format text not null check (format in ('pdf', 'html')),
  yayim_tarihi date,                      -- ilk yayım tarihi (varsa)
  son_guncelleme date,                    -- son resmi değişiklik
  son_indirme timestamptz,                -- pipeline en son ne zaman çekti
  icerik_hash text,                       -- ham içerik SHA-256 — değişti mi anlamak için
  durum text not null default 'beklemede' check (durum in (
    'beklemede',      -- henüz işlenmemiş
    'isleniyor',      -- pipeline çalışıyor
    'tamamlandi',     -- chunk'lar üretilmiş, embedding'ler hazır
    'hata'            -- bir adımda patladı
  )),
  hata_mesaji text,                       -- durum='hata' ise neden
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger rag_kaynaklar_updated_at before update on rag_kaynaklar
  for each row execute function set_updated_at();

-- =====================================================================
-- rag_chunks — embedding'li metin parçaları
-- =====================================================================
-- text-embedding-3-small modeli 1536 boyutlu vektör üretir.
-- Embedding modeli değişirse (örn. text-embedding-3-large = 3072 boyut)
-- ya bu kolonu ALTER eder ya yeni bir tablo açarız.
create table rag_chunks (
  id uuid primary key default gen_random_uuid(),
  kaynak_id text not null references rag_kaynaklar(id) on delete cascade,

  -- Hangi bölümden geldi? (madde, kısım, başlık numaralarıyla)
  baslik text,                            -- 'Madde 274 — Emtia' veya 'Bölüm 3 — Stoklar'
  madde_no text,                          -- '274' veya '§10' (filtre + atıf için)

  -- İçerik
  metin text not null,                    -- chunk'ın ham metni (display için)
  token_sayisi int not null,              -- gerçek OpenAI token sayısı
  sira int not null,                      -- kaynak içinde geliş sırası (1, 2, 3, ...)

  -- Vektör
  embedding vector(1536) not null,        -- OpenAI text-embedding-3-small

  -- Dedupe + incremental update
  metin_hash text not null,               -- SHA-256(metin) — değişmediyse re-embed gereksiz

  created_at timestamptz not null default now(),

  unique (kaynak_id, sira)                -- aynı kaynakta aynı sıra olmaz
);

-- =====================================================================
-- Indeksler
-- =====================================================================

-- Vektör similarity indeksi (cosine distance)
-- ivfflat: yaklaşık ama hızlı; küçük tabloda hnsw'den ucuz
-- lists = sqrt(satır sayısı) önerisi: 5000 chunk için ~70 list
create index rag_chunks_embedding_idx on rag_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Kaynak bazında filtreleme (örn. sadece VUK içinde ara)
create index rag_chunks_kaynak_idx on rag_chunks (kaynak_id);

-- Hash bazlı dedupe lookup
create index rag_chunks_hash_idx on rag_chunks (metin_hash);

-- =====================================================================
-- RPC: rag_ara — embedding ile en yakın N chunk'ı dön
-- =====================================================================
-- Edge Function (ai-asistan) bu RPC'yi çağırır. RLS bypass için
-- security definer; sadece SELECT yaptığı için güvenli.
create or replace function public.rag_ara(
  _embedding vector(1536),
  _limit int default 5,
  _esik float default 0.5,          -- minimum cosine similarity (0..1)
  _kaynak_filtre text[] default null  -- sadece belirli kaynaklarda ara (opsiyonel)
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

-- =====================================================================
-- RLS
-- =====================================================================
alter table rag_kaynaklar enable row level security;
alter table rag_chunks enable row level security;

-- Public read: rag_ara RPC bunları okuyabilsin diye (RPC stable, RLS atlamaz)
-- Direct table erişimine de izin veriyoruz (debug için)
create policy "rag_kaynaklar_public_read" on rag_kaynaklar
  for select using (true);

create policy "rag_chunks_public_read" on rag_chunks
  for select using (true);

-- Yazma: sadece service role (GitHub Actions workflow service_role key ile gelir)
-- service_role RLS'yi bypass eder, ayrı policy gerekmez.
-- anon / authenticated INSERT/UPDATE/DELETE yapamaz.

-- PostgREST schema cache reload
notify pgrst, 'reload schema';
