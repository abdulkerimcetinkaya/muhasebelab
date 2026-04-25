// Mevcut sorular için AI ile belge üretir ve Supabase'e yazar.
//
// Kullanım:
//   # .env dosyasına ADMIN_EMAIL ve ADMIN_PASSWORD ekle, sonra:
//   npx tsx --env-file=.env scripts/belgeleri-ai-ile-uret.ts           # belgesiz soruları
//   npx tsx --env-file=.env scripts/belgeleri-ai-ile-uret.ts --all     # hepsini yeniden üret
//   npx tsx --env-file=.env scripts/belgeleri-ai-ile-uret.ts --limit 5 # ilk 5 soruyu dene
//   npx tsx --env-file=.env scripts/belgeleri-ai-ile-uret.ts --dry     # yazmadan dene
//
// Not: Edge function'ı çağırır, prompt oradaki tek kopya ile senkron kalır.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('HATA: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY tanımlı değil');
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('HATA: ADMIN_EMAIL ve ADMIN_PASSWORD env değişkenleri gerekli');
  process.exit(1);
}

const argv = process.argv.slice(2);
const HEPSI = argv.includes('--all');
const DRY = argv.includes('--dry');
const LIMIT = (() => {
  const i = argv.indexOf('--limit');
  if (i === -1) return null;
  const n = parseInt(argv[i + 1], 10);
  return Number.isFinite(n) && n > 0 ? n : null;
})();

interface CozumSatir {
  kod: string;
  borc: number;
  alacak: number;
}

interface SoruRow {
  id: string;
  baslik: string;
  senaryo: string;
  aciklama: string | null;
  belgeler: unknown;
}

interface CozumRow {
  soru_id: string;
  kod: string;
  borc: number;
  alacak: number;
  sira: number;
}

const sb = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });

const uyku = (ms: number) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  console.log('> Admin ile giriş yapılıyor…');
  const { error: girisErr } = await sb.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (girisErr) {
    console.error('HATA: giriş başarısız —', girisErr.message);
    process.exit(1);
  }

  console.log('> Sorular yükleniyor…');
  const { data: sorular, error: sErr } = await sb
    .from('sorular')
    .select('id, baslik, senaryo, aciklama, belgeler')
    .eq('durum', 'onayli')
    .order('id');
  if (sErr) throw sErr;

  const { data: cozumler, error: cErr } = await sb
    .from('cozumler')
    .select('soru_id, kod, borc, alacak, sira')
    .order('sira');
  if (cErr) throw cErr;

  const cozumMap = new Map<string, CozumSatir[]>();
  for (const c of cozumler as CozumRow[]) {
    const arr = cozumMap.get(c.soru_id) ?? [];
    arr.push({ kod: c.kod, borc: Number(c.borc), alacak: Number(c.alacak) });
    cozumMap.set(c.soru_id, arr);
  }

  let hedef = sorular as SoruRow[];
  if (!HEPSI) {
    hedef = hedef.filter((s) => !Array.isArray(s.belgeler) || (s.belgeler as unknown[]).length === 0);
  }
  if (LIMIT) hedef = hedef.slice(0, LIMIT);

  console.log(`> ${hedef.length} soru işlenecek. ${DRY ? '(DRY-RUN — yazım yok)' : ''}`);
  if (hedef.length === 0) {
    console.log('Yapılacak iş yok, çıkılıyor.');
    return;
  }

  let basari = 0;
  let hata = 0;

  for (let i = 0; i < hedef.length; i++) {
    const s = hedef[i];
    const cozum = cozumMap.get(s.id) ?? [];
    const prefix = `[${i + 1}/${hedef.length}] ${s.id}`;

    if (cozum.length === 0) {
      console.warn(`${prefix}  ⚠ çözüm satırı yok, atlandı`);
      continue;
    }

    try {
      const { data, error } = await sb.functions.invoke<{ belgeler: unknown[]; hata?: string }>(
        'ai-belge-uret',
        {
          body: {
            soruBaslik: s.baslik,
            senaryo: s.senaryo,
            aciklama: s.aciklama ?? undefined,
            cozum,
          },
        },
      );
      if (error) throw new Error(error.message);
      if (data?.hata) throw new Error(data.hata);
      const belgeler = data?.belgeler ?? [];
      if (belgeler.length === 0) {
        console.warn(`${prefix}  ⚠ AI boş belge listesi döndürdü`);
        hata++;
        continue;
      }

      if (DRY) {
        console.log(
          `${prefix}  ✓ ${belgeler.length} belge (DRY) —`,
          belgeler.map((b) => (b as { tur: string }).tur).join(', '),
        );
      } else {
        const { error: upErr } = await sb
          .from('sorular')
          .update({ belgeler })
          .eq('id', s.id);
        if (upErr) throw upErr;
        console.log(
          `${prefix}  ✓ ${belgeler.length} belge yazıldı —`,
          belgeler.map((b) => (b as { tur: string }).tur).join(', '),
        );
      }
      basari++;
    } catch (e) {
      hata++;
      console.error(`${prefix}  ✗`, (e as Error).message);
    }

    // Rate limit nezaketi
    await uyku(400);
  }

  console.log(`\n> Bitti. Başarılı: ${basari}, hatalı: ${hata}`);
};

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
