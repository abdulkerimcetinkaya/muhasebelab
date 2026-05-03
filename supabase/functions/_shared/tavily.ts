// Tavily Search API wrapper.
// LLM-friendly web search — temizlenmiş içerik + opsiyonel özet döner.
// Free tier: 1000 arama/ay. Daha fazlası için $0.008/arama.
//
// Whitelist: Türk mevzuatı için resmi kaynaklar. Random forum ve blog'lardan
// gelen yanlış bilgiyi engellemek kritik (eğitim platformu).

const RESMI_KAYNAKLAR = [
  'mevzuat.gov.tr',
  'gib.gov.tr',
  'resmigazete.gov.tr',
  'sgk.gov.tr',
  'tdk.gov.tr',
  'turkiye.gov.tr',
];

export interface TavilySonuc {
  ozet: string | null;
  kaynaklar: Array<{
    baslik: string;
    url: string;
    icerik: string;
    skor: number;
  }>;
}

interface TavilyApiResponse {
  answer?: string;
  results?: Array<{
    title?: string;
    url?: string;
    content?: string;
    score?: number;
  }>;
}

/**
 * Tavily ile web araması yapar. TAVILY_API_KEY tanımlı değilse null döner
 * (graceful fallback — caller mevzuat yok diye akar).
 */
export const tavilyAra = async (
  sorgu: string,
  opts: {
    maxSonuc?: number;
    sadeceResmi?: boolean;
  } = {},
): Promise<TavilySonuc | null> => {
  const apiKey = Deno.env.get('TAVILY_API_KEY');
  if (!apiKey) return null;

  const govde = {
    api_key: apiKey,
    query: sorgu,
    max_results: opts.maxSonuc ?? 3,
    include_answer: true,
    search_depth: 'basic',
    include_domains: opts.sadeceResmi !== false ? RESMI_KAYNAKLAR : undefined,
  };

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(govde),
    });

    if (!res.ok) {
      console.error(`Tavily API hatası: ${res.status} ${await res.text()}`);
      return null;
    }

    const data: TavilyApiResponse = await res.json();
    return {
      ozet: data.answer ?? null,
      kaynaklar: (data.results ?? []).map((r) => ({
        baslik: r.title ?? '',
        url: r.url ?? '',
        icerik: r.content ?? '',
        skor: r.score ?? 0,
      })),
    };
  } catch (e) {
    console.error('Tavily çağrısı başarısız', (e as Error).message);
    return null;
  }
};

// ─── Heuristik: kullanıcı sorusu güncel/web bilgisi gerektirir mi? ────────

const GUNCELLIK_KELIMELERI = [
  'güncel', 'yeni', 'son', 'şu an', 'şu anki', 'bugün', 'bugünkü',
  'değişti', 'değişiklik', 'güncellendi', 'güncelleme',
  'tebliğ', 'sirküler', 'kanun değişikliği', 'yasa değişikliği',
  'kaç oldu', 'kaç tl', 'ne kadar oldu', 'ne kadarı', 'oranı kaç',
  'oran ne', 'oranı ne', 'limiti ne', 'limiti kaç', 'tutarı kaç',
  'tutarı ne', 'sınırı ne', 'sınırı kaç',
  'yeni bütçe', 'yeni dönem',
];

// Yıl referansı (örn. "2026", "2025")
const YIL_REGEX = /\b20(2[3-9]|3\d)\b/;

/**
 * Sorunun güncel mevzuat araması gerektirip gerektirmediğini tespit eder.
 * False positive kabul edilir (boşa Tavily çağrısı), false negative tehlikeli
 * (kullanıcıya eski bilgi verilebilir) — bu yüzden aralık geniş tutuluyor.
 */
export const guncelBilgiGerekiyor = (metin: string): boolean => {
  const m = metin.toLowerCase().trim();
  if (!m) return false;
  if (YIL_REGEX.test(m)) return true;
  return GUNCELLIK_KELIMELERI.some((k) => m.includes(k));
};
