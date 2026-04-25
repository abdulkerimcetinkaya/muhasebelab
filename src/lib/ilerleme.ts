import { STORAGE_KEY } from '../data/sabitler';
import type { Ilerleme, Istatistik, SoruWithUnite, Unite } from '../types';

export const varsayilanIlerleme = (): Ilerleme => ({
  kullaniciAdi: 'Öğrenci',
  cozulenler: {},
  yanlislar: {},
  puan: 0,
  streak: 0,
  sonCozumTarihi: null,
  aktiviteTarihleri: {},
  kazanilanRozetler: {},
  tema: 'light',
  onboardingTamam: false,
});

// Mevcut kullanıcılarda onboarding'i sessizce tamam say:
// çözülmüş sorusu varsa veya özelleştirilmiş adı varsa
const turetilmisOnboardingTamam = (i: Ilerleme): boolean =>
  Object.keys(i.cozulenler).length > 0 || (!!i.kullaniciAdi && i.kullaniciAdi !== 'Öğrenci');

export const ilerlemeYukle = (): Ilerleme => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const birlesik: Ilerleme = { ...varsayilanIlerleme(), ...JSON.parse(raw) };
      if (!birlesik.onboardingTamam && turetilmisOnboardingTamam(birlesik)) {
        birlesik.onboardingTamam = true;
      }
      return birlesik;
    }
  } catch {
    // ignore corrupt storage
  }
  return varsayilanIlerleme();
};

export const ilerlemeKaydet = (data: Ilerleme): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors (quota, private mode)
  }
};

export const istatistikHesapla = (
  ilerleme: Ilerleme,
  uniteler: Unite[],
  tumSorular: SoruWithUnite[],
): Istatistik => {
  const cozulenSayi = Object.keys(ilerleme.cozulenler).length;
  const toplamSoru = tumSorular.length;
  const zorCozum = Object.values(ilerleme.cozulenler).filter((c) => c.zorluk === 'zor').length;
  const ortaCozum = Object.values(ilerleme.cozulenler).filter((c) => c.zorluk === 'orta').length;
  const kolayCozum = Object.values(ilerleme.cozulenler).filter((c) => c.zorluk === 'kolay').length;
  const uniteTamamlanmis: Record<string, boolean> = {};
  uniteler.forEach((u) => {
    uniteTamamlanmis[u.id] =
      u.sorular.length > 0 && u.sorular.every((s) => !!ilerleme.cozulenler[s.id]);
  });
  return {
    cozulenSayi,
    toplamSoru,
    zorCozum,
    ortaCozum,
    kolayCozum,
    uniteTamamlanmis,
    puan: ilerleme.puan,
    streak: ilerleme.streak,
  };
};
