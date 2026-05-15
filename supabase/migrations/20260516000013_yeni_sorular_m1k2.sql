-- =====================================================================
-- Modül 1 / Konu 2: Alıştan İade — 10 yeni soru
-- =====================================================================
-- Yıldız Beyaz Eşya Ticaret A.Ş. işletmesi üzerinden 10 senaryo:
-- 5 KOLAY, 3 ORTA, 2 ZOR. ID konvansiyonu: m1k2-s01 ... m1k2-s10
--
-- Alt başlık: 'mal-alis-satis-1-6' (Alıştan İade)
--
-- Önemli kural: Alıştan iadede mal işletmeden çıktığı için
-- 391 Hesaplanan KDV alacak tarafına yazılır (191 değil).
--
-- Standartlar (önceki konularla tutarlı):
-- - Başlıklar Tarz B (aksiyon-odaklı)
-- - "💰 Tutarlar" bloğu YOK (öğrenci hesaplasın)
-- - Markdown ** işareti YOK
-- - Çözümler muavin koduyla (191.001/391.001 vs.)

begin;

insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values

(
  'm1k2-s01',
  'Cari Hesaptan Düşerek Tam Mal İadesi',
  'kolay',
  E'İşletmemiz, daha önce Arçelik A.Ş.''den kredili olarak 6 adet No-Frost buzdolabı satın almıştı (KDV hariç birim 18.500 TL, KDV %20). 11.04.2026 tarihinde teslimat kontrolünde tüm partinin üretim hatası olduğu tespit edilmiş ve 6 adet buzdolabının tamamı tedarikçiye iade edilmiştir. İade tutarı tedarikçinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s02',
  'Banka İadesi ile Peşin Mal İadesi',
  'kolay',
  E'İşletmemiz, daha önce Vestel Ticaret A.Ş.''den peşin olarak 10 adet LED 32'''' televizyon satın almıştı (KDV hariç birim 8.500 TL, KDV %20). 18.04.2026 tarihinde 4 adedinin ekran hatası olduğu tespit edilmiş ve tedarikçiye iade edilmiştir. İade bedeli tedarikçi tarafından işletmemizin Garanti BBVA hesabına EFT ile geri ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s03',
  'Adet Bazlı Kısmi Mal İadesi (Cari)',
  'kolay',
  E'İşletmemiz, daha önce Bosch Ev Aletleri A.Ş.''den kredili olarak 12 adet bulaşık makinesi satın almıştı (KDV hariç birim 14.000 TL, KDV %20). 25.04.2026 tarihinde 3 adedinin hatalı çalıştığı tespit edilmiş ve tedarikçiye iade edilmiştir. İade tutarı tedarikçinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s04',
  'Kasaya Geri Alarak Kısmi Mal İadesi',
  'kolay',
  E'İşletmemiz, daha önce Samsung Elektronik Türkiye A.Ş.''den peşin olarak 8 adet split klima satın almıştı (KDV hariç birim 13.000 TL, KDV %20). 02.05.2026 tarihinde 2 adedinin orijinal ambalajıyla uyuşmadığı tespit edilmiş ve tedarikçiye iade edilmiştir. İade bedeli tedarikçi tarafından nakit olarak işletme kasasına ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s05',
  'Tutar Bazlı Kısmi Mal İadesi (Cari)',
  'kolay',
  E'İşletmemiz, daha önce LG Electronics Türkiye A.Ş.''den kredili olarak 100.000 TL + KDV (toplam 120.000 TL) tutarında salon tipi klima satın almıştı. 09.05.2026 tarihinde sevkıyatın bir kısmının eksik geldiği tespit edilmiş ve 25.000 TL + KDV tutarındaki mal tedarikçiye iade edilmiştir. KDV %20''dir. İade tutarı tedarikçinin cari hesabından düşülmüştür.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s06',
  'Yarı Cari Yarı Banka ile Mal İadesi',
  'orta',
  E'İşletmemiz, daha önce Samsung Elektronik Türkiye A.Ş.''den 15 adet LED 50'''' televizyon almıştı (KDV hariç birim 15.000 TL, KDV %20). Alımın yarısı işletmemizin Akbank hesabından peşin EFT ile ödenmiş, yarısı kredili olarak cari hesaba kaydedilmişti. 16.05.2026 tarihinde 4 adet televizyonun hatalı olduğu tespit edilmiş ve tedarikçiye iade edilmiştir. İade tutarının yarısı tedarikçinin cari hesabından düşülmüş, yarısı işletmemizin Akbank hesabına EFT ile geri ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s07',
  'Farklı KDV Oranlarıyla Mal İadesi',
  'orta',
  E'İşletmemiz, daha önce LG Electronics Türkiye A.Ş.''den karma bir alım yapmıştı: 5 adet salon tipi klima (KDV hariç birim 17.500 TL, KDV %20) ve 4 adet özel düzenlemeye tabi enerji verimli ankastre fırın (KDV hariç birim 10.000 TL, KDV %10). 23.05.2026 tarihinde 1 adet klima ve 1 adet fırının hatalı olduğu tespit edilmiş ve tedarikçiye iade edilmiştir. İade bedelinin tamamı tedarikçi tarafından işletmemizin Yapı Kredi hesabına EFT ile geri ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s08',
  'Cari Hesabı Sıfırlayarak Tam Mal İadesi',
  'orta',
  E'İşletmemiz, 12.05.2026 tarihinde Hızlı Lojistik Ltd. Şti.''nden 200.000 TL + KDV (toplam 240.000 TL) tutarında kredili olarak ankastre fırın satın almıştı. 30.05.2026 tarihinde tedarikçi, malların tedarik zincirindeki bir hata nedeniyle yanlış gönderildiğini bildirmiş ve TÜM partinin iadesi talep edilmiştir. İşletmemiz tüm malı iade etmiş ve cari hesap tamamen sıfırlanmıştır. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s09',
  'Üç Farklı Kanaldan Orantılı Mal İadesi',
  'zor',
  E'İşletmemiz, daha önce Samsung Elektronik Türkiye A.Ş.''den 20 adet LED 50'''' televizyon almıştı. KDV hariç birim 15.000 TL''den toplam 360.000 TL (KDV dahil). Alım üç farklı kanaldan yapılmıştı: %20 kasa (72.000 TL), %50 Yapı Kredi EFT (180.000 TL), %30 verilen çek (108.000 TL). 06.06.2026 tarihinde 5 adet televizyonun fonksiyon hatası olduğu tespit edilmiş ve tedarikçiye iade edilmiştir. İade tutarı orijinal alımda kullanılan oranlarda bölünmüştür: %20 kasaya nakit iade, %50 Yapı Kredi hesabına EFT iade, %30 daha önce verilen çek tedarikçi tarafından geri verilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
),
(
  'm1k2-s10',
  'Borç Senedini Geri Alarak Mal İadesi',
  'zor',
  E'İşletmemiz, 28.04.2026 tarihinde LG Electronics Türkiye A.Ş.''den bono karşılığı 4 adet salon tipi klima almıştı. KDV hariç birim 17.000 TL, toplam 68.000 + 13.600 KDV = 81.600 TL''lik bono düzenlenmiş ve 321.005 LG Electronics muavinine kaydedilmişti. 13.06.2026 tarihinde 4 adet klimanın tamamının üretim hatası olduğu tespit edilmiş, tedarikçi tüm partinin iadesini kabul etmiş ve daha önce verilen bonoyu işletmemize geri vermiştir. Bono henüz vadesi gelmediği için ödenmemişti.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-6'
);

-- =====================================================================
-- Çözümler (yevmiye kayıtları) — MUAVİN düzeyinde
-- Alıştan iade: 320/100/102/103/321 BORÇ, 153 + 391 ALACAK
-- =====================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: 320.001 Borc 133.200 | 153.001 Alacak 111.000 | 391.001 Alacak 22.200
  ('m1k2-s01', 1, '320.001', 133200, 0),
  ('m1k2-s01', 2, '153.001', 0, 111000),
  ('m1k2-s01', 3, '391.001', 0, 22200),

  -- s02: 102.001 Borc 40.800 | 153.004 Alacak 34.000 | 391.001 Alacak 6.800
  ('m1k2-s02', 1, '102.001', 40800, 0),
  ('m1k2-s02', 2, '153.004', 0, 34000),
  ('m1k2-s02', 3, '391.001', 0, 6800),

  -- s03: 320.003 Borc 50.400 | 153.005 Alacak 42.000 | 391.001 Alacak 8.400
  ('m1k2-s03', 1, '320.003', 50400, 0),
  ('m1k2-s03', 2, '153.005', 0, 42000),
  ('m1k2-s03', 3, '391.001', 0, 8400),

  -- s04: 100.001 Borc 31.200 | 153.008 Alacak 26.000 | 391.001 Alacak 5.200
  ('m1k2-s04', 1, '100.001', 31200, 0),
  ('m1k2-s04', 2, '153.008', 0, 26000),
  ('m1k2-s04', 3, '391.001', 0, 5200),

  -- s05: 320.005 Borc 30.000 | 153.009 Alacak 25.000 | 391.001 Alacak 5.000
  ('m1k2-s05', 1, '320.005', 30000, 0),
  ('m1k2-s05', 2, '153.009', 0, 25000),
  ('m1k2-s05', 3, '391.001', 0, 5000),

  -- s06: 320.004 Borc 36.000 | 102.003 Borc 36.000 | 153.003 Alacak 60.000 | 391.001 Alacak 12.000
  ('m1k2-s06', 1, '320.004', 36000, 0),
  ('m1k2-s06', 2, '102.003', 36000, 0),
  ('m1k2-s06', 3, '153.003', 0, 60000),
  ('m1k2-s06', 4, '391.001', 0, 12000),

  -- s07: 102.004 Borc 32.000 | 153.009 Alacak 17.500 | 153.010 Alacak 10.000 | 391.001 Alacak 3.500 | 391.002 Alacak 1.000
  ('m1k2-s07', 1, '102.004', 32000, 0),
  ('m1k2-s07', 2, '153.009', 0, 17500),
  ('m1k2-s07', 3, '153.010', 0, 10000),
  ('m1k2-s07', 4, '391.001', 0, 3500),
  ('m1k2-s07', 5, '391.002', 0, 1000),

  -- s08: 320.006 Borc 240.000 | 153.010 Alacak 200.000 | 391.001 Alacak 40.000
  ('m1k2-s08', 1, '320.006', 240000, 0),
  ('m1k2-s08', 2, '153.010', 0, 200000),
  ('m1k2-s08', 3, '391.001', 0, 40000),

  -- s09: 100.001 Borc 18.000 | 102.004 Borc 45.000 | 103.004 Borc 27.000 | 153.003 Alacak 75.000 | 391.001 Alacak 15.000
  ('m1k2-s09', 1, '100.001', 18000, 0),
  ('m1k2-s09', 2, '102.004', 45000, 0),
  ('m1k2-s09', 3, '103.004', 27000, 0),
  ('m1k2-s09', 4, '153.003', 0, 75000),
  ('m1k2-s09', 5, '391.001', 0, 15000),

  -- s10: 321.005 Borc 81.600 | 153.009 Alacak 68.000 | 391.001 Alacak 13.600
  ('m1k2-s10', 1, '321.005', 81600, 0),
  ('m1k2-s10', 2, '153.009', 0, 68000),
  ('m1k2-s10', 3, '391.001', 0, 13600);

commit;

notify pgrst, 'reload schema';
