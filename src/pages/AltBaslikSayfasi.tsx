// Alt Başlık (Atölye) Sayfası — İSKELET.
//
// Bu sayfanın iç mantığı (senaryo metni, yevmiye giriş tablosu, kontrol motoru)
// mevcut `SoruEkrani` üzerinden çalışıyor. Burada sadece dış çerçeve var:
//  - Breadcrumb (Modül'e dön + Ünite'ye dön)
//  - Modül + alt başlık başlığı
//  - "AI'ya Sor" yan paneli (mevcut AIAsistanYanPanel'a bağlanır)
//  - Senaryo listesi (alt başlığa bağlı sorular) — her senaryo `/problemler/:id`
//    rotasına gider; SoruEkrani çözüm motorunu üstlenir
//  - Sonraki alt başlığa navigasyon
//
// Senaryolar henüz seed edilmedi → boş state göster. Senaryo eklenince
// liste otomatik dolar.

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { TamamRozeti } from '../components/TamamRozeti';
import { AIAsistanYanPanel } from '../components/AIAsistanYanPanel';
import { useUniteler } from '../contexts/UnitelerContext';
import { ZORLUK_AD, ZORLUK_PUAN, ZORLUK_STIL } from '../data/sabitler';
import { altBaslikTamamlandiMi, modulKilitDurumu } from '../lib/modul-kilit';
import type { Ilerleme } from '../types';

interface Props {
  ilerleme: Ilerleme;
}

export const AltBaslikSayfasi = ({ ilerleme }: Props) => {
  const { uniteId, modulId, altBaslikId } = useParams<{
    uniteId: string;
    modulId: string;
    altBaslikId: string;
  }>();
  const nav = useNavigate();
  const { uniteler } = useUniteler();
  const [aiAcik, setAiAcik] = useState(false);

  const unite = uniteler.find((u) => u.id === uniteId);
  const moduller = unite?.moduller ?? [];
  const modul = moduller.find((m) => m.id === modulId);
  const altBaslik = modul?.altBasliklar.find((a) => a.id === altBaslikId);

  if (!unite || !modul || !altBaslik) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <button
          onClick={() => nav('/uniteler')}
          className="flex items-center gap-2 text-sm text-ink-mute hover:text-ink mb-6 font-semibold"
        >
          <Icon name="ArrowLeft" size={14} />
          <span>Tüm Üniteler</span>
        </button>
        <div className="bg-surface border border-line rounded-2xl p-10 text-center">
          <p className="text-sm text-ink-mute font-medium">Alt başlık bulunamadı.</p>
        </div>
      </main>
    );
  }

  const durum = modulKilitDurumu(moduller, modul, ilerleme);
  const kilitli = durum === 'kilitli';
  const tamam = altBaslikTamamlandiMi(altBaslik, ilerleme);

  // Sonraki alt başlık — aynı modül içinde
  const altIdx = modul.altBasliklar.findIndex((a) => a.id === altBaslik.id);
  const sonrakiAlt =
    altIdx >= 0 ? modul.altBasliklar[altIdx + 1] : null;

  // Sonraki modülün ilk alt başlığı (modül sonu için)
  const modIdx = moduller.findIndex((m) => m.id === modul.id);
  const sonrakiModul = modIdx >= 0 ? moduller[modIdx + 1] : null;
  const sonrakiModulIlk = sonrakiModul?.altBasliklar[0] ?? null;

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-bold text-ink-mute mb-6">
          <button
            onClick={() => nav(`/uniteler/${unite.id}?overview=1`)}
            className="hover:text-ink transition"
          >
            {unite.ad}
          </button>
          <Icon name="ChevronRight" size={12} className="text-ink-quiet" />
          <button
            onClick={() => nav(`/uniteler/${unite.id}/modul/${modul.id}`)}
            className="hover:text-ink transition"
          >
            Modül {modul.sira}
          </button>
          <Icon name="ChevronRight" size={12} className="text-ink-quiet" />
          <span className="text-ink normal-case tracking-normal font-semibold">
            {modul.sira}.{altBaslik.sira}
          </span>
        </nav>

        {/* Üst başlık + AI butonu */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] tracking-[0.3em] uppercase text-ink-mute mb-1.5 font-bold">
              Atölye {modul.sira}.{altBaslik.sira}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold leading-tight">
                {altBaslik.baslik}
              </h1>
              {altBaslik.karma && (
                <Icon
                  name="Star"
                  size={20}
                  className="text-premium-deep dark:text-premium flex-shrink-0"
                />
              )}
              {tamam && <TamamRozeti size={20} />}
            </div>
            <div className="text-sm text-ink-mute font-medium">
              {modul.baslik}
            </div>
          </div>
          <button
            onClick={() => setAiAcik(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-premium-soft hover:bg-premium-soft/80 dark:bg-premium-soft/30 dark:hover:bg-premium-soft/50 border border-premium-soft dark:border-premium-deep/40 text-premium-deep dark:text-premium rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[0.98]"
          >
            <Icon name="Sparkles" size={14} />
            <span className="hidden sm:inline">AI'ya Sor</span>
          </button>
        </div>

        {/* Kilit uyarısı */}
        {kilitli && (
          <div className="bg-premium-soft/40 dark:bg-premium-soft/15 border border-premium-soft dark:border-premium-deep/40 rounded-2xl p-5 mb-8 flex items-start gap-3">
            <Icon
              name="Lock"
              size={16}
              className="text-premium-deep dark:text-premium flex-shrink-0 mt-0.5"
            />
            <div className="text-sm text-ink leading-relaxed">
              Bu atölye, içinde bulunduğu modül henüz açılmadığı için kilitli.
            </div>
          </div>
        )}

        {/* Senaryo listesi — alt başlığa bağlı sorular */}
        {altBaslik.sorular.length > 0 ? (
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-xl font-bold tracking-tight">
                Senaryolar
              </h2>
              <span className="text-xs text-ink-mute font-semibold">
                {altBaslik.sorular.length} adet
              </span>
            </div>
            <ul className="space-y-2">
              {altBaslik.sorular.map((s, i) => {
                const cozulmus = !!ilerleme.cozulenler[s.id];
                const yanlisSayi = ilerleme.yanlislar[s.id] || 0;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => !kilitli && nav(`/problemler/${s.id}`)}
                      disabled={kilitli}
                      className={`w-full text-left bg-surface border border-line rounded-xl p-5 transition group ${
                        kilitli
                          ? 'opacity-55 cursor-not-allowed'
                          : 'hover:border-ink hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.99]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-ink-quiet font-bold font-mono">
                          Senaryo {String(i + 1).padStart(2, '0')}
                        </span>
                        {cozulmus ? (
                          <TamamRozeti size={16} />
                        ) : yanlisSayi > 0 ? (
                          <Icon name="XCircle" size={16} className="text-danger" />
                        ) : (
                          <Icon name="Circle" size={16} className="text-ink-quiet" />
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold tracking-tight mb-2 group-hover:text-brand dark:group-hover:text-brand-mute transition">
                        {s.baslik}
                      </h3>
                      <p className="text-xs text-ink-mute leading-relaxed font-medium line-clamp-2 mb-3">
                        {s.senaryo}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[s.zorluk]}`}
                        >
                          {ZORLUK_AD[s.zorluk]}
                        </span>
                        <span className="font-mono text-[10px] text-ink-quiet font-bold">
                          {ZORLUK_PUAN[s.zorluk]}p
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          // Boş senaryo durumu — iskelet aşaması
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
            <div className="bg-surface border border-dashed border-line-strong rounded-2xl px-6 py-10 min-h-[260px] flex flex-col items-center justify-center text-center">
              <div className="text-[10px] tracking-[0.22em] uppercase text-ink-quiet font-bold mb-2">
                Senaryo
              </div>
              <p className="text-sm text-ink-mute leading-relaxed max-w-sm">
                Bu atölyenin senaryoları henüz hazırlanmadı. İçerik eklendiğinde
                burada senaryo metni görünecek.
              </p>
            </div>
            <div className="bg-surface border border-dashed border-line-strong rounded-2xl px-6 py-10 min-h-[260px] flex flex-col items-center justify-center text-center">
              <div className="text-[10px] tracking-[0.22em] uppercase text-ink-quiet font-bold mb-2">
                Yevmiye Girişi
              </div>
              <p className="text-sm text-ink-mute leading-relaxed max-w-sm">
                Senaryo eklendiğinde yevmiye giriş tablosu, "Kontrol Et" ve "Yeni
                Senaryo" butonları burada açılacak.
              </p>
            </div>
          </section>
        )}

        {/* Sonraki navigasyon */}
        <div className="mt-10 pt-6 border-t border-line flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => nav(`/uniteler/${unite.id}/modul/${modul.id}`)}
            className="flex items-center gap-2 text-sm text-ink-mute hover:text-ink font-semibold transition"
          >
            <Icon name="ArrowLeft" size={14} />
            <span>Modül {modul.sira}'e dön</span>
          </button>

          {sonrakiAlt ? (
            <button
              onClick={() =>
                nav(`/uniteler/${unite.id}/modul/${modul.id}/alt/${sonrakiAlt.id}`)
              }
              className="bg-ink text-bg px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase inline-flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition"
            >
              Sonraki Alt Başlık
              <Icon name="ArrowRight" size={14} />
            </button>
          ) : sonrakiModulIlk && sonrakiModul ? (
            <button
              onClick={() =>
                nav(
                  `/uniteler/${unite.id}/modul/${sonrakiModul.id}/alt/${sonrakiModulIlk.id}`,
                )
              }
              className="bg-ink text-bg px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase inline-flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition"
            >
              Sonraki Modüle Geç
              <Icon name="ArrowRight" size={14} />
            </button>
          ) : null}
        </div>
      </main>

      <AIAsistanYanPanel
        acik={aiAcik}
        onKapat={() => setAiAcik(false)}
        baglam={{ soruBaslik: `${modul.baslik} — ${altBaslik.baslik}` }}
      />
    </>
  );
};
