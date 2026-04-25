-- =====================================================================
-- Ek soru seed (Sprint 4): content/sorular/*.json'dan üretildi
-- Üretici: scripts/seed-yeni-sorular.mjs
-- Üretim tarihi: 2026-04-25T20:00:54.274Z
-- Kapsam: 132 ek soru, "<unite>-ek-N" ID'li
-- =====================================================================

begin;

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-1', 'amortisman', $ml$Demirbaş Alımı (Peşin)$ml$, 'kolay', $ml$İşletme, ofis için 30.000 TL + %20 KDV tutarında bilgisayar ve yazıcı seti satın almıştır. Bedel banka havalesi ile tedarikçiye ödenmiştir.$ml$, $ml$255 Demirbaşlar borç + KDV borç ↔ banka alacak.$ml$, $ml$Sabit kıymet ediniminde 255 Demirbaşlar 30.000 TL borç, 191 İndirilecek KDV 6.000 TL borç yazılır. Toplam ödeme banka mevduatından çıktığı için 102 Bankalar 36.000 TL alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-1', 1, '255', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-1', 2, '191', 6000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-1', 3, '102', 0, 36000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-2', 'amortisman', $ml$Taşıt Alımı (Vadeli)$ml$, 'kolay', $ml$İşletme, dağıtım hizmetlerinde kullanmak üzere 600.000 TL + %20 KDV tutarında ticari araç almış, ödemeyi 12 ay vadeli senet düzenleyerek yapmıştır.$ml$, $ml$254 Taşıtlar borç + KDV borç ↔ borç senetleri alacak.$ml$, $ml$254 Taşıtlar hesabı 600.000 TL borçlanır, 191 İndirilecek KDV 120.000 TL borçlanır. Vadeli ödeme için düzenlenen senet 321 Borç Senetleri'nde 720.000 TL alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-2', 1, '254', 600000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-2', 2, '191', 120000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-2', 3, '321', 0, 720000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-3', 'amortisman', $ml$Bina Alımı (Banka)$ml$, 'kolay', $ml$İşletme, faaliyetlerinde kullanmak üzere depo binasını 1.500.000 TL bedelle satın almış, bedelin tamamını banka havalesiyle ödemiştir. (Bina KDV'den istisna kabul edildiği için KDV ihmal edilmiştir.)$ml$, $ml$Bina alımı bilanço içinde aktif değer değişimidir.$ml$, $ml$Sabit kıymet edinildiği için 252 Binalar 1.500.000 TL borçlanır. Banka mevduatı azaldığı için 102 Bankalar 1.500.000 TL alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-3', 1, '252', 1500000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-3', 2, '102', 0, 1500000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-4', 'amortisman', $ml$Yıl Sonu Demirbaş Amortismanı (Normal Yöntem)$ml$, 'kolay', $ml$Aralık ayı sonunda 30.000 TL maliyetli ofis demirbaşları için %20 normal amortisman ayrılacaktır. Demirbaşlar genel yönetim hizmetinde kullanılmaktadır.$ml$, $ml$Genel yönetimde kullanılan demirbaş amortismanı 770 hesabında izlenir.$ml$, $ml$Yıllık amortisman: 30.000 × %20 = 6.000 TL. 770 Genel Yönetim Giderleri 6.000 TL borç. Birikmiş amortismanlar düzenleyici aktif hesabında 257 Birikmiş Amortismanlar 6.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-4', 1, '770', 6000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-4', 2, '257', 0, 6000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-5', 'amortisman', $ml$Pazarlama Aracının Amortismanı (Normal)$ml$, 'orta', $ml$Pazarlama bölümünde kullanılan ve 600.000 TL maliyetli olan ticari aracın yıllık %20 normal amortismanı ayrılacaktır. Faaliyet niteliği aracın hangi gider hesabına kaydedileceğini belirler.$ml$, $ml$Pazarlamada kullanılan varlığın amortismanı 760 hesabında izlenir.$ml$, $ml$Yıllık amortisman 600.000 × %20 = 120.000 TL. Aracın kullanıldığı bölüme göre 760 Pazarlama Satış ve Dağıtım Giderleri 120.000 TL borç. 257 Birikmiş Amortismanlar 120.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-5', 1, '760', 120000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-5', 2, '257', 0, 120000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-6', 'amortisman', $ml$Azalan Bakiye Amortismanı (1. Yıl)$ml$, 'orta', $ml$İşletme, 100.000 TL maliyetli üretim makinesi için azalan bakiyeler yöntemini seçmiştir. Normal amortisman oranı %20, azalan bakiyeler oranı %40'tır. Birinci yıl sonunda ayrılacak amortisman tutarı hesaplanmıştır. Üretim hizmetinde kullanıldığı için gider 730 değil, basitlik için 770 hesabına yazılacaktır.$ml$, $ml$Azalan bakiyeler 1. yıl: maliyet × azalan oran.$ml$, $ml$1. yıl amortisman: 100.000 × %40 = 40.000 TL. 770 Genel Yönetim Giderleri 40.000 TL borç. 257 Birikmiş Amortismanlar 40.000 TL alacak. 2. yıl amortismanı kalan net defter değeri (60.000) üzerinden %40 ile hesaplanacaktır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-6', 1, '770', 40000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-6', 2, '257', 0, 40000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-7', 'amortisman', $ml$Kıst Amortisman (Yıl İçi Alım)$ml$, 'orta', $ml$İşletme 1 Temmuz tarihinde 80.000 TL maliyetli demirbaş satın almış, yıl sonunda kıst amortisman uygulayacaktır. Amortisman oranı %20, kıst süre 6 aydır. Demirbaş genel yönetim hizmetinde kullanılmaktadır.$ml$, $ml$Kıst amortisman: maliyet × oran × (kullanım ay sayısı / 12).$ml$, $ml$Kıst amortisman: 80.000 × %20 × (6 / 12) = 8.000 TL. 770 Genel Yönetim Giderleri 8.000 TL borç. 257 Birikmiş Amortismanlar 8.000 TL alacak. Kalan kıst pay sonraki yılın amortismanına eklenmez; ertesi yıl tam yıl amortisman uygulanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-7', 1, '770', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-7', 2, '257', 0, 8000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-8', 'amortisman', $ml$Demirbaş Satışı (Karla)$ml$, 'orta', $ml$Maliyet bedeli 40.000 TL, birikmiş amortismanı 25.000 TL olan demirbaş 20.000 TL + %20 KDV ile peşin (banka havalesi) satılmıştır. Net defter değeri ile satış bedeli arasındaki fark karı oluşturmaktadır.$ml$, $ml$Net defter değeri 15.000; satış 20.000 → 5.000 kar 679 alacak.$ml$, $ml$102 Bankalar 24.000 TL borç. 257 Birikmiş Amortismanlar 25.000 TL borç (kapanış). 255 Demirbaşlar 40.000 TL alacak. 391 Hesaplanan KDV 4.000 TL alacak. Net defter 15.000, satış 20.000 → 5.000 TL kar 679 Diğer Olağandışı Gelir ve Karlar alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-8', 1, '102', 24000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-8', 2, '257', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-8', 3, '255', 0, 40000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-8', 4, '391', 0, 4000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-8', 5, '679', 0, 5000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-9', 'amortisman', $ml$Demirbaş Satışı (Zararla)$ml$, 'orta', $ml$Maliyet bedeli 50.000 TL, birikmiş amortismanı 20.000 TL olan demirbaş 22.000 TL + %20 KDV ile satılmış, ödeme banka havalesi ile alınmıştır. Net defter değeri 30.000 TL olduğundan zarar oluşmuştur.$ml$, $ml$Net defter > satış → zarar 689 borç.$ml$, $ml$102 Bankalar 26.400 TL borç. 257 Birikmiş Amortismanlar 20.000 TL borç. 689 Diğer Olağandışı Gider ve Zararlar 8.000 TL borç (zarar). 255 Demirbaşlar 50.000 TL alacak. 391 Hesaplanan KDV 4.400 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-9', 1, '102', 26400, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-9', 2, '257', 20000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-9', 3, '689', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-9', 4, '255', 0, 50000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-9', 5, '391', 0, 4400);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-10', 'amortisman', $ml$Yapılmakta Olan Yatırımın Tamamlanması$ml$, 'orta', $ml$İşletmenin inşa ettirdiği depo binası tamamlanmıştır. 258 Yapılmakta Olan Yatırımlar hesabında biriken 800.000 TL'lik tutar, sabit kıymet olarak 252 Binalar hesabına aktarılarak amortismana hazır hale getirilmiştir.$ml$, $ml$258 hesabı kapanır; 252 hesabı borçlanır.$ml$, $ml$Tamamlanan yatırım sabit kıymete dönüştürüldüğü için 252 Binalar 800.000 TL borç. Yatırım takip hesabı kapanır: 258 Yapılmakta Olan Yatırımlar 800.000 TL alacak. Bina artık amortismana tabi tutulabilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-10', 1, '252', 800000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-10', 2, '258', 0, 800000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-11', 'amortisman', $ml$Tamamen İtfa Olmuş Demirbaşın Hurdaya Ayrılması$ml$, 'zor', $ml$Maliyet bedeli 25.000 TL ve birikmiş amortismanı 25.000 TL olan eski yazıcı, kullanım ömrü dolduğu için hurdaya ayrılmıştır. Hurda satışı bu örnekte yapılmamış; sadece muhasebe kayıtlarından çıkarılmıştır.$ml$, $ml$Net defter değeri 0; karşılıklı kapanış kaydı yapılır.$ml$, $ml$Demirbaş kayıtlardan tamamen silinir. 257 Birikmiş Amortismanlar 25.000 TL borç (kapanış). 255 Demirbaşlar 25.000 TL alacak. Net defter değeri sıfır olduğu için kar/zarar oluşmaz.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-11', 1, '257', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-11', 2, '255', 0, 25000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('amortisman-ek-12', 'amortisman', $ml$Aktife Yapılan Modernizasyon$ml$, 'zor', $ml$İşletme, 600.000 TL maliyetli ticari aracın motorunu yenilemek için 80.000 TL + %20 KDV harcama yapmış, banka havalesiyle ödemiştir. Bu modernizasyon aracın faydalı ömrünü uzattığından maliyete eklenecektir.$ml$, $ml$Faydalı ömrü uzatan harcama varlığa eklenir; gider yazılmaz.$ml$, $ml$Modernizasyon faydalı ömrü uzattığı için 254 Taşıtlar 80.000 TL borç (varlık değeri artar). 191 İndirilecek KDV 16.000 TL borç. 102 Bankalar 96.000 TL alacak. Sonraki dönem amortismanı yeni maliyet bedeli (680.000 TL) üzerinden hesaplanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'amortisman-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-12', 1, '254', 80000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-12', 2, '191', 16000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('amortisman-ek-12', 3, '102', 0, 96000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-1', 'banka', $ml$Müşteriden Gelen EFT$ml$, 'kolay', $ml$İşletmenin Garanti BBVA hesabına, alıcılar hesabında 25.000 TL borcu olan müşteriden EFT yoluyla 25.000 TL gelmiştir. Banka dekontu kayıt için işletmeye ulaşmıştır.$ml$, $ml$Banka hesabı borç; alıcılar hesabı kapatılır.$ml$, $ml$Banka mevduatı arttığı için 102 Bankalar 25.000 TL borçlanır. Müşteri borcu kapatıldığı için 120 Alıcılar 25.000 TL alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-1', 1, '102', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-1', 2, '120', 0, 25000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-2', 'banka', $ml$Tedarikçiye Banka Havalesi$ml$, 'kolay', $ml$İşletme, satıcılar hesabında görünen 18.500 TL borcunu kapatmak üzere İş Bankası şubesinden tedarikçi hesabına havale göndermiş ve dekont almıştır.$ml$, $ml$Satıcılar borç; banka alacak.$ml$, $ml$Satıcı borcu kapatıldığı için 320 Satıcılar hesabı 18.500 TL borçlandırılır. Banka mevduatı azaldığı için 102 Bankalar hesabı 18.500 TL alacaklandırılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-2', 1, '320', 18500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-2', 2, '102', 0, 18500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-3', 'banka', $ml$Kasa Bakiyesinin Bankaya Yatırılması$ml$, 'kolay', $ml$İşletme, kasa bakiyesi yüksek kaldığı için Yapı Kredi şubesine 40.000 TL nakit yatırmıştır. Yatırılan tutar için banka makbuzu alınmıştır.$ml$, $ml$Hazır değerler arası transfer; banka borç, kasa alacak.$ml$, $ml$Banka mevduatı arttığı için 102 Bankalar 40.000 TL borçlanır. Kasadan çıkış olduğu için 100 Kasa 40.000 TL alacaklanır. Bu işlem hazır değerler içinde transfer niteliğindedir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-3', 1, '102', 40000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-3', 2, '100', 0, 40000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-4', 'banka', $ml$Banka Hesap İşletim Ücreti$ml$, 'kolay', $ml$Banka, üç aylık hesap işletim ücreti olarak işletmenin Akbank vadesiz hesabından 360 TL kesinti yapmış ve dekont göndermiştir. (KDV ihmal edilmiştir.)$ml$, $ml$Banka masrafı genel yönetim gideri ya da komisyon gideridir.$ml$, $ml$Banka masrafı 770 Genel Yönetim Giderleri olarak borçlanır (360). Banka mevduatı azaldığı için 102 Bankalar hesabı 360 TL alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-4', 1, '770', 360, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-4', 2, '102', 0, 360);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-5', 'banka', $ml$Kısa Vadeli Banka Kredisi Kullanımı$ml$, 'orta', $ml$İşletme, sezonluk işletme sermayesi ihtiyacı için Halkbank'tan 9 ay vadeli 200.000 TL tutarında kısa vadeli ticari kredi kullanmış; tahsis edilen tutar vadesiz hesaba aktarılmıştır. Kredi kullanım masrafı olarak ayrıca 1.000 TL hesaptan tahsil edilmiştir.$ml$, $ml$Banka borç, kredi alacak; ek olarak komisyon gideri ayrı kayıtla.$ml$, $ml$Vadesiz hesaba 200.000 TL girdiği için 102 Bankalar borçlanır; karşılığında 300 Banka Kredileri 200.000 TL alacaklanır. Kullanım masrafı (komisyon) 653 Komisyon Giderleri 1.000 TL borç, 102 Bankalar 1.000 TL alacak yazılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-5', 1, '102', 200000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-5', 2, '300', 0, 200000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-5', 3, '653', 1000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-5', 4, '102', 0, 1000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-6', 'banka', $ml$Mevduat Faiz Geliri Tahakkuku$ml$, 'orta', $ml$Vadeli hesabın aylık faiz tahakkuku banka tarafından hesaba yansıtılmıştır. Brüt faiz 4.500 TL, gelir vergisi stopajı 675 TL'dir; net 3.825 TL hesaba geçmiştir.$ml$, $ml$Brüt faiz gelir; stopaj peşin ödenen vergi olarak izlenir.$ml$, $ml$Banka hesabı net tutar (3.825) ile borçlanır; ayrıca stopaj 193 Peşin Ödenen Vergiler ve Fonlar hesabında 675 TL borç olarak izlenir. Brüt faiz 642 Faiz Gelirleri'ne 4.500 TL alacak yazılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-6', 1, '102', 3825, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-6', 2, '193', 675, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-6', 3, '642', 0, 4500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-7', 'banka', $ml$Kredi Taksit Ödemesi (Anapara + Faiz)$ml$, 'orta', $ml$İşletme, kullandığı 9 aylık ticari kredinin Mart taksitini ödemiştir. Taksit toplamı 25.500 TL olup; bunun 22.000 TL'si anapara, 3.500 TL'si vade içi faizdir. Ödeme banka hesabından otomatik kesilmiştir.$ml$, $ml$Anapara borç hesabından düşer; faiz gider yazılır.$ml$, $ml$Banka kredisi anaparası 300 Banka Kredileri'nde 22.000 TL borç olarak düşülür. Faiz gideri 780 Finansman Giderleri'nde değil 6 grubunda izlenmesi gerektiğinden 660 Kısa Vadeli Borçlanma Giderleri 3.500 TL borç yazılır. 102 Bankalar toplam 25.500 TL alacaklandırılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-7', 1, '300', 22000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-7', 2, '660', 3500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-7', 3, '102', 0, 25500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-8', 'banka', $ml$POS Tahsilatının Hesaba Geçişi$ml$, 'orta', $ml$Önceki gün toplam 12.000 TL tutarında kredi kartı satışı yapılmış ve 108 Diğer Hazır Değerler hesabında izlenmiştir. Bugün banka, %1,5 (180 TL) komisyon kestikten sonra net 11.820 TL'yi vadesiz hesaba yansıtmıştır.$ml$, $ml$108'in kapanışı; banka net tutarla, komisyon gider olarak.$ml$, $ml$Banka hesabına net tutar (11.820) 102 Bankalar borç. Banka komisyonu 653 Komisyon Giderleri'nde 180 TL borç. Önceden bekleyen 108 Diğer Hazır Değerler 12.000 TL alacak yazılarak kapatılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-8', 1, '102', 11820, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-8', 2, '653', 180, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-8', 3, '108', 0, 12000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-9', 'banka', $ml$Banka Üzerinden Kira Ödemesi$ml$, 'orta', $ml$İşletme, kullandığı işyeri için aylık brüt 20.000 TL kira ödemiştir. Stopaj %20 (4.000 TL) kesilerek net 16.000 TL banka havalesi ile mülk sahibine ödenmiştir; stopaj ödenecek vergi olarak izlenecektir.$ml$, $ml$Brüt kira gider; stopaj 360 hesabına alacak.$ml$, $ml$Brüt kira gideri 770 Genel Yönetim Giderleri 20.000 TL borçlanır. Stopaj 360 Ödenecek Vergi ve Fonlar 4.000 TL alacak. Net kira 102 Bankalar 16.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-9', 1, '770', 20000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-9', 2, '360', 0, 4000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-9', 3, '102', 0, 16000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-10', 'banka', $ml$Şubeler Arası Hesap Aktarımı$ml$, 'orta', $ml$İşletme, Akbank Levent şubesindeki vadesiz hesabından 75.000 TL'yi Akbank Bakırköy şubesindeki vadesiz hesabına virman ettirmiştir. Banka işlem ücreti almamıştır.$ml$, $ml$Aynı hesap grubu içinde alt hesap değişimi; toplam banka tutarı değişmez ama yardımcı hesap düzeyinde kayıt yapılır.$ml$, $ml$İşletme yardımcı hesap düzeyinde takip yaptığında 102 Bankalar (Bakırköy) 75.000 TL borçlandırılır; 102 Bankalar (Levent) 75.000 TL alacaklandırılır. Yevmiye toplamı korunur, ana hesap toplam bakiyesi değişmez.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-10', 1, '102', 75000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-10', 2, '102', 0, 75000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-11', 'banka', $ml$Vadesi Gelen Krediyi Yenileme + Faiz$ml$, 'zor', $ml$İşletmenin 100.000 TL'lik mevcut kısa vadeli kredi vadesi dolmuştur. Banka, biriken faiz 8.000 TL'yi tahsil ettikten sonra anaparayı 12 ay daha aynı koşulda uzatmıştır. Faiz işletmenin vadesiz hesabından, anaparada herhangi bir hareket olmadan kesilmiştir.$ml$, $ml$Anapara hareketsiz kalır; sadece faiz finansman gideri olarak yazılır.$ml$, $ml$Anapara aynı 300 Banka Kredileri'nde kalır; sadece vade uzar. Faiz gideri 660 Kısa Vadeli Borçlanma Giderleri 8.000 TL borç. Banka hesabından çıkış olduğu için 102 Bankalar 8.000 TL alacak yazılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-11', 1, '660', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-11', 2, '102', 0, 8000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('banka-ek-12', 'banka', $ml$Karşılıksız Geçen EFT (Banka Bilgilendirmesi)$ml$, 'zor', $ml$Müşteriden gelen 30.000 TL'lik EFT, iki gün önce kayda alınmıştı. Bugün banka göndericinin hesabında yetersiz bakiye olduğu için işlemi iptal etmiş ve tutarı işletme hesabından geri çekmiştir. Müşteri borcu yeniden geçerli kalmıştır. Kayıt iki günlük yevmiyeyi düzeltmek değil, ters kayıtla ve müşteri borcunu canlandırarak yapılır.$ml$, $ml$Banka azalır; müşteri borcu yeniden doğar.$ml$, $ml$İptal nedeniyle banka mevduatı azaldığı için 102 Bankalar 30.000 TL alacak. Müşteri borcu yeniden ortaya çıktığı için 120 Alıcılar 30.000 TL borç. Bu kayıt, ilk kabul kaydının geri çevirisi niteliğindedir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'banka-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-12', 1, '120', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('banka-ek-12', 2, '102', 0, 30000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-1', 'donem-sonu', $ml$Peşin Ödenen Yıllık Sigorta$ml$, 'kolay', $ml$1 Eylül tarihinde işletme, 12 aylık iş yeri sigorta poliçesi için 24.000 TL'yi banka havalesi ile peşin ödemiş ve 180 Gelecek Aylara Ait Giderler hesabında izlemeye almıştır.$ml$, $ml$Peşin gider geçici aktif hesabıdır.$ml$, $ml$Henüz dönemine ait olmayan sigorta gideri 180 Gelecek Aylara Ait Giderler 24.000 TL borç. Banka mevduatından çıkış olduğu için 102 Bankalar 24.000 TL alacak. Aylar geçtikçe gider hesabına aktarılacaktır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-1', 1, '180', 24000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-1', 2, '102', 0, 24000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-2', 'donem-sonu', $ml$Yıl Sonu Sigorta Gideri Aktarımı (Kıst)$ml$, 'kolay', $ml$1 Eylül'de 180 Gelecek Aylara Ait Giderler hesabına 24.000 TL olarak alınmış sigorta gideri için 31 Aralık dönem sonunda 4 ay (Eylül-Ekim-Kasım-Aralık) bu döneme ait sayılarak gidere alınacaktır.$ml$, $ml$180'den gider hesabına yıl içi pay aktarılır.$ml$, $ml$Aylık sigorta payı: 24.000 / 12 = 2.000 TL. 4 ay = 8.000 TL döneme ait. 770 Genel Yönetim Giderleri 8.000 TL borç. 180 Gelecek Aylara Ait Giderler 8.000 TL alacak. Kalan 16.000 TL ertesi yıl 280 hesabında değerlendirilebilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-2', 1, '770', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-2', 2, '180', 0, 8000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-3', 'donem-sonu', $ml$Peşin Tahsil Edilen Kira Geliri (Hasılat Erteleme)$ml$, 'kolay', $ml$1 Aralık tarihinde işletme, sahip olduğu dükkân için kiracıdan 6 aylık kira bedeli 60.000 TL'yi banka havalesi ile peşin tahsil etmiştir. Sadece Aralık ayı bu döneme aittir; geri kalan 5 ay sonraki döneme ait olduğundan henüz hasılat değildir.$ml$, $ml$Peşin tahsil edilen gelir geçici pasif hesabıdır.$ml$, $ml$Banka mevduatına 60.000 TL girdiği için 102 Bankalar borç. Henüz dönemine ait olmayan tutar 380 Gelecek Aylara Ait Gelirler 60.000 TL alacak. Dönem sonu mahsubunda Aralık payı 380'den ilgili gelir hesabına aktarılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-3', 1, '102', 60000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-3', 2, '380', 0, 60000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-4', 'donem-sonu', $ml$Peşin Tahsil Edilen Kiranın Aralık Payı$ml$, 'kolay', $ml$380 Gelecek Aylara Ait Gelirler hesabında 60.000 TL bulunmaktadır (6 aylık peşin kira). Dönem sonu (31 Aralık) itibariyle 1 aylık kira (10.000 TL) bu yıla ait olduğu için gelir hesabına aktarılacaktır.$ml$, $ml$Geçici pasif → gelir hesabına devir.$ml$, $ml$380 Gelecek Aylara Ait Gelirler 10.000 TL borç (azaltma). 649 Diğer Olağan Gelir ve Karlar 10.000 TL alacak (gelir tahakkuku). Kalan 50.000 TL gelecek dönemlere aktarılır (uzun vadeli ise 480'e taşınır).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-4', 1, '380', 10000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-4', 2, '649', 0, 10000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-5', 'donem-sonu', $ml$Tahakkuk Eden Faiz Geliri (Henüz Tahsil Edilmemiş)$ml$, 'orta', $ml$İşletmenin vadeli mevduatından döneme ait olarak kazanılmış ancak banka tarafından henüz hesaba yansıtılmamış 3.500 TL faiz geliri bulunmaktadır. Faiz Ocak ayında ödenecek olsa da Aralık'ta hak edildiği için bu döneme alınacaktır.$ml$, $ml$Hak edilen ama henüz alınmamış gelir 181 hesabında izlenir.$ml$, $ml$Hak edilen ancak tahsil edilmeyen faiz 181 Gelir Tahakkukları 3.500 TL borç. Dönemine ait gelir 642 Faiz Gelirleri 3.500 TL alacak. Bankaya geçtiğinde 102 Bankalar borç, 181 alacak ile mahsup edilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-5', 1, '181', 3500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-5', 2, '642', 0, 3500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-6', 'donem-sonu', $ml$Tahakkuk Eden Gider (Henüz Ödenmemiş Elektrik)$ml$, 'orta', $ml$Aralık ayına ait 4.200 TL elektrik faturası 31 Aralık'ta gelmiş ancak vadesi 15 Ocak olduğu için henüz ödenmemiştir. Gider bu döneme aittir; sonraki ay ödenecektir.$ml$, $ml$Tahakkuk eden gider; gelecek dönem ödenecek olsa bile bu yıla yazılır.$ml$, $ml$Gider dönemine ait olduğu için 770 Genel Yönetim Giderleri 4.200 TL borç. Henüz ödenmediği için yükümlülük olarak 381 Gider Tahakkukları 4.200 TL alacak. Ocak'ta ödendiğinde 381 borç, 102 alacak ile kapatılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-6', 1, '770', 4200, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-6', 2, '381', 0, 4200);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-7', 'donem-sonu', $ml$Sayım Sonucu Mal Noksanı$ml$, 'orta', $ml$Yıl sonu fiziksel sayımda 153 Ticari Mallar kayıtlı bakiyesi 200.000 TL iken fiili stok 197.500 TL bulunmuştur. Aradaki 2.500 TL'lik fark sebebi henüz tespit edilmediği için geçici hesapta izlenecektir.$ml$, $ml$Sayım eksiği geçici aktif hesapta izlenir.$ml$, $ml$Mal kaydı fiili duruma getirilirken 153 Ticari Mallar 2.500 TL alacak. Geçici aktif olarak 197 Sayım ve Tesellüm Noksanları 2.500 TL borç. Sebep tespit edilince ilgili hesaba aktarılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-7', 1, '197', 2500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-7', 2, '153', 0, 2500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-8', 'donem-sonu', $ml$Mal Noksanının Olağandışı Gider Yazılması$ml$, 'orta', $ml$197 Sayım ve Tesellüm Noksanları'nda izlenen 2.500 TL'lik mal noksanlığının sebebi araştırılmış ve tespit edilememiştir. Dönem sonunda olağandışı gider olarak kapatılacaktır.$ml$, $ml$Geçici hesap kapanır; gider hesabına yazılır.$ml$, $ml$Sebep belirlenemeyen noksan zarar olarak yazılır: 689 Diğer Olağandışı Gider ve Zararlar 2.500 TL borç. Geçici hesap kapanır: 197 Sayım ve Tesellüm Noksanları 2.500 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-8', 1, '689', 2500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-8', 2, '197', 0, 2500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-9', 'donem-sonu', $ml$Stok Maliyetlemesi (Aralıklı Envanter)$ml$, 'orta', $ml$İşletme aralıklı envanter yöntemini kullanmaktadır. Dönem başı stok 50.000 TL, dönem içi alış 200.000 TL, dönem sonu fiili stok 60.000 TL'dir. Bu durumda satılan ticari malların maliyeti hesaplanıp 621 hesabına aktarılacaktır.$ml$, $ml$STMM = DBM + Alış − DSM = 50.000 + 200.000 − 60.000 = 190.000 TL.$ml$, $ml$Dönem sonu maliyetlendirme: 621 Satılan Ticari Mallar Maliyeti 190.000 TL borç. 153 Ticari Mallar 190.000 TL alacak (kayıttan stok azaltımı). Kalan 60.000 TL bilanço stok bakiyesini oluşturur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-9', 1, '621', 190000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-9', 2, '153', 0, 190000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-10', 'donem-sonu', $ml$Yıl İçi Avans Ödemesinin Dönem Sonu Düzeltmesi$ml$, 'zor', $ml$1 Ekim'de işletme bir tedarikçi sözleşmesi gereği 18 ay süreli yazılım kullanım hakkı için 36.000 TL banka havalesi ile peşin ödeme yapmış ve 280 Gelecek Yıllara Ait Giderler'de izlemiştir. 31 Aralık dönem sonunda Ekim-Kasım-Aralık (3 ay) bu yıla aittir, kalan 15 ay gelecek yıllara aittir; bu yıl payı gider hesabına aktarılacaktır.$ml$, $ml$Aylık pay × döneme ait ay; uzun vadelilerden 280 azaltılır.$ml$, $ml$Aylık pay: 36.000 / 18 = 2.000 TL. Döneme ait 3 ay = 6.000 TL. 770 Genel Yönetim Giderleri 6.000 TL borç. 280 Gelecek Yıllara Ait Giderler 6.000 TL alacak. Yıl atlanırken 280'den 180'e kalan kısa vadeli kısım da aktarılabilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-10', 1, '770', 6000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-10', 2, '280', 0, 6000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-11', 'donem-sonu', $ml$Faiz Gider Tahakkuku (Kullanılan Krediden)$ml$, 'zor', $ml$İşletmenin 200.000 TL kullandığı kredinin Aralık ayına ait fakat ödemesi Ocak'ta yapılacak 4.000 TL faiz tutarı bu döneme yazılacaktır. Faiz banka tarafından henüz tahsil edilmemiştir.$ml$, $ml$Hak edilmiş ancak ödenmemiş gider; finansman gideri + 381.$ml$, $ml$Tahakkuk eden faiz gideri 660 Kısa Vadeli Borçlanma Giderleri 4.000 TL borç. Ödeme yapılmadığı için yükümlülük 381 Gider Tahakkukları 4.000 TL alacak. Faiz Ocak'ta hesaptan kesildiğinde 381 borç, 102 alacak ile mahsuplaşır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-11', 1, '660', 4000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-11', 2, '381', 0, 4000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('donem-sonu-ek-12', 'donem-sonu', $ml$Dönem Karının 690 Hesabına Aktarımı (Sade)$ml$, 'zor', $ml$Dönem sonu mahsubunda gelir tablosu hesapları kapanmış ve net olarak 75.000 TL kar oluşmuştur. Bu tutar 690 Dönem Karı veya Zararı'ndan 590 Dönem Net Karı'na aktarılacaktır. (Vergi etkisi bu örnekte ihmal edilmiştir.)$ml$, $ml$690 borç ↔ 590 alacak.$ml$, $ml$Gelir-gider mahsuplarından sonra net karlı pozisyon: 690 Dönem Karı veya Zararı 75.000 TL borç. 590 Dönem Net Karı 75.000 TL alacak. Bu kayıt sonucunda 690 hesabı kapatılmış, kar bilançoya yansımıştır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'donem-sonu-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-12', 1, '690', 75000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('donem-sonu-ek-12', 2, '590', 0, 75000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-1', 'kambiyo', $ml$Bankada Döviz Alımı (TL ile)$ml$, 'kolay', $ml$İşletme Akbank şubesinden 1.000 USD almıştır. Alış kuru 1 USD = 32,00 TL'dir; toplam 32.000 TL banka TL hesabından çekilmiş, 1.000 USD yine bankadaki USD vadesiz hesaba yatırılmıştır.$ml$, $ml$TL hesabı azalır, USD hesabı (102) alt hesabı artar.$ml$, $ml$USD vadesiz hesap (102 Bankalar - USD) TL karşılığı 32.000 TL ile borç. TL vadesiz hesap (102 Bankalar - TL) 32.000 TL alacak. İki alt hesap arası transfer; toplam banka değişmez ama yardımcı düzeyde bilgi açıklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-1', 1, '102', 32000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-1', 2, '102', 0, 32000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-2', 'kambiyo', $ml$Dövizli Mal Satışı (Tahsilat İlerde)$ml$, 'kolay', $ml$İşletme yurtdışı müşteriye 5.000 USD'ye mal satmıştır. Fatura tarihinde kur 1 USD = 33,00 TL olup ödeme 60 gün sonradır. (İhracat KDV istisnası uygulanmaktadır; maliyet ayrı kayıtla yapılacaktır.) İşletme alacağı 120 hesabına TL karşılığı 165.000 TL ile kaydetmiştir.$ml$, $ml$Hasılat 601; alacak 120; KDV yok.$ml$, $ml$120 Alıcılar 165.000 TL borç (5.000 USD × 33,00). 601 Yurt Dışı Satışlar 165.000 TL alacak. KDV yoktur. Tahsilatta kur farkı 646 veya 656'da değerlendirilecektir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-2', 1, '120', 165000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-2', 2, '601', 0, 165000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-3', 'kambiyo', $ml$Dövizli Alacağın Vadesinde Tahsilatı (Kur Karı)$ml$, 'kolay', $ml$Önceden 165.000 TL (5.000 USD × 33,00) olarak kayda alınmış yurtdışı alacağı, vade tarihinde 5.000 USD olarak banka hesabına gelmiştir. Tahsilat günü kur 1 USD = 34,00 TL'dir; TL karşılığı 170.000 TL'dir.$ml$, $ml$Tahsilat tutarı arttı → kur karı 646 alacak.$ml$, $ml$102 Bankalar (USD) 170.000 TL borç (5.000 USD × 34,00). 120 Alıcılar 165.000 TL alacak (kayıtlı tutar). Aradaki 5.000 TL kambiyo karıdır: 646 Kambiyo Karları 5.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-3', 1, '102', 170000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-3', 2, '120', 0, 165000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-3', 3, '646', 0, 5000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-4', 'kambiyo', $ml$Dövizli Alacağın Vadesinde Tahsilatı (Kur Zararı)$ml$, 'kolay', $ml$120 Alıcılar'da 165.000 TL (5.000 USD × 33,00) kayıtlı yurtdışı alacağı, tahsilat günü kuru 1 USD = 31,00 TL olarak gerçekleştiği için 155.000 TL TL karşılığı ile bankaya gelmiştir.$ml$, $ml$Düşen kur zararı 656 borç.$ml$, $ml$102 Bankalar (USD) 155.000 TL borç. 120 Alıcılar 165.000 TL alacak (kayıtlı tutar). Aradaki 10.000 TL kambiyo zararıdır: 656 Kambiyo Zararları 10.000 TL borç.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-4', 1, '102', 155000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-4', 2, '656', 10000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-4', 3, '120', 0, 165000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-5', 'kambiyo', $ml$Dövizli Mal İthalatı (Vadeli)$ml$, 'orta', $ml$İşletme yurtdışından 4.000 EUR tutarında ticari mal ithal etmiş ve fatura tarihinde 1 EUR = 36,00 TL kuruyla 144.000 TL TL karşılığı ile 320 Satıcılar - Yurt Dışı'na borçlanmıştır. Ödeme 90 gün sonra yapılacaktır. (İthalatta KDV gümrükte ayrı süreçte ödenir; bu örnekte ihmal edilmiştir.)$ml$, $ml$153 borç ↔ 320 alacak; KDV ihmal.$ml$, $ml$153 Ticari Mallar 144.000 TL borç (4.000 EUR × 36,00). 320 Satıcılar 144.000 TL alacak. Ödeme tarihindeki kura göre kur farkı doğacak ve uygun gelir/gider hesabına yansıtılacaktır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-5', 1, '153', 144000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-5', 2, '320', 0, 144000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-6', 'kambiyo', $ml$Dövizli Borç Ödenmesi (Kur Zararı)$ml$, 'orta', $ml$Daha önce 144.000 TL (4.000 EUR × 36,00) olarak kaydedilmiş yurtdışı satıcı borcu, vade tarihinde 4.000 EUR olarak ödenecektir. Ödeme günü kur 1 EUR = 38,00 TL'dir; TL karşılığı 152.000 TL'dir.$ml$, $ml$Daha çok TL gitti → kur zararı 656 borç.$ml$, $ml$320 Satıcılar 144.000 TL borç (kayıtlı tutar kapanır). 656 Kambiyo Zararları 8.000 TL borç (artış). 102 Bankalar (EUR) 152.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-6', 1, '320', 144000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-6', 2, '656', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-6', 3, '102', 0, 152000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-7', 'kambiyo', $ml$Dövizli Borç Ödenmesi (Kur Karı)$ml$, 'orta', $ml$320 Satıcılar - Yurt Dışı'nda 144.000 TL (4.000 EUR × 36,00) kayıtlı borç, ödeme günü kuru 1 EUR = 35,00 TL olarak gerçekleştiği için 140.000 TL TL karşılığı ile ödenmiştir.$ml$, $ml$Az TL gitti → kur karı 646 alacak.$ml$, $ml$320 Satıcılar 144.000 TL borç (kapanış). 102 Bankalar (EUR) 140.000 TL alacak. Aradaki 4.000 TL işletme lehine kambiyo karıdır: 646 Kambiyo Karları 4.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-7', 1, '320', 144000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-7', 2, '646', 0, 4000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-7', 3, '102', 0, 140000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-8', 'kambiyo', $ml$Dövizli Banka Hesabının Yıl Sonu Değerlemesi (Lehe)$ml$, 'orta', $ml$Yıl sonu itibariyle işletmenin USD hesabında 10.000 USD bulunmaktadır. Defter değeri 320.000 TL (alış kuru 32,00) olarak kayıtlıdır. 31 Aralık MB efektif kuru 1 USD = 33,50 TL'dir; bu durumda hesap 335.000 TL değer kazanmıştır.$ml$, $ml$Aktifin değeri arttı → kambiyo karı 646 alacak.$ml$, $ml$USD vadesiz hesabın TL değeri arttığı için 102 Bankalar (USD) 15.000 TL borç (artış). Karşılığında 646 Kambiyo Karları 15.000 TL alacak. Yıl sonu değerlemesi sonucu hesap kayıtlı değeri 335.000 TL'ye yükselmiş olur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-8', 1, '102', 15000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-8', 2, '646', 0, 15000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-9', 'kambiyo', $ml$Dövizli Banka Hesabının Yıl Sonu Değerlemesi (Aleyhte)$ml$, 'orta', $ml$İşletmenin USD vadesiz hesabında 10.000 USD bulunmaktadır. Defter değeri 320.000 TL'dir. Yıl sonu MB kuru 1 USD = 30,00 TL'ye düşmüş, hesabın TL karşılığı 300.000 TL olmuştur.$ml$, $ml$Aktifin değeri düştü → kambiyo zararı 656 borç.$ml$, $ml$USD hesabı değer kaybetti: 102 Bankalar (USD) 20.000 TL alacak. 656 Kambiyo Zararları 20.000 TL borç. Yeni TL değer 300.000 TL'ye iner.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-9', 1, '656', 20000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-9', 2, '102', 0, 20000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-10', 'kambiyo', $ml$Dövizli Borçların Yıl Sonu Değerlemesi (Aleyhte)$ml$, 'zor', $ml$Yıl sonu itibariyle 320 Satıcılar - Yurt Dışı bakiyesi 144.000 TL'dir (4.000 EUR × 36,00). 31 Aralık MB efektif kuru 1 EUR = 38,00 TL olduğundan borcun TL değeri 152.000 TL'ye yükselmiştir.$ml$, $ml$Pasif arttı → kambiyo zararı 656 borç.$ml$, $ml$Yükümlülük arttığı için 320 Satıcılar 8.000 TL alacak (defter değeri yukarı çekilir). 656 Kambiyo Zararları 8.000 TL borç. Yeni TL değer 152.000 TL olur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-10', 1, '656', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-10', 2, '320', 0, 8000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-11', 'kambiyo', $ml$Dövizli Borçların Yıl Sonu Değerlemesi (Lehe)$ml$, 'zor', $ml$320 Satıcılar - Yurt Dışı'nda 144.000 TL (4.000 EUR × 36,00) tutarında borç bulunmaktadır. Yıl sonu kuru 1 EUR = 34,00 TL'ye düştüğünden borcun TL karşılığı 136.000 TL'ye inmiştir.$ml$, $ml$Pasif azaldı → kambiyo karı 646 alacak.$ml$, $ml$Yükümlülük azaldığı için 320 Satıcılar 8.000 TL borç (azaltma). 646 Kambiyo Karları 8.000 TL alacak. Yeni TL değer 136.000 TL'dir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-11', 1, '320', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-11', 2, '646', 0, 8000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kambiyo-ek-12', 'kambiyo', $ml$Karma Yıl Sonu Değerleme: Hem Aktif Hem Pasif$ml$, 'zor', $ml$Yıl sonu değerlemesinde işletmenin: 1) USD vadesiz hesabı 10.000 USD (defter 320.000 TL; yeni kur 33,50 → 335.000 TL: 15.000 TL kar), 2) EUR satıcı borcu 4.000 EUR (defter 144.000 TL; yeni kur 37,00 → 148.000 TL: 4.000 TL zarar). İki kayıt aynı yevmiyede yapılmıştır.$ml$, $ml$Aktif kar + pasif zarar; ikisi de ayrı kayıtla işlenir.$ml$, $ml$Aktif değerleme (kar): 102 Bankalar (USD) 15.000 TL borç; 646 Kambiyo Karları 15.000 TL alacak. Pasif değerleme (zarar): 656 Kambiyo Zararları 4.000 TL borç; 320 Satıcılar 4.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kambiyo-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-12', 1, '102', 15000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-12', 2, '646', 0, 15000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-12', 3, '656', 4000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kambiyo-ek-12', 4, '320', 0, 4000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-1', 'kasa', $ml$Peşin Hizmet Bedeli Tahsilatı$ml$, 'kolay', $ml$Bilgisayar bakım hizmeti veren işletme, bir müşterisinden tek seferlik bakım bedeli olarak 15.000 TL'yi nakit tahsil etmiş ve makbuz düzenlemiştir. (KDV bu örnekte ihmal edilmiştir.)$ml$, $ml$Kasaya nakit girişi 100 Kasa borç; hizmet hasılatı yurt içi satışlar alacak.$ml$, $ml$Kasaya nakit giriş olduğu için 100 Kasa hesabı 15.000 TL borçlanır. Esas faaliyet kapsamındaki hasılat 600 Yurt İçi Satışlar hesabına 15.000 TL alacak olarak işlenir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-1', 1, '100', 15000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-1', 2, '600', 0, 15000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-2', 'kasa', $ml$Kasadan Kırtasiye Alımı$ml$, 'kolay', $ml$İşletme, ofis kullanımı için 800 TL + %20 KDV tutarında kırtasiye malzemesini kasadan nakit ödeyerek almıştır.$ml$, $ml$Kırtasiye genel yönetim gideridir. KDV indirilebilir.$ml$, $ml$Kırtasiye gideri 770 Genel Yönetim Giderleri olarak borçlanır (800). KDV 191 İndirilecek KDV ile borçlanır (160). Kasadan toplam 960 TL çıkışı olur (alacak).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-2', 1, '770', 800, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-2', 2, '191', 160, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-2', 3, '100', 0, 960);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-3', 'kasa', $ml$Kasaya Banka Çekimi$ml$, 'kolay', $ml$Ay sonu personel ödemeleri için banka hesabından 50.000 TL çekilerek işletme kasasına aktarılmıştır.$ml$, $ml$İki hazır değer arası transfer; yalnızca yer değiştirir.$ml$, $ml$Kasa varlığı arttığı için 100 Kasa borçlanır (50.000), banka mevduatı azaldığı için 102 Bankalar alacaklanır (50.000). Hazır değerler içinde transfer kayıt değeri yaratmaz, sadece hesaplar arası geçiştir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-3', 1, '100', 50000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-3', 2, '102', 0, 50000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-4', 'kasa', $ml$Personel Avansı Verme (Nakit)$ml$, 'kolay', $ml$Pazarlama müdürüne iş seyahati için 5.000 TL nakit avans verilmiştir.$ml$, $ml$Personel avansı geçici alacak hesabıdır.$ml$, $ml$Personele verilen nakit avans 196 Personel Avansları hesabında borçlanır. Kasadan çıkış olduğu için 100 Kasa hesabı alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-4', 1, '196', 5000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-4', 2, '100', 0, 5000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-5', 'kasa', $ml$Kasa Sayımında Noksan Tespiti$ml$, 'orta', $ml$Gün sonu yapılan kasa sayımında, kayıtlı bakiye 12.500 TL olmasına karşın fiili kasa 12.350 TL'dir. Fark sebebi tespit edilemediğinden geçici olarak kayda alınmıştır.$ml$, $ml$Sayım eksiği geçici hesapta izlenir.$ml$, $ml$Kasa kaydı fiili duruma getirilirken 100 Kasa 150 TL alacaklanır. Fark 197 Sayım ve Tesellüm Noksanları hesabında borçlanarak geçici olarak izlenir; sebep tespit edilince ilgili hesaba aktarılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-5', 1, '197', 150, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-5', 2, '100', 0, 150);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-6', 'kasa', $ml$Müşteriden Avans Tahsilatı$ml$, 'orta', $ml$İşletme, ileride teslim edilecek mal siparişi için müşteriden 30.000 TL nakit avans tahsil etmiş ve avans makbuzu düzenlemiştir.$ml$, $ml$Avans henüz hasılat değildir; alınan sipariş avansı pasif hesabıdır.$ml$, $ml$Tahsil edilen avans henüz mal teslimatı yapılmadığı için satış kabul edilmez. 100 Kasa borçlandırılır (30.000); 340 Alınan Sipariş Avansları alacaklandırılır (30.000). Mal teslim edildiğinde 340 hesabı kapatılarak 600 hesabına aktarılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-6', 1, '100', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-6', 2, '340', 0, 30000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-7', 'kasa', $ml$Müşteri Borcunun Kısmen Nakit Tahsili$ml$, 'orta', $ml$Alıcılar hesabında 25.000 TL borcu görünen müşteriden 18.000 TL nakit, kalan 7.000 TL için 30 gün vadeli senet alınmıştır.$ml$, $ml$İki tahsilat aracı; biri kasa biri alacak senedi.$ml$, $ml$Müşteri borcu 120 Alıcılar hesabından düşürülmek üzere 25.000 TL alacaklandırılır. Karşılığında 100 Kasa 18.000 TL ile, 121 Alacak Senetleri ise 7.000 TL ile borçlandırılarak tahsilat aracı çeşitliliği yansıtılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-7', 1, '100', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-7', 2, '121', 7000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-7', 3, '120', 0, 25000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-8', 'kasa', $ml$Kasa Sayımında Fazlalık$ml$, 'orta', $ml$Gün sonu kasa sayımında fiili kasa kayıtlı bakiyeden 240 TL fazla bulunmuştur. Sebep henüz araştırılmamaktadır.$ml$, $ml$Sayım fazlası, sebebi belirleninceye kadar geçici borç hesabında izlenir.$ml$, $ml$Fiili kasa kayıttan fazla olduğu için 100 Kasa hesabı 240 TL borçlandırılır. Sebep belirleninceye kadar fazlalık geçici nitelikte yükümlülük olduğundan 336 Diğer Çeşitli Borçlar hesabında alacak izlenir; sebep tespit edilince ilgili gelir/borç hesabına aktarılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-8', 1, '100', 240, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-8', 2, '336', 0, 240);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-9', 'kasa', $ml$Kasa Noksanının Personelden Tahsili$ml$, 'orta', $ml$Önceki gün tespit edilen 500 TL kasa noksanlığının kasiyer kaynaklı olduğu anlaşılmış ve aynı gün ilgili personelden nakit olarak tahsil edilmiştir.$ml$, $ml$Geçici 197 hesabı kapatılır; tahsilat 100 Kasa'ya işlenir.$ml$, $ml$Daha önce 197 Sayım ve Tesellüm Noksanları'nda izlenen 500 TL, sebep belirlendiğinden kapatılır (alacak). Tahsil edilen tutar 100 Kasa hesabında borçlandırılır. Dönem sonunda noksan kalmadığı için sorumlulukla mahsuplaşma sağlanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-9', 1, '100', 500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-9', 2, '197', 0, 500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-10', 'kasa', $ml$Faiz Geliri Nakit Tahsilatı$ml$, 'orta', $ml$İşletmenin ortağına kullandırdığı borçtan 2.500 TL faiz geliri nakit olarak tahsil edilmiştir.$ml$, $ml$Faiz geliri 642 hesabıdır.$ml$, $ml$Nakit tahsilat 100 Kasa borç (2.500). Karşılığında 642 Faiz Gelirleri hesabı alacak (2.500). Bu işlem işletmenin esas faaliyetinden değil yan faaliyetinden gelir niteliğindedir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-10', 1, '100', 2500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-10', 2, '642', 0, 2500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-11', 'kasa', $ml$Çoklu Tahsilat ve Tediye Birlikte$ml$, 'zor', $ml$Aynı gün içinde işletme: 1) Bir müşteriden 12.000 TL borcunun tamamını nakit tahsil etmiş, 2) Tedarikçiye 8.000 TL nakit ödeme yapmış, 3) Genel yönetim için 1.200 TL + %20 KDV temsil ağırlama gideri kasadan ödemiştir.$ml$, $ml$Üç ayrı işlem ama tek günlük yevmiyede özetlenebilir; net kasa hareketi hesaplanır.$ml$, $ml$Müşteriden tahsilat: 100 Kasa borç 12.000, 120 Alıcılar alacak 12.000. Tedarikçi ödemesi: 320 Satıcılar borç 8.000, 100 Kasa alacak 8.000. Temsil-ağırlama gideri: 770 Genel Yönetim Giderleri borç 1.200, 191 İndirilecek KDV borç 240, 100 Kasa alacak 1.440. Üç işlem net etki: kasa 12.000 girer; 8.000 + 1.440 = 9.440 çıkar.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-11', 1, '100', 12000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-11', 2, '120', 0, 12000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-11', 3, '320', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-11', 4, '770', 1200, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-11', 5, '191', 240, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-11', 6, '100', 0, 9440);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kasa-ek-12', 'kasa', $ml$Kasa Noksanının Gider Yazılması$ml$, 'zor', $ml$Daha önce 197 Sayım ve Tesellüm Noksanları hesabında izlenen 800 TL'lik noksan, dönem sonunda sorumlu tespit edilemediği için olağandışı gider olarak kayıtlardan çıkarılmaktadır.$ml$, $ml$Geçici hesap kapatılır; gider hesabına aktarılır.$ml$, $ml$Dönem sonu mahsubunda sebep belirlenemeyen kasa noksanı işletme zararı sayılır. 689 Diğer Olağandışı Gider ve Zararlar hesabı 800 TL borçlandırılır; geçici 197 Sayım ve Tesellüm Noksanları hesabı 800 TL alacaklandırılarak kapatılır. Böylece kasa kaydı düzeltilmiş kalır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kasa-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-12', 1, '689', 800, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kasa-ek-12', 2, '197', 0, 800);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-1', 'kdv', $ml$KDV Mahsubu — Ödenecek KDV Çıkması$ml$, 'kolay', $ml$Mart ayı sonu itibariyle 391 Hesaplanan KDV bakiyesi 24.000 TL, 191 İndirilecek KDV bakiyesi 18.000 TL'dir. Ay sonu mahsuplaşmasında 191 hesabı, 391 hesabı ile mahsup edilerek ödenecek KDV ortaya çıkarılacaktır.$ml$, $ml$391 borç + 191 alacak; fark 360'a alacak.$ml$, $ml$391 Hesaplanan KDV 24.000 TL borçlandırılarak kapatılır. 191 İndirilecek KDV 18.000 TL alacaklandırılarak kapatılır. Aradaki 6.000 TL ödenecek KDV olarak 360 Ödenecek Vergi ve Fonlar'a alacak yazılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-1', 1, '391', 24000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-1', 2, '191', 0, 18000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-1', 3, '360', 0, 6000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-2', 'kdv', $ml$KDV Mahsubu — Devreden KDV Çıkması$ml$, 'kolay', $ml$Nisan ayı sonu 191 İndirilecek KDV bakiyesi 32.000 TL, 391 Hesaplanan KDV bakiyesi 25.000 TL'dir. Mahsup işleminde indirilecek KDV daha büyük olduğu için aradaki fark devreden KDV olarak sonraki aya aktarılacaktır.$ml$, $ml$391 borç + 190 borç ↔ 191 alacak.$ml$, $ml$391 Hesaplanan KDV 25.000 TL borçlandırılarak kapatılır. Kalan indirim hakkı (7.000 TL) 190 Devreden KDV hesabında borç olarak izlenir. 191 İndirilecek KDV 32.000 TL alacaklandırılarak kapatılır. Sonraki ayın mahsubunda 190 hesabı tekrar 191 olarak indirime alınır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-2', 1, '391', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-2', 2, '190', 7000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-2', 3, '191', 0, 32000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-3', 'kdv', $ml$Ödenecek KDV'nin Bankadan Ödenmesi$ml$, 'kolay', $ml$Geçen ay mahsup sonucunda 360 Ödenecek Vergi ve Fonlar'da 6.000 TL KDV borcu oluşmuştu. Bu ay vergi dairesine internet bankacılığı üzerinden ödeme yapılmıştır.$ml$, $ml$Vergi borcu kapanır; banka alacak.$ml$, $ml$Vergi borcu kapatıldığı için 360 Ödenecek Vergi ve Fonlar 6.000 TL borç. Banka mevduatından çıkış olduğu için 102 Bankalar 6.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-3', 1, '360', 6000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-3', 2, '102', 0, 6000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-4', 'kdv', $ml$Devreden KDV'nin Sonraki Ay Mahsubu$ml$, 'kolay', $ml$Önceki ay 190 Devreden KDV bakiyesi 7.000 TL olarak devretmiştir. Bu ayın başında bu bakiye, ay içi KDV indirimine eklenmek üzere 191 İndirilecek KDV hesabına aktarılmıştır.$ml$, $ml$190 alacak; 191 borç.$ml$, $ml$Geçmiş aydan devreden indirim hakkı 191 İndirilecek KDV 7.000 TL borç olarak yeniden ay içi indirimlerle birlikte izlenir. 190 Devreden KDV 7.000 TL alacak yazılarak kapatılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-4', 1, '191', 7000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-4', 2, '190', 0, 7000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-5', 'kdv', $ml$Faaliyet Dışı Sabit Kıymet Satışında KDV$ml$, 'orta', $ml$İşletme, kayıtlı değeri 50.000 TL ve birikmiş amortismanı 30.000 TL olan demirbaşı 25.000 TL + %20 KDV ile peşin satmıştır. Satış banka havalesi ile tahsil edilmiştir. (Satış kar/zarar mahsubu için 679/689 hesapları kullanılır.)$ml$, $ml$Demirbaş ve birikmiş amortisman birlikte kapanır; KDV satış üzerinden hesaplanır; kar 679 alacak.$ml$, $ml$102 Bankalar 30.000 TL borç. 257 Birikmiş Amortismanlar 30.000 TL borç (kapanış). 255 Demirbaşlar 50.000 TL alacak. 391 Hesaplanan KDV 5.000 TL alacak. Net defter değeri 20.000 TL, satış 25.000 TL — 5.000 TL kar 679 Diğer Olağandışı Gelir ve Karlar alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-5', 1, '102', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-5', 2, '257', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-5', 3, '255', 0, 50000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-5', 4, '391', 0, 5000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-5', 5, '679', 0, 5000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-6', 'kdv', $ml$İndirilemeyecek KDV Olan Gider$ml$, 'orta', $ml$İşletme, çalışanların kullanması için 4.000 TL + %20 KDV tutarında binek otomobil yakıtını nakit olarak almıştır. Mevzuat gereği binek otomobile ait yakıt KDV'si indirilemeyeceğinden, KDV gider olarak yansıtılmaktadır.$ml$, $ml$İndirilemeyen KDV gider hesabına eklenir.$ml$, $ml$İndirilemeyen KDV de gider niteliğindedir; toplam 4.800 TL 770 Genel Yönetim Giderleri'nde borç. 100 Kasa 4.800 TL alacak. 191 İndirilecek KDV kullanılmaz; KDV gider içinde takip edilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-6', 1, '770', 4800, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-6', 2, '100', 0, 4800);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-7', 'kdv', $ml$Farklı Oranlı Mal Alımı (%10 + %20)$ml$, 'orta', $ml$İşletme aynı tedarikçiden gıda ürünleri (10.000 TL + %10 KDV) ve temizlik malzemesi (8.000 TL + %20 KDV) almış, toplam fatura tutarı 20.600 TL'yi peşin banka havalesi ile ödemiştir. Hem gıda hem temizlik mallarının her ikisi 153 Ticari Mallar olarak izlenmektedir.$ml$, $ml$İki farklı KDV oranı tek kayıtta indirilecek KDV altında birleşir.$ml$, $ml$153 Ticari Mallar toplam 18.000 TL borç (10.000 + 8.000). KDV: 10.000 × %10 = 1.000 + 8.000 × %20 = 1.600 → toplam 2.600 TL 191 İndirilecek KDV borç. 102 Bankalar 20.600 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-7', 1, '153', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-7', 2, '191', 2600, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-7', 3, '102', 0, 20600);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-8', 'kdv', $ml$Satıştan İade Sonrası KDV Mahsubu (Geçici)$ml$, 'orta', $ml$İşletme, daha önce 391 Hesaplanan KDV'de izlenmiş olan 4.000 TL KDV'yi, ilgili satış iadesi nedeniyle ay içinde ters çevirmiştir. Ay sonu mahsupta 391 hesabının kalanı 16.000 TL, 191 hesabı 14.000 TL'dir. Mahsup yapılarak ödenecek KDV bulunacaktır.$ml$, $ml$Ay içi iade ters kaydı önceden işlenmiş; mahsup kalan bakiyeler üzerinden yapılır.$ml$, $ml$391 Hesaplanan KDV 16.000 TL borç ile kapanır. 191 İndirilecek KDV 14.000 TL alacak ile kapanır. Aradaki 2.000 TL 360 Ödenecek Vergi ve Fonlar alacak olarak izlenir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-8', 1, '391', 16000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-8', 2, '191', 0, 14000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-8', 3, '360', 0, 2000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-9', 'kdv', $ml$Ön Ödemeli (Peşin) Vergi: Stopajlı Faturada KDV$ml$, 'orta', $ml$Serbest meslek erbabından alınan 5.000 TL'lik (KDV %20: 1.000 TL) hizmet faturasında %20 gelir vergisi stopajı (1.000 TL) bulunmaktadır. Toplam ödeme: 5.000 + 1.000 KDV − 1.000 stopaj = 5.000 TL net banka havalesi ile yapılmıştır.$ml$, $ml$Hizmet bedeli gider; KDV indirilebilir; stopaj 360'a alacak.$ml$, $ml$770 Genel Yönetim Giderleri 5.000 TL borç (hizmet brüt bedeli). 191 İndirilecek KDV 1.000 TL borç. 360 Ödenecek Vergi ve Fonlar 1.000 TL alacak (stopaj). 102 Bankalar 5.000 TL alacak (net ödeme).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-9', 1, '770', 5000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-9', 2, '191', 1000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-9', 3, '360', 0, 1000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-9', 4, '102', 0, 5000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-10', 'kdv', $ml$İhracat Satışında KDV İstisnası$ml$, 'zor', $ml$İşletme yurtdışındaki müşterisine 100.000 TL tutarında ticari mal ihracat etmiştir. İhracat KDV'den istisnadır; ödeme banka havalesi ile yurt dışından gelmiştir. Maliyeti 70.000 TL olan mallar sürekli envanter yöntemiyle takip edilmektedir. (Bu örnekte kur farkı dikkate alınmamıştır.)$ml$, $ml$601 hesabı; KDV yok; sürekli envanter maliyet kaydı yine yapılır.$ml$, $ml$Hasılat: 102 Bankalar 100.000 TL borç; 601 Yurt Dışı Satışlar 100.000 TL alacak (KDV istisnası nedeniyle KDV yazılmaz). Maliyet: 621 STMM 70.000 TL borç; 153 Ticari Mallar 70.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-10', 1, '102', 100000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-10', 2, '601', 0, 100000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-10', 3, '621', 70000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-10', 4, '153', 0, 70000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-11', 'kdv', $ml$Devreden KDV Çıkması (Devamlı)$ml$, 'zor', $ml$Şubat ayı: 391 Hesaplanan KDV bakiyesi 12.000 TL, 191 İndirilecek KDV bakiyesi 28.000 TL ve önceki aydan devreden 190 Devreden KDV bakiyesi 4.000 TL'dir. Mahsup işleminde önce devreden KDV ay içi indirime aktarılmış olup; ay içi indirilebilir KDV toplamı 32.000 TL'dir. Net devreden KDV nasıl oluşur?$ml$, $ml$Hesaplanan KDV küçük; devreden KDV büyür.$ml$, $ml$Önce 190 → 191 aktarımı yapılmış kabul edilirse 191 toplam 32.000 TL'dir. Mahsupta 391 Hesaplanan KDV 12.000 TL borç ile kapanır. 191 İndirilecek KDV 32.000 TL alacak ile kapanır. Aradaki 20.000 TL devreden KDV olarak 190 Devreden KDV borç yazılır ve sonraki aya taşınır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-11', 1, '391', 12000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-11', 2, '190', 20000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-11', 3, '191', 0, 32000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('kdv-ek-12', 'kdv', $ml$Tevkifatlı Hizmet Alımı$ml$, 'zor', $ml$Yapım işi yapan kuruma fatura ödemesinde KDV tevkifatı uygulanmaktadır. Hizmet bedeli 50.000 TL, KDV %20 (10.000 TL). Tevkifat oranı 5/10 olduğundan KDV'nin yarısı (5.000 TL) sorumlu sıfatıyla işletmece beyan edilecek, kalan 5.000 TL satıcıya ödenecektir. Toplam: 50.000 + 5.000 = 55.000 TL banka havalesi.$ml$, $ml$İndirilecek KDV 10.000 (tam); 392 Diğer KDV 5.000 alacak (sorumlu sıfatıyla); banka 55.000 alacak.$ml$, $ml$770 Genel Yönetim Giderleri 50.000 TL borç. 191 İndirilecek KDV 10.000 TL borç (tam KDV indirim). 392 Diğer KDV (Sorumlu Sıfatıyla) 5.000 TL alacak — sonradan 360 hesabına aktarılarak işletmece ödenecek. 102 Bankalar 55.000 TL alacak (50.000 hizmet + 5.000 satıcının KDV payı).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'kdv-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-12', 1, '770', 50000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-12', 2, '191', 10000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-12', 3, '392', 0, 5000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('kdv-ek-12', 4, '102', 0, 55000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-1', 'mal', $ml$Peşin Ticari Mal Alımı$ml$, 'kolay', $ml$İşletme, satış için 50.000 TL + %20 KDV tutarında ticari malı tedarikçisinden e-fatura ile peşin satın almıştır. Ödeme banka havalesi ile yapılmıştır.$ml$, $ml$Ticari mal borç + indirilecek KDV borç ↔ banka alacak.$ml$, $ml$Mal stokuna giriş 153 Ticari Mallar 50.000 TL borç. KDV 191 İndirilecek KDV 10.000 TL borç. Toplam ödeme 60.000 TL banka çıkışı olarak 102 Bankalar alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-1', 1, '153', 50000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-1', 2, '191', 10000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-1', 3, '102', 0, 60000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-2', 'mal', $ml$Veresiye Mal Alımı$ml$, 'kolay', $ml$İşletme, tedarikçisinden 30 gün vadeli olarak 80.000 TL + %20 KDV tutarında ticari mal almıştır. Ödeme yapılmamış, satıcı cari hesabı borçlandırılacaktır.$ml$, $ml$Mal ve KDV borç ↔ Satıcılar alacak.$ml$, $ml$153 Ticari Mallar 80.000 TL borç, 191 İndirilecek KDV 16.000 TL borç. Vadeli alım olduğu için 320 Satıcılar 96.000 TL alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-2', 1, '153', 80000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-2', 2, '191', 16000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-2', 3, '320', 0, 96000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-3', 'mal', $ml$Peşin Mal Satışı (Sürekli Envanter)$ml$, 'kolay', $ml$İşletme, maliyeti 18.000 TL olan ticari malı 25.000 TL + %20 KDV ile peşin (banka havalesi) satmıştır. Sürekli envanter yöntemi kullanılmaktadır.$ml$, $ml$Hem hasılat hem maliyet kaydı yapılır.$ml$, $ml$Hasılat: 102 Bankalar 30.000 TL borç; 600 Yurt İçi Satışlar 25.000 TL alacak; 391 Hesaplanan KDV 5.000 TL alacak. Maliyet: 621 Satılan Ticari Mallar Maliyeti 18.000 TL borç; 153 Ticari Mallar 18.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-3', 1, '102', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-3', 2, '600', 0, 25000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-3', 3, '391', 0, 5000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-3', 4, '621', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-3', 5, '153', 0, 18000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-4', 'mal', $ml$Veresiye Mal Satışı (Sürekli Envanter)$ml$, 'kolay', $ml$İşletme, maliyeti 12.000 TL olan ticari malları 18.000 TL + %20 KDV ile 60 gün vadeli olarak müşterisine satmıştır. Sürekli envanter yöntemi uygulanmaktadır.$ml$, $ml$Alıcılar borç; satış + KDV alacak; ayrıca maliyet kaydı.$ml$, $ml$Hasılat: 120 Alıcılar 21.600 TL borç; 600 Yurt İçi Satışlar 18.000 TL alacak; 391 Hesaplanan KDV 3.600 TL alacak. Maliyet: 621 STMM 12.000 TL borç; 153 Ticari Mallar 12.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-4', 1, '120', 21600, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-4', 2, '600', 0, 18000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-4', 3, '391', 0, 3600);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-4', 4, '621', 12000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-4', 5, '153', 0, 12000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-5', 'mal', $ml$Mal Alımında İskonto (Fatura İçi)$ml$, 'orta', $ml$İşletme, liste fiyatı 100.000 TL olan ticari malı tedarikçisinden %10 fatura içi iskonto ile satın almıştır. Faturadaki net mal bedeli 90.000 TL + %20 KDV (18.000 TL) toplamı 108.000 TL olup tutar peşin banka havalesi ile ödenmiştir.$ml$, $ml$Fatura içi iskonto net bedeli düşürür; ek iskonto kaydı yapılmaz.$ml$, $ml$İskontolu net mal bedeli 90.000 TL üzerinden 153 Ticari Mallar borç. KDV iskontolu tutar üzerinden 18.000 TL 191 İndirilecek KDV borç. 102 Bankalar 108.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-5', 1, '153', 90000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-5', 2, '191', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-5', 3, '102', 0, 108000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-6', 'mal', $ml$Mal Alımına Eşlik Eden Navlun$ml$, 'orta', $ml$İşletme satıcıdan 60.000 TL + %20 KDV ticari mal almış, vadeli olarak 320 Satıcılar'a borçlanmıştır. Ayrıca malların depoya teslimi için nakliye firmasına 2.000 TL + %20 KDV ödeme banka havalesi ile yapılmıştır. Nakliye gideri stok maliyetine eklenmektedir.$ml$, $ml$Nakliye stok maliyetine ilave edilir; iki ayrı kayıt yapılır.$ml$, $ml$Mal alış kaydı: 153 Ticari Mallar 60.000 TL borç, 191 İndirilecek KDV 12.000 TL borç, 320 Satıcılar 72.000 TL alacak. Nakliye: 153 Ticari Mallar 2.000 TL borç (maliyete dahil), 191 İndirilecek KDV 400 TL borç, 102 Bankalar 2.400 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-6', 1, '153', 62000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-6', 2, '191', 12400, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-6', 3, '320', 0, 72000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-6', 4, '102', 0, 2400);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-7', 'mal', $ml$Satıştan İade (Sürekli Envanter)$ml$, 'orta', $ml$Önceden 18.000 TL + %20 KDV ile vadeli satılan ticari malların 6.000 TL + %20 KDV tutarındaki kısmı kalite uygunsuzluğu nedeniyle iade alınmıştır. İade edilen malın maliyeti 4.500 TL'dir; sürekli envanter uygulanmaktadır. Müşterinin cari borcu iade tutarı kadar azaltılacaktır.$ml$, $ml$Satıştan iadeler hesabı + KDV ters kayıt; ayrıca maliyet ters kaydı.$ml$, $ml$Hasılat ters kaydı: 610 Satıştan İadeler 6.000 TL borç, 391 Hesaplanan KDV 1.200 TL borç (ters yön), 120 Alıcılar 7.200 TL alacak. Maliyet ters kaydı: 153 Ticari Mallar 4.500 TL borç, 621 STMM 4.500 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-7', 1, '610', 6000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-7', 2, '391', 1200, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-7', 3, '120', 0, 7200);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-7', 4, '153', 4500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-7', 5, '621', 0, 4500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-8', 'mal', $ml$Tedarikçiye Sipariş Avansı$ml$, 'orta', $ml$İşletme, ileride teslim alacağı ticari mal siparişi için tedarikçisine 25.000 TL banka havalesi yoluyla avans göndermiştir. Henüz fatura düzenlenmemiş, mal teslim alınmamıştır.$ml$, $ml$Verilen sipariş avansı aktif geçici hesabıdır.$ml$, $ml$Avans tutarı 159 Verilen Sipariş Avansları 25.000 TL borç. Banka mevduatı azaldığı için 102 Bankalar 25.000 TL alacak. Mal teslim alındığında 159 hesabı kapatılarak 153 hesabına aktarılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-8', 1, '159', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-8', 2, '102', 0, 25000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-9', 'mal', $ml$Sipariş Avansının Mahsubu ile Mal Tesliminin Alınması$ml$, 'orta', $ml$Daha önce tedarikçiye 25.000 TL avans verilmiş ve 159 Verilen Sipariş Avansları'nda izlenmiştir. Bu kez mal teslim alınmış, satıcı 80.000 TL + %20 KDV tutarında fatura düzenlemiştir. Avans mahsup edilmiş, kalan 71.000 TL satıcının cari hesabına borçlanmıştır.$ml$, $ml$Avans hesabı kapatılır; kalan satıcı borcu olarak yazılır.$ml$, $ml$Mal alış kaydı: 153 Ticari Mallar 80.000 TL borç, 191 İndirilecek KDV 16.000 TL borç. Avans mahsubu: 159 Verilen Sipariş Avansları 25.000 TL alacak (kapanış). Kalan tutar 320 Satıcılar 71.000 TL alacak (96.000 - 25.000).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-9', 1, '153', 80000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-9', 2, '191', 16000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-9', 3, '159', 0, 25000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-9', 4, '320', 0, 71000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-10', 'mal', $ml$Karma Ödemeli Mal Satışı$ml$, 'zor', $ml$İşletme, maliyeti 35.000 TL olan ticari malı 50.000 TL + %20 KDV ile satmıştır. Müşteri toplam 60.000 TL'nin 20.000 TL'sini nakit, 25.000 TL'sini banka havalesi, kalan 15.000 TL'sini 30 gün vadeli alacak senedi ile ödemiştir. Sürekli envanter uygulanmaktadır.$ml$, $ml$Üç farklı tahsilat aracı; ayrıca maliyet kaydı.$ml$, $ml$Hasılat: 100 Kasa 20.000, 102 Bankalar 25.000, 121 Alacak Senetleri 15.000 TL borç. Karşılığında 600 Yurt İçi Satışlar 50.000 TL alacak ve 391 Hesaplanan KDV 10.000 TL alacak. Maliyet: 621 STMM 35.000 TL borç, 153 Ticari Mallar 35.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-10', 1, '100', 20000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-10', 2, '102', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-10', 3, '121', 15000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-10', 4, '600', 0, 50000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-10', 5, '391', 0, 10000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-10', 6, '621', 35000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-10', 7, '153', 0, 35000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-11', 'mal', $ml$Alış İskontosu (Vade Sonrası)$ml$, 'zor', $ml$İşletme, daha önce 320 Satıcılar'da 120.000 TL borç olarak izlenen mal alımının ödemesini vade tarihinden 10 gün önce yapmıştır. Tedarikçi vade öncesi ödeme nedeniyle %3 (3.600 TL) iskonto uygulamış, kalan 116.400 TL banka havalesi ile ödenmiştir. İskonto fatura sonrası ek bir gelir niteliğindedir.$ml$, $ml$Sonradan elde edilen alış iskontosu olağan gelir hesabına yazılır.$ml$, $ml$Satıcı borcu kapanır: 320 Satıcılar 120.000 TL borç. Ödeme: 102 Bankalar 116.400 TL alacak. İskonto işletme lehine gelir oluşturduğu için 649 Diğer Olağan Gelir ve Karlar 3.600 TL alacak yazılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-11', 1, '320', 120000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-11', 2, '102', 0, 116400);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-11', 3, '649', 0, 3600);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('mal-ek-12', 'mal', $ml$Mal Alış İadesinde KDV Düzeltmesi$ml$, 'zor', $ml$İşletme, 320 Satıcılar'da 96.000 TL borç olarak izlenen 80.000 TL + %20 KDV mal alımının 24.000 TL + %20 KDV tutarındaki kısmını hatalı ürün gerekçesiyle iade etmiştir. Tedarikçi iade faturasını kabul etmiş, satıcı cari hesabı 28.800 TL azaltılmıştır.$ml$, $ml$Mal hesabı azalır; KDV ters çevrilir; satıcı borcu düşer.$ml$, $ml$Tedarikçi borcu azaldığı için 320 Satıcılar 28.800 TL borç. İade edilen mal stoktan çıktığı için 153 Ticari Mallar 24.000 TL alacak. KDV indirim hakkı azaldığı için 191 İndirilecek KDV 4.800 TL alacak (ters kayıt).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'mal-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-12', 1, '320', 28800, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-12', 2, '153', 0, 24000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('mal-ek-12', 3, '191', 0, 4800);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-1', 'personel', $ml$Maaş Tahakkuku (Sade)$ml$, 'kolay', $ml$İşletme, idari personeline ait bir aylık brüt ücret tahakkuku yapmıştır. Brüt ücret 30.000 TL, SGK işçi payı 4.500 TL (15%), gelir vergisi stopajı 4.500 TL'dir; net ödenecek 21.000 TL'dir. Personel idari bölümde çalışmaktadır.$ml$, $ml$Brüt ücret gider; kesintiler pasiflerde alacak; net ödenecek personele borç alacak.$ml$, $ml$770 Genel Yönetim Giderleri 30.000 TL borç (brüt). 360 Ödenecek Vergi ve Fonlar 4.500 TL alacak (stopaj). 361 Ödenecek Sosyal Güvenlik Kesintileri 4.500 TL alacak (SGK işçi). 335 Personele Borçlar 21.000 TL alacak (net).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-1', 1, '770', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-1', 2, '360', 0, 4500);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-1', 3, '361', 0, 4500);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-1', 4, '335', 0, 21000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-2', 'personel', $ml$Net Maaş Ödemesi (Banka)$ml$, 'kolay', $ml$Önceki yevmiyede 335 Personele Borçlar'da 21.000 TL net maaş borcu kaydedilmişti. Bu ay sonu personelin banka hesabına havale yapılarak ödeme gerçekleşmiştir.$ml$, $ml$Personele borçlar kapanır; banka alacak.$ml$, $ml$Personele borç kapatıldığı için 335 Personele Borçlar 21.000 TL borç. Banka mevduatından çıkış olduğu için 102 Bankalar 21.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-2', 1, '335', 21000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-2', 2, '102', 0, 21000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-3', 'personel', $ml$SGK Primlerinin Bankadan Ödenmesi$ml$, 'kolay', $ml$Geçen ayın bordrosu nedeniyle 361 Ödenecek Sosyal Güvenlik Kesintileri'nde 12.000 TL borç (işçi + işveren payı toplamı) bulunmaktadır. Bu tutar SGK'ya banka aracılığıyla ödenmiştir.$ml$, $ml$361 hesabı kapanır; banka alacak.$ml$, $ml$Kapatma için 361 Ödenecek Sosyal Güvenlik Kesintileri 12.000 TL borç; banka mevduatından çıkış olduğu için 102 Bankalar 12.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-3', 1, '361', 12000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-3', 2, '102', 0, 12000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-4', 'personel', $ml$Stopaj Vergisinin Ödenmesi$ml$, 'kolay', $ml$Geçen ayın maaş bordrosundan 360 Ödenecek Vergi ve Fonlar'da 4.500 TL gelir vergisi stopajı bulunmaktadır. Vergi dairesine internet bankacılığı ile ödeme yapılmıştır.$ml$, $ml$Vergi borcu kapanır; banka alacak.$ml$, $ml$Vergi borcu kapatıldığı için 360 Ödenecek Vergi ve Fonlar 4.500 TL borç. Banka mevduatı azaldığı için 102 Bankalar 4.500 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-4', 1, '360', 4500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-4', 2, '102', 0, 4500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-5', 'personel', $ml$Pazarlama Personeli Maaş Tahakkuku$ml$, 'orta', $ml$İşletme, pazarlama bölümünde çalışan satış temsilcilerinin bir aylık bordrosunu yapmıştır. Brüt 50.000 TL, SGK işçi 7.500 TL, stopaj 7.500 TL, net ödenecek 35.000 TL'dir.$ml$, $ml$Pazarlamada çalışan personelin gideri 760 hesabına yazılır.$ml$, $ml$760 Pazarlama Satış ve Dağıtım Giderleri 50.000 TL borç (brüt). 360 Ödenecek Vergi ve Fonlar 7.500 TL alacak. 361 Ödenecek SGK Kesintileri 7.500 TL alacak. 335 Personele Borçlar 35.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-5', 1, '760', 50000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-5', 2, '360', 0, 7500);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-5', 3, '361', 0, 7500);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-5', 4, '335', 0, 35000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-6', 'personel', $ml$İşveren SGK Payı Tahakkuku$ml$, 'orta', $ml$Personel için işverenin sorumlu olduğu SGK ve işsizlik primi işveren payı (toplam 8.000 TL) ay sonu tahakkuk ettirilecektir. İşveren payı doğrudan gider niteliğindedir; idari personel kapsamındadır.$ml$, $ml$İşveren payı gider; SGK alacak.$ml$, $ml$İşveren SGK payı işletme gideri olduğu için 770 Genel Yönetim Giderleri 8.000 TL borç. Karşılığında 361 Ödenecek SGK Kesintileri 8.000 TL alacak (işveren payı işçi payıyla aynı hesapta toplanır).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-6', 1, '770', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-6', 2, '361', 0, 8000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-7', 'personel', $ml$Personel Avansı (Mahsuplaşma Öncesi)$ml$, 'orta', $ml$Bir personele Mart ayı maaşına mahsuben 5.000 TL nakit avans verilmiştir. Avans personele teslim edilmiş, makbuz alınmıştır. Mahsuplaşma ay sonu yapılacaktır.$ml$, $ml$Personel avansı aktif geçici hesaptır.$ml$, $ml$Verilen avans 196 Personel Avansları 5.000 TL borç. Kasadan çıkış olduğu için 100 Kasa 5.000 TL alacak. Ay sonu maaş tahakkukunda bu tutar 335'ten düşülecektir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-7', 1, '196', 5000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-7', 2, '100', 0, 5000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-8', 'personel', $ml$Personel Avansının Maaştan Mahsubu$ml$, 'orta', $ml$Mart maaş tahakkuku şöyledir: Brüt 25.000 TL, SGK işçi 3.750 TL, stopaj 3.750 TL, hesaplanan net 17.500 TL. Daha önce 196 hesabında 5.000 TL avans bulunmaktadır. Avans mahsup edilerek personele kalan 12.500 TL ödenecektir; ödeme henüz yapılmamış, sadece tahakkuk yapılmıştır.$ml$, $ml$Avans 196 alacak; kalan tutar 335 alacak.$ml$, $ml$770 Genel Yönetim Giderleri 25.000 TL borç (brüt). 360 Ödenecek Vergi ve Fonlar 3.750 TL alacak. 361 Ödenecek SGK Kesintileri 3.750 TL alacak. 196 Personel Avansları 5.000 TL alacak (mahsuplaşarak kapanır). 335 Personele Borçlar 12.500 TL alacak (kalan ödenecek).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-8', 1, '770', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-8', 2, '360', 0, 3750);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-8', 3, '361', 0, 3750);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-8', 4, '196', 0, 5000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-8', 5, '335', 0, 12500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-9', 'personel', $ml$İcra Kesintili Maaş Tahakkuku$ml$, 'zor', $ml$İdari personelin maaşından icra dosyası nedeniyle ek kesinti yapılacaktır. Brüt 40.000 TL, SGK işçi 6.000 TL, stopaj 6.000 TL, icra kesintisi 5.000 TL'dir. Net ödenecek 23.000 TL olarak hesaplanmıştır. İcra tutarı geçici borç hesabında izlenir.$ml$, $ml$İcra kesintisi 336 Diğer Çeşitli Borçlar'da takip edilir.$ml$, $ml$770 Genel Yönetim Giderleri 40.000 TL borç. 360 Ödenecek Vergi ve Fonlar 6.000 TL alacak. 361 Ödenecek SGK Kesintileri 6.000 TL alacak. 336 Diğer Çeşitli Borçlar 5.000 TL alacak (icra dairesine ödenecek). 335 Personele Borçlar 23.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-9', 1, '770', 40000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-9', 2, '360', 0, 6000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-9', 3, '361', 0, 6000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-9', 4, '336', 0, 5000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-9', 5, '335', 0, 23000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-10', 'personel', $ml$Karma Bordro: Maaş + İşveren Payı + Avans Mahsubu$ml$, 'zor', $ml$İdari personel maaş tahakkuku: Brüt 60.000 TL, SGK işçi 9.000 TL, stopaj 9.000 TL. Net ödenecek 42.000 TL hesaplanmıştır. Bunun yanında işveren SGK payı 11.500 TL ayrıca tahakkuk edecektir. Daha önce verilmiş 8.000 TL personel avansı bordroda mahsup edilecektir; kalan 34.000 TL personele net olarak borçlu kalınmıştır. (Tahakkuk; ödeme yapılmadı.)$ml$, $ml$Brüt + işveren payı toplam gider; kesintiler pasifte; avans 196 alacakla mahsuplaşır.$ml$, $ml$770 Genel Yönetim Giderleri 60.000 (brüt) + 11.500 (işveren) = 71.500 TL borç. 360 Ödenecek Vergi ve Fonlar 9.000 TL alacak. 361 Ödenecek SGK Kesintileri 9.000 (işçi) + 11.500 (işveren) = 20.500 TL alacak. 196 Personel Avansları 8.000 TL alacak. 335 Personele Borçlar 34.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-10', 1, '770', 71500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-10', 2, '360', 0, 9000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-10', 3, '361', 0, 20500);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-10', 4, '196', 0, 8000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-10', 5, '335', 0, 34000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-11', 'personel', $ml$Net Maaş + SGK + Stopajın Aynı Gün Ödenmesi$ml$, 'zor', $ml$Ay sonu personele 21.000 TL net maaş, SGK'ya 9.000 TL prim, vergi dairesine 4.500 TL stopaj olmak üzere üç ayrı ödeme aynı gün banka havalesi ile yapılmıştır. Toplam 34.500 TL banka çıkışı oluşmuştur. (335, 361 ve 360 hesaplarındaki bakiyeler kapatılacaktır.)$ml$, $ml$Üç ayrı borç hesabı kapanır; banka alacak.$ml$, $ml$335 Personele Borçlar 21.000 TL borç (kapanış). 361 Ödenecek SGK Kesintileri 9.000 TL borç. 360 Ödenecek Vergi ve Fonlar 4.500 TL borç. Üç borcun toplamı kadar banka çıkışı: 102 Bankalar 34.500 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-11', 1, '335', 21000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-11', 2, '361', 9000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-11', 3, '360', 4500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-11', 4, '102', 0, 34500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('personel-ek-12', 'personel', $ml$Kıdem ve İhbar Tazminatı Ödemesi$ml$, 'zor', $ml$İşten çıkarılan personele 25.000 TL kıdem tazminatı + 10.000 TL ihbar tazminatı ödenmiştir. Kıdem tazminatı stopaj ve SGK'dan istisna; ihbar tazminatı %15 (1.500 TL) gelir vergisi stopajına tabidir. Ödeme bankadan yapılmış olup vergi henüz ödenmedi.$ml$, $ml$İhbar tazminatı stopajı 360'a alacak; net ödeme banka alacak.$ml$, $ml$770 Genel Yönetim Giderleri 35.000 TL borç (toplam tazminat brütü). 360 Ödenecek Vergi ve Fonlar 1.500 TL alacak (ihbar stopajı). 102 Bankalar 33.500 TL alacak (net ödeme: 25.000 kıdem + 8.500 net ihbar).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'personel-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-12', 1, '770', 35000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-12', 2, '360', 0, 1500);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('personel-ek-12', 3, '102', 0, 33500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-1', 'reeskont', $ml$Alacak Senedi Reeskontu (Dönem Sonu)$ml$, 'kolay', $ml$31 Aralık dönem sonu itibariyle 121 Alacak Senetleri'nde nominal değeri 100.000 TL olan vadeli senetlerin reeskont tutarı 4.000 TL olarak hesaplanmıştır. Reeskont, alacağın bugünkü değerine indirgenmesidir.$ml$, $ml$Düzenleyici aktif (-) hesabı 122 alacak; reeskont gideri 657 borç.$ml$, $ml$Reeskont tutarı dönem gideridir: 657 Reeskont Faiz Giderleri 4.000 TL borç. Düzenleyici aktif (-) hesap olarak 122 Alacak Senetleri Reeskontu 4.000 TL alacak. Bu kayıt alacak senetlerinin bilanço değerini bugünkü değere indirir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-1', 1, '657', 4000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-1', 2, '122', 0, 4000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-2', 'reeskont', $ml$Alacak Senedi Reeskontunun Yeni Yıl Başında İptali$ml$, 'kolay', $ml$Yeni yıl başında, geçen yıl ayrılmış 4.000 TL'lik alacak senetleri reeskontu (122 hesabında) iptal edilerek ters kayıtla geri çevrilecektir. Bu ters kayıt sayesinde senetlerin yıl içinde tahsil edildiğinde bilanço değerinin gerçeği yansıtması sağlanır.$ml$, $ml$122 borç ↔ 647 alacak (reeskont faiz geliri).$ml$, $ml$122 Alacak Senetleri Reeskontu 4.000 TL borç (kapanış). 647 Reeskont Faiz Gelirleri 4.000 TL alacak (yeni yılın geliri). Senet vadesinde tahsil edildiğinde herhangi bir reeskont kalmayacaktır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-2', 1, '122', 4000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-2', 2, '647', 0, 4000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-3', 'reeskont', $ml$Borç Senedi Reeskontu (Dönem Sonu)$ml$, 'kolay', $ml$31 Aralık dönem sonunda 321 Borç Senetleri'nde nominal değeri 80.000 TL olan vadeli senetler için 3.200 TL reeskont hesaplanmıştır. Bu işlem yükümlülüğün bugünkü değerine indirgenmesidir.$ml$, $ml$Düzenleyici pasif (-) hesabı 322 borç; gelir hesabı 647 alacak.$ml$, $ml$Yükümlülük bugüne indirgendiği için işletme lehine gelir oluşur: 322 Borç Senetleri Reeskontu 3.200 TL borç (pasif düzeltici). 647 Reeskont Faiz Gelirleri 3.200 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-3', 1, '322', 3200, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-3', 2, '647', 0, 3200);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-4', 'reeskont', $ml$Borç Senedi Reeskontunun Yeni Yıl Başında İptali$ml$, 'kolay', $ml$Yeni yılın ilk günü, geçen yıl ayrılmış 3.200 TL'lik borç senetleri reeskontu (322 hesabında) ters kayıtla iptal edilmiştir.$ml$, $ml$657 borç ↔ 322 alacak.$ml$, $ml$657 Reeskont Faiz Giderleri 3.200 TL borç (yeni yıl gideri). 322 Borç Senetleri Reeskontu 3.200 TL alacak (kapanış). Bu kayıtla yükümlülüğün defter değeri tekrar nominal değere döner.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-4', 1, '657', 3200, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-4', 2, '322', 0, 3200);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-5', 'reeskont', $ml$Reeskont Birlikte Kayıt: Alacak + Borç Senedi$ml$, 'orta', $ml$Dönem sonunda hem alacak hem borç senetleri için reeskont ayrılmaktadır. Alacak senetlerinde 5.000 TL, borç senetlerinde 2.500 TL reeskont hesaplanmıştır. İki kayıt aynı yevmiyede birleştirilebilir.$ml$, $ml$Alacak için gider; borç için gelir.$ml$, $ml$Alacak reeskontu: 657 Reeskont Faiz Giderleri 5.000 TL borç; 122 Alacak Senetleri Reeskontu 5.000 TL alacak. Borç reeskontu: 322 Borç Senetleri Reeskontu 2.500 TL borç; 647 Reeskont Faiz Gelirleri 2.500 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-5', 1, '657', 5000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-5', 2, '122', 0, 5000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-5', 3, '322', 2500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-5', 4, '647', 0, 2500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-6', 'reeskont', $ml$Yeni Yıl Açılışında İki Reeskontun Birlikte İptali$ml$, 'orta', $ml$Yeni yıl başında, önceki dönemin sonunda ayrılmış olan alacak (5.000 TL) ve borç (2.500 TL) senedi reeskontlarının iptal kaydı yapılacaktır. Aynı yevmiyede birleştirilmiştir.$ml$, $ml$Aktif reeskont 647 alacak; pasif reeskont 657 borç.$ml$, $ml$Alacak senedi reeskontu iptali: 122 Alacak Senetleri Reeskontu 5.000 TL borç; 647 Reeskont Faiz Gelirleri 5.000 TL alacak. Borç senedi reeskontu iptali: 657 Reeskont Faiz Giderleri 2.500 TL borç; 322 Borç Senetleri Reeskontu 2.500 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-6', 1, '122', 5000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-6', 2, '647', 0, 5000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-6', 3, '657', 2500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-6', 4, '322', 0, 2500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-7', 'reeskont', $ml$Reeskont Hesaplaması (Basit Formül)$ml$, 'orta', $ml$Nominal değeri 60.000 TL olan ve vadesine 90 gün kalmış alacak senedi için yıllık %20 iskonto oranı kullanılarak iç iskonto formülü ile reeskont hesaplanmıştır. Hesaplanan reeskont tutarı 2.876,71 TL olup yuvarlanarak 2.876 TL olarak kaydedilecektir.$ml$, $ml$İç iskonto: Reeskont = N × n × t / (36000 + n × t).$ml$, $ml$Hesaplanan reeskont 2.876 TL gider olarak kaydedilir: 657 Reeskont Faiz Giderleri 2.876 TL borç. Düzenleyici aktif olarak 122 Alacak Senetleri Reeskontu 2.876 TL alacak. Hesaplama bilgisinin uygulamada doğruluğu önemlidir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-7', 1, '657', 2876, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-7', 2, '122', 0, 2876);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-8', 'reeskont', $ml$Borç Senedi Reeskont Hesaplaması$ml$, 'orta', $ml$Nominal 50.000 TL ve vadesine 60 gün kalan borç senedi için yıllık %18 iskonto oranı ile reeskont hesaplanmış, bulunan tutar 1.474 TL'dir. Bu tutar dönem sonu kaydı yapılacaktır.$ml$, $ml$Borç senedi reeskontu işletme lehine gelir oluşturur.$ml$, $ml$322 Borç Senetleri Reeskontu 1.474 TL borç (pasif düzeltici). 647 Reeskont Faiz Gelirleri 1.474 TL alacak. Yeni yıl başında bu kayıt ters çevrilerek iptal edilecektir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-8', 1, '322', 1474, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-8', 2, '647', 0, 1474);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-9', 'reeskont', $ml$Yıl Sonu Karma Senet Portföyü Reeskontu$ml$, 'zor', $ml$Dönem sonu reeskont incelemesinde işletmenin alacak senetleri portföyünde 250.000 TL nominal toplam, hesaplanan reeskont 9.500 TL; borç senetleri portföyünde 180.000 TL nominal toplam, hesaplanan reeskont 6.800 TL bulunmaktadır. İki ayrı reeskont aynı yevmiyede yapılacaktır.$ml$, $ml$Alacak için gider, borç için gelir; iki ayrı kayıt yapılır.$ml$, $ml$Alacak senedi reeskontu (gider): 657 Reeskont Faiz Giderleri 9.500 TL borç; 122 Alacak Senetleri Reeskontu 9.500 TL alacak. Borç senedi reeskontu (gelir): 322 Borç Senetleri Reeskontu 6.800 TL borç; 647 Reeskont Faiz Gelirleri 6.800 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-9', 1, '657', 9500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-9', 2, '122', 0, 9500);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-9', 3, '322', 6800, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-9', 4, '647', 0, 6800);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-10', 'reeskont', $ml$Çeklerde Reeskont Düzenlemesi$ml$, 'zor', $ml$İşletmenin elinde 80.000 TL nominal değerli vadeli müşteri çeki bulunmaktadır. Vergi mevzuatı çekleri reeskonta tabi tutmasa da Türkiye Muhasebe Standartları açısından çekler için reeskont uygulaması benimsenmiş, hesaplanan reeskont 2.400 TL olmuştur. (101 hesabı düzeltici alt hesapla izlenmektedir; bu uygulamada düzeltici düzenleyici amaca yönelik olarak 122 alt hesabı kullanılmıştır.)$ml$, $ml$İhtiyari reeskontta çekler için de düzeltici hesap kullanılır.$ml$, $ml$657 Reeskont Faiz Giderleri 2.400 TL borç. Çek değerini bugünkü değere indirgemek üzere 122 Alacak Senetleri Reeskontu (Çek alt hesabı) 2.400 TL alacak. Ertesi yıl başında ters kayıt ile iptal edilecektir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-10', 1, '657', 2400, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-10', 2, '122', 0, 2400);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-11', 'reeskont', $ml$Karma Açılış: Reeskont İptali ve Yeni Senet Tahsilatı$ml$, 'zor', $ml$Yeni yılın başında işletme önce geçen yılın 6.000 TL'lik alacak senetleri reeskont kaydını iptal etmiş; ardından aynı gün 50.000 TL nominal değerli alacak senedini vadesinde banka aracılığıyla tahsil etmiştir.$ml$, $ml$Önce reeskont iptali; ardından senet tahsilatı.$ml$, $ml$Reeskont iptali: 122 Alacak Senetleri Reeskontu 6.000 TL borç; 647 Reeskont Faiz Gelirleri 6.000 TL alacak. Tahsilat: 102 Bankalar 50.000 TL borç; 121 Alacak Senetleri 50.000 TL alacak. Senet kapanmış, reeskont kalıntısı sıfırlanmıştır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-11', 1, '122', 6000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-11', 2, '647', 0, 6000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-11', 3, '102', 50000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-11', 4, '121', 0, 50000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('reeskont-ek-12', 'reeskont', $ml$Karma Açılış: Borç Reeskont İptali + Senet Ödemesi$ml$, 'zor', $ml$Yeni yıl başında: 1) Önceki yılın 4.500 TL'lik borç senedi reeskontu ters çevrilerek iptal edilmiştir, 2) Aynı gün 30.000 TL nominal değerli borç senedi vadesinde bankadan ödenmiştir.$ml$, $ml$Reeskont iptali kaydı + senet ödeme kaydı.$ml$, $ml$Reeskont iptali: 657 Reeskont Faiz Giderleri 4.500 TL borç; 322 Borç Senetleri Reeskontu 4.500 TL alacak. Senet ödeme: 321 Borç Senetleri 30.000 TL borç; 102 Bankalar 30.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'reeskont-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-12', 1, '657', 4500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-12', 2, '322', 0, 4500);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-12', 3, '321', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('reeskont-ek-12', 4, '102', 0, 30000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-1', 'senet', $ml$Müşteriden Alacak Senedi Alma$ml$, 'kolay', $ml$Alıcılar hesabında 18.000 TL borcu görünen müşteriden, borcu karşılamak üzere 3 ay vadeli alacak senedi alınmıştır.$ml$, $ml$Alacak senedi alacak hesabını kapatmaz; sadece şeklini değiştirir.$ml$, $ml$Senetli alacak doğduğu için 121 Alacak Senetleri 18.000 TL borçlanır. Aynı tutarda 120 Alıcılar hesabı 18.000 TL alacaklanır. Tahsilat aracı değişmiş; toplam alacak değişmemiştir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-1', 1, '121', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-1', 2, '120', 0, 18000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-2', 'senet', $ml$Tedarikçiye Borç Senedi Verme$ml$, 'kolay', $ml$Satıcılar hesabında 22.500 TL borcu olan işletme, satıcının talebi üzerine 60 gün vadeli borç senedi düzenleyerek vermiştir. Borç şekil değiştirmiş, tutar aynı kalmıştır.$ml$, $ml$Satıcı borcu kapanır; borç senedi yükümlülüğü doğar.$ml$, $ml$Satıcı cari borcu kapatıldığı için 320 Satıcılar 22.500 TL borç. Senetli borç oluştuğu için 321 Borç Senetleri 22.500 TL alacak. Yükümlülüğün şekli değişmiş, tutarı aynı kalmıştır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-2', 1, '320', 22500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-2', 2, '321', 0, 22500);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-3', 'senet', $ml$Vadesi Gelen Alacak Senedinin Tahsili$ml$, 'kolay', $ml$Vadesi dolan 15.000 TL'lik alacak senedi, müşteri tarafından işletmenin Garanti BBVA hesabına havale yoluyla ödenmiştir. Banka dekontu işletmeye ulaşmıştır.$ml$, $ml$Senet kapanır; banka borç.$ml$, $ml$Banka mevduatı arttığı için 102 Bankalar 15.000 TL borçlanır. Vadesinde tahsil edildiği için 121 Alacak Senetleri 15.000 TL alacaklanarak kapanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-3', 1, '102', 15000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-3', 2, '121', 0, 15000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-4', 'senet', $ml$Vadesi Gelen Borç Senedinin Ödenmesi$ml$, 'kolay', $ml$Tedarikçiye düzenlenen 28.000 TL'lik borç senedinin vadesi gelmiştir. İşletme, ödemeyi banka havalesi ile yapmıştır.$ml$, $ml$Senet borç hesabı kapanır; banka alacak.$ml$, $ml$Vadesi dolan senet ödendiği için 321 Borç Senetleri 28.000 TL borç olarak kapanır. Banka mevduatından çıkış yapıldığı için 102 Bankalar 28.000 TL alacaklanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-4', 1, '321', 28000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-4', 2, '102', 0, 28000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-5', 'senet', $ml$Müşteriden Vadeli Çek Alma$ml$, 'kolay', $ml$Alıcılar hesabında 35.000 TL borcu olan müşteri, borcuna karşılık 45 gün vadeli müşteri çeki vermiştir. Çek henüz tahsil edilmemiş, kasada bekletilmektedir.$ml$, $ml$Alınan çek hazır değer grubunda izlenir.$ml$, $ml$Alınan çek 101 Alınan Çekler hesabında 35.000 TL borç. Müşteri borcu kapatıldığı için 120 Alıcılar 35.000 TL alacak. Alınan çekler portföye girene kadar 101'de takip edilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-5', 1, '101', 35000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-5', 2, '120', 0, 35000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-6', 'senet', $ml$Tedarikçiye Çek Düzenleme (Verilen Çek)$ml$, 'orta', $ml$Satıcılar hesabında 40.000 TL borcu olan işletme, ödeme için 30 gün vadeli kendi keşide ettiği çeki tedarikçiye vermiştir. Çek henüz bankada tahsile sunulmamıştır.$ml$, $ml$103 Verilen Çekler ve Ödeme Emirleri pasif düzenleyici hesaptır.$ml$, $ml$Satıcı borcu kapatıldığı için 320 Satıcılar 40.000 TL borç. Verilen çek 103 Verilen Çekler ve Ödeme Emirleri 40.000 TL alacak. Çek tahsil edildiğinde 103 hesabı 102 Bankalar ile mahsuplanacaktır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-6', 1, '320', 40000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-6', 2, '103', 0, 40000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-7', 'senet', $ml$Verilen Çekin Bankadan Tahsili$ml$, 'orta', $ml$Daha önce tedarikçiye verilen 40.000 TL'lik çek vade tarihinde bankaya ibraz edilmiş; bankadaki yeterli bakiyeden tahsil edilmiştir. Banka, hesabımızdan tutarı çekmiş ve dekont göndermiştir.$ml$, $ml$Verilen Çekler hesabı kapanır; banka alacak.$ml$, $ml$Çek bankadan tahsil edilince 103 Verilen Çekler ve Ödeme Emirleri 40.000 TL borç olarak kapanır. Banka mevduatı azaldığı için 102 Bankalar 40.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-7', 1, '103', 40000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-7', 2, '102', 0, 40000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-8', 'senet', $ml$Alınan Çekin Tedarikçiye Cirosu$ml$, 'orta', $ml$Müşteriden alınan 30.000 TL'lik çek, satıcılar hesabında 30.000 TL borç görünen tedarikçiye ciro yoluyla devredilmiştir. Ödeme bu çekle yapılmıştır.$ml$, $ml$Alınan çek elden çıkar; satıcı borcu kapanır.$ml$, $ml$Satıcı borcu kapatıldığı için 320 Satıcılar 30.000 TL borç. Çek elden çıkarıldığı için 101 Alınan Çekler 30.000 TL alacak. Ödeme aracı bilanço dışına çıkmış olur.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-8', 1, '320', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-8', 2, '101', 0, 30000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-9', 'senet', $ml$Alacak Senedinin Bankaya Tahsile Verilmesi$ml$, 'orta', $ml$Vadesi 5 gün sonra dolacak 22.000 TL tutarındaki alacak senedi, tahsilat takibi için Akbank'a tahsile verilmiştir. Senet bankaya teslim edilmiş; tahsilatı henüz gerçekleşmemiştir. (İşletme tahsile verilen senetleri 121'in alt hesabı olarak izlemektedir.)$ml$, $ml$Senedin yardımcı hesap içinde yeri değişir; tahsilat öncesi ana hesap aynı kalır.$ml$, $ml$Yardımcı hesap düzeyinde 121 Alacak Senetleri (Tahsildeki Senetler) 22.000 TL borç; 121 Alacak Senetleri (Portföydeki Senetler) 22.000 TL alacak yazılır. Senet tahsil edildiğinde 102 Bankalar borç, 121 Tahsildeki Senetler alacak ile kayıt tamamlanacaktır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-9', 1, '121', 22000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-9', 2, '121', 0, 22000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-10', 'senet', $ml$Senedin Bankaca Tahsil Edilmesi (Komisyonlu)$ml$, 'orta', $ml$Bankaya tahsile verilen 22.000 TL'lik alacak senedinin vadesi dolmuş, banka tutarı tahsil etmiş ve %0,5 (110 TL) tahsilat komisyonu kesip kalan 21.890 TL'yi vadesiz hesaba yansıtmıştır.$ml$, $ml$Banka net tutarla; komisyon gider; senet tahsildeki alt hesabı kapanır.$ml$, $ml$Net banka geliri 102 Bankalar 21.890 TL borç; banka komisyonu 653 Komisyon Giderleri 110 TL borç; tahsil edilen senet 121 Alacak Senetleri (Tahsildeki) 22.000 TL alacak ile kapanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-10', 1, '102', 21890, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-10', 2, '653', 110, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-10', 3, '121', 0, 22000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-11', 'senet', $ml$Karşılıksız Çıkan Müşteri Çeki$ml$, 'zor', $ml$Bir önceki ay alınmış ve 101 Alınan Çekler'de 18.000 TL olarak izlenen müşteri çeki, bankaya ibraz edildiğinde karşılıksız çıkmıştır. İşletme alacağını yeniden alıcı cari hesabına aktararak takibe almıştır.$ml$, $ml$Çek bilanço içinde kalır mı kalmaz mı? Karşılıksızda alıcılara aktarılır.$ml$, $ml$Karşılıksız çek nakde dönmediği için tekrar müşteri alacağı haline gelir: 120 Alıcılar 18.000 TL borç. Bankada tahsil edilemediği için 101 Alınan Çekler 18.000 TL alacak yazılarak kapatılır. Şüpheli alacak değerlendirmesi sonraki dönem yapılabilir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-11', 1, '120', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-11', 2, '101', 0, 18000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('senet-ek-12', 'senet', $ml$Alacak Senedinin Bankaya İskonto Ettirilmesi$ml$, 'zor', $ml$İşletme nakit ihtiyacı sebebiyle 60.000 TL'lik alacak senedini vadesinden 60 gün önce Yapı Kredi'ye iskonto ettirmiştir. Banka 1.500 TL faiz (iskonto) ve 200 TL komisyon kesip net 58.300 TL'yi vadesiz hesaba yansıtmıştır.$ml$, $ml$Senet portföyden çıkar; iskonto faiz gideridir; komisyon ayrı.$ml$, $ml$102 Bankalar 58.300 TL borç. İskonto faizi 660 Kısa Vadeli Borçlanma Giderleri 1.500 TL borç. Banka komisyonu 653 Komisyon Giderleri 200 TL borç. Senet tamamen elden çıkar: 121 Alacak Senetleri 60.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'senet-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-12', 1, '102', 58300, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-12', 2, '660', 1500, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-12', 3, '653', 200, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('senet-ek-12', 4, '121', 0, 60000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-1', 'supheli-alacaklar', $ml$Vadesi Geçmiş Alacağın Şüpheli Hale Gelmesi$ml$, 'kolay', $ml$Alıcılar hesabında 25.000 TL borcu olan bir müşterinin alacağı vadesinden 6 ay geçmiş, müşteri ile iletişim kurulamamış ve dava aşamasına gelmiştir. İşletme bu alacağı şüpheli ticari alacağa aktarmaktadır.$ml$, $ml$120'den 128'e aktarım; 128 borç, 120 alacak.$ml$, $ml$Alacak şüpheli sınıfına geçtiği için 128 Şüpheli Ticari Alacaklar 25.000 TL borç. Normal alıcı kaydı kapanır: 120 Alıcılar 25.000 TL alacak. Bu adımda henüz karşılık ayrılmamıştır; o ayrı bir kayıt gerektirir.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-1';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-1', 1, '128', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-1', 2, '120', 0, 25000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-2', 'supheli-alacaklar', $ml$Şüpheli Alacağa Karşılık Ayırma$ml$, 'kolay', $ml$128 Şüpheli Ticari Alacaklar'da bulunan 25.000 TL'lik alacak için tahsil edilemeyebilir riskine karşın aynı tutarda karşılık ayrılması kararlaştırılmıştır.$ml$, $ml$Karşılık gideri + karşılık hesabı.$ml$, $ml$Karşılık tutarı dönem gideridir: 654 Karşılık Giderleri 25.000 TL borç. Düzenleyici aktif hesap olarak 129 Şüpheli Ticari Alacaklar Karşılığı 25.000 TL alacak. Karşılık gerçek tahsilattan bağımsız olarak risk için ayrılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-2';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-2', 1, '654', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-2', 2, '129', 0, 25000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-3', 'supheli-alacaklar', $ml$Şüpheli Alacağa Karşılık (Tek İşlemde Birleşik)$ml$, 'orta', $ml$120 Alıcılar'da 40.000 TL borcu olan müşterinin alacağı dava açılarak şüpheliye çevrilmiş ve aynı yevmiyede tam karşılık ayrılmıştır. (İki kayıt aynı yevmiyede gösterilebilir.)$ml$, $ml$Hem 120→128 aktarımı hem 654→129 karşılığı.$ml$, $ml$Aktarım: 128 Şüpheli Ticari Alacaklar 40.000 TL borç; 120 Alıcılar 40.000 TL alacak. Karşılık: 654 Karşılık Giderleri 40.000 TL borç; 129 Şüpheli Ticari Alacaklar Karşılığı 40.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-3';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-3', 1, '128', 40000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-3', 2, '120', 0, 40000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-3', 3, '654', 40000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-3', 4, '129', 0, 40000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-4', 'supheli-alacaklar', $ml$Şüpheli Alacağın Tahsil Edilmesi (Tam)$ml$, 'orta', $ml$Önceden şüpheli sınıfına aktarılmış 128 Şüpheli Ticari Alacaklar'daki 25.000 TL'lik alacak, müşteri ile uzlaşılarak tamamen banka havalesi ile tahsil edilmiştir. Daha önce 129'da ayrılan 25.000 TL'lik karşılık de konusuz kalacaktır.$ml$, $ml$Hem tahsilat hem karşılık iadesi yapılır.$ml$, $ml$Tahsilat: 102 Bankalar 25.000 TL borç; 128 Şüpheli Ticari Alacaklar 25.000 TL alacak. Karşılığın iadesi: 129 Şüpheli Ticari Alacaklar Karşılığı 25.000 TL borç; 644 Konusu Kalmayan Karşılıklar 25.000 TL alacak (gelir).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-4';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-4', 1, '102', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-4', 2, '128', 0, 25000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-4', 3, '129', 25000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-4', 4, '644', 0, 25000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-5', 'supheli-alacaklar', $ml$Şüpheli Alacağın Kısmi Tahsili$ml$, 'orta', $ml$128 Şüpheli Ticari Alacaklar'da 30.000 TL'lik alacak yer almakta, 129 Karşılığı'nda 30.000 TL ayrılmıştır. Müşteri ile yapılan görüşme sonucu 18.000 TL banka havalesi ile tahsil edilmiş; kalan 12.000 TL'lik kısım hala şüpheli olarak izlenmeye devam etmektedir. Kısmi tahsilatla ilgili olarak ayrılan karşılık tutarı da kısmen iade edilecektir.$ml$, $ml$Tahsilat oranında karşılık iadesi yapılır; geri kalan şüpheli kalır.$ml$, $ml$Tahsilat: 102 Bankalar 18.000 TL borç; 128 Şüpheli Ticari Alacaklar 18.000 TL alacak. Tahsil edilen orana isabet eden karşılık iadesi: 129 Şüpheli Ticari Alacaklar Karşılığı 18.000 TL borç; 644 Konusu Kalmayan Karşılıklar 18.000 TL alacak. Kalan 12.000 TL hem 128'de hem 129'da takip edilmeye devam eder.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-5';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-5', 1, '102', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-5', 2, '128', 0, 18000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-5', 3, '129', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-5', 4, '644', 0, 18000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-6', 'supheli-alacaklar', $ml$Karşılık Ayrılmamış Alacağın Tahsili$ml$, 'orta', $ml$Daha önce 128 Şüpheli Ticari Alacaklar'a aktarılmış ancak ihtiyatlılık nedeniyle karşılık ayrılmamış 12.000 TL'lik alacak, müşteri ile uzlaşma sağlanması üzerine peşin (banka) tahsil edilmiştir.$ml$, $ml$Karşılık olmadığı için yalnızca tahsilat ve 128 kapanışı yapılır.$ml$, $ml$Banka mevduatı arttığı için 102 Bankalar 12.000 TL borç. 128 Şüpheli Ticari Alacaklar 12.000 TL alacak ile kapanır. Karşılık ayrılmadığı için 129 ve 644 hesapları kullanılmaz.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-6';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-6', 1, '102', 12000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-6', 2, '128', 0, 12000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-7', 'supheli-alacaklar', $ml$Değersiz Alacak (Karşılık Ayrılmış)$ml$, 'orta', $ml$128 Şüpheli Ticari Alacaklar'da 50.000 TL'lik alacak ve 129'da 50.000 TL karşılık bulunmaktadır. Mahkeme kararı kesinleşmiş, alacak değersiz hale gelmiştir. Bilanço dışı çıkarılacaktır.$ml$, $ml$Karşılık zaten ayrılmış olduğu için sadece kapanış kayıtları yapılır.$ml$, $ml$Karşılık zaten ayrıldığı için ek gider doğmaz: 129 Şüpheli Ticari Alacaklar Karşılığı 50.000 TL borç. 128 Şüpheli Ticari Alacaklar 50.000 TL alacak (kapanış). Sonuçta hem alacak hem karşılık birlikte kapanmıştır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-7';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-7', 1, '129', 50000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-7', 2, '128', 0, 50000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-8', 'supheli-alacaklar', $ml$Değersiz Alacak (Karşılık Ayrılmamış)$ml$, 'orta', $ml$128 Şüpheli Ticari Alacaklar'da 8.000 TL'lik alacak yer almakta, daha önce karşılık ayrılmamıştır. Mahkeme kararı kesinleşmiş ve alacak değersiz hale gelmiştir. Tahsil edilemeyen tutar olağan gider olarak yazılacaktır.$ml$, $ml$Karşılık olmayan değersiz alacak doğrudan gider yazılır.$ml$, $ml$Karşılık olmadığı için tahsil edilemeyen tutar doğrudan gider yazılır: 659 Diğer Olağan Gider ve Zararlar 8.000 TL borç. 128 Şüpheli Ticari Alacaklar 8.000 TL alacak ile kapanır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-8';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-8', 1, '659', 8000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-8', 2, '128', 0, 8000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-9', 'supheli-alacaklar', $ml$Şüpheli Alacak Senedi (Senedin Şüpheliye Aktarımı)$ml$, 'orta', $ml$Vadesi geçmiş ve protesto edilmiş 18.000 TL'lik alacak senedi tahsil edilemeyeceği anlaşılarak 121 Alacak Senetleri'nden 128 Şüpheli Ticari Alacaklar'a aktarılmaktadır.$ml$, $ml$Senet de ticari alacaktır; şüpheli sınıfına aktarılır.$ml$, $ml$Şüpheli sınıfına geçen alacak için 128 Şüpheli Ticari Alacaklar 18.000 TL borç. Senet kayıttan düştüğü için 121 Alacak Senetleri 18.000 TL alacak. Karşılık daha sonra ayrılır.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-9';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-9', 1, '128', 18000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-9', 2, '121', 0, 18000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-10', 'supheli-alacaklar', $ml$Önce Karşılık Ayrılan Sonra Tahsil Edilen (Geçmiş Yıl Geliri)$ml$, 'zor', $ml$Geçmiş yıllarda 128 Şüpheli Alacaklar'a aktarılan ve 129'a tam karşılık ayrılan 35.000 TL'lik alacak, bu yıl müşterinin uzlaşma kabulü ile peşin (banka) tahsil edilmiştir. Karşılık gideri geçmiş yıllarda yazıldığı için bu yıl karşılık iadesi gelir niteliğindedir.$ml$, $ml$Tahsilat + karşılık iadesi (gelir).$ml$, $ml$Tahsilat: 102 Bankalar 35.000 TL borç; 128 Şüpheli Ticari Alacaklar 35.000 TL alacak (kapanış). Karşılık iadesi: 129 Şüpheli Ticari Alacaklar Karşılığı 35.000 TL borç; 644 Konusu Kalmayan Karşılıklar 35.000 TL alacak (cari yıl olağan gelir).$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-10';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-10', 1, '102', 35000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-10', 2, '128', 0, 35000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-10', 3, '129', 35000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-10', 4, '644', 0, 35000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-11', 'supheli-alacaklar', $ml$Şüpheli Alacak ve Kısmi Karşılık$ml$, 'zor', $ml$İşletme, 128 Şüpheli Ticari Alacaklar'da 60.000 TL bulunduran müşteriye karşı tahsil ihtimalini %60 olarak değerlendirmiş ve sadece 24.000 TL (60.000 × %40) karşılık ayırmaya karar vermiştir.$ml$, $ml$Karşılık tutarı tahsil edilemeyeceği düşünülen kısma göre ayrılır.$ml$, $ml$Tahsil edilemeyeceği değerlendirilen pay kadar karşılık: 654 Karşılık Giderleri 24.000 TL borç. 129 Şüpheli Ticari Alacaklar Karşılığı 24.000 TL alacak. Kalan 36.000 TL'lik tahsil edilebilir kısım için karşılık ayrılmaz; tahsilatları karşılık iadesi gerektirmez.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-11';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-11', 1, '654', 24000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-11', 2, '129', 0, 24000);

insert into sorular (id, unite_id, baslik, zorluk, senaryo, ipucu, aciklama, belgeler, durum, kaynak, yayinlanma_tarihi) values
  ('supheli-alacaklar-ek-12', 'supheli-alacaklar', $ml$Karma: Tahsilat + Kalan Değersiz Alacak$ml$, 'zor', $ml$128 Şüpheli Ticari Alacaklar'da 80.000 TL bulunmakta ve 129'da 80.000 TL tam karşılık ayrılmıştı. Mahkeme uzlaşması sonucunda 30.000 TL banka havalesi ile tahsil edilmiş; kalan 50.000 TL'nin ise tahsil edilemeyeceği kesinleşmiş ve değersiz alacak olarak yazılmıştır. Karşılığın tahsil edilen kısmı geri çevrilmiş, kalan kısmı değersiz alacakla mahsuplaşmıştır.$ml$, $ml$Tahsilat + karşılık iadesi + değersiz alacakla karşılığın mahsuplaşması.$ml$, $ml$Tahsilat: 102 Bankalar 30.000 TL borç; 128 Şüpheli Ticari Alacaklar 30.000 TL alacak. Karşılığın 30.000 TL'si gelir: 129 Şüpheli Ticari Alacaklar Karşılığı 30.000 TL borç; 644 Konusu Kalmayan Karşılıklar 30.000 TL alacak. Kalan değersiz: 129 Şüpheli Ticari Alacaklar Karşılığı 50.000 TL borç; 128 Şüpheli Ticari Alacaklar 50.000 TL alacak.$ml$, $ml$[]$ml$::jsonb, 'onayli', 'ai', now())
  on conflict (id) do update set
    unite_id = excluded.unite_id,
    baslik = excluded.baslik,
    zorluk = excluded.zorluk,
    senaryo = excluded.senaryo,
    ipucu = excluded.ipucu,
    aciklama = excluded.aciklama,
    durum = excluded.durum;

delete from cozumler where soru_id = 'supheli-alacaklar-ek-12';
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-12', 1, '102', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-12', 2, '128', 0, 30000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-12', 3, '129', 30000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-12', 4, '644', 0, 30000);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-12', 5, '129', 50000, 0);
insert into cozumler (soru_id, sira, kod, borc, alacak) values ('supheli-alacaklar-ek-12', 6, '128', 0, 50000);

commit;
