-- =====================================================================
-- Modül 1: Mal Hareketleri — Genel Bakış İçeriği
-- =====================================================================
-- ModulSayfasi'nda öğrencinin gördüğü çerçeveleyici metin.
-- BlockNote JSON formatı. Emoji yok, akademik, sade.

begin;

update unite_modulleri set
  icerik = '[
    {
      "id": "m1-blk-001",
      "type": "heading",
      "props": {"level": 1, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Mal Hareketleri", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-002",
      "type": "paragraph",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Bu modülde, bir ticaret işletmesinin günlük mal alış-satış döngüsünü, iade ve iskonto işlemlerini, sipariş avanslarını ve satışa bağlı giderleri yevmiye kaydına aktarmayı öğreneceksin. Konular bağımsız değildir; her biri bir önceki kayıt mantığının üzerine yenisini ekler.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-003",
      "type": "heading",
      "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "İşletme Profili", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-004",
      "type": "paragraph",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Sorularda Yıldız Beyaz Eşya Ticaret A.Ş. adlı kurgu işletmenin muhasebecisi rolündesin. İşletme; buzdolabı, çamaşır makinesi, televizyon, klima, fırın ve bulaşık makinesi gibi standart KDV oranlı (%20) beyaz eşyaları toptan alıp perakendecilere ve son tüketicilere satıyor. Tek bir işletme üzerinden ilerlemek; muavin defterinde aynı müşteri, tedarikçi ve banka kayıtlarını tekrar görmen anlamına geliyor.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-005",
      "type": "heading",
      "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Bu Modüldeki Konular", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-006",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Mal Alımı — peşin ve kredili alımın temel kaydı (153 / 191 / 100-102-320).", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-007",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Alıştan İade — hatalı veya istenmeyen malın tedarikçiye iadesi (153 ve 191 azaltılır).", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-008",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Alış İskontosu — fatura sonrası elde edilen indirimin maliyetten düşülmesi.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-009",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Verilen Sipariş Avansı — mal teslim edilmeden önce tedarikçiye ödenen tutar (159 hesabı).", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-010",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Mal Satışı — peşin ve kredili satışın temel kaydı (100-102-120 / 600 / 391).", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-011",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Satıştan İade — müşterinin geri verdiği malın kaydı (610 borç + 391 borç).", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-012",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Satış İskontosu — müşteriye satış sonrası verilen indirim (611 borç + 191 borç).", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-013",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Alınan Sipariş Avansı — müşteriden teslimden önce alınan tutar (340 hesabı).", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-014",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Satışa Bağlı Giderler (760 PSDG) — nakliye, komisyon, reklam gibi satışa hizmet eden giderler.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-015",
      "type": "numberedListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Fiyat Farkı Faturası — alış veya satış sonrası ortaya çıkan pozitif/negatif fiyat değişikliklerinin kaydı.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-016",
      "type": "heading",
      "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Kullanılacak Temel Hesaplar", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-017",
      "type": "paragraph",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Tüm modül boyunca aşağıdaki ana hesaplarla çalışacaksın. Her birinin altında birden fazla muavin var; senaryoyu okuyup doğru muaviniseçmek senin görevin.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-018",
      "type": "bulletListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Varlık tarafı: 100 Kasa, 102 Bankalar, 120 Alıcılar, 153 Ticari Mallar, 159 Verilen Sipariş Avansları.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-019",
      "type": "bulletListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Yabancı kaynak tarafı: 320 Satıcılar, 340 Alınan Sipariş Avansları.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-020",
      "type": "bulletListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "KDV: 191 İndirilecek KDV (alış), 391 Hesaplanan KDV (satış).", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-021",
      "type": "bulletListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Gelir-gider tarafı: 600 Yurtiçi Satışlar, 610 Satıştan İadeler, 611 Satış İskontoları, 760 Pazarlama Satış Dağıtım Giderleri.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-022",
      "type": "heading",
      "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Zorluk Seviyeleri", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-023",
      "type": "bulletListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Kolay: Tek tarafı banka, kasa veya tek bir cari hesap olan standart işlemler. Tek KDV oranı (%20). Hedef: rutin kaydı doğru ezbersiz kurabilmek.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-024",
      "type": "bulletListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Orta: Karma ödeme (yarı banka, yarı kasa), birden fazla KDV oranı, fatura üzeri iskonto, sipariş avansının mahsubu gibi istisnalar. Hedef: tek bir senaryoda birden çok hareketi çözümlemek.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-025",
      "type": "bulletListItem",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Zor: Çek/senet karşılığı satışın iadesi, hatalı kaydın düzeltilmesi, yıl sonu ciro primi, mahsuplu çoklu işlem. Hedef: kayıt mantığını ezberlemek yerine kuralı yorumlayarak doğru hesabı seçmek.", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-026",
      "type": "heading",
      "props": {"level": 2, "textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Çalışma Yöntemi", "type": "text", "styles": {}}],
      "children": []
    },
    {
      "id": "m1-blk-027",
      "type": "paragraph",
      "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
      "content": [{"text": "Her soruda önce senaryoyu sonuna kadar oku. Hangi tarafın borç, hangi tarafın alacak olduğunu kafanda kurmadan hesap planını açma. Tutarları sen hesapla; her senaryoda KDV hariç fiyat, oran ve miktar veriliyor. Muavin seçerken yalnızca ana hesap kodunu (örneğin 102) değil; senaryoda geçen bankayı (102.001 Garanti BBVA gibi) bulup seçmen gerekiyor. Yanlış muavin doğru ana hesap olsa bile cevabı yanlış sayar; çünkü gerçek hayatta muhasebeci de muavin defterinden doğru ismi seçmek zorunda.", "type": "text", "styles": {}}],
      "children": []
    }
  ]'::jsonb,
  icerik_guncellendi = now()
where id = 'mal-alis-satis-m1';

commit;

notify pgrst, 'reload schema';
