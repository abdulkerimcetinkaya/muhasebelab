-- =====================================================================
-- Modül 1 / Konu 4: Verilen Sipariş Avansı — 10 yeni soru
-- =====================================================================
-- Alt başlık: 'mal-alis-satis-1-10' (Verilen Sipariş Avansı)
--
-- Kural: Tedarikçiye mal teslim alınmadan önce ödenen tutar
-- 159 Verilen Sipariş Avansları'nda izlenir. Henüz fatura kesilmediği
-- için KDV doğmaz. Mal teslim alındığında 159 alacak tarafına yazılıp
-- mahsup edilir; aynı anda 153 + 191 borç + (kalan) 320 alacak.

begin;

insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values
(
  'm1k4-s01',
  'Banka EFT ile Sipariş Avansı Verme',
  'kolay',
  E'İşletmemiz, 06.04.2026 tarihinde LG Electronics Türkiye A.Ş.''ye yaz sezonu için 40 adet split klima sipariş etmiştir. Sözleşme gereği sipariş için 100.000 TL avans ödenmesi gerekmektedir. Avans tutarı işletmemizin Garanti BBVA TL hesabından LG''ye EFT ile gönderilmiştir. Avans için fatura kesilmemiş, yalnızca tahsilat makbuzu alınmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s02',
  'Kasadan Sipariş Avansı Verme',
  'kolay',
  E'İşletmemiz, 13.04.2026 tarihinde Arçelik A.Ş.''ye No-Frost buzdolabı siparişi vermiştir. Sözleşme gereği 60.000 TL avans ödemesi yapılmıştır. Ödeme işletme kasasından nakit olarak gerçekleştirilmiş, fatura kesilmemiş, tahsilat makbuzu alınmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s03',
  'Banka EFT ile Televizyon Sipariş Avansı',
  'kolay',
  E'İşletmemiz, 20.04.2026 tarihinde Samsung Elektronik Türkiye A.Ş.''ye 25 adet LED 50'''' televizyon siparişi vermiştir. Sözleşme gereği 80.000 TL avans ödemesi yapılmıştır. Ödeme işletmemizin İş Bankası TL hesabından EFT ile gönderilmiş, fatura kesilmemiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s04',
  'Aynı Tedarikçiye Ek Sipariş Avansı Verme',
  'kolay',
  E'İşletmemiz, daha önce 06.04.2026''da LG Electronics''e 100.000 TL avans vermişti (159.001 muavininde kayıtlı). Sipariş büyütüldüğü için 27.04.2026 tarihinde ek olarak 40.000 TL daha avans ödenmiştir. Ek avans işletmemizin Akbank TL hesabından EFT ile gönderilmiştir. Bu ek avans da aynı muavinde (159.001) izlenir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s05',
  'Banka EFT ile İkinci Ayrı Sipariş Avansı',
  'kolay',
  E'İşletmemiz, 04.05.2026 tarihinde Arçelik A.Ş.''ye mini buzdolabı siparişi için 50.000 TL avans ödemiştir. Ödeme işletmemizin Yapı Kredi TL hesabından EFT ile yapılmıştır. Bu, Arçelik için ikinci ayrı sipariş olduğu için 159.002 muavininde bakiye artmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s06',
  'Avansın Tamamını Mahsup Ederek Mal Teslimi',
  'orta',
  E'İşletmemiz, 20.04.2026''da Samsung''a 80.000 TL avans vermişti (159.003). 11.05.2026 tarihinde sipariş edilen 25 adet LED 50'''' televizyon teslim alınmış ve fatura kesilmiştir. KDV hariç birim 14.000 TL, toplam 350.000 TL + 70.000 KDV = 420.000 TL. Avansın tamamı (80.000 TL) faturadan mahsup edilmiş, kalan 340.000 TL kredili olarak tedarikçinin cari hesabına kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s07',
  'Avansın Bir Kısmını Mahsup Ederek Kısmi Teslim',
  'orta',
  E'İşletmemiz, 13.04.2026''da Arçelik''e 60.000 TL avans vermişti (159.002 bakiyesi 60.000 TL, ardından 04.05.2026''da 50.000 TL daha eklendi → toplam 110.000 TL). 18.05.2026 tarihinde Arçelik kısmen teslimat yapmış: 3 adet mini buzdolabı (KDV hariç birim 25.000 TL, toplam 75.000 + 15.000 KDV = 90.000 TL). Avans (110.000 TL) faturadan büyük olduğu için fatura tamamı avanstan mahsup edilmiş, 159.002 muavininde 20.000 TL bakiye kalmıştır.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s08',
  'Sipariş İptaliyle Avansın Bankaya İadesi',
  'orta',
  E'İşletmemiz, 04.05.2026''da Arçelik''e 50.000 TL avans vermişti. Ancak piyasa koşulları nedeniyle ek sipariş iptal kararı alınmıştır. Tedarikçi anlaşma gereği avansın TAMAMINI iade etmiştir. 25.05.2026 tarihinde 50.000 TL Arçelik tarafından işletmemizin Akbank hesabına EFT ile geri ödenmiştir. (Not: Bu işlem 18.05.2026 mahsup işleminden sonraki bakiye üzerinden değil, sadece bu özel siparişin avansının iadesi olarak değerlendirilmektedir.)',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s09',
  'Birikmiş Avansı Mahsup Ederek Kısmi Teslim',
  'zor',
  E'İşletmemiz, LG Electronics''e iki ayrı avans vermişti: 06.04.2026''da 100.000 TL ve 27.04.2026''da ek 40.000 TL → 159.001 muavin toplam bakiyesi: 140.000 TL. 01.06.2026 tarihinde LG, sipariş edilen 40 adet split klimanın 30 adedini teslim etmiştir (KDV hariç birim 13.500 TL, 30 adet 405.000 TL + 81.000 KDV = 486.000 TL). Avansın tamamı (140.000 TL) bu faturadan mahsup edilmiş, kalan 346.000 TL kredili olarak tedarikçinin cari hesabına kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
),
(
  'm1k4-s10',
  'Avans ve Üç Kanaldan Ödeme ile Mal Teslimi',
  'zor',
  E'İşletmemiz, daha önce Samsung Elektronik''e iki ayrı sipariş için toplam 200.000 TL avans vermişti (159.003 bakiye). 08.06.2026 tarihinde Samsung tüm sipariş edilen malları teslim etmiş ve tek faturayla işlem yapılmıştır: KDV hariç 500.000 TL + 100.000 KDV = 600.000 TL toplam. Ödeme şu şekilde yapılmıştır: avans tamamen mahsup edildi (200.000 TL), 250.000 TL Ziraat Bankası hesabından EFT ile peşin ödendi, kalan 150.000 TL için işletmemiz kendi çekini düzenleyip Samsung''a verdi.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-10'
);

-- =====================================================================
-- Çözümler (muavin koduyla)
-- =====================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: LG'ye 100.000 banka avans
  ('m1k4-s01', 1, '159.001', 100000, 0),
  ('m1k4-s01', 2, '102.001', 0, 100000),

  -- s02: Arçelik'e 60.000 kasa avans
  ('m1k4-s02', 1, '159.002', 60000, 0),
  ('m1k4-s02', 2, '100.001', 0, 60000),

  -- s03: Samsung'a 80.000 banka avans
  ('m1k4-s03', 1, '159.003', 80000, 0),
  ('m1k4-s03', 2, '102.002', 0, 80000),

  -- s04: LG'ye ek 40.000 banka avans (Akbank)
  ('m1k4-s04', 1, '159.001', 40000, 0),
  ('m1k4-s04', 2, '102.003', 0, 40000),

  -- s05: Arçelik'e ek 50.000 banka avans (Yapı Kredi)
  ('m1k4-s05', 1, '159.002', 50000, 0),
  ('m1k4-s05', 2, '102.004', 0, 50000),

  -- s06: Samsung 350.000 mal + 70.000 KDV, avans 80.000 mahsup + 340.000 kredili
  ('m1k4-s06', 1, '153.003', 350000, 0),
  ('m1k4-s06', 2, '191.001', 70000, 0),
  ('m1k4-s06', 3, '159.003', 0, 80000),
  ('m1k4-s06', 4, '320.004', 0, 340000),

  -- s07: Arçelik 75.000 mal + 15.000 KDV, avans 90.000 mahsup (bakiye 20.000 kalıyor)
  ('m1k4-s07', 1, '153.002', 75000, 0),
  ('m1k4-s07', 2, '191.001', 15000, 0),
  ('m1k4-s07', 3, '159.002', 0, 90000),

  -- s08: Arçelik sipariş iptali, 50.000 banka iadesi (Akbank)
  ('m1k4-s08', 1, '102.003', 50000, 0),
  ('m1k4-s08', 2, '159.002', 0, 50000),

  -- s09: LG 405.000 mal + 81.000 KDV, avans 140.000 mahsup + 346.000 kredili
  ('m1k4-s09', 1, '153.008', 405000, 0),
  ('m1k4-s09', 2, '191.001', 81000, 0),
  ('m1k4-s09', 3, '159.001', 0, 140000),
  ('m1k4-s09', 4, '320.005', 0, 346000),

  -- s10: Samsung 500.000 mal + 100.000 KDV, avans 200.000 + Ziraat 250.000 + kendi çek 150.000
  ('m1k4-s10', 1, '153.003', 500000, 0),
  ('m1k4-s10', 2, '191.001', 100000, 0),
  ('m1k4-s10', 3, '159.003', 0, 200000),
  ('m1k4-s10', 4, '102.005', 0, 250000),
  ('m1k4-s10', 5, '103.004', 0, 150000);

commit;

notify pgrst, 'reload schema';
