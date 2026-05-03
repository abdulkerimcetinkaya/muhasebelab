import { useMemo } from 'react';
import { Icon } from '../Icon';
import { ROZETLER, yaklasanRozet } from '../../data/rozetler';
import { kisiselRekorlar } from '../../lib/profil-rekorlar';
import { uniteYetkinlikleri } from '../../lib/yetkinlik';
import { useUniteler } from '../../contexts/UnitelerContext';
import type { Ilerleme, Istatistik } from '../../types';

interface Props {
  ilerleme: Ilerleme;
  stat: Istatistik;
  onYetkinligeGit: () => void;
}

/**
 * "Genel" bölümü — akademik karne hero. Dashboard'la çakışmaması için
 * tüm widget'lar KÜMÜLATİF / UZUN VADELİ verileri özetler:
 *  - Karne Özeti (toplam çözüm / puan / rozet / en uzun streak)
 *  - Yaklaşan Rozet (uzun vade motivasyon)
 *  - Yetkinlik Özeti (genel mastery)
 *  - Kişisel Rekorlar (vitrin)
 *
 * "Devam Et" CTA ve günlük/haftalık metrikler Dashboard'ın sorumluluğunda.
 */
export const GenelView = ({ ilerleme, stat, onYetkinligeGit }: Props) => {
  const { uniteler } = useUniteler();
  const rekorlar = useMemo(() => kisiselRekorlar(ilerleme), [ilerleme]);

  const yakin = useMemo(
    () =>
      yaklasanRozet(ilerleme.kazanilanRozetler, (r) =>
        r.ilerleme ? r.ilerleme(stat) : null,
      ),
    [ilerleme.kazanilanRozetler, stat],
  );

  const yetkinlikOrt = useMemo(() => {
    const ys = uniteYetkinlikleri(uniteler, ilerleme);
    const cozulu = ys.filter((y) => y.toplamSoru > 0);
    if (cozulu.length === 0) return 0;
    const toplam = cozulu.reduce((acc, y) => acc + y.yetkinlik, 0);
    return Math.round(toplam / cozulu.length);
  }, [uniteler, ilerleme]);

  const kazanilanRozetSayi = Object.keys(ilerleme.kazanilanRozetler).length;

  return (
    <div className="space-y-8">
      {/* Karne Özeti — büyük 4'lü hero */}
      <section>
        <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold mb-4">
          Karne Özeti
        </h2>
        <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-5 sm:p-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-7 divide-x-0 md:divide-x divide-stone-200 dark:divide-zinc-700">
            <KarneStat
              ikon="ListChecks"
              ikonRenk="text-blue-700 dark:text-blue-400"
              etiket="Toplam Çözüm"
              deger={stat.cozulenSayi}
              altMetin={`/ ${stat.toplamSoru} soru`}
            />
            <KarneStat
              ikon="Star"
              ikonRenk="text-amber-600 dark:text-amber-400"
              etiket="Toplam Puan"
              deger={ilerleme.puan}
              altMetin="kazanılan"
            />
            <KarneStat
              ikon="Award"
              ikonRenk="text-violet-700 dark:text-violet-400"
              etiket="Rozet"
              deger={kazanilanRozetSayi}
              altMetin={`/ ${ROZETLER.length} rozet`}
            />
            <KarneStat
              ikon="Flame"
              ikonRenk="text-rose-600 dark:text-rose-400"
              etiket="En Uzun Streak"
              deger={rekorlar.enUzunStreak}
              altMetin={rekorlar.enUzunStreak === 1 ? 'gün' : 'gün'}
            />
          </div>
        </div>
      </section>

      {/* Yaklaşan Rozet + Yetkinlik Özeti — 2'li bento (bu hafta kartı kaldırıldı) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Yaklaşan Rozet */}
        {yakin ? (
          <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Icon name="Award" size={12} className="text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                Yaklaşan Rozet
              </span>
            </div>
            <div className="flex items-center gap-2.5 mb-3">
              <Icon
                name={yakin.rozet.icon}
                size={20}
                className="text-amber-700 dark:text-amber-400 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="font-display text-[15px] font-bold tracking-tight leading-tight truncate">
                  {yakin.rozet.ad}
                </div>
                <div className="text-[10.5px] text-stone-500 dark:text-zinc-500 font-medium truncate">
                  {yakin.rozet.aciklama}
                </div>
              </div>
            </div>
            <div className="h-1.5 bg-stone-100 dark:bg-zinc-800 rounded overflow-hidden">
              <div
                className="h-full bg-amber-500 dark:bg-amber-400 transition-all"
                style={{ width: `${yakin.yuzde}%` }}
              />
            </div>
            <div className="text-[11px] text-stone-500 dark:text-zinc-500 font-mono font-bold tabular-nums mt-1">
              {yakin.mevcut}/{yakin.hedef} (%{yakin.yuzde})
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800/40 border border-dashed border-stone-200 dark:border-zinc-700 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Icon name="Award" size={12} className="text-stone-400 dark:text-zinc-600" />
              <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-stone-400 dark:text-zinc-600">
                Yaklaşan Rozet
              </span>
            </div>
            <p className="text-[12.5px] text-stone-500 dark:text-zinc-500 leading-relaxed">
              {kazanilanRozetSayi === ROZETLER.length
                ? 'Tüm rozetleri kazandın.'
                : 'Bir soru çöz, ilk rozet için ilerlemen başlasın.'}
            </p>
          </div>
        )}

        {/* Yetkinlik Özeti */}
        <button
          onClick={onYetkinligeGit}
          className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 rounded-xl p-4 text-left transition active:scale-[0.99] group"
          aria-label="Yetkinlik bölümüne git"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Icon name="BarChart3" size={12} className="text-emerald-700 dark:text-emerald-400" />
              <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                Yetkinlik Özeti
              </span>
            </div>
            <Icon
              name="ArrowRight"
              size={12}
              className="text-stone-400 dark:text-zinc-600 group-hover:text-stone-900 dark:group-hover:text-zinc-300 transition"
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-bold tabular-nums leading-none">
              {yetkinlikOrt}
            </span>
            <span className="text-[11px] text-stone-400 dark:text-zinc-600 font-bold">%</span>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-zinc-500 font-semibold mt-1">
            ortalama mastery
          </div>
          <div className="h-1.5 bg-stone-100 dark:bg-zinc-800 rounded overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all"
              style={{ width: `${yetkinlikOrt}%` }}
            />
          </div>
          <div className="text-[10.5px] text-stone-500 dark:text-zinc-500 font-medium mt-1">
            {uniteler.length} ünite üzerinden
          </div>
        </button>
      </section>

      {/* Kişisel rekorlar — alt vitrin */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold">
            Kişisel Rekorlar
          </h2>
          <span className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
            Vitrin
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Rekor
            ikon="TrendingDown"
            ikonRenk="text-blue-700 dark:text-blue-400"
            etiket="Tek günde rekor"
            deger={`${rekorlar.enCokGun.sayi}`}
            altMetin={
              rekorlar.enCokGun.tarih
                ? new Date(rekorlar.enCokGun.tarih).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                  })
                : '—'
            }
          />
          <Rekor
            ikon="Calendar"
            ikonRenk="text-emerald-700 dark:text-emerald-400"
            etiket="Aktif gün"
            deger={`${rekorlar.toplamAktifGun}`}
            altMetin="toplam"
          />
          <Rekor
            ikon="Sparkles"
            ikonRenk="text-violet-700 dark:text-violet-400"
            etiket="İlk soru"
            deger={
              rekorlar.ilkSoruTarihi
                ? new Date(rekorlar.ilkSoruTarihi).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                  })
                : '—'
            }
            altMetin={
              rekorlar.ilkSoruTarihi
                ? new Date(rekorlar.ilkSoruTarihi).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                  })
                : 'henüz yok'
            }
          />
          <Rekor
            ikon="Trophy"
            ikonRenk="text-amber-700 dark:text-amber-400"
            etiket="Bitirilen ünite"
            deger={`${
              uniteler.filter((u) => {
                if (u.sorular.length === 0) return false;
                return u.sorular.every((s) => ilerleme.cozulenler[s.id]);
              }).length
            }`}
            altMetin={`/ ${uniteler.length} ünite`}
          />
        </div>
      </section>
    </div>
  );
};

const KarneStat = ({
  ikon,
  ikonRenk,
  etiket,
  deger,
  altMetin,
}: {
  ikon: string;
  ikonRenk: string;
  etiket: string;
  deger: number;
  altMetin: string;
}) => (
  <div className="md:px-5 first:md:pl-0 last:md:pr-0">
    <div className="flex items-center gap-1.5 mb-2">
      <Icon name={ikon} size={14} className={ikonRenk} />
      <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-stone-500 dark:text-zinc-500">
        {etiket}
      </span>
    </div>
    <div className="font-display text-4xl sm:text-5xl font-bold tabular-nums leading-none">
      {deger}
    </div>
    <div className="text-[12px] text-stone-500 dark:text-zinc-500 font-semibold mt-1.5">
      {altMetin}
    </div>
  </div>
);

const Rekor = ({
  ikon,
  ikonRenk,
  etiket,
  deger,
  altMetin,
}: {
  ikon: string;
  ikonRenk: string;
  etiket: string;
  deger: string;
  altMetin: string;
}) => (
  <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-xl p-4">
    <div className="flex items-center gap-1.5 mb-2">
      <Icon name={ikon} size={12} className={ikonRenk} />
      <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-stone-500 dark:text-zinc-500">
        {etiket}
      </span>
    </div>
    <div className="font-display text-2xl sm:text-3xl font-bold tabular-nums leading-none">
      {deger}
    </div>
    <div className="text-[11px] text-stone-500 dark:text-zinc-500 font-semibold mt-1">
      {altMetin}
    </div>
  </div>
);
