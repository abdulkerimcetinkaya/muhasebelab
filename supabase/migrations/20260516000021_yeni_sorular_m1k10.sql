-- =====================================================================
-- Modül 1 / Konu 10: Fiyat Farkı Faturası — 10 yeni soru
-- =====================================================================
-- Alt başlık: 'mal-alis-satis-1-9' (Fiyat Farkı Faturası)
--
-- KDV yönleri:
--  - Alış (+): 153 borç + 191 borç  | karşı taraf alacak
--  - Alış (−): 320/102 borç         | 153 alacak + 391 alacak
--  - Satış (+): 120/102 borç         | 600 alacak + 391 alacak
--  - Satış (−): 600 borç + 191 borç  | 120/102 alacak
--
-- s10 = tek mahsup fişinde iki ayrı işlem (alış farkı + satış farkı).

begin;

insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values
(
  'm1k10-s01',
  'Alıştan Pozitif Fiyat Farkını Cari Hesaba Yansıtma',
  'kolay',
  E'İşletmemiz, daha önce Arçelik A.Ş.''den kredili olarak 200.000 TL + KDV (toplam 240.000 TL) tutarında No-Frost buzdolabı satın almıştı. 11.04.2026 tarihinde Arçelik, hammadde maliyetlerindeki artış nedeniyle sözleşme gereği %5 fiyat farkı faturası kesmiştir. KDV %20''dir. Fiyat farkı tutarı kredili olarak tedarikçinin cari hesabına eklenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s02',
  'Alıştan Negatif Fiyat Farkını Cari Hesaptan Düşme',
  'kolay',
  E'İşletmemiz, daha önce Vestel Ticaret A.Ş.''den kredili olarak 150.000 TL + KDV tutarında LED televizyon satın almıştı. 18.04.2026 tarihinde Vestel, sezon sonu fiyat indirimi nedeniyle %4 negatif fiyat farkı faturası kesmiştir. KDV %20''dir. Fark tutarı tedarikçinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s03',
  'Satıştan Pozitif Fiyat Farkını Cari Hesaba Yansıtma',
  'kolay',
  E'İşletmemiz, daha önce Yıldız Mağazacılık A.Ş.''ne kredili olarak 250.000 TL + KDV tutarında split klima satmıştı. 25.04.2026 tarihinde sözleşmedeki kur farkı kuralı uyarınca %3 fiyat farkı faturası kesilmiştir. KDV %20''dir. Fiyat farkı tutarı müşterinin cari hesabına eklenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s04',
  'Satıştan Negatif Fiyat Farkını Cari Hesaptan Düşme',
  'kolay',
  E'İşletmemiz, daha önce Demirören Elektronik A.Ş.''ne kredili olarak 180.000 TL + KDV tutarında bulaşık makinesi satmıştı. 02.05.2026 tarihinde müşteri ile yapılan görüşmede toptan fiyat düzenlemesi nedeniyle %2 negatif fiyat farkı uygulanmıştır. KDV %20''dir. Fark tutarı müşterinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s05',
  'Alıştan Pozitif Fiyat Farkını Banka EFT ile Ödeme',
  'kolay',
  E'İşletmemiz, daha önce Bosch Ev Aletleri A.Ş.''den peşin olarak 120.000 TL + KDV tutarında bulaşık makinesi satın almıştı. 09.05.2026 tarihinde Bosch, mevcut sözleşmedeki fiyat artış maddesi uyarınca %4 fiyat farkı faturası kesmiştir. Fiyat farkı tutarı işletmemizin İş Bankası TL hesabından EFT ile peşin ödenmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s06',
  'Satıştan Pozitif Fiyat Farkını Bankayla Tahsil Etme',
  'orta',
  E'İşletmemiz, daha önce Beyaz İnci Mağazacılık A.Ş.''ne 400.000 TL + KDV (toplam 480.000 TL) tutarında peşin satış yapmıştı. 16.05.2026 tarihinde sözleşmedeki maliyet endeksi düzenlemesi gereği %5 fiyat farkı faturası kesilmiştir. Fiyat farkı tutarı müşteri tarafından işletmemizin Yapı Kredi TL hesabına EFT ile peşin ödenmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s07',
  'Farklı KDV Oranlarıyla Karma Mal Grubundan Satış Fiyat Farkı',
  'orta',
  E'İşletmemiz, daha önce Demirsoy Mağazacılık A.Ş.''ne karma bir satış yapmıştı: 250.000 TL salon tipi klima (KDV %20) ve 100.000 TL özel düzenlemeye tabi enerji verimli ankastre fırın (KDV %10). 23.05.2026 tarihinde döviz kuru artışı nedeniyle her iki mal grubuna %3 pozitif fiyat farkı uygulanmıştır. Her grup kendi KDV oranıyla hesaplanmıştır. Fark tutarı kredili olarak müşterinin cari hesabına eklenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s08',
  'Alıştan Pozitif Fiyat Farkını Karma Ödeme ile Kapatma',
  'orta',
  E'İşletmemiz, daha önce Samsung Elektronik Türkiye A.Ş.''den 500.000 TL + KDV tutarında split klima alımı yapmıştı. 30.05.2026 tarihinde sözleşme gereği %4 fiyat farkı faturası kesilmiştir. Farkın yarısı işletmemizin Akbank TL hesabından EFT ile peşin ödenmiş, yarısı kredili olarak tedarikçinin cari hesabına eklenmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s09',
  'Satıştan Negatif Fiyat Farkını Bankadan Müşteriye Geri Ödeme',
  'zor',
  E'İşletmemiz, daha önce Aydın Mağazacılık Ltd. Şti.''ne 350.000 TL + KDV (toplam 420.000 TL) tutarında kurutma makinesi satışı yapmıştı. Satış için 420.000 TL''lik müşteri çeki alınmıştı (101.008 Aydın Mağazacılık muavininde kayıtlı). 06.06.2026 tarihinde piyasa koşulları gereği müşteri ile yapılan görüşmede %5 negatif fiyat farkı uygulanmasına karar verilmiştir. Fark tutarı çekin nominal değerinden düşülemediği için müşteriye Ziraat Bankası TL hesabımızdan EFT ile geri ödenmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
),
(
  'm1k10-s10',
  'Aynı Yevmiyede Alış ve Satış Fiyat Farkı (Mahsup)',
  'zor',
  E'İşletmemiz, 13.06.2026 tarihinde aynı gün içinde iki farklı fiyat farkı işlemi yapmıştır ve bunlar tek mahsup fişinde işlenmiştir.\n\n1) Alıştan Pozitif Fiyat Farkı: LG Electronics Türkiye A.Ş., daha önce kredili satılan 300.000 TL + KDV tutarındaki klima satışı için %6 fiyat farkı faturası kesmiştir. Fark kredili olarak LG''nin cari hesabına eklenmiştir.\n\n2) Satıştan Pozitif Fiyat Farkı: Mert Mağazacılık Ltd. Şti.''ne yapılan 280.000 TL + KDV tutarındaki klima satışı için sözleşme gereği %4 fiyat farkı faturası kesilmiştir. Fark kredili olarak Mert Mağazacılık''ın cari hesabına eklenmiştir.\n\nKDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-9'
);

-- =====================================================================
-- Çözümler — muavin koduyla
-- =====================================================================
insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: Arçelik %5 alış (+), kredili
  ('m1k10-s01', 1, '153.001', 10000, 0),
  ('m1k10-s01', 2, '191.001', 2000, 0),
  ('m1k10-s01', 3, '320.001', 0, 12000),

  -- s02: Vestel %4 alış (−), cari düşüş
  ('m1k10-s02', 1, '320.002', 7200, 0),
  ('m1k10-s02', 2, '153.003', 0, 6000),
  ('m1k10-s02', 3, '391.001', 0, 1200),

  -- s03: Yıldız %3 satış (+), cari ek
  ('m1k10-s03', 1, '120.003', 9000, 0),
  ('m1k10-s03', 2, '600.006', 0, 7500),
  ('m1k10-s03', 3, '391.001', 0, 1500),

  -- s04: Demirören %2 satış (−), cari düşüş
  ('m1k10-s04', 1, '600.003', 3600, 0),
  ('m1k10-s04', 2, '191.001', 720, 0),
  ('m1k10-s04', 3, '120.004', 0, 4320),

  -- s05: Bosch %4 alış (+), banka
  ('m1k10-s05', 1, '153.005', 4800, 0),
  ('m1k10-s05', 2, '191.001', 960, 0),
  ('m1k10-s05', 3, '102.002', 0, 5760),

  -- s06: Beyaz İnci %5 satış (+), banka tahsil
  ('m1k10-s06', 1, '102.004', 24000, 0),
  ('m1k10-s06', 2, '600.001', 0, 20000),
  ('m1k10-s06', 3, '391.001', 0, 4000),

  -- s07: Demirsoy karma KDV %3 satış (+), cari ek
  ('m1k10-s07', 1, '120.007', 12300, 0),
  ('m1k10-s07', 2, '600.006', 0, 7500),
  ('m1k10-s07', 3, '600.007', 0, 3000),
  ('m1k10-s07', 4, '391.001', 0, 1500),
  ('m1k10-s07', 5, '391.002', 0, 300),

  -- s08: Samsung %4 alış (+), ½ banka ½ cari
  ('m1k10-s08', 1, '153.008', 20000, 0),
  ('m1k10-s08', 2, '191.001', 4000, 0),
  ('m1k10-s08', 3, '102.003', 0, 12000),
  ('m1k10-s08', 4, '320.004', 0, 12000),

  -- s09: Aydın %5 satış (−), banka geri ödeme
  ('m1k10-s09', 1, '600.005', 17500, 0),
  ('m1k10-s09', 2, '191.001', 3500, 0),
  ('m1k10-s09', 3, '102.005', 0, 21000),

  -- s10: Mahsup — LG alış (+) %6 ve Mert satış (+) %4 tek fişte
  -- LG: 153.008 +18.000 | 191.001 +3.600 | 320.005 -21.600
  -- Mert: 120.006 +13.440 | 600.006 -11.200 | 391.001 -2.240
  ('m1k10-s10', 1, '153.008', 18000, 0),
  ('m1k10-s10', 2, '191.001', 3600, 0),
  ('m1k10-s10', 3, '120.006', 13440, 0),
  ('m1k10-s10', 4, '320.005', 0, 21600),
  ('m1k10-s10', 5, '600.006', 0, 11200),
  ('m1k10-s10', 6, '391.001', 0, 2240);

commit;

notify pgrst, 'reload schema';
