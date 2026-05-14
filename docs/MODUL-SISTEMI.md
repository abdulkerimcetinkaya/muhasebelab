# Atölye Modülleri — Entegrasyon Notu

"Ticari Mal Alımı ve Satımı" ünitesi için 9 modüllü, 56 alt başlıklı atölye
yapısı kuruldu. Bu doküman: ne kuruldu, nasıl çalışıyor, senaryo nasıl bağlanır.

## Genel Yapı

Mevcut hiyerarşi: `unite → unite_konulari → sorular` (eski "Konu" katmanı — teori
ağırlıklı, dokunulmadı).

Yeni atölye hiyerarşisi: `unite → unite_modulleri → modul_alt_basliklari → sorular`

Bir ünite hem konu hem modül yapısına sahip olabilir; UI öncelik olarak modülü
gösterir (modül varsa konu seksiyonu gizlenir). Şu an sadece `mal-alis-satis`
ünitesi modüllü.

## Veri Modeli

### Tablolar (`supabase/migrations/20260514000001_unite_modulleri.sql`)

```
unite_modulleri
  id text pk             — örn. "mal-alis-satis-m1"
  unite_id text fk       — unites(id)
  sira int               — 1..N
  baslik text
  aciklama text?
  zorluk_seviyesi enum   — 'baslangic' | 'orta' | 'ileri' | 'sinav'
  opsiyonel boolean      — kilit akışında atlanır (örn. M8)

modul_alt_basliklari
  id text pk             — örn. "mal-alis-satis-1-1"
  modul_id text fk       — unite_modulleri(id)
  sira int               — 1..N
  baslik text
  karma boolean          — bütünleşik vaka (UI'da yıldız ile)

sorular
  + alt_baslik_id text?  — modul_alt_basliklari(id), null = eski seed
```

RLS: ikisi de public read, admin yazma (mevcut `is_admin()` üzerinden).

### Frontend Tipleri (`src/types/index.ts`)

```typescript
type ModulZorluk = 'baslangic' | 'orta' | 'ileri' | 'sinav';

interface Modul {
  id; uniteId; sira; baslik; aciklama;
  zorlukSeviyesi: ModulZorluk;
  opsiyonel: boolean;
  altBasliklar: AltBaslik[];
}

interface AltBaslik {
  id; modulId; sira; baslik;
  karma: boolean;
  sorular: Soru[];      // senaryolar — alt_baslik_id ile bağlı
}

interface Unite {
  ...
  moduller?: Modul[];   // boş ise modüllenmemiş ünite
}
```

`Soru` üzerinde yeni alan: `altBaslikId?: string | null`.

## Kilit Mantığı

`src/lib/modul-kilit.ts`:

- **Modül 1** her zaman açık.
- **Modül N** açık ⇔ önceki ZORUNLU modülün tüm alt başlıkları kilit-açıcı durumda
  (tüm soruları çözülmüş VEYA 0 soru var — geçilebilir).
- **Opsiyonel modül** (örn. M8) sonraki modülü kilitlemez — Modül 9 için
  Modül 7 yeterli, Modül 8 atlanabilir.
- **Bir modül içindeki alt başlıklar** serbest sırada açıktır (modül kilidi açıksa).

Public API:

```typescript
modulKilitDurumu(moduller, modul, ilerleme): 'acik' | 'kilitli' | 'tamamlandi'
modulTamamlandiMi(modul, ilerleme): boolean
altBaslikTamamlandiMi(altBaslik, ilerleme): boolean
modulIlerlemeYuzde(modul, ilerleme): number
uniteModulIlerleme(moduller, ilerleme): { tamamAltBaslik, toplamAltBaslik, yuzde }
kilidiAcanModul(moduller, modul, ilerleme): Modul | null
```

## UI

Mevcut UI bileşenleri (Modal'lar, Card patternleri, ZORLUK_STIL vs.) yeniden
kullanıldı. Yeni dosyalar:

| Dosya | Rol |
|---|---|
| `src/pages/ModulSayfasi.tsx` | Modül detay — alt başlık listesi |
| `src/pages/AltBaslikSayfasi.tsx` | Alt başlık iskeleti — senaryo listesi veya boş state |
| `src/lib/modul-kilit.ts` | Kilit/tamamlanma helper'ları |

UniteSayfasi'da yapılan ekler (orijinal kod dokunulmamış konu akışı ile
yan yana çalışır):
- Üst kısımda **Atölye Modülleri** seksiyonu (modüller varsa)
- Sağ ilerleme paneli modül moduna geçer (`tamamAltBaslik / toplamAltBaslik`)
- "Devam Et" CTA'sı ilk açık modüle yönlendirir
- Smart redirect modüllü ünitelerde devre dışı (overview'da kalır)

### Yeni Route'lar (`src/App.tsx`)

```
/uniteler/:uniteId/modul/:modulId                       → ModulSayfasi
/uniteler/:uniteId/modul/:modulId/alt/:altBaslikId      → AltBaslikSayfasi
```

Eski `/uniteler/:uniteId/:konuId` rotası korundu — segment sayısı farklı
olduğu için çakışmıyor.

### Görsel Sözleşme

- Zorluk seviyeleri sadece badge + kart sol kenar çizgisinde renkli
  (`MODUL_ZORLUK_BADGE`, `MODUL_ZORLUK_KENAR` — `src/data/sabitler.ts`).
  - **Başlangıç** → success (yeşil)
  - **Orta** → premium (sarı/amber)
  - **İleri** → danger (kırmızı)
  - **Sınav** → brand (lacivert/mor)
- Kilitli kart: `opacity-55`, `Lock` ikonu, hover'sız.
- Tamamlanmış kart: `TamamRozeti`, brand kenar.
- Karma alt başlık: `Star` ikonu (premium ton).
- Opsiyonel modül: badge + "Opsiyonel" rozet satırı.

Yeni renk değişkeni / Tailwind config değişikliği YOK — mevcut palet
tokenları (`success`, `premium-*`, `danger`, `brand-*`) yeniden kullanıldı.

## Migration'ı Çalıştırma

```bash
# 1. Migration uygula (local Supabase varsa)
supabase db push

# Veya manuel uygulamak için:
supabase db execute --file supabase/migrations/20260514000001_unite_modulleri.sql
```

Cloud için: değişiklik commit edilip pushlandığında mevcut deploy akışı
(GitHub Actions / `supabase migration up`) otomatik çalıştıracak.

## Senaryo (Soru) Bağlama

Mevcut admin paneli (`AdminYeniSoruSayfasi`, `AdminTopluEkleSayfasi`)
**alt_baslik_id** alanını henüz UI'da göstermiyor — sadece tip seviyesinde
mevcut. Senaryo eklenirken `sorular.alt_baslik_id` direkt SQL ile, veya admin
formuna küçük bir dropdown eklenerek atanmalı.

Hızlı SQL yolu:
```sql
update sorular
   set alt_baslik_id = 'mal-alis-satis-1-1'
 where id in ('soru-xyz', 'soru-abc');
```

Soru eklendikten sonra:
- `AltBaslikSayfasi` boş state'ten "Senaryolar" listesine geçer
- Liste tek tek `/problemler/:id` üzerinden mevcut `SoruEkrani`'na yönlenir
  (yeni yevmiye motoru / kontrol UI **bu modülün dışında** — değişmedi)
- Alt başlık çözülünce ilerleme otomatik sayar, modül kilit açma akışı
  devreye girer

## Karar Notu — Eski "Konu" Yapısı

`unite_konulari` (mal-alis-satis için 6 konu) silinmedi. Atölye yapısı
mal-alis-satis için aktif olduğunda UniteSayfasi otomatik olarak konu
seksiyonunu gizliyor. Konu içerikleri (BlockNote dokümanları) admin panelinde
hâlâ düzenlenebilir; istenirse ileride dropdown ile "Modül görünümü vs. Konu
görünümü" seçeneği eklenebilir.

Tüm üniteleri modüllemek için: aynı şema kullanılarak ek seed migration'ları
yazılır (`20260...XX_kdv_modulleri.sql` gibi). Loader, lock helper ve UI
bileşenleri ünite-agnostik çalışıyor.

## Sayım Notu

Görev "58 alt başlık" diyordu — tek tek sayınca metinde 56 var
(5+10+7+10+6+4+7+4+3). Seed olarak verilen liste birebir alındı (56 alt başlık).
Eksik 2 alt başlık ileride eklenirse migration'a INSERT eklemek yeterli.
