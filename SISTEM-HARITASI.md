# MuhasebeLab — Sistem Haritası

Bu dosya: sistemde **şu an ne var**, **ne çalışıyor**, **ne eksik** ve **siteyi doldurmak için neler yapılabilir** sorularına net cevap.

---

## 1. ŞU AN ÇALIŞAN ÖZELLİKLER

### Kullanıcı tarafı (oturum açmadan da çalışır)

- **Soru çözme** — 18 soru, 7 ünite (Kasa, Banka, Mal, Senet, KDV, Amortisman, Personel)
- **Yevmiye kaydı girişi** — hesap kodu autocomplete + borç/alacak satırları
- **Otomatik kontrol** — doğru/yanlış geri bildirim + açıklama
- **İpucu** — soruya takılınca açılır
- **Hesap planı erişimi** — modal veya yan panelden, soru çözerken
- **Puan + streak** — kolay 5p, orta 10p, zor 20p; günlük seri takibi
- **Aktivite heatmap** — profilde GitHub-style günlük çözüm grafiği
- **12 rozet** — ilerleme bazlı başarı sistemi
- **Tema** — açık/koyu (kayıtlı)
- **Veri dışa aktarma** — JSON olarak indirme

### Oturum açmış kullanıcı

- **E-posta + şifre kayıt/giriş** (Supabase Auth)
- **Bulut senkron** — ilerleme/rozet/profil Supabase'e yazılır, başka cihazdan girince geri gelir
- **localStorage migration** — anonim kullanıcının verisi ilk girişte buluta taşınır

### Admin paneli (sadece `kerim.cetinkayaa78@gmail.com`)

- `/admin` — istatistik kartları (toplam soru, kullanıcı, vs.)
- `/admin/sorular` — tüm soruların listesi (filtre, arama, sil, düzenle)
- `/admin/sorular/yeni` — manuel soru ekleme formu
- `/admin/sorular/toplu-ekle` — JSON ile bir kerede onlarca soru import
- `/admin/sorular/:id` — düzenleme

---

## 2. TEKNİK YAPI (kısa)

### Frontend
- **React 19** + **TypeScript** + **Vite** (build tool)
- **react-router-dom v7** (HashRouter — `#/`, `#/admin` vs.)
- **Tailwind CSS** — utility-first stil
- **Fraunces** (display, bold serif) + **Inter Tight** (body)
- **Thiings PNG ikonlar** + **lucide-react** (UI ikonları)

### Backend
- **Supabase** — managed PostgreSQL + Auth + RLS
- **11 tablo**: hesap_plani, unites, sorular, cozumler, rozetler_katalog, kullanicilar, ilerleme, kazanilan_rozetler, aktivite, odemeler, soru_hatalari
- **2 migration**: init şeması + admin RLS

### Veri akışı
- Anonim kullanıcı → localStorage (`mli_progress_v3`)
- Oturum açmış → Supabase (RLS ile kendi satırlarına erişir)
- Admin → tüm satırlara erişim (RLS `is_admin()` fonksiyonu)

### Henüz yok
- Edge Functions (Claude API çağrısı için lazım olacak)
- İyzico ödeme entegrasyonu (tablo şeması var, kod yok)
- Email/notifikasyon servisi
- Analytics

---

## 3. ALTYAPISI HAZIR AMA UI'I YOK

Bu özellikler için DB tabloları/şemaları zaten mevcut, sadece frontend yazılması gerek:

| Özellik | Tablo | Gereken |
|---|---|---|
| **Premium / freemium limit** | `kullanicilar.premium_bitis`, `gunluk_cozum_sayisi`, `gunluk_limit_reset` | Günlük 5 soru sayacı + Premium gate UI |
| **Ödeme** | `odemeler` | İyzico sandbox + Premium yönetim sayfası |
| **Kullanıcı hata bildirimi** | `soru_hatalari` | Soru ekranında "Hata bildir" butonu + admin moderasyon listesi |
| **Soru durumları** | `sorular.durum` (taslak/inceleme/onaylı/arşiv) | Şu an admin paneli kullanıyor, kullanıcı arayüzü gerek yok |

---

## 4. SİTEYİ DOLDURMAK İÇİN FİKİRLER

Aşağıdakiler **etki × efor** matrisine göre sıralı. Her birinin yanında ~süre tahmini var.

### A. İÇERİK (en kritik, en hızlı kazanım)

| Fikir | Neden | Süre |
|---|---|---|
| **300+ soruya çıkmak** | Şu an 18 soru, 1 günde bitiyor. Bu sitenin "doluluk" hissi içeriğe bağlı. Claude prompt rehberi hazır → 1-2 oturumda 100'e çıkabilirsin | 3-5 oturum |
| **5 yeni ünite eklemek** | Dönem sonu, Kapanış, Şüpheli alacaklar, Reeskont, Kambiyo. Müfredatın eksik yarısı | İçerik üretimi + 1 saat seed |
| **Konu anlatım sayfası** | Her ünitenin başında "Bu konuyu öğren" — 2-3 paragraf teorik özet + örnek (sadece okuma, soru yok) | 2-3 saat kod + içerik |

### B. ÖĞRENME DENEYİMİ (kullanıcıyı tutan şey)

| Fikir | Neden | Süre |
|---|---|---|
| **Günün sorusu** | Ana sayfada "Bugün şunu çöz" rozet/streak için + tekrar gelme sebebi | 1-2 saat |
| **"Devam et" akışı** | Ana sayfada son çözdüğü ünitenin bir sonraki sorusunu öner — açınca direkt çözmeye başlasın | 1-2 saat |
| **Yanlış yapılanları tekrar et** | "5 yanlış yaptığın soru" bölümü — kişiye özel öğrenme | 2-3 saat |
| **Açıklama kalite zenginleştirme** | Çözüm sonrası açıklamayı 1 cümleden 1 paragrafa çıkar — neden bu hesap, neden borç (içerik işi) | İçerik |
| **Adım adım çözüm modu** | "Önce nereye yazardın?" → "Sonra ne yaparsın?" — interaktif çözüm walkthrough (zor sorular için) | 1-2 gün |
| **Çoktan seçmeli mod** | Sınava hazırlık modu: "Bu işlemde hangi hesap borçlanır?" 4 şıktan biri (mevcut yevmiye girişine alternatif) | 1 gün |

### C. MOTİVASYON / OYUNLAŞTIRMA

| Fikir | Neden | Süre |
|---|---|---|
| **Liderlik tablosu** | "Bu hafta en çok puan toplayan 10 kişi" — sosyal motivasyon | 3-4 saat |
| **Haftalık challenge** | "Bu hafta 20 soru çöz, özel rozet kazan" | 4-6 saat |
| **Daha fazla rozet** | Şu an 12 rozet, 30'a çıkar (zorlu/eğlenceli olanlar: gece kuşu, hafta sonu kahramanı vs.) | 1-2 saat |
| **Seri korunma** (streak freeze) | 1 günü kaçırırsan streak sıfırlanmasın — Premium özellik | 2-3 saat |
| **Profil rozet vitrini** | Kazandığın rozetleri profilde büyük göster, paylaşılabilir kart | 3-4 saat |

### D. KEŞIF / NAVİGASYON

| Fikir | Neden | Süre |
|---|---|---|
| **Soru zorluk filtresi** problemler sayfasında | Şu an filtre var mı bilmiyorum — yoksa kolay/orta/zor + ünite + çözülmüş/çözülmemiş | 2-3 saat |
| **Konu etiketi (tag)** | Her soruya etiket: "KDV", "amortisman hesabı", "stopaj" — etikete tıklayınca o konudaki tüm sorular | 1 gün (DB değişikliği + UI) |
| **Sınav paketi** | "Vize hazırlık paketi: 15 soru" — admin tarafından oluşturulan koleksiyonlar (Premium hook) | 2-3 gün |

### E. KULLANICI KATKISI / KALİTE

| Fikir | Neden | Süre |
|---|---|---|
| **"Hata bildir" butonu** | Tablo zaten hazır, soru ekranında küçük buton + form. Admin moderasyon sayfası | 4-5 saat |
| **Soru yorumu** | Çözüm sonunda "Yorum yaz" — kullanıcılar birbirinden öğrenir. Yeni tablo | 1 gün |
| **Soru zorluk oylama** | Çözenler sonradan "Bu soru çok kolay/orta/zor" oylar → DB'ye yansır | 4-6 saat |

### F. GÖRSEL ZENGİNLEŞTİRME

| Fikir | Neden | Süre |
|---|---|---|
| **Çözüm grafiği** | Yevmiye kaydını T hesabı görselleştirmesi — yan yana T'ler ile borç/alacak göster | 4-6 saat |
| **Animasyonlar** | Doğru cevap → konfeti, rozet → toast büyütme/küçültme. Mikro etkileşim | 2-3 saat |
| **Ana sayfa hero zenginleştir** | Şu an basit; "300+ soru, 7 ünite" canlı sayaç + öğrenci yorumu | 3-4 saat |

### G. ÖĞRENMEYİ DESTEKLEYEN STATİK İÇERİK

| Fikir | Neden | Süre |
|---|---|---|
| **Sözlük sayfası** | "Stopaj nedir?", "KDV mahsubu nedir?" — açıklamalı terim listesi (tek sayfa) | İçerik |
| **Hesap planı sayfası** | Modal'dan tam sayfaya çıkar — her hesabın açıklaması, kullanım örneği. SEO açısından da iyi | 1 gün |
| **SSS / yardım** | "Borç-alacak ne demek", "İlk soruyu nasıl çözerim" — yeni başlayanlara | İçerik |

### H. TİCARI KURGU (lansman öncesi gerek)

| Fikir | Neden | Süre |
|---|---|---|
| **Freemium günlük limit** | Plan dosyasında temel kurgu. Anonim/ücretsiz: 5 soru/gün. Premium: sınırsız | 4-6 saat |
| **Premium fiyatlandırma sayfası** | "₺29/ay, ₺199/yıl" — özellik karşılaştırma tablosu | 3-4 saat |
| **İyzico entegrasyonu** | Edge Function + ödeme akışı. Bu büyük iş, ayrı oturum | 3-5 gün |

---

## 5. NEREDEN BAŞLA?

Sıralamamı versen şöyle giderdim (sebebiyle):

1. **Hata bildir butonu** (4-5 saat) — DB hazır, kullanıcıdan doğal feedback gelir, içerik kalitesi artar
2. **100 soruya çıkmak** (3-5 oturum) — `mal`, `kasa`, `kdv` ünitelerine 10'ar soru ekle. Site doluluk hissi içerikten gelir
3. **Günün sorusu** (1-2 saat) — Tekrar gelme sebebi, alışkanlık yaratır
4. **Konu anlatım sayfası iskeleti** (2-3 saat) — Her ünite başında "öğren" + "alıştır" iki tab. Sadece iskelet, içerik sonra
5. **Problemler sayfasında zorluk + ünite filtresi** (varsa atla, yoksa 2-3 saat)
6. **Freemium günlük limit** (4-6 saat) — Premium hazırlığı, sayaç + Premium gate UI
7. **Ana sayfa hero zenginleştir** (3-4 saat) — "Bugün ne öğreneceksin?" kartı, devam et CTA, son rozet vs.

Bunlar yapılınca site **görünür şekilde dolu** hissedecek. Sonra Claude API entegrasyonu + İyzico ödeme + B2B vs.

---

## 6. NE YAPMAYI BIRAK / ZAMANSIZ

- **React Native mobil app** — Plan'da Faz 3, lansman öncesi anlamsız. PWA dönüşümü yeterli
- **TFRS/BOBİ FRS senaryolar** — Profesyonel tier (Faz 3), şu an öğrenci segmenti
- **İkinci dil (İngilizce)** — Önce Türk öğrenciye doy
- **AI koç** — Premium hook ama Claude API entegrasyonu sonrası (lansman 2.0)

---

**Özet özet:** Sistem teknik olarak sağlam, eksik olan **içerik miktarı** ve **kullanıcının dönmesi için sebepler** (günün sorusu, hata bildir, devam et, konu sayfası). Bunları yapınca site dolu hissedecek.
