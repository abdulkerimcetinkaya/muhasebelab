import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useUniteler } from '../contexts/UnitelerContext';
import type { Ilerleme } from '../types';

interface Props {
  ilerleme: Ilerleme;
}

export const UnitelerSayfasi = ({ ilerleme }: Props) => {
  const nav = useNavigate();
  const { uniteler } = useUniteler();

  const toplamSoru = uniteler.reduce((acc, u) => acc + u.sorular.length, 0);
  const toplamCozulen = uniteler.reduce(
    (acc, u) => acc + u.sorular.filter((s) => ilerleme.cozulenler[s.id]).length,
    0,
  );
  const toplamYuzde = toplamSoru > 0 ? Math.round((toplamCozulen / toplamSoru) * 100) : 0;

  return (
    <main className="mufredat-sayfa relative min-h-screen overflow-hidden">
      {/* HERO — sade başlık + dinamik sayaç */}
      <header className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-16 pb-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="font-mono text-[10.5px] tracking-[0.32em] uppercase text-ink-mute font-bold mb-4">
              Üniteler
            </div>
            <h1
              className="font-display font-bold tracking-[-0.02em] text-ink leading-[0.9]"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              {uniteler.length > 0 ? uniteler.length : '—'}{' '}
              <span className="font-display-italic text-ink-soft font-normal">
                ünite
              </span>
            </h1>
          </div>

          {toplamSoru > 0 && (
            <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-mute font-bold flex flex-wrap gap-x-4 gap-y-1.5 pb-2">
              <span className="tabular-nums">{toplamSoru} senaryo</span>
              <span className="text-line-strong">·</span>
              <span className="tabular-nums">
                {toplamCozulen}/{toplamSoru} çözüldü
              </span>
              <span className="text-line-strong">·</span>
              <span className="tabular-nums">%{toplamYuzde}</span>
            </div>
          )}
        </div>
      </header>

      {/* MÜFREDAT TABLOSU */}
      <section className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pb-20">
        {/* tablo başlık satırı */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 pb-3 mb-1 border-b-2 border-ink/85 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
          <div className="col-span-1 tabular-nums">No</div>
          <div className="col-span-7">Konu Başlığı</div>
          <div className="col-span-2">Senaryo</div>
          <div className="col-span-2 text-right">İlerleme</div>
        </div>

        <ol>
          {uniteler.map((u, i) => {
            const toplam = u.sorular.length;
            const cozulen = u.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
            const yuzde = toplam > 0 ? Math.round((cozulen / toplam) * 100) : 0;
            const tamamlandi = cozulen === toplam && toplam > 0;
            const baslandi = cozulen > 0;
            const bos = toplam === 0;

            return (
              <li key={u.id}>
                <button
                  onClick={() => nav(`/uniteler/${u.id}`)}
                  className="mufredat-satir w-full grid grid-cols-12 gap-3 items-baseline px-5 py-7 text-left group relative"
                >
                  {/* Numara */}
                  <div className="col-span-2 md:col-span-1 font-mono font-bold text-ink tabular-nums leading-none pt-1.5"
                       style={{ fontSize: 'clamp(22px, 2.4vw, 30px)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Başlık + açıklama */}
                  <div className="col-span-10 md:col-span-7">
                    <h2 className="font-display font-bold tracking-tight leading-[1.1] text-ink mb-1.5"
                        style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}>
                      <span className="mufredat-baslik">{u.ad}</span>
                    </h2>
                    <p className="font-display-italic text-ink-soft leading-snug max-w-[640px]"
                       style={{ fontSize: 'clamp(13.5px, 1.1vw, 15px)' }}>
                      {u.aciklama}
                    </p>
                  </div>

                  {/* Senaryo sayısı + durum */}
                  <div className="col-span-6 md:col-span-2 pt-3 md:pt-1">
                    <div className="font-mono text-[14px] font-bold text-ink tabular-nums leading-none">
                      {bos ? (
                        <span className="text-ink-quiet">—</span>
                      ) : (
                        <>
                          {cozulen}<span className="text-ink-quiet"> / {toplam}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 font-mono text-[9.5px] tracking-[0.22em] uppercase font-bold leading-none">
                      {bos ? (
                        <span className="text-ink-quiet">Hazırlanıyor</span>
                      ) : tamamlandi ? (
                        <span className="text-emerald-700 inline-flex items-center gap-1">
                          <Icon name="Check" size={9} /> Bitti
                        </span>
                      ) : baslandi ? (
                        <span className="text-copper-deep">Devam ediyor</span>
                      ) : (
                        <span className="text-ink-quiet">Başlamadı</span>
                      )}
                    </div>
                  </div>

                  {/* İlerleme + ok */}
                  <div className="col-span-6 md:col-span-2 pt-3 md:pt-1 text-right">
                    <div className="ml-auto inline-flex flex-col items-end gap-2">
                      <span className="font-mono font-bold text-ink tabular-nums leading-none"
                            style={{ fontSize: 'clamp(20px, 1.8vw, 24px)' }}>
                        {bos ? '—' : `%${yuzde}`}
                      </span>
                      {!bos && (
                        <div className="w-[120px] h-[2px] bg-line/70 relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 transition-all duration-500"
                            style={{
                              width: `${yuzde}%`,
                              background: tamamlandi ? 'var(--success, #047857)' : 'var(--copper-deep)',
                            }}
                          />
                        </div>
                      )}
                      <span className="mufredat-ok font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute font-bold inline-flex items-center gap-1.5 mt-0.5">
                        Aç
                        <Icon name="ArrowRight" size={11} />
                      </span>
                    </div>
                  </div>

                  {/* hover bakır accent çubuk (left edge) */}
                  <span className="mufredat-accent" aria-hidden />
                </button>
                <div className="mufredat-hairline" aria-hidden />
              </li>
            );
          })}
        </ol>
      </section>

      {/* FOOTER — toplam ilerleme + CTA */}
      <footer className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pb-32">
        <div className="border-t-2 border-ink/85 pt-10 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-7">
            <div className="font-mono text-[10.5px] tracking-[0.32em] uppercase text-ink-mute font-bold mb-3">
              Liste sonu — Toplam ilerleme
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold text-ink tabular-nums leading-none"
                    style={{ fontSize: 'clamp(60px, 8vw, 96px)' }}>
                {toplamCozulen}
              </span>
              <span className="font-display text-ink-quiet tabular-nums leading-none"
                    style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                / {toplamSoru}
              </span>
              <span className="font-display-italic text-copper-deep ml-3 leading-none"
                    style={{ fontSize: 'clamp(18px, 1.8vw, 26px)' }}>
                %{toplamYuzde}
              </span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 md:text-right">
            <button
              onClick={() => nav('/problemler')}
              className="btn btn-primary btn-lg"
            >
              Tüm soruları gör →
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
};
