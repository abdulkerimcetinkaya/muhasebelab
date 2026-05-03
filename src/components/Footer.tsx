import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Footer = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const yil = new Date().getFullYear();

  return (
    <footer className="footer-dark mt-20">
      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-10 pb-6">
        {/* Üst — wordmark + kısa tanım */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-7">
          <button onClick={() => nav('/')} className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-bold tracking-[-0.02em] leading-none text-ink dark:text-paper">
              muhasebelab
            </span>
            <span
              className="font-serif italic text-[24px] leading-none"
              style={{ color: 'var(--copper)' }}
            >
              §
            </span>
          </button>
          <p className="text-[13px] text-ink-soft dark:text-paper/70 max-w-md leading-snug">
            Üniversite muhasebe öğrencileri için yevmiye atölyesi.
          </p>
        </div>

        <div className="h-px bg-ink/12 dark:bg-paper/15 mb-7" />

        {/* Linkler — 2 sütun */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 mb-7">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute/80 dark:text-paper/40 mb-3">
              İçerik
            </div>
            <div className="space-y-2 text-[13.5px]">
              <button onClick={() => nav('/uniteler')} className="block transition">
                Üniteler
              </button>
              <button onClick={() => nav('/problemler')} className="block transition">
                Tüm Sorular
              </button>
              <button onClick={() => nav('/sozluk')} className="block transition">
                Mali Sözlük
              </button>
              <button onClick={() => nav('/liderlik')} className="block transition">
                Liderlik
              </button>
              {user && (
                <button onClick={() => nav('/profil')} className="block transition">
                  Profil
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute/80 dark:text-paper/40 mb-3">
              Erişim
            </div>
            <div className="space-y-2 text-[13.5px]">
              {!user && (
                <button onClick={() => nav('/giris')} className="block transition">
                  Giriş / Kayıt
                </button>
              )}
              <button
                onClick={() => nav('/premium')}
                className="block transition"
                style={{ color: 'var(--copper)' }}
              >
                Premium
              </button>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute/80 dark:text-paper/40 mb-3">
              Yasal
            </div>
            <div className="space-y-2 text-[13.5px]">
              <button onClick={() => nav('/kvkk')} className="block transition">
                KVKK
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-ink/12 dark:bg-paper/15 mb-4" />

        {/* Alt şerit */}
        <div className="flex justify-between items-center gap-3 text-[11px] font-mono text-ink-mute dark:text-paper/50 uppercase tracking-[0.1em]">
          <span>© {yil} MuhasebeLab</span>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
};
