# RAG Pipeline — Türk Muhasebe Mevzuatı

MuhasebeLab'in AI asistanını besleyen retrieval-augmented generation altyapısı.

## Ne yapıyor?

1. `sources.json`'da listelenen resmi kaynakları (VUK, GVK, KVK, KDV, TTK, SGK, İş Kanunu, MSUGT, TMS 2/16/37, TFRS 15, VUK Genel Tebliğleri) indirir.
2. PDF/HTML'i düz metne çevirir.
3. Madde sınırlarına saygıyla **200-800 token** parçalara böler.
4. OpenAI `text-embedding-3-small` ile **embedding** üretir.
5. Supabase `pgvector` tablosuna upsert eder (incremental — değişmeyen chunk re-embed edilmez).

Sonuç: AI asistan kullanıcıya cevap verirken Supabase'de en yakın mevzuat parçasını bulup cevabın altında **kaynaklı atıf** gösterir.

---

## Nasıl çalıştırılır?

### Otomatik (GitHub Actions — önerilen)

1. GitHub'da projeye git → **Actions** sekmesi → **RAG Pipeline** workflow'u
2. **Run workflow** butonuna bas
3. (Opsiyonel) "Sadece belirli kaynakları işle" kutusuna `vuk,gvk` gibi ID listesi yaz — boş bırakırsan hepsi işlenir
4. ~30-90 dakika sürer (ilk kez 2-3 saat olabilir tüm setle); senin makineni hiç kullanmaz, GitHub'da çalışır

**Haftalık otomatik tarama:** Workflow her Pazartesi 06:00 (TR) tetiklenir; sadece değişen mevzuat chunk'ları yeniden embed edilir.

### Lokal (test için — opsiyonel)

```bash
export OPENAI_API_KEY=sk-...
export SUPABASE_URL=https://xxx.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Tüm kaynaklar:
npm run rag:calistir

# Sadece belirli kaynak(lar):
npm run rag:tek vuk,tms-2
```

---

## İlk kurulum (sadece bir kez)

### 1. KGK ve MSUGT PDF'lerini Supabase Storage'a yükle

Resmi sitelerin URL'leri değişebildiği için 5 kaynak Supabase Storage'tan okutuluyor.

**a)** Supabase Dashboard → **Storage** → **New bucket**
- Name: `rag-kaynaklar`
- Public bucket: **ON** (pipeline anon olarak okuyacak)
- Create

**b)** Aşağıdaki 5 PDF'i tarayıcıdan indir ve bucket'a yükle (dosya isimleri **birebir** olmalı):

| Dosya adı | Kaynak |
|---|---|
| `msugt-1.pdf` | Muhasebe Sistemi Uygulama Genel Tebliği Sıra 1 (TDHP — Resmi Gazete 26.12.1992 arşivi) |
| `tms-2.pdf` | TMS 2 Stoklar — kgk.gov.tr |
| `tms-16.pdf` | TMS 16 Maddi Duran Varlıklar — kgk.gov.tr |
| `tms-37.pdf` | TMS 37 Karşılıklar — kgk.gov.tr |
| `tfrs-15.pdf` | TFRS 15 Hasılat — kgk.gov.tr |

> Tüm bunları **kgk.gov.tr** ana sayfasından arama ile bulabilirsin. Eğer tek tek aramak zor geliyorsa, KGK her sene "TMS/TFRS Seti" diye tek zip yayınlıyor — onu indirip içindeki PDF'leri ayrı ayrı upload edebilirsin.

**c)** Yüklediğinde URL'ler şu formatta olmalı (test et):
```
https://<proje>.supabase.co/storage/v1/object/public/rag-kaynaklar/tms-2.pdf
```

### 2. Supabase migration'ı uygula

`supabase/migrations/20260513000001_rag_vektor.sql` migration'ını uygulanmış olmalı. Supabase Dashboard → SQL Editor'da çalıştır, ya da Supabase CLI ile push et.

Bu migration:
- `pgvector` uzantısını aktif eder
- `rag_kaynaklar` ve `rag_chunks` tablolarını oluşturur
- `rag_ara()` RPC fonksiyonunu tanımlar (similarity search)
- RLS politikalarını kurar (public read, service_role write)

### 3. GitHub Secrets ekle

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret | Nereden alınır |
|---|---|
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API → `Project URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → `service_role` key (⚠ SECRET — anon key DEĞİL) |

### 4. İlk workflow run

Actions → RAG Pipeline → Run workflow → boş bırak (hepsi) → Run.

Tamamlanınca Supabase Dashboard → Table Editor → `rag_chunks` tablosunu kontrol et — binlerce satır olmalı.

---

## Mimari

```
GitHub Actions (Ubuntu runner)
    │
    ├─ 01-download.ts   → PDF/HTML indir, hash hesapla
    ├─ 02-extract.ts    → unpdf ile metin çıkar, normalleştir
    ├─ 03-chunk.ts      → Madde sınırlarında 200-800 token böl
    ├─ 04-embed.ts      → OpenAI batch embedding (100'lük gruplar)
    └─ 05-upload.ts     → Supabase upsert (incremental, hash-based)
            │
            ↓
Supabase Postgres + pgvector
    │
    ├─ rag_kaynaklar (meta + durum)
    └─ rag_chunks (metin + embedding(1536))
            │
            ↓
Edge Function: ai-asistan
    │
    └─ Kullanıcı sorusu → embedding → rag_ara() RPC →
       en yakın 5 chunk → Claude/GPT prompt'a inject →
       Sohbet havasında cevap + altta kaynaklar
```

---

## Yeni kaynak nasıl eklenir?

`sources.json`'a yeni bir nesne ekle:

```json
{
  "id": "tms-12",
  "baslik": "TMS 12 — Gelir Vergileri",
  "kategori": "standart",
  "yayinci": "KGK",
  "url": "https://kgk.gov.tr/.../TMS_12_2018.pdf",
  "format": "pdf",
  "konular": ["gelir-vergisi", "ertelenmis-vergi"]
}
```

PR aç, merge et. Sonraki workflow run otomatik işler.

⚠ **Telif uyarısı:** Sadece Kategori 1 (resmi/açık) kaynaklar eklenmeli. PwC/Deloitte/EY/KPMG raporları, telifli kitaplar, ücretli platform içerikleri **eklenemez**.

---

## Maliyet

| Kalem | Bir seferlik | Aylık (incremental) |
|---|---|---|
| GitHub Actions | 0 (ücretsiz quota'da) | 0 |
| OpenAI embedding | ~$10-15 (5000 sayfa) | ~$0.50 (sadece değişen) |
| Supabase storage | 0 (free tier 500MB) | 0 |
| **Toplam** | **~$15** | **~$0.50** |

---

## Sık karşılaşılan sorunlar

**`OpenAI embedding hatası 429: rate limit`**
→ Free tier OpenAI hesabında saatlik limit düşük. Tier upgrade et, ya da 100→25 batch indir.

**`Kaynak indirilemedi: HTTP 403`**
→ Resmi siteler User-Agent kontrolü yapıyor. `01-download.ts`'deki UA'yı güncelle.

**`PDF beklenirdi ama string geldi`**
→ Kaynak URL artık HTML döndürüyor (içerik taşındı). `sources.json`'da `format`'i `html` yap ya da yeni URL bul.

**Embedding'ler yanlış geliyor / kötü retrieval**
→ Modeli `text-embedding-3-large` (3072 boyut) veya Cohere `embed-multilingual-v3`'e geçir. `04-embed.ts`'i + migration `vector(1536)` → yeni boyut + tüm chunk'ları sıfırdan re-embed et.
