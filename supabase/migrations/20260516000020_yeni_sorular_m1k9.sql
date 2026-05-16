-- =====================================================================
-- Modül 1 / Konu 9: Satışa Bağlı Giderler (760 PSDG) — 18 yeni soru
-- =====================================================================
-- Alt başlık: 'mal-alis-satis-1-13' (Satışa Bağlı Giderler 760 PSDG)
--
-- Kural: Satışa ilişkin nakliye, sigorta, komisyon, paketleme, reklam
-- giderleri 760 Pazarlama Satış Dağıtım Giderleri hesabına yazılır.
-- KDV mal işletmeye girdiği için (hizmet alıyoruz) 191 İndirilecek KDV
-- borç.
--
-- Eksik muavinler eklenir: 760.005, 103.006, 103.007.

begin;

-- Eksik muavinler
insert into muavin_hesaplar (kod, ana_kod, ad, tip, sira) values
  ('760.005', '760', 'Satış Sigortası', 'diger', 5),
  ('103.006', '103', 'Verilen Çek – Erdem Danışmanlık Ltd. Şti.', 'tedarikci', 6),
  ('103.007', '103', 'Verilen Çek – Hızlı Lojistik Ltd. Şti.', 'tedarikci', 7)
on conflict (kod) do nothing;

-- Sorular
insert into sorular (
  id, baslik, zorluk, senaryo, ipucu, aciklama, durum,
  unite_id, konu_id, alt_baslik_id
) values
(
  'm1k9-s01',
  'Banka EFT ile Satış Nakliye Gideri Ödeme',
  'kolay',
  E'İşletmemiz, 10.04.2026 tarihinde Yıldız Mağazacılık A.Ş.''ne yapılan buzdolabı satışının nakliyesi için Hızlı Lojistik Ltd. Şti.''nden hizmet almıştır. Nakliye bedeli 5.000 TL + KDV (%20) olup, fatura tutarı işletmemizin Garanti BBVA TL hesabından EFT ile peşin ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s02',
  'Banka EFT ile Satış Sigortası Primi Ödeme',
  'kolay',
  E'İşletmemiz, 17.04.2026 tarihinde Beyaz İnci Mağazacılık''a yapılan büyük bir klima sevkıyatı için Anadolu Sigorta A.Ş.''den taşıma sigortası yaptırmıştır. Sigorta primi 3.500 TL + KDV (%20) olup, fatura işletmemizin İş Bankası TL hesabından EFT ile peşin ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s03',
  'Banka EFT ile Satış Komisyonu Ödeme',
  'kolay',
  E'İşletmemiz, 24.04.2026 tarihinde Erdem Danışmanlık Ltd. Şti. aracılığıyla yeni bir kurumsal satış gerçekleştirmiştir. Erdem Danışmanlık''a satış komisyonu olarak 8.000 TL + KDV (%20) ödenmiştir. Komisyon bedeli işletmemizin Akbank TL hesabından EFT ile peşin ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s04',
  'Kasadan Nakit Ambalaj Malzemesi Alımı',
  'kolay',
  E'İşletmemiz, 01.05.2026 tarihinde satış sevkıyatlarında kullanılmak üzere ambalaj malzemesi (köpük, koli bandı, balonlu naylon vb.) almıştır. Tedarikçi Pırlanta Temizlik Hizmetleri Ltd. Şti.''nin yan ürün satış birimi olup, fatura bedeli 4.500 TL + KDV (%20) olarak kesilmiştir. Fatura bedeli işletme kasasından nakit olarak peşin ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s05',
  'Banka EFT ile Yerel Gazete Reklam Gideri Ödeme',
  'kolay',
  E'İşletmemiz, 08.05.2026 tarihinde yerel bir gazetede sezon kampanyası ilanı vermiştir. Reklam bedeli 12.000 TL + KDV (%20) olup, fatura işletmemizin Yapı Kredi TL hesabından EFT ile peşin ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s06',
  'Kasadan Nakit Satış Nakliye Gideri Ödeme',
  'kolay',
  E'İşletmemiz, 15.05.2026 tarihinde Akel Elektronik''e yapılan klima teslimatının nakliyesi için Hızlı Lojistik''ten hizmet almıştır. Nakliye bedeli 2.500 TL + KDV (%20) olup, fatura bedeli işletme kasasından nakit olarak peşin ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s07',
  'Cari Hesaba Borçlanarak Komisyon Tahakkuku',
  'kolay',
  E'İşletmemiz, 22.05.2026 tarihinde Demirören Elektronik''e yapılan büyük bir satış için Erdem Danışmanlık Ltd. Şti.''ne aracılık komisyonu tahakkuk ettirilmiştir. Komisyon bedeli 15.000 TL + KDV (%20) olup, ödeme henüz yapılmadığı için tedarikçinin cari hesabına kredili olarak kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s08',
  'Banka EFT ile Dijital Reklam Kampanyası Ödeme',
  'kolay',
  E'İşletmemiz, 29.05.2026 tarihinde Erdem Danışmanlık Ltd. Şti. üzerinden bir aylık dijital reklam kampanyası yaptırmıştır. Hizmet bedeli 20.000 TL + KDV (%20) olup, fatura bedeli işletmemizin Ziraat Bankası TL hesabından EFT ile peşin ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s09',
  'Cari Hesaba Borçlanarak Ambalaj Alımı',
  'kolay',
  E'İşletmemiz, 05.06.2026 tarihinde Pırlanta Temizlik Hizmetleri Ltd. Şti.''nden satış sevkıyatlarında kullanılmak üzere büyük miktarda ambalaj malzemesi almıştır. Fatura bedeli 8.000 TL + KDV (%20) olup, ödeme henüz yapılmadığı için tedarikçinin cari hesabına kredili olarak kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s10',
  'Banka ve Kasa Karması ile Nakliye Gideri Ödeme',
  'orta',
  E'İşletmemiz, 12.06.2026 tarihinde Hızlı Lojistik''ten büyük bir satış sevkıyatı için nakliye hizmeti almıştır. Nakliye bedeli 18.000 TL + KDV (%20) olup, fatura bedelinin %60''ı işletmemizin Garanti BBVA TL hesabından EFT ile, kalan %40''ı işletme kasasından nakit olarak ödenmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s11',
  'Tek Faturada Birden Fazla Satış Gideri',
  'orta',
  E'İşletmemiz, 19.06.2026 tarihinde Hızlı Lojistik Ltd. Şti.''nden hem nakliye hem de paketleme hizmeti almıştır. Faturada ayrı kalemler olarak: nakliye 6.000 TL + KDV ve paketleme hizmet bedeli 2.500 TL + KDV yer almaktadır. Fatura toplamının tamamı işletmemizin İş Bankası TL hesabından EFT ile peşin ödenmiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s12',
  'Yarı Peşin Yarı Kredili Reklam Gideri',
  'orta',
  E'İşletmemiz, 26.06.2026 tarihinde Erdem Danışmanlık Ltd. Şti. ile büyük bir reklam kampanyası anlaşması yapmıştır. Toplam reklam bedeli 50.000 TL + KDV (%20) olup, fatura bedelinin yarısı işletmemizin Akbank TL hesabından EFT ile peşin ödenmiş, kalan yarısı kredili olarak tedarikçinin cari hesabına kaydedilmiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s13',
  'Aynı Yevmiyede Sigorta ve Komisyon (Farklı Tedarikçiler)',
  'orta',
  E'İşletmemiz, 03.07.2026 tarihinde aynı satış işlemi için iki ayrı hizmet bedeli aynı gün ödenmiştir: Anadolu Sigorta''ya 4.000 TL + KDV taşıma sigortası primi, Erdem Danışmanlık''a 10.000 TL + KDV satış komisyonu. Her iki ödeme de işletmemizin Yapı Kredi TL hesabından EFT ile peşin yapılmıştır. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s14',
  'Birikmiş Komisyon Borcunu Bankadan Kapatma',
  'orta',
  E'İşletmemiz, Erdem Danışmanlık Ltd. Şti.''nin cari hesabında birikmiş 48.000 TL borcunu (3 ay boyunca tahakkuk eden komisyon faturalarından) 10.07.2026 tarihinde toplu olarak kapatmıştır. Ödeme işletmemizin Ziraat Bankası TL hesabından EFT ile yapılmıştır. (Not: Bu işlem komisyon gideri değil, mevcut borcun ödemesidir, bu yüzden 760 hareketi olmaz.)',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s15',
  'Çek Düzenleyerek Yıllık Reklam Sözleşmesi',
  'orta',
  E'İşletmemiz, 17.07.2026 tarihinde Erdem Danışmanlık Ltd. Şti. ile yıllık reklam ve tanıtım sözleşmesi imzalamıştır. Sözleşme bedeli toplam 100.000 TL + KDV (%20) olup, fatura tutarının tamamı için işletmemiz kendi çekini düzenleyip Erdem Danışmanlık''a vermiştir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s16',
  'Üç Tedarikçiden Farklı Hizmet ve Üç Ödeme Kanalı',
  'zor',
  E'İşletmemiz, 24.07.2026 tarihinde büyük bir kurumsal satış için aynı gün üç farklı hizmet alımı yapmıştır: Hızlı Lojistik''ten nakliye 12.000 TL + KDV (banka EFT ile peşin — Garanti BBVA), Anadolu Sigorta''dan taşıma sigortası 5.000 TL + KDV (kasadan nakit ödendi), Erdem Danışmanlık''tan satış komisyonu 15.000 TL + KDV (kredili olarak cari hesaba kaydedildi). KDV oranı %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s17',
  'Konsolide Fuar Katılım Giderleri',
  'zor',
  E'İşletmemiz, 01.08.2026 tarihinde uluslararası bir beyaz eşya fuarına katılım sağlamıştır. Fuar kapsamında çeşitli hizmet alımları yapılmış ve tek bir muhasebe kaydında konsolide edilmiştir: Stand kira ve hazırlık (Erdem Danışmanlık) 40.000 TL + KDV, tanıtım broşür/katalog basımı (Erdem Danışmanlık) 15.000 TL + KDV, fuar alanına ürün nakliyesi (Hızlı Lojistik) 8.000 TL + KDV, ürün taşıma sigortası (Anadolu Sigorta) 3.000 TL + KDV. Tedarikçilerden Erdem Danışmanlık ve Hızlı Lojistik''e ait ödemeler kredili olarak ilgili cari hesaplara kaydedilmiş, Anadolu Sigorta''ya ait ödeme işletmemizin Akbank TL hesabından EFT ile peşin yapılmıştır. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
),
(
  'm1k9-s18',
  'Aylık Toplu Nakliye Faturası — Üç Kanaldan Ödeme',
  'zor',
  E'İşletmemiz, 08.08.2026 tarihinde Temmuz ayı boyunca yapılmış satış teslimatlarına ilişkin Hızlı Lojistik Ltd. Şti.''nin gönderdiği toplu faturayı kaydetmiştir. Faturada aylık tüm nakliye işlemleri kalem kalem detaylandırılmış olup toplamlar şu şekildedir: Nakliye hizmeti 45.000 TL + KDV, paketleme/ambalaj hizmeti 8.000 TL + KDV, yükleme-boşaltma 3.500 TL + KDV (bu da satışa ilişkin olduğu için 760''a yazılır). Fatura toplam tutarının %50''si işletmemizin İş Bankası hesabından EFT ile peşin ödenmiş, %30''u kredili olarak tedarikçinin cari hesabına kaydedilmiş, %20''si için işletmemiz kendi çekini düzenlemiştir. KDV %20''dir.',
  '', '', 'onayli', 'mal-alis-satis', null, 'mal-alis-satis-1-13'
);

-- Çözümler
insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- s01: Nakliye 5k → Garanti
  ('m1k9-s01', 1, '760.002', 5000, 0),
  ('m1k9-s01', 2, '191.001', 1000, 0),
  ('m1k9-s01', 3, '102.001', 0, 6000),

  -- s02: Sigorta 3.5k → İş Bankası
  ('m1k9-s02', 1, '760.005', 3500, 0),
  ('m1k9-s02', 2, '191.001', 700, 0),
  ('m1k9-s02', 3, '102.002', 0, 4200),

  -- s03: Komisyon 8k → Akbank
  ('m1k9-s03', 1, '760.001', 8000, 0),
  ('m1k9-s03', 2, '191.001', 1600, 0),
  ('m1k9-s03', 3, '102.003', 0, 9600),

  -- s04: Ambalaj 4.5k → Kasa
  ('m1k9-s04', 1, '760.004', 4500, 0),
  ('m1k9-s04', 2, '191.001', 900, 0),
  ('m1k9-s04', 3, '100.001', 0, 5400),

  -- s05: Reklam 12k → Yapı Kredi
  ('m1k9-s05', 1, '760.003', 12000, 0),
  ('m1k9-s05', 2, '191.001', 2400, 0),
  ('m1k9-s05', 3, '102.004', 0, 14400),

  -- s06: Nakliye 2.5k → Kasa
  ('m1k9-s06', 1, '760.002', 2500, 0),
  ('m1k9-s06', 2, '191.001', 500, 0),
  ('m1k9-s06', 3, '100.001', 0, 3000),

  -- s07: Komisyon 15k → Erdem cari kredili
  ('m1k9-s07', 1, '760.001', 15000, 0),
  ('m1k9-s07', 2, '191.001', 3000, 0),
  ('m1k9-s07', 3, '320.010', 0, 18000),

  -- s08: Reklam 20k → Ziraat
  ('m1k9-s08', 1, '760.003', 20000, 0),
  ('m1k9-s08', 2, '191.001', 4000, 0),
  ('m1k9-s08', 3, '102.005', 0, 24000),

  -- s09: Ambalaj 8k → Pırlanta cari kredili
  ('m1k9-s09', 1, '760.004', 8000, 0),
  ('m1k9-s09', 2, '191.001', 1600, 0),
  ('m1k9-s09', 3, '320.007', 0, 9600),

  -- s10: Nakliye 18k → %60 banka %40 kasa
  ('m1k9-s10', 1, '760.002', 18000, 0),
  ('m1k9-s10', 2, '191.001', 3600, 0),
  ('m1k9-s10', 3, '102.001', 0, 12960),
  ('m1k9-s10', 4, '100.001', 0, 8640),

  -- s11: Nakliye 6k + Paketleme 2.5k → İş Bankası
  ('m1k9-s11', 1, '760.002', 6000, 0),
  ('m1k9-s11', 2, '760.004', 2500, 0),
  ('m1k9-s11', 3, '191.001', 1700, 0),
  ('m1k9-s11', 4, '102.002', 0, 10200),

  -- s12: Reklam 50k → ½ Akbank ½ Erdem cari
  ('m1k9-s12', 1, '760.003', 50000, 0),
  ('m1k9-s12', 2, '191.001', 10000, 0),
  ('m1k9-s12', 3, '102.003', 0, 30000),
  ('m1k9-s12', 4, '320.010', 0, 30000),

  -- s13: Sigorta 4k + Komisyon 10k → Yapı Kredi
  ('m1k9-s13', 1, '760.001', 10000, 0),
  ('m1k9-s13', 2, '760.005', 4000, 0),
  ('m1k9-s13', 3, '191.001', 2800, 0),
  ('m1k9-s13', 4, '102.004', 0, 16800),

  -- s14: Birikmiş Erdem borcunu Ziraat ile kapatma (760 yok, sadece 320 → 102)
  ('m1k9-s14', 1, '320.010', 48000, 0),
  ('m1k9-s14', 2, '102.005', 0, 48000),

  -- s15: Reklam 100k → kendi çek (103.006 Erdem)
  ('m1k9-s15', 1, '760.003', 100000, 0),
  ('m1k9-s15', 2, '191.001', 20000, 0),
  ('m1k9-s15', 3, '103.006', 0, 120000),

  -- s16: Nakliye 12k + Sigorta 5k + Komisyon 15k → banka + kasa + Erdem cari
  ('m1k9-s16', 1, '760.001', 15000, 0),
  ('m1k9-s16', 2, '760.002', 12000, 0),
  ('m1k9-s16', 3, '760.005', 5000, 0),
  ('m1k9-s16', 4, '191.001', 6400, 0),
  ('m1k9-s16', 5, '102.001', 0, 14400),
  ('m1k9-s16', 6, '100.001', 0, 6000),
  ('m1k9-s16', 7, '320.010', 0, 18000),

  -- s17: Fuar — Stand 40 + Broşür 15 + Nakliye 8 + Sigorta 3 → Erdem 66k cari + Hızlı 9.6k cari + Akbank 3.6k
  -- 760.003: 55.000 (stand 40 + broşür 15)
  -- 760.002: 8.000 (nakliye)
  -- 760.005: 3.000 (sigorta)
  ('m1k9-s17', 1, '760.002', 8000, 0),
  ('m1k9-s17', 2, '760.003', 55000, 0),
  ('m1k9-s17', 3, '760.005', 3000, 0),
  ('m1k9-s17', 4, '191.001', 13200, 0),
  ('m1k9-s17', 5, '320.010', 0, 66000),
  ('m1k9-s17', 6, '320.006', 0, 9600),
  ('m1k9-s17', 7, '102.003', 0, 3600),

  -- s18: Nakliye 45k + Yükleme 3.5k = 48.5k (nakliye altında) + Paketleme 8k = 56.5k toplam
  -- Banka %50 = 33.900 | Cari %30 = 20.340 | Çek %20 = 13.560
  ('m1k9-s18', 1, '760.002', 48500, 0),
  ('m1k9-s18', 2, '760.004', 8000, 0),
  ('m1k9-s18', 3, '191.001', 11300, 0),
  ('m1k9-s18', 4, '102.002', 0, 33900),
  ('m1k9-s18', 5, '320.006', 0, 20340),
  ('m1k9-s18', 6, '103.007', 0, 13560);

commit;

notify pgrst, 'reload schema';
