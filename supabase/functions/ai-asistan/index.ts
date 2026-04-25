// AI Muhasebe Asistanı — soru çözerken yan panelde chat
// Free: 3 sorgu/gün, Premium: sınırsız. Conversation history frontend'den (ephemeral).

import { corsHeaders } from '../_shared/cors.ts';
import { kullaniciDogrula, premiumKontrol } from '../_shared/auth.ts';
import { anthropicCagir, type AnthropicMesaj } from '../_shared/anthropic.ts';

const FREE_GUNLUK_LIMIT = 3;

interface Istek {
  mesajlar: AnthropicMesaj[];
  baglam?: {
    soruBaslik?: string;
    senaryo?: string;
  };
}

const SYSTEM_PROMPT_BAZ = `Sen MuhasebeLab platformunda Türk muhasebe öğrencilerine yardım eden bir AI asistansın.
Tek Düzen Hesap Planı, yevmiye kayıtları, KDV, amortisman, dönem sonu işlemleri gibi konularda uzmanlaşmışsın.

Kurallar:
- Türkçe cevap ver, sıcak ve teşvik edici bir ton kullan
- Açıklamaların kısa ve öz olsun (max 200 kelime)
- Öğrencinin çözmekte olduğu soruyu doğrudan çözme — sadece kavramı anlat ve öğrencinin kendi çözmesini teşvik et
- Örnekler ver ama farklı hesap kodları/rakamlarla — mevcut soruyu kopyalama
- Madde işaretleri ve **kalın** vurgular kullan
- Konuyla ilgisiz (muhasebe dışı) sorulara nazikçe "ben muhasebe konularında yardımcı olabilirim" diye yanıt ver`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const yetki = await kullaniciDogrula(req);
    if (yetki instanceof Response) return yetki;

    const premium = await premiumKontrol(yetki.supabase, yetki.user.id);

    // Free: günlük kontör artır; Premium: bypass
    let kalan: number | null = null;
    if (!premium) {
      const { data: quota, error: qErr } = await yetki.supabase.rpc('ai_quota_artir', {
        _max: FREE_GUNLUK_LIMIT,
      });
      if (qErr) {
        return new Response(
          JSON.stringify({ hata: 'Kota kontrolü başarısız', detay: qErr.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      if (!quota?.izin_var) {
        return new Response(
          JSON.stringify({
            hata: 'Günlük AI sorgu hakkın doldu',
            limit: quota?.limit ?? FREE_GUNLUK_LIMIT,
            kalan: 0,
            premium_gerekli: true,
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      kalan = (quota.limit ?? FREE_GUNLUK_LIMIT) - (quota.sayac ?? 0);
    }

    const { mesajlar, baglam }: Istek = await req.json();

    if (!Array.isArray(mesajlar) || mesajlar.length === 0) {
      return new Response(JSON.stringify({ hata: 'Mesaj yok' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Güvenlik: son 10 mesajı tut, uzun konuşmaları kes
    const kesit = mesajlar.slice(-10);

    let systemPrompt = SYSTEM_PROMPT_BAZ;
    if (baglam?.soruBaslik || baglam?.senaryo) {
      systemPrompt += `\n\nÖğrenci şu anda şu soru üzerinde çalışıyor:
**Başlık:** ${baglam.soruBaslik ?? '-'}
**Senaryo:** ${baglam.senaryo ?? '-'}

Bu soruyu doğrudan çözme ama öğrencinin ilgili kavramları anlamasına yardım et.`;
    }

    const yanit = await anthropicCagir(systemPrompt, kesit, 500);

    return new Response(
      JSON.stringify({
        metin: yanit.metin,
        token: yanit.inputToken + yanit.outputToken,
        kalan,
        premium,
      }),
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
