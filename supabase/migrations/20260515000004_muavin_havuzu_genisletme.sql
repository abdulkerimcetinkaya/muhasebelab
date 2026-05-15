-- Muavin Havuzu Genişletme — Modül 1 (Mal Hareketleri)
--
-- Kullanıcı verisi: Muavin_Hesap_Havuzu.docx (65 muavin, dökümandaki sıra ve isimlerle)
--
-- Bu migration:
--  1. Mevcut Modül 1 sorularını siler (eski muavin kodlarına bağlı)
--  2. Mevcut Modül 1 muavinlerini siler (artık FK referansı yok)
--  3. Yeni 65 muavini ekler (döküman birebir, dökümandaki sıra)
--  4. 27 soruyu yeni muavin kodlarıyla yeniden ekler
--
-- Senaryolar dökümandaki belirsizliklere göre map edildi:
--  - "Klima" (spesifik tip belirtilmemiş) → 153.008 Klima – Split (default)
--  - "Televizyon LED" → 153.003 LED 50" (default)
--  - "Buzdolabı" → 153.001 No-Frost (default)
--  - "Fırın" → 153.010 Fırın – Ankastre (tek tip)

begin;

-- =====================================================================
-- 1. Eski Modül 1 sorularını sil (cozumler cascade)
-- =====================================================================
delete from sorular where id like 'mh%';

-- =====================================================================
-- 2. Eski muavinleri sil (Modül 1 ile ilgili tüm ana_kod'lar)
-- =====================================================================
delete from muavin_hesaplar
 where ana_kod in (
   '100','102','120','153','157','159','191',
   '320','340','391','600','610','611','649','760'
 );

-- =====================================================================
-- 3. Yeni 65 muavin (Muavin_Hesap_Havuzu.docx birebir)
-- =====================================================================
insert into muavin_hesaplar (kod, ana_kod, ad, tip, sira) values
  -- 100 KASA
  ('100.001', '100', 'Merkez Kasa – TL', 'kasa', 1),

  -- 102 BANKALAR (5 banka)
  ('102.001', '102', 'Garanti BBVA – TL', 'banka', 1),
  ('102.002', '102', 'İş Bankası – TL', 'banka', 2),
  ('102.003', '102', 'Akbank – TL', 'banka', 3),
  ('102.004', '102', 'Yapı Kredi – TL', 'banka', 4),
  ('102.005', '102', 'Ziraat Bankası – TL', 'banka', 5),

  -- 120 ALICILAR (9 müşteri — döküman sırası)
  ('120.001', '120', 'Çağdaş Elektronik Ltd. Şti.', 'musteri', 1),
  ('120.002', '120', 'Akel Elektronik Ltd. Şti.', 'musteri', 2),
  ('120.003', '120', 'Yıldız Mağazacılık A.Ş.', 'musteri', 3),
  ('120.004', '120', 'Demirören Elektronik A.Ş.', 'musteri', 4),
  ('120.005', '120', 'Beyaz İnci Mağazacılık A.Ş.', 'musteri', 5),
  ('120.006', '120', 'Mert Mağazacılık Ltd. Şti.', 'musteri', 6),
  ('120.007', '120', 'Demirsoy Mağazacılık A.Ş.', 'musteri', 7),
  ('120.008', '120', 'Aydın Mağazacılık Ltd. Şti.', 'musteri', 8),
  ('120.009', '120', 'Yapıkent Mağazacılık A.Ş.', 'musteri', 9),

  -- 153 TİCARİ MALLAR (10 mal — alt tipli)
  ('153.001', '153', 'Buzdolabı – No-Frost', 'stok', 1),
  ('153.002', '153', 'Buzdolabı – Mini', 'stok', 2),
  ('153.003', '153', 'Televizyon – LED 50"', 'stok', 3),
  ('153.004', '153', 'Televizyon – LED 32"', 'stok', 4),
  ('153.005', '153', 'Bulaşık Makinesi', 'stok', 5),
  ('153.006', '153', 'Çamaşır Makinesi', 'stok', 6),
  ('153.007', '153', 'Kurutma Makinesi', 'stok', 7),
  ('153.008', '153', 'Klima – Split', 'stok', 8),
  ('153.009', '153', 'Klima – Salon Tipi', 'stok', 9),
  ('153.010', '153', 'Fırın – Ankastre', 'stok', 10),

  -- 157 DİĞER STOKLAR (2 muavin)
  ('157.001', '157', 'Hasarlı Mallar – Sigortadan Tahsil Bekleyen', 'stok', 1),
  ('157.002', '157', 'Hasarlı Mallar – Tedarikçi İadesi Bekleyen', 'stok', 2),

  -- 159 VERİLEN SİPARİŞ AVANSLARI (3 tedarikçi)
  ('159.001', '159', 'LG Electronics', 'tedarikci', 1),
  ('159.002', '159', 'Arçelik A.Ş.', 'tedarikci', 2),
  ('159.003', '159', 'Samsung Elektronik', 'tedarikci', 3),

  -- 191 İNDİRİLECEK KDV (3 oran)
  ('191.001', '191', '%20 İndirilecek KDV', 'diger', 1),
  ('191.002', '191', '%10 İndirilecek KDV', 'diger', 2),
  ('191.003', '191', '%1 İndirilecek KDV', 'diger', 3),

  -- 320 SATICILAR (6 tedarikçi)
  ('320.001', '320', 'Arçelik A.Ş.', 'tedarikci', 1),
  ('320.002', '320', 'Vestel Ticaret A.Ş.', 'tedarikci', 2),
  ('320.003', '320', 'Bosch Ev Aletleri A.Ş.', 'tedarikci', 3),
  ('320.004', '320', 'Samsung Elektronik Türkiye A.Ş.', 'tedarikci', 4),
  ('320.005', '320', 'LG Electronics Türkiye A.Ş.', 'tedarikci', 5),
  ('320.006', '320', 'Hızlı Lojistik Ltd. Şti.', 'tedarikci', 6),

  -- 340 ALINAN SİPARİŞ AVANSLARI (3 müşteri)
  ('340.001', '340', 'Mert Mağazacılık Ltd. Şti.', 'musteri', 1),
  ('340.002', '340', 'Yapıkent Mağazacılık A.Ş.', 'musteri', 2),
  ('340.003', '340', 'Beyaz İnci Mağazacılık A.Ş.', 'musteri', 3),

  -- 391 HESAPLANAN KDV (3 oran)
  ('391.001', '391', '%20 Hesaplanan KDV', 'diger', 1),
  ('391.002', '391', '%10 Hesaplanan KDV', 'diger', 2),
  ('391.003', '391', '%1 Hesaplanan KDV', 'diger', 3),

  -- 600 YURTİÇİ SATIŞLAR (8 muavin)
  ('600.001', '600', 'Buzdolabı Satışları', 'diger', 1),
  ('600.002', '600', 'Televizyon Satışları', 'diger', 2),
  ('600.003', '600', 'Bulaşık Makinesi Satışları', 'diger', 3),
  ('600.004', '600', 'Çamaşır Makinesi Satışları', 'diger', 4),
  ('600.005', '600', 'Kurutma Makinesi Satışları', 'diger', 5),
  ('600.006', '600', 'Klima Satışları', 'diger', 6),
  ('600.007', '600', 'Fırın Satışları', 'diger', 7),
  ('600.008', '600', 'Diğer Beyaz Eşya Satışları', 'diger', 8),

  -- 610 SATIŞTAN İADELER (3 muavin)
  ('610.001', '610', 'Buzdolabı İadesi', 'diger', 1),
  ('610.002', '610', 'Televizyon İadesi', 'diger', 2),
  ('610.003', '610', 'Çamaşır Makinesi İadesi', 'diger', 3),

  -- 611 SATIŞ İSKONTOLARI (3 muavin)
  ('611.001', '611', 'Erken Ödeme İskontosu', 'diger', 1),
  ('611.002', '611', 'Yıllık Ciro Primi', 'diger', 2),
  ('611.003', '611', 'Sezonluk Kampanya İskontosu', 'diger', 3),

  -- 649 DİĞER OLAĞAN GELİR ve KÂRLAR (3 muavin)
  ('649.001', '649', 'Cayma Tazminatı Geliri', 'diger', 1),
  ('649.002', '649', 'Ciro Primi Geliri', 'diger', 2),
  ('649.003', '649', 'Diğer Çeşitli Gelirler', 'diger', 3),

  -- 760 PAZARLAMA SATIŞ DAĞITIM GİDERLERİ (3 muavin)
  ('760.001', '760', 'Komisyon Giderleri', 'diger', 1),
  ('760.002', '760', 'Nakliye Giderleri (Satışa İlişkin)', 'diger', 2),
  ('760.003', '760', 'Reklam ve Tanıtım Giderleri', 'diger', 3);

-- =====================================================================
-- 4. 27 soruyu yeniden ekle (yeni muavin kodları ile)
-- =====================================================================

insert into sorular (id, unite_id, alt_baslik_id, baslik, zorluk, senaryo, ipucu, aciklama, durum, kaynak) values

-- ============= KONU 1: PEŞİN MAL ALIMI =============
('mh01', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Peşin Mal Alımı — Banka',
 'kolay',
 'İşletmemiz, 05.04.2026 tarihinde tedarikçimiz Arçelik A.Ş.''den 10 adet No-Frost buzdolabı alımı yapmıştır. KDV hariç birim fiyat 18.000 TL/adet, KDV oranı %20''dir. Faturanın tamamı, işletmemizin Garanti BBVA TL hesabından EFT ile peşin olarak ödenmiştir.',
 '',
 'Peşin alımda mal maliyeti (153) ve KDV (191) borç, ödeme aracı (102) alacaktır. Senaryoda geçen mal tipi: No-Frost buzdolabı. Banka: Garanti BBVA.',
 'onayli', 'modul1-dokuman'),

('mh02', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Peşin Mal Alımı — Kasa',
 'kolay',
 'İşletmemiz, 12.04.2026 tarihinde tedarikçimiz Vestel Ticaret A.Ş.''den 5 adet 50 inç LED televizyon alımı yapmıştır. KDV hariç birim fiyat 12.000 TL/adet, KDV oranı %20''dir. Faturanın tamamı işletme kasasından nakit olarak ödenmiştir.',
 '',
 'Kasadan ödeme: 100 alacak; mal 153, KDV 191 borç. Senaryoda televizyon tipi: LED 50".',
 'onayli', 'modul1-dokuman'),

('mh03', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Karma Ödeme — Yarısı Banka, Yarısı Kasa',
 'kolay',
 'İşletmemiz, 19.04.2026 tarihinde tedarikçimiz Bosch Ev Aletleri A.Ş.''den 8 adet bulaşık makinesi alımı yapmıştır. KDV hariç birim fiyat 15.000 TL/adet, KDV oranı %20''dir. Fatura bedelinin yarısı işletmemizin İş Bankası TL hesabından EFT ile, kalan yarısı kasadan nakit olarak ödenmiştir.',
 '',
 'Ödeme iki ayrı hesaba bölünür: 102 İş Bankası ve 100 Merkez Kasa ayrı satırlarda alacak.',
 'onayli', 'modul1-dokuman'),

('mh04', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Satıştan İade — Sağlam Mal',
 'orta',
 'İşletmemiz, daha önce Çağdaş Elektronik Ltd. Şti.''ne kredili olarak satmış olduğu 8 adet çamaşır makinesinden 2 adedi 22.04.2026 tarihinde müşteri tarafından iade edilmiştir. Satışın birim fiyatı KDV hariç 14.000 TL/adet ve KDV oranı %20''dir. İade edilen mallar sağlam olup tekrar satılmak üzere depoya alınmıştır. İade bedeli müşterinin cari hesabından düşülmüştür.',
 '',
 '610 Satıştan İadeler hesabı, dönem sonunda 600 Yurtiçi Satışlar hesabından düşülerek net satış tutarı hesaplanır. 391 KDV de azaltılır çünkü artık o KDV doğmamış sayılır.',
 'onayli', 'modul1-dokuman'),

('mh05', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Alıştan İade — Tedarikçiye Mal İadesi',
 'orta',
 'İşletmemiz, 03.04.2026 tarihinde Vestel Ticaret A.Ş.''den kredili olarak satın aldığı 15 adet LED televizyondan 3 adedinin hatalı olduğunu tespit etmiş ve 25.04.2026 tarihinde tedarikçiye iade etmiştir. Alış birim fiyatı KDV hariç 12.000 TL/adet, KDV oranı %20''dir. İade tutarı tedarikçinin cari hesabından düşülmüştür.',
 '',
 'Alıştan iadelerde ayrı bir hesap kullanılmaz; doğrudan 153 ve 191 hesapları azaltılır. Çünkü mal hiç alınmamış sayılır. Televizyon tipi: LED 50" (alış senaryosuyla uyumlu).',
 'onayli', 'modul1-dokuman'),

('mh06', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Satış İskontosu — Erken Ödeme',
 'orta',
 'İşletmemiz, daha önce Yıldız Mağazacılık A.Ş.''ye kredili olarak satmış olduğu 200.000 TL + KDV tutarındaki mal bedelinin tamamı için, müşterinin erken ödeme yapması durumunda %5 iskonto uygulayacağını taahhüt etmiştir. Müşteri, 28.04.2026 tarihinde Garanti BBVA hesabımıza erken ödeme yapmış ve karşılığında iskonto faturası kesilmiştir. İskonto tutarına da KDV (%20) uygulanmıştır.',
 '',
 '611 Satış İskontoları, satışı azaltıcı bir hesaptır. Cari hesaptan iskonto tutarı + KDV''si birlikte düşülür.',
 'onayli', 'modul1-dokuman'),

('mh07', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Yıllık Ciro Primi — Müşteriye Verilen',
 'zor',
 'İşletmemiz, 2025 yılı boyunca Demirören Elektronik A.Ş.''ye toplam 5.000.000 TL + KDV tutarında satış gerçekleştirmiştir. Yıllık sözleşme gereği, müşteri 4.000.000 TL ciro barajını aştığı için %2 ciro primi (yıl sonu iskontosu) hak etmiştir. 30.04.2026 tarihinde işletmemiz tarafından ciro primi faturası (gider faturası niteliğinde, müşteri tarafından kesilen) tarafımıza ulaşmış ve müşterinin cari hesabından düşülmüştür. KDV oranı %20''dir.',
 '',
 'Ciro primi faturasını MÜŞTERİ keser (alıcı). Bu nedenle işletmemiz için "gelen bir fatura" olduğundan KDV İNDİRİLECEK KDV''ye (191) yazılır, 391''e değil.',
 'onayli', 'modul1-dokuman'),

('mh08', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Hatalı Miktarda Gelen Mal — Kısmi İade',
 'zor',
 'İşletmemiz, 10.04.2026 tarihinde Samsung Elektronik Türkiye A.Ş.''den 20 adet split klima sipariş etmiş ve kredili olarak fatura almıştır. KDV hariç birim fiyat 16.000 TL/adet, KDV oranı %20''dir. Ancak 02.05.2026 tarihinde sayım yapıldığında, depoya yalnızca 17 adet klima geldiği tespit edilmiştir. Eksik 3 adet için "iade" faturası işlemi yapılmış ve 02.05.2026 tarihinde kaydedilmiştir.',
 '',
 'Önemli olan, fiziki stokla 153 muavin bakiyesinin örtüşmesidir. Hatalı yapılırsa BA-BS bildirimde sapma çıkar. Klima tipi: Split.',
 'onayli', 'modul1-dokuman'),

('mh09', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Avans-Fatura Uyumsuzluğu — Avans Fatura Tutarından Az',
 'zor',
 'İşletmemiz, 15.03.2026 tarihinde tedarikçimiz LG Electronics Türkiye A.Ş.''ye gelecek dönem split klima teslimine karşılık 100.000 TL sipariş avansı vermiş ve bu tutarı 159 Verilen Sipariş Avansları hesabında izlemiştir. 05.05.2026 tarihinde mal teslim alınmış ve fatura kesilmiştir. Fatura tutarı: KDV hariç 150.000 TL, KDV %20 dahil toplam 180.000 TL. Avans tutarı (100.000 TL) faturadan düşülmüş, kalan 80.000 TL kredili olarak tedarikçinin cari hesabına kaydedilmiştir.',
 '',
 '159 hesabı sıfırlanır (avansın tamamı kullanıldı), 320''ye yalnızca KALAN borç yazılır. Avansın KDV''si: avans öderken KDV hesaplanmamışsa (uygulamada yaygın), tüm KDV teslim tarihinde 191''e yazılır.',
 'onayli', 'modul1-dokuman'),

-- ============= KONU 2: PEŞİN MAL SATIŞI =============
('mh10', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Mal Satışı — Banka',
 'kolay',
 'İşletmemiz, 06.05.2026 tarihinde Akel Elektronik Ltd. Şti.''ne 6 adet buzdolabı satışı yapmıştır. KDV hariç birim fiyat 22.000 TL/adet, KDV oranı %20''dir. Satış bedelinin tamamı müşterinin Garanti BBVA hesabımıza yaptığı EFT ile peşin tahsil edilmiştir.',
 '',
 'Peşin satışta tahsilat aracı (102) borç, hasılat (600) ve KDV (391) alacaktır.',
 'onayli', 'modul1-dokuman'),

('mh11', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Mal Satışı — Kasa',
 'kolay',
 'İşletmemiz, 09.05.2026 tarihinde son tüketici niteliğindeki bir müşteriye 1 adet bulaşık makinesi satışı yapmıştır. KDV hariç fiyat 18.000 TL, KDV oranı %20''dir. Satış bedeli müşteri tarafından nakit olarak kasaya ödenmiştir.',
 '',
 'Kasa hesabı brüt tutarı alır (mal bedeli + KDV).',
 'onayli', 'modul1-dokuman'),

('mh12', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Satış — Yarısı Banka Yarısı Kasa',
 'kolay',
 'İşletmemiz, 14.05.2026 tarihinde Beyaz İnci Mağazacılık A.Ş.''ye 4 adet LED 50" televizyon satışı yapmıştır. KDV hariç birim fiyat 15.000 TL/adet, KDV oranı %20''dir. Satış bedelinin yarısı işletmemizin İş Bankası hesabına EFT ile, kalan yarısı kasamıza nakit olarak ödenmiştir.',
 '',
 'Tahsilat iki ayrı hesaba bölünür: 102 İş Bankası ve 100 Kasa ayrı satırlarda borç.',
 'onayli', 'modul1-dokuman'),

('mh13', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Satışta İskonto — Fatura Üzerinde',
 'orta',
 'İşletmemiz, 18.05.2026 tarihinde Demirsoy Mağazacılık A.Ş.''ye 10 adet ankastre fırın satışı yapmıştır. KDV hariç birim fiyat 9.000 TL/adet, fatura üzerinde %10 indirim uygulanmış ve indirim sonrası tutar üzerinden KDV (%20) hesaplanmıştır. Bedel banka hesabımıza EFT ile peşin tahsil edilmiştir.',
 '',
 'Fatura ÜZERİ iskonto, ayrı bir hesap (611) gerektirmez. Doğrudan net tutar 600''e yazılır.',
 'onayli', 'modul1-dokuman'),

('mh14', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Satıştan İade — Banka İadesi',
 'orta',
 'İşletmemiz, 06.05.2026''da Akel Elektronik''e peşin sattığı 6 buzdolabından 1 tanesi 20.05.2026 tarihinde fonksiyon hatası nedeniyle iade edilmiştir. Birim fiyat KDV hariç 22.000 TL, KDV %20''dir. İade bedeli müşterinin Garanti BBVA hesabına EFT ile iade edilmiştir.',
 '',
 'Peşin satışta iade, kredili satıştaki iadeden farklıdır. Kredilide 120 azalır, peşinde para zaten alındığı için 102 (veya 100) azaltılır.',
 'onayli', 'modul1-dokuman'),

('mh15', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Kapora ile Peşin Satış',
 'orta',
 'İşletmemiz, 22.05.2026 tarihinde Mert Mağazacılık Ltd. Şti.''ye 3 adet çamaşır makinesi satmak üzere anlaşma yapmıştır. Müşteri, sipariş için 15.000 TL kapora ödemiş ve bu tutar Garanti BBVA hesabımıza yatırılmıştır (önceki kayıt — 340 hesabına alındı). Aynı gün mal teslim edilmiş, fatura kesilmiş ve kalan bedel kasaya nakit olarak ödenmiştir. KDV hariç birim fiyat 14.000 TL/adet, KDV %20''dir. Bu kayıtta sadece teslim/fatura anını gösteriniz.',
 '',
 'Kaporanın alındığı an ayrıca kayıt yapılmıştı (340''a yatış). Bu kayıt teslim/fatura anı; 340 sıfırlanır, kalan bedel nakitle tamamlanır.',
 'onayli', 'modul1-dokuman'),

('mh16', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Satıştan İade — Doğru KDV Kaydı',
 'zor',
 'İşletmemiz, 14.05.2026''da Beyaz İnci''ye peşin sattığı 4 LED televizyondan 1 adedi 25.05.2026 tarihinde iade edilmiştir. Birim fiyat KDV hariç 15.000 TL, KDV %20''dir. İade bedeli müşterinin Garanti BBVA hesabına EFT ile gönderilmiştir. KDV''yi doğru hesaba (391 Hesaplanan KDV, borç tarafı) yazınız — bu bir alım değil, satışın geri çevrilmesidir.',
 '',
 'İade işleminde KDV her zaman 391''i AZALTIR (borç tarafına yazılarak), çünkü o satışın KDV''si artık doğmamış sayılır. 191''e yazmak yanlıştır.',
 'onayli', 'modul1-dokuman'),

('mh17', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Avansın İade Edilmesi — Sipariş İptali',
 'zor',
 'İşletmemiz, 10.04.2026 tarihinde Yapıkent Mağazacılık A.Ş.''den 200.000 TL sipariş avansı almış ve 340 hesabına kaydetmiştir. Ancak müşteri, 30.05.2026 tarihinde siparişten vazgeçtiğini bildirmiştir. Sözleşme gereği işletmemiz, 200.000 TL avansın %10''unu (20.000 TL) cayma tazminatı olarak alıkoyma hakkına sahiptir. Kalan 180.000 TL müşteriye Garanti BBVA hesabından iade edilmiştir. Cayma tazminatı KDV''siz olarak 649 hesabına yazılmıştır.',
 '',
 'Cayma tazminatı mal/hizmet karşılığı değildir, sözleşme ihlali nedeniyle alınan tazminattır. KDV''siz olarak 649''a yazılır, 600''e yazılmaz.',
 'onayli', 'modul1-dokuman'),

('mh18', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Konsinye Mal Satışı — Komisyoncu Satınca',
 'zor',
 'İşletmemiz, 01.05.2026 tarihinde Aydın Mağazacılık Ltd. Şti.''ne konsinye olarak 20 adet split klima vermiştir. 30.05.2026 tarihinde Aydın Mağazacılık, 12 adet klima sattığını ve kendine %10 komisyon ayırdığını bildirmiştir. Klimanın bizim satış fiyatımız KDV hariç 16.000 TL/adet, KDV %20''dir. Net tutar (komisyon düşülmüş hali) Garanti BBVA hesabımıza EFT ile yatırılmıştır. Komisyon hizmeti için Aydın Mağazacılık ayrıca fatura kesmiştir (KDV %20). Satış + komisyon hizmeti alımı tek yevmiyede.',
 '',
 'Konsinye satış kaydı, mal TÜKETİCİYE satıldığı anda yapılır. Komisyon ayrı hizmet alımı: 760 PSDG''ye, kendi KDV''si 191''e.',
 'onayli', 'modul1-dokuman'),

-- ============= KONU 3: KREDİLİ MAL ALIMI =============
('mh19', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Kredili Mal Alımı — Cari Hesap',
 'kolay',
 'İşletmemiz, 02.06.2026 tarihinde Arçelik A.Ş.''den 12 adet No-Frost buzdolabı alımı yapmıştır. KDV hariç birim fiyat 19.000 TL/adet, KDV oranı %20''dir. Fatura bedelinin tamamı kredili olarak tedarikçinin cari hesabına kaydedilmiştir.',
 '',
 'Kredili alımda ödeme aracı yerine 320 Satıcılar (tedarikçi cari hesabı) alacaklanır.',
 'onayli', 'modul1-dokuman'),

('mh20', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Karma Ödemeli Alım — Yarısı Peşin Yarısı Kredili',
 'kolay',
 'İşletmemiz, 05.06.2026 tarihinde Vestel Ticaret A.Ş.''den 10 adet LED 50" televizyon alımı yapmıştır. KDV hariç birim fiyat 13.000 TL/adet, KDV oranı %20''dir. Fatura bedelinin yarısı işletmemizin Garanti BBVA hesabından EFT ile peşin ödenmiş, kalan yarısı kredili olarak tedarikçinin cari hesabına kaydedilmiştir.',
 '',
 'Ödeme iki kaynağa bölünür: yarısı 102 (banka), yarısı 320 (cari).',
 'onayli', 'modul1-dokuman'),

('mh21', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Kredili Alım + Nakliye Peşin',
 'kolay',
 'İşletmemiz, 09.06.2026 tarihinde Bosch Ev Aletleri A.Ş.''den 6 adet bulaşık makinesi kredili olarak alımı yapmıştır. KDV hariç birim fiyat 16.000 TL/adet, KDV oranı %20''dir. Ayrıca, malzemelerin işletmemize taşınması için Hızlı Lojistik Ltd. Şti.''ne 5.000 TL + KDV nakliye ücreti kasadan nakit olarak ödenmiş, nakliye bedeli mal maliyetine eklenmiştir.',
 '',
 'Nakliye gideri MAL ALIŞI sırasında doğmuşsa (alıma yönelik), 153''e eklenir. KDV''ler 191''de birleşir. (Nakliye firması Hızlı Lojistik, 320.006''da kayıtlı — ama bu kayıtta kasadan peşin ödendiği için 320 çalıştırılmaz, 100 alacak.)',
 'onayli', 'modul1-dokuman'),

('mh22', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Kredili Alım + Sonradan Alış İskontosu',
 'orta',
 'İşletmemiz, 02.06.2026''da Arçelik''ten kredili olarak satın aldığı buzdolabı sevkıyatından sonra, Arçelik tarafından 12.06.2026 tarihinde "sezon kampanyası" nedeniyle %3 alış iskontosu uygulandığı bildirilmiştir. Orijinal alış: KDV hariç 228.000 TL + 45.600 TL KDV = 273.600 TL. İskonto tutarı tedarikçinin cari hesabından düşülmüştür. Hem mal bedeli hem KDV iskontoya tabidir.',
 '',
 'Alış iskontosu, satış iskontosu gibi ayrı bir hesap (611) gerektirmez. Doğrudan 153 ve 191 hesapları AZALTILIR — mal sanki indirimli alınmış gibi düzeltme yapıyoruz.',
 'onayli', 'modul1-dokuman'),

('mh23', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Verilen Sipariş Avansı — Mal Henüz Teslim Alınmadı',
 'orta',
 'İşletmemiz, 15.06.2026 tarihinde tedarikçimiz LG Electronics Türkiye A.Ş.''ye 50 adet split klima sipariş etmiştir. Sözleşmeye göre sipariş için %30 avans ödenmesi gerekmektedir. Avans olarak 75.000 TL işletmemizin İş Bankası hesabından LG''ye EFT ile gönderilmiştir. Avans için fatura kesilmemiştir, mal henüz teslim alınmamıştır.',
 '',
 'Mal teslim alınmadığı ve fatura kesilmediği için 153 ve 191 hesapları HENÜZ çalıştırılmaz. 159 geçici bir hesaptır; teslim olunca sıfırlanır.',
 'onayli', 'modul1-dokuman'),

('mh24', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Kredili Alımdan Sonra Hasarlı Kısmen İade',
 'orta',
 'İşletmemiz, 05.06.2026''da Vestel''den kredili olarak 10 adet LED televizyon almıştı (KDV hariç 130.000 TL + 26.000 TL KDV). 20.06.2026 tarihinde nakliye sırasında 2 adedinin ekranlarının kırıldığı tespit edilmiş ve tedarikçiye iade edilmiştir. Hasar kısmen Vestel''in, kısmen nakliye firmasının sorumluluğundadır. 2 adedin TOPLAM bedeli (KDV dahil) 31.200 TL, Vestel''in kabul ettiği iade tutarı 15.600 TL''dir. Kabul edilen iade tedarikçinin cari hesabından düşülmüştür. Kabul edilmeyen 15.600 TL ise 157 Diğer Stoklar (Sigortadan Tahsil Bekleyen) hesabına alınmıştır.',
 '',
 '153 ve 191 tamamen azalır. Vestel''in kabul ettiği kısım 320''den düşer. Kabul edilmeyen kısım 157.001''e TASNİF edilir — nakliyeden tahsil edilince 157''den düşülür.',
 'onayli', 'modul1-dokuman'),

('mh25', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Yıl Sonu Ciro Primi — Tedarikçiden Gelen',
 'zor',
 'İşletmemiz, 2025 yılı boyunca tedarikçimiz Arçelik A.Ş.''den toplam 8.000.000 TL + KDV tutarında alım yapmıştır. Yıllık sözleşme gereği, 6.000.000 TL ciro barajını aştığımız için %1,5 ciro primi (yıl sonu iskontosu) hak ettik. Bu prim için 20.06.2026 tarihinde işletmemiz tarafından Arçelik''e gider faturası niteliğinde KDV''li bir fatura kesilmiş ve ciro primi tedarikçinin cari hesabından düşülmüştür. KDV oranı %20''dir.',
 '',
 'Ciro primi faturası İŞLETMEMİZ tarafından kesildi. Bu nedenle HESAPLANAN KDV (391) doğar, İndirilecek değil. Ciro primi geliri 649.002''ye yazılır.',
 'onayli', 'modul1-dokuman'),

('mh26', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Avans-Fatura Uyumsuzluğu — Avans Fatura Tutarından Fazla',
 'zor',
 'İşletmemiz, 15.06.2026 tarihinde tedarikçimiz LG Electronics''e verdiği 75.000 TL avansa karşılık, 22.06.2026 tarihinde split klima teslim almıştır. Fatura tutarı: KDV hariç 50.000 TL, KDV %20 dahil toplam 60.000 TL. Avans (75.000 TL) faturadan büyük olduğu için, faturanın tamamı avanstan mahsup edilmiş, kalan 15.000 TL ise 159''da bakiye olarak bırakılmıştır.',
 '',
 '159 hesabı tamamen sıfırlanmaz; fatura tutarı kadar düşülür. 320 hiç çalışmaz çünkü ek bir borç doğmadı. Bu kayıtta sadece teslim ve avans mahsup işlemini gösteriniz.',
 'onayli', 'modul1-dokuman'),

('mh27', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Hatalı Kesilen Alıştan İade Faturasının Düzeltilmesi',
 'zor',
 'İşletmemiz, 25.04.2026''da Vestel''den 3 adet LED televizyon iade etmişti (mh05). İade kaydında doğru tutarlar girilmişti, ancak iade FATURASI tedarikçi tarafından hatalı kesilmiş, KDV hariç 36.000 TL yerine 32.000 TL yazılmıştır (4.000 TL eksik). 25.06.2026 tarihinde Vestel düzeltme faturası kesmiş ve eksik 4.000 TL + 800 TL KDV (toplam 4.800 TL) için ek iade kaydı yapılmıştır.',
 '',
 'Hatalı iade faturasını düzeltmek için sadece farkı kaydetmek en pratik yoldur. BA-BS bildiriminde her iki fatura ayrı satırlar olarak Vestel adına gözükür.',
 'onayli', 'modul1-dokuman');

-- =====================================================================
-- 5. Cozumler — 27 sorunun yevmiye satırları (YENİ muavin kodları)
-- =====================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values

-- mh01 Arçelik No-Frost, 10×18.000, Garanti BBVA
('mh01', 1, '153.001', 180000, 0),
('mh01', 2, '191.001', 36000, 0),
('mh01', 3, '102.001', 0, 216000),

-- mh02 Vestel LED 50", 5×12.000, kasa
('mh02', 1, '153.003', 60000, 0),
('mh02', 2, '191.001', 12000, 0),
('mh02', 3, '100.001', 0, 72000),

-- mh03 Bosch bulaşık mak., 8×15.000, ½ İş Bankası ½ kasa
('mh03', 1, '153.005', 120000, 0),
('mh03', 2, '191.001', 24000, 0),
('mh03', 3, '102.002', 0, 72000),
('mh03', 4, '100.001', 0, 72000),

-- mh04 Çağdaş Elektronik (120.001) çam.mak. iade, 2×14.000
('mh04', 1, '610.003', 28000, 0),
('mh04', 2, '391.001', 5600, 0),
('mh04', 3, '120.001', 0, 33600),

-- mh05 Vestel (320.002) 3 LED 50" iade
('mh05', 1, '320.002', 43200, 0),
('mh05', 2, '153.003', 0, 36000),
('mh05', 3, '191.001', 0, 7200),

-- mh06 Yıldız Mağazacılık (120.003) erken ödeme iskontosu
('mh06', 1, '102.001', 228000, 0),
('mh06', 2, '611.001', 10000, 0),
('mh06', 3, '391.001', 2000, 0),
('mh06', 4, '120.003', 0, 240000),

-- mh07 Demirören (120.004) ciro primi (müşteri faturası)
('mh07', 1, '611.002', 100000, 0),
('mh07', 2, '191.001', 20000, 0),
('mh07', 3, '120.004', 0, 120000),

-- mh08 Samsung (320.004) split klima eksik 3 adet iade
('mh08', 1, '320.004', 57600, 0),
('mh08', 2, '153.008', 0, 48000),
('mh08', 3, '191.001', 0, 9600),

-- mh09 LG (320.005, 159.001) split klima avans+kredi
('mh09', 1, '153.008', 150000, 0),
('mh09', 2, '191.001', 30000, 0),
('mh09', 3, '159.001', 0, 100000),
('mh09', 4, '320.005', 0, 80000),

-- mh10 Akel (120.002) buzdolabı satışı, 6×22.000, Garanti BBVA
('mh10', 1, '102.001', 158400, 0),
('mh10', 2, '600.001', 0, 132000),
('mh10', 3, '391.001', 0, 26400),

-- mh11 Son tüketici bulaşık mak. satışı, kasa
('mh11', 1, '100.001', 21600, 0),
('mh11', 2, '600.003', 0, 18000),
('mh11', 3, '391.001', 0, 3600),

-- mh12 Beyaz İnci (120.005) 4 LED 50", ½ İş Bankası ½ kasa
('mh12', 1, '102.002', 36000, 0),
('mh12', 2, '100.001', 36000, 0),
('mh12', 3, '600.002', 0, 60000),
('mh12', 4, '391.001', 0, 12000),

-- mh13 Demirsoy (120.007) 10 ankastre fırın, fatura iskontosu, Garanti BBVA
('mh13', 1, '102.001', 97200, 0),
('mh13', 2, '600.007', 0, 81000),
('mh13', 3, '391.001', 0, 16200),

-- mh14 Akel'den 1 buzdolabı iade, Garanti BBVA
('mh14', 1, '610.001', 22000, 0),
('mh14', 2, '391.001', 4400, 0),
('mh14', 3, '102.001', 0, 26400),

-- mh15 Mert (340.001) 3 çamaşır makinesi, kapora + kasa
('mh15', 1, '340.001', 15000, 0),
('mh15', 2, '100.001', 35400, 0),
('mh15', 3, '600.004', 0, 42000),
('mh15', 4, '391.001', 0, 8400),

-- mh16 Beyaz İnci'den 1 LED televizyon iade, Garanti BBVA
('mh16', 1, '610.002', 15000, 0),
('mh16', 2, '391.001', 3000, 0),
('mh16', 3, '102.001', 0, 18000),

-- mh17 Yapıkent (340.002) avans iade + cayma tazminatı
('mh17', 1, '340.002', 200000, 0),
('mh17', 2, '102.001', 0, 180000),
('mh17', 3, '649.001', 0, 20000),

-- mh18 Aydın (120.008) konsinye 12 split klima + komisyon
('mh18', 1, '102.001', 207360, 0),
('mh18', 2, '760.001', 19200, 0),
('mh18', 3, '191.001', 3840, 0),
('mh18', 4, '600.006', 0, 192000),
('mh18', 5, '391.001', 0, 38400),

-- mh19 Arçelik kredili buzdolabı (No-Frost), 12×19.000
('mh19', 1, '153.001', 228000, 0),
('mh19', 2, '191.001', 45600, 0),
('mh19', 3, '320.001', 0, 273600),

-- mh20 Vestel (320.002) 10 LED 50", ½ banka ½ kredi
('mh20', 1, '153.003', 130000, 0),
('mh20', 2, '191.001', 26000, 0),
('mh20', 3, '102.001', 0, 78000),
('mh20', 4, '320.002', 0, 78000),

-- mh21 Bosch (320.003) 6 bulaşık + nakliye kasa
('mh21', 1, '153.005', 101000, 0),
('mh21', 2, '191.001', 20200, 0),
('mh21', 3, '320.003', 0, 115200),
('mh21', 4, '100.001', 0, 6000),

-- mh22 Arçelik (320.001) alış iskontosu (buzdolabı)
('mh22', 1, '320.001', 8208, 0),
('mh22', 2, '153.001', 0, 6840),
('mh22', 3, '191.001', 0, 1368),

-- mh23 LG (159.001) split klima avans 75k, İş Bankası
('mh23', 1, '159.001', 75000, 0),
('mh23', 2, '102.002', 0, 75000),

-- mh24 Vestel (320.002) 2 LED 50" hasarlı, ½ kabul / ½ sigorta
('mh24', 1, '320.002', 15600, 0),
('mh24', 2, '157.001', 15600, 0),
('mh24', 3, '153.003', 0, 26000),
('mh24', 4, '191.001', 0, 5200),

-- mh25 Arçelik ciro primi (bizim faturamız)
('mh25', 1, '320.001', 144000, 0),
('mh25', 2, '649.002', 0, 120000),
('mh25', 3, '391.001', 0, 24000),

-- mh26 LG (159.001) avans fazla, split klima mal=50k
('mh26', 1, '153.008', 50000, 0),
('mh26', 2, '191.001', 10000, 0),
('mh26', 3, '159.001', 0, 60000),

-- mh27 Vestel (320.002) iade düzeltme: 4k + 800
('mh27', 1, '320.002', 4800, 0),
('mh27', 2, '153.003', 0, 4000),
('mh27', 3, '191.001', 0, 800);

commit;

notify pgrst, 'reload schema';
