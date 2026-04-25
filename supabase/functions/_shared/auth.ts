// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

export interface YetkiSonuc {
  user: any;
  supabase: any;
}

// Edge function çağıranın JWT'sini doğrular + supabase client'ı kullanıcı kimliğiyle döner
export const kullaniciDogrula = async (req: Request): Promise<YetkiSonuc | Response> => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ hata: 'Oturum bulunamadı' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    },
  );

  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) {
    return new Response(JSON.stringify({ hata: 'Geçersiz oturum' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return { user: userData.user, supabase };
};

// Premium üyelik kontrolü — premium_bitis > bugün olmalı
export const premiumKontrol = async (supabase: any, userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('kullanicilar')
    .select('premium_bitis')
    .eq('id', userId)
    .maybeSingle();
  if (!data?.premium_bitis) return false;
  return new Date(data.premium_bitis) > new Date();
};

// Admin kontrolü — src/lib/admin.ts ile aynı listeyi tutar
const ADMIN_EMAILS = ['kerim.cetinkayaa78@gmail.com'];
export const adminKontrol = (user: any): boolean => {
  const email = user?.email;
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};
