/**
 * Adım 4 — Cohere embed-multilingual-v3.0 ile chunk embedding'leri üret.
 *
 * Neden Cohere:
 *   - Free trial: 1000 çağrı/ay (bizim için fazlasıyla yeter)
 *   - Türkçe için özel tunlanmış (100+ dilde eğitildi)
 *   - Kredi kartı zorunluluğu yok
 *
 * Model: embed-multilingual-v3.0 (1024 boyut, vector(1024))
 *
 * RATE LIMIT — Trial tier:
 *   - 100 RPM (request per minute)
 *   - 100.000 token/dakika
 *
 * 100K tok/dakika sınırının altında kalmak için:
 *   - BATCH = 48 chunk (~12K tok/batch ortalama)
 *   - Her batch sonrası 15 saniye sleep (yaklaşık 4 batch/dakika = 48K tok/dakika)
 *   - 429 hatasında 60 saniye bekle + tek retry
 *
 * Total ~5000 chunk için tahmini süre: ~26 dakika.
 */

import type { Chunk, EmbeddedChunk } from './lib/types.js';

const COHERE_URL = 'https://api.cohere.com/v2/embed';
const MODEL = process.env.EMBEDDING_MODEL || 'embed-multilingual-v3.0';
const BATCH = 48;
const BATCH_ARASI_MS = 15_000; // 100K tok/dakika limit için güvenli aralık
const RETRY_BEKLEME_MS = 65_000; // 429 sonrası 1 dakika+5s bekle

interface CohereResp {
  embeddings: { float: number[][] };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Tek bir batch embedding çağrısı. 429 hatasında bir kez retry yapar. */
const embedTekRetry = async (
  metinler: string[],
  apiKey: string,
  retryEttiMi = false,
): Promise<number[][]> => {
  const body = {
    model: MODEL,
    texts: metinler,
    input_type: 'search_document',
    embedding_types: ['float'],
  };

  const yanit = await fetch(COHERE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (yanit.status === 429 && !retryEttiMi) {
    console.log(
      `  ⏸ rate limit yedik, ${RETRY_BEKLEME_MS / 1000}s bekleniyor sonra retry...`,
    );
    await sleep(RETRY_BEKLEME_MS);
    return embedTekRetry(metinler, apiKey, true);
  }

  if (!yanit.ok) {
    const hata = await yanit.text();
    throw new Error(`Cohere embedding hatası ${yanit.status}: ${hata}`);
  }

  const json = (await yanit.json()) as CohereResp;
  return json.embeddings.float;
};

const embed = (metinler: string[]): Promise<number[][]> => {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error('COHERE_API_KEY env değişkeni tanımlı değil');
  return embedTekRetry(metinler, apiKey);
};

export const chunklariGom = async (chunks: Chunk[]): Promise<EmbeddedChunk[]> => {
  const sonuc: EmbeddedChunk[] = [];
  let toplamToken = 0;
  const baslangic = Date.now();

  for (let i = 0; i < chunks.length; i += BATCH) {
    const grup = chunks.slice(i, i + BATCH);
    const metinler = grup.map((c) => c.metin);

    const t0 = Date.now();
    const embeddingler = await embed(metinler);
    const sure = Date.now() - t0;

    for (let j = 0; j < grup.length; j++) {
      sonuc.push({ ...grup[j], embedding: embeddingler[j] });
      toplamToken += grup[j].token_sayisi;
    }

    const ilerleme = Math.min(i + BATCH, chunks.length);
    console.log(
      `  ⚡ embedding: ${ilerleme}/${chunks.length} chunk (~${toplamToken} tok, ${sure}ms)`,
    );

    // Rate limit dostu bekleme (sadece daha batch varsa)
    if (i + BATCH < chunks.length) {
      await sleep(BATCH_ARASI_MS);
    }
  }

  const toplamSure = Math.round((Date.now() - baslangic) / 1000);
  console.log(
    `  💰 maliyet: $0 (Cohere ücretsiz tier — ${toplamToken} tok, ${toplamSure}s)`,
  );

  return sonuc;
};
