import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUniteler } from '../contexts/UnitelerContext';

export const Footer = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const { tumSorular } = useUniteler();
  const yil = new Date().getFullYear();
  const [lang, setLang] = useState<'TR' | 'EN'>('TR');

  return (
    <footer className="footer-dark mt-20">
      {/* Mega § sembolü — Ventriloc'un "<" eşdeğeri */}
      <div className="footer-mega-mark">§</div>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-12 pb-7">
        {/* Üst — wordmark + dil seçici */}
        <div className="flex items-center justify-between gap-6 mb-8 flex-wrap">
          <button onClick={() => nav('/')} className="flex items-baseline gap-2 group">
            <span className="font-display text-[36px] sm:text-[44px] font-bold tracking-[-0.025em] leading-none text-ink dark:text-paper">
              muhasebelab
            </span>
            <span
              className="font-serif italic text-[40px] sm:text-[50px] leading-none"
              style={{ color: 'var(--copper)' }}
            >
              §
            </span>
          </button>

          <div className="lang-pill" role="tablist">
            <button
              onClick={() => setLang('TR')}
              className={lang === 'TR' ? 'active' : ''}
              aria-selected={lang === 'TR'}
            >
              TR
            </button>
            <button
              onClick={() => setLang('EN')}
              className={lang === 'EN' ? 'active' : ''}
              aria-selected={lang === 'EN'}
            >
              EN
            </button>
          </div>
        </div>

        <div className="h-px bg-ink/12 dark:bg-paper/15 mb-8" />

        {/* Kolofon — 4 sütun */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 sm:gap-10 mb-8">
          <div className="col-span-2 md:col-span-5">
            <p className="font-display text-[18px] sm:text-[20px] italic leading-snug text-ink/85 dark:text-paper/90 max-w-md">
              Üniversite muhasebe öğrencileri için interaktif yevmiye atölyesi —
              Tek Düzen Hesap Planı, senaryo bazlı {tumSorular.length} problemle.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-[12.5px] text-ink-mute dark:text-paper/60">
              <span className="font-mono uppercase tracking-[0.14em]">İstanbul</span>
              <span className="font-mono uppercase tracking-[0.14em]">Ankara</span>
              <span className="font-mono uppercase tracking-[0.14em]">İzmir</span>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-mute/80 dark:text-paper/40 mb-3">
              İçerik
            </div>
            <div className="space-y-2.5 text-[14px]">
              <button onClick={() => nav('/uniteler')} className="block transition">
                Üniteler
              </button>
              <button onClick={() => nav('/problemler')} className="block transition">
                Tüm Sorular
              </button>
              {user && (
                <button onClick={() => nav('/profil')} className="block transition">
                  Profil
                </button>
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-mute/80 dark:text-paper/40 mb-3">
              Erişim
            </div>
            <div className="space-y-2.5 text-[14px]">
              {!user && (
                <button onClick={() => nav('/giris')} className="block transition">
                  Giriş / Kayıt
                </button>
              )}
              <button onClick={() => nav('/premium')} className="block transition" style={{ color: 'var(--copper)' }}>
                Premium ↗
              </button>
              <span className="block text-ink-mute/70 dark:text-paper/40">Gizlilik · yakında</span>
              <span className="block text-ink-mute/70 dark:text-paper/40">KVKK · yakında</span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-3">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-mute/80 dark:text-paper/40 mb-3">
              Kolofon
            </div>
            <div className="space-y-2 text-[13px] text-ink-soft dark:text-paper/70 leading-relaxed">
              <div>
                Tipografi: <span className="text-ink dark:text-paper">Geist</span> + <span className="text-ink dark:text-paper italic font-serif">Instrument Serif</span>
              </div>
              <div>İstanbul'da tasarlandı, kahveyle yapıldı.</div>
              <div className="font-mono text-[11.5px] text-ink-mute/70 dark:text-paper/40">v0.1.0 · build alpha</div>
            </div>
          </div>
        </div>

        <div className="h-px bg-ink/12 dark:bg-paper/15 mb-4" />

        {/* Alt şerit */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11.5px] font-mono text-ink-mute dark:text-paper/50 uppercase tracking-[0.1em]">
          <span>© {yil} MuhasebeLab</span>
          <div className="flex items-center gap-5">
            <a href="#" className="transition">Tercihler</a>
            <a href="#" className="transition">Gizlilik</a>
            <a href="#" className="transition">Kredi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
