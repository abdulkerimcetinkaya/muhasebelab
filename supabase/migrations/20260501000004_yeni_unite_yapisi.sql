-- MuhasebeLab — Yapısal sıfırlama: 15 ünite + 213 soru → 5 yeni ünite
--
-- YIKICI VE GERİ DÖNÜLEMEZ. Push edildiği anda mevcut soru/çözüm/aktivite/hata
-- kayıtları kaybolur. Sıfırdan içerik üretmek için yeni iskelet kurar.
--
-- Cascade davranışı:
--   * cozumler (soru_id → sorular) on delete cascade
--   * aktivite (soru_id → sorular) on delete cascade
--   * soru_hatalari (soru_id → sorular) on delete cascade
--   * sorular (unite_id → unites) on delete restrict — bu yüzden ÖNCE sorular silinmeli
--
-- KORUNUR:
--   * hesap_plani (268 hesap)
--   * mevzuat_chunklar (RAG mevzuat havuzu)
--   * kullanicilar, ilerleme, kazanilan_rozetler, odemeler

-- 1) Soruları sil — cozumler/aktivite/soru_hatalari cascade ile temizlenir
delete from sorular;

-- 2) Tüm mevcut üniteleri sil
delete from unites;

-- 3) Beş yeni ünite — yeni içerik akışının iskeleti
insert into unites (id, ad, aciklama, thiings_icon, sira) values
  ('mal-alis-satis', 'Ticari Mal Alımı ve Satımı',
    'Ticari mal alışı ve satışı; fatura, KDV ve maliyet aktarımı işlemleri.',
    'mal-satis', 1),
  ('banka', 'Banka İşlemleri',
    'Banka mevduatları, EFT ve havale, çek-senet işlemleri.',
    'hazir-degerler', 2),
  ('personel-ucret', 'Personel Ücret Ödemeleri',
    'Brüt-net ücret, SGK kesintileri, gelir vergisi stopajı, ücret tahakkuk ve ödemeleri.',
    'personel', 3),
  ('amortisman', 'Amortisman Kayıtları',
    'Maddi duran varlıkların amortismanı; normal ve azalan bakiyeler yöntemi, birikmiş amortisman.',
    'amortisman', 4),
  ('duran-varlik', 'Duran Varlık Alımı',
    'Bina, makine, demirbaş gibi maddi duran varlık alımları; KDV ve aktifleştirme.',
    'mdv', 5);
