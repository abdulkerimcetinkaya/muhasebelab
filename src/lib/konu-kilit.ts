// Konu kilit / tamamlanma mantığı.
//
// Yumuşak kilit kuralı:
//  - İlk konu (sıra'ya göre ilk gelen) hiçbir zaman kilitli değil.
//  - Bir konu kilitli ⇔ önceki konu kilit-açıcı durumda değil.
//  - Konuda 0 soru varsa "henüz hazır değil" sayılır — sıradaki konuyu bloke
//    etmez, ama "tamamlandı" rozetini de almaz. Tamamlanma ve kilit-açıcı
//    durum bilerek farklı kavramlardır.
//  - Yumuşak: konuya bağlı sorulara Problemler / direct link üzerinden erişim
//    her zaman açık. Sadece KonuSayfasi gezinmesi kilitleniyor.
//
// Dinamik: ilerleme sıfırlanırsa kilitler de yeniden devreye girer.
import type { Ilerleme, Konu } from '../types';

/**
 * Konu gerçekten tamamlandı mı — yeşil/lacivert tik rozeti için.
 * En az 1 soru olmalı VE tüm soruları çözülmüş olmalı.
 */
export const konuTamamlandiMi = (konu: Konu, ilerleme: Ilerleme): boolean => {
  if (konu.sorular.length === 0) return false;
  return konu.sorular.every((s) => !!ilerleme.cozulenler[s.id]);
};

/**
 * Konu sıradakini açacak durumda mı — kilit hesabı için.
 * 0 soru olan konular kilit akışını bloke etmez (geçilebilir kabul edilir);
 * kullanıcı "tamamlandı" hissi yaşamaz ama sıradaki konu da kilitli kalmaz.
 */
export const konuKilitAciciMi = (konu: Konu, ilerleme: Ilerleme): boolean => {
  if (konu.sorular.length === 0) return true;
  return konu.sorular.every((s) => !!ilerleme.cozulenler[s.id]);
};

/**
 * Sıra'ya göre dizilmiş konu listesinde verilen konunun kilit durumu.
 * `konular` listesi `sira` ile sıralı olmalı (uniteler-loader bunu zaten yapıyor).
 */
export const konuKilitliMi = (
  konular: Konu[],
  konu: Konu,
  ilerleme: Ilerleme,
): boolean => {
  const idx = konular.findIndex((k) => k.id === konu.id);
  if (idx <= 0) return false; // ilk konu (veya bulunamadı) — kilitli değil
  const onceki = konular[idx - 1];
  return !konuKilitAciciMi(onceki, ilerleme);
};

/**
 * KonuSayfasi banner'ı için: kilidi açmak için bitirilmesi gereken konu.
 * Kilitli değilse null döner.
 */
export const kilidiAcanKonu = (
  konular: Konu[],
  konu: Konu,
  ilerleme: Ilerleme,
): Konu | null => {
  const idx = konular.findIndex((k) => k.id === konu.id);
  if (idx <= 0) return null;
  const onceki = konular[idx - 1];
  if (konuKilitAciciMi(onceki, ilerleme)) return null;
  return onceki;
};
