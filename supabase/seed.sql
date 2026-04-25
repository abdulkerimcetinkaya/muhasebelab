-- MuhasebeLab — initial seed data
-- Mevcut src/data/* dosyalarındaki statik veriyi DB'ye taşır.
-- Run after migration: `supabase db reset` (veya manuel `psql -f seed.sql`)

-- =====================================================================
-- HESAP PLANI (Tek Düzen Hesap Planı — 60 hesap)
-- =====================================================================

insert into hesap_plani (kod, ad, sinif, tur, sira) values
  ('100', 'KASA', '1', 'AKTİF', 1),
  ('101', 'ALINAN ÇEKLER', '1', 'AKTİF', 2),
  ('102', 'BANKALAR', '1', 'AKTİF', 3),
  ('103', 'VERİLEN ÇEKLER VE ÖDEME EMİRLERİ (-)', '1', 'AKTİF', 4),
  ('108', 'DİĞER HAZIR DEĞERLER', '1', 'AKTİF', 5),
  ('120', 'ALICILAR', '1', 'AKTİF', 6),
  ('121', 'ALACAK SENETLERİ', '1', 'AKTİF', 7),
  ('128', 'ŞÜPHELİ TİCARİ ALACAKLAR', '1', 'AKTİF', 8),
  ('129', 'ŞÜPHELİ TİCARİ ALACAKLAR KARŞILIĞI (-)', '1', 'AKTİF', 9),
  ('131', 'ORTAKLARDAN ALACAKLAR', '1', 'AKTİF', 10),
  ('150', 'İLK MADDE VE MALZEME', '1', 'AKTİF', 11),
  ('151', 'YARI MAMULLER - ÜRETİM', '1', 'AKTİF', 12),
  ('152', 'MAMULLER', '1', 'AKTİF', 13),
  ('153', 'TİCARİ MALLAR', '1', 'AKTİF', 14),
  ('157', 'DİĞER STOKLAR', '1', 'AKTİF', 15),
  ('159', 'VERİLEN SİPARİŞ AVANSLARI', '1', 'AKTİF', 16),
  ('190', 'DEVREDEN KDV', '1', 'AKTİF', 17),
  ('191', 'İNDİRİLECEK KDV', '1', 'AKTİF', 18),
  ('192', 'DİĞER KDV', '1', 'AKTİF', 19),
  ('193', 'PEŞİN ÖDENEN VERGİLER VE FONLAR', '1', 'AKTİF', 20),
  ('195', 'İŞ AVANSLARI', '1', 'AKTİF', 21),
  ('196', 'PERSONEL AVANSLARI', '1', 'AKTİF', 22),
  ('197', 'SAYIM VE TESELLÜM NOKSANLARI', '1', 'AKTİF', 23),
  ('252', 'BİNALAR', '2', 'AKTİF', 24),
  ('253', 'TESİS, MAKİNE VE CİHAZLAR', '2', 'AKTİF', 25),
  ('254', 'TAŞITLAR', '2', 'AKTİF', 26),
  ('255', 'DEMİRBAŞLAR', '2', 'AKTİF', 27),
  ('257', 'BİRİKMİŞ AMORTİSMANLAR (-)', '2', 'AKTİF', 28),
  ('258', 'YAPILMAKTA OLAN YATIRIMLAR', '2', 'AKTİF', 29),
  ('300', 'BANKA KREDİLERİ', '3', 'PASİF', 30),
  ('320', 'SATICILAR', '3', 'PASİF', 31),
  ('321', 'BORÇ SENETLERİ', '3', 'PASİF', 32),
  ('331', 'ORTAKLARA BORÇLAR', '3', 'PASİF', 33),
  ('335', 'PERSONELE BORÇLAR', '3', 'PASİF', 34),
  ('336', 'DİĞER ÇEŞİTLİ BORÇLAR', '3', 'PASİF', 35),
  ('340', 'ALINAN SİPARİŞ AVANSLARI', '3', 'PASİF', 36),
  ('360', 'ÖDENECEK VERGİ VE FONLAR', '3', 'PASİF', 37),
  ('361', 'ÖDENECEK SOSYAL GÜVENLİK KESİNTİLERİ', '3', 'PASİF', 38),
  ('391', 'HESAPLANAN KDV', '3', 'PASİF', 39),
  ('392', 'DİĞER KDV', '3', 'PASİF', 40),
  ('500', 'SERMAYE', '5', 'PASİF', 41),
  ('540', 'YASAL YEDEKLER', '5', 'PASİF', 42),
  ('570', 'GEÇMİŞ YILLAR KARLARI', '5', 'PASİF', 43),
  ('580', 'GEÇMİŞ YILLAR ZARARLARI (-)', '5', 'PASİF', 44),
  ('590', 'DÖNEM NET KARI', '5', 'PASİF', 45),
  ('591', 'DÖNEM NET ZARARI (-)', '5', 'PASİF', 46),
  ('600', 'YURT İÇİ SATIŞLAR', '6', 'GELİR', 47),
  ('601', 'YURT DIŞI SATIŞLAR', '6', 'GELİR', 48),
  ('610', 'SATIŞTAN İADELER (-)', '6', 'GİDER', 49),
  ('611', 'SATIŞ İSKONTOLARI (-)', '6', 'GİDER', 50),
  ('621', 'SATILAN TİCARİ MALLAR MALİYETİ (-)', '6', 'GİDER', 51),
  ('632', 'GENEL YÖNETİM GİDERLERİ (-)', '6', 'GİDER', 52),
  ('642', 'FAİZ GELİRLERİ', '6', 'GELİR', 53),
  ('653', 'KOMİSYON GİDERLERİ (-)', '6', 'GİDER', 54),
  ('656', 'KAMBİYO ZARARLARI (-)', '6', 'GİDER', 55),
  ('660', 'KISA VADELİ BORÇLANMA GİDERLERİ (-)', '6', 'GİDER', 56),
  ('689', 'DİĞER OLAĞANDIŞI GİDER VE ZARARLAR (-)', '6', 'GİDER', 57),
  ('690', 'DÖNEM KARI VEYA ZARARI', '6', 'KAPANIŞ', 58),
  ('760', 'PAZARLAMA SATIŞ VE DAĞITIM GİDERLERİ', '7', 'MALİYET', 59),
  ('770', 'GENEL YÖNETİM GİDERLERİ', '7', 'MALİYET', 60);

-- =====================================================================
-- ÜNİTELER
-- =====================================================================

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('kasa',       'Kasa İşlemleri',                  'Nakit giriş-çıkış ve kasa ile ilgili temel kayıtlar', 'kasa',       1),
  ('banka',      'Banka İşlemleri',                 'Banka havale, EFT, çek işlemleri ve kredi kayıtları', 'banka',      2),
  ('mal',        'Ticari Mal Alım-Satımı',          '153, 600, 621 hesapları ve sürekli envanter yöntemi', 'mal',        3),
  ('senet',      'Çek ve Senetler',                 'Alacak/borç senetleri, alınan ve verilen çekler',     'senet',      4),
  ('kdv',        'KDV Hesapları',                   '191 İndirilecek KDV, 391 Hesaplanan KDV, KDV mahsubu', 'kdv',       5),
  ('amortisman', 'Duran Varlıklar ve Amortisman',   'Demirbaş, taşıt alımı ve amortisman kayıtları',        'amortisman', 6),
  ('personel',   'Personel ve Ücret',               'Maaş tahakkuku, SGK ve stopaj kayıtları',              'personel',   7);

-- =====================================================================
-- SORULAR (18 onaylı soru)
-- =====================================================================

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-1', 'kasa', 'Sermaye Koyma', 'kolay',
    $ml$İşletme sahibi, işletmeye kuruluş sermayesi olarak 500.000 TL nakit koymuştur.$ml$,
    $ml$Kasaya para girdi (Aktif artışı → Borç). Sermaye hesabı da arttı (Pasif artışı → Alacak).$ml$,
    $ml$İşletmeye nakit sermaye konulduğunda, varlık tarafında Kasa hesabı borçlandırılır; kaynak tarafında Sermaye hesabı alacaklandırılır. Böylece hem varlıklar hem de öz kaynaklar eşit miktarda artar.$ml$,
    'onayli', 'manuel', now()),

  ('kasa-2', 'kasa', 'Peşin Mal Satışı', 'orta',
    $ml$İşletme, ticari mal satışından 10.000 TL + %20 KDV tutarında peşin tahsilat yapmıştır.$ml$,
    $ml$Kasaya KDV dahil toplam tutar girer. Satış tutarı 600'e, KDV ise 391'e kaydedilir.$ml$,
    $ml$Peşin satışlarda kasa, satış bedeli ve KDV dahil toplam tutarla borçlandırılır. Satış geliri KDV hariç tutarla 600 Yurt İçi Satışlar hesabına, KDV ise 391 Hesaplanan KDV hesabına alacak kaydedilir.$ml$,
    'onayli', 'manuel', now()),

  ('kasa-3', 'kasa', 'Kasa Sayım Noksanlığı', 'orta',
    $ml$Dönem sonu kasa sayımında kayıtlara göre 50.000 TL olması gereken kasada 48.500 TL bulunmuştur. Noksanlığın sebebi araştırılmaktadır.$ml$,
    $ml$Kasadaki fiili tutar kayıttan az ise Kasa azalır (Alacak). Karşılığında 197 Sayım ve Tesellüm Noksanları geçici hesabı kullanılır.$ml$,
    $ml$Kasa sayım noksanlığında, nedeni araştırılıncaya kadar 197 Sayım ve Tesellüm Noksanları hesabı borçlandırılır, Kasa hesabı alacaklandırılır. Sebep bulunduğunda bu hesap ilgili gider veya alacak hesabına devredilir.$ml$,
    'onayli', 'manuel', now()),

  ('banka-1', 'banka', 'Kasadan Bankaya Para Yatırma', 'kolay',
    $ml$İşletme kasasındaki 100.000 TL'yi bankadaki ticari hesabına yatırmıştır.$ml$,
    $ml$Bir aktif hesaptan diğerine aktarım. Banka arttı (Borç), Kasa azaldı (Alacak).$ml$,
    $ml$Bu işlem iki aktif hesap arasındaki bir değişimdir. Kasa hesabı alacaklandırılarak azaltılır, Bankalar hesabı borçlandırılarak artırılır. Varlık toplamı değişmez.$ml$,
    'onayli', 'manuel', now()),

  ('banka-2', 'banka', 'Banka Kredisi Kullanımı', 'kolay',
    $ml$İşletme bankadan 250.000 TL kısa vadeli kredi kullanmış, tutar ticari hesaba aktarılmıştır.$ml$,
    $ml$Banka hesabına para girdi (Aktif artışı). Karşılığında bir borç doğdu (Pasif artışı).$ml$,
    $ml$Banka kredisi kullanımında varlık olarak Bankalar hesabı borçlandırılır, kaynak olarak 300 Banka Kredileri hesabı alacaklandırılır. Kredi kısa vadeli olduğu için 3. sınıftaki hesap kullanılır.$ml$,
    'onayli', 'manuel', now()),

  ('banka-3', 'banka', 'Banka Havalesi ile Borç Ödeme', 'kolay',
    $ml$Satıcıya olan 75.000 TL tutarındaki borç, banka havalesi ile ödenmiştir.$ml$,
    $ml$Hem aktif azaldı (Banka) hem de pasif azaldı (Satıcılar). Azalan aktif alacaklanır, azalan pasif borçlanır.$ml$,
    $ml$Satıcıya olan borç ödendiğinde 320 Satıcılar hesabı borçlandırılarak kapatılır. Ödeme banka yoluyla yapıldığı için 102 Bankalar hesabı alacaklandırılır.$ml$,
    'onayli', 'manuel', now()),

  ('mal-1', 'mal', 'Peşin Mal Alımı', 'orta',
    $ml$İşletme 40.000 TL + %20 KDV tutarında ticari mal satın almış, bedeli nakden ödemiştir.$ml$,
    $ml$Ticari Mallar hesabına KDV HARİÇ tutar, İndirilecek KDV'ye KDV tutarı yazılır. Kasadan KDV dahil toplam çıkar.$ml$,
    $ml$Alımda mal bedeli 153 Ticari Mallar hesabına, KDV ise 191 İndirilecek KDV hesabına borç kaydedilir. Ödeme peşin olduğu için Kasa hesabı KDV dahil toplam tutarla alacaklandırılır.$ml$,
    'onayli', 'manuel', now()),

  ('mal-2', 'mal', 'Veresiye Mal Satışı', 'zor',
    $ml$İşletme, maliyeti 30.000 TL olan malı 45.000 TL + %20 KDV'ye veresiye satmıştır. (Sürekli envanter yöntemi kullanılmaktadır.)$ml$,
    $ml$İki kayıt yapılır: 1) Satış kaydı (Alıcılar-Satışlar-KDV), 2) Maliyet kaydı (STMM-Ticari Mallar).$ml$,
    $ml$Sürekli envanter yönteminde satış anında iki ayrı kayıt yapılır. İlk kayıt satış gelirini, ikinci kayıt satılan malın maliyetini gösterir. 621 Satılan Ticari Mallar Maliyeti hesabı borçlandırılırken 153 Ticari Mallar hesabı alacaklandırılarak stoktan düşülür.$ml$,
    'onayli', 'manuel', now()),

  ('mal-3', 'mal', 'Satıştan İade', 'zor',
    $ml$Müşteri, daha önce veresiye aldığı 10.000 TL + %20 KDV tutarındaki malı iade etmiştir. Malın maliyeti 7.000 TL'dir.$ml$,
    $ml$610 Satıştan İadeler hesabı borçlanır (gider/kontra hesap). KDV ters çevrilir. Mal stoka geri döner (153 borç, 621 alacak).$ml$,
    $ml$Satıştan iadelerde 610 Satıştan İadeler hesabı borçlandırılır ve Hesaplanan KDV tersine çevrilir. Alıcı hesabı kapatılır. Ayrıca iade edilen mal stoka geri girer: 153 Ticari Mallar borçlanırken 621 Satılan Ticari Mallar Maliyeti alacaklandırılır.$ml$,
    'onayli', 'manuel', now()),

  ('senet-1', 'senet', 'Müşteriden Çek Alma', 'kolay',
    $ml$Alıcılara olan 60.000 TL tutarındaki alacak karşılığında müşteriden çek alınmıştır.$ml$,
    $ml$Alacak, Alıcılar'dan Alınan Çekler'e dönüşüyor. İki aktif hesap arası değişim.$ml$,
    $ml$Alınan çek henüz nakde dönmediği için Kasa'ya değil, 101 Alınan Çekler hesabına borç kaydedilir. 120 Alıcılar hesabı alacaklandırılarak alacak tahsil edilmiş sayılır ve kapatılır.$ml$,
    'onayli', 'manuel', now()),

  ('senet-2', 'senet', 'Satıcıya Senet Verme', 'kolay',
    $ml$Satıcılara olan 80.000 TL tutarındaki borç için satıcıya bono düzenlenip verilmiştir.$ml$,
    $ml$Borcun türü değişti: Açık hesaptan senetli borca döndü. Satıcılar kapanır, Borç Senetleri artar.$ml$,
    $ml$Senet verildiğinde açık hesaptaki borç kapatılarak senetli borca dönüşür. 320 Satıcılar hesabı borçlandırılarak kapatılır, 321 Borç Senetleri hesabı alacaklandırılarak yeni yükümlülük kaydedilir.$ml$,
    'onayli', 'manuel', now()),

  ('senet-3', 'senet', 'Alacak Senedinin Tahsili', 'kolay',
    $ml$Vadesi gelen 25.000 TL tutarındaki alacak senedi tahsil edilmiş, tutar banka hesabına yatırılmıştır.$ml$,
    $ml$Alacak Senetleri kapanır (Alacak), Banka artar (Borç).$ml$,
    $ml$Senet vadesinde tahsil edildiğinde 121 Alacak Senetleri hesabı alacaklandırılarak kapatılır. Tahsilat bankaya yapıldığı için 102 Bankalar hesabı borçlandırılır.$ml$,
    'onayli', 'manuel', now()),

  ('kdv-1', 'kdv', 'KDV Mahsubu - Ödenecek KDV', 'orta',
    $ml$Dönem sonunda İndirilecek KDV (191) 18.000 TL, Hesaplanan KDV (391) 25.000 TL'dir. KDV mahsup kaydını yapınız.$ml$,
    $ml$Hesaplanan > İndirilecek ise aradaki fark 360 Ödenecek Vergi ve Fonlar'a yazılır.$ml$,
    $ml$Hesaplanan KDV, İndirilecek KDV'den fazla ise aradaki fark devlete ödenir. 391 Hesaplanan KDV hesabı borçlandırılarak kapatılır; 191 İndirilecek KDV hesabı alacaklandırılarak kapatılır; aradaki fark 360 Ödenecek Vergi ve Fonlar hesabına alacak kaydedilir.$ml$,
    'onayli', 'manuel', now()),

  ('kdv-2', 'kdv', 'KDV Mahsubu - Devreden KDV', 'orta',
    $ml$Dönem sonunda İndirilecek KDV (191) 30.000 TL, Hesaplanan KDV (391) 22.000 TL'dir. KDV mahsup kaydını yapınız.$ml$,
    $ml$İndirilecek > Hesaplanan ise fark 190 Devreden KDV hesabına yazılır (sonraki döneme aktarılır).$ml$,
    $ml$İndirilecek KDV, Hesaplanan KDV'den fazla ise aradaki fark bir sonraki döneme devredilir. 391 Hesaplanan KDV borçlandırılarak kapatılır, 190 Devreden KDV aradaki farkla borçlandırılır, 191 İndirilecek KDV alacaklandırılarak kapatılır.$ml$,
    'onayli', 'manuel', now()),

  ('amort-1', 'amortisman', 'Demirbaş Alımı', 'orta',
    $ml$İşletme 20.000 TL + %20 KDV'ye bilgisayar satın almış, bedeli bankadan ödenmiştir.$ml$,
    $ml$255 Demirbaşlar borçlanır (KDV hariç), 191 İndirilecek KDV borçlanır, Banka alacaklanır (KDV dahil).$ml$,
    $ml$Demirbaş alımında varlığın KDV hariç tutarı 255 Demirbaşlar hesabına kaydedilir; KDV ise 191 İndirilecek KDV'ye gider. Ödeme bankadan yapıldığı için 102 Bankalar hesabı KDV dahil toplam tutarla alacaklandırılır.$ml$,
    'onayli', 'manuel', now()),

  ('amort-2', 'amortisman', 'Normal Amortisman Ayırma', 'orta',
    $ml$Maliyeti 50.000 TL olan demirbaş için %20 normal amortisman ayrılacaktır. Demirbaş genel yönetimde kullanılmaktadır.$ml$,
    $ml$Gider yansıtma: 770 Genel Yönetim Giderleri borçlanır. Birikmiş Amortismanlar (257) alacaklanır.$ml$,
    $ml$Yıllık amortisman tutarı 50.000 × %20 = 10.000 TL'dir. Amortisman gideri kullanım yerine göre 7/A grubunda 770 Genel Yönetim Giderleri hesabına yazılır. Birikmiş amortisman 257 hesabında takip edilir ve alacaklandırılır.$ml$,
    'onayli', 'manuel', now()),

  ('per-1', 'personel', 'Ücret Tahakkuku', 'zor',
    $ml$Personelin brüt ücreti 30.000 TL'dir. SGK işçi payı 4.500 TL, gelir vergisi stopajı 3.000 TL'dir. Net ücret kasadan ödenecektir.$ml$,
    $ml$770 brüt ücretle borçlanır. SGK 361'e, stopaj 360'a alacak. Net ücret için 335 Personele Borçlar alacaklanır.$ml$,
    $ml$Ücret giderinin tamamı brüt tutar üzerinden 770 Genel Yönetim Giderleri hesabına borç yazılır. Kesintiler pasif hesaplara alacak kaydedilir: SGK kesintisi 361 Ödenecek Sosyal Güvenlik Kesintileri, stopaj 360 Ödenecek Vergi ve Fonlar hesabına. Net ödenecek tutar ise 335 Personele Borçlar hesabına alacaklandırılır. Net ücret: 30.000 - 4.500 - 3.000 = 22.500 TL.$ml$,
    'onayli', 'manuel', now()),

  ('per-2', 'personel', 'Net Ücret Ödemesi', 'kolay',
    $ml$Personele olan 22.500 TL tutarındaki net ücret borcu bankadan ödenmiştir.$ml$,
    $ml$Pasif azalır (335 borç), Aktif azalır (102 alacak).$ml$,
    $ml$Net ücret ödendiğinde 335 Personele Borçlar hesabı borçlandırılarak kapatılır, 102 Bankalar hesabı alacaklandırılarak azalır.$ml$,
    'onayli', 'manuel', now());

-- =====================================================================
-- ÇÖZÜMLER (her sorunun yevmiye satırları, sira = dizi indeksi+1)
-- =====================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values
  -- kasa-1
  ('kasa-1',  1, '100', 500000,      0),
  ('kasa-1',  2, '500',      0, 500000),
  -- kasa-2
  ('kasa-2',  1, '100',  12000,      0),
  ('kasa-2',  2, '600',      0,  10000),
  ('kasa-2',  3, '391',      0,   2000),
  -- kasa-3
  ('kasa-3',  1, '197',   1500,      0),
  ('kasa-3',  2, '100',      0,   1500),
  -- banka-1
  ('banka-1', 1, '102', 100000,      0),
  ('banka-1', 2, '100',      0, 100000),
  -- banka-2
  ('banka-2', 1, '102', 250000,      0),
  ('banka-2', 2, '300',      0, 250000),
  -- banka-3
  ('banka-3', 1, '320',  75000,      0),
  ('banka-3', 2, '102',      0,  75000),
  -- mal-1
  ('mal-1',   1, '153',  40000,      0),
  ('mal-1',   2, '191',   8000,      0),
  ('mal-1',   3, '100',      0,  48000),
  -- mal-2
  ('mal-2',   1, '120',  54000,      0),
  ('mal-2',   2, '600',      0,  45000),
  ('mal-2',   3, '391',      0,   9000),
  ('mal-2',   4, '621',  30000,      0),
  ('mal-2',   5, '153',      0,  30000),
  -- mal-3
  ('mal-3',   1, '610',  10000,      0),
  ('mal-3',   2, '391',   2000,      0),
  ('mal-3',   3, '120',      0,  12000),
  ('mal-3',   4, '153',   7000,      0),
  ('mal-3',   5, '621',      0,   7000),
  -- senet-1
  ('senet-1', 1, '101',  60000,      0),
  ('senet-1', 2, '120',      0,  60000),
  -- senet-2
  ('senet-2', 1, '320',  80000,      0),
  ('senet-2', 2, '321',      0,  80000),
  -- senet-3
  ('senet-3', 1, '102',  25000,      0),
  ('senet-3', 2, '121',      0,  25000),
  -- kdv-1
  ('kdv-1',   1, '391',  25000,      0),
  ('kdv-1',   2, '191',      0,  18000),
  ('kdv-1',   3, '360',      0,   7000),
  -- kdv-2
  ('kdv-2',   1, '391',  22000,      0),
  ('kdv-2',   2, '190',   8000,      0),
  ('kdv-2',   3, '191',      0,  30000),
  -- amort-1
  ('amort-1', 1, '255',  20000,      0),
  ('amort-1', 2, '191',   4000,      0),
  ('amort-1', 3, '102',      0,  24000),
  -- amort-2
  ('amort-2', 1, '770',  10000,      0),
  ('amort-2', 2, '257',      0,  10000),
  -- per-1
  ('per-1',   1, '770',  30000,      0),
  ('per-1',   2, '335',      0,  22500),
  ('per-1',   3, '361',      0,   4500),
  ('per-1',   4, '360',      0,   3000),
  -- per-2
  ('per-2',   1, '335',  22500,      0),
  ('per-2',   2, '102',      0,  22500);

-- =====================================================================
-- ROZETLER KATALOĞU (12 rozet — kontrol mantığı client-side, lucide ikon adları)
-- =====================================================================

insert into rozetler_katalog (id, ad, aciklama, icon, sira) values
  ('ilk-adim',   'İlk Adım',         'İlk soruyu çöz',                  'Footprints', 1),
  ('besinci',    'Yol Alıyor',       '5 soru çöz',                      'Milestone',  2),
  ('onuncu',     'Onuncu Kayıt',     '10 soru çöz',                     'Award',      3),
  ('hepsi',      'Tam Tamam',        'Tüm soruları çöz',                'Trophy',     4),
  ('kasa-usta',  'Kasa Ustası',      'Kasa İşlemleri ünitesini bitir',  'Banknote',   5),
  ('mal-usta',   'Ticaret Ustası',   'Ticari Mal ünitesini bitir',      'Package',    6),
  ('kdv-usta',   'KDV Ustası',       'KDV ünitesini bitir',             'Receipt',    7),
  ('zor-aslani', 'Zor Aslanı',       '3 zor soruyu çöz',                'Flame',      8),
  ('seri-3',     'Üç Günlük Seri',   '3 gün üst üste çözüm',            'Calendar',   9),
  ('seri-7',     'Haftalık Ateş',    '7 gün üst üste çözüm',            'Zap',       10),
  ('puan-100',   'Yüzlük',           '100 puana ulaş',                  'Star',      11),
  ('puan-500',   'Beş Yüz',          '500 puana ulaş',                  'Sparkles',  12);
