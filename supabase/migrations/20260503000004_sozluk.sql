-- MuhasebeLab — Mali Sözlük
--
-- SEO odaklı terimler havuzu. Her terim ayrı sayfa olarak servis edilir
-- (/sozluk/:slug). Kullanım: anonim okuma (Google crawler için),
-- admin yazar.

create table public.sozluk_terimleri (
  slug text primary key,                     -- "amortisman", "yevmiye-kaydi"
  baslik text not null,                      -- "Amortisman"
  kisa_aciklama text not null,               -- 1-2 cümle, meta description için
  uzun_icerik text not null,                 -- markdown / düz metin
  ornek text,                                -- opsiyonel örnek
  ilgili_terimler text[] not null default '{}',  -- diğer slug'lar
  ilgili_unite_ids int[] not null default '{}',  -- ünite kimlikleri
  ilgili_hesap_kodlari text[] not null default '{}',  -- TDHP hesap kodları
  goruntuleme_sayisi int not null default 0,
  yayinda boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sozluk_yayinda_baslik_idx
  on public.sozluk_terimleri (yayinda, baslik);

alter table public.sozluk_terimleri enable row level security;

-- Anon + authenticated yayındaki terimleri okur (SEO için kritik)
drop policy if exists "sozluk_public_read" on public.sozluk_terimleri;
create policy "sozluk_public_read" on public.sozluk_terimleri
  for select using (yayinda = true);

-- Admin tüm CRUD
drop policy if exists "sozluk_admin_select_all" on public.sozluk_terimleri;
create policy "sozluk_admin_select_all" on public.sozluk_terimleri
  for select using (public.is_admin());

drop policy if exists "sozluk_admin_insert" on public.sozluk_terimleri;
create policy "sozluk_admin_insert" on public.sozluk_terimleri
  for insert with check (public.is_admin());

drop policy if exists "sozluk_admin_update" on public.sozluk_terimleri;
create policy "sozluk_admin_update" on public.sozluk_terimleri
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "sozluk_admin_delete" on public.sozluk_terimleri;
create policy "sozluk_admin_delete" on public.sozluk_terimleri
  for delete using (public.is_admin());

-- updated_at otomatik
create or replace function public.sozluk_updated_at_trigger()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists sozluk_updated_at on public.sozluk_terimleri;
create trigger sozluk_updated_at
  before update on public.sozluk_terimleri
  for each row execute function public.sozluk_updated_at_trigger();

-- ─── Görüntüleme sayacı RPC (anon da çağırabilsin diye SECURITY DEFINER) ──
create or replace function public.sozluk_goruntule(_slug text)
returns void language plpgsql security definer
set search_path = public
as $$
begin
  update sozluk_terimleri
     set goruntuleme_sayisi = goruntuleme_sayisi + 1
   where slug = _slug and yayinda = true;
end $$;

grant execute on function public.sozluk_goruntule(text) to anon, authenticated;

-- ─── İlk 20 terim (yüksek arama hacmi) ──────────────────────────────────
insert into public.sozluk_terimleri
  (slug, baslik, kisa_aciklama, uzun_icerik, ornek, ilgili_terimler, ilgili_hesap_kodlari)
values
(
  'amortisman',
  'Amortisman',
  'Bir duran varlığın (makine, bina, taşıt) yararlı ömrü boyunca yıllara dağıtılan yıpranma giderine amortisman denir. Maliyet, kullanıldığı dönemler arasında bölüştürülür.',
  'Amortisman, işletmenin uzun süre kullandığı varlıkların değerini, kullanım süresine yayan muhasebe yöntemidir. Bir makineyi 100.000 TL''ye alıp 10 yıl kullanacaksan, makinenin maliyeti tek seferde değil, 10 yıla bölünerek gider yazılır. Her yıl 10.000 TL amortisman gideri kaydedilir.

Türkiye''de amortisman oranları Vergi Usul Kanunu (VUK) ve Maliye Bakanlığı''nın yıllık tebliğleri ile belirlenir. Eşit (normal) amortisman ve azalan bakiyeler yöntemi en yaygın iki yöntemdir.

Muhasebe kayıtlarında amortisman gideri 770 Genel Yönetim Giderleri (veya 730 Genel Üretim Gideri) hesabına borç, 257 Birikmiş Amortismanlar hesabına alacak yazılır. 257 hesabı bilançoda duran varlığı azaltıcı (kontra) bir hesaptır.',
  'Örnek: 60.000 TL''lik taşıtı 5 yıl boyunca eşit amortismana tabi tutmak istiyoruz. Yıllık amortisman = 60.000 / 5 = 12.000 TL. Yevmiye kaydı: 770 Genel Yönetim Giderleri 12.000 / 257 Birikmiş Amortismanlar 12.000.',
  array['duran-varlik', 'yevmiye-kaydi', 'vuk'],
  array['257', '770', '730']
),
(
  'kdv',
  'KDV (Katma Değer Vergisi)',
  'KDV, mal ve hizmet teslimlerinden alınan dolaylı bir tüketim vergisidir. Türkiye''de oranlar %1, %10 ve %20 olarak uygulanır. İşletme alışta KDV''yi indirim, satışta hesaplanan KDV olarak takip eder.',
  'Katma Değer Vergisi (KDV), 3065 sayılı KDV Kanunu''na göre Türkiye''de yapılan mal ve hizmet teslimlerine uygulanan dolaylı bir vergidir. Tüketici öder, işletme tahsil edip devlete aktarır.

İşletmeler iki KDV''yi takip eder:
- **191 İndirilecek KDV**: Aldıkları mal ve hizmetlere ödedikleri KDV (alacak hakkı)
- **391 Hesaplanan KDV**: Sattıkları için tahsil ettikleri KDV (ödeme borcu)

Ay sonunda 391 ile 191 mahsup edilir. 391 > 191 ise fark "ödenecek KDV" (360 hesabı), tersi olursa "devreden KDV" olarak ertesi aya taşınır.

Türkiye''de KDV oranları: %1 (temel gıda, kitap), %10 (bazı tarım, gıda, yapı), %20 (genel oran).

KDV beyannamesi her ayın 28''ine kadar verilir, 28''ine kadar ödenir.',
  'Örnek: 1.000 TL''ye satış yaptın, %20 KDV uygulandı. Müşteriden 1.200 TL aldın. Yevmiye: 100 Kasa 1.200 / 600 Yurtiçi Satışlar 1.000, 391 Hesaplanan KDV 200.',
  array['hesaplanan-kdv', 'indirilecek-kdv', 'beyanname'],
  array['191', '391', '360']
),
(
  'yevmiye-kaydi',
  'Yevmiye Kaydı',
  'Bir mali olayın gerçekleştiği tarihte hangi hesapların borçlandırılıp alacaklandırılacağını gösteren çift taraflı muhasebe kaydıdır. Yevmiye defteri, muhasebe sisteminin temel günlük kayıt belgesidir.',
  'Yevmiye kaydı (günlük kayıt), her mali olayın iki tarafını gösteren temel muhasebe işlemidir. Çift taraflı muhasebe sisteminin esası şudur: her olayda **borç toplamı = alacak toplamı** olmalıdır.

Bir yevmiye kaydının bileşenleri:
- **Tarih**: olayın gerçekleştiği gün
- **Borç tarafı**: değer kazanan / azalan borç hesapları
- **Alacak tarafı**: değer kaybeden / artan borç hesapları
- **Tutar**: TL cinsinden
- **Açıklama**: olayın kısa anlatımı (örn. "1234 numaralı fatura ile mal alımı")

Yevmiye kayıtları yevmiye defterine kronolojik sırayla işlenir. Sonra bu kayıtlar büyük deftere (defter-i kebir) aktarılır, hesaplar bazında birleştirilir. Mizanlar buradan çıkar; bilanço ve gelir tablosu mizanlardan üretilir.',
  'Örnek: 5.000 TL nakit ile mal alındı. Yevmiye kaydı: 153 Ticari Mallar 5.000 (borç) / 100 Kasa 5.000 (alacak).',
  array['borc', 'alacak', 'mizan', 'buyuk-defter'],
  array['100', '153']
),
(
  'bilanco',
  'Bilanço',
  'Bilanço, bir işletmenin belirli bir tarihteki varlıklarını (aktif), borçlarını ve özsermayesini (pasif) gösteren mali tablodur. AKTIF = PASIF eşitliğine dayanır.',
  'Bilanço (durum tablosu), bir işletmenin "şu anda neyi var, kime borçlu, ne kadar özsermayesi var" sorusunu yanıtlayan temel mali tablodur. İki tarafı vardır:

**AKTİF (Varlıklar)** — işletmenin sahip olduğu kaynaklar
- Dönen Varlıklar (1 yıl içinde paraya çevrilebilir): Hazır Değerler, Menkul Kıymetler, Ticari Alacaklar, Stoklar
- Duran Varlıklar (1 yıldan uzun süreli): MDV, MOV, Mali Duran Varlıklar

**PASİF (Kaynaklar)** — varlıklar nereden finanse edildi
- Kısa Vadeli Yabancı Kaynaklar (1 yıl içinde ödenecek borçlar)
- Uzun Vadeli Yabancı Kaynaklar (1 yıldan uzun)
- Özkaynaklar (sermaye, kar, yedekler)

Temel eşitlik: **AKTİF = PASİF**. İşletme her sahip olduğu varlığı ya borçla ya da kendi sermayesiyle edinmiştir; bu yüzden iki taraf eşit olmak zorundadır.

Bilanço genelde dönem sonunda (31 Aralık), sermaye artırımları ve önemli mali olaylarda hazırlanır.',
  'Örnek: Aktif tarafında 100.000 TL Kasa, 50.000 TL Stok = 150.000 TL toplam aktif. Pasif tarafında 30.000 TL borç + 120.000 TL sermaye = 150.000 TL toplam pasif. Eşitlik sağlanır.',
  array['aktif', 'pasif', 'gelir-tablosu', 'mizan'],
  array['1', '2', '3', '4', '5']
),
(
  'gelir-tablosu',
  'Gelir Tablosu',
  'Belirli bir dönemde elde edilen gelir ve giderleri, sonuç olarak da kar/zararı gösteren mali tablodur. Brüt satış kârından net dönem kârına kadar adım adım hesaplanır.',
  'Gelir tablosu, bir dönem (genelde 1 yıl) boyunca işletmenin ne kadar kazandığını ve ne kadar harcadığını gösteren mali tablodur. Bilanço "anlık fotoğraf" iken, gelir tablosu "yıl boyunca ne oldu" sorusunu yanıtlar.

Standart gelir tablosu yapısı:
1. **Brüt Satışlar** (600, 601 hesapları)
2. **(-) Satış İndirimleri ve İadeleri** (610, 611, 612)
3. **= Net Satışlar**
4. **(-) Satılan Malın Maliyeti** (620, 621)
5. **= BRÜT SATIŞ KÂRI/ZARARI**
6. **(-) Faaliyet Giderleri** (Pazarlama 760, Genel Yönetim 770, Araştırma 750)
7. **= FAALİYET KÂRI/ZARARI**
8. **(+/-) Diğer Faaliyetlerden Gelir/Gider** (640, 642, 645 / 653, 654, 655)
9. **= OLAĞAN KÂR/ZARAR**
10. **(+/-) Olağandışı Gelir/Gider** (679 / 689)
11. **= DÖNEM KÂRI/ZARARI**
12. **(-) Dönem Kârı Vergi Karşılığı** (370, 691)
13. **= DÖNEM NET KÂRI/ZARARI** (590, 591)

Sonuç olan dönem net karı bilançoda özkaynaklar bölümüne (590) aktarılır.',
  null,
  array['brut-satis-kari', 'donem-kari', 'satilan-malin-maliyeti'],
  array['600', '610', '620', '760', '770', '590']
),
(
  'mizan',
  'Mizan',
  'Belirli bir tarih itibariyle tüm hesapların borç ve alacak bakiyelerini özetleyen denetim tablosudur. Mizan, çift taraflı kayıt sisteminin doğruluğunu kontrol etmek için kullanılır.',
  'Mizan, büyük defterdeki tüm hesapların belli bir tarihteki borç ve alacak bakiyelerini sıralı şekilde gösteren tablo. Üç tip mizan vardır:

- **Aylık mizan**: ay sonu hesap bakiyeleri
- **Genel geçici mizan**: dönem sonu, kapanış öncesi
- **Genel kesin mizan**: kapanış sonrası, sıfırlanmış mizan

Mizan iki kontrol sağlar:
1. **Toplam borç = toplam alacak** → çift taraflı kayıt sistemi sağlam
2. Hatalı hesap kodları varsa bakiyeler tutmaz, hata erken yakalanır

Bilanço ve gelir tablosu mizandan üretilir. Yani mizan = mali tabloların ham kaynağı.',
  null,
  array['buyuk-defter', 'bilanco', 'gelir-tablosu'],
  array[]::text[]
),
(
  'borc',
  'Borç (Muhasebede)',
  'Muhasebede "borç" sözcüğü iki anlamda kullanılır: (1) yevmiye kaydının sol tarafı, (2) işletmenin başkalarına olan finansal yükümlülüğü. Bağlamda bu ikisi karıştırılmamalıdır.',
  'Muhasebede iki ayrı "borç" kavramı vardır:

**1. Borç (kayıt yönü)**: Yevmiye kaydının sol tarafına yapılan giriş. Aktif hesaplarda artış, pasif/gelir hesaplarda azalış demektir. Türkçe muhasebede "borç" demek "sol tarafa yazılır" demektir, gerçek anlamda borçlu olmak değildir.

**2. Borç (mali yükümlülük)**: İşletmenin başkalarına ödemesi gereken para. Bunlar 3 ve 4 numaralı sınıflarda izlenir:
- 320 Satıcılar (mal/hizmet alımından doğan ticari borç)
- 321 Borç Senetleri
- 300 Banka Kredileri
- 360 Ödenecek Vergi ve Fonlar

İki kavram aynı kelimeyi kullansa da farklıdır: 100 Kasa hesabı arttığında "borç tarafına yazılır" ama Kasa kimseye borçlu değildir.',
  'Örnek: Müşteriden 1.000 TL nakit aldın. Yevmiye: 100 Kasa 1.000 (borç). Burada Kasa "borç tarafına yazılıyor" — Kasa hesabı arttı demektir.',
  array['alacak', 'yevmiye-kaydi', 'pasif'],
  array['100', '320', '321']
),
(
  'alacak',
  'Alacak (Muhasebede)',
  'Muhasebede "alacak" iki anlamda kullanılır: (1) yevmiye kaydının sağ tarafı, (2) işletmenin başkalarından tahsil edeceği para. Bağlama göre ayırt edilmelidir.',
  'Muhasebe terminolojisinde "alacak" kelimesi iki ayrı şeyi anlatır:

**1. Alacak (kayıt yönü)**: Yevmiye kaydının sağ tarafı. Aktif hesaplarda azalış, pasif/gelir hesaplarda artış anlamına gelir.

**2. Alacak (mali hak)**: İşletmenin müşteri/üçüncü kişilerden tahsil edeceği para. Bilançoda aktif tarafta görünür:
- 120 Alıcılar (vadeli ticari alacak)
- 121 Alacak Senetleri
- 131 Ortaklardan Alacaklar

İlk anlam teknik kayıt yönüdür; ikinci anlam gerçek bir mali hakkın varlığıdır.',
  'Örnek: Müşteriye vadeli mal sattın. Yevmiye: 120 Alıcılar 5.000 (borç) / 600 Yurtiçi Satışlar 5.000 (alacak). 120''nin "borç tarafına" yazılması alacak hakkının arttığını gösterir; 600''ün "alacak tarafına" yazılması gelir oluştuğunu gösterir.',
  array['borc', 'yevmiye-kaydi', 'aktif'],
  array['120', '121', '600']
),
(
  'aktif',
  'Aktif (Bilançoda)',
  'Aktif, bilançonun sol tarafıdır ve işletmenin sahip olduğu tüm varlıkları gösterir. İki ana grupta sınıflanır: dönen varlıklar (1 yıl içinde nakte) ve duran varlıklar (uzun vadeli).',
  'Aktif tarafı bilançoda işletmenin sahip olduğu kaynakları (varlıkları) listelerken, pasif tarafı bunların nasıl finanse edildiğini gösterir. AKTİF = PASİF eşitliği bilançonun temelidir.

Aktif iki ana sınıfa ayrılır:

**1. Dönen Varlıklar (1)** — 1 yıl içinde paraya çevrilebilir veya tüketilir
- 10 Hazır Değerler (Kasa, Banka)
- 11 Menkul Kıymetler
- 12 Ticari Alacaklar
- 13 Diğer Alacaklar
- 15 Stoklar
- 18 Gelecek Aylara Ait Giderler

**2. Duran Varlıklar (2)** — 1 yıldan uzun süreli
- 22 Ticari Alacaklar (uzun vadeli)
- 24 Mali Duran Varlıklar (iştirakler, bağlı menkul)
- 25 Maddi Duran Varlıklar (binalar, makineler, taşıtlar)
- 26 Maddi Olmayan Duran Varlıklar (haklar, şerefiye)
- 28 Gelecek Yıllara Ait Giderler',
  null,
  array['pasif', 'bilanco', 'duran-varlik'],
  array['1', '10', '11', '12', '15', '2', '25', '26']
),
(
  'pasif',
  'Pasif (Bilançoda)',
  'Pasif, bilançonun sağ tarafıdır. İşletmenin varlıklarının nasıl finanse edildiğini gösterir: yabancı kaynaklar (borçlar) ve özkaynaklar (sermaye, kar). AKTİF = PASİF.',
  'Pasif tarafı bilançoda iki ana grup:

**1. Yabancı Kaynaklar (Borçlar)**
- Kısa Vadeli (3): 1 yıl içinde ödenecek
  - 30 Mali Borçlar (banka kredileri)
  - 32 Ticari Borçlar (satıcılar, borç senetleri)
  - 33 Diğer Borçlar
  - 36 Ödenecek Vergi ve Diğer Yükümlülükler
- Uzun Vadeli (4): 1 yıldan uzun
  - 40 Mali Borçlar
  - 42 Ticari Borçlar

**2. Özkaynaklar (5)** — işletmenin kendi kaynakları
- 50 Ödenmiş Sermaye
- 52 Sermaye Yedekleri
- 54 Kar Yedekleri
- 57 Geçmiş Yıllar Karları/Zararları
- 59 Dönem Net Karı

İşletme her aktifini ya borçlanarak (yabancı kaynak) ya da kendi sermayesiyle (özkaynak) finanse eder.',
  null,
  array['aktif', 'bilanco', 'sermaye'],
  array['3', '4', '5', '50', '57', '59']
),
(
  'duran-varlik',
  'Duran Varlık',
  'İşletmenin 1 yıldan uzun süre kullandığı maddi ve maddi olmayan varlıklar duran varlık sayılır. Bina, makine, taşıt, şerefiye, marka hakkı bu gruba girer. Bilançoda 2 numaralı sınıfta yer alır.',
  'Duran varlıklar, işletmenin uzun vadeli kullanım amacıyla edindiği varlıklardır. Tek dönemde tüketilmez, kullanım ömrü boyunca yararlanılır. Üç ana grup:

**1. Maddi Duran Varlık (MDV — 25)**: fiziksel, dokunulabilir
- 250 Arazi ve Arsalar
- 252 Binalar
- 253 Tesis, Makina ve Cihazlar
- 254 Taşıtlar
- 255 Demirbaşlar
- 257 Birikmiş Amortismanlar (kontra hesap, eksiltici)

**2. Maddi Olmayan Duran Varlık (MOV — 26)**: fiziksel olmayan
- 260 Haklar (lisans, telif, marka)
- 261 Şerefiye
- 262 Kuruluş ve Örgütlenme Giderleri
- 268 Birikmiş Amortismanlar

**3. Mali Duran Varlık (24)**: uzun vadeli yatırım
- 240 Bağlı Menkul Kıymetler
- 241 Bağlı Menkul Kıymetler Değer Düşüklüğü Karşılığı

Duran varlıklar amortismana tabidir (arazi hariç). Yıllar içinde yıpranma payı gider olarak yazılır.',
  null,
  array['amortisman', 'mdv', 'aktif'],
  array['25', '26', '24', '252', '255', '257']
),
(
  'demirbas',
  'Demirbaş',
  'İşletmede 1 yıldan uzun süre kullanılan, taşınabilir küçük donanımlar (masa, sandalye, bilgisayar, fotokopi) demirbaş sayılır. 255 hesabında izlenir, amortismana tabidir.',
  'Demirbaşlar, işletmede uzun süreli kullanılan ama bina veya makine kategorisine girmeyen küçük taşınabilir varlıklardır:
- Ofis mobilyaları (masa, dolap, sandalye)
- Bilgisayar, yazıcı, fotokopi makinesi
- Telefon, fax cihazları
- Mutfak ekipmanları (mikrodalga, buzdolabı)

Muhasebe kayıtları:
- Alındığında: 255 Demirbaşlar (borç) / 100 Kasa veya 320 Satıcılar (alacak)
- Yıllık amortisman: 770 Genel Yönetim Giderleri (borç) / 257 Birikmiş Amortismanlar (alacak)

VUK''a göre demirbaşlar için 5 yıl yararlı ömür esas alınır (Maliye Bakanlığı tebliğine göre değişebilir).',
  'Örnek: 12.000 TL''lik ofis mobilyası satın alındı (peşin). Yevmiye: 255 Demirbaşlar 12.000 / 100 Kasa 12.000.',
  array['amortisman', 'duran-varlik', 'mdv'],
  array['255', '257', '770']
),
(
  'stopaj',
  'Stopaj',
  'Stopaj, ödeme yapılmadan önce kaynaktan kesilen ve doğrudan vergi dairesine aktarılan vergi türüdür. Türkiye''de kira, ücret, serbest meslek kazançlarında uygulanır.',
  'Stopaj (kaynakta kesinti), vergiyi vergi mükellefinden değil, ödeyen taraftan doğrudan kaynakta kesip vergi dairesine yatırma yöntemidir. Devlete erken nakit girişi sağlar, vergi kaçağını azaltır.

Türkiye''de yaygın stopaj uygulamaları:
- **Ücret stopajı**: işverenin işçi maaşından gelir vergisi keserek yatırması (gelir vergisi, damga vergisi)
- **Kira stopajı**: kiracı, kira bedelinin %20''sini stopaj olarak keser, mal sahibine net öder, kestiği kısmı vergi dairesine yatırır
- **Serbest meslek stopajı**: serbest meslek erbabına yapılan ödemelerden %20 stopaj
- **Tahvil/mevduat stopajı**: bankalar faiz/tahvil getirisinden stopaj keser

Muhasebe kaydı tarafları:
- Stopaj kesen (ödemeyi yapan): 360 Ödenecek Vergi ve Fonlar (alacak)
- Stopaj kesilen (geliri elde eden): 193 Peşin Ödenen Vergi ve Fonlar (borç) — ileride yıllık beyanda mahsup eder',
  'Örnek: 10.000 TL kira ödüyorsun (kiracısın). %20 stopaj keseceksin. Mal sahibine 8.000 TL ödersin, 2.000 TL''yi vergi dairesine yatırırsın. Kayıt: 770 Kira Gideri 10.000 / 100 Kasa 8.000, 360 Ödenecek Vergi 2.000.',
  array['kdv', 'gelir-vergisi', 'beyanname'],
  array['193', '360', '770']
),
(
  'reeskont',
  'Reeskont',
  'Reeskont, vadeli alacak veya borçların bilanço tarihindeki gerçek değerini hesaplamak için yapılan iskontodur. Vadeli senedin nominal değeri ile bugünkü değeri arasındaki fark, reeskont olarak ayrılır.',
  'Reeskont, vadeli senet/alacakların raporlama tarihinde "şu an gerçek değeri ne kadar" sorusunu yanıtlar. Bir alacak senedinin nominal değeri 10.000 TL ama vadesi 6 ay sonra ise, bu paranın bugünkü değeri 10.000''den daha düşüktür (paranın zaman değeri).

Reeskont hesaplama: T.C. Merkez Bankası reeskont oranı kullanılır. Tipik formül:
**Reeskont tutarı = Nominal × Vade gün × Faiz oranı / 36000**

Muhasebe kayıtları:
- Alacak senedi reeskontu: 657 Reeskont Faiz Gideri (borç) / 122 Alacak Senetleri Reeskontu (alacak)
- Borç senedi reeskontu: 322 Borç Senetleri Reeskontu (borç) / 647 Reeskont Faiz Geliri (alacak)

122 ve 322 kontra hesaplardır (asıl alacak/borç hesabını eksiltirler bilançoda).',
  null,
  array['alacak', 'borc', 'iskonto'],
  array['122', '322', '657', '647']
),
(
  'fatura',
  'Fatura',
  'Fatura, bir mal veya hizmet teslimini gösteren resmi belgedir. Vergi Usul Kanunu''na (VUK) göre işletmeler arası alım-satımlarda zorunludur. Üzerinde KDV, vade, toplam tutar ve taraf bilgileri yer alır.',
  'Fatura, ticari işlemin yasal kanıtıdır. VUK madde 229''a göre belirli koşullarda fatura düzenleme zorunluluğu vardır:
- 7 günden uzun süreli mal teslimi/hizmet sunumu
- 5.000 TL üzeri işlemlerde (2024 itibariyle, sınır yıllık güncellenir)
- İşletmeler arası tüm satışlar

**Faturada bulunması gereken bilgiler (VUK 230)**:
1. "Fatura" başlığı
2. Düzenleyenin ad/unvanı, adres, vergi dairesi, vergi numarası
3. Müşterinin ad/unvanı, adres, vergi numarası (kurumsal alıcı ise)
4. Tarih ve seri/sıra numarası
5. Mal/hizmet açıklaması, miktar, birim fiyat, tutar
6. KDV oran ve tutarı
7. Genel toplam (yazıyla da yazılır genelde)

Türkiye''de e-fatura ve e-arşiv fatura zorunluluğu giderek genişliyor (limit aşan tüm işletmeler).

Muhasebe kaydı:
- Satıcı: 120 Alıcılar veya 100 Kasa (borç) / 600 Yurtiçi Satışlar (alacak), 391 Hesaplanan KDV (alacak)
- Alıcı: 153 Ticari Mallar veya 770 Genel Yönetim Gid. (borç), 191 İndirilecek KDV (borç) / 320 Satıcılar veya 100 Kasa (alacak)',
  null,
  array['kdv', 'yevmiye-kaydi', 'tic-borc', 'tic-alacak'],
  array['100', '120', '153', '191', '320', '391', '600']
),
(
  'cek',
  'Çek',
  'Çek, bankadaki vadesiz mevduattan belirli bir tutarın hamiline ödenmesini emreden kıymetli evraktır. 5941 sayılı Çek Kanunu''na tabidir. Muhasebede 101 (alınan) ve 103 (verilen) hesaplarında izlenir.',
  'Çek, bir banka hesabından para çekme/aktarma talimatı veren resmi bir ödeme aracıdır. Üç taraf vardır:
- **Keşideci**: çeki yazan, hesap sahibi
- **Muhatap banka**: ödemeyi yapan
- **Lehdar**: çeki tahsil edecek olan

Çek türleri:
- **İbraz çeki (vadeli)**: belirli bir tarihten önce bankaya götürülemez
- **Hamiline çek**: kim getirirse o öder, devredilebilir
- **Nama yazılı**: belirli bir kişiye ödenir

Muhasebe izlenir:
- 101 Alınan Çekler (aktif): tahsil edilecek çekler
- 103 Verilen Çekler ve Ödeme Emirleri (pasif/aktif kontra): yazılan çekler

Çek karşılıksız çıkarsa Çek Kanunu''na göre hukuki süreç başlar (ihtar, dava, çek mahkumiyeti).',
  null,
  array['senet', 'banka', 'kasa'],
  array['101', '103', '102']
),
(
  'senet',
  'Senet',
  'Senet, belirli bir tutarın belirli bir tarihte ödeneceğini gösteren kıymetli evraktır. Türkiye''de bono ve poliçe en yaygın türleridir. Muhasebede 121 (alacak senedi) ve 321 (borç senedi) hesaplarında izlenir.',
  'Senet, vadeli ödeme/tahsilat aracıdır. İki ana türü vardır:

**Bono**: tek taraflı ödeme vaadi. Borçlu, alacaklıya belirli tarihte belirli tutarı ödeyeceğini taahhüt eder. En yaygın senet türüdür.

**Poliçe**: üç taraflı (çeke benzer). Keşideci, muhataba (ödeyecek olan) bir bedeli lehdara (alacaklı) ödeme talimatı verir.

Muhasebe takip:
- **121 Alacak Senetleri** (aktif): tahsil edilecek senetler
- **321 Borç Senetleri** (pasif): ödenecek senetler
- Reeskont hesaplanır (122 ve 322 kontra hesapları)

Senet ciro edilebilir (bir başkasına devredilebilir). Vadesinde ödenmezse protesto edilir, kambiyo takibi başlatılır.',
  null,
  array['cek', 'reeskont', 'alacak'],
  array['121', '321', '122', '322']
),
(
  'kkeg',
  'KKEG (Kanunen Kabul Edilmeyen Gider)',
  'Vergi mevzuatına göre işletme gideri olarak kabul edilmeyen, ancak ticari karın hesabında düşülemeyen ödemelerdir. Vergi matrahını artırır. 689 hesabında izlenir.',
  'KKEG (Kanunen Kabul Edilmeyen Gider), Gelir Vergisi Kanunu (GVK) madde 41 ve Kurumlar Vergisi Kanunu (KVK) madde 11''e göre vergi matrahından düşülemeyen giderlerdir. Muhasebede gider olarak yazılır ama vergi beyannamesinde "kanunen kabul edilmeyen gider" olarak ekleyip vergi matrahını artırırsın.

KKEG''e tipik örnekler:
- İşletmenin esas faaliyetiyle ilgili olmayan ödemeler (kişisel harcamalar)
- Gecikme faizi, gecikme zammı, vergi cezaları
- Kanuna aykırı ödemeler (rüşvet, yasaklanmış faaliyet)
- Para cezaları
- 10.000 TL üzeri belgesiz ödemeler
- Kar payı dağıtımı (gider değil, sermaye işlemi)
- Bağış ve yardımların belirli sınırı aşan kısmı

Muhasebe kaydı: 689 Diğer Olağandışı Gider ve Zararlar (borç) / 100 Kasa veya 320 Satıcılar (alacak). Ama bu gider yıl sonu vergi hesabında matraha geri eklenir.',
  null,
  array['vergi-matrahi', 'beyanname', 'gelir-vergisi'],
  array['689']
),
(
  'sermaye',
  'Sermaye',
  'Sermaye, ortakların işletmeye koyduğu ve özkaynağın temel unsurunu oluşturan değerdir. 500 Ödenmiş Sermaye hesabında izlenir. Bilançoda pasif tarafta yer alır.',
  'Sermaye, işletmenin sahibinin (veya ortakların) işe koyduğu para veya değerdir. Mali açıdan bu, dışsal borç değildir; işletmenin kendi kaynağıdır.

Türk Ticaret Kanunu''na göre minimum sermaye sınırları:
- Anonim Şirket (A.Ş.): 250.000 TL (1/3''ü tescile kadar ödenir, kalanı 24 ay içinde)
- Limited Şirket (Ltd. Şti.): 50.000 TL
- Şahıs şirketi: minimum yok

Hesap kodları:
- **500 Sermaye**: kayıtlı sermaye (esas sözleşmede yazan)
- **501 Ödenmemiş Sermaye** (kontra): henüz ödenmemiş kısım
- **520 Hisse Senedi İhraç Primleri**: nominal değer üstü tahsilat
- **540 Yasal Yedekler**, **541 Statü Yedekleri**, **542 Olağanüstü Yedekler**: kar yedekleri

Sermaye artırımı: ortaklar yeni sermaye taahhüt eder (501 borçlanır), ödediklerinde 100 Kasa''ya geçer.',
  'Örnek: 100.000 TL sermayeli A.Ş. kuruldu, hepsi tescilde ödendi. Yevmiye: 100 Kasa 100.000 / 500 Sermaye 100.000.',
  array['ozkaynak', 'pasif', 'donem-kari'],
  array['500', '501', '520', '540']
),
(
  'satilan-malin-maliyeti',
  'Satılan Malın Maliyeti (SMM)',
  'Bir dönemde satılan ürünlerin alış veya üretim maliyetidir. Net satışlardan SMM düşülerek brüt satış kârı hesaplanır. Ticarette 621, üretimde 620 hesabında izlenir.',
  'Satılan Malın Maliyeti (SMM), bir dönem boyunca satılan mal/ürünlerin maliyetlerinin toplamıdır. Brüt karın hesabındaki kritik kalemdir:

**Brüt Satış Kârı = Net Satışlar − SMM**

Hesap kodları farklılaşır:
- **620 Satılan Mamuller Maliyeti**: üretici işletmeler (üretim sonucu satılan mamuller)
- **621 Satılan Ticari Mallar Maliyeti**: ticari işletmeler (alıp sattığı mallar)
- **622 Satılan Hizmet Maliyeti**: hizmet işletmeleri

Ticarette SMM hesabı:
**SMM = Dönem başı stok + Alımlar − Dönem sonu stok**

Örnek: Yıl başında 50.000 TL stok vardı, yıl içinde 200.000 TL mal aldın, yıl sonu 30.000 TL stok kaldı. SMM = 50.000 + 200.000 − 30.000 = 220.000 TL.

Yıl sonu kapanışta 153 Ticari Mallar dönem sonu stok değerine getirilir, fark 621 hesabına atılır.',
  null,
  array['gelir-tablosu', 'stok', 'brut-satis-kari'],
  array['620', '621', '153']
);

notify pgrst, 'reload schema';
