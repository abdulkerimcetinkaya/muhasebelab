-- MuhasebeLab — Ünite içeriği (Notion-tarzı zengin metin)
-- Admin paneli BlockNote editor üzerinden JSON olarak yazıyor;
-- kullanıcı tarafında read-only render ediliyor.

alter table unites
  add column if not exists icerik jsonb,
  add column if not exists icerik_guncellendi timestamptz;

comment on column unites.icerik is 'BlockNote document JSON. NULL = içerik henüz hazırlanmadı.';
comment on column unites.icerik_guncellendi is 'İçeriğin son güncellenme zamanı.';

-- Mevcut RLS policy'leri yeterli:
--   * unites_admin_all  → admin tam yetki (is_admin() = true)
--   * unites_public_read → public select
-- Yeni policy gerekmez.
