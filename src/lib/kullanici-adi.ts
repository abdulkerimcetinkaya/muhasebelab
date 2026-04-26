// Kullanıcı adı yardımcıları — uygunluk kontrolü ve öneri üretimi.
// Migration 20260427000002 ile DB seviyesinde unique (lower); uygunluk
// RPC'si kullanici_adi_uygun anonim erişilebilir.

import { supabase } from './supabase';

const REZERVE = new Set([
  'ogrenci',
  'öğrenci',
  'admin',
  'muhasebelab',
  'destek',
  'kullanici',
  'yonetici',
  'mod',
  'moderator',
]);

export const KULLANICI_ADI_DESEN = /^[a-zA-ZçÇğĞıİöÖşŞüÜ0-9._-]+$/;

export interface AdGecerlilik {
  gecerli: boolean;
  hata?: string;
}

/** Yapısal kontrol — DB'ye gitmez. */
export const adYapisalKontrol = (ad: string): AdGecerlilik => {
  const t = ad.trim();
  if (t.length < 2) return { gecerli: false, hata: 'En az 2 karakter olmalı.' };
  if (t.length > 30) return { gecerli: false, hata: 'En fazla 30 karakter olmalı.' };
  if (!KULLANICI_ADI_DESEN.test(t))
    return {
      gecerli: false,
      hata: 'Sadece harf, rakam, nokta, alt-çizgi ve tire kullanılabilir.',
    };
  if (REZERVE.has(t.toLocaleLowerCase('tr')))
    return { gecerli: false, hata: 'Bu kullanıcı adı sistem tarafından rezerve.' };
  return { gecerli: true };
};

/** DB'ye sorarak ad'ın uygunluğunu kontrol eder. */
export const adUygunMu = async (ad: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('kullanici_adi_uygun', { _ad: ad });
  if (error) {
    console.error('Ad uygunluk kontrolü:', error.message);
    return true; // Hata durumunda blokla — submit zaten son kontrol yapacak
  }
  return data === true;
};

/** Türkçe karakterleri sade ASCII'ye dönüştürür (öneri için). */
const sadelestir = (ad: string): string =>
  ad
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[şŞ]/g, 's')
    .replace(/[çÇ]/g, 'c')
    .replace(/[öÖ]/g, 'o')
    .replace(/[üÜ]/g, 'u')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase();

/** Önerilebilir 5 alternatif üretir. Yapısal geçerli olanları döndürür. */
export const oneriUret = (temel: string): string[] => {
  const sade = sadelestir(temel) || 'kullanici';
  const yil = new Date().getFullYear() % 100;
  const adaylar = [
    `${sade}_${yil}`,
    `${sade}.${Math.floor(Math.random() * 90 + 10)}`,
    `${sade}${Math.floor(Math.random() * 900 + 100)}`,
    `${sade}_lab`,
    `lab_${sade}`,
  ];
  return adaylar.filter((a) => a.length >= 2 && a.length <= 30 && KULLANICI_ADI_DESEN.test(a));
};

/** Liste içinden DB'de kullanılabilir olanları döndürür (ilk 3 yeterli). */
export const uygunOnerileriBul = async (oneriler: string[]): Promise<string[]> => {
  const sonuc: string[] = [];
  for (const oneri of oneriler) {
    if (sonuc.length >= 3) break;
    if (await adUygunMu(oneri)) sonuc.push(oneri);
  }
  return sonuc;
};
