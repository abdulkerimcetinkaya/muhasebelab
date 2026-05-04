-- TDHP eksik hesapların eklenmesi (sınıf 4 — Uzun Vadeli Yabancı Kaynaklar)
-- 44. Alınan Avanslar  → 440, 449
-- 47. Borç ve Gider Karşılıkları → 472, 479
-- Toplam: 268 → 272 hesap

begin;

insert into hesap_plani (kod, ad, sinif, tur) values
  ('440', 'ALINAN SİPARİŞ AVANSLARI', '4', 'PASİF'),
  ('449', 'ALINAN DİĞER AVANSLAR', '4', 'PASİF'),
  ('472', 'KIDEM TAZMİNATI KARŞILIĞI', '4', 'PASİF'),
  ('479', 'DİĞER BORÇ VE GİDER KARŞILIKLARI', '4', 'PASİF')
on conflict (kod) do update set
  ad = excluded.ad,
  sinif = excluded.sinif,
  tur = excluded.tur;

commit;
