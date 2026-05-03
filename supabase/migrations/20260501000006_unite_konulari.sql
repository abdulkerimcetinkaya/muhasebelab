-- MuhasebeLab — Ünite alt-konuları (LeetCode-tarzı mikro yapı)
--
-- Her ünite N alt-konuya bölünür: konunun kendi BlockNote içeriği + sıralı
-- soruları olur. Sol navigasyon UniteSayfasi'nda bunu listeler.
--
-- Örnek: "Ticari Mal Alımı ve Satımı" ünitesi →
--   1. Stok kavramı  2. Mal alış  3. Alıştan iade  4. Mal satış
--   5. Satıştan iade  6. Satılan mal maliyeti
--
-- icerik: BlockNote JSON dokümanı (tıpkı unites.icerik gibi).
-- sorular tablosuna konu_id eklenir; null olabilir (eski sorular ünite seviyesinde kalsın).

create table unite_konulari (
  id text primary key,
  unite_id text not null references unites(id) on delete cascade,
  ad text not null,
  aciklama text,
  icerik jsonb,
  icerik_guncellendi timestamptz,
  sira int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index unite_konulari_unite_idx on unite_konulari (unite_id, sira);

create trigger unite_konulari_updated_at before update on unite_konulari
  for each row execute function set_updated_at();

-- Soruları konuya bağla — nullable, eski sorular etkilenmesin
alter table sorular add column konu_id text references unite_konulari(id) on delete set null;
create index sorular_konu_idx on sorular (konu_id) where konu_id is not null;

-- =====================================================================
-- RLS
-- =====================================================================

alter table unite_konulari enable row level security;

-- Public read: herkes konuları görebilir (ünite gibi)
create policy "konular_public_read"
  on unite_konulari for select using (true);

-- Admin write
create policy "konular_admin_all"
  on unite_konulari for all
  using (public.is_admin())
  with check (public.is_admin());

-- PostgREST schema cache reload
notify pgrst, 'reload schema';
