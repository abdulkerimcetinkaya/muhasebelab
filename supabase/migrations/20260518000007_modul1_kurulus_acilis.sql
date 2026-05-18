-- Modül 1'i baştan kur: "Mal Hareketleri" yerine "İşletmenin Kuruluşu ve
-- Açılış Kayıtları". Mevcut 10 alt başlık + 129 soru + tüm bağlı veriler
-- (cozumler/ilerleme/soru_hatalari) silinir.
--
-- Kullanıcı kararı: eski içerik artık gerekli değil, temiz yeniden başlangıç.
--
-- Yeni yapı (8 alt başlık):
--   1.1 Şahıs İşletmesi Kuruluşu ve Nakit Sermaye
--   1.2 Şahıs İşletmesinde Ayni Sermaye
--   1.3 Limited Şirket Kuruluşu (Sermaye Taahhüdü)
--   1.4 Limited Şirkette Sermaye Ödemesi
--   1.5 Anonim Şirket Kuruluşu
--   1.6 Kuruluş ve Örgütlenme Giderleri
--   1.7 Açılış Bilançosuna Göre Yevmiye
--   1.8 Dönem Başı Envanter Sayım

begin;

-- 1. Modülün alt başlıklarına bağlı tüm soruları sil.
--    CASCADE: cozumler, ilerleme, soru_hatalari otomatik temizlenir.
delete from sorular
where alt_baslik_id in (
  select id from modul_alt_basliklari where modul_id = 'mal-alis-satis-m1'
);

-- 2. Eski alt başlıkları sil.
delete from modul_alt_basliklari where modul_id = 'mal-alis-satis-m1';

-- 3. Modül başlığını güncelle + içeriği sıfırla (BlockNote içerik yeni başlıkla uyumlu değil).
update unite_modulleri
set baslik = 'İşletmenin Kuruluşu ve Açılış Kayıtları',
    icerik = null,
    icerik_guncellendi = null,
    updated_at = now()
where id = 'mal-alis-satis-m1';

-- 4. Yeni 8 alt başlık.
insert into modul_alt_basliklari (id, modul_id, sira, baslik) values
  ('mal-alis-satis-1-1', 'mal-alis-satis-m1', 1, 'Şahıs İşletmesi Kuruluşu ve Nakit Sermaye'),
  ('mal-alis-satis-1-2', 'mal-alis-satis-m1', 2, 'Şahıs İşletmesinde Ayni Sermaye (Mal, Demirbaş, Taşıt)'),
  ('mal-alis-satis-1-3', 'mal-alis-satis-m1', 3, 'Limited Şirket Kuruluşu (Sermaye Taahhüdü Kaydı)'),
  ('mal-alis-satis-1-4', 'mal-alis-satis-m1', 4, 'Limited Şirkette Taahhüt Edilen Sermayenin Ödenmesi (Nakit ve Banka)'),
  ('mal-alis-satis-1-5', 'mal-alis-satis-m1', 5, 'Anonim Şirket Kuruluşu (Sermaye Taahhüdü ve 1/4 Ödeme)'),
  ('mal-alis-satis-1-6', 'mal-alis-satis-m1', 6, 'Kuruluş ve Örgütlenme Giderleri (Noter, Ticaret Sicil, Ruhsat, Danışmanlık)'),
  ('mal-alis-satis-1-7', 'mal-alis-satis-m1', 7, 'Açılış Bilançosuna Göre Yevmiye Açılış Kaydı (Devreden İşletme Senaryosu)'),
  ('mal-alis-satis-1-8', 'mal-alis-satis-m1', 8, 'Dönem Başı Envanter Sayım Sonuçlarının Kayda Alınması');

commit;
