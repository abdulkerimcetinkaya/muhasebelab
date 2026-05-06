import { supabase } from './supabase';

export interface Plan {
  kod: string;
  ad: string;
  aciklama: string | null;
  donem: 'aylik' | 'yillik';
  ay_sayisi: number;
  tutar: number;
  para_birimi: string;
  sira: number;
}

export interface OdemeBaslatYanit {
  token: string;
  paymentPageUrl: string;
  conversationId: string;
}

export const planlariYukle = async (): Promise<Plan[]> => {
  const { data, error } = await supabase
    .from('planlar')
    .select('kod, ad, aciklama, donem, ay_sayisi, tutar, para_birimi, sira')
    .eq('aktif', true)
    .order('sira');
  if (error) throw new Error(error.message);
  return (data ?? []) as Plan[];
};

// Edge Function -> iyzico CF init -> paymentPageUrl
//
// adet: bireysel ödeme için 1 (default), kurum/sınıf bulk için >1.
// adet > 1 olduğunda Edge Function plan tutarını adet ile çarpar ve
// odemeler.adet kolonuna yazar. Öğrenci dağıtımı şu an manuel
// (admin panel üzerinden admin_premium_ayarla RPC ile).
export const odemeBaslat = async (
  planKodu: string,
  adet: number = 1,
): Promise<OdemeBaslatYanit> => {
  const { data, error } = await supabase.functions.invoke<OdemeBaslatYanit & { hata?: string }>(
    'iyzico-baslat',
    { body: { plan_kodu: planKodu, adet } },
  );
  if (error) {
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === 'function') {
      try {
        const body = await ctx.json();
        if (body?.hata) throw new Error(body.hata);
      } catch (e) {
        if (e instanceof Error && e.message) throw e;
      }
    }
    throw new Error(error.message);
  }
  if (!data || data.hata) throw new Error(data?.hata ?? 'Beklenmeyen yanıt');
  return data;
};
