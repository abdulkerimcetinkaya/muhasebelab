/**
 * Adım 3 — Metni 200-800 token aralığında chunk'lara böl.
 *
 * Strateji:
 *   - Madde sınırlarında bölmeyi tercih et (örn. "Madde 274 — ...")
 *   - Hiç madde yoksa paragraf sınırlarında böl
 *   - Hedef chunk boyutu: ~500 token (1250 karakter)
 *   - Min: 200 token (çok kısa = anlamsız)
 *   - Max: 800 token (çok uzun = embedding kalitesi düşer)
 *
 * Her chunk için:
 *   - baslik: en yakın üst başlık (Madde X, Bölüm Y, ...)
 *   - madde_no: filtre + atıf için ayrıştırılmış madde numarası
 */

import type { CikartilmisKaynak, Chunk } from './lib/types.js';
import { tokenSay, tokenToKarakter } from './lib/tokenize.js';
import { sha256 } from './lib/hash.js';

const MIN_TOKEN = 200;
const HEDEF_TOKEN = 500;
const MAX_TOKEN = 800;
const HEDEF_KARAKTER = tokenToKarakter(HEDEF_TOKEN);
const MAX_KARAKTER = tokenToKarakter(MAX_TOKEN);
const MIN_KARAKTER = tokenToKarakter(MIN_TOKEN);

// "Madde 274" veya "Madde 274 —" veya "MADDE 274 - Emtia" gibi
const MADDE_REGEX = /(?:^|\n)\s*(MADDE|Madde)\s+(\d+[A-Za-z]?)\s*[—\-–:.]?\s*(.*?)(?=\n|$)/g;

// Bölüm/Kısım başlıkları (TMS standartları için)
const BASLIK_REGEX = /(?:^|\n)\s*(BÖLÜM|Bölüm|KISIM|Kısım|§)\s+(\d+)/g;

interface BaslikIsareti {
  index: number;          // metin içindeki konum
  baslik: string;         // örn. "Madde 274 — Emtia"
  madde_no: string | null;
}

const baslikAyrist = (metin: string): BaslikIsareti[] => {
  const isaretler: BaslikIsareti[] = [];

  MADDE_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MADDE_REGEX.exec(metin)) !== null) {
    const madde_no = m[2];
    const altBaslik = (m[3] || '').trim().slice(0, 80);
    isaretler.push({
      index: m.index,
      baslik: altBaslik ? `Madde ${madde_no} — ${altBaslik}` : `Madde ${madde_no}`,
      madde_no,
    });
  }

  BASLIK_REGEX.lastIndex = 0;
  while ((m = BASLIK_REGEX.exec(metin)) !== null) {
    isaretler.push({
      index: m.index,
      baslik: `${m[1]} ${m[2]}`,
      madde_no: null,
    });
  }

  return isaretler.sort((a, b) => a.index - b.index);
};

/**
 * Madde sınırlarına göre böl. Madde yoksa paragraf+boyut bazlı böl.
 */
const segmentle = (metin: string): { baslik: string | null; madde_no: string | null; metin: string }[] => {
  const isaretler = baslikAyrist(metin);

  if (isaretler.length > 0) {
    // Madde sınırlarına göre kes
    const segmentler: { baslik: string | null; madde_no: string | null; metin: string }[] = [];

    // İlk işaretten önceki "başlangıç" bölümü (varsa)
    if (isaretler[0].index > 100) {
      segmentler.push({
        baslik: 'Başlangıç',
        madde_no: null,
        metin: metin.slice(0, isaretler[0].index).trim(),
      });
    }

    for (let i = 0; i < isaretler.length; i++) {
      const sonraki = isaretler[i + 1];
      const bas = isaretler[i].index;
      const son = sonraki ? sonraki.index : metin.length;
      const parca = metin.slice(bas, son).trim();
      if (parca.length >= 80) {
        segmentler.push({
          baslik: isaretler[i].baslik,
          madde_no: isaretler[i].madde_no,
          metin: parca,
        });
      }
    }

    return segmentler;
  }

  // Madde yok — paragraf bazlı böl
  return [{ baslik: null, madde_no: null, metin }];
};

/**
 * Tek bir segmenti gerekirse alt-chunk'lara ayır (boyut için).
 * Madde tek başına 800 token aşıyorsa paragraf sınırlarında böl.
 */
const segmentiBol = (
  segment: { baslik: string | null; madde_no: string | null; metin: string },
): { baslik: string | null; madde_no: string | null; metin: string }[] => {
  if (segment.metin.length <= MAX_KARAKTER) {
    return [segment];
  }

  const paragraflar = segment.metin.split(/\n{2,}/);
  const sonuc: { baslik: string | null; madde_no: string | null; metin: string }[] = [];
  let buffer = '';
  let parcaSayisi = 1;

  const flush = () => {
    if (buffer.length < MIN_KARAKTER && sonuc.length > 0) {
      // Çok kısa kalan son parçayı bir öncekiyle birleştir
      sonuc[sonuc.length - 1].metin += '\n\n' + buffer;
    } else if (buffer.length > 0) {
      sonuc.push({
        baslik: segment.baslik ? `${segment.baslik} (${parcaSayisi})` : null,
        madde_no: segment.madde_no,
        metin: buffer.trim(),
      });
      parcaSayisi++;
    }
    buffer = '';
  };

  for (const p of paragraflar) {
    if ((buffer + '\n\n' + p).length > HEDEF_KARAKTER && buffer.length >= MIN_KARAKTER) {
      flush();
    }
    buffer = buffer ? `${buffer}\n\n${p}` : p;

    // Tek paragraf bile çok uzunsa zorla cümle bazında böl
    while (buffer.length > MAX_KARAKTER) {
      const kesYer = buffer.lastIndexOf('. ', HEDEF_KARAKTER);
      const i = kesYer > MIN_KARAKTER ? kesYer + 1 : HEDEF_KARAKTER;
      sonuc.push({
        baslik: segment.baslik ? `${segment.baslik} (${parcaSayisi})` : null,
        madde_no: segment.madde_no,
        metin: buffer.slice(0, i).trim(),
      });
      parcaSayisi++;
      buffer = buffer.slice(i).trim();
    }
  }
  flush();
  return sonuc;
};

export const chunkla = (cikartilmis: CikartilmisKaynak): Chunk[] => {
  const { kaynak, metin } = cikartilmis;
  const segmentler = segmentle(metin);
  const chunks: Chunk[] = [];
  let sira = 0;

  for (const seg of segmentler) {
    const altlar = segmentiBol(seg);
    for (const alt of altlar) {
      sira++;
      const trimli = alt.metin.trim();
      if (trimli.length < MIN_KARAKTER) continue;
      chunks.push({
        kaynak_id: kaynak.id,
        sira,
        baslik: alt.baslik,
        madde_no: alt.madde_no,
        metin: trimli,
        token_sayisi: tokenSay(trimli),
        metin_hash: sha256(trimli),
      });
    }
  }

  console.log(`  ✂ ${kaynak.id}: ${chunks.length} chunk üretildi`);
  return chunks;
};
