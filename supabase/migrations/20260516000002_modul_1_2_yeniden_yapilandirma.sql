-- Mal-Alis-Satis Ünitesi — Modül 1 & 2 Yeniden Yapılandırma
--
-- Modul_Konu_ve_Muavin_Listesi.xlsx kullanıcı tarafından sağlandı; bu liste
-- otorite kaynak. Migration:
--
-- 1. Modül 2 başlığını "Ödeme Şekilleri Atölyesi" → "Vergi Boyutu" rename
-- 2. Eksik muavinleri ekle (1 M1 eksik + ~31 M2 yenisi)
-- 3. Modül 1: 86 soruyu birleştirilen alt başlıklara taşı, 3 eski alt
--    başlığı sil (1-3 Kredili Mal Alımı, 1-4 Kredili Mal Satışı, 1-12
--    Konsinye), kalan 10'unu yeni başlık+sıraya getir
-- 4. Modül 2: 9 yeni alt başlık ekle
--
-- Soru taşıma haritası:
--   1-3 (Kredili Mal Alımı, mh19-21) → 1-1 (Mal Alımı)
--   1-4 (Kredili Mal Satışı, mh28-33) → 1-2 (Mal Satışı)
--   1-12 (Konsinye, mh18+mh76-80) → 1-1 (Mal Alımı)
--   1-13 (Numune, mh81-86) — alt başlık rename oluyor "Satışa Bağlı Giderler",
--   sorular orada kalır.
--
-- Tek transaction — sıra önemli: önce soru taşı, sonra alt başlık sil,
-- sonra rename, en son yeni ekle.

begin;

-- =========================================================================
-- 1) Modül 2'yi "Vergi Boyutu" olarak yeniden adlandır
-- =========================================================================
update unite_modulleri
set
  baslik = 'Vergi Boyutu',
  aciklama = 'KDV, stopaj, damga vergisi ve muhtasar beyanname işlemleri.'
where id = 'mal-alis-satis-m2';

-- =========================================================================
-- 2) Eksik muavinleri ekle (M1 eksikler + M2 tümü)
-- =========================================================================

-- M1 — eksik tek muavin: 760.004
-- M2 — toplam ~31 yeni muavin
insert into muavin_hesaplar (kod, ana_kod, ad, tip, sira) values
  -- M1 — eksik 760 muavinleri
  ('760.004', '760', 'Ambalaj ve Paketleme Giderleri', 'diger', 4),

  -- M2 — 190 DEVREDEN KDV (tek muavin)
  ('190.001', '190', 'Devreden KDV', 'diger', 1),

  -- M2 — 191 Tevkifat
  ('191.004', '191', 'Tevkifata Tabi İndirilecek KDV', 'diger', 4),

  -- M2 — 320 yeni hizmet tedarikçileri
  ('320.007', '320', 'Pırlanta Temizlik Hizmetleri Ltd. Şti.', 'tedarikci', 7),
  ('320.010', '320', 'Erdem Danışmanlık Ltd. Şti.', 'tedarikci', 10),

  -- M2 — 329 DİĞER TİCARİ BORÇLAR (gerçek kişi tedarikçiler)
  ('329.001', '329', 'Ahmet Yılmaz (kiraya veren, gerçek kişi)', 'tedarikci', 1),
  ('329.002', '329', 'Çelik Mali Müşavirlik (gerçek kişi)', 'tedarikci', 2),
  ('329.003', '329', 'Yılmaz Hukuk Bürosu (gerçek kişi avukat)', 'tedarikci', 3),

  -- M2 — 335 PERSONELE BORÇLAR
  ('335.001', '335', 'Mehmet Demir (depo görevlisi)', 'personel', 1),
  ('335.002', '335', 'Ayşe Kaya (muhasebe asistanı)', 'personel', 2),
  ('335.003', '335', 'Hasan Çelik (satış temsilcisi)', 'personel', 3),

  -- M2 — 360 ÖDENECEK VERGİ VE FONLAR
  ('360.001', '360', 'Ödenecek KDV', 'diger', 1),
  ('360.002', '360', 'Ödenecek GV Stopajı — Kira', 'diger', 2),
  ('360.003', '360', 'Ödenecek GV Stopajı — Serbest Meslek', 'diger', 3),
  ('360.004', '360', 'Ödenecek GV Stopajı — Ücret', 'diger', 4),
  ('360.005', '360', 'Ödenecek Damga Vergisi', 'diger', 5),
  ('360.006', '360', 'Ödenecek KDV Tevkifatı', 'diger', 6),

  -- M2 — 361 ÖDENECEK SGK KESİNTİLERİ
  ('361.001', '361', 'SGK İşçi Payı', 'diger', 1),
  ('361.002', '361', 'SGK İşveren Payı', 'diger', 2),
  ('361.003', '361', 'İşsizlik Sigortası İşçi Payı', 'diger', 3),
  ('361.004', '361', 'İşsizlik Sigortası İşveren Payı', 'diger', 4),

  -- M2 — 770 GENEL YÖNETİM GİDERLERİ
  ('770.001', '770', 'Kira Giderleri', 'diger', 1),
  ('770.002', '770', 'Mali Müşavirlik Giderleri', 'diger', 2),
  ('770.003', '770', 'Avukatlık Giderleri', 'diger', 3),
  ('770.004', '770', 'Personel Ücretleri (Brüt)', 'diger', 4),
  ('770.005', '770', 'SGK İşveren Payı Gideri', 'diger', 5),
  ('770.006', '770', 'Damga Vergisi Gideri', 'diger', 6),
  ('770.007', '770', 'Temizlik Hizmet Gideri', 'diger', 7),
  ('770.008', '770', 'Danışmanlık Giderleri', 'diger', 8),
  ('770.009', '770', 'Taşımacılık Hizmet Gideri', 'diger', 9),
  ('770.010', '770', 'Bina Tadilat / Yapım İşleri Gideri', 'diger', 10)
on conflict (kod) do update set
  ad = excluded.ad,
  ana_kod = excluded.ana_kod,
  tip = excluded.tip,
  sira = excluded.sira;

-- =========================================================================
-- 3) Modül 1 soru taşıma — silinecek alt başlıklardan kurtar
-- =========================================================================

-- 1-3 (Kredili Mal Alımı) → 1-1 (Mal Alımı)
update sorular set alt_baslik_id = 'mal-alis-satis-1-1'
  where id in ('mh19', 'mh20', 'mh21');

-- 1-4 (Kredili Mal Satışı) → 1-2 (Mal Satışı)
update sorular set alt_baslik_id = 'mal-alis-satis-1-2'
  where id in ('mh28', 'mh29', 'mh30', 'mh31', 'mh32', 'mh33');

-- 1-12 (Konsinye) → 1-1 (Mal Alımı)
-- Konsinye senaryoları mal hareketinin bir varyantı; ayrı konu olarak
-- görünmek yerine Mal Alımı altında pratik edilir.
update sorular set alt_baslik_id = 'mal-alis-satis-1-1'
  where id in ('mh18', 'mh76', 'mh77', 'mh78', 'mh79', 'mh80');

-- =========================================================================
-- 4) Eski alt başlıkları sil (artık soruları yok)
-- =========================================================================
delete from modul_alt_basliklari
  where id in (
    'mal-alis-satis-1-3',  -- Kredili Mal Alımı (taşındı)
    'mal-alis-satis-1-4',  -- Kredili Mal Satışı (taşındı)
    'mal-alis-satis-1-12'  -- Konsinye Mal Hareketi (taşındı)
  );

-- =========================================================================
-- 5) Kalan Modül 1 alt başlıklarının başlık ve sıralarını güncelle
-- (Excel'deki 10 konunun sıralamasına göre)
-- =========================================================================
update modul_alt_basliklari set baslik = 'Mal Alımı',                            sira = 1,  karma = false where id = 'mal-alis-satis-1-1';
update modul_alt_basliklari set baslik = 'Alıştan İade',                         sira = 2,  karma = false where id = 'mal-alis-satis-1-6';
update modul_alt_basliklari set baslik = 'Alış İskontosu',                       sira = 3,  karma = false where id = 'mal-alis-satis-1-8';
update modul_alt_basliklari set baslik = 'Verilen Sipariş Avansı',               sira = 4,  karma = false where id = 'mal-alis-satis-1-10';
update modul_alt_basliklari set baslik = 'Mal Satışı',                           sira = 5,  karma = false where id = 'mal-alis-satis-1-2';
update modul_alt_basliklari set baslik = 'Satıştan İade',                        sira = 6,  karma = false where id = 'mal-alis-satis-1-5';
update modul_alt_basliklari set baslik = 'Satış İskontosu',                      sira = 7,  karma = false where id = 'mal-alis-satis-1-7';
update modul_alt_basliklari set baslik = 'Alınan Sipariş Avansı',                sira = 8,  karma = false where id = 'mal-alis-satis-1-11';
update modul_alt_basliklari set baslik = 'Satışa Bağlı Giderler (760 PSDG)',     sira = 9,  karma = false where id = 'mal-alis-satis-1-13';
update modul_alt_basliklari set baslik = 'Fiyat Farkı Faturası',                 sira = 10, karma = false where id = 'mal-alis-satis-1-9';

-- =========================================================================
-- 6) Modül 2 — 9 yeni alt başlık ekle
-- =========================================================================
insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  ('mal-alis-satis-2-1', 'mal-alis-satis-m2', 1, 'KDV Oranları ve Doğru Hesap Seçimi', false),
  ('mal-alis-satis-2-2', 'mal-alis-satis-m2', 2, 'İndirilecek KDV — Hesaplanan KDV Mahsubu', false),
  ('mal-alis-satis-2-3', 'mal-alis-satis-m2', 3, 'Devreden KDV / Ödenecek KDV Tahakkuku', false),
  ('mal-alis-satis-2-4', 'mal-alis-satis-m2', 4, 'KDV Beyannamesi Tahakkuku ve Ödemesi', false),
  ('mal-alis-satis-2-5', 'mal-alis-satis-m2', 5, 'KDV Tevkifatı — Hizmet Alımı', false),
  ('mal-alis-satis-2-6', 'mal-alis-satis-m2', 6, 'Gelir Vergisi Stopajı (Kira + Serbest Meslek)', false),
  ('mal-alis-satis-2-7', 'mal-alis-satis-m2', 7, 'Çalışan Stopajları — Personel Bordrosu', false),
  ('mal-alis-satis-2-8', 'mal-alis-satis-m2', 8, 'Damga Vergisi', false),
  ('mal-alis-satis-2-9', 'mal-alis-satis-m2', 9, 'Muhtasar Beyanname ve SGK Ödemeleri', false)
on conflict (id) do update set
  sira = excluded.sira,
  baslik = excluded.baslik,
  karma = excluded.karma;

commit;

notify pgrst, 'reload schema';
