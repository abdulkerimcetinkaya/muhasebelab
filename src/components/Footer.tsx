import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Footer = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const yil = new Date().getFullYear();

  return (
    <footer className="border-t border-line mt-32">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
        {/* Üst — wordmark + tagline */}
        <div className="flex items-baseline justify-between gap-6 mb-12 flex-wrap">
          <h2 className="font-display text-[44px] sm:text-[56px] leading-[0.92] tracking-[-0.02em] text-ink">
            MuhasebeLab.
          </h2>
          <span className="folio">— No. 01 · MMXXVI</span>
        </div>

        <div className="hairline mb-12" />

        {/* Kolofon — 4 sütun */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 sm:gap-10">
          <div className="col-span-2 md:col-span-5">
            <p className="font-display text-[18px] italic text-ink-soft leading-snug max-w-md">
              Üniversite muhasebe öğrencileri için interaktif yevmiye atölyesi.
              Tek Düzen Hesap Planı, senaryo bazlı problemlerle.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <div className="eyebrow mb-3">İçerik</div>
            <div className="space-y-2 text-[14px]">
              <button onClick={() => nav('/uniteler')} className="block text-ink hover:text-ink-soft transition">
                Üniteler
              </button>
              <button onClick={() => nav('/problemler')} className="block text-ink hover:text-ink-soft transition">
                Tüm Sorular
              </button>
              {user && (
                <button onClick={() => nav('/profil')} className="block text-ink hover:text-ink-soft transition">
                  Profil
                </button>
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="eyebrow mb-3">Erişim</div>
            <div className="space-y-2 text-[14px]">
              {!user && (
                <button onClick={() => nav('/giris')} className="block text-ink hover:text-ink-soft transition">
                  Giriş / Kayıt
                </button>
              )}
              <button onClick={() => nav('/premium')} className="block text-ink hover:text-ink-soft transition">
                Premium
              </button>
              <span className="block text-ink-mute">Gizlilik · yakında</span>
              <span className="block text-ink-mute">KVKK · yakında</span>
            </div>
          </div>

          <div className="col-span-2 md:col-span-3">
            <div className="eyebrow mb-3">Kolofon</div>
            <div className="space-y-2 text-[13.5px] text-ink-soft leading-relaxed">
              <div>
                <span className="emph text-ink">Instrument Serif</span> + <span className="emph text-ink">Geist</span>.
              </div>
              <div>Türkiye'de tasarlandı, kahveyle yapıldı.</div>
              <div className="font-mono text-[12px] text-ink-mute">v0.1.0 · build alpha</div>
            </div>
          </div>
        </div>

        <div className="hairline mt-14 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[12px] text-ink-mute font-mono">
          <span>© {yil} MuhasebeLab</span>
          <span className="emph not-italic font-display text-[13px] italic text-ink-soft">— Son —</span>
          <span>Tüm hakları saklıdır</span>
        </div>
      </div>
    </footer>
  );
};
