-- =====================================================================
-- 11 → 15 Ünite Restructure
-- =====================================================================
-- Yevmiye_Kayit_Mufredati.docx'a göre yeni ünite yapısı.
--
-- Eski yapı (11): kasa, banka, mal, senet, kdv, amortisman, personel,
--                  donem-sonu, supheli-alacaklar, reeskont, kambiyo
--
-- Yeni yapı (15):
--   1. acilis                — Muhasebenin Temel Mantığı ve Açılış Kayıtları
--   2. hazir-degerler        — Hazır Değerler (kasa+banka+çek)
--   3. mal-alis              — Mal Alış İşlemleri ve Stok Hareketleri
--   4. mal-satis             — Mal Satış İşlemleri
--   5. ticari-alacaklar      — Ticari Alacaklar Yönetimi
--   6. ticari-borclar        — Ticari Borçlar ve Tedarikçi İlişkileri
--   7. kdv                   — KDV İşlemleri
--   8. personel              — Personel ve Ücret Bordrosu
--   9. mdv                   — Maddi Duran Varlık Alış-Satış
--  10. amortisman            — Amortisman Kayıtları
--  11. reeskont-karsilik     — Reeskont ve Karşılık İşlemleri
--  12. stok-degerleme        — Stok Değerleme ve Dönem Sonu Stok
--  13. yabanci-kaynaklar     — Krediler ve Mali Borçlar
--  14. gelir-tablosu         — Gelir Tablosu Hesapları
--  15. donem-sonu-kapanis    — Dönem Sonu Kapanış ve Açılış
--
-- Soru re-kategorilemesi keyword bazlı yapılır:
--   - mal → alış kelimeleri varsa mal-alis, satış kelimeleri varsa mal-satis
--   - senet → borç/verilen → ticari-borclar, else ticari-alacaklar
--   - amortisman → amortisman ayırma keyword'u → amortisman, else mdv
--   - donem-sonu → reeskont/envanter/kapanış üçlü split
--   - supheli-alacaklar → çoğu reeskont-karsilik (karşılık kayıtları)
--   - kambiyo → yabanci-kaynaklar (default)
--
-- Edge case'ler için admin panelden manuel düzeltme gerekebilir.
-- =====================================================================

begin;

-- =====================================================================
-- 1. Yeni üniteleri ekle (12 yeni; kdv, personel, amortisman re-used)
-- =====================================================================

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('acilis', $ml$Muhasebenin Temel Mantığı ve Açılış Kayıtları$ml$, $ml$Yevmiye defterine giriş, çift taraflı kayıt sistemi, açılış bilançosundan açılış yevmiye kaydının çıkarılması, mizan ve büyük defter ilişkisi$ml$, 'rocket', 1)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('hazir-degerler', $ml$Hazır Değerler (Kasa, Banka, Çekler)$ml$, $ml$100, 101, 102, 103, 108 hesapları — günlük tahsilat ve ödemeler, kasa fazla/noksanı, dövizli kasa-banka$ml$, 'hazir-degerler', 2)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('mal-alis', $ml$Mal Alış İşlemleri ve Stok Hareketleri$ml$, $ml$153 Ticari Mallar, KDV ile alış kaydı, peşin/vadeli/senetli alış, alış iadeleri ve iskontolar, navlun ve sigorta$ml$, 'mal-alis', 3)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('mal-satis', $ml$Mal Satış İşlemleri$ml$, $ml$600 Yurt İçi Satışlar, 391 Hesaplanan KDV, peşin-vadeli-senetli satış, satıştan iadeler ve iskontolar, sürekli/aralıklı envanter$ml$, 'mal-satis', 4)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('ticari-alacaklar', $ml$Ticari Alacaklar Yönetimi$ml$, $ml$120 Alıcılar ve 121 Alacak Senetleri yönetimi, ciro/protesto/iskonto, depozito ve teminatlar, şüpheli alacak takibi$ml$, 'ticari-alacaklar', 5)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('ticari-borclar', $ml$Ticari Borçlar ve Tedarikçi İlişkileri$ml$, $ml$320 Satıcılar ve 321 Borç Senetleri, erken ödeme iskontosu, vade farkı, çek-bono ile ödeme, dövizli borçlar$ml$, 'ticari-borclar', 6)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

-- kdv: meta güncelleme (id reused)
update unites set
  ad = $ml$KDV İşlemleri ve Aylık KDV Tahakkuku$ml$,
  aciklama = $ml$191 İndirilecek KDV - 391 Hesaplanan KDV mahsubu, 190 Devreden KDV, 360 Ödenecek KDV, KDV tevkifatı, ihracat istisnası$ml$,
  thiings_icon = 'kdv',
  sira = 7
where id = 'kdv';

-- personel: meta güncelleme (id reused)
update unites set
  ad = $ml$Personel ve Ücret Bordrosu Kayıtları$ml$,
  aciklama = $ml$770/720 işçilik giderleri, 335 net ücret, 360 stopaj-damga, 361 SGK primleri, avans mahsubu, kıdem tazminatı$ml$,
  thiings_icon = 'personel',
  sira = 8
where id = 'personel';

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('mdv', $ml$Maddi Duran Varlık Alış ve Satışları$ml$, $ml$253 Tesis-Makine, 254 Taşıtlar, 255 Demirbaşlar — alım maliyeti, peşin/vadeli/kredili kayıt, MDV satışı ve elden çıkarma, binek otomobil özel durumu$ml$, 'mdv', 9)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

-- amortisman: meta güncelleme (id reused, kapsam daralacak)
update unites set
  ad = $ml$Amortisman Kayıtları$ml$,
  aciklama = $ml$257 Birikmiş Amortismanlar, normal ve azalan bakiyeler yöntemi, kıst amortisman, 770/730/760 dağıtımı, yenileme fonu (549)$ml$,
  thiings_icon = 'amortisman',
  sira = 10
where id = 'amortisman';

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('reeskont-karsilik', $ml$Reeskont ve Karşılık İşlemleri$ml$, $ml$Dönem sonu değerleme: 122/322 reeskont, 657/647 reeskont gelir-gider, 129 şüpheli karşılığı, 158 stok değer düşüklüğü, 372/472 kıdem karşılığı$ml$, 'reeskont-karsilik', 11)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('stok-degerleme', $ml$Stok Değerleme ve Dönem Sonu Stok İşlemleri$ml$, $ml$Aralıklı/sürekli envanter, FIFO ve ağırlıklı ortalama, 153/150/151/152, 197/397 sayım fark, konsinye-yoldaki mal (159)$ml$, 'stok-degerleme', 12)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('yabanci-kaynaklar', $ml$Yabancı Kaynaklar: Krediler ve Mali Borçlar$ml$, $ml$300/400 banka kredileri, 780 finansman giderleri, anapara-faiz ayrımı, 381 gider tahakkukları, leasing borçları, kur farkı (646/656)$ml$, 'yabanci-kaynaklar', 13)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('gelir-tablosu', $ml$Gelir Tablosu Hesapları ve Diğer Faaliyet Sonuçları$ml$, $ml$60-69 hesap grubu, olağan/olağandışı gelir-gider, 640/642/645/646/653/656/679/689, fonksiyonel dağıtım ve yansıtma$ml$, 'gelir-tablosu', 14)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('donem-sonu-kapanis', $ml$Dönem Sonu Kapanış ve Açılış Kayıtları$ml$, $ml$690/691/692/370 dönem karı tespiti, 590/591 net kar-zarar, yansıtma kapatma, kapanış yevmiye kaydı, kar dağıtımı$ml$, 'donem-sonu-kapanis', 15)
  on conflict (id) do update set
    ad = excluded.ad, aciklama = excluded.aciklama, thiings_icon = excluded.thiings_icon, sira = excluded.sira;

-- =====================================================================
-- 2. Soruları yeni ünitelere taşı (keyword bazlı split)
-- =====================================================================

-- 2a. kasa + banka → hazir-degerler
update sorular set unite_id = 'hazir-degerler'
where unite_id in ('kasa', 'banka');

-- 2b. mal → mal-alis / mal-satis
-- Satış göstergeleri: "satış", "satıldı", "sattı", "müşteri", "satıştan iade",
-- "perakende satış", "Z raporu", "600 yurt içi" (KDV satış kayıtları)
update sorular set unite_id = case
  when (
    baslik ilike '%satış%' or baslik ilike '%satıl%' or baslik ilike '%sattı%'
    or baslik ilike '%müşteri%' or baslik ilike '%perakende%' or baslik ilike '%z raporu%'
    or senaryo ilike '%600 yurt içi%' or senaryo ilike '%satış faturası%'
    or senaryo ilike '%391 hesaplanan%'
  ) and not (
    -- "satışlardan iade" gibi tedarikçiye iade kayıtları alış tarafına dönsün:
    baslik ilike '%satıcıya iade%' or baslik ilike '%alıştan iade%'
  )
  then 'mal-satis'
  else 'mal-alis'
end
where unite_id = 'mal';

-- 2c. senet → ticari-alacaklar / ticari-borclar
-- Borç göstergeleri: "borç senedi", "verilen senet", "satıcıya", "321", "320", "bono kestik"
update sorular set unite_id = case
  when (
    baslik ilike '%borç senedi%' or baslik ilike '%verilen senet%'
    or baslik ilike '%satıcıya%' or baslik ilike '%bono kes%'
    or senaryo ilike '%321 borç senet%' or senaryo ilike '%bono düzenle%'
    or senaryo ilike '%satıcıya verilen%'
  )
  then 'ticari-borclar'
  else 'ticari-alacaklar'
end
where unite_id = 'senet';

-- 2d. kdv → kdv (no-op, id korundu)
-- 2e. personel → personel (no-op)

-- 2f. amortisman → amortisman / mdv
-- Amortisman ayırma göstergeleri: "amortisman", "yıllık amortisman", "azalan bakiyeler", "kıst", "257"
-- MDV göstergeleri: alım/satım/elden çıkarma
update sorular set unite_id = case
  when (
    baslik ilike '%amortisman%' or senaryo ilike '%amortisman ayır%'
    or senaryo ilike '%azalan bakiye%' or senaryo ilike '%257 birikmiş%'
    or baslik ilike '%kıst%' or senaryo ilike '%yıpranma%'
  )
  then 'amortisman'
  else 'mdv'
end
where unite_id = 'amortisman';

-- 2g. donem-sonu → reeskont-karsilik / stok-degerleme / donem-sonu-kapanis
update sorular set unite_id = case
  when (
    baslik ilike '%reeskont%' or senaryo ilike '%reeskont%'
    or senaryo ilike '%122 alacak senet%' or senaryo ilike '%322 borç senet%'
  )
  then 'reeskont-karsilik'
  when (
    baslik ilike '%stok%' or baslik ilike '%envanter%'
    or senaryo ilike '%dönem sonu stok%' or senaryo ilike '%satılan ticari mallar maliyet%'
    or senaryo ilike '%621 satılan%' or senaryo ilike '%fiziki sayım%'
    or baslik ilike '%FIFO%' or baslik ilike '%ortalama maliyet%'
  )
  then 'stok-degerleme'
  else 'donem-sonu-kapanis'
end
where unite_id = 'donem-sonu';

-- 2h. supheli-alacaklar → reeskont-karsilik (çoğu karşılık kaydı)
-- Saf alacak takibi (128'e transfer) için kontrol: "şüpheli alacak hale gel" + karşılık yok
update sorular set unite_id = case
  when (
    baslik ilike '%128%' and not (
      baslik ilike '%karşılık%' or baslik ilike '%129%' or senaryo ilike '%654 karşılık%'
    )
  )
  then 'ticari-alacaklar'
  else 'reeskont-karsilik'
end
where unite_id = 'supheli-alacaklar';

-- 2i. reeskont → reeskont-karsilik
update sorular set unite_id = 'reeskont-karsilik'
where unite_id = 'reeskont';

-- 2j. kambiyo → yabanci-kaynaklar (dövizli kasa/banka olanlar hazir-degerler'e gitsin)
update sorular set unite_id = case
  when (
    baslik ilike '%dövizli kasa%' or baslik ilike '%dövizli banka%'
    or senaryo ilike '%102 banka%dövizli%' or senaryo ilike '%100 kasa%dövizli%'
  )
  then 'hazir-degerler'
  else 'yabanci-kaynaklar'
end
where unite_id = 'kambiyo';

-- =====================================================================
-- 3. Eski (artık referans edilmeyen) üniteleri sil
-- =====================================================================

delete from unites
where id in ('kasa', 'banka', 'mal', 'senet', 'donem-sonu', 'supheli-alacaklar', 'reeskont', 'kambiyo');

-- =====================================================================
-- 4. Sanity check — beklenen 15 ünite var mı?
-- =====================================================================
do $$
declare
  unite_sayisi int;
  yetim_soru int;
begin
  select count(*) into unite_sayisi from unites;
  if unite_sayisi <> 15 then
    raise exception 'Beklenen 15 ünite, mevcut: %', unite_sayisi;
  end if;

  select count(*) into yetim_soru
  from sorular s
  where not exists (select 1 from unites u where u.id = s.unite_id);
  if yetim_soru > 0 then
    raise exception 'Yeni yapıya bağlanmamış % soru var', yetim_soru;
  end if;
end$$;

commit;
