/**
 * Adım 4 — OpenAI text-embedding-3-small ile chunk embedding'leri üret.
 *
 * Batch sınırı: API çağrı başına max 2048 input. Biz 100'lük batch
 * kullanıyoruz — daha küçük, daha güvenilir, rate-limit'e takılmıyor.
 *
 * Maliyet: $0.02 / 1M token. 5000 sayfa mevzuat ≈ 2.5M token ≈ $0.05.
 * 5 dolar zaten cüzdandan zar zor çıkar.
 *
 * EMBEDDING_MODEL env var ile model değiştirilebilir (ileride Cohere
 * eklenecek olursa ayrı bir provider implementasyonu olur).
 */

import type { Chunk, EmbeddedChunk } from './lib/types.js';

const OPENAI_URL = 'https://api.openai.com/v1/embeddings';
const MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const BATCH = 100;

interface OpenAIResp {
  data: Array<{ embedding: number[]; index: number }>;
  usage: { prompt_tokens: number; total_tokens: number };
}

const embed = async (metinler: string[]): Promise<number[][]> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY env değişkeni tanımlı değil');

  const yanit = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: MODEL, input: metinler }),
  });

  if (!yanit.ok) {
    const hata = await yanit.text();
    throw new Error(`OpenAI embedding hatası ${yanit.status}: ${hata}`);
  }

  const json = (await yanit.json()) as OpenAIResp;
  // Index'e göre sırala — bazen out-of-order dönüyor
  json.data.sort((a, b) => a.index - b.index);
  return json.data.map((d) => d.embedding);
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

    // Rate limit'e takılmamak için kısa nefes
    if (i + BATCH < chunks.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Maliyet tahmini ($0.02 / 1M token = $0.00000002 / token)
  const maliyetUSD = (toplamToken / 1_000_000) * 0.02;
  console.log(`  💰 tahmini maliyet: $${maliyetUSD.toFixed(4)} (${toplamToken} token)`);

  return sonuc;
};
