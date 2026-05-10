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
 * İlk onaylı kolay soruyu çözümleriyle birlikte getir.
 * Tests bu soruyu kullanarak business logic doğrular.
 */
export async function ilkKolaySoruyuGetir(): Promise<SoruVeCozum | null> {
  const { data: sorular, error: soruErr } = await supabase
    .from('sorular')
    .select('id, baslik, zorluk')
    .eq('zorluk', 'kolay')
    .eq('durum', 'onayli')
    .limit(1);

  if (soruErr || !sorular || sorular.length === 0) return null;
  const soru = sorular[0];

  const { data: cozumler, error: cozErr } = await supabase
    .from('cozumler')
    .select('hesap_kodu, borc, alacak, aciklama')
    .eq('soru_id', soru.id)
    .order('sira');

  if (cozErr || !cozumler) return null;

  return {
    id: soru.id,
    baslik: soru.baslik,
    zorluk: soru.zorluk,
    cozumler: cozumler as CozumSatiri[],
  };
}
