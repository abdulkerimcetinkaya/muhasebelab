import { useEffect, useLayoutEffect, useState } from 'react';
import { Icon } from './Icon';

export interface KocTuruAdim {
  hedef: string;
  baslik: string;
  metin: string;
}

interface Props {
  adimlar: KocTuruAdim[];
  acik: boolean;
  onKapat: () => void;
}

export const KocTuru = ({ adimlar, acik, onKapat }: Props) => {
  const [adim, setAdim] = useState(0);
  const [hedefRect, setHedefRect] = useState<DOMRect | null>(null);

  const aktif = adimlar[adim];

  useLayoutEffect(() => {
    if (!acik || !aktif) return;
    const el = document.querySelector<HTMLElement>(`[data-tour="${aktif.hedef}"]`);
    if (!el) {
      setHedefRect(null);
      return;
    }
    // Görünür değilse instant scroll — smooth halka senkronizasyonunu bozuyor
    const ilkRect = el.getBoundingClientRect();
    const yetersiz =
      ilkRect.top < 80 || ilkRect.bottom > window.innerHeight - 80;
    if (yetersiz) {
      const merkezY = ilkRect.top + ilkRect.height / 2;
      const idealMerkez = window.innerHeight / 2;
      window.scrollBy({ top: merkezY - idealMerkez, behavior: 'auto' });
    }
    const olc = () => setHedefRect(el.getBoundingClientRect());
    olc();
    window.addEventListener('resize', olc);
    window.addEventListener('scroll', olc, { passive: true });
    return () => {
      window.removeEventListener('resize', olc);
      window.removeEventListener('scroll', olc);
    };
  }, [acik, aktif, adim]);

  useEffect(() => {
    if (!acik) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onKapat();
      else if (e.key === 'Enter' || e.key === 'ArrowRight') ileri();
      else if (e.key === 'ArrowLeft' && adim > 0) setAdim((a) => a - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acik, adim]);

  if (!acik || !aktif) return null;

  const sonAdim = adim === adimlar.length - 1;

  const ileri = () => {
    if (sonAdim) onKapat();
    else setAdim((a) => a + 1);
  };

  const halkaStil = hedefRect
    ? {
        top: hedefRect.top - 6,
        left: hedefRect.left - 6,
        width: hedefRect.width + 12,
        height: hedefRect.height + 12,
      }
    : null;

  return (
    <>
      {/* Şeffaf tıklama yüzeyi — kart dışı tıklamayla kapatma */}
      <div
        className="fixed inset-0 z-[100]"
        onClick={onKapat}
        aria-hidden
      />
      {halkaStil ? (
        <div
          key={aktif.hedef}
          className="fixed z-[101] pointer-events-none rounded-xl animate-[koc-tour-pop_0.28s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{
            ...halkaStil,
            boxShadow:
              '0 0 0 9999px rgba(15, 23, 42, 0.42), 0 0 0 2px rgba(31, 58, 95, 0.18), 0 0 0 4px rgba(184, 115, 43, 0.7)',
          }}
        />
      ) : (
        <div className="fixed inset-0 z-[100] bg-ink/55 pointer-events-none" aria-hidden />
      )}
      <div
        role="dialog"
        aria-label={aktif.baslik}
        className="koc-turu-kart fixed z-[102] bg-surface border border-line-strong rounded-2xl shadow-2xl p-5 animate-[koc-tour-pop_0.28s_cubic-bezier(0.22,1,0.36,1)_both]"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
            Adım {adim + 1} / {adimlar.length}
          </span>
          <button
            onClick={onKapat}
            className="text-ink-quiet hover:text-ink transition"
            aria-label="Turu kapat"
          >
            <Icon name="X" size={14} />
          </button>
        </div>
        <h3 className="font-display text-[18px] font-bold text-ink leading-snug mb-2">
          {aktif.baslik}
        </h3>
        <p className="text-[13.5px] leading-relaxed text-ink-soft mb-4">
          {aktif.metin}
        </p>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onKapat}
            className="text-[12px] font-semibold text-ink-mute hover:text-ink transition"
          >
            Atla
          </button>
          <div className="flex items-center gap-2">
            {adim > 0 && (
              <button
                onClick={() => setAdim((a) => a - 1)}
                className="px-3 py-1.5 text-[12px] font-bold border border-line-strong rounded-lg hover:border-ink transition"
              >
                Geri
              </button>
            )}
            <button
              onClick={ileri}
              className="px-4 py-1.5 text-[12px] font-bold bg-ink text-bg rounded-lg hover:bg-ink-soft dark:hover:bg-surface transition flex items-center gap-1.5"
            >
              {sonAdim ? 'Bitir' : 'Sonraki'}
              {!sonAdim && <Icon name="ArrowRight" size={12} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
