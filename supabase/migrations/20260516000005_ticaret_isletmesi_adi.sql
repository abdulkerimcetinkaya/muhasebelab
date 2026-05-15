-- mal-alis-satis ünitesinin adını ve açıklamasını işletme türü
-- terminolojisine uyarla.
--
-- Eski: "Ticari Mal Alım-Satımı" — eski "ünite" terminolojisi
-- Yeni: "Ticaret İşletmesi" — kullanıcı /uniteler sayfasında
-- "Ticaret İşletmesi" kartına bastığında modül grid başlığı tutarlı
-- olur. Admin tarafında da bu yeni ad görünür.

begin;

update unites
set
  ad = 'Ticaret İşletmesi',
  aciklama = 'Yıldız Beyaz Eşya A.Ş. senaryosuyla mal alım-satım, KDV, stopaj, çek-senet, banka işlemleri, personel ve duran varlık atölyeleri.'
where id = 'mal-alis-satis';

commit;

notify pgrst, 'reload schema';
