-- MuhasebeLab — Ticari Mal Alımı ve Satımı ünitesi: konu başına 2 soru
--
-- 6 konu × 2 soru = 12 yeni soru. Konular: stok-kavrami, mal-alis,
-- alistan-iade, mal-satis, satistan-iade, satilan-mal-maliyeti.
--
-- Format KPSS muhasebe ve SMMM Staj Başlatma Sınavı standart kalıplarına
-- uygun: senaryolu, gerçek belge dilinde, çift taraflı yevmiye kaydı.
-- Zorluk dağılımı: 6 kolay + 5 orta + 1 zor = öğrenci progression.

-- ===========================================================================
-- SORULAR
-- ===========================================================================

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, durum, kaynak, yayinlanma_tarihi)
values

-- ─── 1. Stok Kavramı ───────────────────────────────────────────────────────
(
  'mas-stk-1',
  'mal-alis-satis',
  'Aralıklı Envanterde Mal Alımı',
  'kolay',
  $ml$Aralıklı envanter sistemi uygulayan işletmemiz tedarikçiden 60.000 TL tutarında mal almıştır. Faturada %20 KDV ayrı gösterilmiş, fatura toplamı işletme kasasından peşin ödenmiştir.

Aralıklı envanter sisteminde alış işleminde maliyet hangi hesapta izlenir? İşlemin yevmiye kaydını yapınız.$ml$,
  $ml$Aralıklı envanterde alımlar 153 Ticari Mallar hesabına alınır; satışlarda 153 dokunulmaz, sadece gelir kaydı yapılır, maliyet dönem sonu hesaplanır.$ml$,
  $ml$Aralıklı envanter sisteminde alış sırasında 153 Ticari Mallar borçlandırılır (sürekli envanterden farkı: yıl içinde 621'e geçiş yok). KDV indirilebilir olduğu için 191. Peşin ödeme nedeniyle 100 Kasa azalır (alacak).$ml$,
  'onayli',
  'manuel',
  now()
),
(
  'mas-stk-2',
  'mal-alis-satis',
  'Sürekli Envanterde Aynı İşlem',
  'orta',
  $ml$Sürekli envanter sistemi uygulayan işletmemiz tedarikçiden 60.000 TL tutarında mal almış, %20 KDV faturada ayrı gösterilmiş, ödeme peşin yapılmıştır. Aynı gün 8.000 TL'lik kısmı maliyet bedeli 5.500 TL üzerinden müşteriye %20 KDV ile peşin satılmıştır.

Sürekli envanterde alış ve satış için iki ayrı yevmiye kaydı gerekir: satışta hem hasılat hem maliyet anlık kaydedilir. İki kaydı birlikte yapınız.$ml$,
  $ml$Sürekli envanterde her satışta 621 Satılan Ticari Mallar Maliyeti borçlanır, 153 Ticari Mallar alacaklanır. Satış kaydı ile maliyet kaydı eş zamanlı.$ml$,
  $ml$Alış: 153 borçlanır 60.000, 191 İndirilecek KDV 12.000, 100 Kasa 72.000 alacak. Satış: 100 Kasa 9.600 borç, 600 Yurtiçi Satışlar 8.000, 391 Hesaplanan KDV 1.600 alacak. Maliyet: 621 SMM 5.500 borç, 153 5.500 alacak. (Tek yevmiye olarak birleştirilmiş 7 satırlı hâli.)$ml$,
  'onayli',
  'manuel',
  now()
),

-- ─── 2. Mal Alış ───────────────────────────────────────────────────────────
(
  'mas-als-1',
  'mal-alis-satis',
  'Peşin Mal Alımı — KDV Ayrıştırma',
  'kolay',
  $ml$ABC TEKSTİL A.Ş. işletmemize 50.000 TL tutarında mal satmış, fatura üzerinde %20 KDV ayrı belirtilmiştir. Fatura toplamı bankadan EFT ile peşin ödenmiştir.

Sürekli envanter sistemi uygulanmaktadır. Yevmiye kaydını yapınız.$ml$,
  $ml$Mal bedeli 153'e, KDV 191'e ayrı yazılır. Bankadan ödeme — 102 Bankalar.$ml$,
  $ml$50.000 TL mal bedeli 153 Ticari Mallar'a borç. 10.000 TL (%20 KDV) İndirilecek KDV olarak 191'e borç. Toplam ödeme 60.000 TL bankadan çıktığı için 102 Bankalar alacak.$ml$,
  'onayli',
  'manuel',
  now()
),
(
  'mas-als-2',
  'mal-alis-satis',
  'Vadeli Mal Alımı — Senet Düzenlenmesi',
  'orta',
  $ml$BORDA GIDA SAN. LTD. ŞTİ. işletmemize 80.000 TL tutarında mal faturası kesmiştir. Faturada %20 KDV ayrı gösterilmiş, toplam tutar için aynı gün vadesi 90 gün sonra olan bir borç senedi (bono) düzenlenip tedarikçiye verilmiştir.

Sürekli envanter sistemi. Yevmiye kaydını yapınız.$ml$,
  $ml$Senet düzenleyip vermek = 321 Borç Senetleri (pasif kalemde artış).$ml$,
  $ml$Mal bedeli 80.000 TL'si 153'e borç, %20 KDV (16.000 TL) 191'e borç. Karşılığında verilen 96.000 TL'lik bono için 321 Borç Senetleri alacaklanır. Vadeli alımlarda açık hesap (320) yerine senet düzenlendiği için 321 kullanılır.$ml$,
  'onayli',
  'manuel',
  now()
),

-- ─── 3. Alıştan İade ───────────────────────────────────────────────────────
(
  'mas-aid-1',
  'mal-alis-satis',
  'Peşin Alımdan Mal İadesi',
  'kolay',
  $ml$Önceki tarihte 30.000 TL + %20 KDV peşin olarak alınan mallardan 12.000 TL'lik kısmı hasarlı çıkmış, tedarikçiye iade edilmiştir. Tedarikçi iade tutarı + KDV'yi (toplam 14.400 TL) işletme kasasına peşin geri ödemiştir.

Yevmiye kaydını yapınız.$ml$,
  $ml$Alış kaydının ters yönü: 153 alacak, 191 alacak (indirim hakkı azalır), 100 borç (kasaya para girdi).$ml$,
  $ml$İade ile birlikte stoktaki mal azalır → 153 Ticari Mallar 12.000 alacak. KDV indirim hakkı da azalacağı için 191 İndirilecek KDV 2.400 alacak (ters kayıt). Tedarikçinin geri verdiği 14.400 TL kasaya girdiği için 100 Kasa borç.$ml$,
  'onayli',
  'manuel',
  now()
),
(
  'mas-aid-2',
  'mal-alis-satis',
  'Vadeli Alımdan İade — 320 Satıcılar Düşümü',
  'orta',
  $ml$Önceki vadeli alımda 320 Satıcılar hesabında ANKARA GIDA A.Ş.'ye 72.000 TL borç oluşmuştu (60.000 TL mal + 12.000 TL KDV). Bu mallardan 15.000 TL tutarındaki kısmı kalitesizlik nedeniyle iade edilmiş, satıcı iade faturası düzenlemiş ve borç hesabımızı 18.000 TL azaltmıştır.

Sürekli envanter. Yevmiye kaydını yapınız.$ml$,
  $ml$Vadeli alımda iade → satıcılar hesabı azalır (borç tarafı), mal ve KDV alacak yönde geri çevrilir.$ml$,
  $ml$Tedarikçi borcu 18.000 TL azaldığı için 320 Satıcılar borçlanır. Stoktan iade edilen 15.000 TL'lik mal için 153 Ticari Mallar alacaklanır. KDV indirim hakkı azaldığı için 191 İndirilecek KDV 3.000 alacak (ters kayıt — başlangıçta borç yazılmıştı, şimdi alacak ile dengeleniyor).$ml$,
  'onayli',
  'manuel',
  now()
),

-- ─── 4. Mal Satış ──────────────────────────────────────────────────────────
(
  'mas-stj-1',
  'mal-alis-satis',
  'Peşin Mal Satışı — Perakende',
  'kolay',
  $ml$Müşterimize 25.000 TL'lik mal satılmış, faturada %20 KDV ayrı gösterilmiştir. Müşteri toplam tutarı işletme kasasına nakden ödemiştir.

Aralıklı envanter sistemi (yıl içi maliyet kaydı yok). Yevmiye kaydını yapınız.$ml$,
  $ml$Aralıklı envanterde satışta 621/153 dokunulmaz; sadece gelir + KDV.$ml$,
  $ml$25.000 TL satış geliri 600 Yurtiçi Satışlar'a alacak. KDV (5.000 TL) hesaplanan vergi olarak 391'e alacak. Toplam tahsilat 30.000 TL kasaya girdiği için 100 Kasa borç.$ml$,
  'onayli',
  'manuel',
  now()
),
(
  'mas-stj-2',
  'mal-alis-satis',
  'Sürekli Envanterde Vadeli Satış — Eş Zamanlı Maliyet',
  'orta',
  $ml$Sürekli envanter uygulayan işletmemiz, müşterisi GÜNDEM YAYINCILIK A.Ş.'ye 40.000 TL'lik mal satmıştır. Faturada %20 KDV ayrı gösterilmiş, 30 gün vade ile açık hesap koşullu satış yapılmıştır. Satılan malların kayıtlı maliyeti 28.000 TL'dir.

Sürekli envanterde satış kaydı + maliyet kaydı tek yevmiyede yapılacak. İki ayrı muhasebe olayını birleştirip yazınız.$ml$,
  $ml$Vadeli satış → 120 Alıcılar; satış geliri 600; KDV 391; aynı anda maliyet için 621 borç, 153 alacak.$ml$,
  $ml$Vadeli açık hesap satış olduğu için 120 Alıcılar 48.000 borç. Satış hasılatı 600 Yurtiçi Satışlar 40.000 alacak. KDV 391 Hesaplanan KDV 8.000 alacak. Sürekli envanterde aynı kayıtta maliyet aktarımı yapılır: satılan mal stoktan çıkar (153 alacak 28.000), gider olarak maliyet hesabına yazılır (621 borç 28.000). Toplam borç = alacak = 76.000.$ml$,
  'onayli',
  'manuel',
  now()
),

-- ─── 5. Satıştan İade ──────────────────────────────────────────────────────
(
  'mas-sid-1',
  'mal-alis-satis',
  'Peşin Satıştan İade',
  'kolay',
  $ml$Önceki tarihte peşin yapılan 6.000 TL + %20 KDV mal satışından, müşteri 4.000 TL'lik kısmı (orijinal faturadaki bir bölümü) iade etmiş, iade tutarı + KDV'yi kasadan peşin geri istemiştir. İşletmemiz iade faturası düzenleyip 4.800 TL'yi kasadan ödemiştir.

Aralıklı envanter sistemi. Yevmiye kaydını yapınız.$ml$,
  $ml$Satıştan iade hesapla 600'e ters kayıt yerine 610 (satıştan iadeler — kontra hesap) borçlanır.$ml$,
  $ml$Satıştan iadeler doğrudan 600'e alacak ile değil, **610 Satıştan İadeler** (kontra hesap) borçlanarak izlenir — bu aralıklı sistemin ödüllendirici netliği. 4.000 TL iade bedeli 610'a borç. KDV iadesi (800 TL) için 391 Hesaplanan KDV borç (ters kayıt). Toplam 4.800 TL kasadan çıktığı için 100 Kasa alacak.$ml$,
  'onayli',
  'manuel',
  now()
),
(
  'mas-sid-2',
  'mal-alis-satis',
  'Sürekli Envanterde Satıştan İade — Maliyet Geri Alma',
  'orta',
  $ml$Sürekli envanter uygulayan işletmenin önceki vadeli satışından (120 Alıcılar üzerinden) müşteri 5.000 TL'lik kısmı iade etmiştir. İade edilen malların kayıtlı maliyeti 3.500 TL'dir. KDV %20. Müşteri açık hesabından (120) iade tutarı + KDV (toplam 6.000 TL) düşülmüştür.

İki olay tek yevmiyede: satış iadesi + maliyet geri alma. Yevmiye kaydını yapınız.$ml$,
  $ml$Sürekli envanterde satıştan iadede maliyet de tersine çevrilir: 153 borç, 621 alacak.$ml$,
  $ml$Satış iadesi: 610 Satıştan İadeler 5.000 borç, 391 Hesaplanan KDV 1.000 borç (ters), 120 Alıcılar 6.000 alacak (cari hesap düşer). Maliyet geri alma: iade edilen mal stoğa döner → 153 Ticari Mallar 3.500 borç, 621 SMM 3.500 alacak (ters yön). Toplam 5 satırlı yevmiye, borç toplam 9.500 = alacak toplam 9.500.$ml$,
  'onayli',
  'manuel',
  now()
),

-- ─── 6. Satılan Mal Maliyeti ───────────────────────────────────────────────
(
  'mas-smm-1',
  'mal-alis-satis',
  'Aralıklı Envanterde Yıl Sonu SMM Hesabı',
  'orta',
  $ml$Aralıklı envanter sistemi uygulayan işletmemizin 31 Aralık 2026 tarihindeki durumu:
- 153 Ticari Mallar hesabı bakiyesi: 350.000 TL borç (dönem başı 80.000 + yıl içi alımlar 270.000)
- Fiili stok sayım sonucu dönem sonu mevcut: 65.000 TL

Yıl sonu Satılan Malın Maliyeti hesaplanıp 621'e aktarılacak; 153 Ticari Mallar gerçek dönem sonu değerine getirilecektir.

SMM hesabını yapın ve dönem sonu kaydını çıkarın.$ml$,
  $ml$SMM = Dönem başı stok + Dönem içi alımlar − Dönem sonu stok.$ml$,
  $ml$SMM = 80.000 + 270.000 − 65.000 = **285.000 TL**. Bu maliyet 621 Satılan Ticari Mallar Maliyeti'ne borçlanır, 153 Ticari Mallar'dan düşülür (alacak). Yevmiye sonrası 153 bakiyesi 350.000 − 285.000 = 65.000 TL kalır, bu da fiili sayım ile uyumludur.$ml$,
  'onayli',
  'manuel',
  now()
),
(
  'mas-smm-2',
  'mal-alis-satis',
  'Sürekli Envanterde Stok Noksanı — Dönem Sonu Düzeltme',
  'zor',
  $ml$Sürekli envanter uygulayan işletme yıl içi her satışta 621 hesabına maliyet kaydı yapmış, toplam 480.000 TL SMM birikmiştir. 31 Aralık 2026 fiili stok sayımı:
- 153 Ticari Mallar kayıtlı bakiyesi: 95.000 TL borç
- Fiili sayımda bulunan stok: 92.000 TL

Aradaki 3.000 TL'lik noksan, normal fire kapsamında değildir; envanter sayım farkı olarak kayıt dışı kalan satış / kayıp olarak değerlendirilmiştir. Maliyet düzeltmesi olarak işlenmesi gerekmektedir.

Dönem sonu düzeltme yevmiye kaydını yapın.$ml$,
  $ml$Stok noksanı = kayıt > fiili. Eksik mal maliyetli olarak yazılmamış demektir; düzeltme 621 borç, 153 alacak.$ml$,
  $ml$Sürekli envanterde her satışta maliyet zaten 621'e atılmıştı, ama 3.000 TL'lik noksan satış kayıtlarına yansımamış (kaçak satış / kayıp). Bu malın stokta kayıtlı görünmesi anormal; düzeltme için 621 SMM 3.000 borç (gider artışı), 153 Ticari Mallar 3.000 alacak (stok azaltıldı). Sonrası 153 bakiyesi 95.000 − 3.000 = 92.000 TL fiili sayımla uyumlu.$ml$,
  'onayli',
  'manuel',
  now()
);

-- ===========================================================================
-- ÇÖZÜMLER (yevmiye satırları)
-- ===========================================================================

insert into cozumler (soru_id, sira, kod, borc, alacak) values

-- mas-stk-1: Aralıklı envanter mal alımı
('mas-stk-1', 1, '153', 60000, 0),
('mas-stk-1', 2, '191', 12000, 0),
('mas-stk-1', 3, '100', 0, 72000),

-- mas-stk-2: Sürekli envanter alış+satış+maliyet (7 satır)
('mas-stk-2', 1, '153', 60000, 0),
('mas-stk-2', 2, '191', 12000, 0),
('mas-stk-2', 3, '100', 0, 72000),
('mas-stk-2', 4, '100', 9600, 0),
('mas-stk-2', 5, '600', 0, 8000),
('mas-stk-2', 6, '391', 0, 1600),
('mas-stk-2', 7, '621', 5500, 0),
('mas-stk-2', 8, '153', 0, 5500),

-- mas-als-1: Peşin mal alımı banka
('mas-als-1', 1, '153', 50000, 0),
('mas-als-1', 2, '191', 10000, 0),
('mas-als-1', 3, '102', 0, 60000),

-- mas-als-2: Vadeli alım senetli
('mas-als-2', 1, '153', 80000, 0),
('mas-als-2', 2, '191', 16000, 0),
('mas-als-2', 3, '321', 0, 96000),

-- mas-aid-1: Peşin alımdan iade
('mas-aid-1', 1, '100', 14400, 0),
('mas-aid-1', 2, '153', 0, 12000),
('mas-aid-1', 3, '191', 0, 2400),

-- mas-aid-2: Vadeli alımdan iade
('mas-aid-2', 1, '320', 18000, 0),
('mas-aid-2', 2, '153', 0, 15000),
('mas-aid-2', 3, '191', 0, 3000),

-- mas-stj-1: Peşin satış (aralıklı)
('mas-stj-1', 1, '100', 30000, 0),
('mas-stj-1', 2, '600', 0, 25000),
('mas-stj-1', 3, '391', 0, 5000),

-- mas-stj-2: Sürekli envanter vadeli satış + maliyet
('mas-stj-2', 1, '120', 48000, 0),
('mas-stj-2', 2, '600', 0, 40000),
('mas-stj-2', 3, '391', 0, 8000),
('mas-stj-2', 4, '621', 28000, 0),
('mas-stj-2', 5, '153', 0, 28000),

-- mas-sid-1: Peşin satıştan iade
('mas-sid-1', 1, '610', 4000, 0),
('mas-sid-1', 2, '391', 800, 0),
('mas-sid-1', 3, '100', 0, 4800),

-- mas-sid-2: Sürekli envanter satıştan iade + maliyet ters
('mas-sid-2', 1, '610', 5000, 0),
('mas-sid-2', 2, '391', 1000, 0),
('mas-sid-2', 3, '120', 0, 6000),
('mas-sid-2', 4, '153', 3500, 0),
('mas-sid-2', 5, '621', 0, 3500),

-- mas-smm-1: Aralıklı envanter dönem sonu SMM
('mas-smm-1', 1, '621', 285000, 0),
('mas-smm-1', 2, '153', 0, 285000),

-- mas-smm-2: Sürekli envanter stok noksanı düzeltme
('mas-smm-2', 1, '621', 3000, 0),
('mas-smm-2', 2, '153', 0, 3000);

notify pgrst, 'reload schema';
