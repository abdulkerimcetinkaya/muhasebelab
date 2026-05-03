-- MuhasebeLab — "Ticari Mal Alımı ve Satımı" ünitesi için 6 alt-konu
--
-- LeetCode-tarzı mikro yapı: her konu kendi anlatımı + sıralı sorular
-- ile öğrenciyi adım adım götürür. Anlatımlar BlockNote editöründen
-- yazılacak (icerik kolonu şimdilik null).

insert into unite_konulari (id, unite_id, ad, aciklama, sira) values
  (
    'stok-kavrami',
    'mal-alis-satis',
    'Stok Kavramı',
    '153 Ticari Mallar hesabının mantığı, stok-maliyet ilişkisi, sürekli ve aralıklı envanter yöntemleri.',
    1
  ),
  (
    'mal-alis',
    'mal-alis-satis',
    'Mal Alış',
    '153 borç, 191 borç (indirilecek KDV), 100/320 alacak. Alış faturasından yevmiye kaydı.',
    2
  ),
  (
    'alistan-iade',
    'mal-alis-satis',
    'Alıştan İade',
    'Hasarlı/yanlış mal iadesinde 153 alacak, 191 alacak, 100/320 borç. Ters yön mantığı.',
    3
  ),
  (
    'mal-satis',
    'mal-alis-satis',
    'Mal Satış',
    '100/120 borç, 600 alacak (yurt içi satış), 391 alacak (hesaplanan KDV). Satış faturasından kayıt.',
    4
  ),
  (
    'satistan-iade',
    'mal-alis-satis',
    'Satıştan İade',
    '610 borç (satıştan iade), 391 borç (KDV iadesi), 100/120 alacak. Müşteriden geri gelen mal.',
    5
  ),
  (
    'satilan-mal-maliyeti',
    'mal-alis-satis',
    'Satılan Mal Maliyeti',
    '621 borç (SMM), 153 alacak. Dönem sonu veya sürekli envanterde maliyet aktarımı.',
    6
  )
on conflict (id) do update set
  ad = excluded.ad,
  aciklama = excluded.aciklama,
  sira = excluded.sira;
