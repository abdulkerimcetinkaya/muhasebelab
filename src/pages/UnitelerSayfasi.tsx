// Üniteler ana sayfası — İşletme türü seçici + seçili işletme için müfredat.
//
// Üst kısımda 4 kart: Ticaret / Üretim / Hizmet / İnşaat-Taahhüt.
// Şu an sadece Ticaret aktif; diğer 3'ü "Yakında" rozetiyle pasif.
// Alt kısım seçili işletme türünün ünitelerini editorial tablo formatında
// listeler. Ticaret altında mevcut tüm üniteler görünür.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useUniteler } from '../contexts/UnitelerContext';
import type { Ilerleme } from '../types';

interface Props {
  ilerleme: Ilerleme;
}

interface IsletmeTuru {
  id: 'ticaret' | 'uretim' | 'hizmet' | 'insaat';
  ad: string;
  altMetin: string;
  icon: string;
  aktif: boolean;
}

const ISLETME_TURLERI: IsletmeTuru[] = [
  {
    id: 'ticaret',
    ad: 'Ticaret İşletmesi',
    altMetin: 'Mal alım-satım, KDV, stopaj, çek-senet, duran varlık',
    icon: 'Store',
    aktif: true,
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

export const UnitelerSayfasi = ({ ilerleme }: Props) => {
  const nav = useNavigate();
  const { uniteler } = useUniteler();
  const [aktifTur, setAktifTur] = useState<IsletmeTuru['id']>('ticaret');

  // Şu an tüm üniteler ticaret işletmesi altında (DB'de işletme türü ayrımı yok)
  const aktifTurUniteleri = aktifTur === 'ticaret' ? uniteler : [];
  const toplamSoru = aktifTurUniteleri.reduce((acc, u) => acc + u.sorular.length, 0);
  const toplamCozulen = aktifTurUniteleri.reduce(
    (acc, u) => acc + u.sorular.filter((s) => ilerleme.cozulenler[s.id]).length,
    0,
  );
  const toplamYuzde = toplamSoru > 0 ? Math.round((toplamCozulen / toplamSoru) * 100) : 0;

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
      <section className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ISLETME_TURLERI.map((t, i) => {
            const secili = t.id === aktifTur;
            const pasif = !t.aktif;
            return (
              <button
                key={t.id}
                onClick={() => t.aktif && setAktifTur(t.id)}
                disabled={pasif}
                className={`relative text-left bg-surface border rounded-2xl p-5 transition group min-h-[180px] flex flex-col justify-between ${
                  pasif
                    ? 'border-line opacity-60 cursor-not-allowed'
                    : secili
                      ? 'border-ink shadow-[0_6px_22px_-12px_rgba(15,23,42,0.4)] -translate-y-0.5'
                      : 'border-line hover:border-ink-mute hover:-translate-y-0.5'
                }`}
              >
                {/* Aktif şerit */}
                {secili && !pasif && (
                  <span
                    className="absolute left-0 top-5 bottom-5 w-[3px] bg-brand-deep rounded-r"
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

                {/* Alt: durum */}
                <div className="mt-5 flex items-center justify-between">
                  {pasif ? (
                    <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase font-bold text-premium-deep inline-flex items-center gap-1.5 bg-premium-soft/60 px-2 py-1 rounded">
                      <Icon name="Lock" size={10} />
                      Yakında
                    </span>
                  ) : secili ? (
                    <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase font-bold text-brand-deep inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-deep" />
                      Seçili
                    </span>
                  ) : (
                    <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase font-bold text-ink-mute inline-flex items-center gap-1.5">
                      Seç
                      <Icon name="ArrowRight" size={10} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SEÇİLİ İŞLETMENİN MÜFREDATI */}
      <section className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pb-20">
        {/* Bölüm başlığı */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-8 pt-4 border-t-2 border-ink/85">
          <div className="pt-6">
            <div className="font-mono text-[10.5px] tracking-[0.32em] uppercase text-ink-mute font-bold mb-2">
              {ISLETME_TURLERI.find((t) => t.id === aktifTur)?.ad} · Müfredat
            </div>
            <h2 className="font-display font-bold tracking-tight leading-[1] text-ink"
                style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
              {aktifTurUniteleri.length > 0 ? aktifTurUniteleri.length : '—'}{' '}
              <span className="font-display-italic text-ink-soft font-normal">ünite</span>
            </h2>
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

        {aktifTurUniteleri.length === 0 ? (
          <div className="bg-surface border border-dashed border-line-strong rounded-2xl px-6 py-16 text-center">
            <Icon name="Lock" size={22} className="mx-auto text-ink-quiet mb-3" />
            <div className="font-display text-xl font-bold tracking-tight mb-2">
              Bu işletme türü yakında
            </div>
            <p className="text-sm text-ink-mute leading-relaxed max-w-md mx-auto">
              {ISLETME_TURLERI.find((t) => t.id === aktifTur)?.ad} müfredatı şu an
              hazırlanıyor. Yakında burada olacak.
            </p>
          </div>
        ) : (
          <>
            {/* Tablo başlığı */}
            <div className="hidden md:grid grid-cols-12 gap-3 px-5 pb-3 mb-1 border-b border-line-strong font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
              <div className="col-span-1 tabular-nums">No</div>
              <div className="col-span-7">Konu Başlığı</div>
              <div className="col-span-2">Senaryo</div>
              <div className="col-span-2 text-right">İlerleme</div>
            </div>

            <ol className="space-y-3">
              {aktifTurUniteleri.map((u, i) => {
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
                      <div
                        className="col-span-2 md:col-span-1 font-mono font-bold text-ink tabular-nums leading-none pt-1.5"
                        style={{ fontSize: 'clamp(22px, 2.4vw, 30px)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>

                      <div className="col-span-10 md:col-span-7">
                        <h3
                          className="font-display font-bold tracking-tight leading-[1.1] text-ink mb-1.5"
                          style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}
                        >
                          <span className="mufredat-baslik">{u.ad}</span>
                        </h3>
                        <p
                          className="font-display-italic text-ink-soft leading-snug max-w-[640px]"
                          style={{ fontSize: 'clamp(13.5px, 1.1vw, 15px)' }}
                        >
                          {u.aciklama}
                        </p>
                      </div>

                      <div className="col-span-6 md:col-span-2 pt-3 md:pt-1">
                        <div className="font-mono text-[14px] font-bold text-ink tabular-nums leading-none">
                          {bos ? (
                            <span className="text-ink-quiet">—</span>
                          ) : (
                            <>
                              {cozulen}
                              <span className="text-ink-quiet"> / {toplam}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-2 font-mono text-[9.5px] tracking-[0.22em] uppercase font-bold leading-none">
                          {bos ? (
                            <span className="text-ink-quiet">Hazırlanıyor</span>
                          ) : tamamlandi ? (
                            <span className="text-success inline-flex items-center gap-1">
                              <Icon name="Check" size={9} /> Bitti
                            </span>
                          ) : baslandi ? (
                            <span className="text-brand-deep">Devam ediyor</span>
                          ) : (
                            <span className="text-ink-quiet">Başlamadı</span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2 pt-3 md:pt-1 text-right">
                        <div className="ml-auto inline-flex flex-col items-end gap-2">
                          <span
                            className="font-mono font-bold text-ink tabular-nums leading-none"
                            style={{ fontSize: 'clamp(20px, 1.8vw, 24px)' }}
                          >
                            {bos ? '—' : `%${yuzde}`}
                          </span>
                          {!bos && (
                            <div className="w-[120px] h-[2px] bg-line/70 relative overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 transition-all duration-500"
                                style={{
                                  width: `${yuzde}%`,
                                  background: tamamlandi ? 'var(--success)' : 'var(--blue-deep)',
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

                      <span className="mufredat-accent" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </section>

      {/* FOOTER */}
      {toplamSoru > 0 && (
        <footer className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pb-32">
          <div className="border-t-2 border-ink/85 pt-10 grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-7">
              <div className="font-mono text-[10.5px] tracking-[0.32em] uppercase text-ink-mute font-bold mb-3">
                Liste sonu — Toplam ilerleme
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  className="font-display font-bold text-ink tabular-nums leading-none"
                  style={{ fontSize: 'clamp(60px, 8vw, 96px)' }}
                >
                  {toplamCozulen}
                </span>
                <span
                  className="font-display text-ink-quiet tabular-nums leading-none"
                  style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
                >
                  / {toplamSoru}
                </span>
                <span
                  className="font-display-italic text-copper-deep ml-3 leading-none"
                  style={{ fontSize: 'clamp(18px, 1.8vw, 26px)' }}
                >
                  %{toplamYuzde}
                </span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 md:text-right">
              <button onClick={() => nav('/problemler')} className="btn btn-primary btn-lg">
                Tüm soruları gör →
              </button>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
};
