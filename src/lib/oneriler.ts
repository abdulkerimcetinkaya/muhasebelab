import type { Ilerleme, SoruWithUnite } from '../types';

export const devamEtSorusu = (
  ilerleme: Ilerleme,
  tumSorular: SoruWithUnite[],
): SoruWithUnite | null => {
  return tumSorular.find((s) => !ilerleme.cozulenler[s.id]) ?? null;
};

export const enCokYanlisSoru = (
  ilerleme: Ilerleme,
  tumSorular: SoruWithUnite[],
): SoruWithUnite | null => {
  const siralanmis = Object.entries(ilerleme.yanlislar).sort((a, b) => b[1] - a[1]);
  for (const [id] of siralanmis) {
    const soru = tumSorular.find((s) => s.id === id);
    if (soru) return soru;
  }
  return null;
};
