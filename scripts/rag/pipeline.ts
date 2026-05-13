/**
 * RAG Pipeline orkestratörü.
 *
 * Çağrı sırası:
 *   1. sources.json oku
 *   2. Her kaynak için: indir → çıkar → chunk → embed → yükle
 *   3. Sonunda rapor bas
 *
 * Çalıştırma:
 *   tsx scripts/rag/pipeline.ts [kaynakId1,kaynakId2,...]
 *
 * Argüman verilmezse tüm kaynakları işler. Argüman verilirse sadece
 * o id'leri (incremental update için). GitHub Actions workflow_dispatch
 * ile manuel tetiklenirken kullanılır.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import type { SourcesConfig } from './lib/types.js';
import { kaynakIndir } from './01-download.js';
import { metinCikar } from './02-extract.js';
import { chunkla } from './03-chunk.js';
import { chunklariGom } from './04-embed.js';
import {
  kaynakKaydet,
  kaynagiTamamla,
  kaynagiHataylaIsaretle,
  chunklariYukle,
} from './05-upload.js';

interface Sayac {
  kaynakSayisi: number;
  indirilen: number;
  chunkSayisi: number;
  eklendi: number;
  guncellendi: number;
  silindi: number;
  atlandı: number;
  hatalar: { kaynakId: string; mesaj: string }[];
}

const main = async () => {
  const buradaki = dirname(fileURLToPath(import.meta.url));
  const sourcesPath = resolve(buradaki, 'sources.json');
  const raw = await readFile(sourcesPath, 'utf-8');
  const config: SourcesConfig = JSON.parse(raw);

  const filtreArg = process.argv[2];
  const filtre = filtreArg ? new Set(filtreArg.split(',').map((s) => s.trim())) : null;
  const islenecekler = filtre
    ? config.kaynaklar.filter((k) => filtre.has(k.id))
    : config.kaynaklar;

  console.log(`\n🚀 RAG Pipeline başlıyor — ${islenecekler.length} kaynak\n`);
  if (filtre) {
    console.log(`   Filtre: ${[...filtre].join(', ')}\n`);
  }

  const sayac: Sayac = {
    kaynakSayisi: islenecekler.length,
    indirilen: 0,
    chunkSayisi: 0,
    eklendi: 0,
    guncellendi: 0,
    silindi: 0,
    atlandı: 0,
    hatalar: [],
  };

  for (const kaynak of islenecekler) {
    console.log(`\n━━━ ${kaynak.id} ━━━`);
    try {
      // İndir (kompozit ise birden fazla parça döner)
      const indirilenler = await kaynakIndir(kaynak);
      sayac.indirilen += indirilenler.length;

      for (const indirilmis of indirilenler) {
        await kaynakKaydet(indirilmis.kaynak, indirilmis.hash);

        const cikartilmis = await metinCikar(indirilmis);
        const chunks = chunkla(cikartilmis);
        if (chunks.length === 0) {
          console.warn(`  ⚠ chunk üretilmedi, atlanıyor`);
          await kaynagiHataylaIsaretle(indirilmis.kaynak.id, 'Boş içerik');
          continue;
        }

        const embeddedler = await chunklariGom(chunks);
        const sonuc = await chunklariYukle(indirilmis.kaynak.id, embeddedler);

        sayac.chunkSayisi += chunks.length;
        sayac.eklendi += sonuc.eklendi;
        sayac.guncellendi += sonuc.guncellendi;
        sayac.silindi += sonuc.silindi;
        sayac.atlandı += sonuc.atlandı;

        await kaynagiTamamla(indirilmis.kaynak.id);
      }
    } catch (e) {
      const mesaj = e instanceof Error ? e.message : String(e);
      console.error(`  ✗ HATA: ${mesaj}`);
      sayac.hatalar.push({ kaynakId: kaynak.id, mesaj });
      await kaynagiHataylaIsaretle(kaynak.id, mesaj).catch(() => {});
    }
  }

  // Final rapor
  console.log(`\n\n═══════════════════════════════════════════════`);
  console.log(`📊 PİPELİNE RAPORU`);
  console.log(`═══════════════════════════════════════════════`);
  console.log(`Kaynak hedefi:      ${sayac.kaynakSayisi}`);
  console.log(`İndirilen dosya:    ${sayac.indirilen}`);
  console.log(`Üretilen chunk:     ${sayac.chunkSayisi}`);
  console.log(`Eklendi:            ${sayac.eklendi}`);
  console.log(`Güncellendi:        ${sayac.guncellendi}`);
  console.log(`Silindi:            ${sayac.silindi}`);
  console.log(`Değişmedi (atlandı): ${sayac.atlandı}`);
  console.log(`Hata sayısı:        ${sayac.hatalar.length}`);

  if (sayac.hatalar.length > 0) {
    console.log(`\nHatalar:`);
    for (const h of sayac.hatalar) {
      console.log(`  - ${h.kaynakId}: ${h.mesaj}`);
    }
    process.exit(1);
  }

  console.log(`\n✓ Tamamlandı.\n`);
};

main().catch((e) => {
  console.error('\n💥 Beklenmedik hata:', e);
  process.exit(1);
});
