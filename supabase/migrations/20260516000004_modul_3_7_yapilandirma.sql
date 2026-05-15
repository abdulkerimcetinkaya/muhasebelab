-- Modül 3-7 Yeniden Yapılandırma + Modül 8-9 Kaldırma
--
-- Muhasebe_Egitim_Tum_Moduller.xlsx kaynağına göre mal-alis-satis ünitesindeki
-- modülleri Excel'in 7 modülü ile hizalıyoruz. M1 ve M2 daha önce
-- yapılandırılmıştı (20260516000002 migration); bu migration M3-M7'yi
-- günceller ve gereksiz M8-M9'u kaldırır.
--
-- Excel modülleri:
--   M3 — Diğer Giderler (7'li Grup), 14 konu
--   M4 — Banka İşlemleri, 11 konu
--   M5 — Çek ve Senet İşlemleri, 9 konu
--   M6 — Personel ve Bordro (Detaylı), 7 konu
--   M7 — Duran Varlık Alımları, 7 konu
--
-- Mevcut M3-M9 modülleri başka isimlerle vardı (KDV Atölyesi, Aralıklı
-- Envanter, vb.) — başlık ve içerikleri Excel'e göre değiştirilir.
-- M8 ve M9 silinir (Excel'de yok). Bu modüllerin alt başlıkları boş
-- olduğu için soru taşıma gerekmiyor.

begin;

-- =========================================================================
-- 1) M3-M7 modül başlıklarını güncelle, M8-M9'un alt başlıklarını ve
--    kendilerini sil
-- =========================================================================

update unite_modulleri set
  baslik = 'Diğer Giderler (7''li Grup)',
  aciklama = 'Kira, faturalar, kırtasiye, akaryakıt, bağış, finansman, reklam, vergi-harç, mali müşavir, avukat, İSG, binek oto, mutfak, gider yazılan demirbaşlar.',
  zorluk_seviyesi = 'orta',
  opsiyonel = true
where id = 'mal-alis-satis-m3';

update unite_modulleri set
  baslik = 'Banka İşlemleri',
  aciklama = 'Kısa/uzun vadeli kredi, faiz, komisyon, faktoring, teminat mektubu, vadeli mevduat, kredi kartı, personel maaş ödemesi, menkul kıymet alımı.',
  zorluk_seviyesi = 'orta',
  opsiyonel = true
where id = 'mal-alis-satis-m4';

update unite_modulleri set
  baslik = 'Çek ve Senet İşlemleri',
  aciklama = 'Tahsile verme, tahsil, iskonto/kırdırma, karşılıksız çek, protesto, vade yenileme, ciro, verilen çek/senedin ödenmesi.',
  zorluk_seviyesi = 'orta',
  opsiyonel = true
where id = 'mal-alis-satis-m5';

update unite_modulleri set
  baslik = 'Personel ve Bordro (Detaylı)',
  aciklama = 'İkramiye/prim, personel avansı, yemek-yol, ayni yardımlar, işten çıkarma-tazminat, özel sağlık sigortası.',
  zorluk_seviyesi = 'ileri',
  opsiyonel = true
where id = 'mal-alis-satis-m6';

update unite_modulleri set
  baslik = 'Duran Varlık Alımları',
  aciklama = 'Demirbaş, taşıt, bina-arsa, makine-tesis, maliyete eklenenler, yapılmakta olan yatırımlar, amortisman.',
  zorluk_seviyesi = 'ileri',
  opsiyonel = true
where id = 'mal-alis-satis-m7';

-- M8 ve M9 alt başlıkları (varsa) sil — sonra modülleri sil
delete from modul_alt_basliklari
  where modul_id in ('mal-alis-satis-m8', 'mal-alis-satis-m9');
delete from unite_modulleri
  where id in ('mal-alis-satis-m8', 'mal-alis-satis-m9');

-- =========================================================================
-- 2) M3 — Diğer Giderler (14 konu) alt başlıkları
-- =========================================================================
insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  ('mal-alis-satis-3-1',  'mal-alis-satis-m3',  1, 'Kira Giderleri', false),
  ('mal-alis-satis-3-2',  'mal-alis-satis-m3',  2, 'Kırtasiye, Sarf, Temizlik Malzemesi Alımı', false),
  ('mal-alis-satis-3-3',  'mal-alis-satis-m3',  3, 'Aidat ve Faturalar', false),
  ('mal-alis-satis-3-4',  'mal-alis-satis-m3',  4, 'Posta, Kargo, Yakıt, Akaryakıt', false),
  ('mal-alis-satis-3-5',  'mal-alis-satis-m3',  5, 'Bağış ve Sosyal Sorumluluk Giderleri', false),
  ('mal-alis-satis-3-6',  'mal-alis-satis-m3',  6, 'Finansman Giderleri (780)', false),
  ('mal-alis-satis-3-7',  'mal-alis-satis-m3',  7, 'Reklam, Tanıtım ve Pazarlama Giderleri', false),
  ('mal-alis-satis-3-8',  'mal-alis-satis-m3',  8, 'Vergi, Resim, Harç Giderleri', false),
  ('mal-alis-satis-3-9',  'mal-alis-satis-m3',  9, 'Mali Müşavirlik Giderleri', false),
  ('mal-alis-satis-3-10', 'mal-alis-satis-m3', 10, 'Avukatlık Giderleri', false),
  ('mal-alis-satis-3-11', 'mal-alis-satis-m3', 11, 'İş Sağlığı ve Güvenliği Giderleri', false),
  ('mal-alis-satis-3-12', 'mal-alis-satis-m3', 12, 'Binek Oto Giderleri', false),
  ('mal-alis-satis-3-13', 'mal-alis-satis-m3', 13, 'Mutfak Giderleri', false),
  ('mal-alis-satis-3-14', 'mal-alis-satis-m3', 14, 'Gider Yazılan Demirbaşlar', false)
on conflict (id) do update set sira = excluded.sira, baslik = excluded.baslik, karma = excluded.karma;

-- =========================================================================
-- 3) M4 — Banka İşlemleri (11 konu)
-- =========================================================================
insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  ('mal-alis-satis-4-1',  'mal-alis-satis-m4',  1, 'Kısa Vadeli Banka Kredisi Kullanımı', false),
  ('mal-alis-satis-4-2',  'mal-alis-satis-m4',  2, 'Uzun Vadeli Banka Kredisi Kullanımı', false),
  ('mal-alis-satis-4-3',  'mal-alis-satis-m4',  3, 'Kredi Faiz Ödemeleri', false),
  ('mal-alis-satis-4-4',  'mal-alis-satis-m4',  4, 'Banka Komisyon ve Masrafları', false),
  ('mal-alis-satis-4-5',  'mal-alis-satis-m4',  5, 'Faktoring İşlemleri', false),
  ('mal-alis-satis-4-6',  'mal-alis-satis-m4',  6, 'Banka Teminat Mektupları', false),
  ('mal-alis-satis-4-7',  'mal-alis-satis-m4',  7, 'Vadeli Mevduat ve Faiz Tahakkuku', false),
  ('mal-alis-satis-4-8',  'mal-alis-satis-m4',  8, 'Kredi Kartıyla Tahsilat — Satış Tarafında', false),
  ('mal-alis-satis-4-9',  'mal-alis-satis-m4',  9, 'Kredi Kartı ile Ödeme — Alış Tarafında', false),
  ('mal-alis-satis-4-10', 'mal-alis-satis-m4', 10, 'Personel Maaş Ödemeleri', false),
  ('mal-alis-satis-4-11', 'mal-alis-satis-m4', 11, 'Menkul Kıymet Alımı', false)
on conflict (id) do update set sira = excluded.sira, baslik = excluded.baslik, karma = excluded.karma;

-- =========================================================================
-- 4) M5 — Çek ve Senet İşlemleri (9 konu)
-- =========================================================================
insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  ('mal-alis-satis-5-1',  'mal-alis-satis-m5',  1, 'Çek/Senedin Tahsile Verilmesi', false),
  ('mal-alis-satis-5-2',  'mal-alis-satis-m5',  2, 'Çek/Senedin Vadesinde Tahsil Edilmesi', false),
  ('mal-alis-satis-5-3',  'mal-alis-satis-m5',  3, 'Çek/Senedin Vadesinden Önce Bankaya Kırdırılması', false),
  ('mal-alis-satis-5-4',  'mal-alis-satis-m5',  4, 'Karşılıksız Çıkan Çek', false),
  ('mal-alis-satis-5-5',  'mal-alis-satis-m5',  5, 'Protesto Edilen Senet', false),
  ('mal-alis-satis-5-6',  'mal-alis-satis-m5',  6, 'Çek/Senet Vade Yenilenmesi', false),
  ('mal-alis-satis-5-7',  'mal-alis-satis-m5',  7, 'Müşteri Çek/Senedinin Tedarikçiye Ciro Edilmesi', false),
  ('mal-alis-satis-5-8',  'mal-alis-satis-m5',  8, 'Verilen Çekin/Senedin Vade Tarihinde Tahsil Edilmesi', false),
  ('mal-alis-satis-5-9',  'mal-alis-satis-m5',  9, 'Verilen Çekin/Senedin Vade Yenilenmesi', false)
on conflict (id) do update set sira = excluded.sira, baslik = excluded.baslik, karma = excluded.karma;

-- =========================================================================
-- 5) M6 — Personel ve Bordro (Detaylı) (7 konu)
-- =========================================================================
insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  ('mal-alis-satis-6-1', 'mal-alis-satis-m6', 1, 'İkramiye ve Prim Ödemeleri', false),
  ('mal-alis-satis-6-2', 'mal-alis-satis-m6', 2, 'Personel Avansı', false),
  ('mal-alis-satis-6-3', 'mal-alis-satis-m6', 3, 'Personel Yemek Ücreti', false),
  ('mal-alis-satis-6-4', 'mal-alis-satis-m6', 4, 'Personel Yol/Servis Ücreti', false),
  ('mal-alis-satis-6-5', 'mal-alis-satis-m6', 5, 'Bayram, Hediye, Ayni Yardımlar', false),
  ('mal-alis-satis-6-6', 'mal-alis-satis-m6', 6, 'İşten Çıkarma ve Kıdem-İhbar Tazminatı Ödemesi', false),
  ('mal-alis-satis-6-7', 'mal-alis-satis-m6', 7, 'Personel Sigortası ve Sağlık Giderleri', false)
on conflict (id) do update set sira = excluded.sira, baslik = excluded.baslik, karma = excluded.karma;

-- =========================================================================
-- 6) M7 — Duran Varlık Alımları (7 konu)
-- =========================================================================
insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  ('mal-alis-satis-7-1', 'mal-alis-satis-m7', 1, 'Demirbaş Alımı', false),
  ('mal-alis-satis-7-2', 'mal-alis-satis-m7', 2, 'Taşıt Alımı', false),
  ('mal-alis-satis-7-3', 'mal-alis-satis-m7', 3, 'Bina, Arsa Alımı', false),
  ('mal-alis-satis-7-4', 'mal-alis-satis-m7', 4, 'Makine ve Tesis Alımı', false),
  ('mal-alis-satis-7-5', 'mal-alis-satis-m7', 5, 'Duran Varlığa Bağlı Maliyetler', false),
  ('mal-alis-satis-7-6', 'mal-alis-satis-m7', 6, 'Yapılmakta Olan Yatırımlar', false),
  ('mal-alis-satis-7-7', 'mal-alis-satis-m7', 7, 'Amortisman Hesaplama ve Kaydı', false)
on conflict (id) do update set sira = excluded.sira, baslik = excluded.baslik, karma = excluded.karma;

commit;

notify pgrst, 'reload schema';
