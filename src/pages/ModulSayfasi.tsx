import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { TamamRozeti } from '../components/TamamRozeti';
import { useUniteler } from '../contexts/UnitelerContext';
import {
  MODUL_ZORLUK_AD,
  MODUL_ZORLUK_BADGE,
  MODUL_ZORLUK_KENAR,
} from '../data/sabitler';
import {
  altBaslikTamamlandiMi,
  kilidiAcanModul,
  modulIlerlemeYuzde,
  modulKilitDurumu,
} from '../lib/modul-kilit';
import type { Ilerleme } from '../types';

interface Props {
  ilerleme: Ilerleme;
}

export const ModulSayfasi = ({ ilerleme }: Props) => {
  const { uniteId, modulId } = useParams<{ uniteId: string; modulId: string }>();
  const nav = useNavigate();
  const { uniteler } = useUniteler();

  const unite = uniteler.find((u) => u.id === uniteId);
  const moduller = unite?.moduller ?? [];
  const modul = moduller.find((m) => m.id === modulId);

  if (!unite || !modul) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <button
          onClick={() => nav('/uniteler')}
          className="flex items-center gap-2 text-sm text-ink-mute hover:text-ink mb-6 font-semibold"
        >
          <Icon name="ArrowLeft" size={14} />
          <span>Tüm Üniteler</span>
        </button>
        <div className="bg-surface border border-line rounded-2xl p-10 text-center">
          <p className="text-sm text-ink-mute font-medium">Modül bulunamadı.</p>
        </div>
      </main>
    );
  }

  const durum = modulKilitDurumu(moduller, modul, ilerleme);
  const yuzde = modulIlerlemeYuzde(modul, ilerleme);
  const kilitli = durum === 'kilitli';
  const tamam = durum === 'tamamlandi';
  const acanModul = kilitli ? kilidiAcanModul(moduller, modul, ilerleme) : null;
  const altBasliklar = modul.altBasliklar;
  const tamamAlt = altBasliklar.filter((a) => altBaslikTamamlandiMi(a, ilerleme)).length;

  // Sonraki modüle navigasyon
  const idx = moduller.findIndex((m) => m.id === modul.id);
  const sonrakiModul = idx >= 0 ? moduller[idx + 1] : null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb / Geri */}
      <button
        onClick={() => nav(`/uniteler/${unite.id}?overview=1`)}
        className="flex items-center gap-2 text-sm text-ink-mute hover:text-ink mb-6 font-semibold"
      >
        <Icon name="ArrowLeft" size={14} />
        <span>{unite.ad} — Genel Bakış</span>
      </button>

      {/* Başlık alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`text-[9px] tracking-[0.22em] uppercase font-bold px-2 py-0.5 rounded border ${MODUL_ZORLUK_BADGE[modul.zorlukSeviyesi]}`}
            >
              {MODUL_ZORLUK_AD[modul.zorlukSeviyesi]}
            </span>
            {modul.opsiyonel && (
              <span className="text-[9px] tracking-[0.22em] uppercase font-bold px-2 py-0.5 rounded border bg-premium-soft text-premium-deep border-premium-soft dark:bg-premium-soft/30 dark:text-premium dark:border-premium-deep/40 inline-flex items-center gap-1">
                <Icon name="Star" size={10} />
                Opsiyonel
              </span>
            )}
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-ink-mute mb-1 font-bold">
            Modül {String(modul.sira).padStart(2, '0')}
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight font-bold leading-none mb-4">
            {modul.baslik}
          </h1>
          {modul.aciklama && (
            <p className="text-lg text-ink-soft leading-relaxed font-medium max-w-2xl">
              {modul.aciklama}
            </p>
          )}
        </div>

        <aside
          className={`bg-surface border border-l-4 ${MODUL_ZORLUK_KENAR[modul.zorlukSeviyesi]} rounded-2xl p-6 self-start`}
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-ink-mute mb-4 font-bold">
            İlerleme
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-display text-4xl font-bold tracking-tight">
              {tamamAlt}
            </span>
            <span className="font-mono text-sm text-ink-mute font-bold">
              / {altBasliklar.length} atölye
            </span>
          </div>
          <div className="h-2 bg-surface-2 rounded overflow-hidden mb-4">
            <div
              className="h-full bg-brand-deep transition-all"
              style={{ width: `${yuzde}%` }}
            />
          </div>
          <div className="text-xs text-ink-mute font-semibold">
            %{yuzde} tamamlandı
          </div>
          {tamam && (
            <div className="mt-4 pt-4 border-t border-line text-[11px] text-success font-bold flex items-center gap-1.5">
              <Icon name="CheckCircle2" size={12} />
              Modül tamamlandı
            </div>
          )}
        </aside>
      </div>

      {/* Kilit uyarısı */}
      {kilitli && acanModul && (
        <div className="bg-premium-soft/40 dark:bg-premium-soft/15 border border-premium-soft dark:border-premium-deep/40 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <Icon
            name="Lock"
            size={16}
            className="text-premium-deep dark:text-premium flex-shrink-0 mt-0.5"
          />
          <div className="text-sm text-ink leading-relaxed">
            Bu modül kilitli. Açmak için önce{' '}
            <button
              onClick={() => nav(`/uniteler/${unite.id}/modul/${acanModul.id}`)}
              className="font-bold underline underline-offset-2 hover:text-brand dark:hover:text-brand-mute"
            >
              {acanModul.baslik}
            </button>{' '}
            modülünü tamamla.
          </div>
        </div>
      )}

      {/* Alt başlık listesi */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-bold tracking-tight">Atölyeler</h2>
          <span className="text-xs text-ink-mute font-semibold">
            {altBasliklar.length} alt başlık
          </span>
        </div>

        {altBasliklar.length === 0 ? (
          <div className="bg-surface border border-dashed border-line-strong rounded-2xl px-6 py-10 text-center">
            <p className="text-sm text-ink-mute font-medium">
              Bu modülün alt başlıkları henüz hazırlanmadı.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {altBasliklar.map((a) => {
              const aTamam = altBaslikTamamlandiMi(a, ilerleme);
              const aBaslandi =
                !aTamam && a.sorular.some((s) => !!ilerleme.cozulenler[s.id]);
              const senaryoSayi = a.sorular.length;
              return (
                <li key={a.id}>
                  <button
                    onClick={() =>
                      !kilitli &&
                      nav(`/uniteler/${unite.id}/modul/${modul.id}/alt/${a.id}`)
                    }
                    disabled={kilitli}
                    className={`w-full text-left bg-surface border rounded-xl px-5 py-4 transition group flex items-center gap-4 min-h-[64px] ${
                      kilitli
                        ? 'border-line opacity-55 cursor-not-allowed'
                        : a.karma
                          ? 'border-premium-soft dark:border-premium-deep/40 hover:border-premium-deep hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]'
                          : 'border-line hover:border-ink hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.99]'
                    }`}
                  >
                    <div className="flex-shrink-0 w-7 flex items-center justify-center">
                      {kilitli ? (
                        <Icon name="Lock" size={14} className="text-ink-quiet" />
                      ) : aTamam ? (
                        <TamamRozeti size={18} />
                      ) : aBaslandi ? (
                        <Icon
                          name="CircleDashed"
                          size={18}
                          className="text-brand dark:text-brand-mute"
                        />
                      ) : (
                        <Icon name="Circle" size={18} className="text-ink-quiet" />
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-ink-quiet font-bold tabular-nums w-10 flex-shrink-0">
                      {modul.sira}.{a.sira}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-sm leading-snug ${
                            kilitli ? 'text-ink-mute' : 'text-ink'
                          }`}
                        >
                          {a.baslik}
                        </span>
                        {a.karma && (
                          <Icon
                            name="Star"
                            size={13}
                            className="text-premium-deep dark:text-premium flex-shrink-0"
                          />
                        )}
                      </div>
                      {senaryoSayi > 0 && (
                        <div className="text-[11px] text-ink-mute font-medium mt-0.5">
                          {senaryoSayi} senaryo
                          {aTamam ? ' · tamamlandı' : aBaslandi ? ' · devam ediyor' : ''}
                        </div>
                      )}
                      {senaryoSayi === 0 && !kilitli && (
                        <div className="text-[10px] tracking-[0.18em] uppercase text-premium-deep dark:text-premium font-bold mt-1">
                          Senaryolar hazırlanıyor
                        </div>
                      )}
                    </div>
                    {!kilitli && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-ink-mute group-hover:text-brand dark:group-hover:text-brand-mute font-bold transition flex-shrink-0">
                        {aTamam ? 'Tekrar' : aBaslandi ? 'Devam Et' : 'Başla'}
                        <Icon name="ArrowRight" size={12} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Sonraki modül */}
      {sonrakiModul && (
        <section className="mt-12">
          <button
            onClick={() => nav(`/uniteler/${unite.id}/modul/${sonrakiModul.id}`)}
            className={`w-full text-left rounded-2xl p-6 sm:p-7 border transition group ${
              tamam
                ? 'bg-gradient-to-br from-brand-soft to-bg border-brand-soft dark:border-brand-deep/40 hover:border-brand'
                : 'bg-surface border-line hover:border-ink'
            }`}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="min-w-0">
                {tamam ? (
                  <div className="flex items-center gap-2 mb-2">
                    <TamamRozeti size={14} />
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-brand-deep dark:text-brand-mute">
                      Bu modülü tamamladın
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-ink-mute mb-2">
                    Sıradaki modül
                  </div>
                )}
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink leading-tight">
                  {String(sonrakiModul.sira).padStart(2, '0')} · {sonrakiModul.baslik}
                </h3>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 text-ink-mute group-hover:text-ink transition">
                <span className="hidden sm:inline text-[11px] tracking-[0.18em] uppercase font-bold">
                  Geç
                </span>
                <Icon name="ArrowRight" size={18} />
              </div>
            </div>
          </button>
        </section>
      )}
    </main>
  );
};
