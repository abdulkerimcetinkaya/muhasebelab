# MuhasebeLab — Kullanıcı Dokümantasyonu

**Muhasebe öğrencileri için interaktif yevmiye kaydı pratik platformu.**
Tek Düzen Hesap Planı'nı LeetCode tarzı senaryo tabanlı alıştırmalarla öğret.

---

## 1. MuhasebeLab Nedir?

MuhasebeLab, muhasebe derslerinde teorik olarak öğrendiğin yevmiye kaydı konusunu **gerçek belgelerle** ve **anlık geri bildirimle** pekiştirmen için tasarlanmış bir web uygulamasıdır.

Her soru bir **iş senaryosuyla** başlar (örneğin: "ASKİ su faturası gün içinde kasadan nakden ödendi"). Sen soruyu okur, ilgili belgeyi (fatura, makbuz, dekont) incelersin, sonra yevmiye kaydını borç ve alacak satırları olarak girersin. Sistem anında doğru mu yanlış mı olduğunu söyler, açıklamasını yapar; yanlışta da tekrar denemeni ister.

Kısaca: **kitaptan çözer gibi değil, muhasebeci gibi** çalışırsın.

---

## 2. Temel Özellikler

### Öğrenme araçları

Her soru ekranında üç yardımcı var: **ipucu** (takıldığında hangi hesapların kullanılacağını ima eder), **hesap planı paneli** (yan panel olarak açılır, kod ararken soruyu kapatmaz) ve **belge görüntüleyici** (fatura/makbuz/dekont gibi dayanak belgeleri gerçeğe yakın görseller halinde gösterir).

Soruyu doğru çözdüğünde sistem çözümü ve detaylı açıklamayı verir: neden bu hesap borçlanır, KDV ayrımı niye böyle yapılır, hangi envanter yöntemi uygulandı gibi noktalar tek tek anlatılır.

### İlerleme ve motivasyon

Çözdüğün her soru puan getirir: **kolay 5 puan, orta 10 puan, zor 20 puan**. Üst üste gün atlamadan çözüm yaparsan **streak (seri)** sayacı artar. Profilinde GitHub benzeri bir **aktivite ısı haritası** günlük çalışmanı görselleştirir.

12 başarı rozeti var: İlk Adım (ilk soru), Yol Alıyor (5 soru), Onuncu Kayıt (10 soru), Kasa Ustası (Kasa ünitesini bitir), Zor Aslanı (3 zor çöz), Haftalık Ateş (7 günlük seri), Beş Yüz (500 puana ulaş) ve diğerleri.

### Kullanıcı hesabı ve bulut senkron

Giriş yapmadan da kullanabilirsin; ilerlemen tarayıcının yerel deposuna (localStorage) kaydedilir. Ancak hesap açarsan ilerlemen **Supabase**'e yazılır ve başka bir cihazdan giriş yaptığında yerine geri gelir. İlk girişte anonim olarak kazandığın ilerleme otomatik olarak buluta taşınır.

### Tema, dışa aktarma, kişiselleştirme

Açık/koyu tema arasında geçiş yapabilirsin; seçimin kaydedilir. Tüm ilerlemeni JSON olarak indirip yedekleyebilirsin. Profil sayfasından istatistiklerini detaylı inceleyebilir, ilerlemeyi sıfırlayabilirsin.

---

## 3. Üniteler ve Soru Kataloğu

Platformda şu an **10 ünite** ve toplam **60'a yakın soru** bulunuyor. Her ünite ayrı bir konuya odaklanır ve kolaydan zora doğru ilerler.

| # | Ünite | İçerik | Soru |
|---|---|---|---|
| 1 | **Kasa İşlemleri** | Nakit giriş-çıkış, perakende satış, gider faturası, sayım farkları, personel avansı | 8 |
| 2 | **Banka İşlemleri** | Havale, vadeli mevduat, banka masrafları, EFT, kredi taksiti | 8 |
| 3 | **Ticari Mal Alım-Satımı** | Alış-satış, iade, iskonto, taşıma giderleri, envanter yöntemleri | 8 |
| 4 | **Çek ve Senetler** | Alınan/verilen çek ve senetler, ciro, tahsil, protesto | 8 |
| 5 | **KDV Hesapları** | İndirilecek / Hesaplanan KDV, KDV mahsubu, iade, tevkifat | 8 |
| 6 | **Duran Varlıklar ve Amortisman** | Alım, amortisman hesabı, satış, yeniden değerleme, çıkış | 8 |
| 7 | **Personel ve Ücret** | Ücret tahakkuku, SGK, stopaj, kıdem, ikramiye | 8 |
| 8 | **Dönem Sonu İşlemleri** | Tahakkuk, reeskont, amortisman dönemsonu, dönemsonu mahsupları | 6 |
| 9 | **Şüpheli Alacaklar** | Şüpheli alacak karşılığı, değersiz alacak, tahsil | 6 |
| 10 | **Reeskont İşlemleri** | Senet reeskontu, dönembaşı iptali | 6 |
| 11 | **Kambiyo İşlemleri** | Döviz alım-satım, kur farkı, dövizli alacak/borç değerlemesi | 6 |

**Zorluk dağılımı:** kolay (5p), orta (10p), zor (20p). Her ünitenin ilk birkaç sorusu kolaydır; zor sorular birden fazla işlem içerir (örn. kambiyo + KDV + stopaj bir arada).

---

## 4. Uygulamayı Kullanma

### 4.1 Ana sayfa

Ana sayfa iki farklı yüz gösterir:

**Giriş yapmadıysan** — Platformun tanıtımı, örnek mockup'lar ve "Soru Çözmeye Başla" CTA'sı. Kayıt zorunlu değil, doğrudan problemler listesine geçebilirsin.

**Giriş yaptıysan** — Kişisel pano: günün sorusu kartı, "Kaldığın yerden devam et" önerisi, en çok yanlış yaptığın soru için "Tekrar et" kartı, güncel streak ve puanın, aktif ünitende kaldığın yer.

### 4.2 Problemler sayfası (`#/problemler`)

Tüm soruların listelendiği sayfa. Her soru kartı: başlık, ünite, zorluk etiketi, puan ve çözülmüş/çözülmemiş durumunu gösterir. Listeden bir soruya tıklayınca soru ekranına geçersin.

### 4.3 Soru ekranı (`#/problemler/:soruId`)

Ana çalışma alanı. Sol tarafta soru senaryosu, ipucu butonu ve varsa belge önizlemesi; sağ tarafta yevmiye kaydı girişi bulunur.

**Yevmiye kaydı nasıl girilir?**

Her satır için üç şey: **hesap kodu** (autocomplete ile; "100" yazmaya başla, "100 Kasa" otomatik çıksın), **borç tutarı**, **alacak tutarı**. Bir satırda borç veya alacak dolu; ikisi birden değil. "Satır ekle" ile çoklu kayıt oluşturursun.

**Kontrol** butonuna bastığında:
- Doğruysa: çözüm + açıklama görünür, puan eklenir, aktivite takvimine işlenir
- Yanlışsa: nereyi kaçırdığın gösterilir (tutar mı, hesap mı, borç-alacak karışıklığı mı), tekrar deneyebilirsin

**Hesap planı paneline** "Hesap planını aç" tuşuyla erişebilirsin — yan panel olarak açılır, soruyu kapatmadan hesap kodunu aratırsın.

### 4.4 Üniteler sayfası (`#/uniteler`)

Tüm ünitelerin kart görünümü. Her kartta: ünite adı, Thiings 3D ikonu, kısa açıklama, çözüm ilerlemesi (örn. "5/8"). Bir üniteye tıklayınca **ünite detay sayfasına** (`#/uniteler/:uniteId`) gider; o ünitenin tüm soruları sırayla listelenir.

### 4.5 Profil sayfası (`#/profil`)

İstatistikler (toplam çözüm, puan, streak, kazanılan rozet sayısı), **aktivite ısı haritası**, **kazanılan rozetler**, ayarlar (kullanıcı adı, tema), veri dışa aktarma ve ilerleme sıfırlama burada.

### 4.6 Premium sayfası (`#/premium`)

Ücretsiz ve Premium planların karşılaştırması. Ücretsiz planda tüm sorular sınırsız çözülebilir — soru veya günlük kullanım limiti yoktur. Premium, değer ekleyen özelliklerle ayrışır: AI muhasebe asistanı, AI yanlış analizi, adım adım çözüm, hesap kodu autocomplete, detaylı istatistikler, reklamsız deneyim ve streak koruma. Öğretmen/sınıf tier'ı ayrı paket olarak kurgulanmaktadır. (Not: Ödeme altyapısı hazırlık aşamasındadır.)

---

## 5. Hesap Oluşturma ve Giriş

**Kayıt olurken:** `#/giris` adresinde e-posta ve şifre yeterli. Supabase Auth üzerinden çalışır, e-posta doğrulama isteyebilir. İlk girişte **onboarding** akışı tetiklenir: kullanıcı adını belirler, başlamak istediğin üniteyi seçersin.

**Yerelden buluta geçiş:** Giriş yapmadan önce çözdüğün sorular kaybolmaz. İlk defa giriş yaptığında yerel verilerin otomatik olarak hesabına taşınır; bu işlem şeffaf şekilde arka planda gerçekleşir.

**Şifremi unuttum:** Giriş ekranından e-posta ile sıfırlama bağlantısı talep edebilirsin.

---

## 6. Puan Sistemi ve Rozetler

**Puan:** Her doğru çözümde zorluğa göre puan kazanırsın. Aynı soruyu ikinci kez çözmek puan vermez; yeni soru çözerek ilerlersin.

**Streak:** Üst üste gün atlamadan çözüm yapmak sayacı büyütür. Bir günü kaçırdığında streak 1'e düşer. Bugün ve dün koşulu: son çözüm tarihin dün ise streak + 1, bugün ise aynı kalır, daha eskiyse 1'e resetlenir.

**Rozetler:** 12 rozet var, arka planda otomatik kontrol edilir. Yeni bir rozet kazandığında ekranın üstünde **toast** (küçük bildirim kartı) belirir. Rozetler profil sayfasında büyük kart olarak görünür; henüz kazanılmamışlar soluk gösterilir.

---

## 7. İpuçları ve En İyi Uygulamalar

**Takılınca:** Önce soruyu yeniden oku — çoğu hata senaryoyu tam okumamaktan gelir. Sonra belgeyi incele: belgede KDV dahil mi hariç mi, tarih nedir, yüzdesi ne? Yine çözemezsen "İpucu"na bas.

**Hesap kodu hatırlamıyorsan:** "Hesap planı" panelini aç, ada göre ara (örn. "kdv" yazınca 191 İndirilecek KDV, 391 Hesaplanan KDV, 190 Devreden KDV'yi listeler).

**Aralıklı mı sürekli envanter mi?** Soruda genellikle belirtilir. Aralıklı envanterde satış anında maliyet kaydı yapılmaz (600'ler ve 391); sürekli envanterde 621 Satılan Ticari Malların Maliyeti ve 153 Ticari Mallar çiftli kayıt gerektirir.

**KDV unutma:** Perakende satışta müşteri KDV dahil öder; 100 Kasa KDV dahil tutarla borçlanır, 600 Yurt İçi Satışlar matrahla, 391 Hesaplanan KDV de KDV tutarıyla alacaklanır. Faturalarda ise alıcı için 191 İndirilecek KDV borç, satıcı için 391 Hesaplanan KDV alacak.

**Streak'ini koruyan tavsiye:** Çok soru çözmesen bile günde 1 kolay soru yeterlidir. 5 puan az gibi ama streak sayacını canlı tutar.

---

## 8. Teknik Arka Plan (Özet)

MuhasebeLab bir **React 19 + TypeScript + Vite** tek sayfa uygulamasıdır. Backend olarak **Supabase** (PostgreSQL + Auth + Row Level Security) kullanılır. Yönlendirme **hash-based router** ile çalışır, yani tüm rotalar `#/` ile başlar (örn. `#/problemler/kasa-1`).

**Veri organizasyonu:** Hesap Planı, Üniteler ve Sorular hem kodda (`src/data/`) hem de Supabase'de tutulur — online olmadığında bile uygulama çalışır. Kullanıcı ilerlemesi anonimken localStorage'da (`mli_progress_v3` anahtarı), oturum açıldığında Supabase tablolarında (`ilerleme`, `aktivite`, `kazanilan_rozetler`) saklanır.

**Güvenlik:** Supabase RLS (Row Level Security) politikaları ile her kullanıcı sadece kendi kayıtlarını okuyabilir/yazabilir. Admin rolü `is_admin()` veritabanı fonksiyonuyla kontrol edilir ve sadece belirli e-postalar için geçerlidir.

**Proje yapısı (özet):**

```
src/
├── App.tsx              — router + üst seviye state
├── components/          — Navbar, Footer, modallar, form parçaları (20 bileşen)
├── pages/               — AnaSayfa, ProblemlerSayfasi, SoruEkrani, Profil, Admin/... (15 sayfa)
├── data/
│   ├── hesap-plani.ts  — Tek Düzen Hesap Planı
│   ├── uniteler.ts     — Üniteler ve sorular (~2400 satır)
│   └── rozetler.ts     — 12 rozet tanımı
├── lib/
│   ├── supabase.ts     — Supabase istemcisi
│   ├── auth.ts, admin.ts
│   ├── ilerleme.ts     — localStorage ilerleme yönetimi
│   └── kontrol.ts      — yevmiye kaydı doğrulama mantığı
└── types/              — TypeScript tipleri

supabase/
├── migrations/          — 4 migration (init, admin RLS, premium RPC, belgeler)
├── functions/           — Edge Functions (ai-asistan, ai-yanlis-analizi)
└── seed.sql             — katalog verisi
```

---

## 9. Sorunlar ve Destek

**İlerlemem kayboldu:** Tarayıcı localStorage'ını temizlediysen veya gizli sekmede çalıştıysan anonim veri silinir. Hesap açıp buluta kaydedersen bu sorun yaşanmaz.

**Soruyu doğru çözdüm ama yanlış diyor:** Tutarları doğru girdiğinden emin ol (kuruş hassasiyeti dahil). Borç/alacak taraflarını karıştırmış olabilirsin. Yine de bir hata varsa soru ekranındaki "Hata bildir" özelliğiyle (altyapı hazır, UI aşamalı geliyor) raporlayabilirsin.

**Hesap kodu autocomplete çalışmıyor:** En az 1-2 karakter yazman gerekir; hem koda göre ("153") hem de ada göre ("ticari mal") arayabilirsin.

**Koyu tema çok parlak/koyu:** Ayarlar (profil sayfası) üzerinden tema değişikliğini bir kez yapman yeterli; tercih kaydedilir.

---

## 10. Yol Haritası (Kullanıcıyı İlgilendiren)

Planlanan geliştirmeler:

Her üniteye 8–10 soruya çıkarılması (şu an 6-8 arası), **Günün Sorusu** rotasyonu, **"Bu haftanın challenge"ı** ve liderlik tablosu, **adım adım çözüm modu** (zor sorularda "önce nereyi yazardın?" gibi rehberli çözüm), **çoktan seçmeli sınav modu** (klasik muhasebe sınav tarzı), **konu anlatım sayfaları** (her ünitenin başında teorik özet), **AI asistan** (takıldığında seninle konuşarak yol gösterir — Edge Function altyapısı hazır), **hata bildir** kullanıcı arayüzü ve **Premium** özelliklerin tam devreye girişi.

---

*Bu dokümantasyon 23 Nisan 2026 tarihinde oluşturulmuştur. Projenin aktif geliştirildiği için bazı ekran/özellik detayları değişmiş olabilir. Güncel durum için depodaki `SISTEM-HARITASI.md` dosyasına bakabilirsin.*
