-- Modül 1 — Bölüm 2: 59 yeni soru (Modul_1_Bolum_2.docx)
--
-- Konu 4-13 için her konuya 6 soru (toplam 60 — S50 nazım hesap olduğu
-- için atlandı, 59 soru eklenir). ID'ler mh28-mh86 sıralı.
--
-- Notlar:
--  - S50 (Bosch konsinye alma) atlandı — nazım hesap (910/911) bizim
--    hesap planımızda yok.
--  - S55, S57, S59 numune kayıtları dengesizdi (760'a sadece mal bedeli,
--    KDV alacak tarafında). Düzeltildi: 760'a mal + emsal KDV birlikte.
--  - Konsinye muavin transferi için 2 yeni 153 muavini eklendi.

begin;

-- =====================================================================
-- Ek muavinler (konsinye için)
-- =====================================================================
insert into muavin_hesaplar (kod, ana_kod, ad, tip, sira) values
  ('153.011', '153', 'Konsinye Mallar – Bayide (Fırın)', 'stok', 11),
  ('153.012', '153', 'Konsinye Mallar – Bayide (Klima Salon)', 'stok', 12)
on conflict (kod) do update set ad = excluded.ad;

-- =====================================================================
-- 59 soru
-- =====================================================================
insert into sorular (id, unite_id, alt_baslik_id, baslik, zorluk, senaryo, ipucu, aciklama, durum, kaynak) values

-- ========= KONU 4: KREDİLİ MAL SATIŞI (mh28-mh33) =========
('mh28', 'mal-alis-satis', 'mal-alis-satis-1-4',
 'Kredili Satış — Tek Müşteri Cari Hesap', 'kolay',
 'İşletmemiz, 03.07.2026 tarihinde Çağdaş Elektronik Ltd. Şti.''ne 8 adet LED 50" televizyon satışı yapmıştır. KDV hariç birim fiyat 15.000 TL/adet, KDV oranı %20''dir. Satış bedelinin tamamı kredili olarak müşterinin cari hesabına kaydedilmiştir.',
 '',
 'Kredili satışta 120 Alıcılar borç (cari hesap), 600 hasılat ve 391 KDV alacak. Mal cinsi muavinine (TV LED 50") ve müşteri muavinine dikkat.',
 'onayli', 'modul1-bolum2'),

('mh29', 'mal-alis-satis', 'mal-alis-satis-1-4',
 'Kredili Satış — Farklı Müşteri', 'kolay',
 'İşletmemiz, 09.07.2026 tarihinde Yapıkent Mağazacılık A.Ş.''ne 5 adet ankastre fırın satışı yapmıştır. KDV hariç birim fiyat 9.000 TL/adet, KDV oranı %20''dir. Satış bedelinin tamamı kredili olarak müşterinin cari hesabına kaydedilmiştir.',
 '',
 'Müşteri muavinine ve mal cinsi muavinine (Fırın Ankastre) dikkat.',
 'onayli', 'modul1-bolum2'),

('mh30', 'mal-alis-satis', 'mal-alis-satis-1-4',
 'Karma Tahsilatlı Satış — Peşin Banka + Kredili', 'orta',
 'İşletmemiz, 14.07.2026 tarihinde Akel Elektronik Ltd. Şti.''ne 6 adet split klima satışı yapmıştır. KDV hariç birim fiyat 12.000 TL/adet, KDV oranı %20''dir. Toplam fatura tutarının %40''ı müşteri tarafından Akbank TL hesabımıza EFT ile peşin tahsil edilmiş, kalan %60''lık kısım kredili olarak müşterinin cari hesabına kaydedilmiştir.',
 '',
 'Peşin kısım banka muavinine (Akbank), kredili kısım müşteri muavinine (Akel) yazılır. 120''ye yalnızca KALAN tutar gelir.',
 'onayli', 'modul1-bolum2'),

('mh31', 'mal-alis-satis', 'mal-alis-satis-1-4',
 'Kredili Satıştan Kısmi İade', 'orta',
 'İşletmemiz, 03.07.2026''da Çağdaş Elektronik''e kredili olarak satmış olduğu 8 adet LED 50" televizyondan 2 adedi 18.07.2026 tarihinde fonksiyon hatası nedeniyle iade edilmiştir. Satışın birim fiyatı KDV hariç 15.000 TL/adet, KDV %20''dir. İade tutarı müşterinin cari hesabından düşülmüştür.',
 '',
 'Kredili satıştan iadede para çıkışı yoktur; sadece 120 azalır. İade KDV''si 391''i azaltır (borçlandırılır).',
 'onayli', 'modul1-bolum2'),

('mh32', 'mal-alis-satis', 'mal-alis-satis-1-4',
 'Şüpheli Alacak Haline Gelen Kredili Satış', 'zor',
 'İşletmemiz, 12.04.2026 tarihinde Demirören Elektronik A.Ş.''ye 180.000 TL + KDV tutarında kredili klima satışı yapmıştır (toplam 216.000 TL). Müşteri 90 günü aşkın süredir ödeme yapmamış olup, 22.07.2026 tarihinde işletmemiz dava açma yoluna gitmiş ve alacağı 128 Şüpheli Ticari Alacaklar hesabına aktarmıştır. (Karşılık ayırma kaydı bu kayıtta DEĞİL — sadece alacağın 128''e aktarımını gösteriniz.) KDV dahil tutar aktarılır.',
 '',
 'Dava/icra ya da 90 günü aşmış tahsil edilemeyen alacaklar VUK md. 323''e göre "şüpheli" sayılır. 120''den 128''e KDV dahil tutar aktarılır.',
 'onayli', 'modul1-bolum2'),

('mh33', 'mal-alis-satis', 'mal-alis-satis-1-4',
 'Hatalı Kesilen Satış Faturası — Fiyat Farkı Düzeltmesi', 'zor',
 'İşletmemiz, 25.07.2026 tarihinde Yıldız Mağazacılık A.Ş.''ye kredili olarak 10 adet kurutma makinesi satışı yapmıştır. Fatura kesilirken birim fiyat yanlışlıkla 11.000 TL yerine 9.000 TL olarak yazılmıştır. Doğru fiyat 11.000 TL/adet olup, KDV %20''dir. Hata 28.07.2026''da fark edilmiş ve düzeltme faturası kesilerek eksik fiyat farkı (10 × 2.000 = 20.000 TL + 4.000 TL KDV) müşterinin cari hesabına eklenmiştir.',
 '',
 'Hatalı fatura iki yöntemle düzeltilir: tüm faturayı iptal + yeniden, veya sadece farkı düzeltmek. Pratikte ikinci yöntem tercih edilir.',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 5: SATIŞTAN İADE (mh34-mh39) =========
('mh34', 'mal-alis-satis', 'mal-alis-satis-1-5',
 'Kredili Satıştan İade — Sağlam Mal', 'kolay',
 'İşletmemiz, daha önce Mert Mağazacılık Ltd. Şti.''ne kredili olarak satmış olduğu 4 adet bulaşık makinesinden 1 adedi 02.08.2026 tarihinde müşteri tarafından iade edilmiştir. Satışın birim fiyatı KDV hariç 13.000 TL, KDV %20''dir. İade edilen mal sağlam olup tekrar satılmak üzere depoya alınmıştır.',
 '',
 'Kredili iadede 120 azalır. İade muavini mal cinsine göre (Bulaşık Makinesi).',
 'onayli', 'modul1-bolum2'),

('mh35', 'mal-alis-satis', 'mal-alis-satis-1-5',
 'Peşin Satıştan İade — Banka İadesi', 'kolay',
 'İşletmemiz, daha önce peşin olarak Beyaz İnci Mağazacılık A.Ş.''ye sattığı 3 adet split klimadan 1 adedi 08.08.2026 tarihinde iade edilmiştir. Birim fiyat KDV hariç 12.000 TL, KDV %20''dir. İade bedeli müşterinin Yapı Kredi hesabına EFT ile geri ödenmiştir.',
 '',
 'Peşin iadede para çıkışı var: banka azalır (alacak). İade muavini Klima.',
 'onayli', 'modul1-bolum2'),

('mh36', 'mal-alis-satis', 'mal-alis-satis-1-5',
 'İskontolu Satıştan İade — İndirimli Fiyat Üzerinden', 'orta',
 'İşletmemiz, 15.07.2026 tarihinde Akel Elektronik Ltd. Şti.''ne kredili olarak 10 adet ankastre fırın satışı yapmıştı. Faturada %10 indirim uygulanmış, KDV hariç birim 9.000 TL''den fatura iskontosu sonrası 8.100 TL''ye düşmüştü. 12.08.2026 tarihinde müşteri 2 adet fırını iade etmiştir. İade işleminde İNDİRİMLİ fiyat (8.100 TL) baz alınmıştır. KDV %20''dir.',
 '',
 'Fatura üzeri iskonto faturanın TOPLAM tutarını etkilediği için iade de indirimli fiyat üzerinden yapılır. Brüt fiyat üzerinden iade yanlış olur.',
 'onayli', 'modul1-bolum2'),

('mh37', 'mal-alis-satis', 'mal-alis-satis-1-5',
 'Hasarlı Satıştan İade — Satılabilir Olmayan Mal', 'orta',
 'İşletmemiz, daha önce Demirsoy Mağazacılık A.Ş.''ye kredili olarak satmış olduğu 5 adet kurutma makinesinden 1 adedi nakliye sırasında hasar gördüğü için 18.08.2026 tarihinde iade edilmiştir. Birim fiyat KDV hariç 14.000 TL, KDV %20''dir. Mal hasarlı olduğu için tekrar satılamayacak durumda olup 157 Diğer Stoklar hesabına (Sigortadan Tahsil Bekleyen) alınmıştır.',
 '',
 'Hasarlı mal 153''e geri konmaz, 157''ye tasnif edilir. 153 azalır (satılabilir stoktan çıktı), 157 artar (sigorta tahsil bekleyen). 610 ve 391 iade tarafında çalışır.',
 'onayli', 'modul1-bolum2'),

('mh38', 'mal-alis-satis', 'mal-alis-satis-1-5',
 'Önceki Dönem Satışından İade', 'zor',
 'İşletmemiz, 28.12.2025 tarihinde Yıldız Mağazacılık A.Ş.''ye kredili olarak 8 adet split klima satmıştı (KDV hariç birim 11.000 TL). Bu satış 2025 KDV beyannamesinde yer almıştır. 22.08.2026 tarihinde müşteri 3 adet klimayı iade etmiştir. İade kaydı 2026 dönemine düşmektedir. KDV %20''dir.',
 '',
 'Önceki dönemin satışından iade, CARİ dönem KDV beyannamesinde indirim olarak yer alır. 2025 düzeltilmez. 610 ve 391 2026''ya kayıtlanır.',
 'onayli', 'modul1-bolum2'),

('mh39', 'mal-alis-satis', 'mal-alis-satis-1-5',
 'İskontolu Satıştan İade + Yeni Sipariş Kaporası', 'zor',
 'İşletmemiz, Yapıkent Mağazacılık A.Ş.''ne 10.08.2026''da kredili olarak 15 adet televizyon (LED 50") satışı yapmıştır (KDV hariç birim 13.000 TL, fatura üzeri %5 iskonto sonrası birim 12.350 TL). 25.08.2026 tarihinde müşteri 4 adet televizyonu iade etmiş ve aynı gün başka bir siparişten doğan 25.000 TL''lik mahsuplaşma talep etmiştir. İade tutarı önce cari hesaptan düşülmüş, ardından yeni siparişin kaporası olarak 25.000 TL 340 muavinine aktarılmıştır. Kalan tutar cari hesapta alacak bakiyesi.',
 '',
 'İade tutarı 59.280 TL''nin 25.000''i kapora olarak 340''a aktarılır, kalan 34.280 cari hesaba (alacak) gider.',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 6: ALIŞTAN İADE (mh40-mh45) =========
('mh40', 'mal-alis-satis', 'mal-alis-satis-1-6',
 'Kredili Alıştan İade — Hatalı Mal', 'kolay',
 'İşletmemiz, daha önce Bosch Ev Aletleri A.Ş.''den kredili olarak satın aldığı 6 adet bulaşık makinesinden 1 adedinin fonksiyon hatası olduğu tespit edilmiş ve 04.09.2026 tarihinde tedarikçiye iade edilmiştir. Alış birim fiyatı KDV hariç 15.000 TL, KDV %20''dir.',
 '',
 'Alıştan iadede 153 ve 191 azaltılır (mal hiç alınmamış sayılır), 320 azalır.',
 'onayli', 'modul1-bolum2'),

('mh41', 'mal-alis-satis', 'mal-alis-satis-1-6',
 'Peşin Alıştan İade — Banka Tahsilatı', 'kolay',
 'İşletmemiz, daha önce Vestel Ticaret A.Ş.''den peşin olarak satın aldığı 10 adet 32" LED televizyondan 2 adedinin ekran hatası olduğu tespit edilmiş ve 11.09.2026 tarihinde tedarikçiye iade edilmiştir. Alış birim fiyatı KDV hariç 8.000 TL, KDV %20''dir. İade bedeli tedarikçi tarafından işletmemizin Garanti BBVA hesabına EFT ile geri ödenmiştir.',
 '',
 'Peşin iadede banka borçlu (para girişi), 153 ve 191 alacak. TV LED 32" muavinine dikkat.',
 'onayli', 'modul1-bolum2'),

('mh42', 'mal-alis-satis', 'mal-alis-satis-1-6',
 'Karma Tahsilatlı Alımdan İade — Bölüştürme', 'orta',
 'İşletmemiz, daha önce Samsung Elektronik Türkiye A.Ş.''den 15 adet salon tipi klima alımı yapmıştı (KDV hariç birim 17.000 TL). Alımın yarısı peşin olarak Ziraat Bankası hesabımızdan ödenmiş, yarısı kredili olarak cari hesaba kaydedilmişti. 16.09.2026 tarihinde 3 adet klimanın hatalı olduğu tespit edilmiş ve tedarikçiye iade edilmiştir. İade tutarının yarısı bankaya iade alınmış, yarısı tedarikçinin cari hesabından düşülmüştür. KDV %20''dir.',
 '',
 'Alım nasıl yapıldıysa iade de aynı oranlarda yapılır. ½ banka (Ziraat) ½ cari (Samsung).',
 'onayli', 'modul1-bolum2'),

('mh43', 'mal-alis-satis', 'mal-alis-satis-1-6',
 'Alıştan İade — Farklı KDV Oranlı Mal', 'orta',
 'İşletmemiz, 28.08.2026''da Arçelik A.Ş.''den 20 adet No-Frost buzdolabı alımı yapmıştır (KDV hariç birim 19.000 TL). Bu buzdolabı modeli %10 indirimli KDV grubuna girer (özel düzenleme). 20.09.2026 tarihinde 2 adet hatalı çıkan buzdolabı tedarikçiye iade edilmiştir. KDV oranı %10''dur.',
 '',
 'KDV %20 dışında olan mallar için 191''in doğru muavin oranı kullanılır (191.002 = %10).',
 'onayli', 'modul1-bolum2'),

('mh44', 'mal-alis-satis', 'mal-alis-satis-1-6',
 'Alıştan İade + Nakliye Tedarikçiden Tahsil', 'zor',
 'İşletmemiz, daha önce LG Electronics Türkiye A.Ş.''den kredili olarak 10 adet split klima almıştır (KDV hariç birim 13.000 TL). 25.09.2026 tarihinde 2 adet klima hatalı çıktığı için tedarikçiye iade edilmiştir. Hatalı mal iadesi olduğu için nakliye masrafını LG karşılayacaktır; nakliye bedeli 3.000 TL + 600 KDV = 3.600 TL kasadan ödendi ve aynı anda LG cari hesabına alacak yazıldı. Net etki: nakliye giderimiz sıfır, LG''den toplam (iade + nakliye) tahsil edilecek. KDV %20''dir.',
 '',
 'Nakliye giderimiz sıfır netleşir (ödendi + LG yansıttık). 320''nin borç tutarı = iade tutarı (31.200) + nakliye (3.600) = 34.800. Mal ve KDV iade kaydı normal.',
 'onayli', 'modul1-bolum2'),

('mh45', 'mal-alis-satis', 'mal-alis-satis-1-6',
 'Avansla Yapılan Alımdan İade', 'zor',
 'İşletmemiz, 10.07.2026''da Samsung Elektronik Türkiye A.Ş.''ye 100.000 TL klima sipariş avansı vermişti. 05.08.2026''da 8 adet salon tipi klima teslim alınmış ve fatura kesilmişti (KDV hariç 90.000 TL + 18.000 KDV). Avans mahsup edilmiş, kalan 8.000 TL kredili 320''ye yazılmıştı. Şimdi 28.09.2026 tarihinde, 2 adet klima üretim hatası nedeniyle tedarikçiye iade edilmiştir. İade tutarının 8.000 TL''lik kısmı cari hesap borcumuzdan düşülmüş, kalanı Akbank hesabımıza iade alınmıştır.',
 '',
 'İade 27.000 TL, cari borcumuz 8.000 → önce cari sıfırlanır, kalan 19.000 bankaya iade. 159 hareket etmez (mal tesliminde kapanmıştı).',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 7: SATIŞ İSKONTOSU (mh46-mh51) =========
('mh46', 'mal-alis-satis', 'mal-alis-satis-1-7',
 'Erken Ödeme İskontosu — Tahsilatla Birlikte', 'kolay',
 'İşletmemiz, daha önce Çağdaş Elektronik Ltd. Şti.''ne kredili olarak satmış olduğu 120.000 TL + KDV tutarındaki (toplam 144.000 TL) klima satışı için, müşterinin erken ödeme yapması durumunda %3 iskonto uygulayacağını taahhüt etmiştir. Müşteri 06.10.2026 tarihinde İş Bankası hesabımıza erken ödeme yapmış ve iskonto faturası kesilmiştir. İskontoya KDV (%20) uygulanmıştır.',
 '',
 '611 Satış İskontoları borç (satışı azaltır), banka borç (tahsilat), 391 borç (KDV düşer), 120 alacak (kapanır).',
 'onayli', 'modul1-bolum2'),

('mh47', 'mal-alis-satis', 'mal-alis-satis-1-7',
 'Sezonluk Kampanya İskontosu — Sonradan Uygulanan', 'kolay',
 'İşletmemiz, Akel Elektronik Ltd. Şti.''ne daha önce kredili olarak satmış olduğu 200.000 TL + KDV tutarındaki bulaşık makinesi satışına 13.10.2026 tarihinde sezon sonu kampanyası kapsamında %5 iskonto uygulamıştır. İskonto faturası kesilmiş ve müşterinin cari hesabından düşülmüştür. KDV %20''dir.',
 '',
 'Sonradan uygulanan iskonto 611 muavin "Sezonluk Kampanya"ya gider. 120 azalır.',
 'onayli', 'modul1-bolum2'),

('mh48', 'mal-alis-satis', 'mal-alis-satis-1-7',
 'İskonto + Kısmi Tahsilat — Cari Hesapta Bakiye', 'orta',
 'İşletmemiz, Mert Mağazacılık Ltd. Şti.''ne kredili 300.000 TL + KDV (toplam 360.000 TL) çamaşır makinesi satışı için, müşteri 19.10.2026''da Garanti BBVA hesabımıza 200.000 TL göndermiştir. Sözleşme gereği toplam satış matrahına %2 erken ödeme iskontosu uygulanmıştır. KDV %20''dir.',
 '',
 'İskonto matrahı toplam mal bedeli (300.000) baz alınır (sözleşme öyle). Tahsil edilen + iskonto 120''den düşer, kalan bakiye 120''de durur.',
 'onayli', 'modul1-bolum2'),

('mh49', 'mal-alis-satis', 'mal-alis-satis-1-7',
 'Yıllık Ciro Primi — Müşteri Faturası', 'orta',
 'İşletmemiz, 2025 yılı boyunca Beyaz İnci Mağazacılık A.Ş.''ye toplam 4.500.000 TL + KDV satış gerçekleştirmiştir. Müşteri 4.000.000 TL ciro barajını aştığı için %1,5 ciro primi (yıl sonu iskontosu) hak etmiştir. 25.10.2026''da müşteri tarafından kesilen gider faturası işletmemize ulaşmıştır. KDV %20''dir.',
 '',
 'Müşterinin kestiği fatura → KDV İNDİRİLECEK (191), HESAPLANAN değil. 611 borç.',
 'onayli', 'modul1-bolum2'),

('mh50', 'mal-alis-satis', 'mal-alis-satis-1-7',
 'Brüt-Net İskonto Hata Düzeltmesi', 'zor',
 'İşletmemiz, Demirsoy Mağazacılık A.Ş.''ye 02.10.2026''da kredili 250.000 TL + KDV satış yapmıştı. Müşteri 28.10.2026''da Yapı Kredi hesabımıza ödeme yapınca %3 iskonto uygulanmıştır. Ancak muhasebeci hatalı hesap yapmış: iskontoyu KDV DAHİL 300.000 üzerinden = 9.000 TL hesaplamış (doğrusu KDV HARİÇ 250.000 üzerinden = 7.500 TL). Fark 1.500 TL mal + 300 TL KDV = 1.800 TL FAZLA iskonto. 28.10.2026''da DÜZELTME kaydı yapılmıştır (yalnızca düzeltme).',
 '',
 'İskonto matrahı her zaman KDV HARİÇ tutardır. Düzeltmede ters yön: 120 borç (alacak artırılır), 611 ve 391 alacak (azaltılır).',
 'onayli', 'modul1-bolum2'),

('mh51', 'mal-alis-satis', 'mal-alis-satis-1-7',
 'Önceki Dönem Ciro Primi — Geç Kesilen', 'zor',
 'İşletmemiz, 2024 yılı satışları için Yıldız Mağazacılık A.Ş.''ye ciro primi taahhüt etmiş, ancak yıl sonu hesaplaması gecikmiş ve fatura 30.10.2026''da kesilmiştir. 2024 toplam satış 3.000.000 TL + KDV, %2 ciro primi 60.000 TL + 12.000 KDV. Faturayı Yıldız kesmiştir (gider faturası). KDV %20.',
 '',
 '2024 ciro primi 2026''da kayda alındığında, 611 CARİ dönem (2026) satışlarını azaltır. KDV indirilecekte. Açıklamada hangi yılı kapsadığı belirtilmelidir.',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 8: ALIŞ İSKONTOSU (mh52-mh57) =========
('mh52', 'mal-alis-satis', 'mal-alis-satis-1-8',
 'Sezonluk Kampanya Alış İskontosu', 'kolay',
 'İşletmemiz, daha önce Arçelik A.Ş.''den kredili olarak satın aldığı 240.000 TL + KDV buzdolabı alımı için, tedarikçinin uyguladığı %4 sezon kampanyası iskontosu kapsamında 04.11.2026 tarihinde iskonto bildirimi gelmiş ve cari hesabımızdan düşülmüştür. KDV %20''dir.',
 '',
 'Alış iskontosu ayrı hesap (611 gibi) gerektirmez. Doğrudan 153 ve 191 azaltılır.',
 'onayli', 'modul1-bolum2'),

('mh53', 'mal-alis-satis', 'mal-alis-satis-1-8',
 'Erken Ödeme Alış İskontosu', 'kolay',
 'İşletmemiz, Vestel Ticaret A.Ş.''ye olan 180.000 TL + KDV (toplam 216.000 TL) kredili borcunu, erken ödeme yaparak %2 iskontodan yararlanmıştır. 11.11.2026''da Yapı Kredi hesabımızdan net tutar Vestel''e EFT ile gönderilmiştir. Mal: TV LED 50". KDV %20''dir.',
 '',
 '320 sıfırlanır (216.000), 153 ve 191 iskonto kadar azalır, banka iskonto sonrası net (211.680) ödenir.',
 'onayli', 'modul1-bolum2'),

('mh54', 'mal-alis-satis', 'mal-alis-satis-1-8',
 'Tedarikçiden Yıllık Ciro Primi — Bizim Faturamız', 'orta',
 'İşletmemiz, 2025 yılı boyunca Bosch Ev Aletleri A.Ş.''den toplam 6.000.000 TL + KDV alım yapmıştır. 5.000.000 TL alım barajını aştığı için %1 ciro primi hak ettik. 17.11.2026''da işletmemiz tarafından Bosch''a gelir niteliğinde ciro primi faturası kesilmiş ve cari hesaptan düşülmüştür. KDV %20''dir.',
 '',
 'Faturayı biz kestik → 391 (HESAPLANAN). Ciro primi GELİRDIR, 153''ü azaltmaz; 649''a yazılır.',
 'onayli', 'modul1-bolum2'),

('mh55', 'mal-alis-satis', 'mal-alis-satis-1-8',
 'Karma Alış İskontosu — Sezon + Erken Ödeme', 'orta',
 'İşletmemiz, Samsung Elektronik Türkiye A.Ş.''den 150.000 TL + KDV klima alımı yapmıştır. Tedarikçi iki ayrı iskonto uygulamıştır: %3 sezon kampanyası + %2 erken ödeme (bileşik DEĞİL, ayrı ayrı). 24.11.2026''da Ziraat Bankası hesabımızdan net tutar EFT ile gönderilmiştir. Mal: Klima Split. KDV %20''dir.',
 '',
 'İki iskonto AYRI uygulandığında matrah orijinal mal bedeli (150.000). Toplam mal iskontosu 5%×150k=7.500 TL.',
 'onayli', 'modul1-bolum2'),

('mh56', 'mal-alis-satis', 'mal-alis-satis-1-8',
 'Alış İskontosu Sonrası İade — Çift Düzeltme', 'zor',
 'İşletmemiz, 06.11.2026''da LG Electronics''ten 100.000 TL + KDV kredili split klima almıştır. Aynı gün %5 sezon iskontosu uygulanmış, indirimli birim 9.500 TL''ye düşmüştür. 29.11.2026''da 3 adet klimanın hatalı çıktığı tespit edilmiştir. İade indirimli birim üzerinden yapılır. KDV %20''dir.',
 '',
 'Alış iskontosu uygulandıysa iade de indirimli fiyat üzerinden. Brüt fiyatla iade 153 ve 191''i yanlış düşürür.',
 'onayli', 'modul1-bolum2'),

('mh57', 'mal-alis-satis', 'mal-alis-satis-1-8',
 'Kaçırılan Alış İskontosu — Sonradan Tahakkuk', 'zor',
 'İşletmemiz, 15.09.2026''da Arçelik A.Ş.''den 500.000 TL + KDV kredili buzdolabı alımı yapmıştır. Sözleşmeye göre %3 sezon iskontosu otomatik olmalıydı ama muhasebeci tarafından KAÇIRILMIŞ ve fatura tam tutardan kaydedilmiştir. 03.12.2026 tarihinde hata fark edilmiş ve Arçelik ile mutabakat sağlanarak iskonto faturası kesilmiştir. İskonto matrahı 500.000 TL, KDV %20''dir.',
 '',
 'Standart alış iskontosu düzeltme kaydı: 153 ve 191 azaltılır, 320 azaltılır.',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 9: FİYAT FARKI FATURASI (mh58-mh63) =========
('mh58', 'mal-alis-satis', 'mal-alis-satis-1-9',
 'Sonradan Gelen Fiyat Farkı Faturası — Alımda Artış', 'kolay',
 'İşletmemiz, 28.11.2026''da Bosch Ev Aletleri A.Ş.''den 10 adet bulaşık makinesi kredili almıştır (KDV hariç birim 14.000 TL). Tedarikçi 09.12.2026 tarihinde birim başına 500 TL fiyat farkı faturası kesmiştir (hammadde maliyeti artışı). Fark cari hesabımıza ek borç olarak yazılır. KDV %20''dir.',
 '',
 'Fiyat farkı 153''e ek olarak yazılır (mal maliyeti artar), 191 KDV indirilecek, 320 cari ek borç.',
 'onayli', 'modul1-bolum2'),

('mh59', 'mal-alis-satis', 'mal-alis-satis-1-9',
 'Satışta Sonradan Fiyat Farkı — Müşteriye Yansıtma', 'kolay',
 'İşletmemiz, 30.11.2026''da Yıldız Mağazacılık A.Ş.''ne 8 adet split klima kredili satmıştır (KDV hariç birim 12.000 TL). 16.12.2026''da döviz kuru artışı nedeniyle birim başına 800 TL fiyat farkı faturası kesilmiştir. Fark cari hesaba ek alacak. KDV %20''dir.',
 '',
 'Satış fiyat farkı 600''e ek satış olarak yazılır, 391 KDV, 120 ek borç.',
 'onayli', 'modul1-bolum2'),

('mh60', 'mal-alis-satis', 'mal-alis-satis-1-9',
 'Negatif Fiyat Farkı — Fiyat Düşüşü Yansıtması', 'orta',
 'İşletmemiz, 01.12.2026''da Demirören Elektronik A.Ş.''ne 20 adet kurutma makinesi kredili satmıştır (KDV hariç birim 16.000 TL). Sözleşmede "piyasa düşüşü olursa fiyat geriye dönük güncellenir" maddesi bulunduğu için 22.12.2026''da birim başına 1.000 TL negatif fiyat farkı faturası kesilmiştir. Fark cari hesaptan düşülmüştür. KDV %20''dir.',
 '',
 'Negatif fiyat farkı 611 Satış İskontoları gibi işlenir (Sezonluk Kampanya muavini), 600''e değil.',
 'onayli', 'modul1-bolum2'),

('mh61', 'mal-alis-satis', 'mal-alis-satis-1-9',
 'Alımda Negatif Fiyat Farkı — Tedarikçi Düzeltmesi', 'orta',
 'İşletmemiz, 05.12.2026''da Vestel Ticaret A.Ş.''den 25 adet LED 32" televizyon kredili almıştır (KDV hariç birim 8.000 TL). Tedarikçi 26.12.2026''da üretim maliyeti düşüşü nedeniyle birim başına 400 TL negatif fiyat farkı faturası kesmiştir. Fark cari hesap borcumuzdan düşülmüştür. KDV %20''dir.',
 '',
 'Alımda negatif fiyat farkı alış iskontosu gibi: 153 ve 191 azaltılır, 320 azalır.',
 'onayli', 'modul1-bolum2'),

('mh62', 'mal-alis-satis', 'mal-alis-satis-1-9',
 'Stoktan Çıkmış Mal İçin Fiyat Farkı', 'zor',
 'İşletmemiz, Ekim 2026''da Arçelik A.Ş.''den 50 adet No-Frost buzdolabı satın almıştır (KDV hariç birim 19.000 TL). Kasım sonu itibarıyla 30 adedi satılmıştır. 30.12.2026''da Arçelik birim başına 600 TL fiyat farkı faturası kesmiştir. Fark hem stokta kalan 20 adedi (153) hem satılan 30 adedi (621) etkiler. KDV %20''dir.',
 '',
 'Mal satılmışsa fiyat farkı 153''e yazılamaz, 621 SMM''e yazılır. Stoktaki kısım 153''e.',
 'onayli', 'modul1-bolum2'),

('mh63', 'mal-alis-satis', 'mal-alis-satis-1-9',
 'Karma KDV Oranlı Fiyat Farkı — Stok + Satılan Karması', 'zor',
 'İşletmemiz, Kasım 2026''da Samsung Elektronik''ten 30 adet salon tipi klima satın almıştır (KDV %10, KDV hariç birim 17.000 TL). Aralık''ta 18 adet satılmıştır. 31.12.2026''da Samsung birim başına 800 TL fiyat farkı faturası kesmiştir; yeni mevzuat gereği bu fark %20 KDV''ye tabidir. Stokta 12 adet kalmış, 18 adet satılmış. KDV oranı %20''dir.',
 '',
 'Stoktaki 12 adet (153) + satılan 18 adet (621), 191 %20 KDV.',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 10: VERİLEN SİPARİŞ AVANSI (mh64-mh69) =========
('mh64', 'mal-alis-satis', 'mal-alis-satis-1-10',
 'Tedarikçiye Avans Verme — Banka EFT', 'kolay',
 'İşletmemiz, 04.01.2027 tarihinde LG Electronics Türkiye A.Ş.''ye 40 adet split klima sipariş etmiştir. Sözleşme gereği %30 avans ödenmesi gerekmektedir. Birim fiyat KDV hariç 12.000 TL, toplam sipariş 480.000 TL. Avans 144.000 TL İş Bankası TL hesabından LG''ye EFT ile gönderilmiştir. Fatura yok, KDV yok.',
 '',
 '159 borç (avans muavini), banka alacak. KDV ve 153 çalıştırılmaz (mal henüz teslim alınmadı).',
 'onayli', 'modul1-bolum2'),

('mh65', 'mal-alis-satis', 'mal-alis-satis-1-10',
 'Tedarikçiye Kasadan Avans', 'kolay',
 'İşletmemiz, 09.01.2027 tarihinde Arçelik A.Ş.''ye buzdolabı sipariş avansı olarak 50.000 TL nakit ödemiştir. Ödeme kasadan, fatura kesilmemiştir.',
 '',
 '159.002 (Arçelik avans) borç, kasa alacak.',
 'onayli', 'modul1-bolum2'),

('mh66', 'mal-alis-satis', 'mal-alis-satis-1-10',
 'Avans Tam Mahsubu — Mal Teslimatı', 'orta',
 'İşletmemiz, 04.01.2027''de LG''ye 144.000 TL avans vermişti (159.001). 15.01.2027 tarihinde 40 adet split klima teslim alınmış ve fatura kesilmiştir. KDV hariç 480.000 TL + 96.000 KDV = 576.000 TL. Avansın tamamı mahsup edilmiş, kalan 432.000 TL kredili olarak cari hesaba kaydedilmiştir.',
 '',
 '159 sıfırlanır (tamamı kullanıldı), 320''ye sadece KALAN borç yazılır.',
 'onayli', 'modul1-bolum2'),

('mh67', 'mal-alis-satis', 'mal-alis-satis-1-10',
 'Avans Fatura Tutarından Fazla — Kısmi Teslim', 'orta',
 'İşletmemiz, 09.01.2027''de Arçelik''e 50.000 TL avans vermişti (159.002). 19.01.2027''de 2 adet No-Frost buzdolabı teslim alınmıştır (orijinal sipariş 5 adetti). Fatura: KDV hariç 38.000 TL + 7.600 KDV = 45.600 TL. Avans büyük olduğu için 159''da 4.400 TL bakiye kalır.',
 '',
 '159 muavin bakiyesi tamamen sıfırlanmaz; gelecek alımda kullanılır.',
 'onayli', 'modul1-bolum2'),

('mh68', 'mal-alis-satis', 'mal-alis-satis-1-10',
 'Sipariş İptali — Avansın İadesi', 'zor',
 'İşletmemiz, 26.01.2027''de Samsung Elektronik''e 80.000 TL sipariş avansı vermişti (159.003). Piyasa koşulları değiştiği için sipariş iptal talep edilmiştir. Samsung anlaşma gereği avansın %5''ini (4.000 TL) iş takip masrafı olarak alıkoymuş, kalan 76.000 TL''yi 30.01.2027''de Akbank hesabımıza iade etmiştir. Alıkonulan tutar 689 Diğer Olağandışı Gider''e yazılır.',
 '',
 'Alıkonulan tutar olağan gider değil, 689 kullanılır. KDV yok (mal/hizmet karşılığı değil).',
 'onayli', 'modul1-bolum2'),

('mh69', 'mal-alis-satis', 'mal-alis-satis-1-10',
 'Çoklu Avans + Fiyat Artışı — Karmaşık Mahsup', 'zor',
 'İşletmemiz, LG Electronics''e iki ayrı avans vermişti: 04.01.2027''de 144.000 TL ve 18.01.2027''de ek 60.000 TL (toplam 204.000 TL, 159.001 muavininde). 02.02.2027''de teslim alınan split klima için fatura beklenenden yüksek: KDV hariç 250.000 TL + 50.000 KDV = 300.000 TL. Avansın tamamı mahsup, kalan 96.000 TL kredili.',
 '',
 'İki ayrı avans aynı muavinde (159.001) toplandı, tek toplam mahsup edilir.',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 11: ALINAN SİPARİŞ AVANSI (mh70-mh75) =========
('mh70', 'mal-alis-satis', 'mal-alis-satis-1-11',
 'Müşteriden Avans Alma — Banka', 'kolay',
 'İşletmemiz, 08.02.2027 tarihinde Mert Mağazacılık Ltd. Şti.''nden 25 adet kurutma makinesi siparişine karşılık 80.000 TL avans tahsil etmiştir. Avans Garanti BBVA hesabımıza EFT ile yatırılmıştır. Fatura yok.',
 '',
 'Banka borç (tahsilat), 340 alacak (müşteri avansı). KDV yok.',
 'onayli', 'modul1-bolum2'),

('mh71', 'mal-alis-satis', 'mal-alis-satis-1-11',
 'Kapora — Kasaya Nakit Alınan', 'kolay',
 'İşletmemiz, 13.02.2027 tarihinde Yapıkent Mağazacılık A.Ş.''nden 30.000 TL kapora almıştır. Kasa nakit. Henüz fatura yok, mal teslim edilmemiş.',
 '',
 'Kasa borç, 340 alacak (Yapıkent muavini).',
 'onayli', 'modul1-bolum2'),

('mh72', 'mal-alis-satis', 'mal-alis-satis-1-11',
 'Avansla Yapılan Satış — Tam Mahsup', 'orta',
 'İşletmemiz, 08.02.2027''de Mert''ten 80.000 TL avans almıştı (340.001). 18.02.2027''de 25 adet kurutma makinesi teslim edilmiş, fatura kesilmiştir. KDV hariç birim 14.000 TL, toplam 350.000 + 70.000 KDV = 420.000 TL. Avans tamamen mahsup, kalan 340.000 kredili.',
 '',
 '340 sıfırlanır, 120''ye kalan borç yazılır.',
 'onayli', 'modul1-bolum2'),

('mh73', 'mal-alis-satis', 'mal-alis-satis-1-11',
 'Kapora + Peşin Tahsilat — Tam Satış', 'orta',
 'İşletmemiz, 13.02.2027''de Yapıkent''ten 30.000 TL kapora almıştı (340.002). 23.02.2027''de 12 adet split klima teslim edilmiş, fatura kesilmiştir. KDV hariç 144.000 + 28.800 KDV = 172.800 TL. Kapora mahsup, kalan 142.800 kasaya nakit.',
 '',
 'Kapora ve kasa nakit birlikte 172.800''i karşılar.',
 'onayli', 'modul1-bolum2'),

('mh74', 'mal-alis-satis', 'mal-alis-satis-1-11',
 'Müşteri Sipariş İptali — Cayma Tazminatı', 'zor',
 'İşletmemiz, Beyaz İnci Mağazacılık A.Ş.''nden 03.02.2027''de 100.000 TL avans almıştı (340.003). 27.02.2027''de müşteri vazgeçtiğini bildirmiştir. Sözleşmeye göre %15 cayma tazminatı alıkonulur. Kalan 85.000 TL Ziraat Bankası hesabımızdan müşteriye EFT ile iade edilmiştir. Cayma tazminatı 15.000 TL 649''a (KDV''siz).',
 '',
 'Cayma tazminatı KDV''siz olarak 649''a yazılır, 600''e değil.',
 'onayli', 'modul1-bolum2'),

('mh75', 'mal-alis-satis', 'mal-alis-satis-1-11',
 'Karmaşık Sipariş Değişiklik — 4 İşlem Tek Yevmiyede', 'zor',
 'İşletmemiz, Akel Elektronik Ltd. Şti.''nden 25.01.2027''de 150.000 TL avans almıştı (340.004). 05.03.2027''de Akel sipariş kapsamını DEĞİŞTİRMİŞ: 20 split klima + 10 salon tipi klima. Fatura: 410.000 mal + 82.000 KDV = 492.000 TL. Avans mahsup + 100.000 TL peşin Garanti BBVA''ya EFT + kalan 237.000 kredili. Aynı zamanda Akel, sipariş değişikliği için 5.000 TL KDV''siz işlem maliyeti talep etmiş (cari hesaba alacak).',
 '',
 '4 işlem tek yevmiyede: (1) Eski avans mahsubu, (2) Peşin tahsilat, (3) Yeni satış, (4) İşlem maliyeti gideri (689).',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 12: KONSİNYE (mh76-mh80; S50 atlandı) =========
('mh76', 'mal-alis-satis', 'mal-alis-satis-1-12',
 'Konsinye Mal Verme — Bayie Teslim', 'kolay',
 'İşletmemiz, 10.03.2027 tarihinde bayisi Aydın Mağazacılık Ltd. Şti.''ne 15 adet ankastre fırını KONSİNYE (emanet) olarak teslim etmiştir. Mal satılana kadar mülkiyet işletmemizde kalır; SATIŞ kaydı yapılmaz. 153 ana hesabı içinde MUAVİN DÜZEYİNDE transfer yapılır: merkez depodan (153.010) konsinye-bayide (153.011) muavinine. KDV hariç birim maliyet 8.000 TL.',
 '',
 'Konsinye verme: 153 ana hesabı içinde muavin transferi (153.011 borç, 153.010 alacak). KDV ve satış kaydı YAPILMAZ.',
 'onayli', 'modul1-bolum2'),

('mh77', 'mal-alis-satis', 'mal-alis-satis-1-12',
 'Konsinye Satış Gerçekleşme — Komisyon Düşümü', 'orta',
 'İşletmemiz, Aydın Mağazacılık''a 10.03.2027''de 15 adet ankastre fırın konsinye vermişti. 31.03.2027''de Aydın 10 adetin son tüketiciye satıldığını bildirmiş ve %12 komisyon ayırmıştır. Bizim satış birim fiyatımız 11.000 TL, maliyet birim 8.000 TL. Net tutar Akbank''a EFT. Komisyon hizmeti için Aydın ayrı fatura kesmiştir (KDV %20). Satılan malın SMM''si (621) çalışır, konsinye-bayide muavini (153.011) azalır.',
 '',
 'Konsinye satışta SATIŞ kaydı son alıcıya satıldığı an. 4 işlem: (1) Satış geliri, (2) Komisyon (760+191), (3) Stok düşümü (153.011), (4) SMM (621).',
 'onayli', 'modul1-bolum2'),

('mh78', 'mal-alis-satis', 'mal-alis-satis-1-12',
 'Konsinye İade — Satılmayan Mal', 'orta',
 'İşletmemiz, 10.03.2027''de Aydın''a 15 adet fırın konsinye vermişti. 31.03.2027''de 10 adet satıldı. Kalan 5 adet 07.04.2027''de satılamadığı için iade edilmiştir. KDV ve satış işlemi yok, sadece mal yer değişikliği. KDV hariç birim maliyet 8.000 TL, toplam 40.000 TL. Konsinye-bayide muavininden (153.011) merkez depo muavinine (153.010) geri transfer.',
 '',
 '153 ana hesap toplamı değişmez; sadece muavin değişir. 153.010 borç, 153.011 alacak.',
 'onayli', 'modul1-bolum2'),

('mh79', 'mal-alis-satis', 'mal-alis-satis-1-12',
 'Konsinye Mal Hasarı — Bayi Tahsilatı', 'zor',
 'İşletmemiz, Aydın Mağazacılık''ın iade ettiği 5 fırından 2 tanesinin hasarlı olduğunu fark etmiştir. Sözleşme gereği hasar bayi sorumluluğundadır. 14.04.2027''de Aydın''a 2 hasarlı fırın için fatura kesilmiştir (KDV hariç maliyet 8.000 × 2 = 16.000 TL, %5 idari masraf 800 TL eklendi, KDV %20). Aydın Yapı Kredi hesabımıza EFT ile ödemiştir. Hasarlı mallar 157''ye (Tedarikçi İadesi Bekleyen) alınmıştır.',
 '',
 'Hasarlı mal 153.011''den 157.002''ye taşınır (satılabilir değil). Mal bedeli "satış değil tahsilat" olarak işlenir; idari masraf 649''a gelir. KDV doğar (bedel karşılığı teslim).',
 'onayli', 'modul1-bolum2'),

('mh80', 'mal-alis-satis', 'mal-alis-satis-1-12',
 'Konsinyede Uzun Bekleyen Mal — Değer Düşüklüğü Karşılığı', 'zor',
 'İşletmemiz, 6 ay önce Aydın Mağazacılık''a 5 adet salon tipi klima konsinye vermiştir (153.012 muavininde, KDV hariç birim maliyet 17.000 TL, toplam 85.000 TL). Sezon dışı kaldığı için satılamamış, net gerçekleşebilir değer 14.000 TL''ye düşmüştür. 25.04.2027 tarihinde dönem sonu öncesi değer düşüklüğü karşılığı ayrılmıştır. Karşılık: 5 × (17.000 - 14.000) = 15.000 TL.',
 '',
 '153 doğrudan azaltılmaz (orijinal maliyet korunur), 158 Stok Değer Düşüklüğü Karşılığı (eksi aktif) açılır. Karşıt: 654 Karşılık Giderleri.',
 'onayli', 'modul1-bolum2'),

-- ========= KONU 13: NUMUNE (mh81-mh86) =========
('mh81', 'mal-alis-satis', 'mal-alis-satis-1-13',
 'Müşteriye Numune Verme — Bedelsiz Tanıtım', 'kolay',
 'İşletmemiz, 02.05.2027 tarihinde Demirsoy Mağazacılık A.Ş.''ye 2 adet salon tipi klima bedelsiz numune göndermiştir. KDV hariç maliyet birim 17.000 TL (toplam 34.000), emsal bedel birim 22.000 TL (KDV matrahı). KDV %20 emsal bedel üzerinden hesaplanır (KDV Kanunu md. 27).',
 '',
 'KDV emsal bedel üzerinden: 44.000 × %20 = 8.800 TL. 760 borç toplam (34.000 mal + 8.800 KDV = 42.800), 153 alacak 34.000, 391 alacak 8.800.',
 'onayli', 'modul1-bolum2'),

('mh82', 'mal-alis-satis', 'mal-alis-satis-1-13',
 'Tedarikçiden Numune Alma — Bedelsiz', 'kolay',
 'İşletmemiz, 08.05.2027 tarihinde Vestel Ticaret A.Ş.''den yeni model 1 adet No-Frost buzdolabı bedelsiz numune almıştır. KDV hariç emsal bedeli 21.000 TL, KDV %20''dir (4.200 TL). Mal stoğa girer (153), gelir 649''a yazılır, KDV indirilebilir (191) ve emsal üzerinden 391 doğar.',
 '',
 'Bedelsiz alımda hem 191 (indirilebilir) hem 391 (emsal bedelden) çalışır — netleşir. 153 ve 649 gelir.',
 'onayli', 'modul1-bolum2'),

('mh83', 'mal-alis-satis', 'mal-alis-satis-1-13',
 'Toplu Numune Dağıtımı — Fuar Tanıtımı', 'orta',
 'İşletmemiz, 15.05.2027''de fuarda tanıtım amacıyla 30 adet mini buzdolabı (153.002) numune dağıtmıştır. KDV hariç birim maliyet 9.000 TL, emsal bedel 12.000 TL. KDV %20 emsal üzerinden = 72.000 TL.',
 '',
 '760''a toplam (mal + emsal KDV = 270.000 + 72.000 = 342.000) borç, 153 alacak 270.000, 391 alacak 72.000.',
 'onayli', 'modul1-bolum2'),

('mh84', 'mal-alis-satis', 'mal-alis-satis-1-13',
 'Numune Sonradan Satışa Dönüşürse — Düzeltme', 'orta',
 'İşletmemiz, 02.05.2027''de Demirsoy''a 2 adet salon klima numune göndermişti. 20.05.2027''de Demirsoy 8 adet daha sipariş etmiş, daha önce verilen 2 numuneyi de satın almak istemiştir. Toplam 10 adet için fatura: KDV hariç birim 22.000 TL = 220.000 + 44.000 KDV = 264.000 TL. Daha önce numune olarak 760''a yazılan 34.000 TL ve 391''e yazılan 8.800 TL DÜZELTME yapılır.',
 '',
 'Satışa dönüşen 2 numune için 760 ve 391 düzeltilir. Net etki: 120 borç, 600 alacak (yeni 8 satış), 760 alacak (eski düzelt), 391 alacak (yeni KDV).',
 'onayli', 'modul1-bolum2'),

('mh85', 'mal-alis-satis', 'mal-alis-satis-1-13',
 'Promosyon Kampanyası — "5 Al 1 Bedava"', 'zor',
 'İşletmemiz, Çağdaş Elektronik''e "5 buzdolabı al, 1 bedava" kampanyası ile satış yapmıştır. 27.05.2027''de Çağdaş 20 adet (4 bedava ek olarak) buzdolabı (No-Frost) almıştır. Ücretli: 20 × 19.000 = 380.000 + 76.000 KDV = 456.000. Bedava 4 adet için emsal bedel 22.000 üzerinden KDV (17.600). Bedava maliyet 4 × 19.000 = 76.000 TL 760''a, KDV 17.600 da 760''a (toplam 93.600 borç). Müşteri kredili.',
 '',
 '4 işlem: 120 (456.000 borç ücretli kısım), 760 (93.600 borç bedava + emsal KDV), 600 alacak (380.000), 391 alacak (93.600), 153 alacak (76.000 bedava).',
 'onayli', 'modul1-bolum2'),

('mh86', 'mal-alis-satis', 'mal-alis-satis-1-13',
 'Eski Model Numunelerin Tasfiyesi — Hurda + Gider', 'zor',
 'İşletmemiz, geçmiş yıllardan kalma 8 adet eski model LED 32" televizyonu 03.06.2027''de personel ve müşterilere bedelsiz dağıtmıştır. KDV hariç maliyet birim 8.000 TL, ancak güncel emsal 1.000 TL''ye yakındır. Olağan tanıtım değil tasfiye niteliğinde → 689 Diğer Olağandışı Gider. KDV emsal üzerinden %20 = 1.600 TL.',
 '',
 'Olağan numune 760, olağandışı tasfiye 689. KDV emsal bedeli üzerinden. 689 borç toplam (maliyet + emsal KDV = 64.000 + 1.600 = 65.600), 153 alacak 64.000, 391 alacak 1.600.',
 'onayli', 'modul1-bolum2');

-- =====================================================================
-- Cozumler — 59 sorunun yevmiye satırları
-- =====================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values

-- mh28: Çağdaş 8 LED 50" kredili, 8×15.000
('mh28', 1, '120.001', 144000, 0),
('mh28', 2, '600.002', 0, 120000),
('mh28', 3, '391.001', 0, 24000),

-- mh29: Yapıkent 5 ankastre fırın kredili
('mh29', 1, '120.009', 54000, 0),
('mh29', 2, '600.007', 0, 45000),
('mh29', 3, '391.001', 0, 9000),

-- mh30: Akel 6 split klima %40 Akbank + %60 kredi
('mh30', 1, '102.003', 34560, 0),
('mh30', 2, '120.002', 51840, 0),
('mh30', 3, '600.006', 0, 72000),
('mh30', 4, '391.001', 0, 14400),

-- mh31: Çağdaş 2 LED 50" iade kredili
('mh31', 1, '610.002', 30000, 0),
('mh31', 2, '391.001', 6000, 0),
('mh31', 3, '120.001', 0, 36000),

-- mh32: Demirören şüpheli alacak, 216.000
('mh32', 1, '128.001', 216000, 0),
('mh32', 2, '120.004', 0, 216000),

-- mh33: Yıldız fiyat farkı 10×2.000=20.000+KDV
('mh33', 1, '120.003', 24000, 0),
('mh33', 2, '600.005', 0, 20000),
('mh33', 3, '391.001', 0, 4000),

-- mh34: Mert 1 bulaşık iade kredili 13.000
('mh34', 1, '610.006', 13000, 0),
('mh34', 2, '391.001', 2600, 0),
('mh34', 3, '120.006', 0, 15600),

-- mh35: Beyaz İnci 1 split klima peşin iade Yapı Kredi
('mh35', 1, '610.004', 12000, 0),
('mh35', 2, '391.001', 2400, 0),
('mh35', 3, '102.004', 0, 14400),

-- mh36: Akel 2 fırın indirimli 8.100 iade
('mh36', 1, '610.007', 16200, 0),
('mh36', 2, '391.001', 3240, 0),
('mh36', 3, '120.002', 0, 19440),

-- mh37: Demirsoy 1 kurutma hasarlı 14.000, 157'ye
('mh37', 1, '610.005', 14000, 0),
('mh37', 2, '391.001', 2800, 0),
('mh37', 3, '157.001', 14000, 0),
('mh37', 4, '120.007', 0, 16800),
('mh37', 5, '153.007', 0, 14000),

-- mh38: Yıldız 3 klima önceki dönem iade
('mh38', 1, '610.004', 33000, 0),
('mh38', 2, '391.001', 6600, 0),
('mh38', 3, '120.003', 0, 39600),

-- mh39: Yapıkent 4 TV indirimli 12.350 + 25k kapora
('mh39', 1, '610.002', 49400, 0),
('mh39', 2, '391.001', 9880, 0),
('mh39', 3, '120.009', 0, 34280),
('mh39', 4, '340.002', 0, 25000),

-- mh40: Bosch 1 bulaşık iade 15.000
('mh40', 1, '320.003', 18000, 0),
('mh40', 2, '153.005', 0, 15000),
('mh40', 3, '191.001', 0, 3000),

-- mh41: Vestel 2 LED 32" iade peşin Garanti BBVA
('mh41', 1, '102.001', 19200, 0),
('mh41', 2, '153.004', 0, 16000),
('mh41', 3, '191.001', 0, 3200),

-- mh42: Samsung 3 salon klima karma iade ½ Ziraat ½ cari
('mh42', 1, '102.005', 30600, 0),
('mh42', 2, '320.004', 30600, 0),
('mh42', 3, '153.009', 0, 51000),
('mh42', 4, '191.001', 0, 10200),

-- mh43: Arçelik 2 No-Frost iade %10 KDV
('mh43', 1, '320.001', 41800, 0),
('mh43', 2, '153.001', 0, 38000),
('mh43', 3, '191.002', 0, 3800),

-- mh44: LG 2 split klima iade + nakliye LG tahsil
-- Net mantık: LG iade için 31.200 + nakliyenin tamamı 3.600 = 34.800 alacaklıyız.
-- Nakliye gideri net sıfır (ödendi, LG yansıttı), 760 ve 191 (nakliye KDV) sıfırlanır.
('mh44', 1, '320.005', 34800, 0),
('mh44', 2, '153.008', 0, 26000),
('mh44', 3, '191.001', 0, 5200),
('mh44', 4, '100.001', 0, 3600),
-- denge: 34.800 = 26.000 + 5.200 + 3.600 ✓

-- mh45: Samsung 2 salon klima iade avans+banka
('mh45', 1, '320.004', 8000, 0),
('mh45', 2, '102.003', 19000, 0),
('mh45', 3, '153.009', 0, 22500),
('mh45', 4, '191.001', 0, 4500),

-- mh46: Çağdaş erken ödeme iskontosu İş Bankası 144k+%3
('mh46', 1, '102.002', 139680, 0),
('mh46', 2, '611.001', 3600, 0),
('mh46', 3, '391.001', 720, 0),
('mh46', 4, '120.001', 0, 144000),

-- mh47: Akel sezonluk %5
('mh47', 1, '611.003', 10000, 0),
('mh47', 2, '391.001', 2000, 0),
('mh47', 3, '120.002', 0, 12000),

-- mh48: Mert iskonto + 200k tahsil Garanti BBVA
('mh48', 1, '102.001', 200000, 0),
('mh48', 2, '611.001', 6000, 0),
('mh48', 3, '391.001', 1200, 0),
('mh48', 4, '120.006', 0, 207200),

-- mh49: Beyaz İnci ciro primi müşteri faturası
('mh49', 1, '611.002', 67500, 0),
('mh49', 2, '191.001', 13500, 0),
('mh49', 3, '120.005', 0, 81000),

-- mh50: Demirsoy iskonto düzeltme 1.500 + 300 KDV
('mh50', 1, '120.007', 1800, 0),
('mh50', 2, '611.001', 0, 1500),
('mh50', 3, '391.001', 0, 300),

-- mh51: Yıldız 2024 ciro primi geç kesilen
('mh51', 1, '611.002', 60000, 0),
('mh51', 2, '191.001', 12000, 0),
('mh51', 3, '120.003', 0, 72000),

-- mh52: Arçelik sezon kampanya alış iskonto %4 × 240k
('mh52', 1, '320.001', 11520, 0),
('mh52', 2, '153.001', 0, 9600),
('mh52', 3, '191.001', 0, 1920),

-- mh53: Vestel erken ödeme alış iskonto %2 × 180k LED 50"
('mh53', 1, '320.002', 216000, 0),
('mh53', 2, '153.003', 0, 3600),
('mh53', 3, '191.001', 0, 720),
('mh53', 4, '102.004', 0, 211680),

-- mh54: Bosch yıllık ciro primi gelir
('mh54', 1, '320.003', 72000, 0),
('mh54', 2, '649.002', 0, 60000),
('mh54', 3, '391.001', 0, 12000),

-- mh55: Samsung karma iskonto %3+%2 split klima Ziraat
('mh55', 1, '320.004', 180000, 0),
('mh55', 2, '153.008', 0, 7500),
('mh55', 3, '191.001', 0, 1500),
('mh55', 4, '102.005', 0, 171000),

-- mh56: LG 3 klima alış iskonto sonrası iade 9.500 indirimli
('mh56', 1, '320.005', 34200, 0),
('mh56', 2, '153.008', 0, 28500),
('mh56', 3, '191.001', 0, 5700),

-- mh57: Arçelik kaçırılan iskonto 15.000
('mh57', 1, '320.001', 18000, 0),
('mh57', 2, '153.001', 0, 15000),
('mh57', 3, '191.001', 0, 3000),

-- mh58: Bosch bulaşık fiyat farkı 10×500
('mh58', 1, '153.005', 5000, 0),
('mh58', 2, '191.001', 1000, 0),
('mh58', 3, '320.003', 0, 6000),

-- mh59: Yıldız 8 klima fiyat farkı 800
('mh59', 1, '120.003', 7680, 0),
('mh59', 2, '600.006', 0, 6400),
('mh59', 3, '391.001', 0, 1280),

-- mh60: Demirören kurutma negatif fark -1.000 × 20
('mh60', 1, '611.003', 20000, 0),
('mh60', 2, '391.001', 4000, 0),
('mh60', 3, '120.004', 0, 24000),

-- mh61: Vestel 25 LED 32" negatif fark -400
('mh61', 1, '320.002', 12000, 0),
('mh61', 2, '153.004', 0, 10000),
('mh61', 3, '191.001', 0, 2000),

-- mh62: Arçelik 50 buzdolabı fiyat farkı 600 (30 satılmış, 20 stok)
('mh62', 1, '153.001', 12000, 0),
('mh62', 2, '621.001', 18000, 0),
('mh62', 3, '191.001', 6000, 0),
('mh62', 4, '320.001', 0, 36000),

-- mh63: Samsung 30 salon klima fark 800, 12 stok 18 satılmış %20 KDV
('mh63', 1, '153.009', 9600, 0),
('mh63', 2, '621.002', 14400, 0),
('mh63', 3, '191.001', 4800, 0),
('mh63', 4, '320.004', 0, 28800),

-- mh64: LG 40 split klima avans 144k İş Bankası
('mh64', 1, '159.001', 144000, 0),
('mh64', 2, '102.002', 0, 144000),

-- mh65: Arçelik 50.000 buzdolabı avans kasa
('mh65', 1, '159.002', 50000, 0),
('mh65', 2, '100.001', 0, 50000),

-- mh66: LG 40 klima teslim avans + 432k kredi
('mh66', 1, '153.008', 480000, 0),
('mh66', 2, '191.001', 96000, 0),
('mh66', 3, '159.001', 0, 144000),
('mh66', 4, '320.005', 0, 432000),

-- mh67: Arçelik 2 buzdolabı teslim avans kısmen 4.4k kalır
('mh67', 1, '153.001', 38000, 0),
('mh67', 2, '191.001', 7600, 0),
('mh67', 3, '159.002', 0, 45600),

-- mh68: Samsung sipariş iptal 4k alıkonuldu 76k iade Akbank
('mh68', 1, '102.003', 76000, 0),
('mh68', 2, '689.001', 4000, 0),
('mh68', 3, '159.003', 0, 80000),

-- mh69: LG çoklu avans 204k toplam, 250k mal, 96k kredi
('mh69', 1, '153.008', 250000, 0),
('mh69', 2, '191.001', 50000, 0),
('mh69', 3, '159.001', 0, 204000),
('mh69', 4, '320.005', 0, 96000),

-- mh70: Mert 80k avans Garanti BBVA
('mh70', 1, '102.001', 80000, 0),
('mh70', 2, '340.001', 0, 80000),

-- mh71: Yapıkent 30k kapora kasa
('mh71', 1, '100.001', 30000, 0),
('mh71', 2, '340.002', 0, 30000),

-- mh72: Mert 25 kurutma 420k toplam 80k avans + 340k kredi
('mh72', 1, '340.001', 80000, 0),
('mh72', 2, '120.006', 340000, 0),
('mh72', 3, '600.005', 0, 350000),
('mh72', 4, '391.001', 0, 70000),

-- mh73: Yapıkent 12 split klima 172.8k 30k kapora + 142.8k kasa
('mh73', 1, '340.002', 30000, 0),
('mh73', 2, '100.001', 142800, 0),
('mh73', 3, '600.006', 0, 144000),
('mh73', 4, '391.001', 0, 28800),

-- mh74: Beyaz İnci iptal 100k avans, 15k cayma + 85k iade Ziraat
('mh74', 1, '340.003', 100000, 0),
('mh74', 2, '102.005', 0, 85000),
('mh74', 3, '649.001', 0, 15000),

-- mh75: Akel karmaşık değişiklik 150k avans + 100k peşin + 237k kredi + 5k 689
('mh75', 1, '340.004', 150000, 0),
('mh75', 2, '102.001', 100000, 0),
('mh75', 3, '120.002', 237000, 0),
('mh75', 4, '689.002', 5000, 0),
('mh75', 5, '600.006', 0, 410000),
('mh75', 6, '391.001', 0, 82000),

-- mh76: Aydın 15 ankastre fırın konsinye verme (153 muavin transferi)
('mh76', 1, '153.011', 120000, 0),
('mh76', 2, '153.010', 0, 120000),

-- mh77: Aydın konsinye 10 fırın satış, Akbank, komisyon, SMM
('mh77', 1, '102.003', 116160, 0),
('mh77', 2, '760.001', 13200, 0),
('mh77', 3, '191.001', 2640, 0),
('mh77', 4, '621.003', 80000, 0),
('mh77', 5, '600.007', 0, 110000),
('mh77', 6, '391.001', 0, 22000),
('mh77', 7, '153.011', 0, 80000),

-- mh78: Aydın 5 fırın konsinye iadesi (153 transfer geri)
('mh78', 1, '153.010', 40000, 0),
('mh78', 2, '153.011', 0, 40000),

-- mh79: Aydın 2 hasarlı fırın, Yapı Kredi 20.160, idari masraf 800
-- 649.003'e mal tazmini (16k) + idari masraf (800) = 16.800 birlikte yazılır.
('mh79', 1, '102.004', 20160, 0),
('mh79', 2, '157.002', 16000, 0),
('mh79', 3, '153.011', 0, 16000),
('mh79', 4, '649.003', 0, 16800),
('mh79', 5, '391.001', 0, 3360),
-- denge: 20.160 + 16.000 = 36.160; 16.000 + 16.800 + 3.360 = 36.160 ✓

-- mh80: Aydın 5 salon klima değer düşüklüğü karşılığı 15k
('mh80', 1, '654.001', 15000, 0),
('mh80', 2, '158.001', 0, 15000),

-- mh81: Demirsoy 2 salon klima numune (760 toplam 42.800)
('mh81', 1, '760.003', 42800, 0),
('mh81', 2, '153.009', 0, 34000),
('mh81', 3, '391.001', 0, 8800),

-- mh82: Vestel 1 No-Frost numune al (gelir 649)
('mh82', 1, '153.001', 21000, 0),
('mh82', 2, '191.001', 4200, 0),
('mh82', 3, '649.003', 0, 21000),
('mh82', 4, '391.001', 0, 4200),

-- mh83: Fuar 30 mini buzdolabı numune (760 toplam 342.000)
('mh83', 1, '760.003', 342000, 0),
('mh83', 2, '153.002', 0, 270000),
('mh83', 3, '391.001', 0, 72000),

-- mh84: Demirsoy numune satışa dönüşüm 10 klima
-- 120 borç 264k, 600 alacak 220k, 391 alacak 44k, 760 alacak 34k (eski numune iptali), 391 borç 8.8k (eski emsal iptali)
('mh84', 1, '120.007', 264000, 0),
('mh84', 2, '391.001', 8800, 0),
('mh84', 3, '600.006', 0, 220000),
('mh84', 4, '391.001', 0, 44000),
('mh84', 5, '760.003', 0, 8800),
-- denge: borç 264.000 + 8.800 = 272.800
-- alacak: 220.000 + 44.000 + 8.800 = 272.800 ✓

-- mh85: Çağdaş "5 al 1 bedava" — 20 ücretli + 4 bedava
('mh85', 1, '120.001', 456000, 0),
('mh85', 2, '760.003', 93600, 0),
('mh85', 3, '600.001', 0, 380000),
('mh85', 4, '391.001', 0, 93600),
('mh85', 5, '153.001', 0, 76000),

-- mh86: 8 eski LED 32" tasfiye (689 + emsal KDV)
('mh86', 1, '689.003', 65600, 0),
('mh86', 2, '153.004', 0, 64000),
('mh86', 3, '391.001', 0, 1600);

commit;

notify pgrst, 'reload schema';
