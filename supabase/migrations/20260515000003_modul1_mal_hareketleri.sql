-- Modül 1 — Mal Hareketleri (Yıldız Beyaz Eşya Ticaret A.Ş.)
--
-- Kullanıcı kararları:
-- - Modül 1 adı "Isınma: İlk Kayıtlar" → "Mal Hareketleri"
-- - Eski 5 alt başlık silindi, yeni 3 alt başlık: Peşin Alım, Peşin Satış, Kredili Alım
-- - Muavinler mal cinsi bazlı + tedarikçi/müşteri alfabetik
-- - 27 soru (9 + 9 + 9, 3 zorluk × 3 konu)
-- - Tüm yevmiye satırları muavin koduyla (ana hesap kabul edilmez)

begin;

-- =====================================================================
-- 1. Modül 1 adı/açıklama güncelle
-- =====================================================================
update unite_modulleri
   set baslik = 'Mal Hareketleri',
       aciklama = 'Peşin/kredili mal alımı, peşin mal satışı. KDV''li yevmiye, iade, iskonto, avans, kapora, ciro primi.'
 where id = 'mal-alis-satis-m1';

-- =====================================================================
-- 2. Eski alt başlıklar sil, yeni 3 alt başlık ekle
-- =====================================================================
delete from modul_alt_basliklari where modul_id = 'mal-alis-satis-m1';

insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  ('mal-alis-satis-1-1', 'mal-alis-satis-m1', 1, 'Peşin Mal Alımı', false),
  ('mal-alis-satis-1-2', 'mal-alis-satis-m1', 2, 'Peşin Mal Satışı', false),
  ('mal-alis-satis-1-3', 'mal-alis-satis-m1', 3, 'Kredili Mal Alımı', false);

-- =====================================================================
-- 3. Muavinler — mal cinsi bazlı, tedarikçi/müşteri alfabetik
-- =====================================================================

insert into muavin_hesaplar (kod, ana_kod, ad, tip, sira) values
  -- 100 Kasa
  ('100.001', '100', 'Merkez Kasa – TL', 'kasa', 1),

  -- 102 Bankalar
  ('102.001', '102', 'Garanti BBVA – TL', 'banka', 1),
  ('102.002', '102', 'İş Bankası – TL', 'banka', 2),

  -- 120 Alıcılar (müşteriler, alfabetik)
  ('120.001', '120', 'Akel Elektronik Ltd. Şti.', 'musteri', 1),
  ('120.002', '120', 'Beyaz İnci Mağazacılık A.Ş.', 'musteri', 2),
  ('120.003', '120', 'Çağdaş Elektronik Ltd. Şti.', 'musteri', 3),
  ('120.004', '120', 'Demirören Elektronik A.Ş.', 'musteri', 4),
  ('120.005', '120', 'Demirsoy Mağazacılık A.Ş.', 'musteri', 5),
  ('120.006', '120', 'Mert Mağazacılık Ltd. Şti.', 'musteri', 6),
  ('120.007', '120', 'Yapıkent Mağazacılık A.Ş.', 'musteri', 7),
  ('120.008', '120', 'Yıldız Mağazacılık A.Ş.', 'musteri', 8),

  -- 153 Ticari Mallar (mal cinsi)
  ('153.001', '153', 'Buzdolabı', 'stok', 1),
  ('153.002', '153', 'Televizyon', 'stok', 2),
  ('153.003', '153', 'Bulaşık Makinesi', 'stok', 3),
  ('153.004', '153', 'Klima', 'stok', 4),
  ('153.005', '153', 'Çamaşır Makinesi', 'stok', 5),
  ('153.006', '153', 'Fırın', 'stok', 6),

  -- 157 Diğer Stoklar
  ('157.001', '157', 'Hasarlı – Sigortadan Bekleyen', 'stok', 1),

  -- 159 Verilen Sipariş Avansları
  ('159.001', '159', 'LG Electronics Türkiye A.Ş.', 'tedarikci', 1),

  -- 191 İndirilecek KDV
  ('191.001', '191', '%20 İndirilecek KDV', 'diger', 1),

  -- 320 Satıcılar (alfabetik)
  ('320.001', '320', 'Arçelik A.Ş.', 'tedarikci', 1),
  ('320.002', '320', 'Bosch Ev Aletleri A.Ş.', 'tedarikci', 2),
  ('320.003', '320', 'LG Electronics Türkiye A.Ş.', 'tedarikci', 3),
  ('320.004', '320', 'Samsung Elektronik Türkiye A.Ş.', 'tedarikci', 4),
  ('320.005', '320', 'Vestel Ticaret A.Ş.', 'tedarikci', 5),

  -- 340 Alınan Sipariş Avansları (alfabetik)
  ('340.001', '340', 'Mert Mağazacılık Ltd. Şti.', 'musteri', 1),
  ('340.002', '340', 'Yapıkent Mağazacılık A.Ş.', 'musteri', 2),

  -- 391 Hesaplanan KDV
  ('391.001', '391', '%20 Hesaplanan KDV', 'diger', 1),

  -- 600 Yurtiçi Satışlar (mal cinsi)
  ('600.001', '600', 'Buzdolabı Satışı', 'diger', 1),
  ('600.002', '600', 'Televizyon Satışı', 'diger', 2),
  ('600.003', '600', 'Bulaşık Makinesi Satışı', 'diger', 3),
  ('600.004', '600', 'Klima Satışı', 'diger', 4),
  ('600.005', '600', 'Çamaşır Makinesi Satışı', 'diger', 5),
  ('600.006', '600', 'Fırın Satışı', 'diger', 6),

  -- 610 Satıştan İadeler (mal cinsi)
  ('610.001', '610', 'Buzdolabı İadesi', 'diger', 1),
  ('610.002', '610', 'Televizyon İadesi', 'diger', 2),
  ('610.005', '610', 'Çamaşır Makinesi İadesi', 'diger', 5),

  -- 611 Satış İskontoları
  ('611.001', '611', 'Erken Ödeme İskontosu', 'diger', 1),
  ('611.002', '611', 'Yıllık Ciro Primi', 'diger', 2),

  -- 649 Diğer Olağan Gelir/Karlar
  ('649.001', '649', 'Cayma Tazminatı', 'diger', 1),
  ('649.002', '649', 'Ciro Primi Geliri', 'diger', 2),

  -- 760 Pazarlama Satış Dağıtım Giderleri
  ('760.001', '760', 'Komisyon Giderleri', 'diger', 1)
on conflict (kod) do update set
  ad = excluded.ad,
  ana_kod = excluded.ana_kod,
  tip = excluded.tip,
  sira = excluded.sira;

-- =====================================================================
-- 4. Sorular — 27 senaryo (Yıldız Beyaz Eşya A.Ş.)
-- =====================================================================
-- zorluk: kolay (5p), orta (10p), zor (20p)
-- alt_baslik: mal-alis-satis-1-1 (Peşin Alım), 1-2 (Peşin Satış), 1-3 (Kredili Alım)

insert into sorular (id, unite_id, alt_baslik_id, baslik, zorluk, senaryo, ipucu, aciklama, durum, kaynak) values

-- ============= KONU 1: PEŞİN MAL ALIMI (Soru 1-9) =============

('mh01', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Peşin Mal Alımı — Banka',
 'kolay',
 'İşletmemiz, 05.04.2026 tarihinde tedarikçimiz Arçelik A.Ş.''den 10 adet No-Frost buzdolabı alımı yapmıştır. KDV hariç birim fiyat 18.000 TL/adet, KDV oranı %20''dir. Faturanın tamamı, işletmemizin Garanti BBVA TL hesabından EFT ile peşin olarak ödenmiştir.',
 '',
 'Peşin alımda mal maliyeti (153) ve KDV (191) borç, ödeme aracı (102) alacaktır. Mal cinsi muavinine ve banka muavinine dikkat.',
 'onayli', 'modul1-dokuman'),

('mh02', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Peşin Mal Alımı — Kasa',
 'kolay',
 'İşletmemiz, 12.04.2026 tarihinde tedarikçimiz Vestel Ticaret A.Ş.''den 5 adet 50 inç LED televizyon alımı yapmıştır. KDV hariç birim fiyat 12.000 TL/adet, KDV oranı %20''dir. Faturanın tamamı işletme kasasından nakit olarak ödenmiştir.',
 '',
 'Kasadan ödeme: 100 alacak; mal 153, KDV 191 borç.',
 'onayli', 'modul1-dokuman'),

('mh03', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Karma Ödeme — Yarısı Banka, Yarısı Kasa',
 'kolay',
 'İşletmemiz, 19.04.2026 tarihinde tedarikçimiz Bosch Ev Aletleri A.Ş.''den 8 adet bulaşık makinesi alımı yapmıştır. KDV hariç birim fiyat 15.000 TL/adet, KDV oranı %20''dir. Fatura bedelinin yarısı işletmemizin İş Bankası TL hesabından EFT ile, kalan yarısı kasadan nakit olarak ödenmiştir.',
 '',
 'Ödeme iki ayrı hesaba bölünür: 102 ve 100 ayrı satırlarda alacak.',
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
 'Alıştan iadelerde ayrı bir hesap (örn. 611 benzeri) kullanılmaz; doğrudan 153 ve 191 hesapları azaltılır. Çünkü mal hiç alınmamış sayılır.',
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
 'Ciro primi faturasını MÜŞTERİ keser (alıcı). Bu nedenle işletmemiz için "gelen bir fatura" olduğundan KDV İNDİRİLECEK KDV''ye (191) yazılır, 391''e değil. Bu, normal iskonto kaydından temel farktır.',
 'onayli', 'modul1-dokuman'),

('mh08', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Hatalı Miktarda Gelen Mal — Kısmi İade',
 'zor',
 'İşletmemiz, 10.04.2026 tarihinde Samsung Elektronik Türkiye A.Ş.''den 20 adet klima sipariş etmiş ve kredili olarak fatura almıştır. KDV hariç birim fiyat 16.000 TL/adet, KDV oranı %20''dir. Ancak 02.05.2026 tarihinde sayım yapıldığında, depoya yalnızca 17 adet klima geldiği tespit edilmiştir. Tedarikçi ile yapılan görüşme sonucunda eksik gelen 3 adet için fatura düzeltilemediği için TÜM FATURA İPTAL EDİLİP yeniden 17 adetlik fatura kesilmesi yerine, eksik 3 adet için "iade" faturası işlemi yapılmıştır. Bu işlem 02.05.2026 tarihinde kaydedilmiştir.',
 '',
 'Faturanın TAMAMINI iptal edip yeniden 17 adetlik fatura kesmek de bir seçenekti. Ancak pratikte, tedarikçi tarafından düzeltici işlem yerine kısmi iade kaydı yapmak daha kolaydır. Önemli olan, fiziki stokla 153 muavin bakiyesinin örtüşmesidir. Hatalı yapılırsa BA-BS bildirimde sapma çıkar.',
 'onayli', 'modul1-dokuman'),

('mh09', 'mal-alis-satis', 'mal-alis-satis-1-1',
 'Avans-Fatura Uyumsuzluğu — Avans Fatura Tutarından Az',
 'zor',
 'İşletmemiz, 15.03.2026 tarihinde tedarikçimiz LG Electronics Türkiye A.Ş.''ye gelecek dönem mal teslimine karşılık 100.000 TL sipariş avansı vermiş ve bu tutarı 159 Verilen Sipariş Avansları hesabında izlemiştir. 05.05.2026 tarihinde mal teslim alınmış ve fatura kesilmiştir. Ancak fatura tutarı beklenenden yüksek çıkmıştır: KDV hariç 150.000 TL, KDV %20 dahil toplam 180.000 TL. Avans tutarı (100.000 TL) faturadan düşülmüş, kalan 80.000 TL kredili olarak tedarikçinin cari hesabına kaydedilmiştir. KDV avans verilirken hesaplanmamış olup tüm KDV teslim tarihinde tahakkuk etmiştir.',
 '',
 '159 hesabı sıfırlanır (avansın tamamı kullanıldı), 320''ye yalnızca KALAN borç yazılır. Eğer avans fatura tutarından FAZLA olsaydı, fazla kısım için tedarikçiden iade alınır ya da 159''da bakiye kalır (ileride başka bir alımda kullanılmak üzere). Avansın KDV''si konusu: avans öderken KDV hesaplanmamışsa (uygulamada yaygın), tüm KDV teslim tarihinde 191''e yazılır.',
 'onayli', 'modul1-dokuman'),

-- ============= KONU 2: PEŞİN MAL SATIŞI (Soru 10-18) =============

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
 'İşletmemiz, 14.05.2026 tarihinde Beyaz İnci Mağazacılık A.Ş.''ye 4 adet televizyon satışı yapmıştır. KDV hariç birim fiyat 15.000 TL/adet, KDV oranı %20''dir. Satış bedelinin yarısı işletmemizin İş Bankası hesabına EFT ile, kalan yarısı kasamıza nakit olarak ödenmiştir.',
 '',
 'Tahsilat iki ayrı hesaba bölünür: 102 ve 100 ayrı satırlarda borç.',
 'onayli', 'modul1-dokuman'),

('mh13', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Satışta İskonto — Fatura Üzerinde',
 'orta',
 'İşletmemiz, 18.05.2026 tarihinde Demirsoy Mağazacılık A.Ş.''ye 10 adet fırın satışı yapmıştır. KDV hariç birim fiyat 9.000 TL/adet, fatura üzerinde %10 indirim uygulanmış ve indirim sonrası tutar üzerinden KDV (%20) hesaplanmıştır. Bedel banka hesabımıza EFT ile peşin tahsil edilmiştir.',
 '',
 'Fatura ÜZERİ iskonto, ayrı bir hesap (611) gerektirmez. Doğrudan net tutar 600''e yazılır. Ayrı 611 kaydı, satış sonrası verilen iskontolar içindir.',
 'onayli', 'modul1-dokuman'),

('mh14', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Satıştan İade — Banka İadesi',
 'orta',
 'İşletmemiz, 06.05.2026''da Akel Elektronik''e peşin sattığı 6 buzdolabından 1 tanesi 20.05.2026 tarihinde fonksiyon hatası nedeniyle iade edilmiştir. Birim fiyat KDV hariç 22.000 TL, KDV %20''dir. İade bedeli müşterinin banka hesabına EFT ile iade edilmiştir.',
 '',
 'Peşin satışta iade, kredili satıştaki iadeden farklıdır. Kredilide 120 azalır, peşinde para zaten alındığı için 102 (veya 100) azaltılır.',
 'onayli', 'modul1-dokuman'),

('mh15', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Kapora ile Peşin Satış',
 'orta',
 'İşletmemiz, 22.05.2026 tarihinde Mert Mağazacılık Ltd. Şti.''ye 3 adet çamaşır makinesi satmak üzere anlaşma yapmıştır. Müşteri, sipariş için 15.000 TL kapora ödemiş ve bu tutar banka hesabımıza yatırılmıştır. Aynı gün mal teslim edilmiş, fatura kesilmiş ve kalan bedel kasaya nakit olarak ödenmiştir. KDV hariç birim fiyat 14.000 TL/adet, KDV %20''dir. Bu kayıtta sadece teslim/fatura anını gösteriniz (kaporanın alındığı an ayrı bir kayıttı).',
 '',
 'Kaporanın alındığı an ayrıca bir kayıt yapılmıştı (340''a yatış). Bu kayıtta sadece teslim/fatura anı gösteriliyor; 340 hesabı sıfırlanıyor, kalan bedel nakitle tamamlanıyor.',
 'onayli', 'modul1-dokuman'),

('mh16', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Peşin Satıştan İade — Doğru KDV Kaydı',
 'zor',
 'İşletmemiz, 14.05.2026''da Beyaz İnci''ye peşin sattığı 4 televizyondan 1 adedi 25.05.2026 tarihinde iade edilmiştir. Birim fiyat KDV hariç 15.000 TL, KDV %20''dir. İade bedeli müşterinin banka hesabına EFT ile gönderilmiştir. KDV''yi doğru hesaba (391 Hesaplanan KDV, borç tarafı) yazınız — bu bir alım değil, satışın geri çevrilmesidir.',
 '',
 'İade işleminde KDV her zaman 391''i AZALTIR (borç tarafına yazılarak), çünkü o satışın KDV''si artık doğmamış sayılır. 191''e yazmak, sanki yeni bir alım yapılmış gibi gösterir ve hem 191 hem 391 yanlış şişer. Bu hatanın KDV beyannamesine etkisi büyüktür.',
 'onayli', 'modul1-dokuman'),

('mh17', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Avansın İade Edilmesi — Sipariş İptali',
 'zor',
 'İşletmemiz, 10.04.2026 tarihinde Yapıkent Mağazacılık A.Ş.''den 200.000 TL sipariş avansı almış ve 340 hesabına kaydetmiştir. Ancak müşteri, 30.05.2026 tarihinde siparişten vazgeçtiğini bildirmiştir. Sözleşme gereği işletmemiz, 200.000 TL avansın %10''unu (20.000 TL) cayma tazminatı olarak alıkoyma hakkına sahiptir. Kalan 180.000 TL müşteriye banka hesabına iade edilmiştir. Cayma tazminatı KDV''siz olarak "Diğer Olağan Gelirler" (649) hesabına yazılmıştır.',
 '',
 'Cayma tazminatı bir mal/hizmet karşılığı değildir, bir sözleşmenin ihlali nedeniyle alınan tazminattır. Bu nedenle KDV''siz olarak 649''a yazılır, satış olarak (600) yazılmaz. Eğer 600''e yazılırsa hem KDV doğar (yanlış), hem gelir yapısı bozulur.',
 'onayli', 'modul1-dokuman'),

('mh18', 'mal-alis-satis', 'mal-alis-satis-1-2',
 'Konsinye Mal Satışı — Komisyoncu Satınca',
 'zor',
 'İşletmemiz, 01.05.2026 tarihinde Aydın Mağazacılık Ltd. Şti.''ne konsinye (emanet) olarak 20 adet klima vermiştir. Konsinye anlaşmasına göre, malın mülkiyeti satılana kadar işletmemize aittir; bu nedenle teslim sırasında satış kaydı yapılmamıştır. 30.05.2026 tarihinde Aydın Mağazacılık, 12 adet klima sattığını ve kendine %10 komisyon ayırdığını bildirmiştir. Klimanın bizim satış fiyatımız KDV hariç 16.000 TL/adet, KDV %20''dir. Net tutar (komisyon düşülmüş hali) bizim banka hesabımıza EFT ile yatırılmıştır. Komisyon hizmeti için Aydın Mağazacılık ayrıca fatura kesmiştir (KDV %20). Bu kayıtta satış + komisyon hizmeti alımını tek yevmiyede birleştiriniz.',
 '',
 'Konsinye mal işleminde SATIŞ kaydı, malın TÜKETİCİYE/SON ALICIYA satıldığı anda yapılır (komisyoncuya verildiği anda DEĞİL). Komisyon, ayrı bir hizmet alımıdır ve 760 PSDG''ye yazılır, kendi KDV''si 191''e gider. Bu kayıt birden fazla işlemi (satış, komisyon hizmeti alımı, tahsilat) tek yevmiyede birleştiriyor — gerçek hayatta zorluğu burada.',
 'onayli', 'modul1-dokuman'),

-- ============= KONU 3: KREDİLİ MAL ALIMI (Soru 19-27) =============

('mh19', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Kredili Mal Alımı — Cari Hesap',
 'kolay',
 'İşletmemiz, 02.06.2026 tarihinde Arçelik A.Ş.''den 12 adet buzdolabı alımı yapmıştır. KDV hariç birim fiyat 19.000 TL/adet, KDV oranı %20''dir. Fatura bedelinin tamamı kredili olarak tedarikçinin cari hesabına kaydedilmiştir.',
 '',
 'Kredili alımda ödeme aracı yerine 320 Satıcılar (tedarikçi cari hesabı) alacaklanır.',
 'onayli', 'modul1-dokuman'),

('mh20', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Karma Ödemeli Alım — Yarısı Peşin Yarısı Kredili',
 'kolay',
 'İşletmemiz, 05.06.2026 tarihinde Vestel Ticaret A.Ş.''den 10 adet televizyon alımı yapmıştır. KDV hariç birim fiyat 13.000 TL/adet, KDV oranı %20''dir. Fatura bedelinin yarısı işletmemizin Garanti BBVA hesabından EFT ile peşin ödenmiş, kalan yarısı kredili olarak tedarikçinin cari hesabına kaydedilmiştir.',
 '',
 'Ödeme iki kaynağa bölünür: yarısı 102 (banka), yarısı 320 (cari).',
 'onayli', 'modul1-dokuman'),

('mh21', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Kredili Alım + Nakliye Peşin',
 'kolay',
 'İşletmemiz, 09.06.2026 tarihinde Bosch Ev Aletleri A.Ş.''den 6 adet bulaşık makinesi kredili olarak alımı yapmıştır. KDV hariç birim fiyat 16.000 TL/adet, KDV oranı %20''dir. Ayrıca, malzemelerin işletmemize taşınması için anlaşmalı nakliye firması Hızlı Lojistik Ltd. Şti.''ne 5.000 TL + KDV nakliye ücreti kasadan nakit olarak ödenmiş, nakliye bedeli mal maliyetine eklenmiştir.',
 '',
 'Nakliye gideri MAL ALIŞI sırasında doğmuşsa (alıma yönelik), 153''e eklenir. Eğer satış için bir taşıma giderine girilseydi, 760 Pazarlama-Satış-Dağıtım Giderleri''ne yazılırdı. KDV''ler 191''de birleşir.',
 'onayli', 'modul1-dokuman'),

('mh22', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Kredili Alım + Sonradan Alış İskontosu',
 'orta',
 'İşletmemiz, 02.06.2026''da Arçelik''ten kredili olarak satın aldığı buzdolabı sevkıyatından sonra, Arçelik tarafından 12.06.2026 tarihinde "sezon kampanyası" nedeniyle %3 alış iskontosu uygulandığı bildirilmiştir. Orijinal alış: KDV hariç 228.000 TL + 45.600 TL KDV = 273.600 TL. İskonto tutarı tedarikçinin cari hesabından düşülmüştür. Hem mal bedeli hem KDV iskontoya tabidir.',
 '',
 'Alış iskontosu, satış iskontosu gibi ayrı bir hesap (611) gerektirmez. Doğrudan 153 ve 191 hesapları AZALTILIR — çünkü mal sanki indirimli alınmış gibi düzeltme yapıyoruz. Bu, iadeyle aynı mantığı kullanır.',
 'onayli', 'modul1-dokuman'),

('mh23', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Verilen Sipariş Avansı — Mal Henüz Teslim Alınmadı',
 'orta',
 'İşletmemiz, 15.06.2026 tarihinde tedarikçimiz LG Electronics Türkiye A.Ş.''ye 50 adet klima sipariş etmiştir. Sözleşmeye göre sipariş için %30 avans ödenmesi gerekmektedir. Avans olarak 75.000 TL işletmemizin İş Bankası hesabından LG''ye EFT ile gönderilmiştir. Avans için fatura kesilmemiştir (yalnızca tahsilat makbuzu alınmıştır), mal henüz teslim alınmamıştır.',
 '',
 'Mal teslim alınmadığı ve fatura kesilmediği için 153 ve 191 hesapları HENÜZ çalıştırılmaz. 159 geçici bir hesaptır; ileride mal teslim alındığında bu hesap sıfırlanır ve 153/191/320 hesapları çalışır.',
 'onayli', 'modul1-dokuman'),

('mh24', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Kredili Alımdan Sonra Hasarlı Kısmen İade',
 'orta',
 'İşletmemiz, 05.06.2026''da Vestel''den kredili olarak 10 adet televizyon almıştı (KDV hariç 130.000 TL + 26.000 TL KDV). 20.06.2026 tarihinde nakliye sırasında 2 adedinin ekranlarının kırıldığı tespit edilmiş ve tedarikçiye iade edilmiştir. Hasar kısmen Vestel''in, kısmen nakliye firmasının sorumluluğunda olduğu için Vestel iade tutarının yarısını kabul etmiştir. 2 adedin TOPLAM bedeli (KDV dahil) 31.200 TL, Vestel''in kabul ettiği iade tutarı 15.600 TL''dir. Kabul edilen iade tedarikçinin cari hesabından düşülmüştür. Kabul edilmeyen 15.600 TL ise 157 Diğer Stoklar hesabına "Hasarlı/Sigortadan Tahsil Bekleyen" olarak alınmıştır.',
 '',
 '153 ve 191 tamamen azalır çünkü bu 2 adet artık stoğumuzda kullanılabilir değil. Vestel''in kabul ettiği kısım 320''den düşer. Kabul edilmeyen kısım 157''ye TASNİF edilir — nakliyeden tahsil edilince 157''den düşülür, banka çalışır. 157''nin içine KDV de dahil yazılır çünkü o KDV''yi tedarikçi ALMADI.',
 'onayli', 'modul1-dokuman'),

('mh25', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Yıl Sonu Ciro Primi — Tedarikçiden Gelen',
 'zor',
 'İşletmemiz, 2025 yılı boyunca tedarikçimiz Arçelik A.Ş.''den toplam 8.000.000 TL + KDV tutarında alım yapmıştır. Yıllık sözleşme gereği, 6.000.000 TL ciro barajını aştığımız için %1,5 ciro primi (yıl sonu iskontosu) hak ettik. Bu prim için 20.06.2026 tarihinde işletmemiz tarafından Arçelik''e gider faturası niteliğinde KDV''li bir fatura kesilmiş ve ciro primi tedarikçinin cari hesabından düşülmüştür. KDV oranı %20''dir.',
 '',
 'Ciro primi faturası bu sefer İŞLETMEMİZ tarafından kesilmiştir. Bu nedenle HESAPLANAN KDV (391) doğar, İNDİRİLECEK KDV değil. Ciro primi geliri 649''a yazılır, 600 satışlara YAZILMAZ — çünkü bu bir mal satışı değildir, bir gelir kalemi olarak ayrı tutulur. Alış iskontosu (153 düşüşü) ile karıştırılmamalıdır; ciro primi YIL SONUNDA toplu olarak gelir; alış iskontosu fatura bazında mal maliyetini etkiler.',
 'onayli', 'modul1-dokuman'),

('mh26', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Avans-Fatura Uyumsuzluğu — Avans Fatura Tutarından Fazla',
 'zor',
 'İşletmemiz, 15.06.2026 tarihinde tedarikçimiz LG Electronics''e verdiği 75.000 TL avansa karşılık, 22.06.2026 tarihinde mal teslim almıştır. Ancak fatura tutarı beklenenden DÜŞÜK çıkmıştır: KDV hariç 50.000 TL, KDV %20 dahil toplam 60.000 TL. Avans (75.000 TL) faturadan büyük olduğu için, faturanın tamamı avanstan mahsup edilmiş, kalan 15.000 TL ise tedarikçide alacak olarak bırakılmıştır (gelecek alımlarda kullanılacak şekilde 159''da kalır).',
 '',
 '159 hesabı TAMAMEN sıfırlanmaz; sadece fatura tutarı kadar düşülür. Kalan 15.000 TL, 159 muavin bakiyesinde DURUR ve gelecek alımlarda mahsup edilir veya tedarikçiden iadesi istenebilir. Bu kayıtta 320 hiç çalışmaz çünkü ek bir borç doğmadı — sadece avans kullanıldı. Avansın FAZLA olması ile EKSİK olması (Soru 9) arasındaki fark muhasebenin can damarıdır.',
 'onayli', 'modul1-dokuman'),

('mh27', 'mal-alis-satis', 'mal-alis-satis-1-3',
 'Hatalı Kesilen Alıştan İade Faturasının Düzeltilmesi',
 'zor',
 'İşletmemiz, 25.04.2026''da Vestel''den 3 adet televizyon iade etmişti (Soru 5). İade kaydında doğru tutarlar girilmişti, ancak iade FATURASI tedarikçi tarafından hatalı kesilmiş, KDV hariç 36.000 TL yerine 32.000 TL yazılmıştır (4.000 TL eksik). Hatalı fatura işletmemiz tarafından muhasebeleştirilmiş ve sonradan fark edilmiştir. 25.06.2026 tarihinde Vestel düzeltme faturası kesmiş ve eksik 4.000 TL + 800 TL KDV (toplam 4.800 TL) için ek bir iade kaydı yapılması gerekmiştir. Düzeltme tutarı tedarikçinin cari hesabından ek olarak düşülmüştür.',
 '',
 'Hatalı iade faturasını düzeltmek için iki yöntem vardır: (1) Tüm iadeyi iptal edip yeniden doğru tutarla kaydetmek, (2) Sadece farkı düzeltmek. İkinci yöntem (yukarıdaki kayıt) daha pratik ve KDV beyannamesini en az etkileyen yoldur. Önemli olan, iade faturası numarası ile bu düzeltme faturasının BAĞINTILI olduğunu açıklama satırında belirtmektir. BA-BS bildiriminde her ikisi de Vestel adına ayrı satırlar olarak gözükür.',
 'onayli', 'modul1-dokuman');

-- =====================================================================
-- 5. Cozumler — 27 sorunun yevmiye satırları
-- =====================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values

-- mh01: Peşin Alış — Banka (Arçelik buzdolabı, 10×18.000)
('mh01', 1, '153.001', 180000, 0),
('mh01', 2, '191.001', 36000, 0),
('mh01', 3, '102.001', 0, 216000),

-- mh02: Peşin Alış — Kasa (Vestel televizyon, 5×12.000)
('mh02', 1, '153.002', 60000, 0),
('mh02', 2, '191.001', 12000, 0),
('mh02', 3, '100.001', 0, 72000),

-- mh03: Karma Ödeme (Bosch bulaşık mak., 8×15.000)
('mh03', 1, '153.003', 120000, 0),
('mh03', 2, '191.001', 24000, 0),
('mh03', 3, '102.002', 0, 72000),
('mh03', 4, '100.001', 0, 72000),

-- mh04: Satıştan İade Sağlam (Çağdaş Elektronik 2 çam.mak., 2×14.000)
('mh04', 1, '610.005', 28000, 0),
('mh04', 2, '391.001', 5600, 0),
('mh04', 3, '120.003', 0, 33600),

-- mh05: Alıştan İade (Vestel 3 televizyon, 3×12.000)
('mh05', 1, '320.005', 43200, 0),
('mh05', 2, '153.002', 0, 36000),
('mh05', 3, '191.001', 0, 7200),

-- mh06: Satış İskontosu Erken Ödeme (Yıldız Mağazacılık 240k - %5 isk.)
('mh06', 1, '102.001', 228000, 0),
('mh06', 2, '611.001', 10000, 0),
('mh06', 3, '391.001', 2000, 0),
('mh06', 4, '120.008', 0, 240000),

-- mh07: Yıllık Ciro Primi Müşteriye (Demirören %2 × 5M)
('mh07', 1, '611.002', 100000, 0),
('mh07', 2, '191.001', 20000, 0),
('mh07', 3, '120.004', 0, 120000),

-- mh08: Hatalı Miktarda Mal (Samsung 3 klima eksik, 3×16.000)
('mh08', 1, '320.004', 57600, 0),
('mh08', 2, '153.004', 0, 48000),
('mh08', 3, '191.001', 0, 9600),

-- mh09: Avans-Fatura Az (LG 150k mal, 100k avans + 80k kredi)
('mh09', 1, '153.004', 150000, 0),
('mh09', 2, '191.001', 30000, 0),
('mh09', 3, '159.001', 0, 100000),
('mh09', 4, '320.003', 0, 80000),

-- mh10: Peşin Satış Banka (Akel buzdolabı, 6×22.000)
('mh10', 1, '102.001', 158400, 0),
('mh10', 2, '600.001', 0, 132000),
('mh10', 3, '391.001', 0, 26400),

-- mh11: Peşin Satış Kasa (son tüketici bulaşık mak., 18.000)
('mh11', 1, '100.001', 21600, 0),
('mh11', 2, '600.003', 0, 18000),
('mh11', 3, '391.001', 0, 3600),

-- mh12: Peşin Satış Karma (Beyaz İnci 4 televizyon, 4×15.000)
('mh12', 1, '102.002', 36000, 0),
('mh12', 2, '100.001', 36000, 0),
('mh12', 3, '600.002', 0, 60000),
('mh12', 4, '391.001', 0, 12000),

-- mh13: Peşin Satışta İskonto Fatura (Demirsoy 10 fırın, 90k - %10 isk = 81k)
('mh13', 1, '102.001', 97200, 0),
('mh13', 2, '600.006', 0, 81000),
('mh13', 3, '391.001', 0, 16200),

-- mh14: Peşin Satıştan İade Banka (Akel 1 buzdolabı, 22.000)
('mh14', 1, '610.001', 22000, 0),
('mh14', 2, '391.001', 4400, 0),
('mh14', 3, '102.001', 0, 26400),

-- mh15: Kapora ile Peşin Satış (Mert 3 çam.mak., 3×14.000, 15k kapora + 35.4k kasa)
('mh15', 1, '340.001', 15000, 0),
('mh15', 2, '100.001', 35400, 0),
('mh15', 3, '600.005', 0, 42000),
('mh15', 4, '391.001', 0, 8400),

-- mh16: Peşin Satıştan İade Doğru KDV (Beyaz İnci 1 televizyon, 15.000)
('mh16', 1, '610.002', 15000, 0),
('mh16', 2, '391.001', 3000, 0),
('mh16', 3, '102.001', 0, 18000),

-- mh17: Avansın İadesi Cayma (Yapıkent 200k avans, 20k tazminat + 180k iade)
('mh17', 1, '340.002', 200000, 0),
('mh17', 2, '102.001', 0, 180000),
('mh17', 3, '649.001', 0, 20000),

-- mh18: Konsinye Mal Satışı (Aydın 12 klima, 192k - %10 kom., komisyon ayrı)
('mh18', 1, '102.001', 207360, 0),
('mh18', 2, '760.001', 19200, 0),
('mh18', 3, '191.001', 3840, 0),
('mh18', 4, '600.004', 0, 192000),
('mh18', 5, '391.001', 0, 38400),

-- mh19: Kredili Alım (Arçelik 12 buzdolabı, 12×19.000)
('mh19', 1, '153.001', 228000, 0),
('mh19', 2, '191.001', 45600, 0),
('mh19', 3, '320.001', 0, 273600),

-- mh20: Karma Ödemeli Alım (Vestel 10 televizyon, 10×13.000, ½ banka ½ kredi)
('mh20', 1, '153.002', 130000, 0),
('mh20', 2, '191.001', 26000, 0),
('mh20', 3, '102.001', 0, 78000),
('mh20', 4, '320.005', 0, 78000),

-- mh21: Kredili Alım + Nakliye (Bosch 6 bulaşık mak., 96k mal + 5k nakliye)
('mh21', 1, '153.003', 101000, 0),
('mh21', 2, '191.001', 20200, 0),
('mh21', 3, '320.002', 0, 115200),
('mh21', 4, '100.001', 0, 6000),

-- mh22: Sonradan Alış İskontosu (Arçelik %3 × 228k = 6.840 + KDV 1.368)
('mh22', 1, '320.001', 8208, 0),
('mh22', 2, '153.001', 0, 6840),
('mh22', 3, '191.001', 0, 1368),

-- mh23: Verilen Sipariş Avansı (LG 75k avans, bankadan EFT)
('mh23', 1, '159.001', 75000, 0),
('mh23', 2, '102.002', 0, 75000),

-- mh24: Hasarlı Kısmen İade (Vestel 2 televizyon, ½ kabul / ½ sigorta)
('mh24', 1, '320.005', 15600, 0),
('mh24', 2, '157.001', 15600, 0),
('mh24', 3, '153.002', 0, 26000),
('mh24', 4, '191.001', 0, 5200),

-- mh25: Yıl Sonu Ciro Primi Tedarikçiden (Arçelik %1.5 × 8M = 120k + 24k KDV)
('mh25', 1, '320.001', 144000, 0),
('mh25', 2, '649.002', 0, 120000),
('mh25', 3, '391.001', 0, 24000),

-- mh26: Avans-Fatura Fazla (LG 50k mal, 60k avans mahsup)
('mh26', 1, '153.004', 50000, 0),
('mh26', 2, '191.001', 10000, 0),
('mh26', 3, '159.001', 0, 60000),

-- mh27: İade Faturası Düzeltmesi (Vestel 4k mal + 800 KDV ek iade)
('mh27', 1, '320.005', 4800, 0),
('mh27', 2, '153.002', 0, 4000),
('mh27', 3, '191.001', 0, 800);

commit;

notify pgrst, 'reload schema';
