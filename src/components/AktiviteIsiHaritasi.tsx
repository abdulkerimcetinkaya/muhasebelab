import { useMemo } from 'react';
import type { AktiviteRow } from '../lib/database.types';

interface Props {
  aktivite: AktiviteRow[];
  /** Görüntülenecek hafta sayısı (varsayılan 26 = ~6 ay). */
  haftaSayisi?: number;
}

const GUN_ETIKETLERI = ['Pzt', 'Çar', 'Cum'];

/**
 * GitHub-tarzı aktivite ısı haritası.
 * Sütunlar = haftalar (eski → yeni), satırlar = haftanın günleri (Pzt → Paz).
 * Renk yoğunluğu = o gün çözülen soru sayısı.
 */
export const AktiviteIsiHaritasi = ({ aktivite, haftaSayisi = 26 }: Props) => {
  const { kareler, aySinirlari } = useMemo(() => {
    // Bugünden geriye haftaSayisi hafta için her günü oluştur
    const sonGun = new Date();
    sonGun.setHours(0, 0, 0, 0);

    // Pazar gününe geri git (haftanın başlangıcını ayarlamak için)
    // Türkiye konvansiyonu: hafta Pazartesi başlar
    const bugunGun = sonGun.getDay(); // 0=Paz, 1=Pzt, ..., 6=Cmt
    const cumartesiyeKalan = (6 - bugunGun + 7) % 7; // hafta sonuna kadar
    const sonHaftaCumartesi = new Date(sonGun);
    sonHaftaCumartesi.setDate(sonGun.getDate() + cumartesiyeKalan);

    const haftaToplamGun = haftaSayisi * 7;
    const ilkGun = new Date(sonHaftaCumartesi);
    ilkGun.setDate(sonHaftaCumartesi.getDate() - haftaToplamGun + 1);

    // aktivite map: tarih → cozulen_sayi
    const aktiviteMap = new Map<string, number>();
    aktivite.forEach((a) => aktiviteMap.set(a.tarih, a.cozulen_sayi));

    const kareler: { tarih: string; sayi: number; bugun: boolean }[] = [];
    const aySinirlari: { haftaIdx: number; ay: string }[] = [];
    let oncekiAy = -1;

    for (let i = 0; i < haftaToplamGun; i++) {
      const tarih = new Date(ilkGun);
      tarih.setDate(ilkGun.getDate() + i);
      const tarihStr = tarih.toISOString().split('T')[0];
      const sayi = aktiviteMap.get(tarihStr) ?? 0;
      const bugunMu = tarihStr === sonGun.toISOString().split('T')[0];
      kareler.push({ tarih: tarihStr, sayi, bugun: bugunMu });

      // Ay başlangıcı
      const haftaIdx = Math.floor(i / 7);
      if (tarih.getDate() === 1 || (i === 0 && tarih.getMonth() !== oncekiAy)) {
        const ayAdi = tarih.toLocaleString('tr-TR', { month: 'short' });
        if (!aySinirlari.some((s) => s.haftaIdx === haftaIdx)) {
          aySinirlari.push({ haftaIdx, ay: ayAdi });
        }
        oncekiAy = tarih.getMonth();
      }
    }

    return { kareler, aySinirlari };
  }, [aktivite, haftaSayisi]);

  const yogunluk = (sayi: number): string => {
    if (sayi === 0) return 'bg-stone-100 dark:bg-zinc-800/50';
    if (sayi <= 2) return 'bg-emerald-200 dark:bg-emerald-900/60';
    if (sayi <= 5) return 'bg-emerald-400 dark:bg-emerald-700';
    if (sayi <= 10) return 'bg-emerald-600 dark:bg-emerald-500';
    return 'bg-emerald-700 dark:bg-emerald-400';
  };

  const tarihEtiket = (tarih: string): string => {
    const d = new Date(tarih);
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-xl p-4">
      <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-3">
        Aktivite Isı Haritası ({haftaSayisi} hafta)
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 min-w-fit">
          {/* Ay etiketleri */}
          <div className="flex gap-1 ml-7 text-[9px] text-stone-400 dark:text-zinc-600 font-mono h-3">
            {Array.from({ length: haftaSayisi }).map((_, i) => {
              const ay = aySinirlari.find((s) => s.haftaIdx === i);
              return (
                <div key={i} className="w-3 text-left">
                  {ay?.ay ?? ''}
                </div>
              );
            })}
          </div>

          {/* 7 satır × N sütun grid */}
          <div className="flex gap-1">
            {/* Gün etiketleri (sol) */}
            <div className="flex flex-col gap-1 mr-1 text-[9px] text-stone-400 dark:text-zinc-600 font-mono pr-1">
              {Array.from({ length: 7 }).map((_, gunIdx) => (
                <div key={gunIdx} className="w-5 h-3 flex items-center">
                  {gunIdx % 2 === 0 ? GUN_ETIKETLERI[gunIdx / 2] ?? '' : ''}
                </div>
              ))}
            </div>

            {/* Haftalar */}
            {Array.from({ length: haftaSayisi }).map((_, haftaIdx) => (
              <div key={haftaIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, gunIdx) => {
                  // kareler 0'dan başlıyor, ilk gün Pazartesi olmalı
                  // Pazartesi=0, Paz=6 sırası için günü hesaplayalım
                  const idx = haftaIdx * 7 + gunIdx;
                  const kare = kareler[idx];
                  if (!kare) return <div key={gunIdx} className="w-3 h-3" />;
                  return (
                    <div
                      key={gunIdx}
                      title={`${tarihEtiket(kare.tarih)} — ${kare.sayi} çözüm`}
                      className={`w-3 h-3 rounded-sm ${yogunluk(kare.sayi)} ${kare.bugun ? 'ring-1 ring-stone-900 dark:ring-zinc-100' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lejant */}
      <div className="flex items-center gap-2 mt-3 text-[10px] text-stone-500 dark:text-zinc-500 font-mono">
        <span>az</span>
        <div className="w-3 h-3 rounded-sm bg-stone-100 dark:bg-zinc-800/50" />
        <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/60" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
        <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
        <div className="w-3 h-3 rounded-sm bg-emerald-700 dark:bg-emerald-400" />
        <span>çok</span>
      </div>
    </div>
  );
};
