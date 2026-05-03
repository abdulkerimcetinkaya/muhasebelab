-- MuhasebeLab — Ünite içerik görselleri için Storage bucket
--
-- BlockNote editöründe drag-drop edilen karikatür/illustration görselleri
-- bu bucket'a yüklenir. Public read (CDN üzerinden okunur), sadece admin write.
--
-- Bucket adı: unite-gorseller
-- MIME: image/* (jpeg, png, webp, gif, svg)
-- Boyut limiti: 5MB

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'unite-gorseller',
  'unite-gorseller',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS politikaları — bucket dosyaları storage.objects tablosunda tutulur

-- Public read: herkes (anon dahil) okuyabilir
drop policy if exists "unite_gorseller_public_read" on storage.objects;
create policy "unite_gorseller_public_read"
  on storage.objects for select
  using (bucket_id = 'unite-gorseller');

-- Admin write: sadece is_admin() upload edebilir
drop policy if exists "unite_gorseller_admin_insert" on storage.objects;
create policy "unite_gorseller_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'unite-gorseller' and public.is_admin());

drop policy if exists "unite_gorseller_admin_update" on storage.objects;
create policy "unite_gorseller_admin_update"
  on storage.objects for update
  using (bucket_id = 'unite-gorseller' and public.is_admin())
  with check (bucket_id = 'unite-gorseller' and public.is_admin());

drop policy if exists "unite_gorseller_admin_delete" on storage.objects;
create policy "unite_gorseller_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'unite-gorseller' and public.is_admin());
