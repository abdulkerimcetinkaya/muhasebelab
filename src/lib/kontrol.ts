import type { CozumSatir, UserRow } from '../types';
import { HESAP_PLANI } from '../data/hesap-plani';

export interface KontrolSonuc {
  satirSonuclari: boolean[];
  hepsiDogru: boolean;
}

export const satirlariKontrolEt = (
  userRows: UserRow[],
  cozumRows: CozumSatir[],
): KontrolSonuc => {
  const sonuclar = userRows.map(() => false);
  const kullanilan = new Set<number>();
  userRows.forEach((u, i) => {
    const idx = cozumRows.findIndex((c, ci) => {
      if (kullanilan.has(ci)) return false;
      const userBorc = typeof u.borc === 'number' ? u.borc : Number(u.borc) || 0;
      const userAlacak = typeof u.alacak === 'number' ? u.alacak : Number(u.alacak) || 0;
      return (
        c.kod === u.kod &&
        Math.abs(userBorc - (c.borc || 0)) < 0.01 &&
        Math.abs(userAlacak - (c.alacak || 0)) < 0.01
      );
    });
    if (idx !== -1) {
      sonuclar[i] = true;
      kullanilan.add(idx);
    }
  });
  const hepsiDogru = sonuclar.every((s) => s) && userRows.length === cozumRows.length;
  return { satirSonuclari: sonuclar, hepsiDogru };
};

// =====================================================================
// Deterministik yanlış geri bildirimi — Free özellik (AI değil)
// =====================================================================

export type SatirHataTipi =
  | 'dogru'
  | 'taraf_ters' // hesap doğru, borç/alacak ters
  | 'tutar_yanlis' // hesap doğru, taraf doğru ama tutar yanlış
  | 'fazla' // bu hesap cevapta yok
  | 'kod_gecersiz' // hesap planında yok
  | 'kod_bos'
  | 'tutar_bos';

export interface SatirAnaliz {
  satirIdx: number;
  tip: SatirHataTipi;
  mesaj: string;
  beklenenKod?: string;
  beklenenBorc?: number;
  beklenenAlacak?: number;
}

export interface EksikHesap {
  kod: string;
  ad: string;
  borc: number;
  alacak: number;
}

export interface YanlisAnaliz {
  satirAnalizleri: SatirAnaliz[];
  eksikHesaplar: EksikHesap[];
  toplamBorc: number;
  toplamAlacak: number;
  dengeFarki: number; // pozitif = borç fazla, negatif = alacak fazla
  ozet: string[]; // üst kutuda gösterilecek genel maddeler
}

const sayi = (v: string | number): number =>
  typeof v === 'number' ? v : Number(v) || 0;

const para = (n: number): string =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const yanlisAnaliziYap = (
  userRows: UserRow[],
  cozumRows: CozumSatir[],
): YanlisAnaliz => {
  const tumKodlar = new Set(HESAP_PLANI.map((h) => h.kod));
  const hesapAd = (kod: string): string =>
    HESAP_PLANI.find((h) => h.kod === kod)?.ad || kod;

  const satirAnalizleri: SatirAnaliz[] = [];
  const eslesilen = new Set<number>(); // çözüm satır indeksleri

  userRows.forEach((u, i) => {
    const userBorc = sayi(u.borc);
    const userAlacak = sayi(u.alacak);
    const kod = (u.kod || '').trim();

    if (!kod && userBorc === 0 && userAlacak === 0) {
      // Tamamen boş — analiz dışı
      return;
    }
    if (!kod) {
      satirAnalizleri.push({
        satirIdx: i,
        tip: 'kod_bos',
        mesaj: 'Hesap kodu girilmemiş.',
      });
      return;
    }
    if (userBorc === 0 && userAlacak === 0) {
      satirAnalizleri.push({
        satirIdx: i,
        tip: 'tutar_bos',
        mesaj: 'Bu satıra borç veya alacak tutarı girilmemiş.',
      });
      return;
    }
    if (!tumKodlar.has(kod)) {
      satirAnalizleri.push({
        satirIdx: i,
        tip: 'kod_gecersiz',
        mesaj: `"${kod}" Tek Düzen Hesap Planı'nda yok.`,
      });
      return;
    }

    // 1) Tam eşleşme ara (kod + tutar + taraf)
    const tamIdx = cozumRows.findIndex(
      (c, ci) =>
        !eslesilen.has(ci) &&
        c.kod === kod &&
        Math.abs(userBorc - (c.borc || 0)) < 0.01 &&
        Math.abs(userAlacak - (c.alacak || 0)) < 0.01,
    );
    if (tamIdx !== -1) {
      eslesilen.add(tamIdx);
      satirAnalizleri.push({ satirIdx: i, tip: 'dogru', mesaj: 'Doğru.' });
      return;
    }

    // 2) Kod aynı ama taraf ters? (örn cevapta borç, kullanıcıda alacak)
    const tersIdx = cozumRows.findIndex(
      (c, ci) =>
        !eslesilen.has(ci) &&
        c.kod === kod &&
        Math.abs(userBorc - (c.alacak || 0)) < 0.01 &&
        Math.abs(userAlacak - (c.borc || 0)) < 0.01 &&
        userBorc + userAlacak > 0,
    );
    if (tersIdx !== -1) {
      const c = cozumRows[tersIdx];
      eslesilen.add(tersIdx);
      satirAnalizleri.push({
        satirIdx: i,
        tip: 'taraf_ters',
        mesaj: `${hesapAd(kod)} hesabı ${c.borc > 0 ? 'BORÇ' : 'ALACAK'} tarafına yazılmalı, sen ${userBorc > 0 ? 'BORÇ' : 'ALACAK'} yazmışsın.`,
        beklenenKod: c.kod,
        beklenenBorc: c.borc,
        beklenenAlacak: c.alacak,
      });
      return;
    }

    // 3) Kod aynı, taraf aynı, tutar yanlış
    const tutarIdx = cozumRows.findIndex((c, ci) => {
      if (eslesilen.has(ci) || c.kod !== kod) return false;
      const ayniTaraf =
        (userBorc > 0 && (c.borc || 0) > 0) || (userAlacak > 0 && (c.alacak || 0) > 0);
      return ayniTaraf;
    });
    if (tutarIdx !== -1) {
      const c = cozumRows[tutarIdx];
      eslesilen.add(tutarIdx);
      const beklenen = c.borc || c.alacak;
      const verilen = userBorc || userAlacak;
      const fark = beklenen - verilen;
      satirAnalizleri.push({
        satirIdx: i,
        tip: 'tutar_yanlis',
        mesaj: `${hesapAd(kod)} hesabının tutarı yanlış. Beklenen ${para(beklenen)} TL, ${fark > 0 ? `${para(fark)} TL eksik` : `${para(-fark)} TL fazla`}.`,
        beklenenKod: c.kod,
        beklenenBorc: c.borc,
        beklenenAlacak: c.alacak,
      });
      return;
    }

    // 4) Bu hesap cevapta hiç yok
    satirAnalizleri.push({
      satirIdx: i,
      tip: 'fazla',
      mesaj: `${hesapAd(kod)} (${kod}) bu kayıtta yer almamalı — yanlış hesap kullanılmış.`,
    });
  });

  // Eksik hesaplar (cevapta var ama eşleşmemiş)
  const eksikHesaplar: EksikHesap[] = cozumRows
    .map((c, ci) => ({ c, ci }))
    .filter(({ ci }) => !eslesilen.has(ci))
    .map(({ c }) => ({
      kod: c.kod,
      ad: hesapAd(c.kod),
      borc: c.borc || 0,
      alacak: c.alacak || 0,
    }));

  const toplamBorc = userRows.reduce((a, k) => a + sayi(k.borc), 0);
  const toplamAlacak = userRows.reduce((a, k) => a + sayi(k.alacak), 0);
  const dengeFarki = toplamBorc - toplamAlacak;

  // Üst kutu özet maddeleri (öncelik sırasına göre)
  const ozet: string[] = [];

  if (Math.abs(dengeFarki) >= 0.01) {
    if (dengeFarki > 0) {
      ozet.push(
        `Borç toplamı, alacak toplamından ${para(dengeFarki)} TL fazla — yevmiye dengelemiyor.`,
      );
    } else {
      ozet.push(
        `Alacak toplamı, borç toplamından ${para(-dengeFarki)} TL fazla — yevmiye dengelemiyor.`,
      );
    }
  }

  const tarafTers = satirAnalizleri.filter((s) => s.tip === 'taraf_ters').length;
  const tutarYanlis = satirAnalizleri.filter((s) => s.tip === 'tutar_yanlis').length;
  const fazla = satirAnalizleri.filter((s) => s.tip === 'fazla').length;
  const gecersiz = satirAnalizleri.filter((s) => s.tip === 'kod_gecersiz').length;

  if (gecersiz > 0)
    ozet.push(`${gecersiz} satırda hesap planında olmayan kod var.`);
  if (tarafTers > 0)
    ozet.push(`${tarafTers} satır doğru hesapta ama yanlış tarafta (borç/alacak ters).`);
  if (tutarYanlis > 0) ozet.push(`${tutarYanlis} satırda tutar hatalı.`);
  if (fazla > 0)
    ozet.push(`${fazla} satırda bu kayda ait olmayan hesap kullanılmış.`);
  if (eksikHesaplar.length > 0)
    ozet.push(
      `${eksikHesaplar.length} hesap eksik: ${eksikHesaplar.map((e) => e.ad).join(', ')}.`,
    );

  return {
    satirAnalizleri,
    eksikHesaplar,
    toplamBorc,
    toplamAlacak,
    dengeFarki,
    ozet,
  };
};
