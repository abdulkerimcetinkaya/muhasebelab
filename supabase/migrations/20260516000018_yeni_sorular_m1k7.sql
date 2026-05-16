-- =====================================================================
-- Modül 1 / Konu 7: Satış İskontosu — 10 yeni soru
-- =====================================================================
-- Alt başlık: 'mal-alis-satis-1-7' (Satış İskontosu)
--
-- Kural: Satış iskontosu mal "kısmen geri geliyor" sayılır →
-- 191 İndirilecek KDV borç + 611 Satış İskontoları (-) borç.
-- Karşı taraf: 120/102/101 alacak.

begin;

insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values
(
  'm1k7-s01',
  'Erken Ödeme İskontosuyla Banka Tahsilatı',
  'kolay',
  E'İşletmemiz, Çağdaş Elektronik Ltd. Şti.''ne daha önce kredili olarak 150.000 TL + KDV (toplam 180.000 TL) tutarında No-Frost buzdolabı satmıştı. Müşteri ile yapılan anlaşma gereği vadesinden önce ödeme yapıldığında %3 erken ödeme iskontosu uygulanacaktı. 09.04.2026 tarihinde müşteri, Garanti BBVA hesabımıza erken ödeme yapmış ve iskonto faturası kesilmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s02',
  'Sezon Kampanyasıyla Cari Hesaptan Satış İskontosu',
  'kolay',
  E'İşletmemiz, daha önce Akel Elektronik Ltd. Şti.''ne kredili olarak 120.000 TL + KDV tutarında bulaşık makinesi satmıştı. 16.04.2026 tarihinde sezon kampanyası kapsamında %4 satış iskontosu uygulanmış ve iskonto faturası kesilmiştir. İskonto tutarı müşterinin cari hesabından düşülmüştür. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s03',
  'Yaz Sezonu Kampanyasıyla Cari Hesaptan İskonto',
  'kolay',
  E'İşletmemiz, daha önce Yıldız Mağazacılık A.Ş.''ne kredili olarak 200.000 TL + KDV tutarında LED televizyon satmıştı. 23.04.2026 tarihinde yaz sezonu öncesi indirim kampanyası kapsamında %5 satış iskontosu uygulanmıştır. İskonto tutarı müşterinin cari hesabından düşülmüştür. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s04',
  'Erken Ödemeyi Banka EFT ile Tahsil Ederek İskonto',
  'kolay',
  E'İşletmemiz, Demirören Elektronik A.Ş.''ne daha önce kredili olarak 100.000 TL + KDV (toplam 120.000 TL) tutarında split klima satmıştı. Müşteri vadeden önce ödeme yapmak istemiş, %2 erken ödeme iskontosu uygulanmıştır. 30.04.2026 tarihinde müşteri, net tutarı işletmemizin Akbank TL hesabına EFT ile göndermiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s05',
  'Dönemsel Kampanyayla Cari Hesaptan Satış İskontosu',
  'kolay',
  E'İşletmemiz, daha önce Beyaz İnci Mağazacılık A.Ş.''ne kredili olarak 80.000 TL + KDV tutarında ankastre fırın satmıştı. 07.05.2026 tarihinde dönemsel indirim kampanyası kapsamında %6 satış iskontosu uygulanmıştır. İskonto tutarı müşterinin cari hesabından düşülmüştür. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s06',
  'Sezon ve Erken Ödeme İskontolarıyla Banka Tahsilatı',
  'orta',
  E'İşletmemiz, Mert Mağazacılık Ltd. Şti.''ne daha önce kredili olarak 250.000 TL + KDV tutarında çamaşır makinesi satmıştı. Müşteri ile yapılan anlaşma kapsamında iki ayrı iskonto uygulanmıştır: sezon kampanyası %3 ve erken ödeme %2. Her iki iskonto da orijinal mal bedeli üzerinden ayrı ayrı hesaplanmıştır (bileşik değil). 14.05.2026 tarihinde müşteri, net tutarı işletmemizin İş Bankası TL hesabına EFT ile göndermiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s07',
  'Farklı KDV Oranlarıyla Mal Karmasından Satış İskontosu',
  'orta',
  E'İşletmemiz, Demirsoy Mağazacılık A.Ş.''ne daha önce karma bir satış yapmıştı: 120.000 TL salon tipi klima (KDV %20) ve 60.000 TL özel düzenlemeye tabi enerji verimli ankastre fırın (KDV %10). 21.05.2026 tarihinde müşteri ile yapılan anlaşma çerçevesinde toplam mal bedeli üzerinden %4 satış iskontosu uygulanmıştır. İskonto her iki mal grubuna kendi KDV oranıyla uygulanmıştır. İskonto tutarı müşterinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s08',
  'Karma Tahsilatlı Satıştan Yarı Cari Yarı Banka İskontosu',
  'orta',
  E'İşletmemiz, daha önce Aydın Mağazacılık Ltd. Şti.''ne 300.000 TL + KDV tutarında kurutma makinesi satmıştı. Satışın yarısı müşterinin Yapı Kredi hesabımıza EFT ile peşin ödediği, yarısı kredili olarak cari hesaba kaydedilmişti. 28.05.2026 tarihinde dönem sonu kampanyası kapsamında %5 satış iskontosu uygulanmış; iskonto tutarının yarısı müşterinin cari hesabından düşülmüş, yarısı işletmemizin Yapı Kredi hesabından müşterinin hesabına EFT ile geri ödenmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s09',
  'Yıllık Ciro Primi Olarak Verilen Satış İskontosu',
  'zor',
  E'İşletmemiz, 2025 yılı boyunca Yapıkent Mağazacılık A.Ş.''ne toplam 5.000.000 TL + KDV tutarında satış yapmıştır. Yıllık bayilik sözleşmesi gereği 4.000.000 TL satış barajının aşılması durumunda %2 yıllık ciro primi (satışı azaltıcı iskonto niteliğinde) uygulanması kararlaştırılmıştı. 04.06.2026 tarihinde işletmemiz tarafından iskonto faturası kesilmiş ve müşterinin cari hesabından düşülmüştür. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
),
(
  'm1k7-s10',
  'Çek Karşılığı Satışta İskontoyu Bankadan Geri Ödeme',
  'zor',
  E'İşletmemiz, daha önce Beyaz İnci Mağazacılık A.Ş.''ne 8 adet split klima satmıştı (KDV hariç birim 15.000 TL, toplam 120.000 + 24.000 KDV = 144.000 TL''lik müşteri çeki alınmıştı, 101.005 Beyaz İnci muavininde kayıtlı). 11.06.2026 tarihinde müşteri ile yapılan görüşmede özel kampanya çerçevesinde %5 satış iskontosu uygulanmasına karar verilmiştir. İskonto tutarı çekin nominal değerinden düşülemediği için müşteriye Akbank hesabımızdan EFT ile geri ödenmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-7'
);

-- =====================================================================
-- Çözümler — 611 BORÇ + 191 BORÇ | karşı taraf alacak
-- =====================================================================
insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: Çağdaş erken ödeme, brüt tahsil + iskonto
  ('m1k7-s01', 1, '102.001', 174600, 0),
  ('m1k7-s01', 2, '611.001', 4500, 0),
  ('m1k7-s01', 3, '191.001', 900, 0),
  ('m1k7-s01', 4, '120.001', 0, 180000),

  -- s02: Akel sezon %4, cari düşüş
  ('m1k7-s02', 1, '611.003', 4800, 0),
  ('m1k7-s02', 2, '191.001', 960, 0),
  ('m1k7-s02', 3, '120.002', 0, 5760),

  -- s03: Yıldız sezon %5, cari düşüş
  ('m1k7-s03', 1, '611.003', 10000, 0),
  ('m1k7-s03', 2, '191.001', 2000, 0),
  ('m1k7-s03', 3, '120.003', 0, 12000),

  -- s04: Demirören erken ödeme %2, banka tahsil + iskonto
  ('m1k7-s04', 1, '102.003', 117600, 0),
  ('m1k7-s04', 2, '611.001', 2000, 0),
  ('m1k7-s04', 3, '191.001', 400, 0),
  ('m1k7-s04', 4, '120.004', 0, 120000),

  -- s05: Beyaz İnci sezon %6, cari düşüş
  ('m1k7-s05', 1, '611.003', 4800, 0),
  ('m1k7-s05', 2, '191.001', 960, 0),
  ('m1k7-s05', 3, '120.005', 0, 5760),

  -- s06: Mert erken %2 + sezon %3, banka tahsil
  ('m1k7-s06', 1, '102.002', 285000, 0),
  ('m1k7-s06', 2, '611.001', 5000, 0),
  ('m1k7-s06', 3, '611.003', 7500, 0),
  ('m1k7-s06', 4, '191.001', 2500, 0),
  ('m1k7-s06', 5, '120.006', 0, 300000),

  -- s07: Demirsoy karma KDV %4, cari düşüş
  ('m1k7-s07', 1, '611.003', 7200, 0),
  ('m1k7-s07', 2, '191.001', 960, 0),
  ('m1k7-s07', 3, '191.002', 240, 0),
  ('m1k7-s07', 4, '120.007', 0, 8400),

  -- s08: Aydın %5, ½ cari ½ banka
  ('m1k7-s08', 1, '611.003', 15000, 0),
  ('m1k7-s08', 2, '191.001', 3000, 0),
  ('m1k7-s08', 3, '120.008', 0, 9000),
  ('m1k7-s08', 4, '102.004', 0, 9000),

  -- s09: Yapıkent ciro primi %2, cari düşüş
  ('m1k7-s09', 1, '611.002', 100000, 0),
  ('m1k7-s09', 2, '191.001', 20000, 0),
  ('m1k7-s09', 3, '120.009', 0, 120000),

  -- s10: Beyaz İnci özel %5, banka iadesi
  ('m1k7-s10', 1, '611.003', 6000, 0),
  ('m1k7-s10', 2, '191.001', 1200, 0),
  ('m1k7-s10', 3, '102.003', 0, 7200);

commit;

notify pgrst, 'reload schema';
