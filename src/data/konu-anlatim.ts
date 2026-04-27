/**
 * Ünite konu anlatımları — kullanıcı her üniteye ilk girdiğinde
 * konuyu hatırlatan kısa rehberler.
 *
 * Yapı: Yevmiye_Kayit_Mufredati.docx (15 ünite müfredatı) referans alınmıştır.
 * İçerikler AI taslak — profesyonel muhasebe editörü tarafından gözden geçirilecek.
 */

export interface KonuHesap {
  kod: string;
  ad: string;
  rol: string;
}

export interface KonuOrnekSatir {
  kod: string;
  ad: string;
  borc?: number;
  alacak?: number;
}

export interface KonuOrnek {
  baslik: string;
  senaryo: string;
  satirlar: KonuOrnekSatir[];
  yorum?: string;
}

export interface KonuAnlatim {
  uniteId: string;
  giris: string;
  neIcin: string;
  hesaplar: KonuHesap[];
  ornek: KonuOrnek;
  pufNoktalari: string[];
}

export const KONU_ANLATIMLAR: Record<string, KonuAnlatim> = {
  acilis: {
    uniteId: 'acilis',
    giris:
      'Muhasebenin temel mantığı: çift taraflı kayıt sistemi, Tek Düzen Hesap Planı yapısı, açılış bilançosundan açılış yevmiye kaydının çıkarılması. Tüm muhasebe yolculuğunun başladığı yer.',
    neIcin:
      'Bu üniteyi tamamlayınca TDHP\'nin 1-9 hesap sınıflarını tanır, aktif/pasif karakterli hesapları ayırt edebilir, açılış bilançosunu yevmiyeye doğru aktarır, mizan ve büyük defter ilişkisini kavrarsın.',
    hesaplar: [
      { kod: '100', ad: 'Kasa', rol: 'Açılışta nakit varlık.' },
      { kod: '102', ad: 'Bankalar', rol: 'Açılışta banka mevduatı.' },
      { kod: '255', ad: 'Demirbaşlar', rol: 'Açılışta sahip olunan demirbaş.' },
      { kod: '500', ad: 'Sermaye', rol: 'Ortakların işletmeye koyduğu sermaye toplamı.' },
      { kod: '320', ad: 'Satıcılar', rol: 'Açılışta açık hesap borçları.' },
      { kod: '120', ad: 'Alıcılar', rol: 'Açılışta açık hesap alacakları.' },
    ],
    ornek: {
      baslik: 'Açılış Yevmiye Kaydı',
      senaryo:
        '02.01.2026: ABC Ltd. 500.000 TL kasa, 1.500.000 TL banka, 200.000 TL demirbaş ve 2.200.000 TL sermaye ile açılış yapıyor.',
      satirlar: [
        { kod: '100', ad: 'Kasa', borc: 500000 },
        { kod: '102', ad: 'Bankalar', borc: 1500000 },
        { kod: '255', ad: 'Demirbaşlar', borc: 200000 },
        { kod: '500', ad: 'Sermaye', alacak: 2200000 },
      ],
      yorum:
        'Açılış kaydında varlıklar borç (sol), kaynaklar alacak (sağ) tarafında. Borç ve alacak toplamı her zaman eşittir.',
    },
    pufNoktalari: [
      'Aktif hesaplar (1, 2, 5 sınıfları) artınca borç, azalınca alacak — pasifler tam tersi.',
      'Açılış bilançosunun aktif toplamı = pasif toplamı; eşit değilse hata vardır.',
      'Yevmiyenin ilk satırında genelde borç, ikinci ve sonrasında alacak yazılır (tarih + açıklama ile).',
      'Geçici mizan aylık çıkarılır, genel mizan dönem sonunda — her ikisi de hesapların borç/alacak toplamlarını gösterir.',
    ],
  },

  'hazir-degerler': {
    uniteId: 'hazir-degerler',
    giris:
      'Hazır değerler 100 Kasa, 101 Alınan Çekler, 102 Bankalar, 103 Verilen Çekler ve 108 Diğer Hazır Değerler hesaplarını kapsar. İşletmenin günlük tahsilat ve ödemelerinin akış noktası.',
    neIcin:
      'Bu üniteyi tamamlayınca nakit, çek ve banka hareketlerini doğru kaydedebilir, kasa fazla/noksanlığını 197/397\'de izleyebilir, dövizli kasa-banka değerlemesini yapabilirsin.',
    hesaplar: [
      { kod: '100', ad: 'Kasa', rol: 'Nakit hareketlerin merkezi. Para girince borç, çıkınca alacak.' },
      { kod: '101', ad: 'Alınan Çekler', rol: 'Müşteriden alınan vadesi gelmemiş çekler.' },
      { kod: '102', ad: 'Bankalar', rol: 'Vadesiz mevduat — havale, EFT, faiz tahakkuku.' },
      { kod: '103', ad: 'Verilen Çekler ve Ödeme Emirleri (-)', rol: 'İşletmenin kestiği çekler (aktif kontra).' },
      { kod: '108', ad: 'Diğer Hazır Değerler', rol: 'Kredi kartı slipleri, posta çekleri.' },
      { kod: '197', ad: 'Sayım ve Tesellüm Noksanları', rol: 'Sayımda eksik çıkan kasa farkları (geçici aktif).' },
      { kod: '397', ad: 'Sayım ve Tesellüm Fazlaları', rol: 'Sayımda fazla çıkan kasa tutarları (geçici pasif).' },
    ],
    ornek: {
      baslik: 'Z Raporu — Nakit + Kart Tahsilatı',
      senaryo:
        'Kafe gün sonu Z raporuna göre 8.500 TL nakit, 12.300 TL kredi kartı tahsilatı yaptı. Kasa sayımında 50 TL fazla çıktı.',
      satirlar: [
        { kod: '100', ad: 'Kasa', borc: 8550 },
        { kod: '108', ad: 'Diğer Hazır Değerler (POS)', borc: 12300 },
        { kod: '600', ad: 'Yurt İçi Satışlar', alacak: 18954.55 },
        { kod: '391', ad: 'Hesaplanan KDV (%10)', alacak: 1895.45 },
        { kod: '397', ad: 'Sayım Fazlaları', alacak: 50 },
      ],
      yorum:
        'Kasa nakit + 50 TL fazla = 8.550 borç. POS tutarı 108\'e geçici. Matrah ve KDV ayrılır; fazla 397\'ye geçer, sebebi araştırılır.',
    },
    pufNoktalari: [
      'Kasa hep KDV dahil tutarla çalışır; matrah ile karıştırma.',
      'POS slipi T+1 bankaya geçer — komisyon düşülmüş tutar 102\'ye, komisyon 760/770\'e gider.',
      'Sayım noksanı önce 197\'ye, sebebi anlaşılınca 689 veya ilgili gider/personel hesabına aktarılır.',
      'Dövizli kasa/banka yıl sonunda Hazine kuruyla değerlenir; lehe fark 646, aleyhe 656.',
    ],
  },

  'mal-alis': {
    uniteId: 'mal-alis',
    giris:
      'Ticari mal alımı 153 Ticari Mallar hesabını borçlandırır. Faturadaki KDV ayrı ayrılır, ödeme şekline göre kasa/banka/satıcılar/borç senedi hesabı alacaklanır.',
    neIcin:
      'Bu üniteyi tamamlayınca peşin/vadeli/senetli mal alışını, alış iadesi ve iskontoyu, navlun-gümrük gibi maliyete giren giderleri 153/191/320/321 hesaplarıyla doğru kaydedebilirsin.',
    hesaplar: [
      { kod: '153', ad: 'Ticari Mallar', rol: 'Stoktaki ticari mal varlığı; alışta borçlanır.' },
      { kod: '191', ad: 'İndirilecek KDV', rol: 'Alış faturasındaki KDV.' },
      { kod: '320', ad: 'Satıcılar', rol: 'Vadeli alışta satıcıya olan açık hesap borcu.' },
      { kod: '321', ad: 'Borç Senetleri', rol: 'Senet vererek alımda doğan borç.' },
      { kod: '100', ad: 'Kasa', rol: 'Peşin alımda nakit çıkışı.' },
      { kod: '102', ad: 'Bankalar', rol: 'Banka transferiyle alımda banka çıkışı.' },
    ],
    ornek: {
      baslik: 'Vadeli Mal Alışı (KDV %10)',
      senaryo:
        'Tekstil toptancısı 200.000 TL + KDV (%10) tutarında kumaşı vadeli aldı.',
      satirlar: [
        { kod: '153', ad: 'Ticari Mallar', borc: 200000 },
        { kod: '191', ad: 'İndirilecek KDV', borc: 20000 },
        { kod: '320', ad: 'Satıcılar', alacak: 220000 },
      ],
      yorum:
        'Mal stoğa matrah ile girer (200.000), KDV ayrı 191\'e (20.000). Toplam borçlanılan tutar 220.000 → satıcılara.',
    },
    pufNoktalari: [
      'Faturadaki ticari iskonto, alış maliyetini düşürür — 153\'ü brüt yazma, NET tutarla yaz.',
      'Navlun, sigorta, gümrük → malı işletmeye getiriyorsa 153\'e (VUK md. 262); satışla ilgiliyse 760\'a.',
      'Alıştan iadelerde 153 alacak (mal çıkıyor) ve 191 alacak (KDV iadesi) yazılır.',
      'Aralıklı envanter yönteminde alış 153\'e, dönem sonunda SMM çıkartılır; sürekli envanterde her hareket anlık.',
    ],
  },

  'mal-satis': {
    uniteId: 'mal-satis',
    giris:
      'Mal satışı 600 Yurt İçi Satışlar hesabını matrah ile alacaklandırır. Faturadaki KDV 391 Hesaplanan KDV\'ye, tahsilat şekline göre kasa/banka/alıcılar borçlanır.',
    neIcin:
      'Bu üniteyi tamamlayınca peşin/vadeli/senetli satışı, satış iadesi ve iskontoyu, sürekli envanterde anlık 621 maliyet kaydını ve aralıklı envanterde dönem sonu SMM hesaplamasını yapabilirsin.',
    hesaplar: [
      { kod: '600', ad: 'Yurt İçi Satışlar', rol: 'Satış matrahı.' },
      { kod: '391', ad: 'Hesaplanan KDV', rol: 'Satışta tahsil edilen KDV.' },
      { kod: '120', ad: 'Alıcılar', rol: 'Vadeli satışta müşteriden olan alacak.' },
      { kod: '121', ad: 'Alacak Senetleri', rol: 'Senetli satışta doğan senetli alacak.' },
      { kod: '610', ad: 'Satıştan İadeler (-)', rol: 'Satılan malın iadesi (gelir kontra).' },
      { kod: '611', ad: 'Satış İskontoları (-)', rol: 'Satıştan sonraki iskonto/risturn.' },
      { kod: '621', ad: 'Satılan Ticari Mallar Maliyeti', rol: 'Sürekli envanterde anlık satış maliyeti.' },
    ],
    ornek: {
      baslik: 'Vadeli Mal Satışı (Sürekli Envanter)',
      senaryo:
        'Mobilya mağazası 80.000 TL maliyetli takımı 120.000 TL + KDV (%20) bedelle vadeli sattı.',
      satirlar: [
        { kod: '120', ad: 'Alıcılar', borc: 144000 },
        { kod: '600', ad: 'Yurt İçi Satışlar', alacak: 120000 },
        { kod: '391', ad: 'Hesaplanan KDV', alacak: 24000 },
        { kod: '621', ad: 'Satılan Ticari Mallar Maliyeti', borc: 80000 },
        { kod: '153', ad: 'Ticari Mallar', alacak: 80000 },
      ],
      yorum:
        'İlk üç satır satış kaydı (alacak + matrah + KDV). Son iki satır sürekli envanterde anlık maliyet — 621 borç, 153 alacak.',
    },
    pufNoktalari: [
      'Satış iadesi 610 (kontra hesap) — doğrudan 600\'ü düşürmek yerine kullan.',
      'Sürekli envanterde 621/153 anlık çift kayıt; aralıklıda dönem sonu envanterle SMM çıkar.',
      'Promosyon olarak verilen mal: maliyet bedeliyle 760\'a borç, 153\'e alacak.',
      'Vadeli kart taksitlerinde matrahın tamamı 600 alacaklanır; faiz işletmeye yansımaz.',
    ],
  },

  'ticari-alacaklar': {
    uniteId: 'ticari-alacaklar',
    giris:
      '12. grup hesapları — alıcılar, alacak senetleri, depozito ve şüpheli alacak yönetimi. Müşteriden olan tüm alacakların izlendiği yer.',
    neIcin:
      'Bu üniteyi tamamlayınca açık hesap-senet-çek arası dönüşümü, ciro/iskonto/protesto işlemlerini, depozito takibini ve şüpheli alacak hale gelen alacağın 128/129\'a aktarımını doğru yapabilirsin.',
    hesaplar: [
      { kod: '120', ad: 'Alıcılar', rol: 'Vadeli satıştan doğan açık hesap alacağı.' },
      { kod: '121', ad: 'Alacak Senetleri', rol: 'Müşteriden alınan senetli alacaklar.' },
      { kod: '101', ad: 'Alınan Çekler', rol: 'Müşteriden alınan vadeli çek.' },
      { kod: '126', ad: 'Verilen Depozito ve Teminatlar', rol: 'İşletmenin verdiği teminat tutarları.' },
      { kod: '128', ad: 'Şüpheli Ticari Alacaklar', rol: 'Tahsili belirsiz hale gelen alacaklar.' },
      { kod: '644', ad: 'Konusu Kalmayan Karşılıklar', rol: 'Şüpheli alacak tahsil edilirse karşılığın gelir yazılması.' },
    ],
    ornek: {
      baslik: 'Açık Hesabın Senete Bağlanması',
      senaryo: 'Müşterinin 10.000 TL\'lik 120 hesap bakiyesi için 3 ay vadeli senet alındı.',
      satirlar: [
        { kod: '121', ad: 'Alacak Senetleri', borc: 10000 },
        { kod: '120', ad: 'Alıcılar', alacak: 10000 },
      ],
      yorum:
        'Açık hesap, senetli alacağa dönüştü. Aktif aktif arası geçiş; toplam varlık değişmedi, sadece türü değişti.',
    },
    pufNoktalari: [
      'Senet ciro edilince 121 alacak (varlık çıktı); ciro karşılığı ne aldıysak (101 çek, 320 satıcı vb) o tarafa kayıt.',
      'Karşılıksız çıkan çek/senet doğrudan 689\'a değil, önce 128 Şüpheli Ticari Alacaklar\'a alınır.',
      'Bankada iskonto edilen senet (kırdırma): 102 borç, 121 alacak, faiz farkı 780 Finansman Giderleri.',
      'Alacak senedi reeskontu (122) bu ünitede DEĞİL — Reeskont/Karşılık ünitesinde işlenir.',
    ],
  },

  'ticari-borclar': {
    uniteId: 'ticari-borclar',
    giris:
      '32. grup hesapları — satıcılar, borç senetleri, depozito ve erken ödeme iskontosu yönetimi. Tedarikçiye olan tüm yükümlülüklerin izlendiği yer.',
    neIcin:
      'Bu üniteyi tamamlayınca açık hesabın senete bağlanmasını, çek-bono ile ödemeyi, erken ödeme iskontosunu (644 geliri), vade farkı faturasını ve dövizli satıcı borçlarını doğru kaydedebilirsin.',
    hesaplar: [
      { kod: '320', ad: 'Satıcılar', rol: 'Tedarikçilere olan açık hesap borcu.' },
      { kod: '321', ad: 'Borç Senetleri', rol: 'Tedarikçiye verilen senetli borç.' },
      { kod: '326', ad: 'Alınan Depozito ve Teminatlar', rol: 'Tedarikçiden alınan teminat.' },
      { kod: '103', ad: 'Verilen Çekler ve Ödeme Emirleri (-)', rol: 'Satıcıya kesilen çek (aktif kontra).' },
      { kod: '644', ad: 'Konusu Kalmayan Karşılıklar', rol: 'Erken ödeme iskontosundan kaynaklanan gelir.' },
      { kod: '780', ad: 'Finansman Giderleri', rol: 'Bono faiz gideri buraya yazılabilir.' },
    ],
    ornek: {
      baslik: 'Erken Ödeme İskontosu',
      senaryo:
        'Restoran 180.000 TL satıcı borcunu vadeden önce ödüyor; %2 iskonto (3.600 TL) kazandı. Ödeme bankadan.',
      satirlar: [
        { kod: '320', ad: 'Satıcılar', borc: 180000 },
        { kod: '102', ad: 'Bankalar', alacak: 176400 },
        { kod: '644', ad: 'Konusu Kalmayan Karşılıklar', alacak: 3600 },
      ],
      yorum:
        '320 tam tutarla kapatılır (180.000), banka net ödenen tutarı (176.400) çıkar, iskonto fark 644\'e gelir kaydedilir.',
    },
    pufNoktalari: [
      'Açık hesap (320) → senete (321) bağlanırken pasif-pasif arası geçiş; tutar değişmez.',
      'Çek kestiğinde 103\'e (kontra aktif) yazılır; banka 102 hemen düşmez, çek tahsil edilince düşer.',
      'Bono faizini ana borca eklemek yanlış — faiz tutarı 780 Finansman Giderleri\'ne ayrı yazılır.',
      'Vade farkı faturası düzeltici belge: matrah artar, KDV tekrar hesaplanır, 320 ek tutarla alacaklanır.',
    ],
  },

  kdv: {
    uniteId: 'kdv',
    giris:
      'KDV alış ve satışlarda hesaplanan dolaylı vergidir. Ay sonu mahsupta 191 ile 391 karşılaştırılır; fark ödenir veya devreden olarak sonraki aya aktarılır.',
    neIcin:
      'Bu üniteyi tamamlayınca aylık KDV mahsubunu kurabilir, devreden KDV (190) hesabını yönetebilir, 360 ödenecek vergiyi ayırabilir, KDV tevkifatlı ve ihracat işlemlerini doğru kaydedebilirsin.',
    hesaplar: [
      { kod: '191', ad: 'İndirilecek KDV', rol: 'Alışta ödenen, mahsup edilecek KDV (aktif).' },
      { kod: '391', ad: 'Hesaplanan KDV', rol: 'Satışta tahsil edilen KDV (pasif).' },
      { kod: '190', ad: 'Devreden KDV', rol: 'Mahsup sonrası kalan ve sonraki aya devreden alacak.' },
      { kod: '360', ad: 'Ödenecek Vergi ve Fonlar', rol: 'Mahsup sonrası ödenecek KDV ve diğer vergiler.' },
      { kod: '192', ad: 'Diğer KDV', rol: 'İhracat istisnası iade KDV\'si.' },
    ],
    ornek: {
      baslik: 'Ay Sonu KDV Mahsubu (391 > 191)',
      senaryo:
        'Ay sonunda 391 = 850.000 TL alacak, 191 = 620.000 TL borç bakiye veriyor.',
      satirlar: [
        { kod: '391', ad: 'Hesaplanan KDV', borc: 850000 },
        { kod: '191', ad: 'İndirilecek KDV', alacak: 620000 },
        { kod: '360', ad: 'Ödenecek Vergi ve Fonlar', alacak: 230000 },
      ],
      yorum:
        '391 kapatılır (borç), 191 kapatılır (alacak), kalan 230.000 TL 360\'a ödenecek KDV olarak yazılır.',
    },
    pufNoktalari: [
      '191 borç bakiyesi 391 alacak bakiyesinden büyükse, fark 190 Devreden KDV\'ye yazılır.',
      'Tevkifatlı satışlarda KDV\'nin bir kısmı alıcı tarafından sorumlu sıfatıyla beyan edilir — 391 sadece kısmi tutarla.',
      '360 sadece KDV için değil — stopaj, damga vb. tüm ödenecek vergiler buraya yazılır.',
      'İhracat istisnası: 391 sıfır, fakat 191 borç → 192 İade Edilecek KDV hesabıyla takip.',
    ],
  },

  personel: {
    uniteId: 'personel',
    giris:
      'Personel ücret kayıtları bordro tabanlıdır. Brüt ücretten SGK işçi payı, gelir vergisi ve damga vergisi kesilir; işveren ayrıca SGK işveren ve işsizlik primini yüklenir.',
    neIcin:
      'Bu üniteyi tamamlayınca bordroyu yevmiye fişine çevirebilir, brüt-net ayrımını yapabilir, SGK + stopaj + damga hesaplarını ayırabilir, avans mahsubu ve kıdem karşılığı kaydedebilirsin.',
    hesaplar: [
      { kod: '770', ad: 'Genel Yönetim Giderleri', rol: 'Beyaz yaka ücret + işveren payı.' },
      { kod: '720', ad: 'Direkt İşçilik Giderleri', rol: 'Üretim hattındaki personel ücretleri.' },
      { kod: '335', ad: 'Personele Borçlar', rol: 'Net olarak personele ödenecek tutar.' },
      { kod: '360', ad: 'Ödenecek Vergi ve Fonlar', rol: 'Stopaj ve damga vergisi.' },
      { kod: '361', ad: 'Ödenecek Sosyal Güvenlik Kesintileri', rol: 'SGK işçi + işveren payı toplamı.' },
      { kod: '195', ad: 'İş Avansları', rol: 'Personele verilen iş avansı (mahsup edilince kapatılır).' },
      { kod: '472', ad: 'Kıdem Tazminatı Karşılıkları', rol: 'Uzun vadeli kıdem yükümlülüğü.' },
    ],
    ornek: {
      baslik: 'Aylık Bordro Kaydı',
      senaryo:
        'Brüt 35.000 TL. SGK işçi 4.900 (%14), gelir vergisi 5.250 (%15), damga 266, SGK işveren 7.262 (%20,75).',
      satirlar: [
        { kod: '770', ad: 'Genel Yönetim Giderleri', borc: 42262 },
        { kod: '335', ad: 'Personele Borçlar', alacak: 24584 },
        { kod: '360', ad: 'Ödenecek Vergi ve Fonlar', alacak: 5516 },
        { kod: '361', ad: 'Ödenecek SGK Primleri', alacak: 12162 },
      ],
      yorum:
        '770 tarafı brüt + işveren payı. Net personele 335\'e, vergiler 360\'a, SGK toplamı 361\'e ayrılır.',
    },
    pufNoktalari: [
      '770/720/730 tarafına BRÜT ÜCRET + SGK İŞVEREN PAYI yazılır — sadece brüt yetmez.',
      'Net ücret 335\'e, kesintiler ayrı hesaplara — toplamı 360\'a basma.',
      'Avans varsa 335\'in tutarı düşer ve 195 alacak yazılır (mahsup).',
      'Asgari ücret istisnası: 2026 yılında brütün asgari ücrete kadar olan kısmı vergi/SGK\'dan istisnadır.',
    ],
  },

  mdv: {
    uniteId: 'mdv',
    giris:
      '25. grup maddi duran varlıklar — tesis, makine, taşıt, demirbaş alımı ve elden çıkarmaları. Maliyet bedeli faturadaki tutar + nakliye + montaj + kur farkı.',
    neIcin:
      'Bu üniteyi tamamlayınca duran varlık alımını maliyet unsurlarıyla doğru kaydedebilir, satış kaydında defter değeri ile satış bedelini karşılaştırarak 679/689 hesaplarına kâr/zararı aktarabilirsin.',
    hesaplar: [
      { kod: '253', ad: 'Tesis, Makine ve Cihazlar', rol: 'Üretim ekipmanları.' },
      { kod: '254', ad: 'Taşıtlar', rol: 'Şirket araçları (binek otomobil özel KDV/ÖTV durumu).' },
      { kod: '255', ad: 'Demirbaşlar', rol: 'Mobilya, ofis ekipmanı vb.' },
      { kod: '258', ad: 'Yapılmakta Olan Yatırımlar', rol: 'Aktifleştirilmeden önce biriken maliyet.' },
      { kod: '257', ad: 'Birikmiş Amortismanlar (-)', rol: 'Satış kaydında düşülecek amortisman.' },
      { kod: '679', ad: 'Diğer Olağandışı Gelir ve Karlar', rol: 'MDV satış kârı.' },
      { kod: '689', ad: 'Diğer Olağandışı Gider ve Zararlar', rol: 'MDV satış zararı.' },
    ],
    ornek: {
      baslik: 'MDV Satışı (kârlı)',
      senaryo:
        '800.000 TL maliyetli kamyonun 320.000 TL birikmiş amortismanı var (NDD = 480.000). 600.000 TL + KDV %20 satıldı.',
      satirlar: [
        { kod: '102', ad: 'Bankalar', borc: 720000 },
        { kod: '257', ad: 'Birikmiş Amortismanlar', borc: 320000 },
        { kod: '254', ad: 'Taşıtlar', alacak: 800000 },
        { kod: '391', ad: 'Hesaplanan KDV', alacak: 120000 },
        { kod: '679', ad: 'Diğer Olağandışı Gelir ve Karlar', alacak: 120000 },
      ],
      yorum:
        '254 maliyet bedeliyle çıkar, 257 ile birlikte ters kayıtla kapatılır. Satış bedeli 600.000 - NDD 480.000 = 120.000 kâr 679\'a.',
    },
    pufNoktalari: [
      'MDV maliyetine VUK md. 262 gereği nakliye, montaj, ilk kur farkı dahildir; sonraki kur farkları gider yazılır.',
      'Binek otomobilde KDV indirilemez — maliyete eklenir; ÖTV de aynı şekilde.',
      'MDV satışında 257 birikmiş amortismanı 254/253/255 ile birlikte ters kayıtla kapatmayı unutma.',
      'Yapımı süren projeler 258\'de toplanır, kullanıma hazır olunca 253/254/255\'e aktifleştirilir.',
    ],
  },

  amortisman: {
    uniteId: 'amortisman',
    giris:
      'Amortisman, duran varlıkların yıllık aşınma payını gider yazma yöntemidir. Normal (eşit) ve azalan bakiyeler iki ana yöntem; pay 257 Birikmiş Amortismanlar\'da birikir.',
    neIcin:
      'Bu üniteyi tamamlayınca normal ve azalan amortismanı hesaplayıp doğru hesaba (770/730/760) yazabilir, kıst amortisman uygulayabilir, yenileme fonu (549) düzenleyebilirsin.',
    hesaplar: [
      { kod: '257', ad: 'Birikmiş Amortismanlar (-)', rol: 'Tüm duran varlıkların aşınma payı (kontra aktif).' },
      { kod: '770', ad: 'Genel Yönetim Giderleri', rol: 'Yönetim duran varlıklarının amortismanı.' },
      { kod: '760', ad: 'Pazarlama Satış Dağıtım Giderleri', rol: 'Satış birimi duran varlıklarının amortismanı.' },
      { kod: '730', ad: 'Genel Üretim Giderleri', rol: 'Üretim duran varlıklarının amortismanı.' },
      { kod: '549', ad: 'Özel Fonlar', rol: 'Yenileme fonu uygulaması.' },
    ],
    ornek: {
      baslik: 'Yıllık Amortisman Ayırma (%20 normal yöntem)',
      senaryo:
        '600.000 TL\'lik baskı makinesi (5 yıl ömür, %20 oran). Tam yıl amortismanı 120.000 TL.',
      satirlar: [
        { kod: '730', ad: 'Genel Üretim Giderleri', borc: 120000 },
        { kod: '257', ad: 'Birikmiş Amortismanlar', alacak: 120000 },
      ],
      yorum:
        'Üretim makinesi olduğu için 730\'a; satış aracı olsaydı 760, yönetim demirbaşı olsaydı 770.',
    },
    pufNoktalari: [
      'Amortisman gideri varlığın türüne değil, KULLANIM YERİNE göre yazılır (üretim/satış/yönetim).',
      '257 hep alacak bakiye verir — bilançoda aktif kontra olarak gösterilir.',
      'Azalan bakiyeler yönteminde oran normal yöntemin 2 KATI; net defter değerine uygulanır.',
      'Binek otomobillerde kıst amortisman zorunlu (yıl içi alımda ay sayısına göre).',
    ],
  },

  'reeskont-karsilik': {
    uniteId: 'reeskont-karsilik',
    giris:
      'Dönem sonu değerleme: vadeli alacak/borç senetlerinin bugünkü değerine indirgenmesi (reeskont), şüpheli alacaklar için karşılık ayırma, stok değer düşüklüğü ve kıdem karşılıkları.',
    neIcin:
      'Bu üniteyi tamamlayınca senet reeskontunu (TCMB iç iskonto formülüyle), şüpheli alacak karşılığını (128/129/654), stok değer düşüklüğünü (158) ve kıdem karşılığını (372/472) doğru kaydedebilirsin.',
    hesaplar: [
      { kod: '122', ad: 'Alacak Senetleri Reeskontu (-)', rol: '121\'in kontra hesabı; vade farkı.' },
      { kod: '322', ad: 'Borç Senetleri Reeskontu (-)', rol: '321\'in kontra hesabı; vade farkı.' },
      { kod: '657', ad: 'Reeskont Faiz Giderleri', rol: 'Alacak senedi reeskontu gideri.' },
      { kod: '647', ad: 'Reeskont Faiz Gelirleri', rol: 'Borç senedi reeskontu geliri.' },
      { kod: '128', ad: 'Şüpheli Ticari Alacaklar', rol: 'Tahsili belirsiz alacaklar.' },
      { kod: '129', ad: 'Şüpheli Ticari Alacaklar Karşılığı (-)', rol: '128\'in kontra hesabı.' },
      { kod: '654', ad: 'Karşılık Giderleri', rol: 'Karşılık ayırma anının gideri.' },
      { kod: '158', ad: 'Stok Değer Düşüklüğü Karşılığı (-)', rol: 'Stoktaki değer kaybı.' },
      { kod: '472', ad: 'Kıdem Tazminatı Karşılıkları', rol: 'Uzun vadeli kıdem yükümlülüğü.' },
    ],
    ornek: {
      baslik: 'Şüpheli Alacak Karşılığı Ayırma',
      senaryo:
        '250.000 TL\'lik müşteri alacağı (120) icra takibine alındı, tamamına karşılık ayrılıyor.',
      satirlar: [
        { kod: '128', ad: 'Şüpheli Ticari Alacaklar', borc: 250000 },
        { kod: '120', ad: 'Alıcılar', alacak: 250000 },
        { kod: '654', ad: 'Karşılık Giderleri', borc: 250000 },
        { kod: '129', ad: 'Şüpheli Ticari Alacaklar Karşılığı (-)', alacak: 250000 },
      ],
      yorum:
        'İlk fiş alacağı 120\'den 128\'e taşır. İkinci fiş aynı tutarda karşılık ayırır — 129 ile bilançoda 128 net 0 olur.',
    },
    pufNoktalari: [
      'Alacak senedi reeskontu = GİDER (657); borç senedi reeskontu = GELİR (647). Yön karıştırma!',
      'Reeskont yıl başında ters kayıtla iptal edilir — yoksa çift sayım olur.',
      'Karşılık sonradan tahsil edilirse 644 Konusu Kalmayan Karşılıklar hesabına gelir yazılır.',
      'VUK karşılık koşulları (md. 323): icra takibi veya dava şartı; TTK kapsamı daha geniş.',
    ],
  },

  'stok-degerleme': {
    uniteId: 'stok-degerleme',
    giris:
      'Dönem sonu fiziki sayım, stok yöntemleri (FIFO, ağırlıklı ortalama) ve maliyet hesaplama. Aralıklı envanterde 153\'ün kapanışı, sürekli envanterde dönem sonu mutabakat.',
    neIcin:
      'Bu üniteyi tamamlayınca aralıklı envanterde Satılan Ticari Mallar Maliyeti\'ni (621), sürekli envanterde sayım farklarını (197/397), stok değer düşüklüğünü (158) doğru kaydedebilirsin.',
    hesaplar: [
      { kod: '153', ad: 'Ticari Mallar', rol: 'Stoktaki ticari mal varlığı.' },
      { kod: '150', ad: 'İlk Madde ve Malzeme', rol: 'Üretimde kullanılan hammadde.' },
      { kod: '151', ad: 'Yarı Mamuller', rol: 'Üretim aşamasındaki mallar.' },
      { kod: '152', ad: 'Mamuller', rol: 'Üretimi tamamlanmış mallar.' },
      { kod: '157', ad: 'Diğer Stoklar', rol: 'Hurda, ambalaj malzemesi.' },
      { kod: '159', ad: 'Verilen Sipariş Avansları', rol: 'Yoldaki/konsinye mal.' },
      { kod: '621', ad: 'Satılan Ticari Mallar Maliyeti', rol: 'Aralıklıda dönem sonu, süreklide anlık.' },
      { kod: '158', ad: 'Stok Değer Düşüklüğü Karşılığı (-)', rol: '153\'ün kontra hesabı.' },
    ],
    ornek: {
      baslik: 'Aralıklı Envanter — Dönem Sonu SMM',
      senaryo:
        'Dönem başı stok 200.000, dönem içi alış 1.800.000, alış iadeleri 50.000, dönem sonu stok 350.000.',
      satirlar: [
        { kod: '621', ad: 'Satılan Ticari Mallar Maliyeti', borc: 1600000 },
        { kod: '153', ad: 'Ticari Mallar', alacak: 1600000 },
      ],
      yorum:
        'SMM = (200.000 başı + 1.800.000 alış − 50.000 iade) − 350.000 sonu = 1.600.000. 153 bu tutarla alacaklanır, 621 borçlanır.',
    },
    pufNoktalari: [
      'Aralıklıda 621 kaydı YALNIZ dönem sonunda yapılır; sürekli envanterde her satışta anlık.',
      'FIFO\'da maliyet eski fiyatlar; enflasyon ortamında matrah ve kâr daha yüksek görünür.',
      'Ağırlıklı ortalama: (toplam stok değeri) / (toplam stok adedi) — her giriş sonrası yeniden hesaplanır.',
      'Stok değer düşüklüğü (158) varsa karşılık 654\'e gider, sebebi geçince 644\'e gelir yazılır.',
    ],
  },

  'yabanci-kaynaklar': {
    uniteId: 'yabanci-kaynaklar',
    giris:
      '30. ve 40. grup hesaplar — kısa ve uzun vadeli banka kredileri, finansman giderleri, leasing borçları, kur farkı (646/656). İşletmenin dış finansmanı.',
    neIcin:
      'Bu üniteyi tamamlayınca kredi kullanımını, anapara-faiz ayrımını, banka masraflarını, gider tahakkuklarını (381) ve dövizli kredilerin kur farkını doğru kaydedebilirsin.',
    hesaplar: [
      { kod: '300', ad: 'Banka Kredileri (Kısa Vadeli)', rol: 'Bir yıl içinde geri ödenecek krediler.' },
      { kod: '400', ad: 'Banka Kredileri (Uzun Vadeli)', rol: 'Bir yıldan uzun vadeli krediler.' },
      { kod: '303', ad: 'Uzun Vadeli Kredilerin Anapara Taksitleri', rol: 'Uzun vadelinin kısa vadeliye dönüşen kısmı.' },
      { kod: '780', ad: 'Finansman Giderleri', rol: 'Banka faizi, komisyon, dosya masrafı.' },
      { kod: '381', ad: 'Gider Tahakkukları', rol: 'Tahakkuk etmiş ama henüz ödenmemiş faiz.' },
      { kod: '646', ad: 'Kambiyo Kârları', rol: 'Lehe oluşan kur farkı geliri.' },
      { kod: '656', ad: 'Kambiyo Zararları', rol: 'Aleyhe oluşan kur farkı gideri.' },
    ],
    ornek: {
      baslik: 'Kısa Vadeli Banka Kredisi Kullanımı',
      senaryo:
        '1.000.000 TL kredi alındı. Banka 15.000 TL dosya masrafı kesti, net 985.000 TL hesaba geçti.',
      satirlar: [
        { kod: '102', ad: 'Bankalar', borc: 985000 },
        { kod: '780', ad: 'Finansman Giderleri', borc: 15000 },
        { kod: '300', ad: 'Banka Kredileri', alacak: 1000000 },
      ],
      yorum:
        '300 ANAPARA tutarıyla alacaklanır (1.000.000). Bankaya net giren 985.000, dosya masrafı 780\'e gider yazılır.',
    },
    pufNoktalari: [
      'Anapara ve faiz ödemelerini AYRI kaydet — anapara 300/400 azalır, faiz 780\'e gider.',
      'Uzun vadeli kredinin 1 yıl içinde ödenecek anapara taksitleri 303\'e (kısa vadeliye) aktarılır.',
      'Yıl sonu tahakkuk eden ama ödenmemiş faiz 381 Gider Tahakkukları\'na yazılır.',
      'Dövizli kredilerde her ay sonu yeniden değerleme; lehe 646, aleyhe 656.',
    ],
  },

  'gelir-tablosu': {
    uniteId: 'gelir-tablosu',
    giris:
      '6\'lı kodla başlayan tüm hesaplar — gelir tablosu kalemleri. 60-61-62 (faaliyet gelirleri ve maliyeti), 63 (faaliyet giderleri), 64-65-66 (diğer gelir/gider), 67-68 (olağandışı), 78-79 (finansman ve yansıtma).',
    neIcin:
      'Bu üniteyi tamamlayınca işletmenin gelir tablosunda olağan/olağandışı ve gider/gelir ayrımını doğru yapabilir, fonksiyonel dağıtım için yansıtma hesaplarını (711, 721, 731 vb) işletebilirsin.',
    hesaplar: [
      { kod: '640', ad: 'İştiraklerden Temettü Gelirleri', rol: 'Bağlı ortaklıklardan kar payı.' },
      { kod: '642', ad: 'Faiz Gelirleri', rol: 'Banka mevduat faizi vb.' },
      { kod: '645', ad: 'Menkul Kıymet Satış Karları', rol: 'Hisse-tahvil satış gelirleri.' },
      { kod: '646', ad: 'Kambiyo Kârları', rol: 'Lehe kur farkı.' },
      { kod: '653', ad: 'Komisyon Giderleri', rol: 'Banka POS komisyonu vb.' },
      { kod: '656', ad: 'Kambiyo Zararları', rol: 'Aleyhe kur farkı.' },
      { kod: '679', ad: 'Diğer Olağandışı Gelir ve Karlar', rol: 'MDV satış kârı, sigorta tazminatı.' },
      { kod: '689', ad: 'Diğer Olağandışı Gider ve Zararlar', rol: 'MDV satış zararı, ceza.' },
      { kod: '780', ad: 'Finansman Giderleri', rol: 'Faiz, komisyon, finansman masrafı.' },
      { kod: '781', ad: 'Finansman Giderleri Yansıtma', rol: '780\'in fonksiyonel dağıtımı.' },
    ],
    ornek: {
      baslik: 'Banka Faiz Geliri Kaydı',
      senaryo: 'Vadesiz mevduat hesabına 25.000 TL faiz tahakkuk etti, banka kestiği %15 stopaj sonrası net 21.250 TL hesaba yatırdı.',
      satirlar: [
        { kod: '102', ad: 'Bankalar', borc: 21250 },
        { kod: '193', ad: 'Peşin Ödenen Vergiler ve Fonlar', borc: 3750 },
        { kod: '642', ad: 'Faiz Gelirleri', alacak: 25000 },
      ],
      yorum:
        '642 brüt faizle alacaklanır. Banka kesintisi (stopaj) 193\'e yazılır — yıl sonunda kurumlar vergisinden mahsup edilir.',
    },
    pufNoktalari: [
      'Olağan / olağandışı ayrımı vergisel açıdan önemli — kurumlar vergisi matrahında etki eder.',
      'Faaliyet giderleri (63) işletmenin esas faaliyetiyle ilgili; finansman (78) ayrı bir grup.',
      'Yansıtma hesapları (711, 721 vb) kapanış öncesi 780/770 gibi ana hesapları kapatır.',
      'Komisyon giderleri 653 (genel) veya fonksiyonel olarak 760 (satış POS komisyonu) ayrılabilir.',
    ],
  },

  'donem-sonu-kapanis': {
    uniteId: 'donem-sonu-kapanis',
    giris:
      'Yıl sonu kâr/zarar tespiti ve kapanış işlemleri. Gelir/gider hesapları 690\'a, vergi karşılığı 691/370\'e, net kar 692\'den 590\'a aktarılır. Yansıtma kapatılır, sonraki dönemin açılış kaydı hazırlanır.',
    neIcin:
      'Bu üniteyi tamamlayınca dönem kâr/zararını 690\'a transfer edebilir, kurumlar vergisi karşılığını ayırabilir, kapanış yevmiye kaydını ve sonraki dönemin açılış kaydını doğru hazırlayabilirsin.',
    hesaplar: [
      { kod: '690', ad: 'Dönem Karı veya Zararı', rol: 'Tüm gelir-gider hesaplarının toplandığı geçici hesap.' },
      { kod: '691', ad: 'Dönem Karı Vergi Karşılıkları', rol: 'Hesaplanan kurumlar vergisi gideri.' },
      { kod: '370', ad: 'Dönem Karı Vergi ve Diğer Yasal Yükümlülük Karşılıkları', rol: 'Ödenecek vergi karşılığı (pasif).' },
      { kod: '692', ad: 'Dönem Net Karı veya Zararı', rol: 'Vergi sonrası net kar.' },
      { kod: '590', ad: 'Dönem Net Karı', rol: 'Bilançoda öz kaynak altında.' },
      { kod: '591', ad: 'Dönem Net Zararı (-)', rol: 'Zarar durumunda.' },
      { kod: '540', ad: 'Yasal Yedekler', rol: 'Karın yasal yedek olarak ayrılan kısmı.' },
      { kod: '331', ad: 'Ortaklara Borçlar', rol: 'Temettü dağıtımı.' },
    ],
    ornek: {
      baslik: 'Dönem Karının 690\'a Transferi',
      senaryo:
        'Dönem sonunda 600 hesabı 2.500.000 TL alacak, 770 hesabı 1.800.000 TL borç bakiye verdi.',
      satirlar: [
        { kod: '600', ad: 'Yurt İçi Satışlar', borc: 2500000 },
        { kod: '690', ad: 'Dönem Karı veya Zararı', alacak: 2500000 },
        { kod: '690', ad: 'Dönem Karı veya Zararı', borc: 1800000 },
        { kod: '770', ad: 'Genel Yönetim Giderleri', alacak: 1800000 },
      ],
      yorum:
        '600 ters kayıtla 690\'a alacak transfer edilir. 770 ters kayıtla 690\'a borç. Net 690 = 700.000 TL kâr (alacak bakiyesi).',
    },
    pufNoktalari: [
      'Tüm 6XX (gelir) hesapları 690\'a alacak; tüm 7XX yansıtılan giderler ve 6XX (gider) hesapları 690\'a borç olarak aktarılır.',
      '690 alacak bakiyesi = dönem kârı; borç bakiyesi = zarar.',
      'Vergi karşılığı: 691 borç (gider), 370 alacak (yükümlülük). Sonra 690 → 692 → 590/591.',
      'Açılış kaydı = kapanış kaydının ters çevrilmiş hali. Bilanço hesapları sonraki yıla devreder.',
    ],
  },
};

/**
 * Migration öncesi geriye uyum: eski 11 ünite ID'leri yeni 15 ünite
 * yapısındaki en yakın içeriğe yönlendirilir. Migration uygulandıktan
 * sonra DB'de eski ID kalmadığından bu map fiilen kullanılmaz; safety
 * net olarak duruyor.
 */
const ESKI_YENI_MAP: Record<string, string> = {
  kasa: 'hazir-degerler',
  banka: 'hazir-degerler',
  mal: 'mal-alis',
  senet: 'ticari-alacaklar',
  'donem-sonu': 'reeskont-karsilik',
  'supheli-alacaklar': 'reeskont-karsilik',
  reeskont: 'reeskont-karsilik',
  kambiyo: 'yabanci-kaynaklar',
};

export const konuAnlatimGetir = (uniteId: string): KonuAnlatim | null => {
  const direct = KONU_ANLATIMLAR[uniteId];
  if (direct) return direct;
  const yeni = ESKI_YENI_MAP[uniteId];
  if (yeni) return KONU_ANLATIMLAR[yeni] ?? null;
  return null;
};
