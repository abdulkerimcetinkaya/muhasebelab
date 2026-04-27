/**
 * Ünite konu anlatımları — kullanıcı her üniteye ilk girdiğinde
 * konuyu hatırlatan kısa rehberler. İçerikler AI taslak olarak
 * üretildi; profesyonel muhasebe editörü tarafından gözden
 * geçirilecek.
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
  kasa: {
    uniteId: 'kasa',
    giris:
      'Kasa, işletmenin nakit varlıklarını izlediği en likit hesaptır. Tüm para giriş çıkışları gün gün buradan akar — perakende satış tahsilatı, gider ödemeleri, personel avansı, sayım farkları.',
    neIcin:
      'Bu üniteyi tamamlayınca işletme kasasında olan biten her hareketi yevmiye fişine doğru kaydedebilir, KDV dahil/hariç ayrımını yapabilir, kasa sayımındaki noksanlık ve fazlalıkları doğru hesaplara aktarabilirsin.',
    hesaplar: [
      { kod: '100', ad: 'Kasa', rol: 'Nakit hareketlerin merkezi. Para girince borç, çıkınca alacak.' },
      { kod: '197', ad: 'Sayım ve Tesellüm Noksanları', rol: 'Sayım sonucu eksik çıkan kasa farklarının geçici izlendiği aktif hesap.' },
      { kod: '397', ad: 'Sayım ve Tesellüm Fazlaları', rol: 'Sayım sonucu fazla çıkan kasa tutarlarının geçici izlendiği pasif hesap.' },
      { kod: '196', ad: 'Personel Avansları', rol: 'Personele kasadan verilen geçici avanslar.' },
      { kod: '600', ad: 'Yurt İçi Satışlar', rol: 'Peşin perakende satışta matrah tutarı.' },
      { kod: '391', ad: 'Hesaplanan KDV', rol: 'Satış üzerinden hesaplanan KDV.' },
    ],
    ornek: {
      baslik: 'Peşin Perakende Satış (KDV %10)',
      senaryo:
        'Şube 1.000 TL matrahlı, %10 KDV ile toplam 1.100 TL nakit satış yapıyor.',
      satirlar: [
        { kod: '100', ad: 'Kasa', borc: 1100 },
        { kod: '600', ad: 'Yurt İçi Satışlar', alacak: 1000 },
        { kod: '391', ad: 'Hesaplanan KDV', alacak: 100 },
      ],
      yorum:
        'Kasa KDV dahil toplam ile borçlandırılır. Matrah satışlara, KDV hesaplananlara ayrı yazılır.',
    },
    pufNoktalari: [
      'Kasa hep KDV dahil toplam ile çalışır — matrahla karıştırma.',
      'Aralıklı envanter yönteminde satış anında maliyet (621) kaydı yapılmaz; dönem sonu envanterle hesaplanır.',
      'Personel avansı (196) bir alacak hesabıdır, gider değil — masraf belgesi gelince mahsup edilir.',
      'Sayım noksanlığı önce 197’ye atılır; sebebi netleşince 689 veya ilgili gider hesabına aktarılır.',
    ],
  },

  banka: {
    uniteId: 'banka',
    giris:
      'Banka hesabı, dijital nakit akışının izlendiği yerdir. Havale, EFT, kredi taksiti, banka masrafı, kart komisyonu gibi her hareket dekonta dayanır.',
    neIcin:
      'Bu üniteyi tamamlayınca dekontu okuyup havale/EFT, kredi kullanımı ve geri ödeme, banka masrafı ve KDV ayrımını sorunsuz kaydedebilirsin.',
    hesaplar: [
      { kod: '102', ad: 'Bankalar', rol: 'Vadesiz mevduatın izlendiği aktif hesap.' },
      { kod: '103', ad: 'Verilen Çekler ve Ödeme Emirleri (-)', rol: 'Bankaya ödeme talimatı verilmiş ama henüz ödenmemiş tutarlar.' },
      { kod: '300', ad: 'Banka Kredileri', rol: 'Kısa vadeli banka kredisi pasif hesabı.' },
      { kod: '400', ad: 'Banka Kredileri', rol: 'Uzun vadeli banka kredisi pasif hesabı.' },
      { kod: '780', ad: 'Finansman Giderleri', rol: 'Banka faizi, komisyon ve masraflar.' },
      { kod: '770', ad: 'Genel Yönetim Giderleri', rol: 'Genel banka masrafları yönetim giderine yazılabilir.' },
    ],
    ornek: {
      baslik: 'Müşteriden Havale Tahsilatı',
      senaryo: 'Müşteri X 5.000 TL’lik açık hesap borcunu banka havalesiyle ödedi.',
      satirlar: [
        { kod: '102', ad: 'Bankalar', borc: 5000 },
        { kod: '120', ad: 'Alıcılar', alacak: 5000 },
      ],
      yorum:
        'Banka borçlanır (para girdi), Alıcılar hesabı alacaklanır (alacağımız kapandı).',
    },
    pufNoktalari: [
      '102 ile 320/120 arasındaki yön çok karıştırılır — paranın hangi tarafa aktığını hep önce zihnen çiz.',
      'Banka masrafı ve faizi 780’e, dövizli işlemlerde kur farkı 646/656’ya ayrı yazılır.',
      'Kredi anaparası 300/400, faizi gider; 300/400 hesabını faiz tutarıyla şişirme.',
      'Kart komisyonu 760 (pazarlama) veya 770 olarak ayrıştırılabilir — politikaya bak.',
    ],
  },

  mal: {
    uniteId: 'mal',
    giris:
      'Ticari mal alım ve satımı, bir ticaret işletmesinin omurgasıdır. Faturadaki matrah, KDV, iskonto ve navlun gibi kalemleri doğru ayırarak hem stok hem maliyet hem de hasılat akışını oluşturursun.',
    neIcin:
      'Bu üniteyi tamamlayınca alış faturasını 153/191/320’ye, satış faturasını 120/600/391’e doğru paylaştırabilir; sürekli envanter yönteminde 621 ve 153 hesaplarını birlikte çalıştırabilirsin.',
    hesaplar: [
      { kod: '153', ad: 'Ticari Mallar', rol: 'Stoktaki ticari mal varlığı.' },
      { kod: '191', ad: 'İndirilecek KDV', rol: 'Alışta ödenen, ileride mahsup edilecek KDV.' },
      { kod: '320', ad: 'Satıcılar', rol: 'Satıcıya olan açık hesap borcu.' },
      { kod: '120', ad: 'Alıcılar', rol: 'Müşteriden olan açık hesap alacağı.' },
      { kod: '600', ad: 'Yurt İçi Satışlar', rol: 'Satış matrahı.' },
      { kod: '391', ad: 'Hesaplanan KDV', rol: 'Satışta tahsil edilen KDV.' },
      { kod: '621', ad: 'Satılan Ticari Mallar Maliyeti', rol: 'Sürekli envanterde satışın maliyeti.' },
      { kod: '610', ad: 'Satıştan İadeler (-)', rol: 'Satılan malın iadesi.' },
      { kod: '611', ad: 'Satış İskontoları (-)', rol: 'Satıştan sonraki iskonto/risturn.' },
    ],
    ornek: {
      baslik: 'Vadeli Mal Alışı (KDV %20)',
      senaryo:
        'Satıcıdan 10.000 TL matrahlı, %20 KDV’li, 12.000 TL toplam vadeli mal alındı.',
      satirlar: [
        { kod: '153', ad: 'Ticari Mallar', borc: 10000 },
        { kod: '191', ad: 'İndirilecek KDV', borc: 2000 },
        { kod: '320', ad: 'Satıcılar', alacak: 12000 },
      ],
      yorum:
        'Mal stoğa matrah ile girer, KDV ayrı 191’e gider. Borç tarafı (12.000), satıcılara olan toplam yükümlülüktür.',
    },
    pufNoktalari: [
      'Faturadaki iskonto, alış maliyetini düşürür — 153’ü brüt yazma, net matrahla yaz.',
      'Navlun, malı işletmeye getiriyorsa 153’e (maliyet); satışla ilgiliyse 760’a yazılır.',
      'Sürekli envanterde her satışta 621 borç / 153 alacak kaydı eklenir; aralıklıda dönem sonu yapılır.',
      'Satış iadesi 610 (kontra hesap) — doğrudan 600’ü düşürmek yerine kullan.',
    ],
  },

  senet: {
    uniteId: 'senet',
    giris:
      'Çek ve senetler vadeli ticaretin temel ödeme araçlarıdır. Alınan/verilen senetler, ciro işlemleri, karşılıksız çıkma ve protesto gibi durumların hepsi farklı hesap kombinasyonları gerektirir.',
    neIcin:
      'Bu üniteyi tamamlayınca senet alacaklarını 121/321’de takip edebilir, ciro ettiğin senetleri doğru aktarabilir, karşılıksız çek/senedi 128 (şüpheli) hesabına alabilirsin.',
    hesaplar: [
      { kod: '101', ad: 'Alınan Çekler', rol: 'Müşteriden alınan vadesi gelmemiş çekler.' },
      { kod: '121', ad: 'Alacak Senetleri', rol: 'Müşteriden alınan senetli alacaklar.' },
      { kod: '321', ad: 'Borç Senetleri', rol: 'Satıcıya verilen senetli borçlar.' },
      { kod: '103', ad: 'Verilen Çekler ve Ödeme Emirleri (-)', rol: 'Satıcıya verdiğimiz çekler.' },
      { kod: '128', ad: 'Şüpheli Ticari Alacaklar', rol: 'Karşılıksız çıkan/protestolu senet ve çekler.' },
      { kod: '320', ad: 'Satıcılar', rol: 'Açık hesap borcumuz — senet verilince 321’e döner.' },
    ],
    ornek: {
      baslik: 'Müşteriden Senet Alımı',
      senaryo:
        'Müşterinin 10.000 TL’lik açık hesap borcu için 3 ay vadeli senet alındı.',
      satirlar: [
        { kod: '121', ad: 'Alacak Senetleri', borc: 10000 },
        { kod: '120', ad: 'Alıcılar', alacak: 10000 },
      ],
      yorum: 'Açık hesap senetli alacağa dönüştü; varlığın türü değişti, tutar aynı.',
    },
    pufNoktalari: [
      'Senedin ciro edilmesi, varlığın bizden çıktığı anlamına gelir — 121 alacaklanır.',
      'Karşılıksız çıkan çek/senet doğrudan 689’a değil, önce 128’e alınır.',
      'Verilen çek 103’tür ve aktif kontra hesaptır; bilançoda 102’den düşer.',
      'Reeskont kayıtları senet ve çekler için ayrıca yapılır (122/322/647/657).',
    ],
  },

  kdv: {
    uniteId: 'kdv',
    giris:
      'KDV, alış ve satışlarda hesaplanan dolaylı bir vergidir. Ay sonu mahsup işleminde 191 ile 391 karşılaştırılır; fark ödenir veya devreden olarak sonraki aya aktarılır.',
    neIcin:
      'Bu üniteyi tamamlayınca ay sonu KDV mahsubunu kurabilir, devreden KDV (190) hesabını yönetebilir, tahakkuk eden KDV ödemelerini doğru kaydedebilirsin.',
    hesaplar: [
      { kod: '191', ad: 'İndirilecek KDV', rol: 'Alışta ödenen, mahsup edilecek KDV (aktif).' },
      { kod: '391', ad: 'Hesaplanan KDV', rol: 'Satışta tahsil edilen KDV (pasif).' },
      { kod: '190', ad: 'Devreden KDV', rol: 'Mahsup sonrası kalan ve sonraki aya devreden alacak.' },
      { kod: '360', ad: 'Ödenecek Vergi ve Fonlar', rol: 'Mahsup sonrası ödenecek KDV ve diğer vergiler.' },
    ],
    ornek: {
      baslik: 'Ay Sonu KDV Mahsubu (391 > 191)',
      senaryo:
        'Ay sonunda 391 Hesaplanan KDV 5.000 TL alacak bakiyesi, 191 İndirilecek KDV 3.000 TL borç bakiyesi veriyor.',
      satirlar: [
        { kod: '391', ad: 'Hesaplanan KDV', borc: 5000 },
        { kod: '191', ad: 'İndirilecek KDV', alacak: 3000 },
        { kod: '360', ad: 'Ödenecek Vergi ve Fonlar', alacak: 2000 },
      ],
      yorum:
        '391 kapatılır, 191 kapatılır, kalan 2.000 TL ödenecek KDV olarak 360’a yazılır.',
    },
    pufNoktalari: [
      '191 borç bakiyesi 391 alacak bakiyesinden büyükse, fark 190 Devreden KDV’ye yazılır.',
      'Tevkifatlı satışlarda KDV’nin bir kısmı alıcı tarafından sorumlu sıfatıyla beyan edilir — 391 kısmen yazılır.',
      'KDV mahsubu hep ay sonu yapılır; aybaşında 190 önceki aydan gelen alacaktır.',
      '360 sadece KDV için değil — stopaj, damga vb. tüm ödenecek vergiler buraya yazılır.',
    ],
  },

  amortisman: {
    uniteId: 'amortisman',
    giris:
      'Duran varlıklar (demirbaş, taşıt, makine) zamanla aşınır. Amortisman, bu aşınmayı yıllık olarak gider yazma yöntemidir. Normal ve azalan bakiyeler iki ana yöntemdir.',
    neIcin:
      'Bu üniteyi tamamlayınca duran varlık alımını, yıllık amortisman ayırma kaydını, varlık satışını ve hurdaya ayırmayı 257 birikmiş amortisman hesabıyla doğru çalıştırabilirsin.',
    hesaplar: [
      { kod: '253', ad: 'Tesis, Makine ve Cihazlar', rol: 'Üretim ekipmanları.' },
      { kod: '254', ad: 'Taşıtlar', rol: 'Şirket araçları.' },
      { kod: '255', ad: 'Demirbaşlar', rol: 'Mobilya, ofis ekipmanı vb.' },
      { kod: '257', ad: 'Birikmiş Amortismanlar (-)', rol: 'Tüm duran varlıkların aşınma payı (kontra aktif).' },
      { kod: '770', ad: 'Genel Yönetim Giderleri', rol: 'Yönetim duran varlıklarının amortismanı.' },
      { kod: '760', ad: 'Pazarlama Satış ve Dağıtım Giderleri', rol: 'Satış birimi duran varlıklarının amortismanı.' },
      { kod: '730', ad: 'Genel Üretim Giderleri', rol: 'Üretim duran varlıklarının amortismanı.' },
    ],
    ornek: {
      baslik: 'Yıllık Amortisman Ayırma (Demirbaş, %20)',
      senaryo:
        '50.000 TL’lik demirbaş için yıllık %20 amortisman ayrılıyor (10.000 TL).',
      satirlar: [
        { kod: '770', ad: 'Genel Yönetim Giderleri', borc: 10000 },
        { kod: '257', ad: 'Birikmiş Amortismanlar', alacak: 10000 },
      ],
      yorum:
        'Amortisman gideri kullanım yerine göre 7XX hesabına; pay 257’ye birikmiş amortismana yazılır.',
    },
    pufNoktalari: [
      'Amortisman gideri varlığın türüne değil, KULLANIM YERİNE göre yazılır (üretim, satış, yönetim).',
      '257 hep alacak bakiye verir — bilançoda aktif kontra olarak gösterilir.',
      'Varlık satılırken net defter değeri = alış − birikmiş amortisman; satış kâr/zararı buradan hesaplanır.',
      'Azalan bakiyeler yönteminde amortisman oranı normal yöntemin 2 katıdır; net defter değerine uygulanır.',
    ],
  },

  personel: {
    uniteId: 'personel',
    giris:
      'Personel ücret kayıtları bordro tabanlıdır. Brüt ücretten SGK işçi payı, gelir vergisi ve damga vergisi kesilir; işveren ayrıca SGK işveren payını yüklenir.',
    neIcin:
      'Bu üniteyi tamamlayınca bordroyu yevmiye fişine çevirebilir, brüt-net ayrımını yapabilir, SGK ve stopaj hesaplarını ayrı kalemlere ayırabilirsin.',
    hesaplar: [
      { kod: '770', ad: 'Genel Yönetim Giderleri', rol: 'Beyaz yaka ücret giderlerinin yazıldığı yer.' },
      { kod: '720', ad: 'Direkt İşçilik Giderleri', rol: 'Üretim hattındaki personel ücretleri.' },
      { kod: '730', ad: 'Genel Üretim Giderleri', rol: 'Endirekt üretim personeli (örn. ustabaşı).' },
      { kod: '335', ad: 'Personele Borçlar', rol: 'Net olarak personele ödenecek tutar.' },
      { kod: '360', ad: 'Ödenecek Vergi ve Fonlar', rol: 'Stopaj ve damga vergisi.' },
      { kod: '361', ad: 'Ödenecek Sosyal Güvenlik Kesintileri', rol: 'SGK işçi + işveren payı toplamı.' },
      { kod: '196', ad: 'Personel Avansları', rol: 'Önceden verilen avans — net ücretten mahsup edilir.' },
    ],
    ornek: {
      baslik: 'Aylık Bordro Kaydı (basit örnek)',
      senaryo:
        'Brüt ücret 30.000 TL. SGK işçi 4.500, gelir vergisi 4.000, damga 230, SGK işveren 6.000 TL.',
      satirlar: [
        { kod: '770', ad: 'Genel Yönetim Giderleri', borc: 36000 },
        { kod: '335', ad: 'Personele Borçlar', alacak: 21270 },
        { kod: '360', ad: 'Ödenecek Vergi ve Fonlar', alacak: 4230 },
        { kod: '361', ad: 'Ödenecek Sosyal Güvenlik Kesintileri', alacak: 10500 },
      ],
      yorum:
        '770 borç tarafı brüt + işveren payı = işverenin toplam yüklenimi. Net 21.270 personele, kesintiler 360 ve 361’e gider.',
    },
    pufNoktalari: [
      '770 (veya 720/730) tarafına BRÜT ÜCRET + SGK İŞVEREN PAYI yazılır — sadece brüt değil.',
      'Net ücret 335’e, kesintiler ayrı 360 ve 361 hesaplarına ayrılır — toplam 360’a basma.',
      'Avans varsa 335’in tutarından düşülür ve 196 alacak yazılır (mahsup).',
      'Damga vergisi de 360’a yazılır — gelir vergisiyle aynı hesaba.',
    ],
  },

  'donem-sonu': {
    uniteId: 'donem-sonu',
    giris:
      'Dönem sonu işlemleri, gerçek faaliyet sonucunu çıkarmak için yapılan ayarlama kayıtlarıdır. Peşin ödenmiş giderlerin gelecek döneme ait kısımları, henüz tahakkuk etmemiş gelir ve giderler bu aşamada düzeltilir.',
    neIcin:
      'Bu üniteyi tamamlayınca peşin gider/gelir ayrıştırmasını (180/280, 380/480) ve tahakkuk kayıtlarını (181, 381) doğru kurabilirsin.',
    hesaplar: [
      { kod: '180', ad: 'Gelecek Aylara Ait Giderler', rol: 'Peşin ödenmiş ama gelecek aylara ait gider tutarı (kısa vade).' },
      { kod: '280', ad: 'Gelecek Yıllara Ait Giderler', rol: 'Peşin ödenmiş ama gelecek yıllara ait kısım.' },
      { kod: '181', ad: 'Gelir Tahakkukları', rol: 'Henüz tahsil edilmemiş ama bu döneme ait gelir alacağı.' },
      { kod: '380', ad: 'Gelecek Aylara Ait Gelirler', rol: 'Peşin tahsil edilmiş gelecek aylara ait gelir.' },
      { kod: '480', ad: 'Gelecek Yıllara Ait Gelirler', rol: 'Peşin tahsil edilmiş gelecek yıllara ait gelir.' },
      { kod: '381', ad: 'Gider Tahakkukları', rol: 'Henüz ödenmemiş ama bu döneme ait gider yükümlülüğü.' },
    ],
    ornek: {
      baslik: 'Peşin Ödenmiş Sigorta Giderinin Ayrıştırılması',
      senaryo:
        '12.000 TL’lik 1 yıllık sigorta primi 1 Ekim’de ödendi, dönem sonu 31 Aralık. 9.000 TL sonraki yılın 9 ayına ait.',
      satirlar: [
        { kod: '280', ad: 'Gelecek Yıllara Ait Giderler', borc: 9000 },
        { kod: '770', ad: 'Genel Yönetim Giderleri', alacak: 9000 },
      ],
      yorum:
        '770’ten 9.000 TL’si gelecek yıla ait olduğu için çıkarılır ve 280’e taşınır. Sadece bu yılın 3 aylık 3.000 TL’si dönem giderine kalır.',
    },
    pufNoktalari: [
      '180/280 → varlık (peşin ödenmiş gider). 380/480 → yükümlülük (peşin tahsil edilmiş gelir).',
      '181 ve 381 → tahakkuk kayıtları, dönem kâr/zararını düzeltir.',
      '12 ay içinde tüketilecek kısım 180/380; sonrası 280/480.',
      'Bir sonraki dönem başında ters kayıtla otomatik düzeltme yapılır (geri çevirme yöntemi).',
    ],
  },

  'supheli-alacaklar': {
    uniteId: 'supheli-alacaklar',
    giris:
      'Bir alacağın tahsili belirsizleştiğinde, alacak şüpheli statüye geçer. Karşılık ayırarak hem dönem giderini gerçekçi yansıtır hem de aktiften düşmüş gibi gösterirsin.',
    neIcin:
      'Bu üniteyi tamamlayınca alacağı 128’e taşıyabilir, 129’a karşılık ayırabilir, sonradan tahsilat veya değersiz çıkma durumlarını doğru kapatabilirsin.',
    hesaplar: [
      { kod: '128', ad: 'Şüpheli Ticari Alacaklar', rol: 'Tahsili belirsizleşen alacaklar (aktif).' },
      { kod: '129', ad: 'Şüpheli Ticari Alacaklar Karşılığı (-)', rol: '128’in kontra hesabı; ayrılan karşılık.' },
      { kod: '654', ad: 'Karşılık Giderleri', rol: 'Karşılık ayırma anının gideri.' },
      { kod: '644', ad: 'Konusu Kalmayan Karşılıklar', rol: 'Tahsil edilince geri yazılan karşılık geliri.' },
      { kod: '659', ad: 'Diğer Olağan Gider ve Zararlar', rol: 'Değersiz çıkan alacağın kalan zararı.' },
      { kod: '120', ad: 'Alıcılar', rol: 'Şüpheli olmadan önceki açık hesap.' },
      { kod: '121', ad: 'Alacak Senetleri', rol: 'Şüpheli olmadan önceki senet.' },
    ],
    ornek: {
      baslik: 'Şüpheli Alacak ve Karşılık Ayırma',
      senaryo:
        'Müşteri X’ten olan 10.000 TL’lik alacak (120) şüpheli hale geldi. Tamamına karşılık ayrılıyor.',
      satirlar: [
        { kod: '128', ad: 'Şüpheli Ticari Alacaklar', borc: 10000 },
        { kod: '120', ad: 'Alıcılar', alacak: 10000 },
        { kod: '654', ad: 'Karşılık Giderleri', borc: 10000 },
        { kod: '129', ad: 'Şüpheli Tic. Al. Karşılığı (-)', alacak: 10000 },
      ],
      yorum:
        'İlk fiş alacağı 120’den 128’e taşır. İkinci fiş aynı tutarda karşılık ayırır — 129 ile bilançoda 128 net 0 olur.',
    },
    pufNoktalari: [
      '128 ve 129 daima birlikte düşünülür — 128 brüt, 129 ile netlenir.',
      'Sonradan tahsilat olursa 129 kapatılır (alacak), karşılığı 644’e gelir yazılır.',
      'Değersiz çıkarsa 128 kapatılır (alacak), 129 da kapanır; fark varsa 659’a zarar yazılır.',
      'Vergi mevzuatında karşılık için icra/dava şartı vardır — TTK kapsamı geniştir.',
    ],
  },

  reeskont: {
    uniteId: 'reeskont',
    giris:
      'Vadeli alacak ve borç senetleri dönem sonunda nominal değerle değil, bugünkü değeriyle değerlenir. Aradaki vade farkı reeskont olarak ayrılır ve gelir/gider tablosunu düzeltir.',
    neIcin:
      'Bu üniteyi tamamlayınca alacak senedi reeskontunu (122/657) ve borç senedi reeskontunu (322/647) hesaplayıp dönem sonunda doğru kaydedebilir, dönem başında ters kayıtla geri çevirebilirsin.',
    hesaplar: [
      { kod: '121', ad: 'Alacak Senetleri', rol: 'Vadeli senet alacakları (nominal).' },
      { kod: '122', ad: 'Alacak Senetleri Reeskontu (-)', rol: '121’in kontra hesabı; vade farkı.' },
      { kod: '321', ad: 'Borç Senetleri', rol: 'Vadeli senet borçları (nominal).' },
      { kod: '322', ad: 'Borç Senetleri Reeskontu (-)', rol: '321’in kontra hesabı; vade farkı.' },
      { kod: '647', ad: 'Reeskont Faiz Gelirleri', rol: 'Borç senedi reeskontunun geliri (323 kontra → kaynak fazlası gibi).' },
      { kod: '657', ad: 'Reeskont Faiz Giderleri', rol: 'Alacak senedi reeskontunun gideri.' },
    ],
    ornek: {
      baslik: 'Alacak Senedi Reeskontu',
      senaryo:
        '10.000 TL nominal değerli, 3 ay vadeli senet için %20 yıllık faiz oranıyla reeskont hesaplandı: 500 TL.',
      satirlar: [
        { kod: '657', ad: 'Reeskont Faiz Giderleri', borc: 500 },
        { kod: '122', ad: 'Alacak Senetleri Reeskontu (-)', alacak: 500 },
      ],
      yorum:
        'Alacağın bugünkü değeri 9.500 TL. Aradaki 500 TL’lik vade faizi henüz gerçekleşmemiş — bu döneme gelir yazılmaz, gider olarak ayrılır.',
    },
    pufNoktalari: [
      'Alacak reeskontu GİDER (657), borç reeskontu GELİR (647) yazılır — yön karıştırma.',
      'Reeskont kontra hesapları 122 ve 322; bilançoda 121 ve 321’den net olarak gösterilir.',
      'Dönem başında reeskont kayıtları ters kayıtla geri çevrilir.',
      'Reeskont sadece SENETLİ alacak/borçlara yapılır — açık hesaba (120/320) yapılmaz.',
    ],
  },

  kambiyo: {
    uniteId: 'kambiyo',
    giris:
      'Kambiyo işlemleri, dövizli alacak, borç ve nakit hareketlerinin Türk Lirası karşılığını dönem sonunda günün kuruyla değerleyip kur farkını gelir veya gider olarak yansıtmaktır.',
    neIcin:
      'Bu üniteyi tamamlayınca dövizli işlemleri kayıt anının kuru ile yapabilir, tahsilat/ödeme anlarındaki kur farklarını ve yıl sonu değerlemesini 646/656 hesaplarına doğru aktarabilirsin.',
    hesaplar: [
      { kod: '102', ad: 'Bankalar (Döviz)', rol: 'Dövizli banka hesabı.' },
      { kod: '120', ad: 'Alıcılar', rol: 'Dövizli açık hesap alacağı.' },
      { kod: '320', ad: 'Satıcılar', rol: 'Dövizli açık hesap borcu.' },
      { kod: '646', ad: 'Kambiyo Kârları', rol: 'Lehe oluşan kur farkı geliri.' },
      { kod: '656', ad: 'Kambiyo Zararları', rol: 'Aleyhe oluşan kur farkı gideri.' },
      { kod: '780', ad: 'Finansman Giderleri', rol: 'Bazı işletmeler kur farkını burada izler — politikaya göre.' },
    ],
    ornek: {
      baslik: 'Dövizli Tahsilatta Kur Farkı (Lehe)',
      senaryo:
        '1.000 USD’lik alacak kayıt anında 30 TL kurla 30.000 TL yazıldı. Tahsilat anında kur 32 TL — bankaya 32.000 TL girdi.',
      satirlar: [
        { kod: '102', ad: 'Bankalar', borc: 32000 },
        { kod: '120', ad: 'Alıcılar', alacak: 30000 },
        { kod: '646', ad: 'Kambiyo Kârları', alacak: 2000 },
      ],
      yorum:
        'Banka tahsilat günü kuruyla TL girdiği tutarı borç yazar. Alıcılar kayıt anındaki tutarla kapatılır. Aradaki 2.000 TL lehe kur farkı 646’ya gelir.',
    },
    pufNoktalari: [
      'Dövizli alacak/borç hep kayıt anının kuru ile TL’ye çevrilir; tahsilat/ödeme günü kuruyla fark doğar.',
      'Yıl sonu değerlemesinde mevduat ve dövizli alacak/borçlar Hazine kuru ile yeniden değerlenir.',
      'Lehe fark 646’ya gelir, aleyhe fark 656’ya gider — ikisini karıştırma.',
      'Kasadaki yabancı para da yıl sonu değerlemesine girer — sadece banka değil.',
    ],
  },
};

export const konuAnlatimGetir = (uniteId: string): KonuAnlatim | null =>
  KONU_ANLATIMLAR[uniteId] ?? null;
