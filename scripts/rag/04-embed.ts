/**
 * Adım 4 — OpenAI text-embedding-3-small ile chunk embedding'leri üret.
 *
 * Neden OpenAI:
 *   - Cohere/Gemini ücretsiz tier'larıyla yorucu rate limit dansı yaptık.
 *   - $0.020 / 1M token — pratikte 12 kaynak için ~$0.05 (5 sent)
 *   - $5 minimum yatırım ~80 yıl yeter (kullanıcı dahil).
 *   - Rate limit endişesi yok (tier 1: 5000 RPM, 5M TPM).
 *
 * Model: text-embedding-3-small
 *   - 1536 boyutlu vektör (vector(1536) schema'ya uygun)
 *   - Türkçe için yeterli kalite (OpenAI multilingual eğitildi)
 *
 * Batch: API başına 2048 input desteklerken biz 100'lük güvenli batch
 * kullanıyoruz — payload boyutu kontrolü için.
 */

import type { Chunk, EmbeddedChunk } from './lib/types.js';

const OPENAI_URL = 'https://api.openai.com/v1/embeddings';
const MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const BATCH = 100;

interface OpenAIResp {
  data: Array<{ embedding: number[]; index: number }>;
  usage: { prompt_tokens: number; total_tokens: number };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const embed = async (metinler: string[], retryEttiMi = false): Promise<number[][]> => {
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

  // 429 rate limit → 30 saniye bekle + tek retry
  if (yanit.status === 429 && !retryEttiMi) {
    console.log(`  ⏸ 429 rate limit, 30 saniye bekleniyor + retry...`);
    await sleep(30_000);
    return embed(metinler, true);
  }

  if (!yanit.ok) {
    const hata = await yanit.text();
    throw new Error(`OpenAI embedding hatası ${yanit.status}: ${hata}`);
  }

  const json = (await yanit.json()) as OpenAIResp;
  json.data.sort((a, b) => a.index - b.index);
  return json.data.map((d) => d.embedding);
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

    if (i + BATCH < chunks.length) {
      await sleep(200);
    }
  }

  // Maliyet tahmini ($0.020 / 1M token)
  const maliyetUSD = (toplamToken / 1_000_000) * 0.020;
  const toplamSure = Math.round((Date.now() - baslangic) / 1000);
  console.log(
    `  💰 maliyet: $${maliyetUSD.toFixed(4)} (${toplamToken} tok, ${toplamSure}s)`,
  );

  return sonuc;
};
