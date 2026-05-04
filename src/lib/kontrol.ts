import type { CozumSatir, UserRow } from '../types';
import { HESAP_PLANI } from '../data/hesap-plani';

export interface KontrolSonuc {
  satirSonuclari: boolean[];
  hepsiDogru: boolean;
}

/**
 * Kod eşleşme kuralı:
 *   - Tam eşleşme  →  doğru
 *   - Beklenen ana hesap (örn 120), kullanıcı bu ana hesabın altındaki muavin
 *     (örn 120.001)  →  doğru (daha detaylı, kabul)
 *   - Diğer durumlar  →  yanlış
 */
const kodEsler = (beklenen: string, verilen: string): boolean => {
  if (beklenen === verilen) return true;
  if (/^[0-9]{3}$/.test(beklenen) && verilen.startsWith(beklenen + '.')) {
    return true;
  }
  return false;
};

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
        kodEsler(c.kod, u.kod) &&
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
  | 'muavin_gerekli' // beklenen muavin, kullanıcı ana hesap yazmış
  | 'kod_gecersiz' // hesap planında ve muavinlerde yok
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

/** Bir muavin kodunun ait olduğu ana hesap kodunu döner ('120.001' → '120'). */
const anaKodCikar = (kod: string): string => kod.split('.')[0];

export const yanlisAnaliziYap = (
  userRows: UserRow[],
  cozumRows: CozumSatir[],
  /**
   * Aktif muavinler — opsiyonel. Muavin desteği için geçilirse:
   *   - Muavin kodları "geçersiz" sayılmaz
   *   - Beklenen muavinken kullanıcı ana hesap yazarsa "muavin_gerekli" uyarısı
   */
  muavinler?: { kod: string; ad: string; ana_kod: string }[],
): YanlisAnaliz => {
  const muavinKodMap = new Map<string, { ad: string; ana_kod: string }>();
  (muavinler ?? []).forEach((m) =>
    muavinKodMap.set(m.kod, { ad: m.ad, ana_kod: m.ana_kod }),
  );
  // Hangi ana hesapların muavini var? (uyarı için)
  const muaviniOlanAnaKodlar = new Set(
    (muavinler ?? []).map((m) => m.ana_kod),
  );

  const tumKodlar = new Set(HESAP_PLANI.map((h) => h.kod));
  const hesapAd = (kod: string): string => {
    if (muavinKodMap.has(kod)) return muavinKodMap.get(kod)!.ad;
    return HESAP_PLANI.find((h) => h.kod === kod)?.ad || kod;
  };
  const kodGecerli = (kod: string): boolean =>
    tumKodlar.has(kod) || muavinKodMap.has(kod);

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
    if (!kodGecerli(kod)) {
      satirAnalizleri.push({
        satirIdx: i,
        tip: 'kod_gecersiz',
        mesaj: `"${kod}" Tek Düzen Hesap Planı'nda yok.`,
      });
      return;
    }

    // 1) Tam eşleşme veya muavin → ana hesap eşleşmesi (kod + tutar + taraf)
    const tamIdx = cozumRows.findIndex(
      (c, ci) =>
        !eslesilen.has(ci) &&
        kodEsler(c.kod, kod) &&
        Math.abs(userBorc - (c.borc || 0)) < 0.01 &&
        Math.abs(userAlacak - (c.alacak || 0)) < 0.01,
    );
    if (tamIdx !== -1) {
      eslesilen.add(tamIdx);
      satirAnalizleri.push({ satirIdx: i, tip: 'dogru', mesaj: 'Doğru.' });
      return;
    }

    // 2) Beklenen muavin, kullanıcı ana hesap yazmış (örn beklenen 120.001, verilen 120)
    const muavinGerekliIdx = cozumRows.findIndex(
      (c, ci) =>
        !eslesilen.has(ci) &&
        c.kod.startsWith(kod + '.') &&
        muavinKodMap.has(c.kod),
    );
    if (muavinGerekliIdx !== -1) {
      const c = cozumRows[muavinGerekliIdx];
      eslesilen.add(muavinGerekliIdx);
      const beklenenAd = hesapAd(c.kod);
      satirAnalizleri.push({
        satirIdx: i,
        tip: 'muavin_gerekli',
        mesaj: `Ana hesaba kayıt yapılamaz — alt muaviniyle (${c.kod} ${beklenenAd}) yazmalıydın.`,
        beklenenKod: c.kod,
        beklenenBorc: c.borc,
        beklenenAlacak: c.alacak,
      });
      return;
    }

    // 3) Kod aynı ama taraf ters
    const tersIdx = cozumRows.findIndex(
      (c, ci) =>
        !eslesilen.has(ci) &&
        kodEsler(c.kod, kod) &&
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
        mesaj: `${hesapAd(c.kod)} hesabı ${c.borc > 0 ? 'BORÇ' : 'ALACAK'} tarafına yazılmalı, sen ${userBorc > 0 ? 'BORÇ' : 'ALACAK'} yazmışsın.`,
        beklenenKod: c.kod,
        beklenenBorc: c.borc,
        beklenenAlacak: c.alacak,
      });
      return;
    }

    // 4) Kod aynı, taraf aynı, tutar yanlış
    const tutarIdx = cozumRows.findIndex((c, ci) => {
      if (eslesilen.has(ci) || !kodEsler(c.kod, kod)) return false;
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
        mesaj: `${hesapAd(c.kod)} hesabının tutarı yanlış. Beklenen ${para(beklenen)} TL, ${fark > 0 ? `${para(fark)} TL eksik` : `${para(-fark)} TL fazla`}.`,
        beklenenKod: c.kod,
        beklenenBorc: c.borc,
        beklenenAlacak: c.alacak,
      });
      return;
    }

    // 5) Kullanıcı yanlış muavin yazmış (aynı ana hesap, farklı muavin)
    if (muavinKodMap.has(kod)) {
      const userAnaKod = anaKodCikar(kod);
      const yanlisMuavinIdx = cozumRows.findIndex(
        (c, ci) =>
          !eslesilen.has(ci) &&
          (c.kod === userAnaKod || c.kod.startsWith(userAnaKod + '.')),
      );
      if (yanlisMuavinIdx !== -1) {
        const c = cozumRows[yanlisMuavinIdx];
        eslesilen.add(yanlisMuavinIdx);
        const beklenenAd = hesapAd(c.kod);
        const verilenAd = hesapAd(kod);
        satirAnalizleri.push({
          satirIdx: i,
          tip: 'fazla',
          mesaj: `Yanlış cari: ${verilenAd} (${kod}) yazmışsın, beklenen ${beklenenAd} (${c.kod}).`,
          beklenenKod: c.kod,
          beklenenBorc: c.borc,
          beklenenAlacak: c.alacak,
        });
        return;
      }
    }

    // 6) Bu hesap cevapta hiç yok
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
  const muavinGerekli = satirAnalizleri.filter((s) => s.tip === 'muavin_gerekli').length;

  if (gecersiz > 0)
    ozet.push(`${gecersiz} satırda hesap planında olmayan kod var.`);
  if (muavinGerekli > 0)
    ozet.push(
      `${muavinGerekli} satırda ana hesap kullanılmış — muavin (alt cari) gerekli.`,
    );
  if (tarafTers > 0)
    ozet.push(`${tarafTers} satır doğru hesapta ama yanlış tarafta (borç/alacak ters).`);
  if (tutarYanlis > 0) ozet.push(`${tutarYanlis} satırda tutar hatalı.`);
  if (fazla > 0)
    ozet.push(`${fazla} satırda bu kayda ait olmayan hesap kullanılmış.`);
  if (eksikHesaplar.length > 0)
    ozet.push(
      `${eksikHesaplar.length} hesap eksik: ${eksikHesaplar.map((e) => e.ad).join(', ')}.`,
    );

  // muaviniOlanAnaKodlar şu an analiz mantığında kullanılmıyor, ama gelecekte
  // proaktif uyarı için (ör. "bu ana hesabın muavinleri var") kullanılabilir.
  void muaviniOlanAnaKodlar;

  return {
    satirAnalizleri,
    eksikHesaplar,
    toplamBorc,
    toplamAlacak,
    dengeFarki,
    ozet,
  };
};
