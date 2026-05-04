import { HESAP_PLANI } from '../data/hesap-plani';
import type { MuavinHesap } from './muavin';

/**
 * Bir kod için hesap adını bulur — hem ana hesap (HESAP_PLANI) hem muavinler
 * (DB'den yüklenen) içinde arar.
 *
 * Davranış:
 *   - Tam eşleşme bulursa adını döner.
 *   - Muavin formatında (ör. "120.999") ama listede yoksa, ana hesabın adını
 *     fallback olarak verir ("120 ALICILAR").
 *   - Hiç bulamazsa boş string.
 */
export const hesapAdiBul = (
  kod: string | null | undefined,
  muavinler?: MuavinHesap[],
): string => {
  if (!kod) return '';
  const k = kod.trim();
  if (!k) return '';

  // 1) Muavin tam eşleşme
  const muavin = muavinler?.find((m) => m.kod === k);
  if (muavin) return muavin.ad;

  // 2) Ana hesap tam eşleşme
  const ana = HESAP_PLANI.find((h) => h.kod === k);
  if (ana) return ana.ad;

  // 3) Muavin formatında ama eşleşme yoksa ana hesap fallback
  if (/^[0-9]{3}\./.test(k)) {
    const anaKod = k.split('.')[0];
    const anaHesap = HESAP_PLANI.find((h) => h.kod === anaKod);
    if (anaHesap) return anaHesap.ad;
  }

  return '';
};
