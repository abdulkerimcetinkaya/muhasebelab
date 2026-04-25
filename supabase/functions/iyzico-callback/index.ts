// İyzico CF callback — ödeme tamamlanınca iyzico bu URL'e POST atar.
// Body application/x-www-form-urlencoded: { token, ... }
// Biz token ile cfRetrieve yapıp paymentStatus=SUCCESS ise premium aktive ediyoruz.
// Sonunda kullanıcıyı APP_BASE_URL/#/premium/sonuc?... sayfasına 302 ile yönlendiriyoruz.
//
// Bu function PUBLIC — JWT istemiyor (iyzico'nun JWT'si yok). Güvenlik token bazlı:
// retrieve'in yanıtını ve conversationId'yi DB ile çapraz doğruluyoruz.

import { cfRetrieve } from '../_shared/iyzico.ts';
// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const APP_BASE_URL =
  Deno.env.get('APP_BASE_URL') ?? 'http://localhost:5173';

const redirect = (durum: 'basarili' | 'hata' | 'iptal', detay?: string): Response => {
  const url = new URL(`${APP_BASE_URL}/#/premium/sonuc`);
  // HashRouter — query parametresini hash'in içine yazmamız lazım
  const hashParams = new URLSearchParams({ durum });
  if (detay) hashParams.set('detay', detay);
  return Response.redirect(`${APP_BASE_URL}/#/premium/sonuc?${hashParams.toString()}`, 302);
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok');

  try {
    let token = '';
    let conversationIdGuess = '';

    const ct = req.headers.get('content-type') ?? '';
    if (ct.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData();
      token = String(form.get('token') ?? '');
      conversationIdGuess = String(form.get('conversationId') ?? '');
    } else if (ct.includes('application/json')) {
      const body = await req.json();
      token = body?.token ?? '';
      conversationIdGuess = body?.conversationId ?? '';
    } else {
      // Bazı entegrasyonlarda token query'de gelir
      const u = new URL(req.url);
      token = u.searchParams.get('token') ?? '';
      conversationIdGuess = u.searchParams.get('conversationId') ?? '';
    }

    if (!token) return redirect('hata', 'token-yok');

    const detay = await cfRetrieve(token, conversationIdGuess || 'unknown');
    const conversationId = detay.conversationId;

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } },
    );

    const { data: odeme } = await admin
      .from('odemeler')
      .select('user_id, plan_kodu, durum')
      .eq('conversation_id', conversationId)
      .maybeSingle();

    if (!odeme) return redirect('hata', 'odeme-bulunamadi');

    if (detay.paymentStatus !== 'SUCCESS' || detay.status !== 'success') {
      // Başarısız → odemeler durumunu güncelle
      await admin
        .from('odemeler')
        .update({
          durum: 'hata',
          callback_token: token,
          hata_mesaji: detay.errorMessage ?? `paymentStatus=${detay.paymentStatus ?? 'unknown'}`,
          ham_yanit: detay as any,
        })
        .eq('conversation_id', conversationId);
      return redirect('hata', detay.errorMessage ?? 'odeme-basarisiz');
    }

    // Başarılı → idempotent RPC ile premium'u aç
    const { error: rpcErr } = await admin.rpc('odeme_premium_aktive', {
      _user: odeme.user_id,
      _conversation_id: conversationId,
      _plan_kodu: odeme.plan_kodu,
      _iyzico_ref: detay.paymentId ?? null,
      _ham_yanit: detay as any,
    });
    if (rpcErr) {
      console.error('odeme_premium_aktive', rpcErr);
      return redirect('hata', 'aktivasyon-hatasi');
    }

    return redirect('basarili');
  } catch (e) {
    console.error(e);
    return redirect('hata', (e as Error).message);
  }
});
