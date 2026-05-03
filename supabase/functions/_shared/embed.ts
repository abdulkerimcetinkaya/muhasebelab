// HuggingFace Inference API — multilingual-e5-small (384-dim, Türkçe destekli)
// Router endpoint: hf-inference provider üzerinden serverless çağrı.
//
// e5 modelleri "query:" / "passage:" prefix bekler:
//  - Sorgu metinleri (kullanıcı sorusu): 'query: ...'
//  - İndekslenen metinler (mevzuat chunk): 'passage: ...'
// Bu prefix retrieval isabetini ciddi artırır.

const HF_URL =
  'https://router.huggingface.co/hf-inference/models/intfloat/multilingual-e5-small/pipeline/feature-extraction';

const HF_KEY = Deno.env.get('HF_API_KEY');

export type E5Mod = 'query' | 'passage';

const prefixle = (text: string, mod: E5Mod): string => {
  const t = text.trim();
  return mod === 'query' ? `query: ${t}` : `passage: ${t}`;
};

/**
 * Tek metni 384-dim embedding vektörüne çevirir.
 * mod: 'query' (sorgu) veya 'passage' (indekslenen mevzuat) — varsayılan 'query'.
 */
export const embed = async (text: string, mod: E5Mod = 'query'): Promise<number[]> => {
  if (!HF_KEY) throw new Error('HF_API_KEY ayarlanmamış (Supabase secret).');
  if (!text || text.trim().length === 0) throw new Error('Boş metin embedlenemez.');

  const res = await fetch(HF_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prefixle(text, mod),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HF embed hatası (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  if (!Array.isArray(data) || typeof data[0] !== 'number') {
    throw new Error('HF beklenmeyen yanıt formatı');
  }
  if (data.length !== 384) {
    throw new Error(`Beklenmeyen embedding boyutu: ${data.length}`);
  }
  return data as number[];
};
