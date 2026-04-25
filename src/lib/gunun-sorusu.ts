import { bugununTarihi } from './format';
import type { SoruWithUnite } from '../types';

const tarihHash = (tarih: string): number => {
  let h = 2166136261;
  for (let i = 0; i < tarih.length; i++) {
    h ^= tarih.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const gununSorusu = (tumSorular: SoruWithUnite[]): SoruWithUnite | null => {
  if (tumSorular.length === 0) return null;
  const tarih = bugununTarihi();
  const idx = tarihHash(tarih) % tumSorular.length;
  return tumSorular[idx];
};
