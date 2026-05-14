// Modül kilit / tamamlanma mantığı (atölye yapısı).
//
// Kural:
//  - Modül 1 her zaman açık.
//  - Modül N açık ⇔ önceki ZORUNLU modülün tüm alt başlıkları tamamlanmış.
//  - Opsiyonel modül (örn. M8) sonraki modülü kilitlemez — Modül 9 için
//    Modül 7 yeterli, Modül 8 zorunlu değildir.
//  - Bir modül içindeki alt başlıklar serbest sırada açıktır (modül kilidi
//    açıldıysa). Alt başlığa hiç soru bağlanmamışsa kilit akışı bloke
//    edilmez — geçilebilir kabul edilir (konuKilitAciciMi ile aynı patern).
//
// Dinamik: ilerleme sıfırlanırsa kilitler de yeniden devreye girer.
import type { AltBaslik, Ilerleme, Modul } from '../types';

export type ModulKilitDurumu = 'acik' | 'kilitli' | 'tamamlandi';

/**
 * Alt başlık gerçekten tamamlandı mı — tikli rozet için.
 * En az 1 soru olmalı VE tüm soruları çözülmüş olmalı.
 */
export const altBaslikTamamlandiMi = (
  altBaslik: AltBaslik,
  ilerleme: Ilerleme,
): boolean => {
  if (altBaslik.sorular.length === 0) return false;
  return altBaslik.sorular.every((s) => !!ilerleme.cozulenler[s.id]);
};

/**
 * Alt başlık sıradakini açacak durumda mı.
 * 0 soru olan alt başlık kilit akışını bloke etmez (geçilebilir).
 */
const altBaslikKilitAciciMi = (
  altBaslik: AltBaslik,
  ilerleme: Ilerleme,
): boolean => {
  if (altBaslik.sorular.length === 0) return true;
  return altBaslik.sorular.every((s) => !!ilerleme.cozulenler[s.id]);
};

/**
 * Modül tamamen tamamlandı mı — tüm alt başlıkları kilit-açıcı durumda mı.
 * Alt başlığı olmayan modül asla tamamlanmış sayılmaz (içerik hazırlanmamış).
 */
export const modulTamamlandiMi = (modul: Modul, ilerleme: Ilerleme): boolean => {
  if (modul.altBasliklar.length === 0) return false;
  return modul.altBasliklar.every((a) => altBaslikTamamlandiMi(a, ilerleme));
};

/**
 * Modül kilidi açıcı mı — sıradaki modülün açılması için yeterli durum mu.
 * Alt başlığı olmayan modül "geçilebilir" sayılır (içerik henüz yoksa
 * öğrenciyi tıkamayalım — konuKilitAciciMi paterni).
 */
const modulKilitAciciMi = (modul: Modul, ilerleme: Ilerleme): boolean => {
  if (modul.altBasliklar.length === 0) return true;
  return modul.altBasliklar.every((a) => altBaslikKilitAciciMi(a, ilerleme));
};

/**
 * Sıraya göre dizilmiş modül listesinde verilen modülün durumu.
 * Modül 1 her zaman açık; sonraki modüller bir önceki ZORUNLU modüle bakar.
 */
export const modulKilitDurumu = (
  moduller: Modul[],
  modul: Modul,
  ilerleme: Ilerleme,
): ModulKilitDurumu => {
  const idx = moduller.findIndex((m) => m.id === modul.id);
  if (idx <= 0) {
    // İlk modül — sadece tamamlandı/açık ayrımı
    return modulTamamlandiMi(modul, ilerleme) ? 'tamamlandi' : 'acik';
  }

  // En yakın ZORUNLU önceki modüle bak (opsiyonelleri atla)
  let onceki: Modul | null = null;
  for (let i = idx - 1; i >= 0; i--) {
    if (!moduller[i].opsiyonel) {
      onceki = moduller[i];
      break;
    }
  }
  // Hiç zorunlu önceki yoksa (kuramsal — pratikte hep var) açık say
  if (!onceki) {
    return modulTamamlandiMi(modul, ilerleme) ? 'tamamlandi' : 'acik';
  }

  if (!modulKilitAciciMi(onceki, ilerleme)) return 'kilitli';
  return modulTamamlandiMi(modul, ilerleme) ? 'tamamlandi' : 'acik';
};

/**
 * Kilidi açmak için bitirilmesi gereken modülü döndürür (banner için).
 * Kilitli değilse null.
 */
export const kilidiAcanModul = (
  moduller: Modul[],
  modul: Modul,
  ilerleme: Ilerleme,
): Modul | null => {
  if (modulKilitDurumu(moduller, modul, ilerleme) !== 'kilitli') return null;
  const idx = moduller.findIndex((m) => m.id === modul.id);
  for (let i = idx - 1; i >= 0; i--) {
    if (!moduller[i].opsiyonel) return moduller[i];
  }
  return null;
};

/**
 * Modül ilerleme yüzdesi (0-100). Tamamlanmış alt başlık sayısı / toplam.
 * 0 alt başlık → 0.
 */
export const modulIlerlemeYuzde = (modul: Modul, ilerleme: Ilerleme): number => {
  if (modul.altBasliklar.length === 0) return 0;
  const tamam = modul.altBasliklar.filter((a) =>
    altBaslikTamamlandiMi(a, ilerleme),
  ).length;
  return Math.round((tamam / modul.altBasliklar.length) * 100);
};

/**
 * Ünitedeki tüm modüller arası ilerleme:
 * { tamamAltBaslik, toplamAltBaslik, yuzde }
 */
export const uniteModulIlerleme = (
  moduller: Modul[],
  ilerleme: Ilerleme,
): { tamamAltBaslik: number; toplamAltBaslik: number; yuzde: number } => {
  const toplam = moduller.reduce((acc, m) => acc + m.altBasliklar.length, 0);
  const tamam = moduller.reduce(
    (acc, m) =>
      acc + m.altBasliklar.filter((a) => altBaslikTamamlandiMi(a, ilerleme)).length,
    0,
  );
  const yuzde = toplam > 0 ? Math.round((tamam / toplam) * 100) : 0;
  return { tamamAltBaslik: tamam, toplamAltBaslik: toplam, yuzde };
};
