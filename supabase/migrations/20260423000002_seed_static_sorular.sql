-- =====================================================================
-- Statik UNITELER → Supabase seed (idempotent)
-- Üretici: scripts/generate-sorular-migration.ts
-- Üretim tarihi: 2026-04-24T19:00:41.476Z
-- Kapsam: 11 ünite, 80 soru
-- =====================================================================

begin;

-- Ünites (upsert)
insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('kasa', $ml$Kasa İşlemleri$ml$, $ml$Nakit giriş-çıkış, perakende satış, gider faturası, sayım farkları, personel avansı$ml$, 'kasa', 1)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('banka', $ml$Banka İşlemleri$ml$, $ml$Havale, EFT, kredi kullanımı/taksit, banka masrafı — dekont tabanlı$ml$, 'banka', 2)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('mal', $ml$Ticari Mal Alım-Satımı$ml$, $ml$Belge tabanlı alım-satım, iskonto, navlun, KDV ayrıştırma ve sürekli envanter$ml$, 'mal', 3)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('senet', $ml$Çek ve Senetler$ml$, $ml$Alınan/verilen çek ve senetler, ciro, karşılıksız çek$ml$, 'senet', 4)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('kdv', $ml$KDV Hesapları$ml$, $ml$Ay sonu KDV mahsubu, devreden KDV, tahakkuk ödemesi, kısmi tevkifat$ml$, 'kdv', 5)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('amortisman', $ml$Duran Varlıklar ve Amortisman$ml$, $ml$Demirbaş/taşıt alımı, normal ve azalan bakiyeler, demirbaş satışı, hurdaya ayırma$ml$, 'amortisman', 6)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('personel', $ml$Personel ve Ücret$ml$, $ml$Bordro, SGK işçi/işveren, stopaj, net ücret ödeme, avans mahsubu$ml$, 'personel', 7)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('donem-sonu', $ml$Dönem Sonu İşlemleri$ml$, $ml$Peşin gider/gelir ayrıştırma, gider/gelir tahakkukları (180/280, 380/480, 181, 381)$ml$, 'calculator', 8)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('supheli-alacaklar', $ml$Şüpheli Alacaklar$ml$, $ml$Tahsili şüpheli hale gelen alacaklar, karşılık ayırma, tahsilat ve değersiz alacak kayıtları (128/129/644/654/659)$ml$, 'warning', 9)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('reeskont', $ml$Reeskont İşlemleri$ml$, $ml$Vadeli alacak ve borç senetlerinin dönem sonu reeskont kayıtları (122/322/647/657)$ml$, 'percent', 10)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('kambiyo', $ml$Kambiyo İşlemleri$ml$, $ml$Döviz alım-satım, dövizli alacak/borç, tahsilat-ödeme kur farkları ve yıl sonu döviz değerleme (646/656)$ml$, 'globe', 11)
  on conflict (id) do update set
    ad = excluded.ad,
    aciklama = excluded.aciklama,
    thiings_icon = excluded.thiings_icon,
    sira = excluded.sira;

-- Sorular (upsert)
insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-1', 'kasa', $ml$Kuruluşta Nakit Sermaye Koyma$ml$, 'kolay', $ml$Limited şirketin tek ortağı, anasözleşmedeki taahhüdü uyarınca işletme kasasına 500.000 TL nakit sermaye yatırmıştır. Ortağın imzaladığı kasa tahsil makbuzu işletmenin defterlerine işlenecektir.

Not: Bu işlem işletme içi bir kayıttır; harici belge düzenlenmez.$ml$, $ml$Kasaya para girdi (100 borç). Sermaye yükümlülüğü doğdu (500 alacak). Aktif ↑, Pasif ↑.$ml$, $ml$İşletmeye nakit sermaye konulduğunda 100 Kasa varlık olarak borçlandırılır; kaynak tarafında 500 Sermaye alacaklandırılır. Böylece hem varlıklar hem öz kaynaklar eşit miktarda artar; muhasebenin temel denklemi korunur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-2', 'kasa', $ml$Günlük Perakende Satış (Yazar Kasa Z Raporu)$ml$, 'orta', $ml$Şubemizdeki yeme-içme noktası, gün sonu Z raporuyla aşağıdaki perakende fişine konu satışı kapatmıştır. Ödemelerin tamamı nakit olarak alınmış ve kasaya teslim edilmiştir.

İşletme aralıklı envanter yöntemi uygulamaktadır; satış anında maliyet kaydı yapılmaz.

Gün sonu satış fişi "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Kasaya KDV dahil toplam girer. 600 Yurt İçi Satışlar matrah ile, 391 Hesaplanan KDV de KDV tutarı ile alacaklanır.$ml$, $ml$Peşin perakende satışlarda 100 Kasa hesabı, fişte yer alan KDV dahil toplam tutarla borçlandırılır. Yiyecek-içecek satışında matrah 600 Yurt İçi Satışlar, KDV tutarı 391 Hesaplanan KDV hesabına alacak yazılır. Aralıklı envanter olduğu için satış anında SMM kaydı yapılmaz; maliyet dönem sonu envanter farkıyla hesaplanır.$ml$, $ml$[{"tur":"perakende-fis","baslik":"GÜN SONU Z RAPORU — TOPLU SATIŞ FİŞİ","fisNo":"PSF-2026/0917","tarih":"23.04.2026","saat":"23:00","zNo":"Z-0917","ettn":"A741C29D-3F88-4E2B-9C45-71F8A9D0E33B","isletme":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ. — Cafetto Şubesi","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/A, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Filtre Kahve (Tek Servis)","miktar":60,"birimFiyat":50,"kdvOrani":10},{"aciklama":"Cappuccino","miktar":25,"birimFiyat":80,"kdvOrani":10},{"aciklama":"Tavuklu Sandviç","miktar":15,"birimFiyat":120,"kdvOrani":10},{"aciklama":"Ev Yapımı Limonlu Kek (dilim)","miktar":34,"birimFiyat":50,"kdvOrani":10}],"odemeYontemi":"NAKIT","not":"Z raporu kapsamındaki tüm satışlar peşin/nakittir. Adisyon adedi: 67."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-3', 'kasa', $ml$Su Faturasının Kasadan Ödenmesi$ml$, 'orta', $ml$ASKİ Genel Müdürlüğü tarafından şube adımıza düzenlenen su faturası, gün içinde işletme kasasından nakden ödenmiştir. Su gideri genel yönetim faaliyetlerine ilişkindir.

Fatura "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Su gideri (KDV hariç) 770'e, KDV de 191'e borç. Kasa KDV dahil toplam tutarla alacaklanır.$ml$, $ml$Genel yönetim faaliyetleriyle ilgili abonelik gider faturalarında matrah 770 Genel Yönetim Giderleri'ne borç yazılır. Faturadaki KDV indirim hakkı doğurduğu için 191 İndirilecek KDV'ye borçlandırılır. Kasa, faturadaki KDV dahil toplam tutarla alacaklandırılarak nakit çıkışı kaydedilir.$ml$, $ml$[{"tur":"fatura","baslik":"SU TÜKETİM FATURASI","faturaNo":"ASKİ-2026/4781209","tarih":"20.04.2026","ettn":"D54E2A18-9C73-4F85-B6A1-8E2D7F4C9A11","satici":{"unvan":"ANKARA SU VE KANALİZASYON İDARESİ GENEL MÜDÜRLÜĞÜ","vkn":"0710058524","vergiDairesi":"Başkent","adres":"Kazım Karabekir Cad. No: 70, Altındağ / ANKARA"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Su Tüketimi (90 m³ × 20,00 TL) — 2026/Mart","miktar":90,"birim":"M3","birimFiyat":20}],"kdvOrani":20,"odemeBilgisi":"Peşin / Nakit — vezne tahsilatı"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-4', 'kasa', $ml$Personele Kasadan İş Avansı$ml$, 'orta', $ml$Satın alma sorumlumuz İSMAİL DEMİR, İstanbul'da yapılacak depo malzeme alımı seyahati için imzalı avans makbuzu karşılığında kasadan 25.000 TL iş avansı almıştır.

İleriki günlerde fiş, fatura ve seyahat masraflarıyla mahsuplaşma yapılacaktır.

Not: Bu işlem işletme içi bir avans hareketidir; harici belge düzenlenmez.$ml$, $ml$Personel avansı geçici bir alacaktır: 196 borç. Kasa azaldığı için 100 alacak.$ml$, $ml$Personele verilen iş avansı, harcama kanıtlanıncaya kadar işletmenin personelden alacağıdır; 196 Personel Avansları hesabına borç kaydedilir. Avansın kasadan verilmesi nedeniyle 100 Kasa hesabı alacaklandırılır. Avans mahsubu (fatura/fiş ile) ileride ayrı bir kayıtla yapılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-5', 'kasa', $ml$Kasa Sayım Noksanlığı$ml$, 'orta', $ml$Dönem sonu yapılan rutin kasa sayımında kayıtlara göre 50.000 TL olması gereken kasada fiilen 48.500 TL bulunmuştur. Aradaki 1.500 TL'lik fark için sayım tutanağı düzenlenmiş, noksanlığın sebebi araştırılmaktadır.

Not: Sayım tutanağı işletme içi bir belgedir; harici fatura/dekont söz konusu değildir.$ml$, $ml$Kasa fiili kayıttan az → Kasa alacaklanır. Sebep bilinene kadar fark 197 Sayım ve Tesellüm Noksanları geçici hesabına borç yazılır.$ml$, $ml$Kasa sayım noksanlığında nedeni araştırılıncaya kadar fark, geçici bir aktif hesap olan 197 Sayım ve Tesellüm Noksanları'na borç kaydedilir; 100 Kasa fark kadar alacaklandırılarak fiili tutara indirilir. Sebep tespit edildiğinde 197 hesabı kapatılarak ilgili gider hesabına (689 Diğer Olağandışı Gider) veya personelden alacağa (135) devredilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-6', 'kasa', $ml$Kasa Sayım Fazlası$ml$, 'orta', $ml$Bir başka şubemizde yapılan dönem sonu sayımında, kayıtlara göre 75.000 TL olması gereken kasada fiilen 75.800 TL bulunmuştur. Aradaki 800 TL'lik fazlalık için sayım tutanağı düzenlenmiş, sebep henüz tespit edilememiştir.

Not: Sayım tutanağı işletme içi bir belgedir; harici belge söz konusu değildir.$ml$, $ml$Kasa fiili kayıttan fazla → Kasa borçlanır. Sebep bilinene kadar fark 397 Sayım ve Tesellüm Fazlaları geçici hesabına alacak yazılır.$ml$, $ml$Kasa sayım fazlasında nedeni araştırılıncaya kadar fark, geçici bir pasif hesap olan 397 Sayım ve Tesellüm Fazlaları'na alacak kaydedilir; 100 Kasa fark kadar borçlandırılarak fiili tutara çıkarılır. Sebep tespit edildiğinde 397 hesabı kapatılarak ilgili gelir hesabına (679 Diğer Olağandışı Gelir) veya borç hesabına devredilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-7', 'kasa', $ml$Personele Harcırah Avansı (Kasadan)$ml$, 'kolay', $ml$İşletmenin saha satış elemanı MERT KAYAN, 14 — 17 Eylül 2026 tarihleri arasında İstanbul ve Bursa'ya bayi ziyareti için iş seyahatine çıkacaktır. Konaklama, yemek ve şehir içi ulaşım masraflarında kullanılmak üzere kendisine işletme kasasından 5.000 TL harcırah avansı verilmiş ve avans makbuzu imzalatılmıştır.

Not: Avansın masraflarla mahsuplaştırılması seyahat dönüşünde, harcama belgeleri (fatura, fiş) ile birlikte gerçekleştirilecektir.$ml$, $ml$Personele verilen iş avansları → 196 Personel Avansları borç (personelden alacak). Kasadan ödeme → 100 Kasa alacak.$ml$, $ml$İş seyahati, eğitim, malzeme alımı gibi sebeplerle personele verilen avanslar 196 Personel Avansları hesabında izlenir. Bu hesap personelden alacak niteliğinde bir aktif hesaptır ve avansın belge karşılığı kapatılması (mahsup) ile sıfırlanır. İlk ödeme anında 196 borç (avans verildi → personelden alacak doğdu), 100 alacak (kasa azaldı). Mahsup zamanı geldiğinde harcamalar gider hesaplarına (770/760), vergi indirimi varsa 191'e atılır; eksik harcanan tutar varsa kasa/banka geri tahsilinde yer alır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-8', 'kasa', $ml$Kasadan Elektrik Faturası Ödemesi$ml$, 'kolay', $ml$İşletmenin Eylül 2026 dönemine ait elektrik tüketim faturası ENERJİSA Başkent Elektrik Perakende Satış A.Ş. tarafından düzenlenmiştir.

• Tüketim bedeli (matrah): 2.000 TL
• KDV (%20): 400 TL
• Toplam fatura tutarı: 2.400 TL

Fatura, son ödeme tarihi olan 25.10.2026 günü işyerine yakın bir ödeme noktasında nakden ödenmiştir. KDV indirilebilir niteliktedir (işletmenin genel yönetim faaliyetinde kullanılan elektrik).$ml$, $ml$Elektrik gideri 770 Genel Yönetim Giderleri borç (matrah). KDV 191 İndirilecek KDV borç. Toplam tutar 100 Kasa alacak.$ml$, $ml$İşyeri elektrik tüketimi 770 Genel Yönetim Giderleri hesabına matrah üzerinden gider yazılır. Faturada gösterilen KDV (400 TL) işletmenin indirim hakkı olduğu için 191 İndirilecek KDV hesabına borç olarak alınır. Toplam fatura tutarı (2.400 TL) kasadan nakit çıktığı için 100 Kasa hesabı bu tutarla alacaklandırılır. Eğer fatura banka otomatik ödeme veya talimat ile ödenseydi 100 yerine 102 Bankalar alacaklandırılırdı.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-1', 'banka', $ml$Kasadan Bankaya Para Yatırma$ml$, 'kolay', $ml$İşletme kasasında biriken 100.000 TL nakit, banka şubesine elden teslim edilerek ticari mevduat hesabımıza yatırılmıştır.

Düzenlenen işlem dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$İki aktif hesap arası transfer. Banka arttı (102 borç), Kasa azaldı (100 alacak).$ml$, $ml$Bu işlem iki aktif hesap arasındaki bir değişimdir. 100 Kasa alacaklandırılarak azaltılır, 102 Bankalar borçlandırılarak artırılır. Varlık toplamı değişmez, yalnızca varlığın bulunduğu yer değişir.$ml$, $ml$[{"tur":"dekont","baslik":"PARA YATIRMA DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260415-0014782","islemTarihi":"15.04.2026","islemSaati":"11:24","valor":"15.04.2026","islemTuru":"HAVALE","aciklama":"KASA HAVUZ HESABI > TİCARİ MEVDUAT — günlük tahsilat yatırımı","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","tutar":100000,"yon":"ALACAK","netTutar":100000,"bakiye":287450,"not":"Şube vezne işlemidir. Müşteriye nakit teslim alındığını gösterir banka kaşeli ek dekont verilmiştir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-2', 'banka', $ml$Banka Kredisi Kullanımı$ml$, 'kolay', $ml$İşletmemiz, bankadan 6 ay vadeli 250.000 TL nominal değerli işletme kredisi kullanmış; kredi tutarı aynı gün ticari mevduat hesabımıza aktarılmıştır.

Kredinin BSMV ve dosya masrafları ayrı bir dekontla tahsil edilecektir; bu kayıtta yalnızca anapara kullanımı işlenecektir.

Kredi kullanım dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Banka hesabına para girdi (102 borç). Karşılığında kısa vadeli borç doğdu (300 alacak).$ml$, $ml$Banka kredisi kullanımında varlık olarak 102 Bankalar borçlandırılır; kaynak olarak 300 Banka Kredileri alacaklandırılır. Kredi vadesi 1 yıldan kısa olduğu için 3. sınıf (kısa vadeli yabancı kaynak) hesabı kullanılır.$ml$, $ml$[{"tur":"dekont","baslik":"KREDİ KULLANIM DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260417-0019044","islemTarihi":"17.04.2026","islemSaati":"14:08","valor":"17.04.2026","islemTuru":"KREDI_KULLANIMI","aciklama":"KREDİ NO: KR-2026-04472 / 6 AY VADELİ İŞLETME KREDİSİ — ANAPARA KULLANIMI","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","tutar":250000,"yon":"ALACAK","netTutar":250000,"bakiye":537450,"not":"Faiz ve BSMV taksit ödeme dekontunda gösterilecektir. Aylık taksit: 6 eşit anapara + faiz."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-3', 'banka', $ml$Banka Havalesi ile Satıcı Borcu Ödeme$ml$, 'kolay', $ml$KARADENİZ AMBALAJ LTD. ŞTİ. satıcımıza olan 75.000 TL tutarındaki açık hesap borcumuz, bankadan satıcının IBAN'ına havale yoluyla ödenmiştir. Banka havale işlemi için ek masraf almamıştır (kurumsal müşteri tarifesi).

Havale dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Hem aktif azaldı (102) hem pasif azaldı (320). Azalan aktif alacaklanır, azalan pasif borçlanır.$ml$, $ml$Satıcıya olan borç ödendiğinde 320 Satıcılar borçlandırılarak kapatılır. Ödeme banka yoluyla yapıldığı için 102 Bankalar alacaklandırılır. Bu örnekte havale masrafı tahakkuk etmediği için ek bir gider kaydı yapılmaz.$ml$, $ml$[{"tur":"dekont","baslik":"HAVALE DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260418-0021156","islemTarihi":"18.04.2026","islemSaati":"10:32","valor":"18.04.2026","islemTuru":"HAVALE","aciklama":"AÇIK HESAP BORÇ KAPAMA — KARADENİZ AMBALAJ 2026/MART CARİ","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"KARADENİZ AMBALAJ LTD. ŞTİ.","vkn":"5638742190","adres":"OSB 3. Cad. No: 22, Arsin / TRABZON"},"karsiIban":"TR41 0006 4000 0019 8421 9036 00","tutar":75000,"masraf":0,"yon":"BORC","netTutar":75000,"bakiye":462450,"not":"Kurumsal Plus tarifesi gereği havale komisyonu tahsil edilmemiştir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-4', 'banka', $ml$Müşteriden EFT ile Tahsilat$ml$, 'orta', $ml$EFE GIDA LTD. ŞTİ. müşterimiz, mevcut açık hesap bakiyesi karşılığında 96.500 TL tutarında bir EFT göndermiştir. Tutar bugün ticari mevduat hesabımıza geçmiştir.

Gelen EFT dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Banka hesabımız arttı (102 borç), müşterinin cari hesabı azaldı (120 alacak). KDV YOK — sadece tahsilat.$ml$, $ml$Müşteriden gelen EFT ile yapılan tahsilatlarda 102 Bankalar hesabı gelen tutar kadar borçlandırılır; müşterinin cari hesabı (120 Alıcılar) aynı tutarla alacaklandırılarak alacak bakiyesi azaltılır. Bu işlem yalnızca alacak tahsilatıdır, gelir kaydı yapılmaz.$ml$, $ml$[{"tur":"dekont","baslik":"GELEN EFT DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260420-0023891","islemTarihi":"20.04.2026","islemSaati":"09:47","valor":"20.04.2026","islemTuru":"EFT","aciklama":"CARİ HESAP ÖDEME — EFE GIDA 2026/Q1 BAKİYE TAHSİLATI","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"EFE GIDA LTD. ŞTİ.","vkn":"7281904563","adres":"Yamaçevler Mah. Atatürk Cad. No: 156, Karşıyaka / İZMİR"},"karsiIban":"TR15 0009 7003 5700 9182 7340 00","tutar":96500,"yon":"ALACAK","netTutar":96500,"bakiye":558950,"not":"EFT, gönderici bankanın TCMB üzerinden talimatı ile tek seferde tamamlanmıştır."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-5', 'banka', $ml$Kredi Taksit Ödemesi (Anapara + Faiz + BSMV)$ml$, 'zor', $ml$KR-2026-04472 numaralı 6 ay vadeli işletme kredimizin ilk taksiti banka tarafından ticari hesabımızdan otomatik tahsil edilmiştir.

Taksit kompozisyonu:
• Anapara: 41.666,67 TL
• Faiz: 8.500,00 TL
• BSMV (faiz üzerinden %5): 425,00 TL
• Toplam çıkış: 50.591,67 TL

Dekont "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Anapara 300'ü düşürür (300 borç). Faiz dönem gideridir (780 Finansman Giderleri borç). BSMV de finansman gideri olarak 780'e ek borç. Tek alacak: 102 Bankalar (toplam çıkış).$ml$, $ml$Kredi taksiti çok parçalı bir kayıttır. Anapara kısmı 300 Banka Kredileri'ne borç yazılarak yükümlülük azaltılır. Faiz kısmı dönem gideri olduğu için 780 Finansman Giderleri'ne borç yazılır. Faiz üzerinden hesaplanan BSMV de finansman gideri niteliğinde sayılarak 780 hesabına eklenir. Toplam çıkış 102 Bankalar'dan alacaklandırılır.$ml$, $ml$[{"tur":"dekont","baslik":"KREDİ TAKSİT DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260517-0028347","islemTarihi":"17.05.2026","islemSaati":"03:00","valor":"17.05.2026","islemTuru":"KREDI_TAKSIT","aciklama":"KR-2026-04472 / 1. TAKSİT — Otomatik tahsilat (gece batch)","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","tutar":50591.67,"bsmv":425,"yon":"BORC","netTutar":50591.67,"bakiye":508358.33,"not":"Anapara: 41.666,67 TL · Faiz: 8.500,00 TL · BSMV (faiz × %5): 425,00 TL. Kalan 5 taksit ayın 17'sinde otomatik çekilecektir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-6', 'banka', $ml$Banka Hesap İşletim Ücreti$ml$, 'orta', $ml$Bankamız, ticari mevduat hesabımızdan üç aylık hesap işletim ücreti olarak 1.500 TL + %5 BSMV (75 TL) = toplam 1.575 TL kesinti yapmıştır. İşletme bu masrafı genel yönetim gideri olarak sınıflandırmaktadır.

Masraf dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Banka masrafı bir genel yönetim giderdir: 770 hesabı toplam tutarla borçlanır. 102 Bankalar toplam tutarla alacaklanır.$ml$, $ml$Banka hesap işletim ücretleri ve benzeri komisyonlar ticari faaliyetin sürdürülmesine yönelik genel yönetim giderlerindendir; 770 Genel Yönetim Giderleri'ne borç yazılır. BSMV de gider niteliğinde olduğu için aynı hesaba dahil edilir. Toplam çıkış 102 Bankalar'dan alacaklandırılır.$ml$, $ml$[{"tur":"dekont","baslik":"HESAP İŞLETİM ÜCRETİ DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260430-0031208","islemTarihi":"30.04.2026","islemSaati":"23:55","valor":"30.04.2026","islemTuru":"MASRAF","aciklama":"TİCARİ MEVDUAT HESAP İŞLETİM ÜCRETİ — 2026/Q2 (NİSAN)","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","tutar":1500,"bsmv":75,"yon":"BORC","netTutar":1575,"bakiye":506783.33,"not":"Üç ayda bir tahsil edilen sabit kurumsal müşteri tarifesidir. Detaylı tarife bilgisi için müşteri sözleşmesi madde 7.3."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-7', 'banka', $ml$POS Tahsilat Slipinin Bankaya Aktarımı (Komisyon Düşülerek)$ml$, 'zor', $ml$Bir önceki gün (24.05.2026) müşterilerimizden POS cihazı aracılığıyla kredi kartı ile toplam 11.800 TL tahsilat yapılmıştı ve bu tutar 108 Diğer Hazır Değerler hesabında "POS Bekleyen" olarak izleniyordu.

Bankamızın anlaşmalı POS tarifesine göre işlem hacmi üzerinden %1,7 komisyon kesintisi yapılmaktadır:

• POS toplam tahsilat: 11.800 TL
• Banka komisyonu (%1,7): 200,60 TL
• Bankaya net geçen tutar: 11.599,40 TL

25.05.2026 tarihinde valor sonrası bankaya net tutar otomatik olarak yansımış, 108 hesabındaki bekleyen tutar kapatılacaktır.$ml$, $ml$102 Bankalar borç (net tutar 11.599,40) + 653 Komisyon Giderleri (-) borç (komisyon 200,60). 108 Diğer Hazır Değerler alacak (POS tahsilat tutarının tamamı 11.800).$ml$, $ml$POS satışlarında tahsilat anında 100/600/391 kaydı yapılırken bekleyen tutar 108 Diğer Hazır Değerler hesabına alınır (POS tutarı henüz bankaya geçmemiş). Valor günü banka hesabına net tutar yansır; bu noktada 108 toplam tutar üzerinden kapatılır, 102 net tutarla borçlandırılır, fark olan komisyon 653 Komisyon Giderleri (-) hesabına gider yazılır. Komisyon vergisi (BSMV/KDV) varsa banka faturasında ayrıca gösterilir; bu örnekte komisyon brüt tutarı esas alınmıştır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-8', 'banka', $ml$EFT Komisyonu Kesintisi (Müşteri Tahsilatı Sırasında)$ml$, 'orta', $ml$Müşterimiz EFE GIDA LTD. ŞTİ., 50.000 TL tutarındaki açık hesap borcunu farklı banka üzerinden bankamıza EFT yaparak ödemiştir. EFT işleminde bankamız 30 TL EFT alış komisyonu kesinti yapmıştır.

• EFT brüt tutar (müşterinin gönderdiği): 50.000 TL
• Banka EFT alış komisyonu: 30 TL
• Hesabımıza geçen net tutar: 49.970 TL

Komisyon işletmenin gideridir; alıcılar hesabı ise tam tutarla (50.000 TL) kapanır çünkü müşteri sözleşme tutarını eksiksiz göndermiştir.$ml$, $ml$102 Bankalar borç (49.970 net) + 653 Komisyon Giderleri (-) borç (30). 120 Alıcılar alacak (50.000 — tam borç kapanışı).$ml$, $ml$Bankalar arası transferlerde alıcı banka komisyon kestiğinde, müşterinin ödediği toplam tutar (50.000) ile bankaya geçen net tutar (49.970) farklı olur. Müşterinin borcu sözleşme uyarınca tam tutarda kapatılır (120 alacak 50.000); bankaya geçen net tutar 102'ye borç yazılır (49.970); aradaki 30 TL EFT komisyonu işletmenin gideridir, 653 Komisyon Giderleri (-) hesabına borç yazılır. Bu yapı kayıp/kazanç sonucunu doğru yansıtır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-1', 'mal', $ml$Peşin Mal Alımı — Toptan Fatura$ml$, 'kolay', $ml$MERKEZ TEKSTİL A.Ş. işletmemize bir satış faturası düzenlemiştir. Fatura bedelinin tamamı işletme kasasından nakden ödenmiştir.

Fatura detayları "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Mal bedelini 153'e, KDV'yi 191'e borç yaz. Kasa KDV dahil toplam tutarla alacaklanır.$ml$, $ml$Peşin alımda mal bedeli (KDV hariç) 153 Ticari Mallar hesabına borç, KDV tutarı 191 İndirilecek KDV hesabına borç kaydedilir. Ödeme nakit yapıldığı için 100 Kasa hesabı KDV dahil toplam (60.000 TL) ile alacaklandırılır.$ml$, $ml$[{"tur":"fatura","baslik":"SATIŞ FATURASI","faturaNo":"A-2026/00478","tarih":"14.04.2026","ettn":"F47AC10B-58CC-4372-A567-0E02B2C3D479","satici":{"unvan":"MERKEZ TEKSTİL A.Ş.","vkn":"8730915624","vergiDairesi":"Beyoğlu","adres":"Kemeraltı Cad. No: 88, Karaköy / İSTANBUL"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Keten Kumaş (1 top = 50 m)","miktar":80,"birim":"TOP","birimFiyat":625}],"kdvOrani":20,"odemeBilgisi":"Peşin / Nakit"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-2', 'mal', $ml$Miktar İskontolu Alım + Navlun$ml$, 'orta', $ml$MARKA DAĞITIM LTD. ŞTİ. işletmemize miktar iskontolu bir mal faturası kesmiştir. Aynı gün satıcının anlaşmalı nakliye firması HIZLI LOJİSTİK A.Ş., malların depomuza tesliminde ayrı bir nakliye faturası düzenlemiştir.

Hem mal hem nakliye bedeli aynı gün banka havalesi ile ödenmiştir. İşletme nakliye giderini stok maliyetine eklemektedir.

Fatura detayları "Belgeyi Görüntüle" panelinde mevcuttur (2 belge).$ml$, $ml$Miktar iskontosu fiyatın bir parçasıdır, ayrı kayıt YOK; 153'e iskonto sonrası net mal bedeli (32.400) yazılır. Navlun 153'e ek borç olarak girer. KDV iki tutarın da KDV'leri toplanarak 191'e gider.$ml$, $ml$Miktar (ticari) iskontosu faturada gösterildiği için maliyete ayrı kayıt yapılmaz; 153 Ticari Mallar iskonto sonrası net tutarla (32.400 TL) borçlandırılır. Alıcının ödediği navlun stok maliyetinin bir parçasıdır ve 153 hesabına ayrıca eklenir (+900 TL). 191 İndirilecek KDV iki KDV tutarının toplamıdır (6.480 + 180 = 6.660 TL). Banka çıkışı toplam ödeme: 38.880 + 1.080 = 39.960 TL.$ml$, $ml$[{"tur":"fatura","baslik":"MAL FATURASI","faturaNo":"MD-2026/01245","tarih":"21.04.2026","ettn":"B83A2C9D-4E11-4F8B-9C3A-7D5F6E8A1B22","satici":{"unvan":"MARKA DAĞITIM LTD. ŞTİ.","vkn":"4562381907","vergiDairesi":"Bakırköy","adres":"Yenibosna Merkez Mah. Sanayi Cd. No: 17, Bahçelievler / İSTANBUL"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Sweatshirt — Bisiklet Yaka Karışık Renk","miktar":200,"birim":"AD","birimFiyat":180,"iskontoOrani":10}],"kdvOrani":20,"not":"Miktar iskontosu peşin alımdan dolayı uygulanmıştır.","odemeBilgisi":"Banka Havalesi — peşin"},{"tur":"fatura","baslik":"NAKLİYE FATURASI","faturaNo":"HL-2026/00876","tarih":"21.04.2026","ettn":"C71D8E5A-9B22-4A3F-8E61-1F2A3B4C5D60","satici":{"unvan":"HIZLI LOJİSTİK A.Ş.","vkn":"6701893245","vergiDairesi":"Esenler","adres":"Davutpaşa Cad. No: 312, Esenler / İSTANBUL"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Karayolu Yük Taşıma Hizmeti — İSTANBUL→ANKARA","miktar":1,"birim":"SEFER","birimFiyat":900}],"kdvOrani":20,"not":"MD-2026/01245 numaralı fatura malları için sevkiyat hizmeti.","odemeBilgisi":"Banka Havalesi — peşin"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-3', 'mal', $ml$Karma Ödemeli Alım — Çek + Senet$ml$, 'orta', $ml$TATLI GIDA SAN. TİC. A.Ş. işletmemize bir mal faturası kesmiştir.

Anlaşma uyarınca fatura bedelinin yarısı (108.000 TL) işletmemizin keşide ettiği 90 gün vadeli bir çek ile ödenmiş; kalan yarısı için işletmemiz 60 gün vadeli bono düzenleyerek satıcıya teslim etmiştir.

Fatura, çek ve bono "Belgeyi Görüntüle" panelinde sekmeli olarak mevcuttur.$ml$, $ml$Mal ve KDV her zamanki gibi 153/191 borç. Ödeme iki ayrı pasifi doğurur: keşide edilen çek 103 Verilen Çekler hesabını, düzenlenen bono 321 Borç Senetleri hesabını alacaklandırır.$ml$, $ml$Vadeli çekler ödenecek olduğu için 103 Verilen Çekler ve Ödeme Emirleri (-) hesabında alacak olarak takip edilir. Düzenlenen bono ise klasik senet borcu olduğundan 321 Borç Senetleri hesabına alacak yazılır. Mal bedeli ve KDV alımdaki gibi 153 ve 191 hesaplarına borç olarak girer.$ml$, $ml$[{"tur":"fatura","baslik":"MAL FATURASI","faturaNo":"TG-2026-A/00193","tarih":"03.04.2026","ettn":"D29F4B71-3A88-4C2E-95B0-6F8E9D1A2C44","satici":{"unvan":"TATLI GIDA SAN. TİC. A.Ş.","vkn":"1124578902","vergiDairesi":"Konya","adres":"Organize Sanayi Bölgesi 5. Cad. No: 9, Selçuklu / KONYA"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Tam Yağlı Süt Tozu (25 kg torba)","miktar":1500,"birim":"KG","birimFiyat":120}],"kdvOrani":20,"odemeBilgisi":"50% — 90 gün vadeli işletme çeki / 50% — 60 gün vadeli bono (alıcı keşideli)"},{"tur":"cek","baslik":"KEŞİDE EDİLEN ÇEK","cekNo":"0014729","bankaAdi":"TÜRKİYE TİCARET BANKASI A.Ş.","subeAdi":"Çankaya Şubesi","subeKodu":"0428","hesapNo":"6271894","iban":"TR47 0006 4000 0014 2806 2718 94","duzenlemeTarihi":"03.04.2026","duzenlemeYeri":"ANKARA","vadeTarihi":"02.07.2026","tutar":108000,"lehtar":"TATLI GIDA SAN. TİC. A.Ş.","kesideci":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"not":"Fatura bedelinin %50'si — TG-2026-A/00193 numaralı fatura mukabili"},{"tur":"senet","baslik":"DÜZENLENEN BONO","senetTipi":"bono","senetNo":"2026/0042","duzenlemeTarihi":"03.04.2026","duzenlemeYeri":"ANKARA","vadeTarihi":"02.06.2026","vadeYeri":"KONYA","tutar":108000,"lehtar":{"unvan":"TATLI GIDA SAN. TİC. A.Ş.","vkn":"1124578902","adres":"Organize Sanayi Bölgesi 5. Cad. No: 9, Selçuklu / KONYA"},"borclu":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"not":"malen ahz olunmuştur"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-4', 'mal', $ml$Vadeli Satış (Sürekli Envanter)$ml$, 'zor', $ml$İşletmemiz, RADYATÖR DÜNYASI LTD. ŞTİ. müşterimize 45 gün vadeli açık hesap koşuluyla bir satış faturası düzenlemiştir.

Satılan radyatörlerin stok maliyeti toplam 66.400,00 TL'dir. İşletme sürekli envanter yöntemi uygulamaktadır.

Fatura "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Sürekli envanter = İKİ ayrı kayıt yap. (1) Satış: 120 borç, 600 + 391 alacak. (2) Maliyet: 621 borç, 153 alacak.$ml$, $ml$Sürekli envanter yönteminde satış anında iki kayıt yapılır. Satış kaydında müşterinin cari hesabı (120 Alıcılar) KDV dahil toplam tutarla borçlandırılır; satış geliri 600'e, KDV ise 391 Hesaplanan KDV'ye alacak yazılır. Aynı anda satılan malın maliyeti 621 SMMM hesabına borç, 153 Ticari Mallar hesabına alacak kaydedilerek stoktan düşülür.$ml$, $ml$[{"tur":"fatura","baslik":"SATIŞ FATURASI","faturaNo":"SMB-2026/00812","tarih":"11.04.2026","ettn":"A11C7E22-9F40-4B6D-83C5-2E4B6D7F1A99","satici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"alici":{"unvan":"RADYATÖR DÜNYASI LTD. ŞTİ.","vkn":"6890124573","vergiDairesi":"Pendik","adres":"Velibaba Mah. Sanayi Cad. No: 78, Pendik / İSTANBUL"},"kalemler":[{"aciklama":"Panel Radyatör — 600x1200 mm, çift sıralı","miktar":40,"birim":"AD","birimFiyat":2250}],"kdvOrani":20,"odemeBilgisi":"Vade: 45 gün açık hesap"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-5', 'mal', $ml$Kısmi Satış İadesi$ml$, 'zor', $ml$Önceki SMB-2026/00812 numaralı satış faturasıyla RADYATÖR DÜNYASI LTD. ŞTİ.'ye gönderilen 40 panel radyatörden 6 adedi ambalaj hasarı gerekçesiyle iade edilmiş, alıcı tarafından bir iade faturası düzenlenmiştir.

İade tutarı müşterinin cari hesap bakiyesinden düşülmüştür. İade edilen radyatörlerin birim maliyeti 1.660,00 TL olup (toplam 9.960,00 TL) stoka geri alınmıştır. Sürekli envanter yöntemi kullanılmaktadır.

İade faturası "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$İki kayıt: (1) Satış iadesi: 610 + 391 borç, 120 alacak. (2) Stok geri alımı: 153 borç, 621 alacak. KDV burada 391 borç (önceden hesapladığımız KDV iptal ediliyor).$ml$, $ml$610 Satıştan İadeler (-) hesabı satış gelirinin azaltıcısıdır ve iade edilen mal bedeliyle borçlandırılır. Daha önce 391'e alacak yazdığımız KDV iptal edildiği için 391 Hesaplanan KDV bu sefer borç tarafına yazılır. Alıcının cari hesabı (120) iade tutarıyla alacaklanarak bakiyesi azalır. Sürekli envanterde stoka geri giren mal için 153 borç, 621 SMMM alacak kaydı yapılır.$ml$, $ml$[{"tur":"fatura","baslik":"İADE FATURASI","faturaTipi":"iade","faturaNo":"IF-2026/00008","tarih":"16.04.2026","ettn":"E50B3F8C-1D77-4F90-B3A2-9E1A4C5D6F70","satici":{"unvan":"RADYATÖR DÜNYASI LTD. ŞTİ.","vkn":"6890124573","vergiDairesi":"Pendik","adres":"Velibaba Mah. Sanayi Cad. No: 78, Pendik / İSTANBUL"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Panel Radyatör — 600x1200 mm, çift sıralı (ambalaj hasarlı)","miktar":6,"birim":"AD","birimFiyat":2250}],"kdvOrani":20,"not":"SMB-2026/00812 numaralı fatura için kısmi iade. İade tutarı cari hesaptan mahsup edilecektir.","odemeBilgisi":"Cari hesap mahsubu"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-6', 'mal', $ml$KDV Dahil Peşin Satış (Perakende)$ml$, 'orta', $ml$İşletmemiz perakende müşterisine peşin satış yapmış ve bir perakende satış fişi düzenlemiştir. Bedel kasaya nakden tahsil edilmiştir.

Satılan malların stok maliyeti 7.800,00 TL'dir. İşletme sürekli envanter yöntemi kullanmaktadır.

Dikkat: Fişteki tutar KDV DAHİL — kayıt yaparken ayrıştırmayı unutma.

Fiş "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$KDV DAHİL tutar verildi — önce ayrıştır: 14.400 / 1,20 = 12.000 mal bedeli, 2.400 KDV. Sonra normal sürekli envanter satış kaydı yap.$ml$, $ml$KDV dahil tutar ayrıştırılırken 1+KDV oranına bölünür: 14.400 / 1,20 = 12.000 TL mal bedeli. KDV ise 14.400 - 12.000 = 2.400 TL'dir. 100 Kasa KDV dahil toplam tutarla borçlandırılır; 600 Yurt İçi Satışlar mal bedeli ile, 391 Hesaplanan KDV ise KDV tutarı ile alacaklandırılır. Sürekli envanter olduğu için ayrıca 621 SMMM borç, 153 Ticari Mallar alacak kaydı maliyet için yapılır.$ml$, $ml$[{"tur":"perakende-fis","baslik":"PERAKENDE SATIŞ FİŞİ","fisNo":"PSF-2026/04117","tarih":"08.04.2026","saat":"14:32","zNo":"0419","ettn":"F92A1B47-3C58-4D2E-9810-7B6C5D4E3F21","isletme":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulv. No:142/5 Çankaya/ANKARA"},"kalemler":[{"aciklama":"Filtre Kahve Makinesi","miktar":1,"birimFiyat":5500,"kdvOrani":20},{"aciklama":"Çay Demlik Seti","miktar":2,"birimFiyat":2250,"kdvOrani":20},{"aciklama":"Ahşap Sehpa","miktar":1,"birimFiyat":2000,"kdvOrani":20}],"odemeYontemi":"NAKIT"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-7', 'mal', $ml$Alış İadesi — Hatalı Mal Satıcıya Geri Gönderme$ml$, 'orta', $ml$Daha önce MERKEZ TEKSTİL A.Ş.'den açık hesapta satın aldığımız ticari mallardan bir kısmının kalitesizlik / üretim hatası nedeniyle satıcıya iadesine karar verilmiştir. Satıcı bu iade için tarafımıza iade faturası düzenlemiş, mallar gönderilmiştir.

• İade edilen mal bedeli (matrah): 5.000 TL
• İade KDV (%20): 1.000 TL
• İade toplam tutar: 6.000 TL

İade tutarı satıcı cari hesabımızdan düşülecek; ticari mal stoğu azalacak; ilk alışta indirim hakkı kullanılan KDV ise iptal edilerek 191 İndirilecek KDV hesabından çıkarılacaktır.

Not: Sürekli envanter sistemi uygulandığı için stok hareketi doğrudan 153 üzerinden işlenir.$ml$, $ml$320 Satıcılar borç (toplam tutar — borcumuz azalır). 153 Ticari Mallar alacak (stoktan çıkış) + 191 İndirilecek KDV alacak (önceden indirilen KDV iptali).$ml$, $ml$Mal alış iadesi, alış işleminin tam tersidir. İlk alış kaydında 153 borç (mal bedeli), 191 borç (KDV), 320 alacak (toplam) olmuştu. İade kaydında bunların tam tersi yapılır: 320 borç (satıcı borcumuz azalır), 153 alacak (stok azalır), 191 alacak (önceden indirilen KDV iptal edilir). Satıcının düzenlediği iade faturası bu kaydın belgesi olur. KDV iadesi 191'den düşürüldüğü için bir sonraki KDV beyannamesinde indirilebilir KDV tutarı bu kadar azalmış olarak görünür.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-8', 'mal', $ml$Sürekli Envanter — Yıl Sonu Sayım Noksanı$ml$, 'orta', $ml$31 Aralık 2026 dönem sonu fiili stok sayımı tamamlanmıştır. Sürekli envanter sistemi uygulayan işletmemizin defterlerine göre 153 Ticari Mallar hesabı bakiyesi 80.000 TL'dir; ancak fiili sayım sonucu deposundaki mal mevcudunun 78.500 TL olduğu tespit edilmiştir.

Aradaki 1.500 TL'lik fark, sebebi henüz tam olarak araştırılmadığı için "sayım noksanı" olarak geçici hesaba alınacaktır. Sayım tutanağı düzenlenmiş, depo sorumlusu tarafından imzalanmıştır.

Not: Sayım sonrası araştırma sonucunda fark; (a) zayi olmuş mal, (b) çalınma, veya (c) defter kayıt hatası olarak nihai bir hesaba aktarılacaktır.$ml$, $ml$197 Sayım ve Tesellüm Noksanları borç (geçici aktif — neden araştırılana kadar). 153 Ticari Mallar alacak (stok defter değeri eksiği).$ml$, $ml$Sürekli envanter sisteminde defter ile fiili sayım arasındaki fark, sebep tespit edilene kadar 197 Sayım ve Tesellüm Noksanları geçici hesabına alınır. 197 borç (defter değerini fiile uyumlu hale getiren bir aktif geçici hesap), 153 alacak (stok defter bakiyesi düşürülür). Sebep belirlendiğinde 197 hesabı kapatılır: zayi/çalınma ise 689 Diğer Olağandışı Gider ve Zararlar (-) borç / 197 alacak; eğer kayıt hatası ise düzeltme kaydı yapılır. Aralıklı envanter yönteminde bu kayıt yapılmaz çünkü dönem içi stok hareketleri zaten 153'e işlenmemiş olur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-1', 'senet', $ml$Müşteriden Vadeli Çek Alma$ml$, 'kolay', $ml$YEŞİL VADİ MARKETLERİ A.Ş. müşterimiz, daha önce vadeli açık hesap satışlarımızdan doğan 60.000 TL tutarındaki cari hesap borcuna karşılık ileri tarihli kendi keşide ettiği bir çek getirmiştir.

Çek bankaya ibraz edilmek üzere kasaya alınmıştır.

Çek "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Alacak biçim değiştirdi: 120'den 101'e döndü. İki aktif hesap arası değişim — KDV YOK.$ml$, $ml$Çek vadeli olsa bile alındığı anda 101 Alınan Çekler hesabına borç kaydedilir. 120 Alıcılar hesabı kapatılarak alacaklandırılır. Bu işlem yalnızca alacağın türünü değiştirir; gelir veya satış değildir, KDV doğmaz.$ml$, $ml$[{"tur":"cek","baslik":"MÜŞTERİDEN ALINAN ÇEK","cekNo":"8472019","bankaAdi":"EGE HALK BANKASI A.Ş.","subeAdi":"Bornova Şubesi","subeKodu":"0612","hesapNo":"4471882","iban":"TR62 0001 2009 6120 0044 7188 20","duzenlemeTarihi":"08.04.2026","duzenlemeYeri":"İZMİR","vadeTarihi":"07.07.2026","tutar":60000,"lehtar":"ÖRNEK TİCARET LTD. ŞTİ.","kesideci":{"unvan":"YEŞİL VADİ MARKETLERİ A.Ş.","vkn":"4527819036","adres":"Manas Bulvarı No: 47, Bornova / İZMİR"},"not":"Cari hesap kapaması — 2026/Q1 dönemi açık hesap bakiyesi mukabili"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-2', 'senet', $ml$Satıcıya Bono Düzenleme — Borç Yenileme$ml$, 'kolay', $ml$KARADENİZ AMBALAJ LTD. ŞTİ. satıcısına olan 80.000 TL tutarındaki açık hesap borcumuz için işletmemiz 60 gün vadeli bono düzenleyip teslim etmiştir.

Düzenlenen bono "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Borcun şekli değişti: 320 (açık) → 321 (senetli). Pasif türleri arası dönüşüm — KDV YOK.$ml$, $ml$Bono verildiğinde açık hesaptaki borç kapatılarak senetli borca dönüşür. 320 Satıcılar borçlandırılarak kapatılır; 321 Borç Senetleri yeni yükümlülük olarak alacaklandırılır. Borç tutarı değişmez, yalnızca türü değişir.$ml$, $ml$[{"tur":"senet","baslik":"DÜZENLENEN BONO","senetTipi":"bono","senetNo":"2026/0067","duzenlemeTarihi":"15.04.2026","duzenlemeYeri":"ANKARA","vadeTarihi":"14.06.2026","vadeYeri":"TRABZON","tutar":80000,"lehtar":{"unvan":"KARADENİZ AMBALAJ LTD. ŞTİ.","vkn":"5638742190","adres":"OSB 3. Cad. No: 22, Arsin / TRABZON"},"borclu":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"not":"malen ahz olunmuştur"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-3', 'senet', $ml$Vadeli Mal Satışı + Müşteri Çeki$ml$, 'orta', $ml$İşletmemiz EFE GIDA LTD. ŞTİ. müşterisine bir satış faturası düzenlemiştir. Fatura bedelinin tamamı, müşterinin aynı gün keşide ettiği 60 gün vadeli kendi banka çeki ile tahsil edilmiştir.

İşletme aralıklı envanter yöntemi uygulamaktadır.

Fatura ve çek "Belgeyi Görüntüle" panelinde sekmeli olarak mevcuttur.$ml$, $ml$Aralıklı envanter = TEK kayıt yap, maliyet kaydı yok. 101 Alınan Çekler KDV dahil toplamla borçlanır; 600 ve 391 alacaklanır.$ml$, $ml$Vadeli müşteri çekiyle yapılan tahsilatlarda 101 Alınan Çekler hesabı KDV dahil toplam tutarla borçlandırılır (cari hesap zaten doğmadan kapanmış olur). 600 Yurt İçi Satışlar mal bedeline eşit alacaklanır; 391 Hesaplanan KDV satış üzerinden alacaklanır. Aralıklı envanterde maliyet kaydı dönem sonunda yapılır, satış anında ayrıca SMM kaydı yapılmaz.$ml$, $ml$[{"tur":"fatura","baslik":"SATIŞ FATURASI","faturaNo":"SMB-2026/00891","tarih":"18.04.2026","ettn":"C92F4D17-8B62-4E3A-A7C9-1D8E5F2B6C44","satici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"alici":{"unvan":"EFE GIDA LTD. ŞTİ.","vkn":"7281904563","vergiDairesi":"Karşıyaka","adres":"Yamaçevler Mah. Atatürk Cad. No: 156, Karşıyaka / İZMİR"},"kalemler":[{"aciklama":"Çiğ Köfte Karışımı (5 kg pkt)","miktar":200,"birim":"PKT","birimFiyat":380},{"aciklama":"Acılı Salça (10 kg teneke)","miktar":80,"birim":"AD","birimFiyat":550}],"kdvOrani":20,"odemeBilgisi":"Müşteri keşideli 60 gün vadeli çek (no: 4731298)"},{"tur":"cek","baslik":"TAHSİL EDİLEN MÜŞTERİ ÇEKİ","cekNo":"4731298","bankaAdi":"EGE BÖLGE BANKASI A.Ş.","subeAdi":"Karşıyaka Şubesi","subeKodu":"0357","hesapNo":"9182734","iban":"TR15 0009 7003 5700 9182 7340 00","duzenlemeTarihi":"18.04.2026","duzenlemeYeri":"İZMİR","vadeTarihi":"17.06.2026","tutar":144000,"lehtar":"ÖRNEK TİCARET LTD. ŞTİ.","kesideci":{"unvan":"EFE GIDA LTD. ŞTİ.","vkn":"7281904563","adres":"Yamaçevler Mah. Atatürk Cad. No: 156, Karşıyaka / İZMİR"},"not":"SMB-2026/00891 numaralı fatura mukabili — KDV dahil toplam tutar"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-4', 'senet', $ml$Alınan Çekin Satıcıya Ciro Edilmesi$ml$, 'orta', $ml$Daha önce müşterimiz YEŞİL VADİ MARKETLERİ A.Ş.'den aldığımız 60.000 TL tutarındaki çek, KARADENİZ AMBALAJ LTD. ŞTİ. satıcımıza olan açık hesap borcumuza karşılık ciro edilerek devredilmiştir.

Ciro edilen çek "Belgeyi Görüntüle" panelinde mevcuttur (arka yüze cironun düşüldüğü kabul edilir).$ml$, $ml$Aldığımız çek elden çıktı (101 alacak), satıcıya borç kapandı (320 borç). KDV YOK — sadece ödeme aracı transferi.$ml$, $ml$Bir aktif (101 Alınan Çekler) bir pasifi (320 Satıcılar) kapatmak için kullanıldığında, çek hesabı alacaklandırılarak elden çıktığı gösterilir, satıcı hesabı borçlandırılarak borç tasfiye edilir. Çek üzerine "ciro edilmiştir" şerhi düşülür ve karşı tarafa imzalı olarak teslim edilir.$ml$, $ml$[{"tur":"cek","baslik":"CİRO EDİLEN ÇEK","cekNo":"8472019","bankaAdi":"EGE HALK BANKASI A.Ş.","subeAdi":"Bornova Şubesi","subeKodu":"0612","hesapNo":"4471882","iban":"TR62 0001 2009 6120 0044 7188 20","duzenlemeTarihi":"08.04.2026","duzenlemeYeri":"İZMİR","vadeTarihi":"07.07.2026","tutar":60000,"lehtar":"ÖRNEK TİCARET LTD. ŞTİ.","kesideci":{"unvan":"YEŞİL VADİ MARKETLERİ A.Ş.","vkn":"4527819036","adres":"Manas Bulvarı No: 47, Bornova / İZMİR"},"not":"Arka yüze ciro: KARADENİZ AMBALAJ LTD. ŞTİ. emrine ödeyiniz — 22.04.2026 / Ankara"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-5', 'senet', $ml$Düzenlenen Bonun Vadesinde Ödenmesi$ml$, 'orta', $ml$Önceden KARADENİZ AMBALAJ LTD. ŞTİ. satıcısına düzenleyip verdiğimiz 80.000 TL nominal değerli bono, bugün vade tarihinde lehtar tarafından bankamıza ibraz edilmiş ve banka hesabımızdan ödenmiştir.

Vadesi gelen bono "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Senet borcu kapandı (321 borç), banka çıkışı (102 alacak).$ml$, $ml$Düzenlediğimiz bono vadesinde lehtar tarafından bankaya ibraz edildiğinde 321 Borç Senetleri hesabı borçlandırılarak yükümlülük kapatılır; 102 Bankalar hesabı senet bedeli kadar alacaklandırılarak banka mevduatından çıkış yapılır.$ml$, $ml$[{"tur":"senet","baslik":"VADESİ GELEN BONO","senetTipi":"bono","senetNo":"2026/0067","duzenlemeTarihi":"15.04.2026","duzenlemeYeri":"ANKARA","vadeTarihi":"14.06.2026","vadeYeri":"TRABZON","tutar":80000,"lehtar":{"unvan":"KARADENİZ AMBALAJ LTD. ŞTİ.","vkn":"5638742190","adres":"OSB 3. Cad. No: 22, Arsin / TRABZON"},"borclu":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"not":"Vadesinde bankaya ibraz edilmiş, mevduattan ödenmiştir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-6', 'senet', $ml$Karşılıksız Çek — Müşteri Çekinin İadesi$ml$, 'zor', $ml$Daha önce EFE GIDA LTD. ŞTİ. müşterimizden tahsil ettiğimiz 144.000 TL nominal değerli çek, vadesinde bankamıza ibraz edildiğinde keşidecinin hesabında yeterli bakiye bulunmadığı için karşılıksız işlemine konu olmuştur. Banka çekin arka yüzüne karşılıksızdır şerhi düşerek tarafımıza iade etmiştir.

İşletmemiz çek bedelini müşterinin yeniden ticari alacak kaydına aktararak takipe almıştır.

Karşılıksız çek "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Çek elden çıktı ama tahsilat olmadı — alacak yeniden doğdu. 120 borç / 101 alacak. Aynı tutar, sadece hesap değişti.$ml$, $ml$Karşılıksız çıkan müşteri çeki, çek özelliğini kaybedip tekrar ticari alacağa dönüşür. 101 Alınan Çekler hesabı çek bedeli kadar alacaklandırılarak kapatılır; alacak müşteriden yeniden takip edileceği için 120 Alıcılar hesabına aynı tutarla borç kaydedilir. Karşılıksız çek için ileride şüpheli alacak takibi yapılması gündeme gelebilir (128 Şüpheli Ticari Alacaklar).$ml$, $ml$[{"tur":"cek","baslik":"KARŞILIKSIZ ÇIKAN ÇEK","cekNo":"4731298","bankaAdi":"EGE BÖLGE BANKASI A.Ş.","subeAdi":"Karşıyaka Şubesi","subeKodu":"0357","hesapNo":"9182734","iban":"TR15 0009 7003 5700 9182 7340 00","duzenlemeTarihi":"18.04.2026","duzenlemeYeri":"İZMİR","vadeTarihi":"17.06.2026","tutar":144000,"lehtar":"ÖRNEK TİCARET LTD. ŞTİ.","kesideci":{"unvan":"EFE GIDA LTD. ŞTİ.","vkn":"7281904563","adres":"Yamaçevler Mah. Atatürk Cad. No: 156, Karşıyaka / İZMİR"},"not":"Banka şerhi: KARŞILIKSIZDIR — 17.06.2026 / yetersiz bakiye. Çek 5941 sayılı kanun kapsamında işleme alınmıştır."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-7', 'senet', $ml$Çekin Ciro Edilerek Satıcıya Verilmesi$ml$, 'orta', $ml$İşletmemizin ÖNDER ELEKTRİK MALZEMELERİ LTD. ŞTİ.'ye olan 25.000 TL'lik açık hesap borcu için, daha önce müşterimiz YEŞİL VADİ MARKETLERİ A.Ş.'den almış olduğumuz 25.000 TL nominal değerli vadeli banka çeki (101 Alınan Çekler hesabında bakiyeli) ciro edilerek satıcıya teslim edilmiştir.

Çekin arkasına ciro şerhi yazılarak ÖNDER ELEKTRİK'e devredilmiş, çek elden teslim alınmıştır. Bu işlemle:

• 320 Satıcılar hesabındaki 25.000 TL'lik borcumuz kapanır
• 101 Alınan Çekler hesabındaki 25.000 TL'lik çek portföyümüzden çıkar

Not: Çek "Belgeyi Görüntüle" panelinde mevcuttur. Ciro işlemi Türk Ticaret Kanunu hükümlerince çekin arkasına atılan imza ile gerçekleşir.$ml$, $ml$320 Satıcılar borç (borcumuz azalır) → 101 Alınan Çekler alacak (çek portföyümüzden çıkar). KDV yok, sadece bilanço hesapları arası bir aktarım.$ml$, $ml$Alınan çek portföydeyken üçüncü bir kişiye ciro yoluyla devredilebilir. Bu durumda çek nakit gibi davranarak borcun ödenmesinde kullanılır. Muhasebe açısından 320 Satıcılar hesabı borcun nominal tutarıyla borçlandırılarak kapatılır; 101 Alınan Çekler hesabı aynı tutarla alacaklandırılarak portföyden çıkarılır. Ciro eden işletme çekin arkasındaki ciro silsilesinde yer alır ve TTK uyarınca çekin ödenmemesi durumunda rücu sorumluluğu (müteselsil sorumluluk) doğar.$ml$, $ml$[{"tur":"cek","baslik":"CİRO EDİLEN BANKA ÇEKİ","cekNo":"C-7841302","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Mecidiyeköy Şubesi","subeKodu":"0421","hesapNo":"0421-1083742","iban":"TR54 0008 9000 0421 1083 7420 00","duzenlemeTarihi":"03.04.2026","duzenlemeYeri":"İSTANBUL","vadeTarihi":"15.07.2026","tutar":25000,"lehtar":"ÖRNEK TİCARET LTD. ŞTİ.","kesideci":{"unvan":"YEŞİL VADİ MARKETLERİ A.Ş.","vkn":"8430216578","adres":"Levent Mah. Büyükdere Cad. No: 76, Beşiktaş / İSTANBUL"},"not":"Çekin arka yüzü: \"İşbu çek bedelini ÖNDER ELEKTRİK MALZEMELERİ LTD. ŞTİ.'ne ödeyiniz\" şeklinde ciro edilmiş ve işletme yetkilisi tarafından imzalanmıştır."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-8', 'senet', $ml$Senedin Bankaya İskonto Ettirilmesi$ml$, 'zor', $ml$İşletmenin nakit ihtiyacı sebebiyle, portföyünde bulunan 50.000 TL nominal değerli ve 60 gün sonra vadesi gelecek alacak senedi bankada iskonto ettirilmiştir. Bankamız iç iskonto formülü ile faizi düşerek net tutarı hesabımıza yatırmıştır.

• Senet nominal değeri: 50.000 TL
• Vadeye kalan gün: 60
• Banka iskonto faiz oranı: %30 yıllık
• İskonto faizi: F = (50.000 × 60 × 30) / (36.000 + 60 × 30) = 90.000.000 / 37.800 = **2.380,95 TL**
• Banka komisyonu (BSMV dahil): 200,00 TL
• Hesabımıza geçen net tutar: 50.000 − 2.380,95 − 200 = **47.419,05 TL**

İskonto işlemi senedin nominal değer üzerinden bankaya devri demektir; senet 121 Alacak Senetleri portföyünden çıkar. Ödenmezse banka senedi protesto edip işletmeye rücu eder.$ml$, $ml$102 Bankalar borç (net tutar 47.419,05) + 780 Finansman Giderleri borç (iskonto faizi 2.380,95) + 653 Komisyon Giderleri (-) borç (200). 121 Alacak Senetleri alacak (nominal 50.000).$ml$, $ml$Senedin bankaya iskonto ettirilmesi, vade öncesi nakte çevirme yöntemidir. Banka iskonto faizini iç iskonto formülüyle hesaplayarak nominal değerden düşer ve net tutarı işletme hesabına yatırır. Muhasebede 121 Alacak Senetleri nominal değerle alacaklandırılarak portföyden tamamen çıkarılır. Net banka girişi 102 Bankalar'a, iskonto faizi 780 Finansman Giderleri'ne, komisyon ise 653 Komisyon Giderleri (-) hesabına gider yazılır. Toplam borç (47.419,05 + 2.380,95 + 200) ile alacak (50.000) eşit olur. Senet vadesinde ödenirse banka tahsil eder; ödenmezse banka işletmeye rücu ederek senedi geri vereceği için 121 hesabı yeniden açılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-1', 'kdv', $ml$Ay Sonu Mahsubu — Ödenecek KDV$ml$, 'orta', $ml$Nisan/2026 dönemi sonunda işletmenin 191 İndirilecek KDV hesabında 18.000 TL borç bakiyesi, 391 Hesaplanan KDV hesabında ise 25.000 TL alacak bakiyesi bulunmaktadır. İşletme dönem KDV mahsubunu yapacaktır.

Not: KDV mahsubu işletme içi bir dönem kapanış kaydıdır; harici belge düzenlenmez.$ml$, $ml$Hesaplanan > İndirilecek → aradaki fark 360 Ödenecek Vergi ve Fonlar'a alacak.$ml$, $ml$Hesaplanan KDV İndirilecek KDV'den fazla ise aradaki fark devlete ödenecek tutardır. Ay sonu kaydında 391 Hesaplanan KDV borçlandırılarak alacak bakiyesi kapatılır; 191 İndirilecek KDV alacaklandırılarak borç bakiyesi kapatılır; aradaki fark 360 Ödenecek Vergi ve Fonlar hesabına alacak kaydedilir. Bu tutar 26 Mayıs akşamına kadar beyan edilip ödenir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-2', 'kdv', $ml$Ay Sonu Mahsubu — Devreden KDV$ml$, 'orta', $ml$Mayıs/2026 dönemi sonunda 191 İndirilecek KDV hesabında 30.000 TL borç bakiyesi, 391 Hesaplanan KDV hesabında ise 22.000 TL alacak bakiyesi bulunmaktadır. İşletme bu ay için KDV mahsubunu yapacaktır.

Not: KDV mahsubu işletme içi bir dönem kapanış kaydıdır; harici belge düzenlenmez.$ml$, $ml$İndirilecek > Hesaplanan → aradaki fark 190 Devreden KDV'ye borç (sonraki aya aktarılır).$ml$, $ml$İndirilecek KDV Hesaplanan KDV'den fazla ise aradaki fark ödenmek yerine sonraki döneme devredilir. 391 Hesaplanan KDV borçlandırılarak kapatılır; 190 Devreden KDV aradaki fark kadar borçlandırılarak sonraki aya aktarma yapılır; 191 İndirilecek KDV toplam tutarla alacaklandırılarak kapatılır. 190 hesabının bakiyesi haziran ayı açılışında aktif olarak gelir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-3', 'kdv', $ml$Önceki Dönemden Devreden KDV ile Mahsup$ml$, 'orta', $ml$Haziran/2026 dönemi sonunda hesap bakiyeleri aşağıdaki gibidir:
• 190 Devreden KDV (önceki aydan devir): 8.000 TL borç
• 191 İndirilecek KDV (cari ay alışları): 24.000 TL borç
• 391 Hesaplanan KDV (cari ay satışları): 40.000 TL alacak

İşletme dönem KDV mahsubunu yapacaktır.

Not: KDV mahsubu işletme içi bir dönem kapanış kaydıdır; harici belge düzenlenmez.$ml$, $ml$391 borç (40.000) → 190 + 191 alacaklanır (8.000 + 24.000 = 32.000) → kalan fark 360 alacak (8.000).$ml$, $ml$Devreden KDV hesabı önceki dönemlerden taşıdığı bakiye ile indirim hakkını büyütür. Mahsup sırasında 391 Hesaplanan KDV bakiyesi borçlandırılarak kapatılır; 190 Devreden KDV ve 191 İndirilecek KDV bakiyeleri alacaklandırılarak kapatılır. Hesaplanan KDV, devreden + indirilecek toplamından büyükse kalan fark 360 Ödenecek Vergi ve Fonlar'a alacak kaydedilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-4', 'kdv', $ml$Ödenecek KDV'nin Bankadan Ödenmesi$ml$, 'orta', $ml$Nisan/2026 dönemine ait 7.000 TL tutarındaki ödenecek KDV, 26 Mayıs 2026 tarihinde internet vergi dairesi üzerinden bankamızdan otomatik olarak tahsil edilmiştir.

Banka dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Vergi borcu kapandı (360 borç), banka çıkışı (102 alacak). Hesap ile karşı taraf: Hazine.$ml$, $ml$KDV beyanı sonucu tahakkuk ettirilen 360 Ödenecek Vergi ve Fonlar, ödeme sırasında borçlandırılarak kapatılır; 102 Bankalar aynı tutarla alacaklandırılır. Bu kayıt ile bir önceki ay sonu yapılan mahsup kaydından gelen vergi borcu nakden tasfiye edilmiş olur.$ml$, $ml$[{"tur":"dekont","baslik":"VERGİ DAİRESİ TAHSİLAT DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260526-0029413","islemTarihi":"26.05.2026","islemSaati":"16:42","valor":"26.05.2026","islemTuru":"HAVALE","aciklama":"KDV BEYANNAMESİ 2026/04 — MADDE 1 KDV ÖDEMESİ (T.No: 2026/0428/7892144)","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"T.C. HAZİNE VE MALİYE BAKANLIĞI — ÇANKAYA VERGİ DAİRESİ BAŞKANLIĞI","vkn":"0720062187","adres":"Ziya Gökalp Cad. No: 27, Çankaya / ANKARA"},"tutar":7000,"yon":"BORC","netTutar":7000,"bakiye":499783.33,"not":"İnternet vergi dairesi üzerinden başlatılan tahsilat talimatı ile otomatik ödenmiştir. Tahakkuk numarası ile eşleşme başarılı."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-5', 'kdv', $ml$Kısmi Tevkifatlı Hizmet Alımı (Alıcı Tarafı)$ml$, 'zor', $ml$İşletmemiz, genel yönetim binamızın dış cephe boyama işi için BİRAY İNŞAAT TAAHHÜT LTD. ŞTİ. firmasıyla anlaşmıştır. İş tamamlanmış, firma aşağıdaki faturayı tevkifatlı olarak düzenlemiştir.

Yapım işleri için KDV tevkifatı oranı 4/10'dur — KDV'nin 4/10'u alıcı tarafından sorumlu sıfatıyla beyan edilecek, 6/10'u ise faturada gösterilerek satıcıya ödenecektir.

Fatura bedelinin satıcıya ödenecek kısmı banka havalesi ile hemen gönderilmiştir. Tevkifat KDV'si dönem beyanında ödenecektir.

Fatura "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Alıcı: gider (770) + KDV'nin tamamı (191) borç → satıcıya ödenen (102 alacak) + tevkifat (360 alacak).$ml$, $ml$Kısmi tevkifatlı alımda alıcı indirim hakkını KDV'nin tamamı üzerinden kullanır: matrah 770'e, KDV tutarının tamamı 191'e borç yazılır. Satıcıya fiilen ödenen kısım (matrah + KDV'nin 6/10'u) 102 Bankalar'dan alacaklanır. KDV'nin 4/10'luk tevkifat kısmı alıcının kendisi tarafından Hazine adına beyan edilir ve 360 Ödenecek Vergi ve Fonlar'a alacak yazılır. Toplam borç = toplam alacak (120.000 = 112.000 + 8.000).$ml$, $ml$[{"tur":"fatura","baslik":"HİZMET FATURASI (KDV TEVKİFATLI)","faturaNo":"BR-2026/00614","tarih":"12.05.2026","ettn":"E18D3A47-9B21-4C5F-A2D4-6E7B1F9A8C33","satici":{"unvan":"BİRAY İNŞAAT TAAHHÜT LTD. ŞTİ.","vkn":"2849163057","vergiDairesi":"Yenimahalle","adres":"İvedik OSB 1463. Cad. No: 72, Yenimahalle / ANKARA"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Genel yönetim binası dış cephe boya + izolasyon işçiliği (malzeme dahil)","miktar":1,"birim":"ADET","birimFiyat":100000}],"kdvOrani":20,"tevkifatPay":4,"tevkifatPayda":10,"tevkifatAciklama":"117 Seri No.lu KDV GT md. 3.2.1 — Yapım işleri 4/10 kısmi tevkifat uygulaması","odemeBilgisi":"Satıcıya ödenecek: 112.000 TL (banka havalesi) / Tevkifat KDV: 8.000 TL (alıcı sorumlu sıfatıyla beyan edecek)"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-6', 'kdv', $ml$Kısmi Tevkifatlı Hizmet Satışı (Satıcı Tarafı)$ml$, 'zor', $ml$İşletmemiz müşterimiz MARKA DAĞITIM LTD. ŞTİ.'nin deposunda yaptığı elektrik tesisatı tadilat işini tamamlamış ve aşağıdaki tevkifatlı faturayı düzenlemiştir.

Yapım işleri için KDV tevkifatı oranı 4/10'dur — biz satıcı olarak KDV'nin yalnızca 6/10'unu faturada tahsil ederiz (391'e alacak). 4/10'luk tevkifat kısmı, alıcı tarafından sorumlu sıfatıyla beyan edileceği için bizim hesaplarımıza girmez.

Fatura bedelinin tamamı (matrah + 6/10 KDV) aynı gün banka havalesi ile tahsil edilmiştir.

Fatura "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Satıcı: 102 borç (tahsil ettiği tutar) → 600 + 391 alacak. 391'e YALNIZCA 6/10'luk kısım yazılır, tevkifat kısmı alıcıyı ilgilendirir.$ml$, $ml$Kısmi tevkifatlı satışta satıcı, faturadaki matrahı 600 Yurt İçi Satışlar'a; faturada gösterilen KDV'nin tevkifata tabi olmayan 6/10'luk kısmını 391 Hesaplanan KDV'ye alacak yazar. Tevkifat edilen 4/10'luk KDV kısmı alıcı tarafından Hazine'ye ödeneceği için satıcının defterlerine girmez. 102 Bankalar hesabı yalnızca fiilen tahsil edilen tutar (matrah + KDV'nin 6/10'u) kadar borçlandırılır.$ml$, $ml$[{"tur":"fatura","baslik":"HİZMET FATURASI (KDV TEVKİFATLI)","faturaNo":"SMB-2026/00934","tarih":"22.05.2026","ettn":"B71A5C38-4D62-4E19-8B3F-2D7E4F1A9C66","satici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"alici":{"unvan":"MARKA DAĞITIM LTD. ŞTİ.","vkn":"9873621045","vergiDairesi":"Ümraniye","adres":"Yukarı Dudullu Mah. Nato Yolu Cad. No: 88, Ümraniye / İSTANBUL"},"kalemler":[{"aciklama":"Depo elektrik tesisatı yenileme (malzeme + işçilik + test-devreye alma)","miktar":1,"birim":"ADET","birimFiyat":100000}],"kdvOrani":20,"tevkifatPay":4,"tevkifatPayda":10,"tevkifatAciklama":"117 Seri No.lu KDV GT md. 3.2.1 — Yapım işleri 4/10 kısmi tevkifat uygulaması","odemeBilgisi":"Tarafımızca tahsil edilen: 112.000 TL (matrah + KDV'nin 6/10'u). Tevkifat KDV (8.000 TL) alıcı tarafından beyan edilecektir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-7', 'kdv', $ml$Binek Otomobil KDV'sinin Maliyete İlavesi$ml$, 'orta', $ml$İşletme, genel müdür kullanımı için 800.000 TL + KDV (%20 = 160.000 TL) toplam 960.000 TL bedel ile bir binek otomobil satın almış ve bedeli bankamızdan satıcıya havale etmiştir.

**Önemli vergi hukuku notu:** KDV Kanunu Md. 30/b uyarınca işletmelerin satın aldığı **binek otomobillere ait KDV indirim konusu yapılamaz.** Bu KDV gider veya maliyet unsuru olarak dikkate alınır. Aracın aktife alınmasında uygulamada tercih edilen yöntem KDV'nin aracın maliyetine eklenmesidir; böylece amortisman matrahı KDV dahil tutar üzerinden hesaplanır.

Bu durumda 254 Taşıtlar hesabı KDV dahil toplam (960.000 TL) ile borçlandırılır; 191 İndirilecek KDV satırı yazılmaz.$ml$, $ml$254 Taşıtlar borç (KDV dahil 960.000 — KDV maliyete dahil) → 102 Bankalar alacak (toplam ödeme).$ml$, $ml$Binek otomobillerde ödenen KDV'nin indirilememesinin nedeni, kanun koyucunun bu varlıkların ticari faaliyet dışında özel kullanıma da konu olabileceğini varsaymasıdır. Hukuken indirilemeyen bu KDV iki şekilde değerlendirilebilir: (a) doğrudan gider olarak yazma (770 borç), (b) varlığın maliyetine ekleme (254 borç). Uygulamada amortisman matrahını artıracağı için maliyete ilave yöntemi tercih edilir; bu sayede KDV tutarı yıllara yayılarak amortisman yoluyla giderleştirilir. Hafif ticari araçlar (kamyon, kamyonet, panelvan) ve yolcu taşımak amacıyla kullanılan otomobiller bu kısıtlamadan istisnadır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-8', 'kdv', $ml$Aylık KDV Mahsubu — Devreden KDV Oluşması$ml$, 'orta', $ml$Eylül 2026 dönemi sonunda KDV hesaplarındaki bakiyeler aşağıdaki gibidir:

• 191 İndirilecek KDV: 22.000 TL borç bakiye
• 391 Hesaplanan KDV: 18.000 TL alacak bakiye

Matematik olarak indirilecek KDV (22.000) hesaplanan KDV'den (18.000) fazla olduğu için bu dönem ödenecek KDV doğmamıştır. Aradaki **4.000 TL fark sonraki döneme devredilecektir** ve 190 Devreden KDV hesabına alınır.

Ay sonu mahsup kaydında: 391 borç bakiyesi kapatılır, 191 alacak bakiyesi kapatılır, fark 190 Devreden KDV'ye borç yazılarak gelecek dönemin indirilecek KDV'sine eklenir.$ml$, $ml$391 borç (18.000 — kapatılır) + 190 Devreden KDV borç (4.000 — gelecek döneme aktarılan tutar). 191 alacak (22.000 — kapatılır).$ml$, $ml$Ay sonu KDV mahsubunda 391 Hesaplanan KDV ile 191 İndirilecek KDV karşılıklı kapatılır; fark indirilecek KDV lehine ise (191 > 391) ödenecek KDV doğmaz, fark 190 Devreden KDV'ye aktarılır. Devreden KDV bir sonraki dönemin 191 indirimine ek olarak kullanılır. Bu örnekte 391 (18.000 TL) borçlandırılarak kapatılır; karşılığında 191 (22.000 TL) alacaklandırılarak kapatılır; aradaki 4.000 TL'lik fark 190 Devreden KDV'ye borç yazılır. Eğer fark 391 lehine olsaydı (391 > 191) o tutar 360 Ödenecek Vergi ve Fonlar'a alacak yazılarak ödenmesi gereken KDV doğardı.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amort-1', 'amortisman', $ml$Demirbaş Alımı (Bilgisayar) — Bankadan Ödeme$ml$, 'orta', $ml$İşletmemiz, ofiste kullanılmak üzere PROFİ BİLİŞİM TİC. A.Ş.'den 4 adet dizüstü bilgisayar satın almış ve bedelini banka havalesi ile peşin ödemiştir.

Fatura "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$255 Demirbaşlar (KDV hariç) borç, 191 İndirilecek KDV borç, 102 Bankalar (KDV dahil) alacak.$ml$, $ml$Demirbaş alımında varlığın KDV hariç tutarı 255 Demirbaşlar hesabına kaydedilir; KDV ise 191 İndirilecek KDV'ye gider. Ödeme bankadan yapıldığı için 102 Bankalar hesabı KDV dahil toplam tutarla alacaklandırılır. Demirbaş, faydalı ömrü boyunca amortisman yoluyla giderleştirilecektir (VUK md. 313).$ml$, $ml$[{"tur":"fatura","baslik":"SATIŞ FATURASI","faturaNo":"PB-2026/03471","tarih":"08.05.2026","ettn":"C82F4D17-7A91-4B5C-9E63-1F8A2D4B7C99","satici":{"unvan":"PROFİ BİLİŞİM TİC. A.Ş.","vkn":"6391082475","vergiDairesi":"Maslak","adres":"Maslak Mah. Büyükdere Cad. No: 245 K:7, Sarıyer / İSTANBUL"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Lenovo ThinkPad E16 — i7-13700H / 16GB / 512GB SSD","miktar":4,"birim":"AD","birimFiyat":5000}],"kdvOrani":20,"odemeBilgisi":"Peşin / Banka havalesi (aynı gün)"}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amort-2', 'amortisman', $ml$Ticari Taşıt Alımı (Kamyonet) — Vadeli Borç$ml$, 'orta', $ml$İşletmemiz, dağıtım faaliyetlerinde kullanılmak üzere AVCI MOTORLU ARAÇLAR LTD. ŞTİ.'den bir adet ticari kamyonet satın almıştır. Fatura bedelinin tamamı satıcıya açık hesap olarak borçlanılmış; ödeme 30 gün vadeli olarak yapılacaktır.

Kamyonet ticari amaçla kullanıldığı için KDV indirim hakkı mevcuttur.

Fatura "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$254 Taşıtlar (KDV hariç) + 191 (KDV) borç. Karşılığında 320 Satıcılar (KDV dahil) alacak.$ml$, $ml$Ticari taşıt alımında varlığın KDV hariç tutarı 254 Taşıtlar hesabına borç yazılır; ticari kullanım nedeniyle KDV indirilebildiği için 191 İndirilecek KDV de borçlandırılır. Ödeme yapılmadığı için satıcının cari hesabı (320 Satıcılar) KDV dahil toplam tutarla alacaklandırılır. Binek otomobillerinde KDV indirilemez (KDV K. md. 30/b), bu örnekte ticari taşıt olduğu için indirim yapılmaktadır.$ml$, $ml$[{"tur":"fatura","baslik":"SATIŞ FATURASI","faturaNo":"AV-2026/00382","tarih":"14.05.2026","ettn":"F83A6B22-4D71-4C8E-9A2D-7F1E5C8B2D44","satici":{"unvan":"AVCI MOTORLU ARAÇLAR LTD. ŞTİ.","vkn":"4827193058","vergiDairesi":"Esenyurt","adres":"Cumhuriyet Mah. E-5 Yan Yol No: 162, Esenyurt / İSTANBUL"},"alici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"kalemler":[{"aciklama":"Ford Transit Custom Trend 320L 2.0 EcoBlue 130 PS / Şase: NM0LXXTTGLPM84217 / 2026 Model Beyaz","miktar":1,"birim":"AD","birimFiyat":800000}],"kdvOrani":20,"odemeBilgisi":"Vade: 30 gün açık hesap","not":"Ticari amaçlı taşıt — KDV indirim hakkına haizdir. ÖTV bedele dahildir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amort-3', 'amortisman', $ml$Normal (Eşit Tutarlı) Amortisman Ayırma$ml$, 'orta', $ml$Maliyeti 50.000 TL olan ofis demirbaşı için 2026 yılı sonu itibarıyla normal amortisman ayrılacaktır. Demirbaş genel yönetim biriminde kullanılmaktadır. VUK'a göre belirlenen yıllık amortisman oranı %20'dir.

Not: Amortisman ayırma işletme içi bir yıl sonu kaydıdır; harici belge düzenlenmez.$ml$, $ml$Yıllık amortisman = 50.000 × %20 = 10.000. 770 borç / 257 alacak.$ml$, $ml$Normal amortisman yönteminde her yıl iktisap maliyeti üzerinden sabit oran uygulanır. Yıllık amortisman tutarı 50.000 × %20 = 10.000 TL'dir. Amortisman gideri kullanım yerine göre 7/A grubunda 770 Genel Yönetim Giderleri'ne borç yazılır; birikmiş amortisman 257 hesabında takip edilir ve alacaklandırılır. Demirbaşın net defter değeri her yıl 10.000 TL azalır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amort-4', 'amortisman', $ml$Azalan Bakiyeler Yöntemi — 2. Yıl Amortismanı$ml$, 'zor', $ml$Maliyeti 100.000 TL olan üretim makinesi için azalan bakiyeler (hızlandırılmış) yöntemiyle %40 oranında amortisman ayrılmaktadır.

• 1. yıl: 100.000 × %40 = 40.000 TL amortisman ayrılmış (önceki yıl)
• 2. yıl (cari): Net defter değeri × %40 üzerinden yeni amortisman hesaplanacak

Makine üretimde kullanıldığı için gider 730 Genel Üretim Giderleri'ne yazılır.

Not: İşletme içi yıl sonu kaydıdır; harici belge yoktur.$ml$, $ml$Net defter değeri = 100.000 - 40.000 = 60.000. 2. yıl amortismanı = 60.000 × %40 = 24.000. 730 borç / 257 alacak.$ml$, $ml$Azalan bakiyeler yönteminde her yıl yalnızca o yılın başındaki net defter değeri (maliyet − birikmiş amortisman) üzerinden oran uygulanır. 1. yıl sonunda birikmiş amortisman 40.000 TL olduğuna göre 2. yıl başı net defter değeri 60.000 TL'dir. 2. yıl amortisman tutarı: 60.000 × %40 = 24.000 TL. Üretim makinesi olduğu için gider 730 Genel Üretim Giderleri'ne borç, birikmiş amortisman 257 hesabına alacak yazılır. Yöntemin avantajı amortismanın ilk yıllarda daha yüksek tutulmasıdır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amort-5', 'amortisman', $ml$Kullanılmış Demirbaş Satışı (Kâr ile)$ml$, 'zor', $ml$İşletmemiz, üç yıl önce 24.000 TL'ye satın aldığı ve bugüne kadar 14.400 TL birikmiş amortismanı bulunan dizüstü bilgisayar setini KARDEŞ TEKNOLOJİ LTD. ŞTİ.'ye satmıştır. Satış bedeli faturada 12.000 TL + KDV %20 olarak gösterilmiş ve bedel aynı gün banka havalesi ile tahsil edilmiştir.

Net defter değeri: 24.000 − 14.400 = 9.600 TL → Satış kârı: 12.000 − 9.600 = 2.400 TL

Fatura "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$255 alacak (maliyet) + 257 borç (birikmiş amort.) ile demirbaş bilançodan çıkar. 102 borç (KDV dahil tahsilat). 391 alacak (KDV) + 679 alacak (kâr).$ml$, $ml$Demirbaş satışında varlık ve birikmiş amortismanı bilançodan tamamen çıkarılır: 255 Demirbaşlar maliyet bedeliyle alacaklandırılır; 257 Birikmiş Amortismanlar mevcut bakiyesiyle borçlandırılarak kapatılır. 102 Bankalar tahsil edilen KDV dahil tutarla borçlandırılır. 391 Hesaplanan KDV satış üzerinden alacaklandırılır. Net defter değeri ile satış bedeli arasındaki fark satış kârıysa 679 Diğer Olağandışı Gelir ve Kârlar'a, zarar ise 689 Diğer Olağandışı Gider ve Zararlar'a yazılır. Bu örnekte 12.000 − 9.600 = 2.400 TL kâr 679'a alacak kaydedilir.$ml$, $ml$[{"tur":"fatura","baslik":"DEMİRBAŞ SATIŞ FATURASI","faturaNo":"SMB-2026/00958","tarih":"28.05.2026","ettn":"D62A4F18-9B73-4C5E-A8D1-7F2E3C4B9D55","satici":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","vergiDairesi":"Çankaya","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"alici":{"unvan":"KARDEŞ TEKNOLOJİ LTD. ŞTİ.","vkn":"7392048165","vergiDairesi":"Kadıköy","adres":"Hasanpaşa Mah. Fahrettin Kerim Gökay Cad. No: 84, Kadıköy / İSTANBUL"},"kalemler":[{"aciklama":"Lenovo ThinkPad E16 — Kullanılmış / 2023 alım — 4 adet set (toplu satış)","miktar":4,"birim":"AD","birimFiyat":3000}],"kdvOrani":20,"odemeBilgisi":"Peşin / Banka havalesi","not":"Demirbaş satışı — orjinal alım faturası: PB-2026/03471 (08.05.2023). Cihazlar açık tutum kontrolünden geçirilmiş ve teslim edilmiştir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amort-6', 'amortisman', $ml$Demirbaşın Hurdaya Ayrılması$ml$, 'orta', $ml$Maliyeti 30.000 TL olan ve faydalı ömrü dolarak tamamen amortismanı ayrılmış (birikmiş amortisman 30.000 TL) eski yazıcı, fiziksel olarak işlevini yitirmiş ve hurdaya ayrılmasına karar verilmiştir. Demirbaş herhangi bir bedel karşılığı satılmamıştır.

Not: İşletme içi bir kayıttır; harici belge düzenlenmez (gerekirse imha tutanağı tutulur).$ml$, $ml$Demirbaş tamamen amortize → defter değeri 0. 257 ile 255 karşılıklı kapatılır.$ml$, $ml$Faydalı ömrünü tamamen tüketmiş ve birikmiş amortismanı maliyetine eşit demirbaşların net defter değeri sıfırdır. Hurdaya ayırma kaydında 257 Birikmiş Amortismanlar mevcut bakiyesiyle borçlandırılarak kapatılır; 255 Demirbaşlar maliyet bedeliyle alacaklandırılarak bilançodan çıkarılır. Tamamen amortize olduğu için kâr veya zarar doğmaz. Demirbaş henüz amortize edilmemiş olsaydı net defter değeri 689 Diğer Olağandışı Gider ve Zararlar'a yazılırdı.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amort-7', 'amortisman', $ml$Kıst Amortisman — Binek Otomobil İçin Ay Esaslı Hesaplama$ml$, 'zor', $ml$İşletme 1 Eylül 2026 tarihinde 800.000 TL bedelle binek otomobil satın almıştır (KDV maliyete dahil 960.000 TL — bkz. KDV-7). 31 Aralık 2026 dönem sonunda yıl içinde aktife alınan bu binek otomobil için kıst amortisman hesaplanacaktır.

**VUK 320. madde — Kıst Amortisman:** Binek otomobillerde aktife alındığı yılın amortismanı **ay kesri tam ay sayılarak** kıst esasa göre hesaplanır. (Diğer duran varlıklarda yıllık tam amortisman ayrılırken binek otoda istisnai olarak ay esası uygulanır.)

• Maliyet bedeli: 960.000 TL
• Faydalı ömür: 5 yıl (yıllık amortisman oranı %20 — VUK 333 sıra no.lu Genel Tebliğ)
• Yıllık amortisman tutarı: 960.000 × %20 = 192.000 TL
• Kullanım süresi: Eylül — Ekim — Kasım — Aralık = 4 ay
• 2026 yılı kıst amortisman: 192.000 × (4/12) = **64.000 TL**

Genel yönetim hizmetlerinde kullanılan binek otomobil olduğundan amortisman gideri 770 Genel Yönetim Giderleri hesabına atılır.$ml$, $ml$770 Genel Yönetim Giderleri borç (kıst tutar 64.000) → 257 Birikmiş Amortismanlar alacak.$ml$, $ml$Kıst amortisman uygulaması binek otomobiller için VUK 320. madde gereği zorunludur — diğer duran varlıklarda (binalar, makineler, demirbaşlar) hangi tarihte aktife alınırsa alınsın yılın tamamı için amortisman ayrılırken binek otomobillerde sadece kullanım süresine isabet eden ay sayısı dikkate alınır. Hesaplamada ay kesri tam ay sayılır (örneğin 15 Eylül'de alınsa bile Eylül tam ay olarak hesaba katılır). Bu hesaplama yöntemi vergi avantajının suistimalini önlemek amacıyla getirilmiştir. İlk yıl ayrılmayan kısım amortisman ömrünün son yılına eklenir; böylece toplam amortisman maliyet bedeline eşitlenir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amort-8', 'amortisman', $ml$Demirbaşın Defter Değerinin Altında Satışı (Zarar)$ml$, 'zor', $ml$İşletme, 100.000 TL maliyetli ve 60.000 TL birikmiş amortismana sahip eski bir baskı makinesini (255 Demirbaşlar altında izlenen) ikinci el alıcıya 30.000 TL + KDV (%20 = 6.000 TL) toplam 36.000 TL'ye nakden satmıştır.

• Maliyet: 100.000 TL
• Birikmiş amortisman: 60.000 TL
• Net defter değeri: 100.000 − 60.000 = 40.000 TL
• Satış bedeli (KDV hariç): 30.000 TL
• Satıştan doğan zarar: 40.000 − 30.000 = **10.000 TL** (689 Diğer Olağandışı Gider ve Zararlar)

Kayıtta 5 satır oluşur: kasaya KDV dahil tahsilat, birikmiş amortismanın kapatılması, oluşan zararın gidere yazılması, demirbaşın maliyetle çıkarılması ve satış KDV'si.$ml$, $ml$100 borç (KDV dahil 36.000) + 257 borç (birikmiş amortisman 60.000) + 689 borç (defter değer altında satış zararı 10.000) → 255 alacak (maliyet 100.000) + 391 alacak (KDV 6.000).$ml$, $ml$Duran varlık satışlarında defter değeri (maliyet − birikmiş amortisman) ile satış bedeli karşılaştırılır. Satış bedeli defter değerinden düşükse fark zarar olarak 689 Diğer Olağandışı Gider ve Zararlar (-) hesabına; yüksekse kâr olarak 679 Diğer Olağandışı Gelir ve Karlar hesabına yazılır. Bu örnekte: 257 birikmiş amortisman tamamen kapatılır (60.000), 255 demirbaş maliyet bedeliyle çıkarılır (100.000). Satış bedeli (30.000) + KDV (6.000) toplamı 100 Kasa'ya borç yazılır; 391 Hesaplanan KDV satıştan doğan KDV ile alacaklandırılır. Eksik kalan 10.000 TL zarar 689'a yazılarak kayıt dengelenir. Mali açıdan KKEG değildir; tam indirilebilir bir gider kalemidir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('per-1', 'personel', $ml$Ücret Tahakkuku — Bordro Kaydı$ml$, 'zor', $ml$Mayıs/2026 dönemi için genel yönetim biriminde çalışan personelin bordrosu aşağıdaki gibidir:

• Brüt ücret toplamı: 30.000 TL
• SGK işçi payı (%14): 4.200 TL
• İşsizlik sigortası işçi payı (%1): 300 TL
• Gelir vergisi stopajı (%15): 3.000 TL
• Damga vergisi (binde 7,59): yaklaşık 228 TL → bordroda toplam kesinti 7.728 TL alınmıştır (yuvarlama dahil 7.500 TL kabul edilmiştir).

Bu örnekte basitleştirme amacıyla yalnızca SGK kesintisi (4.500 TL) ve gelir vergisi stopajı (3.000 TL) kesinti olarak alınacaktır. Net ücret 22.500 TL olarak personele borçlanılmıştır.

Not: Bordro işletme içi bir belgedir; harici fatura/dekont söz konusu değildir.$ml$, $ml$770 brüt ücret ile borç. SGK işçi payı 361'e, stopaj 360'a alacak. Net 335 Personele Borçlar'a alacak.$ml$, $ml$Ücret giderinin tamamı brüt tutar üzerinden 770 Genel Yönetim Giderleri'ne borç yazılır. Personelden kesilen tutarlar pasif hesaplara alacak kaydedilir: SGK işçi payı 361 Ödenecek Sosyal Güvenlik Kesintileri'ne, gelir vergisi stopajı 360 Ödenecek Vergi ve Fonlar'a. Net ödenecek tutar 335 Personele Borçlar hesabına alacaklandırılır. Net ücret = 30.000 − 4.500 − 3.000 = 22.500 TL.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('per-2', 'personel', $ml$SGK İşveren Payı Tahakkuku$ml$, 'orta', $ml$Mayıs/2026 dönemi için brüt 30.000 TL ücret tahakkukuna ek olarak işveren tarafından ödenecek SGK işveren payı (%20,5 + işsizlik %2 = %22,5) tahakkuk ettirilecektir.

• SGK işveren payı: 30.000 × %20,5 = 6.150 TL
• İşsizlik işveren payı: 30.000 × %2 = 600 TL
• Toplam işveren yükümlülüğü: 6.750 TL

İşveren payları işverenin gideridir; personelin brüt ücretinden değil işverenin cebinden çıkar.

Not: İşletme içi bir tahakkuk kaydıdır.$ml$, $ml$İşveren payı işverenin gideridir → 770 borç. Karşılığında ödenecek SGK borcu doğar → 361 alacak.$ml$, $ml$İşveren SGK ve işsizlik payı, brüt ücretin işveren tarafından üstlenilen ek maliyetidir; personelin maaşından kesilmez. Bu tutar 770 Genel Yönetim Giderleri'ne borç olarak ek bir gider kaydı oluşturur. Karşılığında SGK'ya ödenecek borç doğduğu için 361 Ödenecek Sosyal Güvenlik Kesintileri'ne alacak yazılır. Bu kayıt yapıldığında 361 hesabının toplam bakiyesi 4.500 + 6.750 = 11.250 TL olur (işçi + işveren payı birlikte).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('per-3', 'personel', $ml$Net Ücretin Bankadan Toplu Ödenmesi$ml$, 'kolay', $ml$Mayıs/2026 dönemine ait personele olan 22.500 TL net ücret borcu, bankamızın toplu maaş ödeme talimatıyla personelin maaş hesaplarına havale edilmiştir.

Banka maaş ödeme talimatından komisyon almamıştır (kurumsal anlaşma).

Maaş ödeme dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$335 Personele Borçlar borç (kapatılır), 102 Bankalar alacak (azalır).$ml$, $ml$Net ücret personelin banka hesabına geçtiğinde 335 Personele Borçlar borçlandırılarak yükümlülük kapatılır; 102 Bankalar net ücret tutarıyla alacaklandırılarak hesaptan çıkış yapılır. SGK ve stopaj borçları bu kayıtta hareket etmez; onlar ayrı dönemde Hazine ve SGK'ya ödenir.$ml$, $ml$[{"tur":"dekont","baslik":"TOPLU MAAŞ ÖDEME DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260601-0034829","islemTarihi":"01.06.2026","islemSaati":"09:30","valor":"01.06.2026","islemTuru":"EFT","aciklama":"TOPLU MAAŞ ÖDEMESİ — 2026/05 DÖNEMİ NET ÜCRETLER","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","tutar":22500,"yon":"BORC","netTutar":22500,"bakiye":477283.33,"not":"Personel listesi ekte. Toplu ödeme talimatı kurumsal müşteri tarifesinden komisyonsuz işlenmiştir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('per-4', 'personel', $ml$SGK Primi Ödemesi (İşçi + İşveren)$ml$, 'orta', $ml$Mayıs/2026 dönemine ait toplam SGK primi 11.250 TL (4.500 işçi + 6.750 işveren payı), 30 Haziran 2026 son ödeme tarihinde Sosyal Güvenlik Kurumu'na bankamızdan ödenmiştir.

Banka dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$SGK borcu kapanır (361 borç), banka çıkışı (102 alacak). İşçi + işveren payı tek kalemde.$ml$, $ml$Önceki kayıtlarda işçi (4.500) ve işveren (6.750) payları olarak 361 Ödenecek Sosyal Güvenlik Kesintileri'ne alacaklandırılan 11.250 TL'lik tutar, SGK'ya ödendiğinde 361 hesabı borçlandırılarak kapatılır. 102 Bankalar aynı tutarla alacaklandırılır. SGK karşı tarafı resmi kurumdur, bireysel personel hesabı değildir.$ml$, $ml$[{"tur":"dekont","baslik":"SGK PRİMİ ÖDEME DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260630-0038147","islemTarihi":"30.06.2026","islemSaati":"15:18","valor":"30.06.2026","islemTuru":"HAVALE","aciklama":"SGK PRİM ÖDEMESİ 2026/05 — İŞYERİ SİCİL: 1.06.0142.04.78921 / TAHAKKUK: 7.504.219","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI","vkn":"0710058524","adres":"Mithatpaşa Cad. No: 7, Sıhhiye / ANKARA"},"tutar":11250,"yon":"BORC","netTutar":11250,"bakiye":466033.33,"not":"İşçi payı: 4.500,00 TL · İşveren payı: 6.750,00 TL. e-Bildirge sistemi üzerinden tahakkuk eşleştirmesi yapılmıştır."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('per-5', 'personel', $ml$Gelir Vergisi Stopajının Ödenmesi (Muhtasar Beyanname)$ml$, 'orta', $ml$Mayıs/2026 dönemi maaş bordrosundan kesilen 3.000 TL gelir vergisi stopajı, muhtasar ve prim hizmet beyannamesi (MUHSGK) ile beyan edilmiş; 26 Haziran 2026 tarihinde bankamızdan vergi dairesine ödenmiştir.

Banka dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$Vergi borcu kapandı (360 borç), banka çıkışı (102 alacak). Karşı taraf: Hazine.$ml$, $ml$Bordrodan kesilen gelir vergisi stopajı, işveren tarafından personel adına Hazine'ye yatırılmak üzere 360 Ödenecek Vergi ve Fonlar'a alacaklandırılmıştı. Ödeme yapıldığında 360 borçlandırılarak kapatılır; 102 Bankalar aynı tutarla alacaklandırılır. Vergi dairesi karşı tarafı doğrudan Hazine'dir; tahakkuk numarası beyanname kabul numarasıyla eşleşir.$ml$, $ml$[{"tur":"dekont","baslik":"MUHTASAR BEYANNAME ÖDEME DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20260626-0036485","islemTarihi":"26.06.2026","islemSaati":"14:09","valor":"26.06.2026","islemTuru":"HAVALE","aciklama":"MUHSGK 2026/05 — GELİR VERGİSİ STOPAJI / TAHAKKUK NO: 2026/0428/8541036","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"T.C. HAZİNE VE MALİYE BAKANLIĞI — ÇANKAYA VERGİ DAİRESİ BAŞKANLIĞI","vkn":"0720062187","adres":"Ziya Gökalp Cad. No: 27, Çankaya / ANKARA"},"tutar":3000,"yon":"BORC","netTutar":3000,"bakiye":463033.33,"not":"Beyanname tahakkuk numarasıyla otomatik eşleştirme başarılı. SGK primleri ayrı dekontla ödenmiştir."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('per-6', 'personel', $ml$Personel Avansının Ücretten Mahsubu$ml$, 'orta', $ml$Önceden personel İSMAİL DEMİR'e iş seyahati için kasadan verilen 25.000 TL avans, kendisinin 2026/Haziran ay ücretinde mahsuplaştırılacaktır. Personelin Haziran ayı net ücret hak edişi 28.000 TL olup, avans düşüldükten sonra kalan 3.000 TL kasadan ödenmiştir.

Bu kayıtta yalnızca avans mahsubu + kasadan kalan ödeme işlenecek; ücret tahakkuku ve kesintiler ayrıca kaydedilmiş kabul edilir (335 net hak ediş 28.000 TL alacak bakiyeli).

Not: İşletme içi bir mahsup işlemidir.$ml$, $ml$335 borç (28.000 — net ücret hak edişi tamamen kapatılır) → 196 alacak (avans tasfiye) + 100 alacak (kalan nakit ödeme).$ml$, $ml$Personel avansı (196 Personel Avansları) personelden alacak niteliğindeydi. Personel ücret hak edişi 335 Personele Borçlar'da alacak bakiyesi olarak duruyordu. Mahsup kaydında 335 hesabı net hak ediş tutarıyla borçlandırılarak kapatılır; karşılığında 196 Personel Avansları avans tutarıyla alacaklandırılarak tasfiye edilir, kalan kısım ise 100 Kasa'dan nakden ödenir. Mahsup ile personelden alacak ile personele borç birbirini götürmüş olur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('per-7', 'personel', $ml$Personel Maaşından İcra Kesintisinin Ödenmesi$ml$, 'orta', $ml$Personelimiz İSMAİL DEMİR'in Mart 2027 ücretinden, Çankaya 7. İcra Müdürlüğü'nün 2026/12347 sayılı haciz müzekkeresi gereği 5.000 TL icra kesintisi yapılmıştı. Bu kesinti 335 Personele Borçlar hesabından düşülerek 336 Diğer Çeşitli Borçlar (icra dairesi alt hesabı) hesabına aktarılmıştı (önceki kayıt yapılmış kabul ediliyor).

28 Mart 2027 tarihinde 5.000 TL'lik icra kesintisi tutarı, kasadan icra dairesi vezne servisine elden teslim edilerek ödenmiştir. İcra dairesinden tahsilat makbuzu alınmıştır.$ml$, $ml$336 Diğer Çeşitli Borçlar borç (icra borcumuzu kapat) → 100 Kasa alacak.$ml$, $ml$Personel maaşından yapılan icra kesintisi işletmenin personele olan borcundan düşülür ancak aynı zamanda işletmenin icra dairesine olan tahsilat sorumluluğunu doğurur. İlk tahakkukta 335 borç (personel borcumuz azalır) / 336 alacak (icra dairesine borç). Sonradan icra dairesine ödendiğinde 336 borç (borcumuz kapanır) / 100 veya 102 alacak (nakit/banka çıkışı). Bu örnekte ödeme nakden yapıldığı için 100 Kasa alacaklandırılır. İşletme bu süreçte üçüncü kişi (icra dairesi) adına tahsilat ve ödeme yapmış olur; gelir-gider hesabıyla bağlantısı yoktur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('per-8', 'personel', $ml$Aralık Ücret Tahakkuku — Ödeme Ocak'ta (Dönem Sonu)$ml$, 'zor', $ml$31 Aralık 2026 dönem sonu kayıtları kapsamında, Aralık ayına ait personel ücret tahakkuku yapılmaktadır. Ücret hakediş Aralık ayında doğmuş olmasına rağmen ödeme 8 Ocak 2027'de yapılacaktır.

**Aralık 2026 bordro özet:**
• Brüt ücret: 50.000 TL
• SGK işçi payı (%14): 7.000 TL
• İşsizlik işçi payı (%1): 500 TL
• Gelir vergisi stopajı (sade tarife — gelir vergisi indirimleri sonrası): 5.000 TL
• Damga vergisi (binde 7,59): 379,50 TL → toplam kesintiler: 12.879,50 TL
• Net ücret (335'e alacak): 50.000 − 12.879,50 = **37.120,50 TL**

Dönemsellik ilkesi gereği bu ücret Aralık ayı gideridir; ancak ödeme henüz yapılmadığı için 100/102 alacaklandırılmaz. Net ücret 335 Personele Borçlar'a, kesintiler ise 360 ve 361 hesaplarına alacak yazılır. Ödeme ve SGK/vergi tahakkukları Ocak/Şubat 2027'de gerçekleşecektir.

Not: 770 Genel Yönetim Giderleri'ne brüt ücret + işveren paylarının da dahil edilmesi gerekirken bu örnekte sadelik için yalnızca brüt ücret tahakkukunu işliyoruz; SGK işveren payı ayrı bir kayıtta işlenmiş kabul ediliyor.$ml$, $ml$770 borç (brüt ücret 50.000 — Aralık dönem gideri) → 335 alacak (net ücret 37.120,50) + 360 alacak (gelir vergisi + damga vergisi 5.379,50) + 361 alacak (SGK + işsizlik işçi payı 7.500).$ml$, $ml$Personel ücretleri tahakkuk dönemi (hak edildiği ay) gideri olarak yazılır; nakit ödeme tarihi gider tahakkukunu etkilemez. Aralık ayına ait ücret 31.12.2026'da 770 Genel Yönetim Giderleri hesabına brüt tutar üzerinden borç yazılır. Bu tutardan kesilen vergi ve SGK kesintileri ödeme yükümlülüğü olarak 360 Ödenecek Vergi ve Fonlar (gelir vergisi stopajı + damga vergisi) ile 361 Ödenecek Sosyal Güvenlik Kesintileri (SGK + işsizlik işçi payı) hesaplarına alacak yazılır. Personele ödenecek net ücret ise 335 Personele Borçlar'a alacak yazılır. Ocak ayında nakit ödeme yapıldığında 335 borç / 102 alacak; SGK ve vergi ödemelerinde 361 ve 360 ayrı ayrı borçlandırılarak 102 alacak yazılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-1', 'donem-sonu', $ml$Peşin Ödenen Kira (6 Aylık) — Bankadan$ml$, 'orta', $ml$1 Ekim 2026 tarihinde işletmemizin kiraladığı dükkan için sözleşme uyarınca 6 aylık (Ekim 2026 — Mart 2027 dönemi) kira bedeli toplam 60.000 TL olarak mülk sahibine bankamızdan peşin havale edilmiştir.

Muhasebe politikası gereği peşin yapılan ödemeler önce 180 Gelecek Aylara Ait Giderler hesabında izlenir; ay/yıl sonlarında dönemsellik ilkesi gereği 770 Genel Yönetim Giderleri'ne aktarılır.

Ödeme dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$180 Gelecek Aylara Ait Giderler borç (peşin gider). 102 Bankalar alacak (banka çıkışı).$ml$, $ml$İleriye dönük yapılan peşin gider ödemeleri ödeme anında doğrudan gidere yazılmaz; 180 Gelecek Aylara Ait Giderler hesabında bekletilir. Bu hesap, henüz dönem giderine dönüşmemiş "ön ödeme" niteliğindeki bir aktif hesaptır. Ödeme banka yoluyla yapıldığı için 102 Bankalar tutar kadar alacaklandırılır. Ay/yıl sonlarında 180'den 770 veya ilgili gider hesabına dönem payı aktarılarak dönemsellik ilkesi sağlanır.$ml$, $ml$[{"tur":"dekont","baslik":"KİRA HAVALE DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20261001-0042118","islemTarihi":"01.10.2026","islemSaati":"10:14","valor":"01.10.2026","islemTuru":"HAVALE","aciklama":"DÜKKAN KİRASI 6 AYLIK PEŞİN — 2026/10 — 2027/03 DÖNEMİ","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"NACİYE KARABULUT (mülk sahibi)","tcKimlik":"14782036591","adres":"Bahçelievler Mah. 7. Cad. No: 12, Çankaya / ANKARA"},"karsiIban":"TR62 0006 4000 0014 2841 7820 36","tutar":60000,"yon":"BORC","netTutar":60000,"bakiye":403033.33,"not":"Aylık kira: 10.000 TL × 6 ay = 60.000 TL. Sözleşme tarihi: 01.10.2026. Stopaj sözleşme dışı (kiracı şirket → mülk sahibi gerçek kişi)."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-2', 'donem-sonu', $ml$Yıl Sonu Kira Devri — 180'den 770'e$ml$, 'orta', $ml$31 Aralık 2026 dönem sonu kayıtları çerçevesinde 180 Gelecek Aylara Ait Giderler hesabında bulunan 60.000 TL'lik peşin kira bedelinin dönemsellik analizi yapılmıştır.

• Cari yıla (Ekim — Kasım — Aralık 2026) isabet eden kısım: 3 ay × 10.000 TL = 30.000 TL → gidere alınacak
• Sonraki yıla (Ocak — Şubat — Mart 2027) devreden kısım: 3 ay × 10.000 TL = 30.000 TL → 180'de kalmaya devam edecek

Not: İşletme içi yıl sonu ayarlama kaydıdır; harici belge düzenlenmez.$ml$, $ml$Cari yıla isabet eden kısım 770 borç, aynı tutarla 180 alacak. 180'in kalan bakiyesi sonraki yıla aktarılır.$ml$, $ml$Dönemsellik ilkesi gereği yalnızca cari yıla ait gider kısmı sonuç hesabına aktarılır. 770 Genel Yönetim Giderleri cari yıl payı (30.000 TL) ile borçlandırılır; 180 Gelecek Aylara Ait Giderler aynı tutarla alacaklandırılarak bakiyesi 30.000 TL'ye iner. Kalan 30.000 TL açılış bilançosunda 280 Gelecek Yıllara Ait Giderler veya 180'in alt hesabı olarak yeni yıla devredilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-3', 'donem-sonu', $ml$Peşin Tahsil Edilen Kira Geliri — Bankaya$ml$, 'orta', $ml$1 Ekim 2026 tarihinde işletmemizin sahip olduğu ofis katı için kiracı firma DÜZGÜN MÜHENDİSLİK LTD. ŞTİ., 6 aylık (Ekim 2026 — Mart 2027 dönemi) kira bedeli olan 90.000 TL'yi peşin olarak banka hesabımıza havale etmiştir.

İşletme tahsil edilen peşin gelirleri önce 380 Gelecek Aylara Ait Gelirler hesabında izler; ay/yıl sonlarında dönem payını ilgili gelir hesabına aktarır.

Gelen havale dekontu "Belgeyi Görüntüle" panelinde mevcuttur.$ml$, $ml$102 borç (gelen havale). 380 Gelecek Aylara Ait Gelirler alacak (henüz hak edilmemiş gelir).$ml$, $ml$Henüz hizmetin verilmediği veya hak edişin doğmadığı peşin tahsilatlar gelir olarak kaydedilemez; 380 Gelecek Aylara Ait Gelirler hesabı pasif bir hesap olarak gelir tahakkukunu erteler. Tahsil edilen tutar 102 Bankalar'a borç, peşin alınan kira da 380'e alacak yazılır. Yıl sonunda dönemsellik ilkesi gereği cari yıla ait kısım 380'den ilgili gelir hesabına aktarılır.$ml$, $ml$[{"tur":"dekont","baslik":"GELEN KİRA TAHSİLATI DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20261001-0042243","islemTarihi":"01.10.2026","islemSaati":"14:38","valor":"01.10.2026","islemTuru":"EFT","aciklama":"OFİS KAT KİRASI 6 AYLIK PEŞİN — 2026/10 — 2027/03","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"DÜZGÜN MÜHENDİSLİK LTD. ŞTİ.","vkn":"6391847205","adres":"Mustafa Kemal Mah. 2118. Sok. No: 14, Çankaya / ANKARA"},"karsiIban":"TR84 0001 5000 0084 1592 7064 18","tutar":90000,"yon":"ALACAK","netTutar":90000,"bakiye":493033.33,"not":"Aylık kira: 15.000 TL × 6 ay = 90.000 TL. Stopaj kiracı tarafından ayrı ödenecektir (sözleşme md. 9)."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-4', 'donem-sonu', $ml$Yıl Sonu Kira Geliri Devri — 380'den 649'a$ml$, 'orta', $ml$31 Aralık 2026 dönem sonu kayıtları çerçevesinde 380 Gelecek Aylara Ait Gelirler hesabında bulunan 90.000 TL'lik peşin tahsilat dönemsellik analizine tabi tutulmuştur.

• Cari yıla (Ekim — Kasım — Aralık 2026) isabet eden kısım: 3 ay × 15.000 TL = 45.000 TL → gelire alınacak
• Sonraki yıla devreden kısım: 3 ay × 15.000 TL = 45.000 TL → 380'de kalmaya devam edecek

İşletmenin ana faaliyeti ticaret olduğundan kira geliri "diğer olağan gelir" olarak sınıflandırılmaktadır.

Not: İşletme içi yıl sonu ayarlama kaydıdır; harici belge düzenlenmez.$ml$, $ml$Cari yıl payı 380'den 649 Diğer Olağan Gelir ve Kârlar'a aktarılır. 380 borç / 649 alacak.$ml$, $ml$Dönemsellik ilkesi gereği yalnızca cari yıla ait gelir kısmı sonuç hesabına aktarılır. 380 Gelecek Aylara Ait Gelirler cari yıl payı (45.000 TL) ile borçlandırılarak bakiyesi azaltılır; 649 Diğer Olağan Gelir ve Kârlar aynı tutarla alacaklandırılarak gelir tahakkuk eder. Kira ana faaliyet olmadığı için 600 yerine 649 kullanılır. Kalan 45.000 TL sonraki yıla ait olarak 380'de kalmaya devam eder.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-5', 'donem-sonu', $ml$Gider Tahakkuku — Faturalanmamış Elektrik$ml$, 'orta', $ml$31 Aralık 2026 dönem sonunda Aralık ayı elektrik tüketim faturası henüz işletmeye ulaşmamıştır. Sayaç okumasına göre Aralık ayında tüketilen elektriğin maliyetinin yaklaşık 4.500 TL (KDV hariç) olduğu hesaplanmıştır. Fatura Ocak ayının ilk haftasında düzenlenecek olup, KDV indirimi fatura tarihinde yapılacaktır.

Dönemsellik ilkesi gereği bu tutar cari yılın gideri olarak tahakkuk ettirilecektir.

Not: İşletme içi yıl sonu tahakkuk kaydıdır; fatura henüz gelmediği için belge yoktur.$ml$, $ml$Cari yıla ait ama henüz faturalanmamış gider → 770 borç. Karşılığında 381 Gider Tahakkukları alacak (gelecek dönemde ödenecek borç).$ml$, $ml$Dönemsellik ilkesi, tüketilen kaynağın gider olarak ait olduğu döneme yazılmasını gerektirir; faturanın ne zaman geldiği önemli değildir. 770 Genel Yönetim Giderleri'ne 4.500 TL borç yazılarak Aralık ayı elektriği gidere alınır. Karşılığında ileride ödenecek bir yükümlülük doğduğu için 381 Gider Tahakkukları'na (kısa vadeli pasif) alacak kaydedilir. Fatura geldiğinde bu hesap kapatılır, KDV indirimi ise o tarihte yapılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-6', 'donem-sonu', $ml$Gelir Tahakkuku — Vadeli Mevduat Faiz Kıst Hesabı$ml$, 'zor', $ml$1 Nisan 2026 tarihinde bankamıza 200.000 TL anaparayla 1 yıl vadeli (vade: 31 Mart 2027) mevduat hesabı açılmıştır. Yıllık brüt faiz oranı %30 olup faiz, vadenin sonunda anapara ile birlikte ödenecektir.

31 Aralık 2026 dönem sonunda 9 aylık faiz dönemi tamamlanmış (Nisan — Aralık 2026) ancak henüz tahsil edilmemiştir. Dönemsellik ilkesi gereği bu kıst faiz cari yıla gelir olarak tahakkuk ettirilecektir.

• 9 aylık brüt faiz: 200.000 × %30 × (9/12) = 45.000 TL

Not: İşletme içi yıl sonu tahakkuk kaydıdır; gelir vergisi stopajı vade tarihinde banka tarafından yapılacaktır.$ml$, $ml$Henüz tahsil edilmemiş gelir → 181 Gelir Tahakkukları borç (aktif hesap, ileride tahsil edilecek). Cari yıla ait kısım 642 Faiz Gelirleri'ne alacak.$ml$, $ml$Dönemsellik ilkesi, faizin tahakkuk ettiği döneme yazılmasını gerektirir; nakit girişinin ne zaman olduğu önemli değildir. 181 Gelir Tahakkukları aktif bir hesap olarak henüz tahsil edilmemiş ama hak edilmiş geliri izler ve 45.000 TL ile borçlandırılır. Karşılığında 642 Faiz Gelirleri'ne aynı tutarla alacak yazılarak cari yıl gelirine eklenir. Vade tarihinde tahsilat yapıldığında 102 Bankalar borç, 181 Gelir Tahakkukları alacak çalışır (ve yeni yıla isabet eden 3 aylık faiz o döneme gelir yazılır).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-1', 'supheli-alacaklar', $ml$Vadesi Geçen Alacağın Şüpheli Hale Getirilmesi$ml$, 'orta', $ml$Müşterimiz AYDIN TEKSTİL SANAYİ LTD. ŞTİ.'nden olan 80.000 TL'lik açık hesap alacağımız 120 günü aşkın süredir tahsil edilememektedir. Müşteri ile yapılan tüm yazışmalar sonuçsuz kalmış, son ihtarname tebliğ edilmesine rağmen ödeme alınamamıştır.

28 Ekim 2026 tarihinde işletme avukatımız aracılığıyla Çankaya 4. İcra Müdürlüğü'ne icra takibi başlatılmış olup VUK 323. madde kapsamında alacak "şüpheli alacak" niteliği kazanmıştır.

Alıcılar hesabındaki 80.000 TL'lik bakiye Şüpheli Ticari Alacaklar hesabına aktarılacaktır.

Not: Bu kayıt sadece hesaplar arası bir aktarımdır; karşılık ayırma kaydı dönem sonunda yapılacaktır.$ml$, $ml$Alacak şüpheli hale geldiğinde 120 Alıcılar hesabından 128 Şüpheli Ticari Alacaklar hesabına aktarılır. Karşılık ayrımı ayrı bir kayıttır.$ml$, $ml$Vergi Usul Kanunu 323. madde uyarınca dava veya icra safhasındaki alacaklar şüpheli alacak sayılır. Şüpheli hale gelen alacak öncelikle 120 Alıcılar hesabından çıkarılarak 128 Şüpheli Ticari Alacaklar hesabına aktarılır. Bu işlem tek başına bir gider doğurmaz; sadece alacağın niteliğindeki değişikliği muhasebe kayıtlarına yansıtır. Karşılık ayırma ise ayrı bir kayıt ile (654 Karşılık Giderleri / 129 Şüpheli Ticari Alacaklar Karşılığı) gerçekleştirilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-2', 'supheli-alacaklar', $ml$Şüpheli Alacak için Karşılık Ayrılması$ml$, 'orta', $ml$31 Aralık 2026 dönem sonu kayıtları kapsamında, daha önce şüpheli alacaklara aktarılmış olan AYDIN TEKSTİL SANAYİ LTD. ŞTİ. alacağı için karşılık ayrılacaktır.

128 Şüpheli Ticari Alacaklar hesabında 80.000 TL bakiye bulunmakta olup, alacak için herhangi bir teminat alınmamıştır. VUK 323. madde uyarınca teminatsız şüpheli alacak için tutarın tamamı kadar (80.000 TL) karşılık ayrılacaktır.

Not: Karşılık ayırma kaydı bir gider tahakkuk işlemidir; nakit hareketi içermez.$ml$, $ml$654 Karşılık Giderleri (-) borç (gider tahakkuku). 129 Şüpheli Ticari Alacaklar Karşılığı (-) alacak (kontr-aktif).$ml$, $ml$Şüpheli alacak için ayrılan karşılık, bilançoda 128 hesabının altında 129 Şüpheli Ticari Alacaklar Karşılığı (-) hesabı olarak negatif aktif şeklinde gösterilir; böylece şüpheli alacağın net değeri (varsa tahsil olasılığı kadar) sunulmuş olur. Karşılık tutarı dönem giderine 654 Karşılık Giderleri (-) ile aktarılır ve dönem kar/zararını azaltır. Bu kayıt nakit çıkışı doğurmaz; sadece olası kayıp riskini muhasebeleştirir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-3', 'supheli-alacaklar', $ml$Şüpheli Alacağın Bir Kısmının Tahsil Edilmesi$ml$, 'zor', $ml$15 Şubat 2027 tarihinde AYDIN TEKSTİL SANAYİ LTD. ŞTİ. ile yapılan konkordato görüşmeleri sonucunda alacağımızın 30.000 TL'lik kısmı bankamıza havale yoluyla tahsil edilmiştir. Kalan 50.000 TL için icra ve mahkeme süreci devam etmektedir.

Daha önce 80.000 TL'lik şüpheli alacağın tamamı için karşılık ayrılmıştı (129 hesabında 80.000 TL bakiye). Tahsil edilen kısım için iki ayrı kayıt yapılacaktır:

1. Tahsilat kaydı: Banka tahsilatı ile 128 Şüpheli Ticari Alacaklar hesabı kapatılır.
2. Karşılık iptali kaydı: Tahsil edilen tutar için ayrılmış karşılık, 644 Konusu Kalmayan Karşılıklar hesabına gelir olarak yazılır.

Aşağıda tahsilata ilişkin banka dekontu mevcuttur. Lütfen iki kaydı tek bir kompozit kayıt halinde, dört satır olarak yazınız.$ml$, $ml$102 borç (banka tahsilatı) → 128 alacak (şüpheli alacaktan düşüş). 129 borç (karşılık iptali) → 644 alacak (gelir).$ml$, $ml$Şüpheli alacağın bir kısmı sonradan tahsil edildiğinde iki paralel kayıt yapılır: (1) Tahsilat kaydı — bankaya gelen tutar 128 Şüpheli Ticari Alacaklar bakiyesini azaltır. (2) Karşılık iptali — Önceden ayrılmış olan karşılık (129) artık konusu kalmadığı için 129 borç, karşılığında 644 Konusu Kalmayan Karşılıklar gelir olarak alacak kaydedilir. Böylece tahsil edilen kısım için ayrılmış olan gider önceki dönemlerden bu döneme gelir olarak transfer edilmiş olur. Kalan 50.000 TL'lik kısım için 128 ve 129 hesaplarında bakiye devam eder.$ml$, $ml$[{"tur":"dekont","baslik":"KONKORDATO TAHSİLAT DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20270215-0073422","islemTarihi":"15.02.2027","islemSaati":"11:23","valor":"15.02.2027","islemTuru":"HAVALE","aciklama":"AYDIN TEKSTİL — KONKORDATO ÖDEMESİ 1. TAKSİT (REF: 4İCR2026/8741)","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"AYDIN TEKSTİL SANAYİ LTD. ŞTİ.","vkn":"0840326419","adres":"Organize Sanayi Bölgesi 4. Cad. No: 27, Sincan / ANKARA"},"karsiIban":"TR47 0046 7000 0008 4032 6419 00","tutar":30000,"yon":"ALACAK","netTutar":30000,"bakiye":295488.5,"not":"Konkordato komiseri onaylı 1. ödeme. Toplam 80.000 TL alacaktan 30.000 TL ödendi, kalan 50.000 TL için süreç devam ediyor."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-4', 'supheli-alacaklar', $ml$Karşılık Ayrılmış Alacağın Değersiz Hale Gelmesi$ml$, 'orta', $ml$12 Mayıs 2027 tarihinde AYDIN TEKSTİL SANAYİ LTD. ŞTİ. hakkında açılan icra takibi sonuçlanmış ve mahkeme tarafından firmaya ait herhangi bir mal varlığı bulunamadığına dair "aciz vesikası" düzenlenmiştir. Aciz vesikası VUK 322. madde kapsamında alacağın değersiz hale geldiğini hukuken ispat eden bir belgedir.

Kalan 50.000 TL'lik şüpheli alacak (128 hesabında bakiyeli) ve aynı tutarda ayrılmış karşılık (129 hesabında bakiyeli) hesaplardan silinecektir.

Not: Karşılık zaten ayrılmış olduğu için ek bir gider tahakkuku gerekmez; sadece 129 ile 128 mahsuplaşır.$ml$, $ml$Daha önce karşılık ayrılmış değersiz alacak için 129 borç (karşılık tasfiyesi) → 128 alacak (şüpheli alacak silinmesi).$ml$, $ml$Aciz vesikası, konkordato anlaşması veya kazanılmış mahkeme kararı gibi belgelerle tahsil olanağı tamamen ortadan kalkan alacaklar "değersiz alacak" sayılır (VUK 322). Daha önce karşılık ayrılmış değersiz alacaklar için yeni bir gider yazılmaz; çünkü gider önceki dönemde 654 Karşılık Giderleri ile zaten tanınmıştır. Sadece bilanço temizliği yapılır: 129 Şüpheli Ticari Alacaklar Karşılığı (-) hesabı borçlandırılarak kapatılır, karşılığında 128 Şüpheli Ticari Alacaklar aynı tutarla alacaklandırılarak silinir. Sonuç: Hem şüpheli alacak hem de karşılığı aynı tutarda mahsuplaşmış olur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-5', 'supheli-alacaklar', $ml$Karşılık Ayrılmamış Alacağın Değersiz Hale Gelmesi$ml$, 'orta', $ml$Müşterimiz SEZER PLASTİK SANAYİ LTD. ŞTİ.'nden olan 15.000 TL'lik açık hesap alacağımız hakkında 03 Haziran 2027 tarihinde mahkeme tarafından şirketin iflas tasfiyesinin tamamlandığına ve alacaklılara hiçbir dağıtım yapılamadığına dair karar verilmiştir.

Bu alacak için daha önce icra/dava süreci başlatılmamış ve dönem sonu karşılığı ayrılmamıştı (alacak hala 120 Alıcılar hesabında bakiyeliydi). Mahkeme kararı ile alacak doğrudan değersiz hale gelmiştir.$ml$, $ml$Karşılık yokken değersiz alacak doğrudan gidere atılır: 659 Diğer Olağan Gider ve Zararlar (-) borç → 120 Alıcılar alacak.$ml$, $ml$Karşılık ayrılmamış bir alacak değersiz hale geldiğinde, gider tek bir kayıtta tanınmak zorundadır. 120 Alıcılar alacaklandırılarak alacak hesaplardan silinir; karşılığında 659 Diğer Olağan Gider ve Zararlar (-) hesabı borçlandırılarak dönem giderine atılır. Bu durum 128/129 yolundan farklıdır: karşılık ayırılmadığı için "konusu kalmayan karşılık" gibi bir durum oluşmaz; gider doğrudan tanınır. VUK açısından değersiz alacak vasfını kanıtlayan belge (mahkeme kararı, aciz vesikası vb.) muhakkak saklanmalıdır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-6', 'supheli-alacaklar', $ml$Protestolu Senedin Şüpheli Alacaklara Aktarılması$ml$, 'orta', $ml$Müşterimiz KARADENİZ AMBALAJ A.Ş.'den almış olduğumuz 25.000 TL nominal değerli ve 18 Eylül 2026 vadeli alacak senedi, vadesinde tahsil edilmek üzere bankamıza tahsile verilmişti. Banka bildirimi ile senedin keşidecisi tarafından ödenmediği ve protesto edildiği öğrenilmiştir.

İşletme avukatı, senet bedeli için keşideci aleyhine icra takibi başlatmıştır. VUK 323. madde uyarınca alacak şüpheli alacak niteliği kazanmıştır.

Not: Bu kayıt sadece senedin 121'den 128'e aktarımıdır; karşılık ayrımı ile değersiz alacak kayıtları (varsa) ayrıca yapılır. Banka tahsile verme/iade kayıtlarının tamamlandığı, senedin işletmeye geri döndüğü kabul edilecektir.$ml$, $ml$128 Şüpheli Ticari Alacaklar borç (senet bedeli) → 121 Alacak Senetleri alacak.$ml$, $ml$Vadesinde ödenmeyip protesto edilen senetler şüpheli alacak hükmüne girer. Senet portföydeyse 121 Alacak Senetleri hesabından düşülerek 128 Şüpheli Ticari Alacaklar hesabına aktarılır; senet bankada veya başka bir yerde olsa dahi (tahsile verilmiş, teminata verilmiş) işletme açısından alacak hakkı şüpheli hale geldiği için kayıt aynı şekilde yapılır. İcra takibi ve karşılık ayırma kararı ayrı işlemler olarak ele alınır. Protesto belgesi, senet üzerindeki "ödenmedi" şerhi ve noter protestonamesi VUK 323 için gerekli ispat belgeleridir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-1', 'reeskont', $ml$Alacak Senedinin Yıl Sonu Reeskontu$ml$, 'zor', $ml$31 Aralık 2026 dönem sonunda işletmemizin elinde BERKE TEKNOLOJİ A.Ş.'den almış olduğumuz alacak senedi bulunmaktadır:

• Senet nominal değeri: 100.000 TL
• Düzenleme tarihi: 26.12.2026
• Vade tarihi: 26.03.2027
• Vadeye kalan gün sayısı (31.12.2026 itibarıyla): 90 gün
• Cari TCMB kısa vadeli avans faiz oranı: %30 (yıllık)

VUK 281. madde gereği vadeli alacak senedi için iç iskonto yöntemiyle reeskont hesaplanacaktır.

**İç iskonto formülü:**
F = (A × n × t) / (36.000 + n × t)
F = (100.000 × 90 × 30) / (36.000 + 90 × 30)
F = 270.000.000 / 38.700
F = **6.976,74 TL**

Not: Reeskont gideri olduğu için 657 Reeskont Faiz Giderleri (-) borç, 122 Alacak Senetleri Reeskontu (-) alacak yazılır.$ml$, $ml$657 Reeskont Faiz Giderleri (-) borç (gider — alacaktan vazgeçilen kısım). 122 Alacak Senetleri Reeskontu (-) alacak (kontr-aktif).$ml$, $ml$Vadeli alacak senedinin nominal değeri ile bilanço günündeki peşin değeri arasındaki fark "reeskont" olarak adlandırılır. Bu fark, dönemsellik ilkesi gereği gelecek döneme aittir; cari yıl bilançosunda peşin değerle gösterilebilmesi için 122 Alacak Senetleri Reeskontu (-) hesabı 121 Alacak Senetleri'nin altında kontr-aktif olarak negatif gösterilir. Karşı taraf 657 Reeskont Faiz Giderleri (-) hesabıdır ve bu, cari yıldan vazgeçilen ama gerçekte vadenin sonunda hak edilecek olan faizin cari yıla atılmamasını sağlar — yani bir gelir öteleme aracıdır. İç iskonto formülünde 36.000 = 360 (gün) × 100 (yüzde) sabit faktördür.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-2', 'reeskont', $ml$Önceki Dönem Alacak Senedi Reeskontunun İptali$ml$, 'orta', $ml$01 Ocak 2027 yeni dönem açılışında, geçen yıl sonunda yapılmış olan alacak senedi reeskont kaydının iptali gerçekleştirilecektir.

31.12.2026 tarihinde BERKE TEKNOLOJİ A.Ş. senedi için 6.976,74 TL reeskont hesaplanmış ve 657 Reeskont Faiz Giderleri (-) hesabına gider yazılmıştı. 122 Alacak Senetleri Reeskontu (-) hesabında 6.976,74 TL alacak bakiyesi bulunmaktadır.

Dönemsellik ilkesi gereği bu reeskont yeni dönemin geliri olduğundan ters kayıt yapılarak iptal edilecektir.

Not: Reeskont iptal kayıtları her yıl başı yapılır; bu sayede yeni dönemde reeskont gelir hesabına yansır.$ml$, $ml$122 Alacak Senetleri Reeskontu (-) borç (kapatma). 647 Reeskont Faiz Gelirleri (-) alacak (yeni dönem geliri).$ml$, $ml$Reeskont kayıtları "geçici" niteliktedir. Yıl sonunda gider veya gelir tahakkuk ettirilen reeskont, yeni dönemin başında ters kayıtla iptal edilir. Alacak senedi reeskontunun iptalinde 122 hesabı borçlandırılarak kapatılır; karşı taraf 647 Reeskont Faiz Gelirleri (-) hesabıdır. Böylece geçen yıl gider olarak yazılan tutar bu yıl gelir olarak yazılarak dönem sonuçlarına net etkisi sıfır olur. Senet vadesinde tahsil edildiğinde nominal değer üzerinden 102/121 kaydı yapılacak, reeskontun ek bir etkisi olmayacaktır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-3', 'reeskont', $ml$Borç Senedinin Yıl Sonu Reeskontu$ml$, 'zor', $ml$31 Aralık 2026 dönem sonunda işletmemizin ÖNDER ELEKTRİK MALZEMELERİ LTD. ŞTİ.'ye verdiği borç senedi bulunmaktadır:

• Senet nominal değeri: 50.000 TL
• Düzenleme tarihi: 02.11.2026
• Vade tarihi: 02.03.2027
• Vadeye kalan gün sayısı (31.12.2026 itibarıyla): 60 gün
• Cari TCMB kısa vadeli avans faiz oranı: %36 (yıllık)

VUK 281. madde gereği borç senedi için reeskont hesaplanacaktır.

**İç iskonto formülü:**
F = (A × n × t) / (36.000 + n × t)
F = (50.000 × 60 × 36) / (36.000 + 60 × 36)
F = 108.000.000 / 38.160
F = **2.830,19 TL**

Not: Borç senedi reeskontu işletme açısından gelir niteliğindedir (geleceğe ödenecek faiz cari dönemde hak edilmiş gelir gibi davranır). Bu yüzden 322 borç, 647 alacak yazılır.$ml$, $ml$322 Borç Senetleri Reeskontu (-) borç (kontr-pasif). 647 Reeskont Faiz Gelirleri (-) alacak (cari dönem geliri).$ml$, $ml$Vadeli borç senedinin nominal değeri ile bilanço günündeki peşin değeri arasındaki fark işletme aleyhine değil, lehine olur — çünkü borçtan henüz hak edilmemiş faiz indirilmiş olur. Bu nedenle borç senedi reeskontu gelir niteliğindedir. 321 Borç Senetleri'nin altında 322 Borç Senetleri Reeskontu (-) hesabı kontr-pasif olarak gösterilir (pasifin negatifi → bilançoda borç bakiyeli görünür ama pasif sınıfındadır). Karşılığında 647 Reeskont Faiz Gelirleri (-) hesabı alacaklandırılarak cari yıl gelirine eklenir. Yeni dönem başında bu reeskont da iptal edilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-4', 'reeskont', $ml$Önceki Dönem Borç Senedi Reeskontunun İptali$ml$, 'orta', $ml$01 Ocak 2027 yeni dönem açılışında, geçen yıl sonunda yapılmış olan borç senedi reeskont kaydının iptali gerçekleştirilecektir.

31.12.2026 tarihinde ÖNDER ELEKTRİK senedi için 2.830,19 TL reeskont hesaplanmış ve 647 Reeskont Faiz Gelirleri (-) hesabına gelir yazılmıştı. 322 Borç Senetleri Reeskontu (-) hesabında 2.830,19 TL borç bakiyesi bulunmaktadır.

Dönemsellik ilkesi gereği bu reeskont yeni dönemin gideri olduğundan ters kayıt yapılarak iptal edilecektir.$ml$, $ml$657 Reeskont Faiz Giderleri (-) borç (yeni dönem gideri). 322 Borç Senetleri Reeskontu (-) alacak (kapatma).$ml$, $ml$Borç senedi reeskontunun iptalinde 322 hesabı alacaklandırılarak kapatılır; karşı taraf 657 Reeskont Faiz Giderleri (-) hesabıdır. Geçen yıl gelir olarak yazılan tutar bu yıl gider olarak yazılır; böylece dönem sonuçlarına net etkisi sıfırlanır. Vade tarihinde borç senedi nominal değer üzerinden 321/102 kaydıyla ödenir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-5', 'reeskont', $ml$Karma Reeskont — Hem Alacak Hem Borç Senetleri (Yıl Sonu)$ml$, 'zor', $ml$Bu kez 31 Aralık 2027 dönem sonu için işletme portföyünde aynı anda hem alacak hem borç senetleri bulunmakta ve tek bir kompozit yıl sonu reeskont kaydı oluşturulması istenmektedir:

**Alacak senetleri portföyü:**
• MERAL OTOMASYON A.Ş. — 80.000 TL nominal, 75 gün vadeli, %32 faiz
  F = (80.000 × 75 × 32) / (36.000 + 75 × 32) = 192.000.000/38.400 = **5.000,00 TL** (alacak senedi reeskontu)

**Borç senetleri portföyü:**
• YILDIZ AMBALAJ LTD. — 60.000 TL nominal, 90 gün vadeli, %32 faiz
  F = (60.000 × 90 × 32) / (36.000 + 90 × 32) = 172.800.000/38.880 = **4.444,44 TL** (borç senedi reeskontu)

Bu iki reeskont tek bir yevmiye fişinde, dört satırlı kompozit kayıt halinde işlenecektir.$ml$, $ml$657 borç (alacak senedi reeskont gideri) + 322 borç (borç senedi reeskontu — kontr-pasif). 122 alacak (alacak senedi reeskontu) + 647 alacak (borç senedi reeskont geliri).$ml$, $ml$İşletme portföyünde aynı anda hem alacak hem borç senetleri varsa yıl sonunda her ikisi için ayrı ayrı reeskont hesaplanır ancak muhasebede tek bir kompozit yevmiye fişine alınabilir. Toplam borç tarafı (657 + 322) = 5.000,00 + 4.444,44 = 9.444,44 TL; toplam alacak tarafı (122 + 647) = 5.000,00 + 4.444,44 = 9.444,44 TL eşitlik sağlanır. Sonuç hesaplarına etkisi: alacak senedi reeskontu 5.000 TL gider yaratırken, borç senedi reeskontu 4.444,44 TL gelir yaratır. Net etki dönem kar-zararı üzerinde 555,56 TL gider azaltıcı yöndedir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-6', 'reeskont', $ml$Reeskontlanmış Alacak Senedinin Vadesinde Tahsili$ml$, 'orta', $ml$26 Mart 2027 tarihinde geçen yıl sonunda reeskontu yapılmış olan BERKE TEKNOLOJİ A.Ş. alacak senedi vadesinde keşideci tarafından bankamıza ödenmiştir. Senet nominal değeri 100.000 TL'dir.

Reeskont iptal kaydı zaten 01.01.2027 tarihinde yapılmış olup hesaplarda artık reeskont bakiyesi bulunmamaktadır. Bu nedenle vadesindeki tahsilat için sadece nominal değer üzerinden basit bir senet kapama kaydı yeterlidir.

Aşağıda banka tahsilat dekontu mevcuttur.

Not: Reeskont yöntemi sayesinde 6.976,74 TL'lik faiz, 2026 yılında değil 2027 yılında gelir olarak gösterilmiş olur.$ml$, $ml$102 Bankalar borç (banka tahsilatı) → 121 Alacak Senetleri alacak (nominal değerle senet kapama). Reeskontla ilgili ek bir kayıt yapılmaz; iptal zaten 01.01'de yapıldı.$ml$, $ml$Yıl sonu reeskont sistemi şu mantıkla çalışır: yıl sonunda reeskont yap → yeni yılbaşında iptal et → vade geldiğinde nominal değer üzerinden tahsilat kaydı yap. Bu döngü sayesinde reeskontun amacı (faiz gelirinin doğru döneme atılması) gerçekleşir. Tahsilat anında 122 hesabı zaten boş olduğu için (1 Ocak'ta iptal edilmişti) ek bir reeskont kaydı yapmak gerekmez. Senedin nominal değeri (100.000 TL) tahsil edildiğinde 121 Alacak Senetleri kapatılır ve 102 Bankalar artırılır.$ml$, $ml$[{"tur":"dekont","baslik":"SENET TAHSİLAT DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20270326-0084915","islemTarihi":"26.03.2027","islemSaati":"14:08","valor":"26.03.2027","islemTuru":"HAVALE","aciklama":"BERKE TEKNOLOJİ A.Ş. — SENET TAHSİLATI (SN: BT2026-0118)","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-7281904","iban":"TR93 0008 9000 0142 7281 9040 00","karsiTaraf":{"unvan":"BERKE TEKNOLOJİ A.Ş.","vkn":"1750329468","adres":"OSTİM Mah. 1234. Sok. No: 17, Yenimahalle / ANKARA"},"karsiIban":"TR15 0006 4000 0017 5032 9468 00","tutar":100000,"yon":"ALACAK","netTutar":100000,"bakiye":387912.18,"not":"Senet nominal değer üzerinden tahsil edildi. Düzenleme: 26.12.2026, vade: 26.03.2027 (90 gün)."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-1', 'kambiyo', $ml$Bankadan Döviz Alımı (TL → USD)$ml$, 'kolay', $ml$İşletmemiz, yaklaşan ithalat ödemesi için 12 Mart 2027 tarihinde bankaya başvurmuş ve TL hesabından 5.000 USD satın almıştır. Bankanın işlem anındaki döviz satış kuru: 1 USD = 33,50 TL.

• Alınan döviz: 5.000 USD
• Toplam TL karşılığı: 5.000 × 33,50 = 167.500 TL
• TL hesabından çıkış: 167.500 TL
• USD hesabına giriş: 5.000 USD (defter değeri 167.500 TL)

Not: Aynı banka içinde TL hesabından döviz hesabına geçiş söz konusudur. Her iki hesap da 102 Bankalar altında izlenir; alt hesap detayı bu kayıtta gösterilmez. Bu işlemde kur farkı oluşmaz çünkü alış kuru defter değerini belirler.$ml$, $ml$102 Bankalar (USD hesabı) borç (döviz girişi) → 102 Bankalar (TL hesabı) alacak (TL çıkışı). Tek hesap kodu (102) iki kez kullanılır.$ml$, $ml$Türk muhasebe uygulamasında bir bankada bulunan TL ve döviz hesapları aynı 102 Bankalar hesabında ancak farklı alt hesaplarda izlenir. TL'den döviz alımında işlem aslında bir hesap dönüşümüdür: TL hesabı azalır, döviz hesabı (TL karşılığıyla) artar. Döviz hesabının defter değeri alış kuru üzerinden belirlenir (5.000 × 33,50 = 167.500 TL). Bu ilk girişte kur farkı doğmaz; kur farkı ileride bu döviz çıkarken veya yıl sonunda yeniden değerlenirken ortaya çıkar.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-2', 'kambiyo', $ml$Dövizli İhracat Satışı (EUR — KDV %0)$ml$, 'orta', $ml$İşletmemiz YEŞIM TEKSTİL HAMBURG GMBH firmasına 20 Mart 2027 tarihinde ihracat satışı gerçekleştirmiştir.

• Satış bedeli: 8.000 EUR
• Gümrük çıkış beyannamesi tarihindeki TCMB döviz alış kuru: 1 EUR = 36,00 TL
• TL karşılığı: 8.000 × 36,00 = 288.000 TL
• İhracat KDV oranı: %0 (KDV istisnası — KDVK Md. 11)
• Vade: 30 gün (ihracat bedeli tahsilat zamanı: 19.04.2027)

Dövizli alıcılar hesabında EUR cinsinden 8.000 EUR, TL defter değeri 288.000 TL olarak takip edilecektir.$ml$, $ml$120 Alıcılar borç (288.000 TL — TL defter değeri) → 601 Yurt Dışı Satışlar alacak (KDV yok). KDV satırı yazılmaz çünkü ihracat istisna.$ml$, $ml$KDVK Md. 11 uyarınca yurt dışına yapılan mal ihracı KDV'den istisnadır; bu yüzden 391 Hesaplanan KDV satırı yazılmaz. Dövizli alacak, fatura/gümrük beyannamesi tarihindeki TCMB döviz alış kuru üzerinden TL'ye çevrilerek 120 Alıcılar (alt hesap: dövizli alıcılar) hesabına işlenir. Aynı tutar 601 Yurt Dışı Satışlar hesabına gelir olarak alacaklandırılır. Hesabın defter değeri ileride tahsilat veya yıl sonu değerleme anında güncellenecek; aradaki kur farkı 646 Kambiyo Karları veya 656 Kambiyo Zararları (-) hesaplarına yazılacaktır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-3', 'kambiyo', $ml$Dövizli Alacağın Tahsili — Lehte Kur Farkı$ml$, 'zor', $ml$19 Nisan 2027 tarihinde YEŞIM TEKSTİL HAMBURG GMBH ihracat alacağımız (8.000 EUR) banka hesabımıza tahsil edilmiştir.

• Defter değeri (fatura tarihindeki kurla): 8.000 × 36,00 = 288.000 TL
• Tahsilat günü TCMB döviz alış kuru: 1 EUR = 37,25 TL
• Tahsilat günündeki TL karşılığı: 8.000 × 37,25 = 298.000 TL
• **Lehte kur farkı: 298.000 − 288.000 = 10.000 TL** (kambiyo karı)

102 Bankalar (EUR hesabı) tahsilat tutarı ile borçlandırılır, 120 Alıcılar defter değeri ile kapatılır, fark 646 Kambiyo Karları'na alacak yazılır.

Not: Banka tahsilat dekontu aşağıda mevcuttur.$ml$, $ml$102 borç (tahsilat günü TL karşılığı = 298.000) → 120 alacak (defter değeri = 288.000) + 646 alacak (kur farkı karı = 10.000).$ml$, $ml$Dövizli alacağın tahsilatında banka hesabı tahsilat günü kuruyla TL'ye çevrilerek borçlandırılır; alıcılar hesabı ise daha önce kayıtlı olan defter değeriyle alacaklandırılır. İki tutar arasındaki fark kur farkıdır ve işletme lehineyse 646 Kambiyo Karları'na, aleyhineyse 656 Kambiyo Zararları (-) hesabına yazılır. Bu yapı sayesinde alıcılar hesabı tam olarak kapanır (defter değeri ile birebir), kur dalgalanmasının kar/zarar etkisi ise sonuç hesaplarına ayrı olarak yansır.$ml$, $ml$[{"tur":"dekont","baslik":"İHRACAT BEDELİ TRANSFER DEKONTU","bankaAdi":"BAŞKENT TİCARİ BANKASI A.Ş.","subeAdi":"Kızılay Şubesi","subeKodu":"0142","dekontNo":"20270419-EU-001183","islemTarihi":"19.04.2027","islemSaati":"15:42","valor":"19.04.2027","islemTuru":"EFT","aciklama":"YEŞIM TEKSTİL HAMBURG — IHRACAT BEDELİ (FAT NO: ITH2027-0034)","hesapSahibi":{"unvan":"ÖRNEK TİCARET LTD. ŞTİ.","vkn":"1234567890","adres":"Atatürk Bulvarı No: 142/5, Çankaya / ANKARA"},"hesapNo":"0142-EU-7281904","iban":"TR41 0008 9000 0142 7281 9040 EU","karsiTaraf":{"unvan":"YEŞIM TEKSTİL HAMBURG GMBH","adres":"Hafencity 17, 20457 Hamburg / DEUTSCHLAND"},"karsiIban":"DE89 3704 0044 0532 0130 00","tutar":8000,"yon":"ALACAK","netTutar":8000,"bakiye":12300,"not":"Hesap döviz cinsinden takip edilmektedir. Tutar: 8.000,00 EUR. TCMB döviz alış kuru (19.04.2027): 37,25 TL. TL karşılığı: 298.000,00 TL."}]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-4', 'kambiyo', $ml$Dövizli Borç Ödemesi — Aleyhte Kur Farkı$ml$, 'zor', $ml$AMERICAN PARTS INC. firmasından ithal ettiğimiz makine yedek parçaları için açık hesapta 4.000 USD borcumuz bulunmaktadır. Borç ilk kayda alındığında defter değeri 134.400 TL idi (kur: 33,60).

25 Nisan 2027 tarihinde borç bankamızdan SWIFT yoluyla ödenmiştir.

• Borç defter değeri: 4.000 × 33,60 = 134.400 TL
• Ödeme günü TCMB döviz satış kuru: 1 USD = 35,80 TL
• Ödeme günündeki TL karşılığı: 4.000 × 35,80 = 143.200 TL
• **Aleyhte kur farkı: 143.200 − 134.400 = 8.800 TL** (kambiyo zararı)

320 Satıcılar defter değeri ile kapatılır, banka çıkışı ödeme günü kuru ile alacaklandırılır, fark 656 Kambiyo Zararları (-) hesabına gider yazılır.$ml$, $ml$320 borç (defter değeri = 134.400) + 656 borç (kur farkı zararı = 8.800) → 102 alacak (ödeme günü TL karşılığı = 143.200).$ml$, $ml$Dövizli borcun ödenmesinde satıcılar hesabı defter değeriyle borçlandırılarak kapatılır. Banka hesabı ise ödeme günü TL karşılığı ile alacaklandırılır. Aradaki fark işletme aleyhineyse (kur yükselmiş, daha fazla TL ödemek gerekmiş) 656 Kambiyo Zararları (-) hesabına gider yazılır. Bu, borçlu pozisyondaki işletmenin TL'nin değer kaybetmesinden zarar görmesini muhasebeleştirir. KKEG (kanunen kabul edilmeyen gider) niteliği taşımaz; tam indirilebilir bir gider kalemidir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-5', 'kambiyo', $ml$Yıl Sonu Döviz Hesabı Değerlemesi (Lehte)$ml$, 'orta', $ml$31 Aralık 2027 dönem sonu kayıtları kapsamında banka USD hesabımızda 5.000 USD bulunmaktadır. Defter değeri 167.500 TL'dir (alış kuru: 33,50).

• Yıl sonu (31.12.2027) TCMB USD döviz alış kuru: 35,00 TL
• Yıl sonu değerlenmiş tutar: 5.000 × 35,00 = 175.000 TL
• **Değerleme farkı (lehte): 175.000 − 167.500 = 7.500 TL** (kambiyo karı)

VUK 280. madde uyarınca dövizli aktif/pasif kıymetler dönem sonunda TCMB döviz alış (aktif için) / satış (pasif için) kuruyla değerlenir. Bu, dövizin defter değerini günceller ve değerleme farkını sonuç hesaplarına yansıtır.$ml$, $ml$102 borç (artış değeri 7.500) → 646 Kambiyo Karları alacak.$ml$, $ml$Yıl sonu döviz değerlemesi, hesapta tutulan dövizin TL karşılığını cari kura getirmek için yapılır. Lehte fark (kur yükselmiş) durumunda 102 Bankalar hesabı 7.500 TL borçlandırılarak defter değeri 167.500 TL'den 175.000 TL'ye yükseltilir; karşılığında 646 Kambiyo Karları gelir olarak yazılır. USD bakiyesi (5.000 USD) değişmez; sadece TL karşılığı güncellenir. Bu işlem her yıl sonu yapılır ve değerleme farkı kümülatif olmaz — bir sonraki yıl da yeni kur üzerinden tekrar değerleme yapılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-6', 'kambiyo', $ml$Yıl Sonu Dövizli Borç Değerlemesi (Aleyhte)$ml$, 'orta', $ml$31 Aralık 2027 dönem sonunda 320 Satıcılar hesabında BOSCH ELEKTRONIK GMBH firmasına 6.000 EUR ithalat borcumuz bulunmaktadır. Defter değeri 216.000 TL'dir (kur: 36,00).

• Yıl sonu (31.12.2027) TCMB EUR döviz satış kuru: 38,50 TL
• Yıl sonu değerlenmiş tutar: 6.000 × 38,50 = 231.000 TL
• **Değerleme farkı (aleyhte): 231.000 − 216.000 = 15.000 TL** (kambiyo zararı)

Dövizli borçlar TCMB döviz satış kuru ile değerlenir (VUK 280). Kur yükseldiği için TL borç tutarı artar — bu işletme aleyhinedir.$ml$, $ml$656 Kambiyo Zararları (-) borç (artış 15.000) → 320 Satıcılar alacak (TL borç tutarı yükseltiliyor).$ml$, $ml$Dövizli borç hesabının yıl sonu değerlemesinde kur yükselmişse — yani TL değer kaybetmişse — borçlu pozisyondaki işletme aleyhine bir durum oluşur: aynı miktar dövizi geri ödemek için daha fazla TL gerekecektir. Bu artış 320 Satıcılar hesabına alacak (borcun TL karşılığı yükseltilir) ve 656 Kambiyo Zararları (-) hesabına borç (gider tahakkuku) yazılır. EUR bakiyesi (6.000 EUR) değişmez. Bir sonraki yıl ödeme veya yeniden değerleme anında bu yeni defter değeri (231.000 TL) baz alınır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'statik', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    belgeler = excluded.belgeler,
    durum = excluded.durum;

-- Çözümler (mevcutları sil, yeniden ekle)
delete from cozumler where soru_id in ('kasa-1', 'kasa-2', 'kasa-3', 'kasa-4', 'kasa-5', 'kasa-6', 'kasa-7', 'kasa-8', 'banka-1', 'banka-2', 'banka-3', 'banka-4', 'banka-5', 'banka-6', 'banka-7', 'banka-8', 'mal-1', 'mal-2', 'mal-3', 'mal-4', 'mal-5', 'mal-6', 'mal-7', 'mal-8', 'senet-1', 'senet-2', 'senet-3', 'senet-4', 'senet-5', 'senet-6', 'senet-7', 'senet-8', 'kdv-1', 'kdv-2', 'kdv-3', 'kdv-4', 'kdv-5', 'kdv-6', 'kdv-7', 'kdv-8', 'amort-1', 'amort-2', 'amort-3', 'amort-4', 'amort-5', 'amort-6', 'amort-7', 'amort-8', 'per-1', 'per-2', 'per-3', 'per-4', 'per-5', 'per-6', 'per-7', 'per-8', 'donem-1', 'donem-2', 'donem-3', 'donem-4', 'donem-5', 'donem-6', 'supheli-1', 'supheli-2', 'supheli-3', 'supheli-4', 'supheli-5', 'supheli-6', 'reeskont-1', 'reeskont-2', 'reeskont-3', 'reeskont-4', 'reeskont-5', 'reeskont-6', 'kambiyo-1', 'kambiyo-2', 'kambiyo-3', 'kambiyo-4', 'kambiyo-5', 'kambiyo-6');

insert into cozumler (soru_id, sira, kod, borc, alacak) values
  ('kasa-1', 1, '100', 500000, 0),
  ('kasa-1', 2, '500', 0, 500000),
  ('kasa-2', 1, '100', 9350, 0),
  ('kasa-2', 2, '600', 0, 8500),
  ('kasa-2', 3, '391', 0, 850),
  ('kasa-3', 1, '770', 1800, 0),
  ('kasa-3', 2, '191', 360, 0),
  ('kasa-3', 3, '100', 0, 2160),
  ('kasa-4', 1, '196', 25000, 0),
  ('kasa-4', 2, '100', 0, 25000),
  ('kasa-5', 1, '197', 1500, 0),
  ('kasa-5', 2, '100', 0, 1500),
  ('kasa-6', 1, '100', 800, 0),
  ('kasa-6', 2, '397', 0, 800),
  ('kasa-7', 1, '196', 5000, 0),
  ('kasa-7', 2, '100', 0, 5000),
  ('kasa-8', 1, '770', 2000, 0),
  ('kasa-8', 2, '191', 400, 0),
  ('kasa-8', 3, '100', 0, 2400),
  ('banka-1', 1, '102', 100000, 0),
  ('banka-1', 2, '100', 0, 100000),
  ('banka-2', 1, '102', 250000, 0),
  ('banka-2', 2, '300', 0, 250000),
  ('banka-3', 1, '320', 75000, 0),
  ('banka-3', 2, '102', 0, 75000),
  ('banka-4', 1, '102', 96500, 0),
  ('banka-4', 2, '120', 0, 96500),
  ('banka-5', 1, '300', 41666.67, 0),
  ('banka-5', 2, '780', 8925, 0),
  ('banka-5', 3, '102', 0, 50591.67),
  ('banka-6', 1, '770', 1575, 0),
  ('banka-6', 2, '102', 0, 1575),
  ('banka-7', 1, '102', 11599.4, 0),
  ('banka-7', 2, '653', 200.6, 0),
  ('banka-7', 3, '108', 0, 11800),
  ('banka-8', 1, '102', 49970, 0),
  ('banka-8', 2, '653', 30, 0),
  ('banka-8', 3, '120', 0, 50000),
  ('mal-1', 1, '153', 50000, 0),
  ('mal-1', 2, '191', 10000, 0),
  ('mal-1', 3, '100', 0, 60000),
  ('mal-2', 1, '153', 33300, 0),
  ('mal-2', 2, '191', 6660, 0),
  ('mal-2', 3, '102', 0, 39960),
  ('mal-3', 1, '153', 180000, 0),
  ('mal-3', 2, '191', 36000, 0),
  ('mal-3', 3, '103', 0, 108000),
  ('mal-3', 4, '321', 0, 108000),
  ('mal-4', 1, '120', 108000, 0),
  ('mal-4', 2, '600', 0, 90000),
  ('mal-4', 3, '391', 0, 18000),
  ('mal-4', 4, '621', 66400, 0),
  ('mal-4', 5, '153', 0, 66400),
  ('mal-5', 1, '610', 13500, 0),
  ('mal-5', 2, '391', 2700, 0),
  ('mal-5', 3, '120', 0, 16200),
  ('mal-5', 4, '153', 9960, 0),
  ('mal-5', 5, '621', 0, 9960),
  ('mal-6', 1, '100', 14400, 0),
  ('mal-6', 2, '600', 0, 12000),
  ('mal-6', 3, '391', 0, 2400),
  ('mal-6', 4, '621', 7800, 0),
  ('mal-6', 5, '153', 0, 7800),
  ('mal-7', 1, '320', 6000, 0),
  ('mal-7', 2, '153', 0, 5000),
  ('mal-7', 3, '191', 0, 1000),
  ('mal-8', 1, '197', 1500, 0),
  ('mal-8', 2, '153', 0, 1500),
  ('senet-1', 1, '101', 60000, 0),
  ('senet-1', 2, '120', 0, 60000),
  ('senet-2', 1, '320', 80000, 0),
  ('senet-2', 2, '321', 0, 80000),
  ('senet-3', 1, '101', 144000, 0),
  ('senet-3', 2, '600', 0, 120000),
  ('senet-3', 3, '391', 0, 24000),
  ('senet-4', 1, '320', 60000, 0),
  ('senet-4', 2, '101', 0, 60000),
  ('senet-5', 1, '321', 80000, 0),
  ('senet-5', 2, '102', 0, 80000),
  ('senet-6', 1, '120', 144000, 0),
  ('senet-6', 2, '101', 0, 144000),
  ('senet-7', 1, '320', 25000, 0),
  ('senet-7', 2, '101', 0, 25000),
  ('senet-8', 1, '102', 47419.05, 0),
  ('senet-8', 2, '780', 2380.95, 0),
  ('senet-8', 3, '653', 200, 0),
  ('senet-8', 4, '121', 0, 50000),
  ('kdv-1', 1, '391', 25000, 0),
  ('kdv-1', 2, '191', 0, 18000),
  ('kdv-1', 3, '360', 0, 7000),
  ('kdv-2', 1, '391', 22000, 0),
  ('kdv-2', 2, '190', 8000, 0),
  ('kdv-2', 3, '191', 0, 30000),
  ('kdv-3', 1, '391', 40000, 0),
  ('kdv-3', 2, '190', 0, 8000),
  ('kdv-3', 3, '191', 0, 24000),
  ('kdv-3', 4, '360', 0, 8000),
  ('kdv-4', 1, '360', 7000, 0),
  ('kdv-4', 2, '102', 0, 7000),
  ('kdv-5', 1, '770', 100000, 0),
  ('kdv-5', 2, '191', 20000, 0),
  ('kdv-5', 3, '102', 0, 112000),
  ('kdv-5', 4, '360', 0, 8000),
  ('kdv-6', 1, '102', 112000, 0),
  ('kdv-6', 2, '600', 0, 100000),
  ('kdv-6', 3, '391', 0, 12000),
  ('kdv-7', 1, '254', 960000, 0),
  ('kdv-7', 2, '102', 0, 960000),
  ('kdv-8', 1, '391', 18000, 0),
  ('kdv-8', 2, '190', 4000, 0),
  ('kdv-8', 3, '191', 0, 22000),
  ('amort-1', 1, '255', 20000, 0),
  ('amort-1', 2, '191', 4000, 0),
  ('amort-1', 3, '102', 0, 24000),
  ('amort-2', 1, '254', 800000, 0),
  ('amort-2', 2, '191', 160000, 0),
  ('amort-2', 3, '320', 0, 960000),
  ('amort-3', 1, '770', 10000, 0),
  ('amort-3', 2, '257', 0, 10000),
  ('amort-4', 1, '730', 24000, 0),
  ('amort-4', 2, '257', 0, 24000),
  ('amort-5', 1, '102', 14400, 0),
  ('amort-5', 2, '257', 14400, 0),
  ('amort-5', 3, '255', 0, 24000),
  ('amort-5', 4, '391', 0, 2400),
  ('amort-5', 5, '679', 0, 2400),
  ('amort-6', 1, '257', 30000, 0),
  ('amort-6', 2, '255', 0, 30000),
  ('amort-7', 1, '770', 64000, 0),
  ('amort-7', 2, '257', 0, 64000),
  ('amort-8', 1, '100', 36000, 0),
  ('amort-8', 2, '257', 60000, 0),
  ('amort-8', 3, '689', 10000, 0),
  ('amort-8', 4, '255', 0, 100000),
  ('amort-8', 5, '391', 0, 6000),
  ('per-1', 1, '770', 30000, 0),
  ('per-1', 2, '335', 0, 22500),
  ('per-1', 3, '361', 0, 4500),
  ('per-1', 4, '360', 0, 3000),
  ('per-2', 1, '770', 6750, 0),
  ('per-2', 2, '361', 0, 6750),
  ('per-3', 1, '335', 22500, 0),
  ('per-3', 2, '102', 0, 22500),
  ('per-4', 1, '361', 11250, 0),
  ('per-4', 2, '102', 0, 11250),
  ('per-5', 1, '360', 3000, 0),
  ('per-5', 2, '102', 0, 3000),
  ('per-6', 1, '335', 28000, 0),
  ('per-6', 2, '196', 0, 25000),
  ('per-6', 3, '100', 0, 3000),
  ('per-7', 1, '336', 5000, 0),
  ('per-7', 2, '100', 0, 5000),
  ('per-8', 1, '770', 50000, 0),
  ('per-8', 2, '335', 0, 37120.5),
  ('per-8', 3, '360', 0, 5379.5),
  ('per-8', 4, '361', 0, 7500),
  ('donem-1', 1, '180', 60000, 0),
  ('donem-1', 2, '102', 0, 60000),
  ('donem-2', 1, '770', 30000, 0),
  ('donem-2', 2, '180', 0, 30000),
  ('donem-3', 1, '102', 90000, 0),
  ('donem-3', 2, '380', 0, 90000),
  ('donem-4', 1, '380', 45000, 0),
  ('donem-4', 2, '649', 0, 45000),
  ('donem-5', 1, '770', 4500, 0),
  ('donem-5', 2, '381', 0, 4500),
  ('donem-6', 1, '181', 45000, 0),
  ('donem-6', 2, '642', 0, 45000),
  ('supheli-1', 1, '128', 80000, 0),
  ('supheli-1', 2, '120', 0, 80000),
  ('supheli-2', 1, '654', 80000, 0),
  ('supheli-2', 2, '129', 0, 80000),
  ('supheli-3', 1, '102', 30000, 0),
  ('supheli-3', 2, '128', 0, 30000),
  ('supheli-3', 3, '129', 30000, 0),
  ('supheli-3', 4, '644', 0, 30000),
  ('supheli-4', 1, '129', 50000, 0),
  ('supheli-4', 2, '128', 0, 50000),
  ('supheli-5', 1, '659', 15000, 0),
  ('supheli-5', 2, '120', 0, 15000),
  ('supheli-6', 1, '128', 25000, 0),
  ('supheli-6', 2, '121', 0, 25000),
  ('reeskont-1', 1, '657', 6976.74, 0),
  ('reeskont-1', 2, '122', 0, 6976.74),
  ('reeskont-2', 1, '122', 6976.74, 0),
  ('reeskont-2', 2, '647', 0, 6976.74),
  ('reeskont-3', 1, '322', 2830.19, 0),
  ('reeskont-3', 2, '647', 0, 2830.19),
  ('reeskont-4', 1, '657', 2830.19, 0),
  ('reeskont-4', 2, '322', 0, 2830.19),
  ('reeskont-5', 1, '657', 5000, 0),
  ('reeskont-5', 2, '322', 4444.44, 0),
  ('reeskont-5', 3, '122', 0, 5000),
  ('reeskont-5', 4, '647', 0, 4444.44),
  ('reeskont-6', 1, '102', 100000, 0),
  ('reeskont-6', 2, '121', 0, 100000),
  ('kambiyo-1', 1, '102', 167500, 0),
  ('kambiyo-1', 2, '102', 0, 167500),
  ('kambiyo-2', 1, '120', 288000, 0),
  ('kambiyo-2', 2, '601', 0, 288000),
  ('kambiyo-3', 1, '102', 298000, 0),
  ('kambiyo-3', 2, '120', 0, 288000),
  ('kambiyo-3', 3, '646', 0, 10000),
  ('kambiyo-4', 1, '320', 134400, 0),
  ('kambiyo-4', 2, '656', 8800, 0),
  ('kambiyo-4', 3, '102', 0, 143200),
  ('kambiyo-5', 1, '102', 7500, 0),
  ('kambiyo-5', 2, '646', 0, 7500),
  ('kambiyo-6', 1, '656', 15000, 0),
  ('kambiyo-6', 2, '320', 0, 15000);

commit;
