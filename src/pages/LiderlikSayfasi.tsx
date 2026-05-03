import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { liderlikYukle, kullaniciSiralamasi } from '../lib/liderlik';
import type { LiderlikDonem, LiderlikRow } from '../types';

const SINIF_LABEL: Record<string, string> = {
  '1': '1. Sınıf',
  '2': '2. Sınıf',
  '3': '3. Sınıf',
  '4': '4. Sınıf',
  mezun: 'Mezun',
  diger: '—',
};

const DONEM_LABEL: Record<LiderlikDonem, string> = {
  tum: 'Tüm zamanlar',
  ay: 'Bu ay',
  hafta: 'Bu hafta',
};

export const LiderlikSayfasi = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [donem, setDonem] = useState<LiderlikDonem>('tum');
  const [liste, setListe] = useState<LiderlikRow[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let aktif = true;
    setYukleniyor(true);
    setHata(null);
    liderlikYukle(donem, 100)
      .then((rows) => {
        if (aktif) setListe(rows);
      })
      .catch((e: Error) => {
        if (aktif) setHata(e.message);
      })
      .finally(() => {
        if (aktif) setYukleniyor(false);
      });
    return () => {
      aktif = false;
    };
  }, [donem]);

  const kullaniciSira = useMemo(
    () => kullaniciSiralamasi(liste, user?.id),
    [liste, user?.id],
  );

  const top3 = liste.slice(0, 3);
  const kalan = liste.slice(3);

  return (
    <main className="max-w-[1240px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
      {/* Başlık */}
      <header className="mb-12 sm:mb-16">
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute mb-5 flex items-center gap-3">
          <span>§ 00 · Liderlik</span>
          <span className="h-px flex-1 bg-line-strong/40" style={{ maxWidth: 80 }} />
        </div>
        <h1
          className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-5"
          style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}
        >
          Liderlik
        </h1>
        <p className="text-[16px] sm:text-[17px] text-ink-soft max-w-md leading-relaxed">
          <span className="font-display-italic" style={{ color: 'var(--copper-deep)' }}>
            Çözen kazanır.
          </span>{' '}
          Soru başına puan biriktir, sıralamaya katıl.
        </p>
      </header>

      {/* Filtre + kullanıcı rütbesi */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10 sm:mb-14 pb-5 border-b border-line">
        <div role="tablist" className="flex gap-1 p-1 bg-surface-2/60 rounded-lg">
          {(['tum', 'ay', 'hafta'] as const).map((d) => (
            <button
              key={d}
              role="tab"
              aria-selected={donem === d}
              onClick={() => setDonem(d)}
              className={`px-4 py-1.5 text-[13px] font-mono uppercase tracking-[0.14em] rounded-md transition ${
                donem === d
                  ? 'bg-bg text-ink shadow-sm'
                  : 'text-ink-mute hover:text-ink'
              }`}
            >
              {DONEM_LABEL[d]}
            </button>
          ))}
        </div>

        {user && kullaniciSira && (
          <div className="flex items-baseline gap-3 text-[13px]">
            <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-mute">
              Senin sıran
            </span>
            <span className="font-display font-bold text-ink text-[20px] tnum">
              #{kullaniciSira.sira}
            </span>
            <span className="font-mono tnum text-ink-soft">
              {kullaniciSira.row.toplamPuan}p
            </span>
          </div>
        )}

        {user && !kullaniciSira && !yukleniyor && liste.length > 0 && (
          <div className="flex items-baseline gap-3 text-[13px]">
            <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-mute">
              Henüz sıralamada değilsin
            </span>
            <button
              onClick={() => nav('/problemler')}
              className="font-mono text-[11px] tracking-[0.16em] uppercase font-bold ml-link"
              style={{ color: 'var(--copper-deep)' }}
            >
              Soru çöz →
            </button>
          </div>
        )}
      </div>

      {/* Yükleniyor */}
      {yukleniyor && (
        <div className="flex items-center justify-center py-24">
          <Icon name="Loader2" size={20} className="animate-spin text-ink-mute" />
        </div>
      )}

      {/* Hata */}
      {!yukleniyor && hata && (
        <div className="border border-line bg-surface-2/40 p-8 text-center">
          <p className="text-ink-soft text-[14px]">
            Liderlik yüklenemedi.{' '}
            <span className="font-mono text-[12px] text-ink-mute">{hata}</span>
          </p>
        </div>
      )}

      {/* Boş durum */}
      {!yukleniyor && !hata && liste.length === 0 && (
        <div className="border border-line bg-surface-2/40 p-12 sm:p-16 text-center">
          <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-copper-deep mb-4 font-bold">
            Henüz veri yok
          </div>
          <p
            className="font-display-italic text-ink leading-tight tracking-tight max-w-lg mx-auto mb-6"
            style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
          >
            {donem === 'tum'
              ? 'İlk sıralamayı sen başlat.'
              : 'Bu dönem için kayıt yok — ilk olabilirsin.'}
          </p>
          <button onClick={() => nav('/problemler')} className="btn btn-primary">
            Soruları aç
          </button>
        </div>
      )}

      {/* TOP 3 — büyük editorial kart */}
      {!yukleniyor && !hata && top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {top3.map((row, i) => (
            <Top3Kart key={row.id} row={row} sira={i + 1} kendisiMi={user?.id === row.id} />
          ))}
        </div>
      )}

      {/* 4–100 sıralı tablo */}
      {!yukleniyor && !hata && kalan.length > 0 && (
        <div className="border-t border-line">
          {/* Header */}
          <div className="grid grid-cols-[44px_1fr_140px_90px_90px] gap-4 px-4 py-3 border-b border-line font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
            <span className="text-right">No</span>
            <span>Kullanıcı</span>
            <span className="hidden sm:block">Üniversite</span>
            <span className="text-right">Çözüm</span>
            <span className="text-right">Puan</span>
          </div>

          {/* Satırlar */}
          {kalan.map((row, i) => {
            const sira = i + 4;
            const kendisi = user?.id === row.id;
            return (
              <div
                key={row.id}
                className={`grid grid-cols-[44px_1fr_140px_90px_90px] gap-4 px-4 py-4 border-b border-line-soft items-center transition ${
                  kendisi ? 'bg-surface-2/60' : 'hover:bg-surface-2/30'
                }`}
              >
                <span className="font-mono text-[14px] tnum text-ink-quiet text-right">
                  {String(sira).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex items-baseline gap-3">
                  <span className="font-display font-bold text-ink text-[15px] sm:text-[16px] truncate">
                    {row.kullaniciAdi}
                  </span>
                  {kendisi && (
                    <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase font-bold flex-shrink-0" style={{ color: 'var(--copper-deep)' }}>
                      Sen
                    </span>
                  )}
                  {row.rozetSayisi > 0 && (
                    <span className="font-mono text-[10.5px] text-ink-mute tnum hidden md:inline">
                      · {row.rozetSayisi} rozet
                    </span>
                  )}
                </div>
                <div className="hidden sm:block min-w-0">
                  {row.universite ? (
                    <div className="text-[12.5px] truncate">
                      <span className="text-ink">{row.universite}</span>
                      {row.sinif && SINIF_LABEL[row.sinif] && (
                        <span className="text-ink-mute font-mono ml-1.5">
                          · {SINIF_LABEL[row.sinif]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-ink-quiet text-[12.5px]">—</span>
                  )}
                </div>
                <span className="text-right font-mono tnum text-[14px] text-ink-soft">
                  {row.cozulenSoru}
                </span>
                <span className="text-right font-mono tnum text-[15px] font-bold text-ink">
                  {row.toplamPuan}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Liste sonu CTA — kullanıcı top 100'de değilse */}
      {!yukleniyor &&
        !hata &&
        liste.length > 0 &&
        user &&
        !kullaniciSira && (
          <div className="mt-10 p-6 border border-line bg-surface-2/40 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-mute mb-1.5">
                Sen
              </div>
              <p className="text-[14px] text-ink-soft leading-snug">
                İlk 100 listede yer almak için soru çözmeye devam et.
              </p>
            </div>
            <button onClick={() => nav('/problemler')} className="btn btn-primary">
              Soru çöz →
            </button>
          </div>
        )}

      {/* Anonim kullanıcı için CTA */}
      {!yukleniyor && !hata && !user && (
        <div className="mt-10 p-6 border border-line bg-surface-2/40 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-copper-deep mb-1.5 font-bold">
              Sıralamaya katıl
            </div>
            <p className="text-[14px] text-ink-soft leading-snug max-w-md">
              Hesap aç, soru çöz — puanın anında listeye girer.
            </p>
          </div>
          <button onClick={() => nav('/giris')} className="btn btn-primary">
            Hesap oluştur
          </button>
        </div>
      )}

      {/* Açıklama notu */}
      <p className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-quiet mt-12 max-w-md">
        * Puan: kolay 5p · orta 10p · zor 20p. İlk doğru çözüm sayılır.
      </p>
    </main>
  );
};

interface Top3Props {
  row: LiderlikRow;
  sira: number;
  kendisiMi: boolean;
}

const Top3Kart = ({ row, sira, kendisiMi }: Top3Props) => {
  const renkler: Record<number, { kenar: string; sira: string; bg: string }> = {
    1: {
      kenar: 'var(--copper-deep)',
      sira: 'var(--copper-deep)',
      bg: 'rgba(184, 115, 43, 0.06)',
    },
    2: {
      kenar: 'var(--ink-soft)',
      sira: 'var(--ink-soft)',
      bg: 'transparent',
    },
    3: {
      kenar: 'var(--ink-mute)',
      sira: 'var(--ink-mute)',
      bg: 'transparent',
    },
  };
  const renk = renkler[sira];

  return (
    <article
      className="relative border-2 p-6 sm:p-7 transition-shadow hover:shadow-md"
      style={{
        borderColor: kendisiMi ? 'var(--copper-deep)' : renk.kenar,
        background: renk.bg,
      }}
    >
      <div className="flex items-baseline justify-between mb-6">
        <div
          className="font-display font-bold tracking-tighter leading-none tnum"
          style={{
            fontSize: 'clamp(56px, 8vw, 88px)',
            color: renk.sira,
          }}
        >
          {sira}
        </div>
        {sira === 1 && (
          <Icon name="Award" size={28} style={{ color: 'var(--copper-deep)' }} />
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1.5">
          <h3 className="font-display font-bold text-ink text-[20px] sm:text-[22px] tracking-tight truncate">
            {row.kullaniciAdi}
          </h3>
          {kendisiMi && (
            <span
              className="font-mono text-[9.5px] tracking-[0.18em] uppercase font-bold flex-shrink-0"
              style={{ color: 'var(--copper-deep)' }}
            >
              Sen
            </span>
          )}
        </div>
        {row.universite && (
          <div className="text-[12.5px] text-ink-soft truncate">
            {row.universite}
            {row.sinif && SINIF_LABEL[row.sinif] && (
              <span className="text-ink-mute font-mono"> · {SINIF_LABEL[row.sinif]}</span>
            )}
          </div>
        )}
      </div>

      <div className="hairline mb-4" />

      <div className="grid grid-cols-3 gap-2 text-[12px]">
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-mute mb-1">
            Puan
          </div>
          <div className="font-display font-bold text-ink tnum text-[20px] leading-none">
            {row.toplamPuan}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-mute mb-1">
            Çözüm
          </div>
          <div className="font-display font-bold text-ink tnum text-[20px] leading-none">
            {row.cozulenSoru}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-mute mb-1">
            Rozet
          </div>
          <div className="font-display font-bold text-ink tnum text-[20px] leading-none">
            {row.rozetSayisi}
          </div>
        </div>
      </div>
    </article>
  );
};
