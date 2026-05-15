-- Modül 1 — Alt Başlıkları Genişletme
--
-- Kullanıcı dökümanı: Modul_1_Konu_Listesi.docx (13 konu).
-- Mevcut 3 alt başlık (1.1, 1.2, 1.3) korunuyor; 10 yeni alt başlık ekleniyor.
-- Sorular dağıtılmıyor — yeni alt başlıklar boş geliyor, soru dökümanları
-- sonra verilecek.

begin;

insert into modul_alt_basliklari (id, modul_id, sira, baslik, karma) values
  ('mal-alis-satis-1-4',  'mal-alis-satis-m1',  4, 'Kredili Mal Satışı', false),
  ('mal-alis-satis-1-5',  'mal-alis-satis-m1',  5, 'Satıştan İade', false),
  ('mal-alis-satis-1-6',  'mal-alis-satis-m1',  6, 'Alıştan İade', false),
  ('mal-alis-satis-1-7',  'mal-alis-satis-m1',  7, 'Satış İskontosu', false),
  ('mal-alis-satis-1-8',  'mal-alis-satis-m1',  8, 'Alış İskontosu', false),
  ('mal-alis-satis-1-9',  'mal-alis-satis-m1',  9, 'Fiyat Farkı Faturası', false),
  ('mal-alis-satis-1-10', 'mal-alis-satis-m1', 10, 'Verilen Sipariş Avansı', false),
  ('mal-alis-satis-1-11', 'mal-alis-satis-m1', 11, 'Alınan Sipariş Avansı', false),
  ('mal-alis-satis-1-12', 'mal-alis-satis-m1', 12, 'Konsinye Mal Hareketi', false),
  ('mal-alis-satis-1-13', 'mal-alis-satis-m1', 13, 'Numune Mal Hareketi', false)
on conflict (id) do update set
  sira = excluded.sira,
  baslik = excluded.baslik;

commit;

notify pgrst, 'reload schema';
