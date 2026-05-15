-- =====================================================================
-- Modül 1 / Konu 1: Mal Alımı — 10 yeni soru
-- =====================================================================
-- Yıldız Beyaz Eşya Ticaret A.Ş. işletmesi üzerinden 10 senaryo:
-- 5 KOLAY, 3 ORTA, 2 ZOR. ID konvansiyonu: m1k1-s01 ... m1k1-s10
--
-- Tüm sorular durum='onayli' — frontend tarafında anında görünür.
-- alt_baslik_id = 'mal-alis-satis-1-1' (Mal Alımı alt başlığı)
--
-- ÇÖZÜMLER MUAVİN KODUYLA: cozumler.kod artık muavin_hesaplar(kod) FK'lı
-- ve format check 'XXX.NNN+' zorunlu (20260515000002 migration). Yani
-- doğru çözüm muavin düzeyinde tutulmalı.
--
-- Bu migration önce eksik muavinleri ekler (103/321/101 — verilen çek,
-- borç senedi, alınan çek). Sonra sorular + cozumler insert eder.

begin;

-- =====================================================================
-- 1) Eksik muavinler — verilen çekler (103), borç senetleri (321),
--    alınan çekler (101)
-- =====================================================================
insert into muavin_hesaplar (kod, ana_kod, ad, tip, sira) values
  -- 103 VERİLEN ÇEKLER VE ÖDEME EMİRLERİ (tedarikçi başına)
  ('103.001', '103', 'Verilen Çek – Arçelik A.Ş.', 'tedarikci', 1),
  ('103.002', '103', 'Verilen Çek – Vestel Ticaret A.Ş.', 'tedarikci', 2),
  ('103.003', '103', 'Verilen Çek – Bosch Ev Aletleri A.Ş.', 'tedarikci', 3),
  ('103.004', '103', 'Verilen Çek – Samsung Elektronik Türkiye A.Ş.', 'tedarikci', 4),
  ('103.005', '103', 'Verilen Çek – LG Electronics Türkiye A.Ş.', 'tedarikci', 5),
  -- 321 BORÇ SENETLERİ (tedarikçi başına)
  ('321.001', '321', 'Borç Senedi – Arçelik A.Ş.', 'tedarikci', 1),
  ('321.002', '321', 'Borç Senedi – Vestel Ticaret A.Ş.', 'tedarikci', 2),
  ('321.003', '321', 'Borç Senedi – Bosch Ev Aletleri A.Ş.', 'tedarikci', 3),
  ('321.004', '321', 'Borç Senedi – Samsung Elektronik Türkiye A.Ş.', 'tedarikci', 4),
  ('321.005', '321', 'Borç Senedi – LG Electronics Türkiye A.Ş.', 'tedarikci', 5),
  -- 101 ALINAN ÇEKLER (müşteri başına)
  ('101.001', '101', 'Alınan Çek – Çağdaş Elektronik Ltd. Şti.', 'musteri', 1)
on conflict (kod) do nothing;

-- =====================================================================
-- 2) Sorular — 10 senaryo
-- =====================================================================

insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values

-- ---------------------------------------------------------------------
-- SORU 1.1 — KOLAY — Kasa ile Peşin Mal Alımı
-- ---------------------------------------------------------------------
(
  'm1k1-s01',
  'Kasa ile Peşin Mal Alımı',
  'kolay',
  E'İşletmemiz, **03.04.2026** tarihinde **Arçelik A.Ş.**''den **8 adet No-Frost buzdolabı** alımı yapmıştır. KDV hariç birim fiyat **18.500 TL**, KDV oranı **%20**''dir. Faturanın tamamı işletme kasasından **nakit olarak peşin** ödenmiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 8 × 18.500 = **148.000 TL**\n- KDV (%20): **29.600 TL**\n- Toplam ödeme: **177.600 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.2 — KOLAY — Banka EFT ile Peşin Mal Alımı
-- ---------------------------------------------------------------------
(
  'm1k1-s02',
  'Banka EFT ile Peşin Mal Alımı',
  'kolay',
  E'İşletmemiz, **09.04.2026** tarihinde **Vestel Ticaret A.Ş.**''den **6 adet LED 32'''' televizyon** alımı yapmıştır. KDV hariç birim fiyat **8.500 TL**, KDV oranı **%20**''dir. Faturanın tamamı işletmemizin **Garanti BBVA TL hesabından EFT ile peşin** ödenmiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 6 × 8.500 = **51.000 TL**\n- KDV (%20): **10.200 TL**\n- Toplam ödeme: **61.200 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.3 — KOLAY — Kredili Mal Alımı (Cari Hesap)
-- ---------------------------------------------------------------------
(
  'm1k1-s03',
  'Kredili Mal Alımı — Cari Hesap',
  'kolay',
  E'İşletmemiz, **15.04.2026** tarihinde **Bosch Ev Aletleri A.Ş.**''den **12 adet bulaşık makinesi** alımı yapmıştır. KDV hariç birim fiyat **14.000 TL**, KDV oranı **%20**''dir. Fatura bedelinin tamamı **kredili olarak** tedarikçinin cari hesabına kaydedilmiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 12 × 14.000 = **168.000 TL**\n- KDV (%20): **33.600 TL**\n- Toplam (cari hesaba kayıt): **201.600 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.4 — KOLAY — Kendi Çekimizle Mal Alımı
-- ---------------------------------------------------------------------
(
  'm1k1-s04',
  'Kendi Çekimizle Mal Alımı',
  'kolay',
  E'İşletmemiz, **22.04.2026** tarihinde **Samsung Elektronik Türkiye A.Ş.**''den **5 adet split klima** alımı yapmıştır. KDV hariç birim fiyat **13.000 TL**, KDV oranı **%20**''dir. Fatura bedelinin tamamı için işletmemiz **kendi çekini düzenleyip** tedarikçiye vermiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 5 × 13.000 = **65.000 TL**\n- KDV (%20): **13.000 TL**\n- Toplam (çek nominal değeri): **78.000 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.5 — KOLAY — Senet Düzenleyerek Mal Alımı
-- ---------------------------------------------------------------------
(
  'm1k1-s05',
  'Senet Düzenleyerek Mal Alımı',
  'kolay',
  E'İşletmemiz, **28.04.2026** tarihinde **LG Electronics Türkiye A.Ş.**''den **4 adet salon tipi klima** alımı yapmıştır. KDV hariç birim fiyat **17.000 TL**, KDV oranı **%20**''dir. Fatura bedelinin tamamı için işletmemiz adına **bono düzenlenerek** tedarikçiye verilmiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 4 × 17.000 = **68.000 TL**\n- KDV (%20): **13.600 TL**\n- Toplam (bono nominal değeri): **81.600 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.6 — ORTA — Karma Ödeme (Yarısı Banka, Yarısı Kredili)
-- ---------------------------------------------------------------------
(
  'm1k1-s06',
  'Karma Ödeme — Yarısı Banka, Yarısı Kredili',
  'orta',
  E'İşletmemiz, **06.05.2026** tarihinde **Arçelik A.Ş.**''den **10 adet mini buzdolabı** alımı yapmıştır. KDV hariç birim fiyat **7.500 TL**, KDV oranı **%20**''dir. Fatura bedelinin **yarısı** işletmemizin **İş Bankası TL hesabından EFT ile peşin** ödenmiş, kalan **yarısı kredili olarak** tedarikçinin cari hesabına kaydedilmiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 10 × 7.500 = **75.000 TL**\n- KDV (%20): **15.000 TL**\n- Toplam: **90.000 TL**\n- İş Bankası kısmı (1/2): **45.000 TL**\n- Kredili kısım (1/2): **45.000 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.7 — ORTA — Mal Alımı + Nakliye Maliyete Eklenmesi
-- ---------------------------------------------------------------------
(
  'm1k1-s07',
  'Mal Alımı + Nakliye Maliyete Eklenmesi (Tek Yevmiyede)',
  'orta',
  E'İşletmemiz, **13.05.2026** tarihinde **Bosch Ev Aletleri A.Ş.**''den **8 adet bulaşık makinesi** kredili olarak almıştır. KDV hariç birim fiyat **14.500 TL**, KDV oranı **%20**''dir. Aynı faturada, Bosch tarafından sağlanan **nakliye hizmeti bedeli 4.000 TL + KDV** olarak yer almaktadır. **Nakliye bedeli mal maliyetine eklenmiştir.** Fatura toplamının tamamı **kredili olarak** tedarikçinin cari hesabına kaydedilmiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 8 × 14.500 = **116.000 TL**\n- Nakliye: **4.000 TL**\n- Toplam maliyet (153''e): **120.000 TL**\n- Mal KDV: **23.200 TL**\n- Nakliye KDV: **800 TL**\n- Toplam KDV (191''e): **24.000 TL**\n- Cari hesaba toplam kayıt: **144.000 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.8 — ORTA — Farklı KDV Oranlı Mal Karması
-- ---------------------------------------------------------------------
(
  'm1k1-s08',
  'Farklı KDV Oranlı Mal Karması Tek Faturada',
  'orta',
  E'İşletmemiz, **20.05.2026** tarihinde **LG Electronics Türkiye A.Ş.**''den karma bir alım yapmıştır. Aynı fatura kapsamında **5 adet salon tipi klima** (KDV hariç birim **17.500 TL**, KDV **%20**) ve **4 adet özel düzenlemeye tabi enerji verimli ankastre fırın** (KDV hariç birim **10.000 TL**, KDV **%10**) satın alınmıştır. Fatura toplamının tamamı işletmemizin **Akbank TL hesabından EFT ile peşin** ödenmiştir.\n\n### 💰 Tutarlar\n- Klima: 5 × 17.500 = **87.500 TL**\n- Klima KDV (%20): **17.500 TL**\n- Fırın: 4 × 10.000 = **40.000 TL**\n- Fırın KDV (%10): **4.000 TL**\n- Toplam mal bedeli (153): **127.500 TL**\n- Toplam KDV: **21.500 TL**\n- Toplam ödeme: **149.000 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.9 — ZOR — Üç Kanal Karma Ödeme
-- ---------------------------------------------------------------------
(
  'm1k1-s09',
  'Üç Kanal Karma Ödeme',
  'zor',
  E'İşletmemiz, **28.05.2026** tarihinde **Samsung Elektronik Türkiye A.Ş.**''den **20 adet LED 50'''' televizyon** alımı yapmıştır. KDV hariç birim fiyat **15.000 TL**, KDV oranı **%20**''dir. Tedarikçi ile yapılan anlaşma gereği ödeme **üç farklı kanaldan** gerçekleştirilmiştir: fatura tutarının **%20''si işletme kasasından nakit**, **%50''si Yapı Kredi TL hesabından EFT** olarak peşin ödenmiş, kalan **%30''u için işletmemiz kendi çekini düzenleyip** tedarikçiye vermiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 20 × 15.000 = **300.000 TL**\n- KDV (%20): **60.000 TL**\n- Toplam: **360.000 TL**\n- Kasa (%20): **72.000 TL**\n- Yapı Kredi EFT (%50): **180.000 TL**\n- Verilen çek (%30): **108.000 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
),

-- ---------------------------------------------------------------------
-- SORU 1.10 — ZOR — Müşteri Çekini Tedarikçiye Ciro Ederek
-- ---------------------------------------------------------------------
(
  'm1k1-s10',
  'Müşteri Çekini Tedarikçiye Ciro Ederek Mal Alımı',
  'zor',
  E'İşletmemiz, **04.06.2026** tarihinde **LG Electronics Türkiye A.Ş.**''den **12 adet salon tipi klima** alımı yapmıştır. KDV hariç birim fiyat **18.000 TL**, KDV oranı **%20**''dir. Fatura toplam tutarı **259.200 TL**''dir. Bu tutarın **200.000 TL''lik kısmı**, daha önce müşterimiz **Çağdaş Elektronik Ltd. Şti.**''nden almış olduğumuz ve portföyümüzde bulunan bir çek **LG''ye ciro edilerek** karşılanmıştır. Kalan **59.200 TL kredili** olarak tedarikçinin cari hesabına kaydedilmiştir.\n\n### 💰 Tutarlar\n- Mal bedeli: 12 × 18.000 = **216.000 TL**\n- KDV (%20): **43.200 TL**\n- Toplam: **259.200 TL**\n- Müşteri çekinden ciro: **200.000 TL**\n- Kredili kalan: **59.200 TL**',
  '',
  '',
  'onayli',
  'mal-alis-satis',
  null,
  'mal-alis-satis-1-1'
);

-- =====================================================================
-- 3) Çözümler (yevmiye kayıtları) — MUAVİN düzeyinde
-- =====================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- 1.1: 153.001 Borç 148.000 | 191.001 Borç 29.600 | 100.001 Alacak 177.600
  ('m1k1-s01', 1, '153.001', 148000, 0),
  ('m1k1-s01', 2, '191.001', 29600, 0),
  ('m1k1-s01', 3, '100.001', 0, 177600),

  -- 1.2: 153.004 Borç 51.000 | 191.001 Borç 10.200 | 102.001 Alacak 61.200
  ('m1k1-s02', 1, '153.004', 51000, 0),
  ('m1k1-s02', 2, '191.001', 10200, 0),
  ('m1k1-s02', 3, '102.001', 0, 61200),

  -- 1.3: 153.005 Borç 168.000 | 191.001 Borç 33.600 | 320.003 Alacak 201.600
  ('m1k1-s03', 1, '153.005', 168000, 0),
  ('m1k1-s03', 2, '191.001', 33600, 0),
  ('m1k1-s03', 3, '320.003', 0, 201600),

  -- 1.4: 153.008 Borç 65.000 | 191.001 Borç 13.000 | 103.004 Alacak 78.000
  ('m1k1-s04', 1, '153.008', 65000, 0),
  ('m1k1-s04', 2, '191.001', 13000, 0),
  ('m1k1-s04', 3, '103.004', 0, 78000),

  -- 1.5: 153.009 Borç 68.000 | 191.001 Borç 13.600 | 321.005 Alacak 81.600
  ('m1k1-s05', 1, '153.009', 68000, 0),
  ('m1k1-s05', 2, '191.001', 13600, 0),
  ('m1k1-s05', 3, '321.005', 0, 81600),

  -- 1.6: 153.002 Borç 75.000 | 191.001 Borç 15.000 | 102.002 Alacak 45.000 | 320.001 Alacak 45.000
  ('m1k1-s06', 1, '153.002', 75000, 0),
  ('m1k1-s06', 2, '191.001', 15000, 0),
  ('m1k1-s06', 3, '102.002', 0, 45000),
  ('m1k1-s06', 4, '320.001', 0, 45000),

  -- 1.7: 153.005 Borç 120.000 (mal+nakliye) | 191.001 Borç 24.000 | 320.003 Alacak 144.000
  ('m1k1-s07', 1, '153.005', 120000, 0),
  ('m1k1-s07', 2, '191.001', 24000, 0),
  ('m1k1-s07', 3, '320.003', 0, 144000),

  -- 1.8: 153.009 Borç 87.500 | 153.010 Borç 40.000 | 191.001 Borç 17.500 | 191.002 Borç 4.000 | 102.003 Alacak 149.000
  ('m1k1-s08', 1, '153.009', 87500, 0),
  ('m1k1-s08', 2, '153.010', 40000, 0),
  ('m1k1-s08', 3, '191.001', 17500, 0),
  ('m1k1-s08', 4, '191.002', 4000, 0),
  ('m1k1-s08', 5, '102.003', 0, 149000),

  -- 1.9: 153.003 Borç 300.000 | 191.001 Borç 60.000 | 100.001 Alacak 72.000 | 102.004 Alacak 180.000 | 103.004 Alacak 108.000
  ('m1k1-s09', 1, '153.003', 300000, 0),
  ('m1k1-s09', 2, '191.001', 60000, 0),
  ('m1k1-s09', 3, '100.001', 0, 72000),
  ('m1k1-s09', 4, '102.004', 0, 180000),
  ('m1k1-s09', 5, '103.004', 0, 108000),

  -- 1.10: 153.009 Borç 216.000 | 191.001 Borç 43.200 | 101.001 Alacak 200.000 | 320.005 Alacak 59.200
  ('m1k1-s10', 1, '153.009', 216000, 0),
  ('m1k1-s10', 2, '191.001', 43200, 0),
  ('m1k1-s10', 3, '101.001', 0, 200000),
  ('m1k1-s10', 4, '320.005', 0, 59200);

commit;

notify pgrst, 'reload schema';
