// AI sağlayıcı — Gemini 2.5 Flash (ücretsiz tier: 1500 istek/gün)
// Dosya adı geçmiş uyumluluk için "anthropic.ts" kaldı; içerik Google Gemini çağırıyor.

export interface AnthropicMesaj {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicYanit {
  metin: string;
  inputToken: number;
  outputToken: number;
}

interface GeminiPart {
  text: string;
}
interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}
interface GeminiResponse {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  error?: { message?: string };
}

// Gemini 2.0 Flash stabil kapasite. 2.5 Flash daha akıllı ama 503 sıkça veriyor.
const PRIMARY_MODEL = 'gemini-2.0-flash';
const FALLBACK_MODEL = 'gemini-2.5-flash';

const uyku = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface CagirOpts {
  jsonMode?: boolean;
}

const geminiCagirDene = async (
  model: string,
  apiKey: string,
  systemPrompt: string,
  contents: GeminiContent[],
  maxTokens: number,
  jsonMode: boolean,
): Promise<Response> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: maxTokens,
    temperature: 0.7,
  };
  if (jsonMode) generationConfig.responseMimeType = 'application/json';
  return fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig,
    }),
  });
};

export const anthropicCagir = async (
  systemPrompt: string,
  mesajlar: AnthropicMesaj[],
  maxTokens = 800,
  opts: CagirOpts = {},
): Promise<AnthropicYanit> => {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY secret eksik');

  const contents: GeminiContent[] = mesajlar.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Sırasıyla: primary → fallback → yedek. Her biri retry ile.
  const modeller: [string, number[]][] = [
    [PRIMARY_MODEL, [0, 1000, 3000]],
    [FALLBACK_MODEL, [0, 2000]],
    ['gemini-1.5-flash', [0, 1500, 4000]],
  ];

  let sonHata = '';
  for (const [model, beklemeler] of modeller) {
    for (const bekle of beklemeler) {
      if (bekle > 0) await uyku(bekle);
      const res = await geminiCagirDene(model, apiKey, systemPrompt, contents, maxTokens, opts.jsonMode ?? false);
      if (res.ok) {
        const data: GeminiResponse = await res.json();
        if (data.error) {
          sonHata = `Gemini: ${data.error.message ?? 'bilinmeyen'}`;
          continue;
        }
        const metin = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';
        return {
          metin,
          inputToken: data.usageMetadata?.promptTokenCount ?? 0,
          outputToken: data.usageMetadata?.candidatesTokenCount ?? 0,
        };
      }
      const govde = await res.text();
      sonHata = `Gemini API hatası ${res.status} (${model}): ${govde}`;
      // 4xx (rate limit hariç) retry etmeye değmez
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break;
    }
  }
  throw new Error(sonHata || 'Gemini çağrısı başarısız');
};
