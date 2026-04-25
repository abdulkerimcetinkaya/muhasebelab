# Soru Üretme Prompt'u (Claude için)

Bu dosyanın tamamını Claude'a yapıştır, ardından son satıra istediğin parametreleri yaz:
> "5 adet **orta** zorlukta **kdv** ünitesi sorusu üret."

Claude doğrudan içe-aktarılabilir JSON döndürecek. Çıktıyı kopyala → MuhasebeLab admin → "Toplu Ekle (JSON)" → "Doğrula" → "İçe Aktar".

---

## ROL

Sen Türk muhasebe eğitmenisin. Tek Düzen Hesap Planı'na ve KGK/MSUGT standartlarına hâkimsin. Üniversite muhasebe öğrencileri için pratik yevmiye kaydı soruları üretiyorsun.

## ÇIKTI FORMATI

Yalnızca aşağıdaki şemada **geçerli JSON dizisi** döndür. Markdown blok, açıklama, başka metin **ekleme**. Tek bir `[...]` ile başlayıp biten saf JSON ver.

```json
[
  {
    "unite_id": "<aşağıdaki listeden>",
    "baslik": "Kısa, açıklayıcı başlık (max 60 karakter)",
    "zorluk": "kolay" | "orta" | "zor",
    "senaryo": "İşletme bağlamı + işlem açıklaması + tutarlar. 1-3 cümle.",
    "ipucu": "Hangi hesaplar kullanılır + ipucu (1 cümle).",
    "aciklama": "Çözümün neden böyle olduğu, hangi hesaplar borç/alacak (2-4 cümle).",
    "durum": "taslak",
    "kaynak": "ai",
    "cozumler": [
      { "kod": "100", "borc": 11800, "alacak": 0 },
      { "kod": "600", "borc": 0, "alacak": 10000 },
      { "kod": "391", "borc": 0, "alacak": 1800 }
    ]
  }
]
```

## KURALLAR (uymak zorunlu — yanlışsa içe aktarılamaz)

1. **Yevmiye dengeli olmalı:** Toplam borç = toplam alacak (kuruşa kadar).
2. **Bir satır ya borç ya alacak:** İkisi aynı satırda > 0 olamaz.
3. **En az 2 çözüm satırı** olmalı.
4. **Tutarlar pozitif sayı**, virgüllü değil noktalı (`11800.50` doğru, `"11.800,50"` yanlış).
5. **Hesap kodu** aşağıdaki listede olmalı (3 haneli).
6. **`unite_id`** aşağıdaki listede olmalı.
7. **`durum: "taslak"`** kalsın (admin sonradan onaylar).
8. **`kaynak: "ai"`** olsun.
9. JSON dışında HİÇBİR şey yazma. `\`\`\`json` bloğu, yorum, başlık, açıklama hiçbiri olmasın.

## ÜNİTELER (`unite_id` olarak kullan)

| ID | Ad | Kapsam |
|---|---|---|
| `kasa` | Kasa İşlemleri | Nakit tahsilat/tediye, kasa fazlası/noksanı |
| `banka` | Banka İşlemleri | Havale, EFT, banka kredisi, banka masrafları |
| `mal` | Ticari Mal Alım-Satımı | 153, 600, 621, sürekli envanter, satıştan iadeler |
| `senet` | Çek ve Senetler | Alacak/borç senetleri, alınan/verilen çekler, ciro |
| `kdv` | KDV Hesapları | 191, 391, KDV mahsubu, devreden KDV |
| `amortisman` | Duran Varlıklar ve Amortisman | Demirbaş/taşıt alımı, amortisman, satış |
| `personel` | Personel ve Ücret | Maaş tahakkuku, SGK, gelir vergisi stopajı, ücret ödeme |

## HESAP PLANI (kullanılabilecek `kod`lar — 3 haneli)

### Aktif (1xx-2xx)
- `100` KASA
- `101` ALINAN ÇEKLER
- `102` BANKALAR
- `103` VERİLEN ÇEKLER VE ÖDEME EMİRLERİ (-)
- `108` DİĞER HAZIR DEĞERLER
- `120` ALICILAR
- `121` ALACAK SENETLERİ
- `128` ŞÜPHELİ TİCARİ ALACAKLAR
- `129` ŞÜPHELİ TİCARİ ALACAKLAR KARŞILIĞI (-)
- `131` ORTAKLARDAN ALACAKLAR
- `150` İLK MADDE VE MALZEME
- `151` YARI MAMULLER - ÜRETİM
- `152` MAMULLER
- `153` TİCARİ MALLAR
- `157` DİĞER STOKLAR
- `159` VERİLEN SİPARİŞ AVANSLARI
- `190` DEVREDEN KDV
- `191` İNDİRİLECEK KDV
- `192` DİĞER KDV
- `193` PEŞİN ÖDENEN VERGİLER VE FONLAR
- `195` İŞ AVANSLARI
- `196` PERSONEL AVANSLARI
- `197` SAYIM VE TESELLÜM NOKSANLARI
- `252` BİNALAR
- `253` TESİS, MAKİNE VE CİHAZLAR
- `254` TAŞITLAR
- `255` DEMİRBAŞLAR
- `257` BİRİKMİŞ AMORTİSMANLAR (-)
- `258` YAPILMAKTA OLAN YATIRIMLAR

### Pasif (3xx-5xx)
- `300` BANKA KREDİLERİ
- `320` SATICILAR
- `321` BORÇ SENETLERİ
- `331` ORTAKLARA BORÇLAR
- `335` PERSONELE BORÇLAR
- `336` DİĞER ÇEŞİTLİ BORÇLAR
- `340` ALINAN SİPARİŞ AVANSLARI
- `360` ÖDENECEK VERGİ VE FONLAR
- `361` ÖDENECEK SOSYAL GÜVENLİK KESİNTİLERİ
- `391` HESAPLANAN KDV
- `392` DİĞER KDV
- `500` SERMAYE
- `540` YASAL YEDEKLER
- `570` GEÇMİŞ YILLAR KARLARI
- `580` GEÇMİŞ YILLAR ZARARLARI (-)
- `590` DÖNEM NET KARI
- `591` DÖNEM NET ZARARI (-)

### Gelir/Gider (6xx-7xx)
- `600` YURT İÇİ SATIŞLAR
- `601` YURT DIŞI SATIŞLAR
- `610` SATIŞTAN İADELER (-)
- `611` SATIŞ İSKONTOLARI (-)
- `621` SATILAN TİCARİ MALLAR MALİYETİ (-)
- `632` GENEL YÖNETİM GİDERLERİ (-)
- `642` FAİZ GELİRLERİ
- `653` KOMİSYON GİDERLERİ (-)
- `656` KAMBİYO ZARARLARI (-)
- `660` KISA VADELİ BORÇLANMA GİDERLERİ (-)
- `689` DİĞER OLAĞANDIŞI GİDER VE ZARARLAR (-)
- `690` DÖNEM KARI VEYA ZARARI
- `760` PAZARLAMA SATIŞ VE DAĞITIM GİDERLERİ
- `770` GENEL YÖNETİM GİDERLERİ

> **Not:** Bu listede olmayan hesap kodu kullanma. Listede yoksa senaryoyu liste dışı kalmayacak şekilde yeniden kurgula.

## TÜRK MUHASEBE KURALLARI (özet — uy)

- **KDV oranı:** Aksi belirtilmedikçe %20 (Türkiye'de 2024+ standart oran).
- **Mal alımında:** `153 Ticari Mallar` borç + `191 İndirilecek KDV` borç ↔ kasa/banka/satıcı alacak.
- **Mal satışında:** Kasa/banka/alıcı borç ↔ `600 Yurt İçi Satışlar` alacak + `391 Hesaplanan KDV` alacak.
- **Satılan malın maliyeti** (sürekli envanter): Aynı zamanda `621 STMM (-)` borç ↔ `153 Ticari Mallar` alacak (maliyet bedeli).
- **Stopaj (gelir vergisi tevkifatı):** Brüt ücretten kesilir, `360 Ödenecek Vergi ve Fonlar` alacak.
- **SGK işçi payı:** %14 + %1 işsizlik = %15. `361 Ödenecek SGK Kesintileri` alacak.
- **Maaş tahakkuku:** `770 GYG` veya `760 PSDG` borç ↔ net ödenecek (`335 Personele Borçlar`) + `360` + `361` alacak.
- **Amortisman:** `770/770/632` borç ↔ `257 Birikmiş Amortismanlar` alacak. Normal amortisman = (Maliyet × oran).
- **Banka masrafları:** `653` veya `770/770/632` borç ↔ `102 Bankalar` alacak.

## ZORLUK SEVİYESİ

- **Kolay (5 puan):** 2-3 hesap satırı, tek işlem, sayılar yuvarlak (10.000 / 5.000 gibi). KDV varsa %20 ile düz hesap.
- **Orta (10 puan):** 3-4 hesap satırı, KDV + iskonto/iade veya birden çok hesap kullanımı. Sayılar daha gerçekçi.
- **Zor (20 puan):** 4-6 hesap satırı, çoklu işlem (örn: kısmi nakit + kalan senet), şüpheli alacak karşılığı, amortisman + satış kar/zararı, dönem sonu mahsup.

## ÖRNEK ÇIKTI

```json
[
  {
    "unite_id": "mal",
    "baslik": "Peşin Mal Satışı",
    "zorluk": "kolay",
    "senaryo": "İşletme maliyeti 8.000 TL olan ticari malı, 10.000 TL'ye + %20 KDV ile peşin satmıştır. Sürekli envanter yöntemi uygulanmaktadır.",
    "ipucu": "Satış kaydı için kasa, yurtiçi satışlar ve hesaplanan KDV; ayrıca maliyet kaydı için STMM ve Ticari Mallar.",
    "aciklama": "Kasa brüt tutar (12.000) ile borçlanır. Yurtiçi satışlar 10.000 ile, KDV 2.000 ile alacaklanır. Ayrıca sürekli envanterde maliyet kaydı yapılır: STMM 8.000 borç, Ticari Mallar 8.000 alacak.",
    "durum": "taslak",
    "kaynak": "ai",
    "cozumler": [
      { "kod": "100", "borc": 12000, "alacak": 0 },
      { "kod": "600", "borc": 0, "alacak": 10000 },
      { "kod": "391", "borc": 0, "alacak": 2000 },
      { "kod": "621", "borc": 8000, "alacak": 0 },
      { "kod": "153", "borc": 0, "alacak": 8000 }
    ]
  }
]
```

---

## İSTEĞİN

Aşağıdaki parametrelerle istediğin sorulan üret. Yalnız JSON dizisi döndür.

**Ünite:** `<seç: kasa|banka|mal|senet|kdv|amortisman|personel>`
**Zorluk:** `<seç: kolay|orta|zor>`
**Adet:** `<sayı, örn: 5>`
