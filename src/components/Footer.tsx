import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Footer = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const yil = new Date().getFullYear();

  return (
    <footer className="border-t border-rule-bold bg-paper mt-24">
      {/* Kolofon — büyük başlık şeridi */}
      <div className="border-b border-rule-strong">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 sm:py-10">
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <h2 className="font-display text-[44px] sm:text-[64px] leading-none font-bold tracking-[-0.025em] text-ink">
              MuhasebeLab
            </h2>
            <span className="folio text-[11px]">
              Editio I · MMXXVI · No. 01
            </span>
          </div>
          <p className="mt-3 font-display italic text-[16px] text-ink-soft max-w-2xl leading-snug">
            Üniversite muhasebe öğrencileri için interaktif yevmiye kaydı atölyesi. Tek Düzen Hesap
            Planı'nı senaryo bazlı problemlerle öğret.
          </p>
        </div>
      </div>

      {/* Kolofon iç sütunları */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="eyebrow mb-4">Sayfalar</div>
            <div className="space-y-2.5 text-[14px] font-display">
              <button
                onClick={() => nav('/uniteler')}
                className="block text-ink hover:text-bordeaux transition"
              >
                Üniteler
              </button>
              <button
                onClick={() => nav('/problemler')}
                className="block text-ink hover:text-bordeaux transition"
              >
                Tüm Sorular
              </button>
              {user && (
                <button
                  onClick={() => nav('/profil')}
                  className="block text-ink hover:text-bordeaux transition"
                >
                  Profil
                </button>
              )}
              <button
                onClick={() => nav('/premium')}
                className="block text-ochre hover:opacity-80 transition"
              >
                Premium Abonelik
              </button>
            </div>
          </div>

          <div>
            <div className="eyebrow mb-4">Hakkında</div>
            <div className="space-y-2.5 text-[14px] font-display text-ink-soft">
              {!user && (
                <button
                  onClick={() => nav('/giris')}
                  className="block text-ink hover:text-bordeaux transition"
                >
                  Giriş / Kayıt
                </button>
              )}
              <span className="block">Gizlilik · yakında</span>
              <span className="block">KVKK · yakında</span>
              <span className="block">İletişim · yakında</span>
            </div>
          </div>

          <div>
            <div className="eyebrow mb-4">İçerik</div>
            <div className="space-y-2.5 text-[14px] font-display text-ink-soft">
              <span className="block tnum font-mono text-ink">11 ünite</span>
              <span className="block tnum font-mono text-ink">212 soru</span>
              <span className="block">Kolay · Orta · Zor</span>
              <span className="block">AI destekli geri bildirim</span>
            </div>
          </div>

          <div>
            <div className="eyebrow mb-4">Tipografi</div>
            <div className="space-y-2.5 text-[13px] font-display italic text-ink-soft leading-snug">
              <span className="block">
                Display: <span className="not-italic font-bold text-ink">Fraunces</span>
              </span>
              <span className="block">
                Gövde: <span className="not-italic font-bold text-ink">Newsreader</span>
              </span>
              <span className="block">
                Rakam: <span className="not-italic font-mono font-bold text-ink">JetBrains Mono</span>
              </span>
            </div>
          </div>
        </div>

        {/* Alt şerit */}
        <div className="pt-8 border-t border-rule-strong">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="font-display italic text-[14px] text-ink-soft leading-snug max-w-md">
                Bu yayın, Türkiye'deki muhasebe eğitimine katkı amacıyla
                geliştirilmiştir. Hatalı bir kayıt gördüğünüzde lütfen
                bildirin — sayı sayı düzeltiyoruz.
              </div>
            </div>
            <div className="text-right text-[10.5px] tracking-[0.28em] uppercase font-display font-semibold text-ink-mute">
              <div>© {yil} MuhasebeLab</div>
              <div className="mt-1 italic font-normal text-ink-soft tracking-[0.18em]">
                Ankara · İstanbul · İzmir
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
