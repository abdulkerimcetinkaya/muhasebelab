// OpenAI text-embedding-3-small — RAG sorgu embedding'i için
//
// `rag_chunks` tablosundaki belge embedding'leri pipeline tarafında üretilmiş
// (scripts/rag/04-embed.ts). Bu modül kullanıcı SORGUSU için runtime embedding
// üretir — Edge Function ai-asistan içinde çağrılır.
//
// 1536 boyutlu vector döner, rag_ara RPC ile uyumlu.
// Maliyet pratikte sıfır: sorgu başına ~100 token = $0.000002.

const OPENAI_URL = 'https://api.openai.com/v1/embeddings';
const MODEL = 'text-embedding-3-small';

interface OpenAIResp {
  data: Array<{ embedding: number[]; index: number }>;
}

/**
 * Tek metni 1536-dim embedding vektörüne çevirir.
 * Sorgu embedding'i için (RAG retrieval'da kullanılır).
 */
export const embedOpenAI = async (text: string): Promise<number[]> => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY ayarlanmamış (Supabase secret).');
  if (!text || text.trim().length === 0) throw new Error('Boş metin embedlenemez.');

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      input: text.trim().slice(0, 8000), // OpenAI 8K token limiti güvenliği
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI embed hatası (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as OpenAIResp;
  if (!Array.isArray(data.data) || data.data.length === 0) {
    throw new Error('OpenAI beklenmeyen yanıt formatı');
  }
  const emb = data.data[0].embedding;
  if (emb.length !== 1536) {
    throw new Error(`Beklenmeyen embedding boyutu: ${emb.length}`);
  }
  return emb;
};
