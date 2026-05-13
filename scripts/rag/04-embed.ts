/**
 * Adım 4 — Cohere embed-multilingual-v3.0 ile chunk embedding'leri üret.
 *
 * Neden Cohere:
 *   - Free trial: 1000 çağrı/ay (bizim için fazlasıyla yeter — ~50 çağrı yapacağız)
 *   - Türkçe için özel tunlanmış (multilingual-v3 100+ dilde eğitildi)
 *   - Kredi kartı zorunluluğu yok, email ile kayıt
 *
 * Model: embed-multilingual-v3.0
 *   - 1024 boyutlu vektör (migration vector(1024)'e göre ayarlı)
 *   - input_type=search_document → indexlenen metin (sorgu zamanı search_query)
 *   - Batch sınırı: 96 input/çağrı
 *
 * Rate limit (trial): 100 RPM. 50 batch çağrımız sorunsuz geçer.
 *
 * EMBEDDING_MODEL env var ile model değiştirilebilir.
 */

import type { Chunk, EmbeddedChunk } from './lib/types.js';

const COHERE_URL = 'https://api.cohere.com/v2/embed';
const MODEL = process.env.EMBEDDING_MODEL || 'embed-multilingual-v3.0';
const BATCH = 96; // Cohere v2/embed limit

interface CohereResp {
  embeddings: { float: number[][] };
  meta?: { billed_units?: { input_tokens?: number } };
}

const embed = async (metinler: string[]): Promise<number[][]> => {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error('COHERE_API_KEY env değişkeni tanımlı değil');

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

  if (!yanit.ok) {
    const hata = await yanit.text();
    throw new Error(`Cohere embedding hatası ${yanit.status}: ${hata}`);
  }

  const json = (await yanit.json()) as CohereResp;
  return json.embeddings.float;
};

export const chunklariGom = async (chunks: Chunk[]): Promise<EmbeddedChunk[]> => {
  const sonuc: EmbeddedChunk[] = [];
  let toplamToken = 0;
  let cohereToken = 0;

  for (let i = 0; i < chunks.length; i += BATCH) {
    const grup = chunks.slice(i, i + BATCH);
    const metinler = grup.map((c) => c.metin);

    // Cohere her batch'in token sayısını döndürüyor — gerçek değer
    const yanitBaslangic = Date.now();
    const embeddingler = await embed(metinler);
    const sure = Date.now() - yanitBaslangic;

    for (let j = 0; j < grup.length; j++) {
      sonuc.push({ ...grup[j], embedding: embeddingler[j] });
      toplamToken += grup[j].token_sayisi;
    }

    console.log(
      `  ⚡ embedding: ${Math.min(i + BATCH, chunks.length)}/${chunks.length} chunk (~${toplamToken} tok, ${sure}ms)`,
    );

    // Rate limit dostu (100 RPM = 600ms aralık güvenli)
    if (i + BATCH < chunks.length) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  console.log(
    `  💰 maliyet: $0 (Cohere ücretsiz tier — ${toplamToken} tahmini token${cohereToken ? `, ${cohereToken} faturalanan` : ''})`,
  );

  return sonuc;
};
