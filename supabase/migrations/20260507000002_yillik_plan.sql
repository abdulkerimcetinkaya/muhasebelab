-- Yıllık plan ekleme.
-- Mevcut migration'da sadece 'aylik' (1 ay) ve 'donemlik' (3 ay) vardı —
-- her ikisi de donem='aylik'. UI ise donem='yillik' planı arıyor, bulamıyor,
-- "Ödemeye Geç" butonu disabled kalıyor.
--
-- Çözüm: gerçek bir yıllık plan ekle (12 ay, aylığa düşen ~₺79 → toplam ₺950).
-- Eski 'donemlik' plan aktif olarak kalır ama UI'da artık görünmüyor (yeni
-- premium sayfası sadece aylik+yillik gösteriyor); ileride iptal edilebilir.

insert into planlar (kod, ad, aciklama, donem, ay_sayisi, tutar, sira)
  values (
    'yillik',
    'Yıllık',
    '12 ay sınırsız Premium — aylığa düşen ₺79, %20 tasarruf.',
    'yillik',
    12,
    950.00,
    30
  )
  on conflict (kod) do nothing;
