import { createClient } from '@supabase/supabase-js';

/**
 * Test için Supabase client — anon key ile public veri okuma.
 * RLS sayesinde sadece izinli (onayli sorular vb.) erişilir.
 */
const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    'VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY env değişkenleri gerekli (test için)',
  );
}

export const supabase = createClient(url, anon);

export interface CozumSatiri {
  hesap_kodu: string;
  borc: number;
  alacak: number;
  aciklama?: string | null;
}

export interface SoruVeCozum {
  id: string;
  baslik: string;
  zorluk: 'kolay' | 'orta' | 'zor';
  cozumler: CozumSatiri[];
}

/**
 * İlk kolay soruyu çözümleriyle birlikte getir.
 * RLS zaten public erişimi onaylı sorulara kısıtlamış olmalı (anon
 * key kullanıldığı için). Test runtime'da debug log basar.
 */
export async function ilkKolaySoruyuGetir(): Promise<SoruVeCozum | null> {
  const { data: sorular, error: soruErr } = await supabase
    .from('sorular')
    .select('id, baslik, zorluk, durum')
    .eq('zorluk', 'kolay')
    .limit(5);

  console.log('[supabase-fetch] sorular query:', {
    count: sorular?.length,
    error: soruErr?.message,
    durumlar: sorular?.map((s: { durum?: string }) => s.durum),
  });

  if (soruErr || !sorular || sorular.length === 0) return null;
  // Onaylı varsa onu, yoksa ilkini al
  const soru =
    (sorular as Array<{ id: string; baslik: string; zorluk: string; durum: string }>).find(
      (s) => s.durum === 'onayli',
    ) ?? sorular[0];

  const { data: cozumler, error: cozErr } = await supabase
    .from('cozumler')
    .select('hesap_kodu, borc, alacak, aciklama')
    .eq('soru_id', soru.id)
    .order('sira');

  console.log('[supabase-fetch] secilen soru:', {
    id: soru.id,
    baslik: (soru as { baslik: string }).baslik,
    durum: (soru as { durum: string }).durum,
    cozum_sayisi: cozumler?.length,
    cozum_error: cozErr?.message,
  });

  if (cozErr || !cozumler) return null;

  return {
    id: soru.id,
    baslik: (soru as { baslik: string }).baslik,
    zorluk: (soru as { zorluk: 'kolay' | 'orta' | 'zor' }).zorluk,
    cozumler: cozumler as CozumSatiri[],
  };
}
