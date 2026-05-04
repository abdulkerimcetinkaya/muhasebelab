// Admin → kullanıcı e-posta gönderimi (Resend.com API üzerinden)
// Sadece is_admin() yetkisi olan kullanıcılar çağırabilir.
// Env: RESEND_API_KEY zorunlu, RESEND_FROM_EMAIL zorunlu (örn: 'noreply@muhasebelab.com')

import { corsHeaders } from '../_shared/cors.ts';
import { kullaniciDogrula } from '../_shared/auth.ts';

interface Istek {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

const RESEND_API = 'https://api.resend.com/emails';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1) Auth doğrula (Response döndürürse direkt dön)
    const auth = await kullaniciDogrula(req);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    // is_admin RPC kontrolü
    const { data: adminMi, error: adminHata } = await supabase.rpc('is_admin');
    if (adminHata || !adminMi) {
      return new Response(JSON.stringify({ hata: 'Yetkisiz' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2) Env kontrol
    const apiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL');
    if (!apiKey || !fromEmail) {
      return new Response(
        JSON.stringify({
          hata: 'E-posta servisi yapılandırılmamış. RESEND_API_KEY ve RESEND_FROM_EMAIL Supabase secret olarak eklenmeli.',
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // 3) İstek parse
    const istek = (await req.json()) as Istek;
    if (!istek.to || !istek.subject || !istek.body) {
      return new Response(JSON.stringify({ hata: 'to, subject, body zorunlu' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4) Resend API
    const yanit = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: istek.to,
        subject: istek.subject,
        ...(istek.isHtml ? { html: istek.body } : { text: istek.body }),
      }),
    });

    if (!yanit.ok) {
      const hataDetay = await yanit.text();
      return new Response(
        JSON.stringify({
          hata: `Resend API hatası (${yanit.status}): ${hataDetay}`,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const sonuc = await yanit.json();
    return new Response(JSON.stringify({ basarili: true, id: sonuc.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ hata: e instanceof Error ? e.message : String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
