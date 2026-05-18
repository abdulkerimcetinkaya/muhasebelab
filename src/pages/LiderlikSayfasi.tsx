import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { liderlikYukle, kullaniciSiralamasi } from '../lib/liderlik';
import { supabase } from '../lib/supabase';
import type { LiderlikDonem, LiderlikRow } from '../types';

type LiderlikKapsam = 'genel' | 'okulum';

const KAPSAM_LABEL: Record<LiderlikKapsam, string> = {
  genel: 'Genel',
  okulum: 'Okulumdaki',
};

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
  const [kapsam, setKapsam] = useState<LiderlikKapsam>('genel');
  const [liste, setListe] = useState<LiderlikRow[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  // Kullanıcının okul/üniversitesi — okul filtresi için lazım.
  // undefined = henüz çekilmedi, null = boş, string = okul adı.
  const [kullaniciOkul, setKullaniciOkul] = useState<string | null | undefined>(
    undefined,
  );
  useEffect(() => {
    if (!user) {
      setKullaniciOkul(null);
      return;
    }
    let aktif = true;
    supabase
      .from('kullanicilar')
      .select('universite')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!aktif) return;
        const u = (data?.universite as string | null) ?? null;
        setKullaniciOkul(u && u.trim() ? u.trim() : null);
      });
    return () => {
      aktif = false;
    };
  }, [user]);

  // Okulum kapsamı için filtre uygulanır mı? (giriş + okul bilgisi şart)
  const okulFiltresiAktif = kapsam === 'okulum' && !!kullaniciOkul;
  // Okulum seçildi ama okul yoksa (anonim ya da profil eksik) → fetch atma, boş göster.
  const fetchIptal = kapsam === 'okulum' && !kullaniciOkul;

  useEffect(() => {
    if (fetchIptal) {
      setListe([]);
      setYukleniyor(false);
      setHata(null);
      return;
    }
    let aktif = true;
    setYukleniyor(true);
    setHata(null);
    liderlikYukle(donem, 100, okulFiltresiAktif ? kullaniciOkul : null)
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
  }, [donem, kapsam, kullaniciOkul, okulFiltresiAktif, fetchIptal]);

  const kullaniciSira = useMemo(
    () => kullaniciSiralamasi(liste, user?.id),
    [liste, user?.id],
  );

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

      {/* Filtreler: zaman + kapsam + kullanıcı rütbesi */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10 sm:mb-14 pb-5 border-b border-line">
        <div className="flex flex-wrap gap-2">
          {/* Zaman dönemi */}
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

          {/* Kapsam — Genel / Okulumdaki */}
          <div role="tablist" className="flex gap-1 p-1 bg-surface-2/60 rounded-lg">
            {(['genel', 'okulum'] as const).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={kapsam === k}
                onClick={() => setKapsam(k)}
                className={`px-4 py-1.5 text-[13px] font-mono uppercase tracking-[0.14em] rounded-md transition ${
                  kapsam === k
                    ? 'bg-bg text-ink shadow-sm'
                    : 'text-ink-mute hover:text-ink'
                }`}
              >
                {KAPSAM_LABEL[k]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {/* Okulum aktifken hangi okul filtrelenmiş — şeffaflık */}
          {okulFiltresiAktif && (
            <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-mute">
              <span className="text-ink-soft">{kullaniciOkul}</span> içinde
            </span>
          )}

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

      {/* Boş durum — okul filtresi için özel mesajlar */}
      {!yukleniyor && !hata && liste.length === 0 && (
        <div className="border border-line bg-surface-2/40 p-12 sm:p-16 text-center">
          {/* Okulum + anonim kullanıcı */}
          {kapsam === 'okulum' && !user ? (
            <>
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-copper-deep mb-4 font-bold">
                Hesap gerekli
              </div>
              <p
                className="font-display-italic text-ink leading-tight tracking-tight max-w-lg mx-auto mb-6"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
              >
                Okulundaki sıralamayı görmek için hesap aç.
              </p>
              <button onClick={() => nav('/giris')} className="btn btn-primary">
                Hesap oluştur
              </button>
            </>
          ) : kapsam === 'okulum' && !kullaniciOkul ? (
            /* Okulum + giriş yapmış ama okul bilgisi yok */
            <>
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-copper-deep mb-4 font-bold">
                Okul bilgin eksik
              </div>
              <p
                className="font-display-italic text-ink leading-tight tracking-tight max-w-lg mx-auto mb-6"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
              >
                Profiline okul/üniversite ekle, sıralamaya gir.
              </p>
              <button onClick={() => nav('/profil')} className="btn btn-primary">
                Profili düzenle →
              </button>
            </>
          ) : (
            /* Genel kapsam ya da okulum aktif + filtrelenen okulda kimse yok */
            <>
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-copper-deep mb-4 font-bold">
                Henüz veri yok
              </div>
              <p
                className="font-display-italic text-ink leading-tight tracking-tight max-w-lg mx-auto mb-6"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
              >
                {kapsam === 'okulum'
                  ? `${kullaniciOkul} için henüz sıralama yok — ilk olabilirsin.`
                  : donem === 'tum'
                    ? 'İlk sıralamayı sen başlat.'
                    : 'Bu dönem için kayıt yok — ilk olabilirsin.'}
              </p>
              <button onClick={() => nav('/problemler')} className="btn btn-primary">
                Soruları aç
              </button>
            </>
          )}
        </div>
      )}

      {/* Liderlik tablosu — tek liste, top 3 görsel olarak vurgulu */}
      {!yukleniyor && !hata && liste.length > 0 && (
        <div className="border-t border-line">
          {/* Header */}
          <div className="grid grid-cols-[44px_minmax(140px,1fr)_240px_90px_90px] gap-4 px-4 py-3 border-b border-line font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold">
            <span className="text-right">No</span>
            <span>Kullanıcı</span>
            <span className="hidden sm:block">Üniversite</span>
            <span className="text-right">Çözüm</span>
            <span className="text-right">Puan</span>
          </div>

          {/* Satırlar — top 3 sıra numarası renkli + font biraz büyük; geri kalan mono padded */}
          {liste.map((row, i) => {
            const sira = i + 1;
            const kendisi = user?.id === row.id;
            const top1 = sira === 1;
            const top2 = sira === 2;
            const top3 = sira === 3;
            const topX = top1 || top2 || top3;

            const siraRengi = top1
              ? 'var(--copper-deep)'
              : top2
                ? 'var(--ink-soft)'
                : top3
                  ? 'var(--ink-mute)'
                  : undefined;

            return (
              <div
                key={row.id}
                className={`grid grid-cols-[44px_minmax(140px,1fr)_240px_90px_90px] gap-4 px-4 ${
                  topX ? 'py-5' : 'py-4'
                } border-b border-line-soft items-center transition ${
                  kendisi ? 'bg-surface-2/60' : 'hover:bg-surface-2/30'
                }`}
              >
                {/* Sıra — top 3 için display font + renk, diğerleri mono padded */}
                {topX ? (
                  <span
                    className={`font-display font-bold tnum text-right leading-none ${
                      top1 ? 'text-[24px]' : 'text-[19px]'
                    }`}
                    style={{ color: siraRengi }}
                  >
                    {sira}
                  </span>
                ) : (
                  <span className="font-mono text-[13px] tnum text-ink-quiet text-right">
                    {String(sira).padStart(2, '0')}
                  </span>
                )}

                {/* Kullanıcı adı + rozetler */}
                <div className="min-w-0 flex items-baseline gap-3">
                  <span
                    className={`font-display font-bold text-ink truncate ${
                      top1
                        ? 'text-[17px] sm:text-[18px]'
                        : 'text-[15px] sm:text-[16px]'
                    }`}
                  >
                    {row.kullaniciAdi}
                  </span>
                  {kendisi && (
                    <span
                      className="font-mono text-[9.5px] tracking-[0.18em] uppercase font-bold flex-shrink-0"
                      style={{ color: 'var(--copper-deep)' }}
                    >
                      Sen
                    </span>
                  )}
                  {row.rozetSayisi > 0 && (
                    <span className="font-mono text-[10.5px] text-ink-mute tnum hidden md:inline">
                      · {row.rozetSayisi} rozet
                    </span>
                  )}
                </div>

                {/* Üniversite */}
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

                {/* Çözüm + Puan */}
                <span className="text-right font-mono tnum text-[14px] text-ink-soft">
                  {row.cozulenSoru}
                </span>
                <span
                  className={`text-right font-mono tnum font-bold text-ink ${
                    top1 ? 'text-[17px]' : topX ? 'text-[16px]' : 'text-[15px]'
                  }`}
                >
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

