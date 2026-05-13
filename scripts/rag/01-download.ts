/**
 * Adım 1 — Kaynak indirme.
 *
 * sources.json'daki her kaynak için:
 *   - PDF ise: arrayBuffer olarak indir
 *   - HTML ise: text olarak indir
 *   - kompozit=true ise: indeks sayfasından alt-linkleri ayıkla
 *
 * Çıktı: bellekteki IndirilmisKaynak[] dizisi (sonraki adıma geçer).
 *
 * mevzuat.gov.tr ve kgk.gov.tr User-Agent kontrolü yapabiliyor,
 * standart bir tarayıcı UA gönderiyoruz.
 */

import type { Kaynak, IndirilmisKaynak } from './lib/types.js';
import { sha256 } from './lib/hash.js';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 MuhasebeLab-RAG/1.0';

const TIMEOUT_MS = 60_000;

const indir = async (url: string, format: 'pdf' | 'html'): Promise<Buffer | string> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const yanit = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: format === 'pdf' ? 'application/pdf' : 'text/html' },
      signal: controller.signal,
    });

    if (!yanit.ok) {
      throw new Error(`HTTP ${yanit.status} ${yanit.statusText}`);
    }

    if (format === 'pdf') {
      const ab = await yanit.arrayBuffer();
      return Buffer.from(ab);
    }
    return await yanit.text();
  } finally {
    clearTimeout(timer);
  }
};

/**
 * VUK Genel Tebliğleri indeks sayfasından yürürlükteki tebliğ
 * URL'lerini ayıkla. GİB sayfası yapısı değişirse buradan kırılır;
 * pipeline raporlamada uyarır.
 *
 * Şu an basit implementasyon: indeks sayfasının HTML'inden href="..."
 * ile başlayan PDF linklerini çek. Yürürlükten kalkmışları "MÜLGA"
 * etiketinden ayıklamak için ileride geliştirilebilir.
 */
const kompoziteAlt = async (indeks: string): Promise<{ url: string; baslik: string }[]> => {
  const linkler: { url: string; baslik: string }[] = [];
  const regex = /<a[^>]+href="([^"]+\.pdf)"[^>]*>([^<]+)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(indeks)) !== null) {
    const url = m[1].startsWith('http') ? m[1] : `https://www.gib.gov.tr${m[1]}`;
    const baslik = m[2].trim();
    if (!/m[üu]lga/i.test(baslik)) {
      linkler.push({ url, baslik });
    }
  }
  return linkler;
};

export const kaynakIndir = async (kaynak: Kaynak): Promise<IndirilmisKaynak[]> => {
  console.log(`  ↓ indiriliyor: ${kaynak.baslik}`);

  if (kaynak.kompozit && kaynak.format === 'html') {
    // İndeks sayfasını al, alt linkleri çek
    const indeks = (await indir(kaynak.url, 'html')) as string;
    const altlar = await kompoziteAlt(indeks);
    console.log(`    → ${altlar.length} alt tebliğ bulundu`);

    const sonuc: IndirilmisKaynak[] = [];
    for (const [i, alt] of altlar.entries()) {
      try {
        const icerik = await indir(alt.url, 'pdf');
        sonuc.push({
          kaynak: {
            ...kaynak,
            id: `${kaynak.id}-${i + 1}`,
            baslik: alt.baslik,
            url: alt.url,
            format: 'pdf',
            kompozit: false,
          },
          icerik,
          hash: sha256(icerik),
        });
      } catch (e) {
        console.warn(`    ⚠ alt-tebliğ indirilemedi: ${alt.baslik} — ${e}`);
      }
    }
    return sonuc;
  }

  const icerik = await indir(kaynak.url, kaynak.format);
  return [
    {
      kaynak,
      icerik,
      hash: sha256(icerik),
    },
  ];
};
