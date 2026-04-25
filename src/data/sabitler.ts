import type { Zorluk } from '../types';

export const SINIF_ISIMLERI: Record<string, string> = {
  '1': 'Dönen Varlıklar',
  '2': 'Duran Varlıklar',
  '3': 'Kısa Vadeli Yabancı Kaynaklar',
  '4': 'Uzun Vadeli Yabancı Kaynaklar',
  '5': 'Öz Kaynaklar',
  '6': 'Gelir Tablosu Hesapları',
  '7': 'Maliyet Hesapları',
};

export const ZORLUK_PUAN: Record<Zorluk, number> = {
  kolay: 5,
  orta: 10,
  zor: 20,
};

export const ZORLUK_STIL: Record<Zorluk, string> = {
  kolay: 'text-emerald-700 dark:text-emerald-400',
  orta: 'text-amber-700 dark:text-amber-400',
  zor: 'text-rose-700 dark:text-rose-400',
};

export const ZORLUK_AD: Record<Zorluk, string> = {
  kolay: 'Kolay',
  orta: 'Orta',
  zor: 'Zor',
};

export const ZORLUK_SIRA: Record<Zorluk, number> = {
  kolay: 1,
  orta: 2,
  zor: 3,
};

export const STORAGE_KEY = 'mli_progress_v3';
