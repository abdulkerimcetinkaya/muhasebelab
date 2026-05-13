/**
 * Adım 4 — Google Gemini text-embedding-004 ile chunk embedding'leri üret.
 *
 * Neden Gemini:
 *   - Ücretsiz tier'da 1500 request/gün (bizim için fazlasıyla yeter)
 *   - Türkçe kalitesi yüksek
 *   - Kredi kartı zorunluluğu yok
 *
 * Dimension: 768 (text-embedding-004 default).
 * Migration `rag_chunks.embedding` kolonu da vector(768) olarak tanımlı.
 *
 * Batch sınırı: API başına 100 input. Biz 100'lük batch kullanıyoruz —
 * rate limit'e takılmıyor, retry mantığına gerek bırakmıyor.
 *
 * EMBEDDING_MODEL env var ile model değiştirilebilir.
 */

import type { Chunk, EmbeddedChunk } from './lib/types.js';

const MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-004';
const BATCH = 100;

const apiUrl = (model: string, apiKey: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:batchEmbedContents?key=${apiKey}`;

interface GeminiResp {
  embeddings: Array<{ values: number[] }>;
}

const embed = async (metinler: string[]): Promise<number[][]> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY env değişkeni tanımlı değil');

  const body = {
    requests: metinler.map((text) => ({
      model: `models/${MODEL}`,
      content: { parts: [{ text }] },
    })),
  };

  const yanit = await fetch(apiUrl(MODEL, apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!yanit.ok) {
    const hata = await yanit.text();
    throw new Error(`Gemini embedding hatası ${yanit.status}: ${hata}`);
  }

  const json = (await yanit.json()) as GeminiResp;
  return json.embeddings.map((e) => e.values);
};

export const chunklariGom = async (chunks: Chunk[]): Promise<EmbeddedChunk[]> => {
  const sonuc: EmbeddedChunk[] = [];
  let toplamToken = 0;

  for (let i = 0; i < chunks.length; i += BATCH) {
    const grup = chunks.slice(i, i + BATCH);
    const metinler = grup.map((c) => c.metin);
    const embeddingler = await embed(metinler);

    for (let j = 0; j < grup.length; j++) {
      sonuc.push({ ...grup[j], embedding: embeddingler[j] });
      toplamToken += grup[j].token_sayisi;
    }

    console.log(
      `  ⚡ embedding: ${Math.min(i + BATCH, chunks.length)}/${chunks.length} chunk (≈${toplamToken} token)`,
    );

    // Rate limit dostu kısa nefes (15K tok/min limit'e takılmamak için)
    if (i + BATCH < chunks.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Gemini text-embedding-004 ücretsiz tier'da
  console.log(`  💰 maliyet: $0 (Gemini ücretsiz tier — ${toplamToken} token)`);

  return sonuc;
};
