-- Ünite / Modül / Alt başlık için aktif-pasif bayrağı + 3 pasif işletme türü
--
-- Yapı: /uniteler sayfasında 4 işletme türü kartı gösterilir. Sadece Ticaret
-- aktif, diğer 3 "Yakında" rozetiyle pasif. Önceden bu liste frontend'de
-- statikti — şimdi DB'den geliyor ki admin tarafında yönetilebilsin.
--
-- Sorular için ayrı `aktif` bayrağı YOK çünkü mevcut `durum` enum
-- ('taslak'|'inceleme'|'onayli'|'arsiv') zaten yönetiyor. 'arsiv' = pasif,
-- 'onayli' = aktif. Admin sorular sayfası bunu zaten kullanıyor.

begin;

-- =========================================================================
-- 1) aktif kolonları ekle (default true — mevcut tüm kayıtlar aktif sayılır)
-- =========================================================================
alter table unites
  add column if not exists aktif boolean not null default true;

alter table unite_modulleri
  add column if not exists aktif boolean not null default true;

alter table modul_alt_basliklari
  add column if not exists aktif boolean not null default true;

alter table unite_konulari
  add column if not exists aktif boolean not null default true;

-- =========================================================================
-- 2) 3 yeni işletme türü ünitesi ekle — pasif olarak
-- (Üretim / Hizmet / İnşaat-Taahhüt). Müfredatları daha sonra hazırlanacak.
-- =========================================================================
insert into unites (id, ad, aciklama, thiings_icon, sira, aktif) values
  (
    'uretim-isletmesi',
    'Üretim İşletmesi',
    'Mamul üretim, maliyet muhasebesi, 7/B sınıfı — müfredat hazırlanıyor.',
    'factory',
    2,
    false
  ),
  (
    'hizmet-isletmesi',
    'Hizmet İşletmesi',
    'Hizmet sunan işletmeler için özel kayıtlar — müfredat hazırlanıyor.',
    'briefcase',
    3,
    false
  ),
  (
    'insaat-taahhut',
    'İnşaat / Taahhüt',
    'Yıllara yaygın inşaat, hak ediş, taşeronlar — müfredat hazırlanıyor.',
    'hardhat',
    4,
    false
  )
on conflict (id) do update set
  ad = excluded.ad,
  aciklama = excluded.aciklama,
  thiings_icon = excluded.thiings_icon,
  sira = excluded.sira,
  aktif = excluded.aktif;

-- =========================================================================
-- 3) mal-alis-satis ünitesinin aktif ve sırasının doğru olmasını garantile
-- =========================================================================
update unites set
  aktif = true,
  sira = 1
where id = 'mal-alis-satis';

commit;

notify pgrst, 'reload schema';
