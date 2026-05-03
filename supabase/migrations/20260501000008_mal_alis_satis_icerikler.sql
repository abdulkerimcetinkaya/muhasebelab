-- MuhasebeLab — "Ticari Mal Alımı ve Satımı" 6 alt-konunun BlockNote içerikleri
--
-- Format: BlockNote PartialBlock[] JSON. content: string shorthand kullanılıyor.
-- Editörde açıldığında BlockNote eksik alanları (id, props.textColor, vs.) doldurur.
-- Her konuda heading (level 2) + paragraph + bulletListItem / numberedListItem.

-- 1) Stok Kavramı --------------------------------------------------------
update unite_konulari set
  icerik = $json$[
    {"type":"heading","props":{"level":2},"content":"Önce bir hikâye"},
    {"type":"paragraph","content":"Mahallenin köşesinde küçük bir bakkal düşün. Sabah açıyor, raflarına dünkü siparişten gelen kutuları diziyor. Akşam kapandığında bazı kutular boş, bazıları yarı dolu. Yarın açtığında raflarda kalan o mallar — işte bunlara biz \"stok\" diyoruz."},
    {"type":"paragraph","content":"Stok, satılmak için bekleyen maldır. Henüz para olmadı, henüz raftan çıkmadı; ama işletme onun için cebinden para harcamış. Bu yüzden stok bir varlıktır — Tek Düzen Hesap Planı'nda 153 numaralı hesabın anlamı tam olarak budur: Ticari Mallar."},
    {"type":"heading","props":{"level":2},"content":"Stoğun iki yüzü"},
    {"type":"paragraph","content":"Bir mal işletmeye girdiğinde 153 borçlanır. Sattığında iki şey aynı anda yaşanır: müşteriden para gelir (600 — Yurt İçi Satışlar), raftan mal çıkar. Bu çıkışın bir muhasebe karşılığı olmalı. Onu kaydettiğimiz hesap 621 — Satılan Ticari Mal Maliyeti'dir; 153'ten alınır, 621'e aktarılır. Stok azalır, gider doğar."},
    {"type":"heading","props":{"level":2},"content":"İki yöntem, iki dünya"},
    {"type":"bulletListItem","content":"Sürekli envanter: her satışta anında 621'e maliyet yazılır. Her an stoğun ne kadar olduğu bilinir."},
    {"type":"bulletListItem","content":"Aralıklı envanter: yıl içinde sadece satışlar kaydedilir, stoğa dokunulmaz; yıl sonunda fiziki sayım yapılır."},
    {"type":"paragraph","content":"Hangisini seçersen seç, sonuç aynı yere çıkar: alınan mal ya raftadır ya gitmiştir. Muhasebenin bu sayfada yaptığı şey, o yolculuğu rakamlarla anlatmaktır."}
  ]$json$::jsonb,
  icerik_guncellendi = now()
where id = 'stok-kavrami';

-- 2) Mal Alış ------------------------------------------------------------
update unite_konulari set
  icerik = $json$[
    {"type":"heading","props":{"level":2},"content":"Bir fatura geliyor"},
    {"type":"paragraph","content":"Sabah, postacı kapıyı çalıyor. Elindeki zarfta toptancıdan gelen bir fatura: 50 koli süt, 30 koli un, üzerinde de %20 KDV. Henüz para ödememişsin — toptancı sana bir ay vade vermiş."},
    {"type":"paragraph","content":"Şimdi üç şey aynı anda olmuş gibi gelir, ama muhasebe gözünden bakınca üç ayrı olay vardır:"},
    {"type":"numberedListItem","content":"Mal işletmeye girdi — stoğun arttı."},
    {"type":"numberedListItem","content":"Devlet sana KDV'ni ileride geri verecek — çünkü bu KDV'yi sen değil, son tüketici ödeyecek; sen aradaki kuryesin."},
    {"type":"numberedListItem","content":"Toptancıya borçlandın — bir ay sonra ödeyeceksin."},
    {"type":"heading","props":{"level":2},"content":"Üç olay, üç hesap"},
    {"type":"bulletListItem","content":"153 — Ticari Mallar (borç): mal girdi, stok arttı."},
    {"type":"bulletListItem","content":"191 — İndirilecek KDV (borç): devletten alacak doğdu."},
    {"type":"bulletListItem","content":"320 — Satıcılar (alacak): toptancıya borç doğdu."},
    {"type":"paragraph","content":"Eğer parayı peşin ödediysen 320 yerine 100 — Kasa ya da 102 — Bankalar'ı kullanırsın. Mantık değişmez; değişen sadece borcun kime ait olduğu."},
    {"type":"heading","props":{"level":2},"content":"Dengeli bir cümle"},
    {"type":"paragraph","content":"Yevmiye kaydı bir cümleye benzer: solda alan, sağda veren. Mal alışında işletme mal ve KDV alır (sol taraf borçlanır), karşılığında borç ya da nakit verir (sağ taraf alacaklanır). Solun toplamı sağın toplamına eşit olmadığında cümle gramerini bozmuştur — fişi tekrar oku."}
  ]$json$::jsonb,
  icerik_guncellendi = now()
where id = 'mal-alis';

-- 3) Alıştan İade --------------------------------------------------------
update unite_konulari set
  icerik = $json$[
    {"type":"heading","props":{"level":2},"content":"Geri dönen mal"},
    {"type":"paragraph","content":"Toptancıdan gelen 30 koli unun ikisinin küflü çıktığını fark ediyorsun. Telefonu açıp arıyorsun: \"Bunları geri göndereceğim.\" Toptancı kabul ediyor, fatura iadesi düzenleniyor."},
    {"type":"paragraph","content":"Geçen hafta yapılan kaydı hatırla — 153 borçlandı, 191 borçlandı, 320 alacaklandı. Şimdi bunların ikisi geri dönüyor: malın bir kısmı işletmeden çıkıyor, KDV'si geri çekiliyor, toptancıya olan borç da o kadar azalıyor."},
    {"type":"heading","props":{"level":2},"content":"Ters yön mantığı"},
    {"type":"paragraph","content":"İadede yön ters çevrilir; hesaplar aynıdır. Geçen haftaki cümlenin aynısını okuyup sağdan sola yazıyorsun:"},
    {"type":"bulletListItem","content":"320 — Satıcılar (borç): borcun azaldı."},
    {"type":"bulletListItem","content":"153 — Ticari Mallar (alacak): stoğun azaldı."},
    {"type":"bulletListItem","content":"191 — İndirilecek KDV (alacak): devletten alacağın da azaldı."},
    {"type":"paragraph","content":"İade tutarı, geri dönen malın faturadaki KDV hariç değeridir. KDV ayrıca hesaplanır."},
    {"type":"heading","props":{"level":2},"content":"610 hesabı bunda kullanılmaz"},
    {"type":"paragraph","content":"Bir kafa karışıklığı: 610 — Satıştan İadeler. Adı benzer ama o, müşterinin sana iade ettiği malların hesabıdır. Sen toptancıya iade ediyorsan satıcı için bu bir 'satıştan iade', senin için bir 'alıştan iade' — ve sen 153'ü direkt azaltıyorsun. Ayrı bir 610 muhasebesi yok. Yön doğru kurulduğunda hesap doğru kapanır."}
  ]$json$::jsonb,
  icerik_guncellendi = now()
where id = 'alistan-iade';

-- 4) Mal Satış -----------------------------------------------------------
update unite_konulari set
  icerik = $json$[
    {"type":"heading","props":{"level":2},"content":"Tezgâh önündeki cümle"},
    {"type":"paragraph","content":"Sabah müşteri geliyor, raftan 10 koli un alıyor, kasaya geçiyor. Fatura kesiyorsun: 1.000 TL mal + 200 TL KDV = 1.200 TL. Müşteri parayı peşin ödüyor."},
    {"type":"paragraph","content":"Bu hareket de, alış gibi, üç ayrı olaydır:"},
    {"type":"numberedListItem","content":"Kasaya para girdi."},
    {"type":"numberedListItem","content":"İşletmenin geliri arttı."},
    {"type":"numberedListItem","content":"Devlete ödeyeceğin KDV doğdu."},
    {"type":"heading","props":{"level":2},"content":"Üç hesap, sağa-sola dağılım"},
    {"type":"bulletListItem","content":"100 — Kasa (borç): nakit girdi."},
    {"type":"bulletListItem","content":"600 — Yurt İçi Satışlar (alacak): gelir doğdu."},
    {"type":"bulletListItem","content":"391 — Hesaplanan KDV (alacak): devlete borç doğdu."},
    {"type":"paragraph","content":"Müşteri peşin ödemeseydi 100 yerine 120 — Alıcılar borçlanırdı; tahsilat olunca 100 borç / 120 alacak ile kapanır."},
    {"type":"heading","props":{"level":2},"content":"191 ile 391 farkı"},
    {"type":"paragraph","content":"İndirilecek KDV (191) ve Hesaplanan KDV (391) iki farklı yönü taşır:"},
    {"type":"bulletListItem","content":"191: alırken devletten alacağın olan KDV."},
    {"type":"bulletListItem","content":"391: satarken devlete borçlandığın KDV."},
    {"type":"paragraph","content":"Ay sonunda iki hesap karşılaştırılır. 391 daha büyükse aradaki fark devlete ödenir; 191 daha büyükse devir KDV olarak ileri taşınır. Mal satışı yaparken senin görevin yalnızca satışın anındaki kaydı doğru çıkarmaktır — mahsuplaşma sonra gelir."}
  ]$json$::jsonb,
  icerik_guncellendi = now()
where id = 'mal-satis';

-- 5) Satıştan İade -------------------------------------------------------
update unite_konulari set
  icerik = $json$[
    {"type":"heading","props":{"level":2},"content":"Müşteri geri geliyor"},
    {"type":"paragraph","content":"Üç gün sonra müşteri geri geliyor, \"Bu un çürük çıktı, kabul etmiyorum\" diyor. Faturayı iade ediyor, parayı geri istiyor."},
    {"type":"paragraph","content":"Mantık alıştan iadede gördüğümüzle simetriktir, ama bir farkla: burada iadeyi 600 — Yurt İçi Satışlar'dan çıkarmıyoruz. Çünkü Tek Düzen Hesap Planı'nda satışları düzelten ayrı bir hesap var: 610 — Satıştan İadeler."},
    {"type":"heading","props":{"level":2},"content":"Niye ayrı bir hesap?"},
    {"type":"paragraph","content":"Yıl sonu gelir tablosunda yöneticinin görmesi gerekenler net olsun diye. Eğer iadeleri 600'den düşseydik, brüt satışın ne olduğu, müşterinin neyi geri verdiği gözükmezdi. 610, brüt satışı bozmadan iadeyi ayrıca anlatır. Yıl sonunda 600'den otomatik düşülür."},
    {"type":"heading","props":{"level":2},"content":"Kaydın yapısı"},
    {"type":"bulletListItem","content":"610 — Satıştan İadeler (borç): satıştan iade doğdu."},
    {"type":"bulletListItem","content":"391 — Hesaplanan KDV (borç): devlete borçlandığın KDV geri çekildi."},
    {"type":"bulletListItem","content":"100 — Kasa ya da 120 — Alıcılar (alacak): müşteriye iade edilen tutar."},
    {"type":"paragraph","content":"Mal müşteriden geri döndüyse aynı zamanda 153 borç / 621 alacak yapılır — bu sürekli envanter çalışan işletmelerin işidir. Aralıklı envanterde maliyet zaten yıl sonu ayarlanır, ek bir şey gerekmez."}
  ]$json$::jsonb,
  icerik_guncellendi = now()
where id = 'satistan-iade';

-- 6) Satılan Mal Maliyeti -----------------------------------------------
update unite_konulari set
  icerik = $json$[
    {"type":"heading","props":{"level":2},"content":"Yıl sonu sayımı"},
    {"type":"paragraph","content":"Yıl boyu raflara kutular geldi, raflardan kutular çıktı. Ama 153 hesabı, sürekli envanter kullanmıyorsan, yıl boyunca neredeyse hiç hareket etmedi — sadece alımları yazdın, çıkışları takip etmedin. Yıl sonu geldiğinde sayman gereken bir şey kalır: stokta gerçekten ne var?"},
    {"type":"paragraph","content":"İşte sahaya çıkıp fiziki sayım yaptığın gün budur. Sayıyorsun, kalan malın değerini hesaplıyorsun, geri kalanı satılmıştır diyorsun."},
    {"type":"heading","props":{"level":2},"content":"Aktarım kaydı"},
    {"type":"paragraph","content":"Diyelim yıl başında 8.000 TL stoğun vardı, yıl içinde 50.000 TL alış yaptın, yıl sonu sayımda 12.000 TL kaldı. O zaman satılan mal:"},
    {"type":"paragraph","content":"8.000 + 50.000 − 12.000 = 46.000 TL"},
    {"type":"paragraph","content":"Bu tutarı 153'ten 621'e aktarırsın:"},
    {"type":"bulletListItem","content":"621 — Satılan Ticari Mal Maliyeti (borç): 46.000"},
    {"type":"bulletListItem","content":"153 — Ticari Mallar (alacak): 46.000"},
    {"type":"heading","props":{"level":2},"content":"Sürekli envanterde fark"},
    {"type":"paragraph","content":"Eğer sürekli envanter kullanıyorsan bu kaydı her satışta yapmışsındır — yıl sonunda ayrıca bir aktarıma gerek yoktur. Sayım sadece kontrol amaçlıdır: gerçek ile defter eşleşiyor mu?"},
    {"type":"paragraph","content":"621, dönem sonunda 690 — Dönem Kâr/Zararı'na devredilir. Bu, gelir tablosunun kapanmasını sağlayan adımdır. Ama o ünite başka bir hikâyenin konusu."}
  ]$json$::jsonb,
  icerik_guncellendi = now()
where id = 'satilan-mal-maliyeti';
