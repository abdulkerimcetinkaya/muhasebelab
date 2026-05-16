-- =====================================================================
-- Modül 1 / Konu 3: Alış İskontosu — 10 yeni soru
-- =====================================================================
-- Alt başlık: 'mal-alis-satis-1-8' (Alış İskontosu)
--
-- Kural: Alış iskontosu mal maliyetini azaltır — sanki mal indirimli
-- alınmış gibi. Mal işletmeden çıkmış sayıldığı için 391 Hesaplanan KDV
-- alacak tarafına yazılır.

begin;

insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values

(
  'm1k3-s01',
  'Sezon Kampanyasıyla Cari Hesaptan İskonto',
  'kolay',
  E'İşletmemiz, daha önce Arçelik A.Ş.''den kredili olarak 200.000 TL + KDV (toplam 240.000 TL) tutarında No-Frost buzdolabı satın almıştı. Tedarikçi, 14.04.2026 tarihinde uyguladığı %4 sezon kampanyası iskontosu nedeniyle iskonto faturası kesmiştir. KDV %20''dir. İskonto tutarı tedarikçinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s02',
  'Erken Ödeyerek Banka Üzerinden İskonto',
  'kolay',
  E'İşletmemiz, Vestel Ticaret A.Ş.''ye olan 150.000 TL + KDV (toplam 180.000 TL) tutarındaki kredili borcunu vadesinden önce ödemek için Vestel''le anlaşmıştır. Anlaşma gereği %2 erken ödeme iskontosu uygulanmıştır. 21.04.2026 tarihinde işletmemizin İş Bankası TL hesabından net tutar Vestel''e EFT ile gönderilmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s03',
  'Yıllık Bayilik İskontosuyla Cari Hesaptan Düşme',
  'kolay',
  E'İşletmemiz, daha önce Bosch Ev Aletleri A.Ş.''den kredili olarak 120.000 TL + KDV tutarında bulaşık makinesi satın almıştı. Tedarikçi, 28.04.2026 tarihinde yıllık bayilik anlaşması kapsamında %3 alış iskontosu uygulamış ve iskonto faturası kesmiştir. KDV %20''dir. İskonto tutarı tedarikçinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s04',
  'Kampanya İskontosunu Bankaya Geri Alma',
  'kolay',
  E'İşletmemiz, daha önce Samsung Elektronik Türkiye A.Ş.''den peşin olarak 80.000 TL + KDV (toplam 96.000 TL) tutarında split klima satın almıştı. Tedarikçi, 05.05.2026 tarihinde mağaza açılış kampanyası kapsamında %5 alış iskontosu uygulamış ve iskonto tutarını işletmemizin Akbank TL hesabına EFT ile geri ödemiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s05',
  'Sezonluk Kampanyayla Cari Hesaptan İskonto',
  'kolay',
  E'İşletmemiz, daha önce LG Electronics Türkiye A.Ş.''den kredili olarak 300.000 TL + KDV tutarında salon tipi klima satın almıştı. Tedarikçi, 12.05.2026 tarihinde yaz öncesi sezonluk kampanya kapsamında %6 alış iskontosu uygulamış ve iskonto tutarı tedarikçinin cari hesabından düşülmüştür. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s06',
  'Sezon ve Erken Ödeme İskontolarıyla Banka Ödemesi',
  'orta',
  E'İşletmemiz, Samsung Elektronik Türkiye A.Ş.''den 200.000 TL + KDV tutarında split klima alımı yapmıştır. Tedarikçi iki ayrı iskonto uygulamıştır: sezon kampanyası %3 ve erken ödeme %2. Her iki iskonto da orijinal mal bedeli üzerinden ayrı ayrı hesaplanmıştır (bileşik değil). 19.05.2026 tarihinde işletmemizin Ziraat Bankası TL hesabından net tutar Samsung''a EFT ile gönderilmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s07',
  'Farklı KDV Oranlarıyla Mal Karmasından İskonto',
  'orta',
  E'İşletmemiz, LG Electronics Türkiye A.Ş.''den daha önce karma bir alım yapmıştı: 100.000 TL salon tipi klima (KDV %20) ve 50.000 TL özel düzenlemeye tabi ankastre fırın (KDV %10). 26.05.2026 tarihinde tedarikçi, toplam mal bedeli üzerinden %4 alış iskontosu uygulamıştır. İskonto her iki mal grubuna kendi KDV oranıyla uygulanmıştır. İskonto tutarı tedarikçinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s08',
  'Karma Ödemeli Alımdan Yarı Cari Yarı Banka İskontosu',
  'orta',
  E'İşletmemiz, daha önce Arçelik A.Ş.''den 300.000 TL + KDV tutarında No-Frost buzdolabı satın almıştı. Alımın yarısı Garanti BBVA hesabından peşin EFT ile ödenmiş, yarısı kredili olarak cari hesaba kaydedilmişti. 02.06.2026 tarihinde tedarikçi, dönem sonu kampanyası kapsamında %5 alış iskontosu uygulamış; iskonto tutarının yarısı tedarikçinin cari hesabından düşülmüş, yarısı işletmemizin Garanti BBVA hesabına EFT ile geri ödenmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s09',
  'Yıllık Ciro Primi Olarak Alınan İskonto',
  'zor',
  E'İşletmemiz, 2025 yılı boyunca tedarikçisi Bosch Ev Aletleri A.Ş.''den toplam 6.000.000 TL + KDV tutarında alım yapmıştır. Yıllık bayilik sözleşmesi gereği 5.000.000 TL alım barajının aşılması durumunda %2 alış iskontosu (ciro primi olarak adlandırılan, mal maliyetini azaltıcı niteliğinde) uygulanması kararlaştırılmıştır. 09.06.2026 tarihinde Bosch tarafından iskonto faturası kesilmiş ve tedarikçinin cari hesabından düşülmüştür. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
),
(
  'm1k3-s10',
  'Kaçırılan İskontonun Sonradan Tahakkuku',
  'zor',
  E'İşletmemiz, 15.04.2026 tarihinde Vestel Ticaret A.Ş.''den 500.000 TL + KDV tutarında kredili LED televizyon alımı yapmıştı. Sözleşmeye göre bu alım otomatik olarak %3 sezon iskontosuna tabi olması gerekiyordu ancak muhasebeci hata yapmış ve iskonto işlenmemişti, fatura tam tutar üzerinden kaydedilmişti. 16.06.2026 tarihinde hata fark edilmiş ve Vestel ile mutabakat sağlanarak iskonto faturası kesilmiştir. İskonto tutarının tamamı tedarikçinin cari hesabından düşülmüştür. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-8'
);

-- =====================================================================
-- Çözümler (muavin koduyla)
-- =====================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: Arçelik kredili %4 iskonto, cari düşüş
  ('m1k3-s01', 1, '320.001', 9600, 0),
  ('m1k3-s01', 2, '153.001', 0, 8000),
  ('m1k3-s01', 3, '391.001', 0, 1600),

  -- s02: Vestel erken ödeme — brüt borç sıfırlanır + iskonto + banka çıkışı
  ('m1k3-s02', 1, '320.002', 180000, 0),
  ('m1k3-s02', 2, '153.004', 0, 3000),
  ('m1k3-s02', 3, '391.001', 0, 600),
  ('m1k3-s02', 4, '102.002', 0, 176400),

  -- s03: Bosch yıllık bayilik %3, cari düşüş
  ('m1k3-s03', 1, '320.003', 4320, 0),
  ('m1k3-s03', 2, '153.005', 0, 3600),
  ('m1k3-s03', 3, '391.001', 0, 720),

  -- s04: Samsung %5, banka geri ödeme
  ('m1k3-s04', 1, '102.003', 4800, 0),
  ('m1k3-s04', 2, '153.008', 0, 4000),
  ('m1k3-s04', 3, '391.001', 0, 800),

  -- s05: LG sezonluk %6, cari düşüş
  ('m1k3-s05', 1, '320.005', 21600, 0),
  ('m1k3-s05', 2, '153.009', 0, 18000),
  ('m1k3-s05', 3, '391.001', 0, 3600),

  -- s06: Samsung sezon %3 + erken %2, banka ödeme (Ziraat)
  ('m1k3-s06', 1, '320.004', 240000, 0),
  ('m1k3-s06', 2, '153.008', 0, 10000),
  ('m1k3-s06', 3, '391.001', 0, 2000),
  ('m1k3-s06', 4, '102.005', 0, 228000),

  -- s07: LG karma KDV iskonto (klima %20 + fırın %10), cari düşüş
  ('m1k3-s07', 1, '320.005', 7000, 0),
  ('m1k3-s07', 2, '153.009', 0, 4000),
  ('m1k3-s07', 3, '153.010', 0, 2000),
  ('m1k3-s07', 4, '391.001', 0, 800),
  ('m1k3-s07', 5, '391.002', 0, 200),

  -- s08: Arçelik dönem sonu %5, ½ cari ½ banka
  ('m1k3-s08', 1, '320.001', 9000, 0),
  ('m1k3-s08', 2, '102.001', 9000, 0),
  ('m1k3-s08', 3, '153.001', 0, 15000),
  ('m1k3-s08', 4, '391.001', 0, 3000),

  -- s09: Bosch ciro primi %2, cari düşüş
  ('m1k3-s09', 1, '320.003', 144000, 0),
  ('m1k3-s09', 2, '153.005', 0, 120000),
  ('m1k3-s09', 3, '391.001', 0, 24000),

  -- s10: Vestel kaçırılan %3, cari düşüş
  ('m1k3-s10', 1, '320.002', 18000, 0),
  ('m1k3-s10', 2, '153.003', 0, 15000),
  ('m1k3-s10', 3, '391.001', 0, 3000);

commit;

notify pgrst, 'reload schema';
