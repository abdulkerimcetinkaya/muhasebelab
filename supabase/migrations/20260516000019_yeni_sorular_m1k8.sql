-- =====================================================================
-- Modül 1 / Konu 8: Alınan Sipariş Avansı — 10 yeni soru
-- =====================================================================
-- Alt başlık: 'mal-alis-satis-1-11' (Alınan Sipariş Avansı)
--
-- Kural: Müşteriden mal teslim edilmeden önce alınan tutar 340 Alınan
-- Sipariş Avansları'nda izlenir (KDV YOK — fatura kesilmedi). Tahsilat
-- sırasında 100/102 borç + 340 alacak. Mal teslim edildiğinde 340 borç
-- (mahsup) + (kalan tahsilat varsa 100/102/120) borç + 600 alacak +
-- 391 alacak.

begin;

insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values
(
  'm1k8-s01',
  'Banka EFT ile Sipariş Avansı Tahsil Etme',
  'kolay',
  E'İşletmemiz, 09.04.2026 tarihinde Mert Mağazacılık Ltd. Şti.''nden bir sipariş için 80.000 TL avans tahsil etmiştir. Avans müşterinin Garanti BBVA TL hesabımıza EFT ile yatırılmıştır. Avans için fatura kesilmemiş, yalnızca tahsilat makbuzu düzenlenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s02',
  'Kasaya Nakit Kapora Tahsil Etme',
  'kolay',
  E'İşletmemiz, 16.04.2026 tarihinde Yapıkent Mağazacılık A.Ş.''nden 50.000 TL kapora tahsil etmiştir. Kapora nakit olarak işletme kasasına alınmıştır. Henüz fatura kesilmemiş, mal teslim edilmemiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s03',
  'Banka EFT ile Büyük Sipariş Avansı',
  'kolay',
  E'İşletmemiz, 23.04.2026 tarihinde Beyaz İnci Mağazacılık A.Ş.''nden büyük bir sipariş karşılığında 100.000 TL avans tahsil etmiştir. Avans müşteri tarafından İş Bankası TL hesabımıza EFT ile yatırılmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s04',
  'Aynı Müşteriden Ek Sipariş Avansı Tahsil Etme',
  'kolay',
  E'İşletmemiz, daha önce 09.04.2026''da Mert Mağazacılık''tan 80.000 TL avans almıştı (340.001 muavininde kayıtlı). Sipariş büyütüldüğü için 30.04.2026 tarihinde ek olarak 40.000 TL daha avans tahsil edilmiştir. Ek avans müşterinin Akbank TL hesabımıza EFT ile yatırılmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s05',
  'Banka EFT ile Ek Kapora Tahsil Etme',
  'kolay',
  E'İşletmemiz, 07.05.2026 tarihinde Yapıkent Mağazacılık A.Ş.''nden ek bir sipariş için 70.000 TL kapora tahsil etmiştir. Kapora müşteri tarafından Yapı Kredi TL hesabımıza EFT ile yatırılmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s06',
  'Avansı Tamamen Mahsup Ederek Mal Teslimi (Kalan Kredili)',
  'orta',
  E'İşletmemiz, daha önce Beyaz İnci Mağazacılık''tan 100.000 TL avans almıştı (340.003). 14.05.2026 tarihinde sipariş edilen 12 adet bulaşık makinesi teslim edilmiş ve fatura kesilmiştir. KDV hariç birim 18.000 TL, toplam 216.000 + 43.200 KDV = 259.200 TL. Avansın tamamı (100.000 TL) faturadan mahsup edilmiş, kalan 159.200 TL kredili olarak müşterinin cari hesabına kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s07',
  'Avansı Mahsup Ederek Kalan Tutarı Kasaya Tahsil Etme',
  'orta',
  E'İşletmemiz, daha önce Yapıkent Mağazacılık''tan toplam 120.000 TL avans tahsil etmişti (340.002 bakiye: 50.000 + 70.000). 21.05.2026 tarihinde sipariş edilen 10 adet split klima teslim edilmiş ve fatura kesilmiştir. KDV hariç birim 14.000 TL, toplam 140.000 + 28.000 KDV = 168.000 TL. Avans tutarının tamamı (120.000 TL) faturadan mahsup edilmiş, kalan 48.000 TL müşteri tarafından nakit olarak işletme kasasına ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s08',
  'Sipariş İptaliyle Alınan Avansı Müşteriye İade Etme',
  'orta',
  E'İşletmemiz, daha önce Mert Mağazacılık''tan toplam 120.000 TL avans tahsil etmişti (340.001 muavin bakiyesi). 28.05.2026 tarihinde müşteri, piyasa koşulları nedeniyle siparişten vazgeçtiğini bildirmiştir. İşletmemiz iyi niyetli bir tutum olarak avansın TAMAMINI iade etmiştir. İade işletmemizin Ziraat Bankası TL hesabından müşterinin banka hesabına EFT ile gerçekleştirilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s09',
  'Avans ile Birlikte Üç Kanaldan Tahsilatlı Satış',
  'zor',
  E'İşletmemiz, daha önce Beyaz İnci Mağazacılık''tan 200.000 TL avans almıştı (340.003 muavin bakiyesi). 04.06.2026 tarihinde sipariş edilen tüm mallar teslim edilmiş ve tek faturayla işlem yapılmıştır: 25 adet LED 50'''' televizyon (KDV hariç birim 16.000 TL, toplam 400.000 + 80.000 KDV = 480.000 TL). Tahsilat şu şekilde tamamlanmıştır: avansın tamamı (200.000 TL) mahsup edildi, 150.000 TL Garanti BBVA hesabımıza EFT ile peşin tahsil edildi, kalan 130.000 TL kredili olarak müşterinin cari hesabına kaydedildi.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
),
(
  'm1k8-s10',
  'Avansın Bir Kısmını Mahsup Ederek Kısmi Teslim (Bakiye Kalır)',
  'zor',
  E'İşletmemiz, daha önce Yapıkent Mağazacılık''tan 220.000 TL avans tahsil etmişti (340.002 muavin bakiyesi). 11.06.2026 tarihinde Yapıkent için kısmi teslimat yapılmış: 8 adet split klima (KDV hariç birim 16.500 TL, toplam 132.000 + 26.400 KDV = 158.400 TL). Avans (220.000 TL) faturadan büyük olduğu için fatura tamamı avanstan mahsup edilmiş, 340.002 muavininde 61.600 TL bakiye kalmıştır (gelecek teslimatlarda kullanılmak üzere).',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-11'
);

-- =====================================================================
-- Çözümler — muavin koduyla
-- =====================================================================
insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: Garanti'ye 80.000 → 340.001 alacak
  ('m1k8-s01', 1, '102.001', 80000, 0),
  ('m1k8-s01', 2, '340.001', 0, 80000),

  -- s02: Kasa 50.000 → 340.002
  ('m1k8-s02', 1, '100.001', 50000, 0),
  ('m1k8-s02', 2, '340.002', 0, 50000),

  -- s03: İş Bankası 100.000 → 340.003
  ('m1k8-s03', 1, '102.002', 100000, 0),
  ('m1k8-s03', 2, '340.003', 0, 100000),

  -- s04: Akbank 40.000 → 340.001
  ('m1k8-s04', 1, '102.003', 40000, 0),
  ('m1k8-s04', 2, '340.001', 0, 40000),

  -- s05: Yapı Kredi 70.000 → 340.002
  ('m1k8-s05', 1, '102.004', 70000, 0),
  ('m1k8-s05', 2, '340.002', 0, 70000),

  -- s06: Mal teslim, avans 100k mahsup, 159.200 kredili
  -- 340.003 Borç 100k | 120.005 Borç 159.200 | 600.003 Alacak 216k | 391.001 Alacak 43.200
  ('m1k8-s06', 1, '340.003', 100000, 0),
  ('m1k8-s06', 2, '120.005', 159200, 0),
  ('m1k8-s06', 3, '600.003', 0, 216000),
  ('m1k8-s06', 4, '391.001', 0, 43200),

  -- s07: Mal teslim, avans 120k mahsup, 48k kasa
  -- 340.002 Borç 120k | 100.001 Borç 48k | 600.006 Alacak 140k | 391.001 Alacak 28k
  ('m1k8-s07', 1, '340.002', 120000, 0),
  ('m1k8-s07', 2, '100.001', 48000, 0),
  ('m1k8-s07', 3, '600.006', 0, 140000),
  ('m1k8-s07', 4, '391.001', 0, 28000),

  -- s08: Sipariş iptal, avans Ziraat'tan iade
  -- 340.001 Borç 120k | 102.005 Alacak 120k
  ('m1k8-s08', 1, '340.001', 120000, 0),
  ('m1k8-s08', 2, '102.005', 0, 120000),

  -- s09: Mal teslim, avans 200k + Garanti 150k + 130k kredili
  -- 340.003 Borç 200k | 102.001 Borç 150k | 120.005 Borç 130k | 600.002 Alacak 400k | 391.001 Alacak 80k
  ('m1k8-s09', 1, '340.003', 200000, 0),
  ('m1k8-s09', 2, '102.001', 150000, 0),
  ('m1k8-s09', 3, '120.005', 130000, 0),
  ('m1k8-s09', 4, '600.002', 0, 400000),
  ('m1k8-s09', 5, '391.001', 0, 80000),

  -- s10: Kısmi teslim, avans 158.4k mahsup (bakiye 61.6k kalır)
  -- 340.002 Borç 158.400 | 600.006 Alacak 132k | 391.001 Alacak 26.400
  ('m1k8-s10', 1, '340.002', 158400, 0),
  ('m1k8-s10', 2, '600.006', 0, 132000),
  ('m1k8-s10', 3, '391.001', 0, 26400);

commit;

notify pgrst, 'reload schema';
