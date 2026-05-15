-- MuhasebeLab — Ünite Modülleri ve Alt Başlıkları
--
-- Mevcut yapı: unite -> unite_konulari -> sorular (eski "Konu" katmanı,
-- teori ağırlıklı kullanılıyordu — bozmuyoruz).
-- Yeni yapı:    unite -> unite_modulleri -> modul_alt_basliklari -> sorular
-- Modül + AltBaşlık atölye odaklı (her alt başlıkta bir veya birden fazla
-- senaryo çözülür — senaryolar `sorular` tablosunda durmaya devam ediyor,
-- sadece alt_baslik_id ile bağlanır).
--
-- İlk hedef: "Ticari Mal Alımı ve Satımı" (mal-alis-satis) ünitesi için
-- 9 modül, 56 alt başlık seed edilir. Eski 6 konu silinmez — kullanıcı
-- istediği zaman migration ile devre dışı bırakabilir.

-- =====================================================================
-- Şema (idempotent — kısmen uygulanmış bir kurulum üzerinde de güvenle çalışır)
-- =====================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'modul_zorluk') then
    create type modul_zorluk as enum ('baslangic', 'orta', 'ileri', 'sinav');
  end if;
end$$;

create table if not exists unite_modulleri (
  id text primary key,
  unite_id text not null references unites(id) on delete cascade,
  sira int not null default 0,
  baslik text not null,
  aciklama text,
  zorluk_seviyesi modul_zorluk not null default 'baslangic',
  opsiyonel boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists unite_modulleri_unite_idx on unite_modulleri (unite_id, sira);

drop trigger if exists unite_modulleri_updated_at on unite_modulleri;
create trigger unite_modulleri_updated_at before update on unite_modulleri
  for each row execute function set_updated_at();

create table if not exists modul_alt_basliklari (
  id text primary key,
  modul_id text not null references unite_modulleri(id) on delete cascade,
  sira int not null default 0,
  baslik text not null,
  -- "Karma" alt başlık (bütünleşik vaka) — UI'da yıldız ile vurgulanır
  karma boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists modul_alt_basliklari_modul_idx on modul_alt_basliklari (modul_id, sira);

drop trigger if exists modul_alt_basliklari_updated_at on modul_alt_basliklari;
create trigger modul_alt_basliklari_updated_at before update on modul_alt_basliklari
  for each row execute function set_updated_at();

-- Soruyu alt başlığa bağla — nullable, eski sorular etkilenmez
alter table sorular add column if not exists alt_baslik_id text
  references modul_alt_basliklari(id) on delete set null;
create index if not exists sorular_alt_baslik_idx on sorular (alt_baslik_id)
  where alt_baslik_id is not null;

-- =====================================================================
-- RLS
-- =====================================================================

alter table unite_modulleri enable row level security;
alter table modul_alt_basliklari enable row level security;

drop policy if exists "modul_public_read" on unite_modulleri;
create policy "modul_public_read"
  on unite_modulleri for select using (true);
drop policy if exists "modul_admin_all" on unite_modulleri;
create policy "modul_admin_all"
  on unite_modulleri for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "alt_baslik_public_read" on modul_alt_basliklari;
create policy "alt_baslik_public_read"
  on modul_alt_basliklari for select using (true);
drop policy if exists "alt_baslik_admin_all" on modul_alt_basliklari;
create policy "alt_baslik_admin_all"
  on modul_alt_basliklari for all
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- Seed: Ticari Mal Alımı ve Satımı (mal-alis-satis) — 9 modül
-- =====================================================================

insert into unite_modulleri (id, unite_id, sira, baslik, aciklama, zorluk_seviyesi, opsiyonel) values
  ('mal-alis-satis-m1', 'mal-alis-satis', 1,
   'Isınma: İlk Kayıtlar',
   'KDV''siz, peşin, 2-3 hesaplı basit yevmiyeler. Dropdown sistemine alışmak için.',
   'baslangic', false),

  ('mal-alis-satis-m2', 'mal-alis-satis', 2,
   'Ödeme Şekilleri Atölyesi',
   'KDV %20 sabit. Ödeme şekilleri çeşitlenir: peşin, vadeli, senetli, çekli.',
   'baslangic', false),

  ('mal-alis-satis-m3', 'mal-alis-satis', 3,
   'KDV Atölyesi',
   'KDV oranları çeşitlenir (%1, %10, %20). Ay sonu mahsuplaşma öğrenilir.',
   'orta', false),

  ('mal-alis-satis-m4', 'mal-alis-satis', 4,
   'Aralıklı Envanter: Alışlar',
   'Gider, iade ve iskonto durumları girer. "Alış gideri maliyete eklenir" refleksi yerleşir.',
   'orta', false),

  ('mal-alis-satis-m5', 'mal-alis-satis', 5,
   'Aralıklı Envanter: Satışlar',
   '"Satış gideri 760''a gider yazılır" refleksi yerleşir. 610 ve 611 hesapları girer.',
   'orta', false),

  ('mal-alis-satis-m6', 'mal-alis-satis', 6,
   'Dönem Sonu Atölyesi',
   'SMM hesaplama, sayım, 621''e aktarım.',
   'ileri', false),

  ('mal-alis-satis-m7', 'mal-alis-satis', 7,
   'Devamlı Envanter Atölyesi',
   'Çift kayıt mantığı, stok değerleme (FIFO, ortalama).',
   'ileri', false),

  ('mal-alis-satis-m8', 'mal-alis-satis', 8,
   'İleri Vakalar (Opsiyonel)',
   'Tevkifat, ihracat, ithalat, stok değer düşüklüğü.',
   'ileri', true),

  ('mal-alis-satis-m9', 'mal-alis-satis', 9,
   'Patron Vakaları',
   'Ünite bitirme vakaları. Karma, uzun, gerçekçi senaryolar.',
   'sinav', false)
on conflict (id) do update set
  unite_id = excluded.unite_id,
  sira = excluded.sira,
  baslik = excluded.baslik,
  aciklama = excluded.aciklama,
  zorluk_seviyesi = excluded.zorluk_seviyesi,
  opsiyonel = excluded.opsiyonel;

-- =====================================================================
-- Seed: 56 alt başlık
-- =====================================================================

insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  -- Modül 1 — Isınma (5)
  ('mal-alis-satis-1-1', 'mal-alis-satis-m1', 1, 'İlk Alış (Kasadan Ödeme)', false),
  ('mal-alis-satis-1-2', 'mal-alis-satis-m1', 2, 'İlk Satış (Kasaya Tahsilat)', false),
  ('mal-alis-satis-1-3', 'mal-alis-satis-m1', 3, 'Bankadan Alış', false),
  ('mal-alis-satis-1-4', 'mal-alis-satis-m1', 4, 'Bankaya Satış Tahsilatı', false),
  ('mal-alis-satis-1-5', 'mal-alis-satis-m1', 5, 'Karma: 3 Basit İşlem', true),

  -- Modül 2 — Ödeme Şekilleri (10)
  ('mal-alis-satis-2-1', 'mal-alis-satis-m2', 1, 'Peşin Alış (Kasa)', false),
  ('mal-alis-satis-2-2', 'mal-alis-satis-m2', 2, 'Peşin Satış (Kasa)', false),
  ('mal-alis-satis-2-3', 'mal-alis-satis-m2', 3, 'Banka ile Alış-Satış', false),
  ('mal-alis-satis-2-4', 'mal-alis-satis-m2', 4, 'Vadeli Alış (320 Satıcılar)', false),
  ('mal-alis-satis-2-5', 'mal-alis-satis-m2', 5, 'Vadeli Satış (120 Alıcılar)', false),
  ('mal-alis-satis-2-6', 'mal-alis-satis-m2', 6, 'Senetli Alış (321 Borç Senetleri)', false),
  ('mal-alis-satis-2-7', 'mal-alis-satis-m2', 7, 'Senetli Satış (121 Alacak Senetleri)', false),
  ('mal-alis-satis-2-8', 'mal-alis-satis-m2', 8, 'Müşteriden Çek Aldım (101)', false),
  ('mal-alis-satis-2-9', 'mal-alis-satis-m2', 9, 'Çek Verdim (103)', false),
  ('mal-alis-satis-2-10', 'mal-alis-satis-m2', 10, 'Karma Gün: Beş Farklı Ödeme', true),

  -- Modül 3 — KDV (7)
  ('mal-alis-satis-3-1', 'mal-alis-satis-m3', 1, '%20 KDV ile Alış', false),
  ('mal-alis-satis-3-2', 'mal-alis-satis-m3', 2, '%20 KDV ile Satış', false),
  ('mal-alis-satis-3-3', 'mal-alis-satis-m3', 3, '%10 İndirimli Oranda İşlem', false),
  ('mal-alis-satis-3-4', 'mal-alis-satis-m3', 4, '%1 Oranda İşlem (Temel Gıda)', false),
  ('mal-alis-satis-3-5', 'mal-alis-satis-m3', 5, 'Ay Sonu Mahsuplaşma → 360 Ödenecek', false),
  ('mal-alis-satis-3-6', 'mal-alis-satis-m3', 6, 'Ay Sonu Mahsuplaşma → 190 Devreden', false),
  ('mal-alis-satis-3-7', 'mal-alis-satis-m3', 7, 'Bir Aylık KDV Kapatma Vakası', true),

  -- Modül 4 — Aralıklı Alışlar (10)
  ('mal-alis-satis-4-1', 'mal-alis-satis-m4', 1, 'Basit Peşin Alış', false),
  ('mal-alis-satis-4-2', 'mal-alis-satis-m4', 2, 'Basit Vadeli Alış', false),
  ('mal-alis-satis-4-3', 'mal-alis-satis-m4', 3, 'Nakliyeli Alış (Maliyete Ekleme)', false),
  ('mal-alis-satis-4-4', 'mal-alis-satis-m4', 4, 'Sigortalı Alış (Maliyete Ekleme)', false),
  ('mal-alis-satis-4-5', 'mal-alis-satis-m4', 5, 'Çoklu Gider (Nakliye + Hamaliye + Sigorta)', false),
  ('mal-alis-satis-4-6', 'mal-alis-satis-m4', 6, 'Alış İadesi — Peşinden', false),
  ('mal-alis-satis-4-7', 'mal-alis-satis-m4', 7, 'Alış İadesi — Vadeliden', false),
  ('mal-alis-satis-4-8', 'mal-alis-satis-m4', 8, 'Fatura Üzerinde İskonto', false),
  ('mal-alis-satis-4-9', 'mal-alis-satis-m4', 9, 'Sonradan Kasa İskontosu', false),
  ('mal-alis-satis-4-10', 'mal-alis-satis-m4', 10, 'Karma Vaka: Alış Haftası', true),

  -- Modül 5 — Aralıklı Satışlar (6)
  ('mal-alis-satis-5-1', 'mal-alis-satis-m5', 1, 'Basit Peşin Satış', false),
  ('mal-alis-satis-5-2', 'mal-alis-satis-m5', 2, 'Basit Vadeli Satış', false),
  ('mal-alis-satis-5-3', 'mal-alis-satis-m5', 3, 'Nakliyeli Satış (760 Pazarlama Satış Dağıtım)', false),
  ('mal-alis-satis-5-4', 'mal-alis-satis-m5', 4, 'Satış İadesi', false),
  ('mal-alis-satis-5-5', 'mal-alis-satis-m5', 5, 'Satış İskontosu (611)', false),
  ('mal-alis-satis-5-6', 'mal-alis-satis-m5', 6, 'Karma Vaka: Satış Haftası', true),

  -- Modül 6 — Dönem Sonu (4)
  ('mal-alis-satis-6-1', 'mal-alis-satis-m6', 1, 'SMM Hesaplama', false),
  ('mal-alis-satis-6-2', 'mal-alis-satis-m6', 2, 'DSMM Kaydı', false),
  ('mal-alis-satis-6-3', 'mal-alis-satis-m6', 3, '621''e Aktarım', false),
  ('mal-alis-satis-6-4', 'mal-alis-satis-m6', 4, 'Tam Dönem Vakası: Açılış → Kapanış', true),

  -- Modül 7 — Devamlı Envanter (7)
  ('mal-alis-satis-7-1', 'mal-alis-satis-m7', 1, 'İlk Çift Kayıt: Satışta Hasılat + Maliyet', false),
  ('mal-alis-satis-7-2', 'mal-alis-satis-m7', 2, 'Karşılaştırma: Aralıklı vs Devamlı', false),
  ('mal-alis-satis-7-3', 'mal-alis-satis-m7', 3, 'İadede Maliyetin Geri Çevrilmesi', false),
  ('mal-alis-satis-7-4', 'mal-alis-satis-m7', 4, 'FIFO ile Tek İşlem', false),
  ('mal-alis-satis-7-5', 'mal-alis-satis-m7', 5, 'FIFO Çoklu Parti', false),
  ('mal-alis-satis-7-6', 'mal-alis-satis-m7', 6, 'Ağırlıklı Ortalama', false),
  ('mal-alis-satis-7-7', 'mal-alis-satis-m7', 7, 'Karma Vaka: Devamlı Envanter Haftası', true),

  -- Modül 8 — İleri Vakalar (4)
  ('mal-alis-satis-8-1', 'mal-alis-satis-m8', 1, 'KDV Tevkifatlı İşlem', false),
  ('mal-alis-satis-8-2', 'mal-alis-satis-m8', 2, 'İhracat (KDV İstisnası)', false),
  ('mal-alis-satis-8-3', 'mal-alis-satis-m8', 3, 'İthalat (Gümrük + Maliyet)', false),
  ('mal-alis-satis-8-4', 'mal-alis-satis-m8', 4, 'Stok Değer Düşüklüğü (158)', false),

  -- Modül 9 — Patron Vakaları (3)
  ('mal-alis-satis-9-1', 'mal-alis-satis-m9', 1, 'Mini Market — 30 Günlük Operasyon', true),
  ('mal-alis-satis-9-2', 'mal-alis-satis-m9', 2, 'Tekstil Toptancısı', true),
  ('mal-alis-satis-9-3', 'mal-alis-satis-m9', 3, 'İthalat Yapan Elektronik Firması', true)
on conflict (id) do update set
  modul_id = excluded.modul_id,
  sira = excluded.sira,
  baslik = excluded.baslik,
  karma = excluded.karma;

-- PostgREST schema cache reload
notify pgrst, 'reload schema';
