-- =====================================================================
-- M1 Konu 1 — Başlık ve senaryo iyileştirme
-- =====================================================================
-- 1) Başlıklar Tarz B (Aksiyon-odaklı) formata çevrildi
-- 2) "💰 Tutarlar" blokları senaryolardan kaldırıldı — öğrenci hesaplamayı
--    kendi yapsın (mal bedeli, KDV, toplam hep verili olunca yevmiye kaydı
--    "kopyala-yapıştır" hale geliyordu, pedagojik olarak yanlış)
-- 3) Markdown bold işaretleri (**...**) kaldırıldı — frontend Markdown
--    render etmediği için ham `**` öğrenciye görünüyordu
--
-- Senaryolarda korunanlar: birim fiyat, miktar, KDV oranı, ödeme yöntemi.
-- Öğrenci 1 dakikada zihinden çarpıp toplayabilir — gerçek pratik bu.

begin;

-- s01: Nakit Ödeyerek Mal Alımı
update sorular set
  baslik = 'Nakit Ödeyerek Mal Alımı',
  senaryo = E'İşletmemiz, 03.04.2026 tarihinde Arçelik A.Ş.''den 8 adet No-Frost buzdolabı alımı yapmıştır. KDV hariç birim fiyat 18.500 TL, KDV oranı %20''dir. Faturanın tamamı işletme kasasından nakit olarak peşin ödenmiştir.'
where id = 'm1k1-s01';

-- s02: Banka Havalesi (EFT) ile Mal Alımı
update sorular set
  baslik = 'Banka Havalesi (EFT) ile Mal Alımı',
  senaryo = E'İşletmemiz, 09.04.2026 tarihinde Vestel Ticaret A.Ş.''den 6 adet LED 32'''' televizyon alımı yapmıştır. KDV hariç birim fiyat 8.500 TL, KDV oranı %20''dir. Faturanın tamamı işletmemizin Garanti BBVA TL hesabından EFT ile peşin ödenmiştir.'
where id = 'm1k1-s02';

-- s03: Cari Hesaba Borçlanarak Mal Alımı
update sorular set
  baslik = 'Cari Hesaba Borçlanarak Mal Alımı',
  senaryo = E'İşletmemiz, 15.04.2026 tarihinde Bosch Ev Aletleri A.Ş.''den 12 adet bulaşık makinesi alımı yapmıştır. KDV hariç birim fiyat 14.000 TL, KDV oranı %20''dir. Fatura bedelinin tamamı kredili olarak tedarikçinin cari hesabına kaydedilmiştir.'
where id = 'm1k1-s03';

-- s04: Çek Düzenleyerek Mal Alımı
update sorular set
  baslik = 'Çek Düzenleyerek Mal Alımı',
  senaryo = E'İşletmemiz, 22.04.2026 tarihinde Samsung Elektronik Türkiye A.Ş.''den 5 adet split klima alımı yapmıştır. KDV hariç birim fiyat 13.000 TL, KDV oranı %20''dir. Fatura bedelinin tamamı için işletmemiz kendi çekini düzenleyip tedarikçiye vermiştir.'
where id = 'm1k1-s04';

-- s05: Borç Senedi Düzenleyerek Mal Alımı
update sorular set
  baslik = 'Borç Senedi Düzenleyerek Mal Alımı',
  senaryo = E'İşletmemiz, 28.04.2026 tarihinde LG Electronics Türkiye A.Ş.''den 4 adet salon tipi klima alımı yapmıştır. KDV hariç birim fiyat 17.000 TL, KDV oranı %20''dir. Fatura bedelinin tamamı için işletmemiz adına bono düzenlenerek tedarikçiye verilmiştir.'
where id = 'm1k1-s05';

-- s06: Yarı Peşin Yarı Vadeli Mal Alımı
update sorular set
  baslik = 'Yarı Peşin Yarı Vadeli Mal Alımı',
  senaryo = E'İşletmemiz, 06.05.2026 tarihinde Arçelik A.Ş.''den 10 adet mini buzdolabı alımı yapmıştır. KDV hariç birim fiyat 7.500 TL, KDV oranı %20''dir. Fatura bedelinin yarısı işletmemizin İş Bankası TL hesabından EFT ile peşin ödenmiş, kalan yarısı kredili olarak tedarikçinin cari hesabına kaydedilmiştir.'
where id = 'm1k1-s06';

-- s07: Nakliye Maliyeti Dahil Mal Alımı
update sorular set
  baslik = 'Nakliye Maliyeti Dahil Mal Alımı',
  senaryo = E'İşletmemiz, 13.05.2026 tarihinde Bosch Ev Aletleri A.Ş.''den 8 adet bulaşık makinesi kredili olarak almıştır. KDV hariç birim fiyat 14.500 TL, KDV oranı %20''dir. Aynı faturada, Bosch tarafından sağlanan nakliye hizmeti bedeli 4.000 TL + KDV olarak yer almaktadır. Nakliye bedeli mal maliyetine eklenmiştir. Fatura toplamının tamamı kredili olarak tedarikçinin cari hesabına kaydedilmiştir.'
where id = 'm1k1-s07';

-- s08: Farklı KDV Oranlarıyla Mal Alımı
update sorular set
  baslik = 'Farklı KDV Oranlarıyla Mal Alımı',
  senaryo = E'İşletmemiz, 20.05.2026 tarihinde LG Electronics Türkiye A.Ş.''den karma bir alım yapmıştır. Aynı fatura kapsamında 5 adet salon tipi klima (KDV hariç birim 17.500 TL, KDV %20) ve 4 adet özel düzenlemeye tabi enerji verimli ankastre fırın (KDV hariç birim 10.000 TL, KDV %10) satın alınmıştır. Fatura toplamının tamamı işletmemizin Akbank TL hesabından EFT ile peşin ödenmiştir.'
where id = 'm1k1-s08';

-- s09: Üç Farklı Kanaldan Ödeme ile Mal Alımı
update sorular set
  baslik = 'Üç Farklı Kanaldan Ödeme ile Mal Alımı',
  senaryo = E'İşletmemiz, 28.05.2026 tarihinde Samsung Elektronik Türkiye A.Ş.''den 20 adet LED 50'''' televizyon alımı yapmıştır. KDV hariç birim fiyat 15.000 TL, KDV oranı %20''dir. Tedarikçi ile yapılan anlaşma gereği ödeme üç farklı kanaldan gerçekleştirilmiştir: fatura tutarının %20''si işletme kasasından nakit, %50''si Yapı Kredi TL hesabından EFT olarak peşin ödenmiş, kalan %30''u için işletmemiz kendi çekini düzenleyip tedarikçiye vermiştir.'
where id = 'm1k1-s09';

-- s10: Müşteri Çekini Ciro Ederek Mal Alımı
-- Not: Toplam fatura tutarı senaryodan çıkarıldı — öğrenci 12 × 18.000 × 1.20'yi
-- kendi hesaplayacak. "Kalan tutar kredili" ifadesi 259.200 - 200.000 sonucunu da
-- öğrenciye hesaplatır.
update sorular set
  baslik = 'Müşteri Çekini Ciro Ederek Mal Alımı',
  senaryo = E'İşletmemiz, 04.06.2026 tarihinde LG Electronics Türkiye A.Ş.''den 12 adet salon tipi klima alımı yapmıştır. KDV hariç birim fiyat 18.000 TL, KDV oranı %20''dir. Ödemenin 200.000 TL''lik kısmı, daha önce müşterimiz Çağdaş Elektronik Ltd. Şti.''nden almış olduğumuz ve portföyümüzde bulunan bir çek LG''ye ciro edilerek karşılanmıştır. Kalan tutar kredili olarak tedarikçinin cari hesabına kaydedilmiştir.'
where id = 'm1k1-s10';

commit;

notify pgrst, 'reload schema';
