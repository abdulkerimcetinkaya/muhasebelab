// İyzico Checkout Form — ödeme başlatma.
// Frontend plan_kodu gönderir; biz iyzico'da CF init ediyoruz, paymentPageUrl döndürüyoruz.
// odemeler tablosuna 'beklemede' kayıt atılır; conversation_id ile callback'te eşleştirilir.

import { corsHeaders } from '../_shared/cors.ts';
import { kullaniciDogrula } from '../_shared/auth.ts';
import { cfInit, type CFInitIstek } from '../_shared/iyzico.ts';
// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

interface Istek {
  plan_kodu: string;
  adet?: number;
  indirim_kodu?: string;
}

interface PlanRow {
  kod: string;
  ad: string;
  tutar: number;
  ay_sayisi: number;
  para_birimi: string;
  aktif: boolean;
}

const formatTutar = (n: number): string => n.toFixed(2);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const yetki = await kullaniciDogrula(req);
    if (yetki instanceof Response) return yetki;

    const { plan_kodu, adet: adetRaw, indirim_kodu }: Istek = await req.json();
    if (!plan_kodu) {
      return new Response(JSON.stringify({ hata: 'plan_kodu gerekli' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // adet: 1-500 arası tam sayı, default 1 (bireysel)
    const adet = Math.min(500, Math.max(1, Math.floor(Number(adetRaw) || 1)));
    if (!Number.isFinite(adet) || adet < 1) {
      return new Response(JSON.stringify({ hata: 'adet 1-500 arası olmalı' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const indirimKoduTrim = (indirim_kodu ?? '').trim().toUpperCase();

    // Plan bilgisi (RLS public okuma açık)
    const { data: plan, error: pErr } = await yetki.supabase
      .from('planlar')
      .select('*')
      .eq('kod', plan_kodu)
      .eq('aktif', true)
      .maybeSingle<PlanRow>();
    if (pErr || !plan) {
      return new Response(JSON.stringify({ hata: 'Plan bulunamadı' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Kullanıcı profili (ad/soyad için)
    const { data: profil } = await yetki.supabase
      .from('kullanicilar')
      .select('kullanici_adi, email')
      .eq('id', yetki.user.id)
      .maybeSingle();
    const ad = (profil?.kullanici_adi || 'Öğrenci').trim();
    const [adIlk, ...adKalan] = ad.split(' ');
    const adSoyad = {
      name: adIlk || 'Öğrenci',
      surname: adKalan.join(' ') || 'MuhasebeLab',
    };

    // conversationId — bizim taraf takip için
    const conversationId = `${yetki.user.id.slice(0, 8)}-${Date.now()}`;
    const callbackUrlBase = Deno.env.get('IYZICO_CALLBACK_URL'); // örn: https://muhasebelab.com/iyzico-callback
    if (!callbackUrlBase) {
      return new Response(
        JSON.stringify({ hata: 'IYZICO_CALLBACK_URL ayarlı değil (ortam değişkeni)' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // odemeler kaydı (service-role ile insert — RLS bu tabloya insert vermiyor)
    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } },
    );
    const indirimOncesi = Number(plan.tutar) * adet;
    let indirimYuzde = 0;
    let indirimId: string | null = null;

    // İndirim kodu varsa: kullanıcı JWT'siyle doğrula (RPC SECURITY DEFINER
    // olduğu için kendi user_id'sini görebilir)
    if (indirimKoduTrim) {
      const { data: dogr, error: dogrErr } = await yetki.supabase.rpc(
        'indirim_dogrula',
        { _kod: indirimKoduTrim, _plan_kodu: plan.kod },
      );
      if (dogrErr) {
        return new Response(
          JSON.stringify({ hata: 'İndirim doğrulanamadı', detay: dogrErr.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      const sonuc = Array.isArray(dogr) ? dogr[0] : dogr;
      if (!sonuc?.gecerli) {
        return new Response(
          JSON.stringify({ hata: sonuc?.sebep ?? 'Geçersiz indirim kodu' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      indirimYuzde = Number(sonuc.indirim_yuzde) || 0;
      indirimId = sonuc.indirim_id ?? null;

      // %100 indirim: iyzico atla, doğrudan ücretsiz aktive
      if (indirimYuzde >= 100) {
        const { data: ucr, error: ucrErr } = await yetki.supabase.rpc(
          'indirim_kullan_ucretsiz',
          { _kod: indirimKoduTrim, _plan_kodu: plan.kod },
        );
        if (ucrErr) {
          return new Response(
            JSON.stringify({ hata: 'Ücretsiz aktivasyon başarısız', detay: ucrErr.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }
        const ucrSonuc = Array.isArray(ucr) ? ucr[0] : ucr;
        if (!ucrSonuc?.basarili) {
          return new Response(
            JSON.stringify({ hata: ucrSonuc?.hata ?? 'Aktivasyon başarısız' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }
        // Frontend ucretsiz=true görünce HashRouter ile sonuç sayfasına gidecek
        return new Response(
          JSON.stringify({
            token: 'free-' + crypto.randomUUID(),
            paymentPageUrl: '',
            conversationId: 'free-' + crypto.randomUUID(),
            ucretsiz: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    const toplamTutar = Math.round(indirimOncesi * (1 - indirimYuzde / 100) * 100) / 100;

    const { error: odErr } = await adminSupabase.from('odemeler').insert({
      user_id: yetki.user.id,
      conversation_id: conversationId,
      plan_kodu: plan.kod,
      tutar: toplamTutar,
      para_birimi: plan.para_birimi,
      // mevcut odeme_donem enum: 'aylik' | 'yillik' — donemlik plan da 'aylik' enum'a yazılır,
      // ay_sayisi kolonu kanonik kaynak.
      donem: 'aylik',
      durum: 'beklemede',
      adet,
      indirim_id: indirimId,
      indirim_yuzde: indirimYuzde > 0 ? indirimYuzde : null,
      indirim_oncesi_tutar: indirimYuzde > 0 ? indirimOncesi : null,
    });
    if (odErr) {
      return new Response(
        JSON.stringify({ hata: 'Ödeme kaydı oluşturulamadı', detay: odErr.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const fiyatStr = formatTutar(toplamTutar);
    const istek: CFInitIstek = {
      locale: 'tr',
      conversationId,
      price: fiyatStr,
      paidPrice: fiyatStr,
      currency: 'TRY',
      basketId: `mlab-${plan.kod}-${Date.now()}`,
      paymentGroup: 'SUBSCRIPTION',
      callbackUrl: callbackUrlBase,
      enabledInstallments: [1],
      buyer: {
        id: yetki.user.id,
        name: adSoyad.name,
        surname: adSoyad.surname,
        email: profil?.email || yetki.user.email || 'noreply@muhasebelab.com',
        identityNumber: '11111111111', // sandbox için sabit
        registrationAddress: 'Bilinmiyor',
        city: 'Istanbul',
        country: 'Turkey',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '85.34.78.112',
      },
      shippingAddress: {
        contactName: `${adSoyad.name} ${adSoyad.surname}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Dijital ürün — fiziksel teslimat yoktur.',
      },
      billingAddress: {
        contactName: `${adSoyad.name} ${adSoyad.surname}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Dijital ürün — fatura e-posta ile iletilir.',
      },
      basketItems: [
        {
          id: `plan-${plan.kod}`,
          name:
            adet > 1
              ? `MuhasebeLab Premium — ${plan.ad} (${adet} kullanıcı)`
              : `MuhasebeLab Premium — ${plan.ad}`,
          category1: 'Eğitim',
          itemType: 'VIRTUAL',
          price: fiyatStr,
        },
      ],
    };

    const cf = await cfInit(istek);

    return new Response(
      JSON.stringify({
        token: cf.token,
        paymentPageUrl: cf.paymentPageUrl,
        conversationId,
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
