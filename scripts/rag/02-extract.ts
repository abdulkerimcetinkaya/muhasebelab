/**
 * Adım 2 — PDF/HTML'i düz metne çevir.
 *
 * PDF için `unpdf` paketi: modern, ESM, GitHub Actions runner'da
 * binary dependency yok (pdfjs-dist wrapper'ı). OCR yapmaz —
 * çoğu Türk mevzuat PDF'i embedded text içeriyor, OCR gereksiz.
 *
 * HTML için: basit tag-strip. Karmaşık DOM kütüphanesi gereksiz —
 * mevzuat siteleri zaten temiz semantic HTML kullanıyor.
 */

import { extractText } from 'unpdf';
import type { IndirilmisKaynak, CikartilmisKaynak } from './lib/types.js';
import { sha256 } from './lib/hash.js';

const pdfMetinCikar = async (buf: Buffer): Promise<string> => {
  // unpdf Uint8Array bekliyor
  const u8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  const { text } = await extractText(u8, { mergePages: true });
  return Array.isArray(text) ? text.join('\n') : text;
};

const htmlMetinCikar = (html: string): string => {
  return html
    // <script>, <style> bloklarını komple at
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    // diğer tag'leri çıkar
    .replace(/<[^>]+>/g, ' ')
    // HTML entity'leri çöz
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // birden fazla boşluğu tek yap
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Metni normalleştir:
 * - Birden fazla boş satırı tek satıra indir
 * - Satır sonu kırılan kelimeleri birleştir ("ver-\ngi" → "vergi")
 * - Sayfa numarası gibi ortak gürültü pattern'larını temizle
 */
const normallestir = (metin: string): string => {
  return metin
    // satır sonu kırılan kelimeler
    .replace(/-\s*\n\s*/g, '')
    // çok fazla boş satırı 2'ye indir
    .replace(/\n{3,}/g, '\n\n')
    // satır başı/sonu trim
    .split('\n')
    .map((s) => s.trim())
    .join('\n')
    // sayfa numarası gibi 1-3 haneli yalnız sayı satırları
    .replace(/\n\s*\d{1,3}\s*\n/g, '\n')
    .trim();
};

export const metinCikar = async (
  indirilmis: IndirilmisKaynak,
): Promise<CikartilmisKaynak> => {
  const { kaynak, icerik } = indirilmis;
  let metin: string;

  if (kaynak.format === 'pdf') {
    if (!Buffer.isBuffer(icerik)) {
      throw new Error(`PDF beklenirdi ama string geldi: ${kaynak.id}`);
    }
    metin = await pdfMetinCikar(icerik);
  } else {
    if (typeof icerik !== 'string') {
      throw new Error(`HTML beklenirdi ama buffer geldi: ${kaynak.id}`);
    }
    metin = htmlMetinCikar(icerik);
  }

  metin = normallestir(metin);

  console.log(`  ✎ ${kaynak.id}: ${metin.length} karakter`);

  return {
    kaynak,
    metin,
    hash: sha256(metin),
  };
};
