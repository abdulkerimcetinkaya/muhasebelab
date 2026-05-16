-- =====================================================================
-- Modül 1 / Konu 6: Satıştan İade — 10 yeni soru
-- =====================================================================
-- Alt başlık: 'mal-alis-satis-1-5' (Satıştan İade)
--
-- Kural: Satıştan iadede mal işletmeye geri girdiği için
-- 191 İndirilecek KDV borç tarafına yazılır (391 değil).
-- 610 Satıştan İadeler (-) hesabı da borçlandırılır.
-- Karşı taraf: 120/100/102/101/121 (alacak).

begin;

insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values
(
  'm1k6-s01',
  'Cari Hesaptan Düşerek Kısmi Satış İadesi',
  'kolay',
  E'İşletmemiz, daha önce Çağdaş Elektronik Ltd. Şti.''ne kredili olarak 8 adet No-Frost buzdolabı satmıştı (KDV hariç birim 23.000 TL, KDV %20). 12.04.2026 tarihinde 2 adedinin fonksiyon hatası olduğu tespit edilmiş ve müşteri tarafından iade edilmiştir. İade tutarı müşterinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s02',
  'Bankadan Geri Ödeyerek Peşin Satış İadesi',
  'kolay',
  E'İşletmemiz, daha önce Akel Elektronik Ltd. Şti.''ne peşin olarak 4 adet bulaşık makinesi satmıştı (KDV hariç birim 18.000 TL, KDV %20). 19.04.2026 tarihinde 1 adedinin teknik problemi olduğu tespit edilmiş ve müşteri tarafından iade edilmiştir. İade bedeli müşterinin İş Bankası hesabına EFT ile geri ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s03',
  'Adet Bazlı Kısmi Satış İadesi (Cari)',
  'kolay',
  E'İşletmemiz, daha önce Yıldız Mağazacılık A.Ş.''ne kredili olarak 10 adet LED 50'''' televizyon satmıştı (KDV hariç birim 16.000 TL, KDV %20). 26.04.2026 tarihinde 3 adet televizyonun renk problemi olduğu tespit edilmiş ve müşteri tarafından iade edilmiştir. İade tutarı müşterinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s04',
  'Kasadan Geri Ödeyerek Peşin Satış İadesi',
  'kolay',
  E'İşletmemiz, daha önce Demirören Elektronik A.Ş.''ne peşin olarak 8 adet split klima satmıştı (KDV hariç birim 14.500 TL, KDV %20). 03.05.2026 tarihinde 2 adet klimanın hatalı olduğu tespit edilmiş ve müşteri tarafından iade edilmiştir. İade bedeli müşteriye nakit olarak işletme kasasından geri ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s05',
  'Tutar Bazlı Kısmi Satış İadesi (Cari)',
  'kolay',
  E'İşletmemiz, daha önce Beyaz İnci Mağazacılık A.Ş.''ne kredili olarak 200.000 TL + KDV (toplam 240.000 TL) tutarında ankastre fırın satmıştı. 10.05.2026 tarihinde sevkıyatın bir kısmının müşteri tarafından kabul edilmediği belirtilmiş ve 30.000 TL + KDV tutarındaki mal iade edilmiştir. KDV %20''dir. İade tutarı müşterinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s06',
  'Yarı Cari Yarı Banka ile Satış İadesi',
  'orta',
  E'İşletmemiz, daha önce Mert Mağazacılık Ltd. Şti.''ne 12 adet çamaşır makinesi satmıştı (KDV hariç birim 17.000 TL, KDV %20). Satışın yarısı İş Bankası hesabımıza EFT ile peşin tahsil edilmiş, yarısı kredili olarak cari hesaba kaydedilmişti. 17.05.2026 tarihinde 4 adet çamaşır makinesinin titreşim problemi olduğu tespit edilmiş ve müşteri tarafından iade edilmiştir. İade tutarının yarısı müşterinin cari hesabından düşülmüş, yarısı müşterinin İş Bankası hesabına EFT ile geri ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s07',
  'Farklı KDV Oranlarıyla Satış İadesi',
  'orta',
  E'İşletmemiz, daha önce Demirsoy Mağazacılık A.Ş.''ne karma bir satış yapmıştı: 6 adet salon tipi klima (KDV hariç birim 22.000 TL, KDV %20) ve 4 adet özel düzenlemeye tabi enerji verimli ankastre fırın (KDV hariç birim 12.500 TL, KDV %10). 24.05.2026 tarihinde 1 adet klima ve 1 adet fırının fonksiyon hatası olduğu tespit edilmiş ve müşteri tarafından iade edilmiştir. İade bedelinin tamamı müşterinin Yapı Kredi hesabına EFT ile geri ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s08',
  'Cari Hesabı Sıfırlayarak Tam Satış İadesi',
  'orta',
  E'İşletmemiz, 15.05.2026 tarihinde Yapıkent Mağazacılık A.Ş.''ne 150.000 TL + KDV (toplam 180.000 TL) tutarında kredili olarak split klima satmıştı (120.009 Yapıkent muavininde kayıtlı). 31.05.2026 tarihinde müşteri, sevk edilen tüm klimaların farklı bir model olduğunu tespit etmiş ve TÜM partinin iadesi talep edilmiştir. İşletmemiz tüm malı geri kabul etmiş ve cari hesap tamamen sıfırlanmıştır. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s09',
  'Üç Farklı Kanaldan Orantılı Satış İadesi',
  'zor',
  E'İşletmemiz, daha önce Yapıkent Mağazacılık A.Ş.''ne 20 adet split klima satmıştı. KDV hariç birim 15.500 TL''den toplam 372.000 TL (KDV dahil). Satış üç farklı kanaldan tahsil edilmişti: %30 kasa (111.600 TL), %40 Akbank EFT (148.800 TL), %30 alınan bono (111.600 TL). 07.06.2026 tarihinde 5 adet klimanın iç ünite hatası tespit edilmiş ve müşteri tarafından iade edilmiştir. İade tutarı orijinal tahsilat oranlarında bölünmüş: %30 kasadan nakit iade, %40 Akbank hesabından EFT iade, %30 müşteriden alınan bono tutarı müşteriye iade edilmiştir (bono geri verilmiştir).',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
),
(
  'm1k6-s10',
  'Alınan Çeki Geri Vererek Tam Satış İadesi',
  'zor',
  E'İşletmemiz, daha önce Demirören Elektronik A.Ş.''ne 8 adet split klima satmıştı (KDV hariç birim 14.500 TL, toplam 116.000 + 23.200 KDV = 139.200 TL''lik müşteri çeki alınmıştı, 101.004 Demirören Elektronik muavininde kayıtlı). 14.06.2026 tarihinde müşteri, tüm partinin yanlış model olduğunu tespit etmiş ve TÜM 8 adet klimanın iadesi talep edilmiştir. İşletmemiz tüm malı geri kabul etmiş ve daha önce alınan çek müşteriye geri verilmiştir. Çek henüz vadesi gelmediği için tahsil edilmemişti.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-5'
);

-- =====================================================================
-- Çözümler — 610 BORÇ + 191 BORÇ | karşı taraf (120/100/102/101/121) ALACAK
-- =====================================================================
insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: 610.001 Borç 46.000 | 191.001 Borç 9.200 | 120.001 Alacak 55.200
  ('m1k6-s01', 1, '610.001', 46000, 0),
  ('m1k6-s01', 2, '191.001', 9200, 0),
  ('m1k6-s01', 3, '120.001', 0, 55200),

  -- s02: 610.003 Borç 18.000 | 191.001 Borç 3.600 | 102.002 Alacak 21.600
  ('m1k6-s02', 1, '610.003', 18000, 0),
  ('m1k6-s02', 2, '191.001', 3600, 0),
  ('m1k6-s02', 3, '102.002', 0, 21600),

  -- s03: 610.002 Borç 48.000 | 191.001 Borç 9.600 | 120.003 Alacak 57.600
  ('m1k6-s03', 1, '610.002', 48000, 0),
  ('m1k6-s03', 2, '191.001', 9600, 0),
  ('m1k6-s03', 3, '120.003', 0, 57600),

  -- s04: 610.001 Borç 29.000 | 191.001 Borç 5.800 | 100.001 Alacak 34.800
  ('m1k6-s04', 1, '610.001', 29000, 0),
  ('m1k6-s04', 2, '191.001', 5800, 0),
  ('m1k6-s04', 3, '100.001', 0, 34800),

  -- s05: 610.002 Borç 30.000 | 191.001 Borç 6.000 | 120.005 Alacak 36.000
  ('m1k6-s05', 1, '610.002', 30000, 0),
  ('m1k6-s05', 2, '191.001', 6000, 0),
  ('m1k6-s05', 3, '120.005', 0, 36000),

  -- s06: 610.003 Borç 68.000 | 191.001 Borç 13.600 | 120.006 Alacak 40.800 | 102.002 Alacak 40.800
  ('m1k6-s06', 1, '610.003', 68000, 0),
  ('m1k6-s06', 2, '191.001', 13600, 0),
  ('m1k6-s06', 3, '120.006', 0, 40800),
  ('m1k6-s06', 4, '102.002', 0, 40800),

  -- s07: 610.001 Borç 22.000 + 610.002 Borç 12.500 | 191.001 Borç 4.400 + 191.002 Borç 1.250 | 102.004 Alacak 40.150
  ('m1k6-s07', 1, '610.001', 22000, 0),
  ('m1k6-s07', 2, '610.002', 12500, 0),
  ('m1k6-s07', 3, '191.001', 4400, 0),
  ('m1k6-s07', 4, '191.002', 1250, 0),
  ('m1k6-s07', 5, '102.004', 0, 40150),

  -- s08: 610.001 Borç 150.000 | 191.001 Borç 30.000 | 120.009 Alacak 180.000
  ('m1k6-s08', 1, '610.001', 150000, 0),
  ('m1k6-s08', 2, '191.001', 30000, 0),
  ('m1k6-s08', 3, '120.009', 0, 180000),

  -- s09: 610.001 Borç 77.500 | 191.001 Borç 15.500 | 100.001 Alacak 27.900 | 102.003 Alacak 37.200 | 121.009 Alacak 27.900
  ('m1k6-s09', 1, '610.001', 77500, 0),
  ('m1k6-s09', 2, '191.001', 15500, 0),
  ('m1k6-s09', 3, '100.001', 0, 27900),
  ('m1k6-s09', 4, '102.003', 0, 37200),
  ('m1k6-s09', 5, '121.009', 0, 27900),

  -- s10: 610.001 Borç 116.000 | 191.001 Borç 23.200 | 101.004 Alacak 139.200
  ('m1k6-s10', 1, '610.001', 116000, 0),
  ('m1k6-s10', 2, '191.001', 23200, 0),
  ('m1k6-s10', 3, '101.004', 0, 139200);

commit;

notify pgrst, 'reload schema';
