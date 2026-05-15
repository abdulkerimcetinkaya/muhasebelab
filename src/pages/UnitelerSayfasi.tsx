// Üniteler ana sayfası — İşletme türü seçici (4 kart).
//
// Sade tek-tıklamalı akış: kullanıcı bir işletme türüne basar, doğrudan o
// işletmenin modül grid'ine yönlenir. Şu an sadece Ticaret aktif (mal-alis-satis
// ünitesine yönlenir); Üretim/Hizmet/İnşaat-Taahhüt "Yakında" rozetiyle pasif.

import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

interface IsletmeTuru {
  id: 'ticaret' | 'uretim' | 'hizmet' | 'insaat';
  ad: string;
  altMetin: string;
  icon: string;
  aktif: boolean;
  hedef?: string;
}

const ISLETME_TURLERI: IsletmeTuru[] = [
  {
    id: 'ticaret',
    ad: 'Ticaret İşletmesi',
    altMetin: 'Mal alım-satım, KDV, stopaj, çek-senet, duran varlık',
    icon: 'Store',
    aktif: true,
    hedef: '/uniteler/mal-alis-satis?overview=1',
  },
  {
    id: 'uretim',
    ad: 'Üretim İşletmesi',
    altMetin: 'Mamul üretim, maliyet muhasebesi, 7/B sınıfı',
    icon: 'Factory',
    aktif: false,
  },
  {
    id: 'hizmet',
    ad: 'Hizmet İşletmesi',
    altMetin: 'Hizmet sunan işletmeler için özel kayıtlar',
    icon: 'Briefcase',
    aktif: false,
  },
  {
    id: 'insaat',
    ad: 'İnşaat / Taahhüt',
    altMetin: 'Yıllara yaygın inşaat, hak ediş, taşeronlar',
    icon: 'HardHat',
    aktif: false,
  },
];

export const UnitelerSayfasi = () => {
  const nav = useNavigate();

  return (
    <main className="relative overflow-hidden">
      {/* HERO */}
      <header className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="font-mono text-[10.5px] tracking-[0.32em] uppercase text-ink-mute font-bold mb-4">
          İşletme türü seç
        </div>
        <h1
          className="font-display font-bold tracking-[-0.02em] text-ink leading-[0.95] max-w-[18ch]"
          style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
        >
          Hangi <span className="font-display-italic text-ink-soft font-normal">işletmeyle</span>{' '}
          başlamak istersin?
        </h1>
        <p
          className="font-display-italic text-ink-soft leading-snug max-w-[640px] mt-5"
          style={{ fontSize: 'clamp(14px, 1.2vw, 17px)' }}
        >
          Her işletme türü kendi senaryolarına, hesap planına ve özel kayıt akışına sahiptir.
          Şu an Ticaret İşletmesi müfredatı yayında; diğerleri yakında.
        </p>
      </header>

      {/* İŞLETME TÜRÜ KARTLARI */}
      <section className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ISLETME_TURLERI.map((t, i) => {
            const pasif = !t.aktif;
            return (
              <button
                key={t.id}
                onClick={() => t.aktif && t.hedef && nav(t.hedef)}
                disabled={pasif}
                className={`relative text-left bg-surface border rounded-2xl p-5 transition group min-h-[200px] flex flex-col justify-between ${
                  pasif
                    ? 'border-line opacity-60 cursor-not-allowed'
                    : 'border-line hover:border-ink hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_rgba(15,23,42,0.4)] active:scale-[0.99]'
                }`}
              >
                {/* Aktif kart için sol şerit (hover'da belirginleşir) */}
                {!pasif && (
                  <span
                    className="absolute left-0 top-5 bottom-5 w-[3px] bg-brand-deep rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden
                  />
                )}

                {/* Üst: numara + ikon */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-quiet font-bold">
                    {String(i + 1).padStart(2, '0')} / 04
                  </span>
                  <Icon
                    name={t.icon}
                    size={22}
                    className={pasif ? 'text-ink-quiet' : 'text-ink'}
                  />
                </div>

                {/* Orta: başlık + alt metin */}
                <div className="mt-6">
                  <h3 className="font-display font-bold tracking-tight leading-[1.1] text-ink"
                      style={{ fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
                    {t.ad}
                  </h3>
                  <p className="text-[12.5px] text-ink-mute leading-snug mt-1.5 font-medium">
                    {t.altMetin}
                  </p>
                </div>

                {/* Alt: durum / CTA */}
                <div className="mt-5 flex items-center justify-between">
                  {pasif ? (
                    <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase font-bold text-premium-deep inline-flex items-center gap-1.5 bg-premium-soft/60 px-2 py-1 rounded">
                      <Icon name="Lock" size={10} />
                      Yakında
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold text-ink-mute inline-flex items-center gap-1.5 group-hover:text-brand-deep transition-colors">
                      Modülleri Aç
                      <Icon name="ArrowRight" size={11} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};
