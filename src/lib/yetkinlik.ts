// Ünite/zorluk bazlı yetkinlik (mastery) hesaplaması.
//
// Yetkinlik formülü — ağırlıklı puan / mevcut maksimum:
//   her çözülen soru zorluk puanı kadar katkı yapar (kolay 5, orta 10, zor 20)
//   payda: ünitedeki tüm soruların zorluk puanları toplamı
// Sonuç: 0–100 arası tam sayı. Ünitenin "kaç puanı vermeye hazır olduğu" yerine
// "öğrencinin o üniteden kaç puan toplayabildiği" gösterir — yani fairer.
import { ZORLUK_PUAN } from '../data/sabitler';
import type { Ilerleme, Unite, Zorluk } from '../types';

export interface ZorlukDagilim {
  toplam: number;
  cozulen: number;
}

export interface UniteYetkinligi {
  uniteId: string;
  uniteAd: string;
  thiingsIcon: string;
  toplamSoru: number;
  cozulenSoru: number;
  yetkinlik: number; // 0..100
  dagilim: Record<Zorluk, ZorlukDagilim>;
}

export const uniteYetkinlikleri = (
  uniteler: Unite[],
  ilerleme: Ilerleme,
): UniteYetkinligi[] =>
  uniteler.map((u) => {
    const dagilim: Record<Zorluk, ZorlukDagilim> = {
      kolay: { toplam: 0, cozulen: 0 },
      orta: { toplam: 0, cozulen: 0 },
      zor: { toplam: 0, cozulen: 0 },
    };
    let toplamPuan = 0;
    let kazanilanPuan = 0;
    for (const s of u.sorular) {
      dagilim[s.zorluk].toplam++;
      const puan = ZORLUK_PUAN[s.zorluk] ?? 10;
      toplamPuan += puan;
      if (ilerleme.cozulenler[s.id]) {
        dagilim[s.zorluk].cozulen++;
        kazanilanPuan += puan;
      }
    }
    const yetkinlik = toplamPuan > 0 ? Math.round((kazanilanPuan / toplamPuan) * 100) : 0;
    return {
      uniteId: u.id,
      uniteAd: u.ad,
      thiingsIcon: u.thiingsIcon,
      toplamSoru: u.sorular.length,
      cozulenSoru: u.sorular.filter((s) => ilerleme.cozulenler[s.id]).length,
      yetkinlik,
      dagilim,
    };
  });
