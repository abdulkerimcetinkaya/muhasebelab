// Gemini streamGenerateContent — token-token AsyncIterable döner.
// Client'a SSE format'ta tekrar stream edilir, kullanıcı yazılırken görür.

interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const PRIMARY = 'gemini-2.5-flash';

const ENDPOINT = (model: string, apiKey: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

/**
 * Gemini'a streaming çağrı. Her chunk için bir text parça yield eder.
 * Hata olursa exception fırlatır — caller try/catch yapmalı.
 */
export async function* geminiStream(
  systemPrompt: string,
  contents: GeminiContent[],
  maxTokens = 400,
): AsyncIterable<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY secret eksik');

  const res = await fetch(ENDPOINT(PRIMARY, apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
        // Gemini 2.5 Flash thinking özelliği output budget'ını yiyebiliyor —
        // 400 token limit'iyle düşünceler tüm bütçeyi alıp cevap için 0 bırakıyor,
        // sonuç boş response. Non-stream yolunda (anthropic.ts) zaten kapalı,
        // burada da aynı şekilde kapatıyoruz.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => '');
    throw new Error(`Gemini stream ${res.status}: ${body.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE chunk format: "data: {json}\n\n"
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? ''; // tamamlanmamış son kısmı sakla

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed.startsWith('data:')) continue;
      const json = trimmed.slice(5).trim();
      if (!json) continue;
      try {
        const data = JSON.parse(json);
        // Debug — boş cevap sebebini görmek için: finishReason, safety, error
        if (data.error) {
          console.error('Gemini stream error:', JSON.stringify(data.error));
        }
        const cand = data.candidates?.[0];
        if (cand?.finishReason && cand.finishReason !== 'STOP') {
          console.error('Gemini finishReason:', cand.finishReason, 'safetyRatings:', JSON.stringify(cand.safetyRatings ?? []));
        }
        const text = cand?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? '')
          .join('') ?? '';
        if (text) yield text;
      } catch {
        // parse hatası — chunk eksik veya bozuk, sıradakine geç
      }
    }
  }
}
