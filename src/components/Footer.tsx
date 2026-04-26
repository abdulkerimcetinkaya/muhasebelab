import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';

export const Footer = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const yil = new Date().getFullYear();

  return (
    <footer className="px-3 sm:px-5 pb-5 mt-24">
      <div className="max-w-[1320px] mx-auto">
        <div className="surface p-8 sm:p-12 mesh-bg">
          <div className="relative grid grid-cols-2 md:grid-cols-12 gap-10">
            {/* Wordmark */}
            <div className="col-span-2 md:col-span-5">
              <button
                onClick={() => nav('/')}
                className="flex items-center gap-2.5 mb-5 group"
                aria-label="Anasayfa"
              >
                <span className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-ink text-bg font-display font-bold text-[20px] leading-none">
                  M
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-energy border-2 border-surface" />
                </span>
                <span className="font-display font-bold text-[24px] tracking-[-0.025em] leading-none text-ink">
                  MuhasebeLab
                </span>
              </button>
              <p className="text-[15px] text-ink-soft leading-relaxed max-w-md mb-6">
                Üniversite muhasebe öğrencileri için interaktif yevmiye kaydı atölyesi.
                Tek Düzen Hesap Planı'nı senaryo bazlı problemlerle öğret, pratik yap, ustalaş.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="chip">
                  <Icon name="BookOpen" size={11} />
                  11 ünite
                </span>
                <span className="chip">
                  <Icon name="ListChecks" size={11} />
                  212 soru
                </span>
                <span className="chip chip-energy">
                  <span className="live-dot" />
                  Aktif
                </span>
              </div>
            </div>

            {/* Sayfalar */}
            <div className="col-span-1 md:col-span-3 md:col-start-7">
              <div className="eyebrow mb-4">Sayfalar</div>
              <div className="space-y-2.5 text-[14px]">
                <button
                  onClick={() => nav('/uniteler')}
                  className="block text-ink hover:text-primary transition font-medium"
                >
                  Üniteler
                </button>
                <button
                  onClick={() => nav('/problemler')}
                  className="block text-ink hover:text-primary transition font-medium"
                >
                  Tüm Sorular
                </button>
                {user && (
                  <button
                    onClick={() => nav('/profil')}
                    className="block text-ink hover:text-primary transition font-medium"
                  >
                    Profil
                  </button>
                )}
                <button
                  onClick={() => nav('/premium')}
                  className="block text-premium-deep hover:opacity-80 transition font-semibold"
                >
                  Premium ↗
                </button>
              </div>
            </div>

            {/* Hakkında */}
            <div className="col-span-1 md:col-span-3">
              <div className="eyebrow mb-4">Hakkında</div>
              <div className="space-y-2.5 text-[14px] text-ink-soft">
                {!user && (
                  <button
                    onClick={() => nav('/giris')}
                    className="block text-ink hover:text-primary transition font-medium"
                  >
                    Giriş / Kayıt
                  </button>
                )}
                <span className="block">Gizlilik · yakında</span>
                <span className="block">KVKK · yakında</span>
                <span className="block">İletişim · yakında</span>
              </div>
            </div>
          </div>

          {/* Alt şerit */}
          <div className="relative mt-12 pt-6 border-t border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-[12.5px] text-ink-mute font-mono tnum">
              © {yil} MuhasebeLab · v0.1.0
            </span>
            <span className="text-[12.5px] text-ink-mute italic font-serif">
              Türkiye'de tasarlandı, kahveyle yapıldı.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
