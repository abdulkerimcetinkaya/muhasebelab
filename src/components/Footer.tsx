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
        <div className="surface relative overflow-hidden p-8 sm:p-12">
          {/* Pastel blob arka plan */}
          <div className="blob-mint w-[360px] h-[360px] -left-32 -bottom-32 blob-drift" />
          <div className="blob-peach w-[260px] h-[260px] -right-20 -top-16 blob-drift-2" />

          <div className="relative grid grid-cols-2 md:grid-cols-12 gap-10">
            <div className="col-span-2 md:col-span-5">
              <button
                onClick={() => nav('/')}
                className="inline-flex items-center gap-3 mb-5"
                aria-label="Anasayfa"
              >
                <span className="relative flex items-center justify-center w-11 h-11 rounded-2xl overflow-hidden">
                  <span className="absolute inset-0 bg-mint" />
                  <span className="absolute inset-1 rounded-xl bg-surface" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-peach" />
                  <span className="relative font-display font-bold text-[18px] leading-none text-ink">
                    ₺
                  </span>
                </span>
                <span className="font-display font-bold text-[26px] tracking-[-0.025em] leading-none text-ink">
                  MuhasebeLab
                </span>
              </button>
              <p className="text-[15px] text-ink-soft leading-relaxed max-w-md mb-6">
                Üniversite muhasebe öğrencileri için interaktif yevmiye kaydı atölyesi.
                Tek Düzen Hesap Planı'nı senaryo bazlı problemlerle öğret, pratik yap, ustalaş.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="chip chip-mint">
                  <Icon name="BookOpen" size={11} />
                  11 ünite
                </span>
                <span className="chip chip-peach">
                  <Icon name="ListChecks" size={11} />
                  212 soru
                </span>
                <span className="chip chip-jade">
                  <span className="live-dot" />
                  Aktif
                </span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3 md:col-start-7">
              <div className="eyebrow eyebrow-mint mb-4">Sayfalar</div>
              <div className="space-y-2.5 text-[14px]">
                <button
                  onClick={() => nav('/uniteler')}
                  className="block text-ink hover:text-mint-deep transition font-semibold"
                >
                  Üniteler
                </button>
                <button
                  onClick={() => nav('/problemler')}
                  className="block text-ink hover:text-mint-deep transition font-semibold"
                >
                  Tüm Sorular
                </button>
                {user && (
                  <button
                    onClick={() => nav('/profil')}
                    className="block text-ink hover:text-mint-deep transition font-semibold"
                  >
                    Profil
                  </button>
                )}
                <button
                  onClick={() => nav('/premium')}
                  className="block text-premium-deep hover:opacity-80 transition font-bold"
                >
                  Premium ↗
                </button>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3">
              <div className="eyebrow eyebrow-peach mb-4">Hakkında</div>
              <div className="space-y-2.5 text-[14px] text-ink-soft">
                {!user && (
                  <button
                    onClick={() => nav('/giris')}
                    className="block text-ink hover:text-peach-deep transition font-semibold"
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

          <div className="relative mt-12 pt-6 dotted-line">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6">
              <span className="text-[12.5px] text-ink-mute font-mono tnum">
                © {yil} MuhasebeLab · v0.1.0
              </span>
              <span className="text-[12.5px] text-ink-mute italic font-serif">
                Türkiye'de tasarlandı, kahveyle yapıldı.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
