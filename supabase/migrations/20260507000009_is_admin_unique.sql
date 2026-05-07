-- Bug fix: function is_admin() is not unique
--
-- Faz 2 (20260507000005) is_admin(_role text default null) yarattı ama
-- 20260504000009'daki eski is_admin() (parametresiz) versiyonunu drop etmedi.
-- Sonuç: is_admin() çağrısı ikisine de match ediyor → ambiguous.
--
-- Eski parametresiz versiyonu drop ediyoruz. is_admin(text default null)
-- otomatik olarak is_admin() çağrılarını da karşılar (default null).

drop function if exists public.is_admin() cascade;

-- is_admin(text default null) versiyonunu yeniden tanımla (cascade silinmiş
-- olabilecek policy'leri de geri getirsin diye değil — onlar zaten yeni
-- definition'a bağlı; sadece güvenlik için yeniden create ediyoruz)
create or replace function public.is_admin(_role text default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.adminler
    where user_id = auth.uid()
      and (
        _role is null
        or 'super' = ANY(roller)
        or _role = ANY(roller)
      )
  );
$$;

grant execute on function public.is_admin(text) to authenticated, anon;

-- =====================================================================
-- DROP CASCADE policy'leri silmiş olabilir — yeniden create
-- =====================================================================

-- adminler
drop policy if exists "adminler_super_all" on public.adminler;
create policy "adminler_super_all" on public.adminler
  for all using (is_admin('super')) with check (is_admin('super'));

-- sorular
drop policy if exists "sorular_icerik_all" on sorular;
create policy "sorular_icerik_all" on sorular
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

-- cozumler
drop policy if exists "cozumler_icerik_all" on cozumler;
create policy "cozumler_icerik_all" on cozumler
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

-- unites
drop policy if exists "unites_icerik_all" on unites;
create policy "unites_icerik_all" on unites
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

-- hesap_plani
drop policy if exists "hesap_plani_icerik_all" on hesap_plani;
create policy "hesap_plani_icerik_all" on hesap_plani
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

-- soru_hatalari
drop policy if exists "soru_hatalari_operasyon_all" on soru_hatalari;
create policy "soru_hatalari_operasyon_all" on soru_hatalari
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

-- indirim_kodlari
drop policy if exists "indirim_kodlari_operasyon_all" on indirim_kodlari;
create policy "indirim_kodlari_operasyon_all" on indirim_kodlari
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

-- indirim_kullanimlari (admin tarafı)
drop policy if exists "indirim_kullanimlari_operasyon_all" on indirim_kullanimlari;
create policy "indirim_kullanimlari_operasyon_all" on indirim_kullanimlari
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

-- admin_log (sadece super görür)
drop policy if exists "admin_log_super_select" on admin_log;
create policy "admin_log_super_select" on admin_log
  for select using (is_admin('super'));

-- =====================================================================
-- Faz öncesi RLS policy'leri eski is_admin()'e güvenebiliyordu — onları
-- da yenile (any-admin için is_admin() → is_admin() default null)
-- =====================================================================

-- katkici_basvurulari (admin görür/yönetir)
drop policy if exists "katkici_basvuru_admin_all" on katkici_basvurulari;
create policy "katkici_basvuru_admin_all" on katkici_basvurulari
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

-- bildirimler
drop policy if exists "bildirimler_admin_all" on bildirimler;
create policy "bildirimler_admin_all" on bildirimler
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

-- bildirim_hedef
drop policy if exists "bildirim_hedef_admin_all" on bildirim_hedef;
create policy "bildirim_hedef_admin_all" on bildirim_hedef
  for all using (is_admin('operasyon')) with check (is_admin('operasyon'));

-- mevzuat_chunklar
drop policy if exists "mevzuat_admin_all" on mevzuat_chunklar;
drop policy if exists "mevzuat_chunklar_admin_all" on mevzuat_chunklar;
create policy "mevzuat_chunklar_icerik_all" on mevzuat_chunklar
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

-- sozluk_terimleri (admin yazma)
drop policy if exists "sozluk_admin_all" on sozluk_terimleri;
drop policy if exists "sozluk_terimleri_admin_all" on sozluk_terimleri;
create policy "sozluk_terimleri_icerik_all" on sozluk_terimleri
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

-- unite_konulari
drop policy if exists "unite_konulari_admin_all" on unite_konulari;
create policy "unite_konulari_icerik_all" on unite_konulari
  for all using (is_admin('icerik')) with check (is_admin('icerik'));

-- kullanicilar admin SELECT (Sprint 1 — admin kullanıcı listesini görür)
-- operasyon admin'i kullanıcı yönetimi için bu policy'ye sahip
drop policy if exists "kullanicilar_admin_select" on kullanicilar;
create policy "kullanicilar_admin_select" on kullanicilar
  for select using (auth.uid() = id or is_admin('operasyon'));

-- ilerleme admin SELECT
drop policy if exists "ilerleme_admin_select" on ilerleme;
create policy "ilerleme_admin_select" on ilerleme
  for select using (auth.uid() = user_id or is_admin('operasyon'));

-- aktivite admin SELECT
drop policy if exists "aktivite_admin_select" on aktivite;
create policy "aktivite_admin_select" on aktivite
  for select using (auth.uid() = user_id or is_admin('operasyon'));

-- kazanilan_rozetler admin SELECT
drop policy if exists "kazanilan_rozetler_admin_select" on kazanilan_rozetler;
create policy "kazanilan_rozetler_admin_select" on kazanilan_rozetler
  for select using (auth.uid() = user_id or is_admin('operasyon'));

-- odemeler admin SELECT
drop policy if exists "odemeler_admin_select" on odemeler;
create policy "odemeler_admin_select" on odemeler
  for select using (auth.uid() = user_id or is_admin('operasyon'));

notify pgrst, 'reload schema';
