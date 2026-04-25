// AI Yanlış Analizi — yanlış yevmiye kaydını satır satır eleştirip doğruya yönlendirir
// Premium gerekir. Günlük limit: kullanıcı başına 50 istek.

import { corsHeaders } from '../_shared/cors.ts';
import { kullaniciDogrula, premiumKontrol } from '../_shared/auth.ts';
import { anthropicCagir } from '../_shared/anthropic.ts';

interface CozumSatir {
  kod: string;
  borc: number;
  alacak: number;
}

interface Istek {
  soruBaslik: string;
  senaryo: string;
  dogruCozum: CozumSatir[];
  kullaniciCevap: CozumSatir[];
}

const SYSTEM_PROMPT = `Sen Türk muhasebe öğrencilerine rehberlik eden deneyimli bir muhasebe öğretmenisin.
Tek Düzen Hesap Planı'na göre yevmiye kayıtlarını değerlendiriyorsun.

Kullanıcı bir soruyu yanlış çözdü. Sana hem doğru çözümü hem de kullanıcının cevabını vereceğim.
Görevin:
1. Kullanıcının neyi yanlış yaptığını net bir şekilde tespit et (hangi hesap kodu yanlış? borç/alacak yönü mü hatalı? eksik satır mı var? fazla satır mı var?)
2. Yanlışın altında yatan kavramsal hatayı açıkla ("bu hesap neden kullanılmaz?", "burada neden aktif karakterli hesap gerekli?")
3. Öğrencinin bir sonraki benzer soruda doğru düşünmesi için pratik bir ipucu ver

Ton: sıcak, teşvik edici, akademik ama dostça. Asla küçümseme. Hata doğal karşıla.
Maksimum 250 kelime. Madde işaretleri kullan, başlıkları **kalın** yap.
"Cevabın yanlış" gibi basit ifadelerle başlama — doğrudan analize gir.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const yetki = await kullaniciDogrula(req);
    if (yetki instanceof Response) return yetki;

    const premium = await premiumKontrol(yetki.supabase, yetki.user.id);
    if (!premium) {
      return new Response(
        JSON.stringify({ hata: 'Bu özellik premium üyelik gerektirir' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { soruBaslik, senaryo, dogruCozum, kullaniciCevap }: Istek = await req.json();

    const formatSatir = (s: CozumSatir[]) =>
      s.map((r) => `- ${r.kod}: Borç ${r.borc}, Alacak ${r.alacak}`).join('\n');

    const mesaj = `**Soru:** ${soruBaslik}

**Senaryo:** ${senaryo}

**Doğru çözüm:**
${formatSatir(dogruCozum)}

**Öğrencinin cevabı:**
${formatSatir(kullaniciCevap)}

Yukarıdaki farkları analiz et ve öğrenciye yol göster.`;

    const yanit = await anthropicCagir(SYSTEM_PROMPT, [{ role: 'user', content: mesaj }], 600);

    return new Response(
      JSON.stringify({ metin: yanit.metin, token: yanit.inputToken + yanit.outputToken }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ hata: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
