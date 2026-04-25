-- MuhasebeLab — admin RLS
-- is_admin() fonksiyonu JWT'deki email'i kontrol eder.
-- Yeni admin eklemek için aşağıdaki email listesine ekle ve migration'ı tekrar çalıştır.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() ->> 'email') in ('kerim.cetinkayaa78@gmail.com'),
    false
  );
$$;

-- =====================================================================
-- ADMIN POLİCY'LERİ
-- Admin: sorular, cozumler, unites, soru_hatalari üzerinde tam yetki.
-- Mevcut public-read policy'lerini bozmuyoruz; yanına admin için all-access ekliyoruz.
-- =====================================================================

-- Sorular: admin tüm satırları görür/yazar (taslak/inceleme dahil)
create policy "sorular_admin_all" on sorular
  for all using (is_admin()) with check (is_admin());

-- Çözümler: admin tüm satırları görür/yazar (taslak sorulara bağlı çözümler dahil)
create policy "cozumler_admin_all" on cozumler
  for all using (is_admin()) with check (is_admin());

-- Üniteler: admin yeni ünite ekleyebilir / düzenleyebilir
create policy "unites_admin_all" on unites
  for all using (is_admin()) with check (is_admin());

-- Hesap planı: admin düzenleyebilir (yeni hesap ekleme nadiren gerekir)
create policy "hesap_plani_admin_all" on hesap_plani
  for all using (is_admin()) with check (is_admin());

-- Rozet katalog: admin yeni rozet ekleyebilir
create policy "rozetler_katalog_admin_all" on rozetler_katalog
  for all using (is_admin()) with check (is_admin());

-- Soru hataları: admin tüm bildirimleri görür ve durum güncelleyebilir
create policy "hata_admin_all" on soru_hatalari
  for all using (is_admin()) with check (is_admin());

-- Kullanıcı listesi: admin tüm profilleri okuyabilir (moderasyon için)
create policy "kullanici_admin_select" on kullanicilar
  for select using (is_admin());
