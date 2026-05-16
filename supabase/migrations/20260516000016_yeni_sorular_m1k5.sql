-- =====================================================================
-- Modül 1 / Konu 5: Mal Satışı — 10 yeni soru
-- =====================================================================
-- Alt başlık: 'mal-alis-satis-1-2' (Mal Satışı)
--
-- Kural: Mal işletmeden çıktığı için 391 Hesaplanan KDV alacak.
-- 600 Yurtiçi Satışlar alacak (gelir hesabı).
-- Tahsilat kanaları (100/102/101/121) borç, kredili ise 120 borç.

begin;

-- =====================================================================
-- 1) Eksik muavinler — 101 (Alınan Çekler) ve 121 (Alacak Senetleri)
--    yeni müşteriler için
-- =====================================================================
insert into muavin_hesaplar (kod, ana_kod, ad, tip, sira) values
  ('101.004', '101', 'Alınan Çek – Demirören Elektronik A.Ş.', 'musteri', 4),
  ('101.005', '101', 'Alınan Çek – Beyaz İnci Mağazacılık A.Ş.', 'musteri', 5),
  ('101.008', '101', 'Alınan Çek – Aydın Mağazacılık Ltd. Şti.', 'musteri', 8),
  ('121.005', '121', 'Alacak Senedi – Beyaz İnci Mağazacılık A.Ş.', 'musteri', 5),
  ('121.009', '121', 'Alacak Senedi – Yapıkent Mağazacılık A.Ş.', 'musteri', 9)
on conflict (kod) do nothing;

-- =====================================================================
-- 2) Sorular
-- =====================================================================
insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values
(
  'm1k5-s01',
  'Banka EFT ile Peşin Mal Satışı',
  'kolay',
  E'İşletmemiz, 08.04.2026 tarihinde Çağdaş Elektronik Ltd. Şti.''ne 6 adet No-Frost buzdolabı satışı yapmıştır. KDV hariç birim fiyat 23.000 TL, KDV oranı %20''dir. Satış bedelinin tamamı müşterinin Garanti BBVA TL hesabımıza yaptığı EFT ile peşin tahsil edilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s02',
  'Kasaya Nakit Tahsil Ederek Peşin Mal Satışı',
  'kolay',
  E'İşletmemiz, 15.04.2026 tarihinde Akel Elektronik Ltd. Şti.''ne 4 adet bulaşık makinesi satışı yapmıştır. KDV hariç birim fiyat 18.000 TL, KDV oranı %20''dir. Satış bedelinin tamamı müşteri tarafından nakit olarak işletme kasasına ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s03',
  'Müşteri Cari Hesabına Borçlandırarak Mal Satışı',
  'kolay',
  E'İşletmemiz, 22.04.2026 tarihinde Yıldız Mağazacılık A.Ş.''ne 10 adet LED 50'''' televizyon satışı yapmıştır. KDV hariç birim fiyat 16.000 TL, KDV oranı %20''dir. Satış bedelinin tamamı kredili olarak müşterinin cari hesabına kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s04',
  'Müşteri Çeki Alarak Mal Satışı',
  'kolay',
  E'İşletmemiz, 29.04.2026 tarihinde Demirören Elektronik A.Ş.''ne 8 adet split klima satışı yapmıştır. KDV hariç birim fiyat 14.500 TL, KDV oranı %20''dir. Satış bedelinin tamamı için müşteri tarafından düzenlenen çek alınmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s05',
  'Müşteri Senedi Alarak Mal Satışı',
  'kolay',
  E'İşletmemiz, 06.05.2026 tarihinde Beyaz İnci Mağazacılık A.Ş.''ne 5 adet ankastre fırın satışı yapmıştır. KDV hariç birim fiyat 11.000 TL, KDV oranı %20''dir. Satış bedelinin tamamı için müşteri tarafından düzenlenen bono alınmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s06',
  'Yarı Peşin Yarı Kredili Mal Satışı',
  'orta',
  E'İşletmemiz, 13.05.2026 tarihinde Mert Mağazacılık Ltd. Şti.''ne 12 adet çamaşır makinesi satışı yapmıştır. KDV hariç birim fiyat 17.000 TL, KDV oranı %20''dir. Satış bedelinin yarısı müşteri tarafından İş Bankası hesabımıza EFT ile peşin tahsil edilmiş, kalan yarısı kredili olarak müşterinin cari hesabına kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s07',
  'Farklı KDV Oranlarıyla Mal Satışı',
  'orta',
  E'İşletmemiz, 20.05.2026 tarihinde Demirsoy Mağazacılık A.Ş.''ne karma bir satış yapmıştır. Aynı fatura kapsamında 6 adet salon tipi klima (KDV hariç birim 22.000 TL, KDV %20) ve 4 adet özel düzenlemeye tabi enerji verimli ankastre fırın (KDV hariç birim 12.500 TL, KDV %10) satılmıştır. Satış bedelinin tamamı müşteri tarafından Yapı Kredi TL hesabımıza EFT ile peşin tahsil edilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s08',
  'Çek Alarak ve Cari Hesabına Borçlandırarak Mal Satışı',
  'orta',
  E'İşletmemiz, 27.05.2026 tarihinde Aydın Mağazacılık Ltd. Şti.''ne 10 adet kurutma makinesi satışı yapmıştır. KDV hariç birim fiyat 19.000 TL, KDV oranı %20''dir. Satış bedelinin 150.000 TL''lik kısmı müşterinin düzenlediği çek ile, kalan 78.000 TL''lik kısmı kredili olarak müşterinin cari hesabına kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s09',
  'Üç Farklı Kanaldan Tahsilat ile Mal Satışı',
  'zor',
  E'İşletmemiz, 03.06.2026 tarihinde Yapıkent Mağazacılık A.Ş.''ne 20 adet split klima satışı yapmıştır. KDV hariç birim fiyat 15.500 TL, KDV oranı %20''dir. Müşteri ile yapılan anlaşma gereği tahsilat üç farklı kanaldan gerçekleştirilmiştir: fatura tutarının %30''u müşteri tarafından nakit olarak işletme kasasına, %40''ı Akbank TL hesabımıza EFT olarak peşin tahsil edilmiş, kalan %30''u için müşteri tarafından düzenlenen bono alınmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
),
(
  'm1k5-s10',
  'Karma KDV Oranlarıyla Üç Kanaldan Mal Satışı',
  'zor',
  E'İşletmemiz, 10.06.2026 tarihinde Beyaz İnci Mağazacılık A.Ş.''ne büyük bir karma satış yapmıştır. Tek faturada şunlar yer almıştır: 10 adet No-Frost buzdolabı (KDV hariç birim 23.000 TL, KDV %20), 8 adet split klima (KDV hariç birim 15.000 TL, KDV %20) ve 5 adet özel düzenlemeye tabi enerji verimli ankastre fırın (KDV hariç birim 13.000 TL, KDV %10). Tahsilat şu şekilde yapılmıştır: 200.000 TL Ziraat Bankası TL hesabına EFT, 150.000 TL müşterinin düzenlediği çek ve kalan tutar kredili olarak müşterinin cari hesabına kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-2'
);

-- =====================================================================
-- 3) Çözümler (muavin koduyla)
-- =====================================================================
insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: 102.001 Borc 165.600 | 600.001 Alacak 138.000 | 391.001 Alacak 27.600
  ('m1k5-s01', 1, '102.001', 165600, 0),
  ('m1k5-s01', 2, '600.001', 0, 138000),
  ('m1k5-s01', 3, '391.001', 0, 27600),

  -- s02: 100.001 Borc 86.400 | 600.003 Alacak 72.000 | 391.001 Alacak 14.400
  ('m1k5-s02', 1, '100.001', 86400, 0),
  ('m1k5-s02', 2, '600.003', 0, 72000),
  ('m1k5-s02', 3, '391.001', 0, 14400),

  -- s03: 120.003 Borc 192.000 | 600.002 Alacak 160.000 | 391.001 Alacak 32.000
  ('m1k5-s03', 1, '120.003', 192000, 0),
  ('m1k5-s03', 2, '600.002', 0, 160000),
  ('m1k5-s03', 3, '391.001', 0, 32000),

  -- s04: 101.004 Borc 139.200 | 600.006 Alacak 116.000 | 391.001 Alacak 23.200
  ('m1k5-s04', 1, '101.004', 139200, 0),
  ('m1k5-s04', 2, '600.006', 0, 116000),
  ('m1k5-s04', 3, '391.001', 0, 23200),

  -- s05: 121.005 Borc 66.000 | 600.007 Alacak 55.000 | 391.001 Alacak 11.000
  ('m1k5-s05', 1, '121.005', 66000, 0),
  ('m1k5-s05', 2, '600.007', 0, 55000),
  ('m1k5-s05', 3, '391.001', 0, 11000),

  -- s06: 102.002 Borc 122.400 | 120.006 Borc 122.400 | 600.004 Alacak 204.000 | 391.001 Alacak 40.800
  ('m1k5-s06', 1, '102.002', 122400, 0),
  ('m1k5-s06', 2, '120.006', 122400, 0),
  ('m1k5-s06', 3, '600.004', 0, 204000),
  ('m1k5-s06', 4, '391.001', 0, 40800),

  -- s07: 102.004 Borc 213.400 | 600.006 Alacak 132.000 | 600.007 Alacak 50.000 | 391.001 Alacak 26.400 | 391.002 Alacak 5.000
  ('m1k5-s07', 1, '102.004', 213400, 0),
  ('m1k5-s07', 2, '600.006', 0, 132000),
  ('m1k5-s07', 3, '600.007', 0, 50000),
  ('m1k5-s07', 4, '391.001', 0, 26400),
  ('m1k5-s07', 5, '391.002', 0, 5000),

  -- s08: 101.008 Borc 150.000 | 120.008 Borc 78.000 | 600.005 Alacak 190.000 | 391.001 Alacak 38.000
  ('m1k5-s08', 1, '101.008', 150000, 0),
  ('m1k5-s08', 2, '120.008', 78000, 0),
  ('m1k5-s08', 3, '600.005', 0, 190000),
  ('m1k5-s08', 4, '391.001', 0, 38000),

  -- s09: 100.001 Borc 111.600 | 102.003 Borc 148.800 | 121.009 Borc 111.600 | 600.006 Alacak 310.000 | 391.001 Alacak 62.000
  ('m1k5-s09', 1, '100.001', 111600, 0),
  ('m1k5-s09', 2, '102.003', 148800, 0),
  ('m1k5-s09', 3, '121.009', 111600, 0),
  ('m1k5-s09', 4, '600.006', 0, 310000),
  ('m1k5-s09', 5, '391.001', 0, 62000),

  -- s10: 102.005 Borc 200.000 | 101.005 Borc 150.000 | 120.005 Borc 141.500 | 600.001 Alacak 230.000 | 600.006 Alacak 120.000 | 600.007 Alacak 65.000 | 391.001 Alacak 70.000 | 391.002 Alacak 6.500
  ('m1k5-s10', 1, '102.005', 200000, 0),
  ('m1k5-s10', 2, '101.005', 150000, 0),
  ('m1k5-s10', 3, '120.005', 141500, 0),
  ('m1k5-s10', 4, '600.001', 0, 230000),
  ('m1k5-s10', 5, '600.006', 0, 120000),
  ('m1k5-s10', 6, '600.007', 0, 65000),
  ('m1k5-s10', 7, '391.001', 0, 70000),
  ('m1k5-s10', 8, '391.002', 0, 6500);

commit;

notify pgrst, 'reload schema';
