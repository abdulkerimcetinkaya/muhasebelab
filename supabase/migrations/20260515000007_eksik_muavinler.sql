-- Modül 1 — Bolüm 2 için eksik muavinler
--
-- Modul_1_Bolum_2.docx 60 yeni soru içeriyor. Bu sorular mevcut muavin
-- havuzunda olmayan birkaç hesap kullanıyor. Bu migration eksiklikleri
-- ekler. PR-B'de 60 soru bu muavinlere bağlanacak.

begin;

insert into muavin_hesaplar (kod, ana_kod, ad, tip, sira) values
  -- 340 Alınan Sipariş Avansları — Akel için yeni muavin (Soru 48)
  ('340.004', '340', 'Akel Elektronik Ltd. Şti.', 'musteri', 4),

  -- 610 Satıştan İadeler — eksik mal cinsleri (mal cinsi bazlı, 153 ile aynı sıra)
  ('610.004', '610', 'Klima İadesi', 'diger', 4),
  ('610.005', '610', 'Kurutma Makinesi İadesi', 'diger', 5),
  ('610.006', '610', 'Bulaşık Makinesi İadesi', 'diger', 6),
  ('610.007', '610', 'Fırın İadesi', 'diger', 7),

  -- 128 Şüpheli Ticari Alacaklar (Soru 5 — Demirören)
  ('128.001', '128', 'Demirören Elektronik A.Ş.', 'musteri', 1),

  -- 158 Stok Değer Düşüklüğü Karşılığı (Soru 54 — konsinye klima)
  ('158.001', '158', 'Konsinye Klima Değer Düşüklüğü', 'stok', 1),

  -- 621 Satılan Ticari Mallar Maliyeti (Soru 35, 36, 51)
  ('621.001', '621', 'Buzdolabı Maliyet Farkı', 'diger', 1),
  ('621.002', '621', 'Klima Maliyet Farkı', 'diger', 2),
  ('621.003', '621', 'Fırın Maliyeti', 'diger', 3),

  -- 654 Karşılık Giderleri (Soru 54)
  ('654.001', '654', 'Stok Değer Düşüklüğü Karşılığı', 'diger', 1),

  -- 689 Diğer Olağandışı Gider ve Zararlar (Soru 41, 48, 60)
  ('689.001', '689', 'Sipariş İptal Masrafı', 'diger', 1),
  ('689.002', '689', 'Sipariş Değişiklik İşlem Maliyeti', 'diger', 2),
  ('689.003', '689', 'Eski Mal Tasfiye Gideri', 'diger', 3)
on conflict (kod) do update set
  ad = excluded.ad,
  ana_kod = excluded.ana_kod,
  tip = excluded.tip,
  sira = excluded.sira;

commit;

notify pgrst, 'reload schema';
