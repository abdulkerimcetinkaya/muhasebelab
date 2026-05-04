import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { AdminYanMenu } from '../../components/AdminYanMenu';
import { paraFormat } from '../../lib/format';
import {
  kullaniciDetayYukle,
  type KullaniciDetay,
} from '../../lib/admin-kullanicilar';

const tarihFormat = (s: string | null): string => {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const tarihSaatFormat = (s: string | null): string => {
  if (!s) return '—';
  return new Date(s).toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ODEME_DURUM_RENKLERI: Record<string, string> = {
  basarili: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
  beklemede: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
  iptal: 'text-stone-600 dark:text-zinc-500 bg-stone-100 dark:bg-zinc-800',
  iade: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  hata: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
};

export const AdminKullaniciDetaySayfasi = () => {
  const { id } = useParams<{ id: string }>();
  const [detay, setDetay] = useState<KullaniciDetay | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setYukleniyor(true);
    setHata(null);
    kullaniciDetayYukle(id)
      .then((d) => {
        if (!d) {
          setHata('Kullanıcı bulunamadı.');
        } else {
          setDetay(d);
        }
      })
      .catch((e) => setHata(`Yüklenemedi: ${(e as Error).message}`))
      .finally(() => setYukleniyor(false));
  }, [id]);

  const premiumAktif =
    detay?.premium_bitis && new Date(detay.premium_bitis) > new Date();

  const dogruCozumSayisi = detay?.cozumler.filter((c) => c.dogru_mu).length ?? 0;
  const yanlisCozumSayisi = (detay?.cozumler.length ?? 0) - dogruCozumSayisi;
  const toplamPuan = detay?.cozumler.reduce(
    (acc, c) => acc + (c.kazanilan_puan ?? 0),
    0,
  ) ?? 0;
  const toplamGun = detay?.aktivite.length ?? 0;
  const toplamOdeme = detay?.odemeler
    .filter((o) => o.durum === 'basarili')
    .reduce((acc, o) => acc + Number(o.tutar), 0) ?? 0;

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-8">
      <div className="flex gap-8">
        <AdminYanMenu />
        <main className="flex-1 min-w-0 space-y-6">
          <Link
            to="/admin/kullanicilar"
            className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 transition"
          >
            <Icon name="ArrowLeft" size={12} />
            Tüm Kullanıcılar
          </Link>

          {yukleniyor ? (
            <div className="text-sm text-stone-400 dark:text-zinc-600">Yükleniyor…</div>
          ) : hata ? (
            <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-[13px] text-rose-800 dark:text-rose-300 font-medium">
              <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
              <span>{hata}</span>
            </div>
          ) : detay ? (
            <>
              {/* Profil başlığı */}
              <div className="bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-2xl p-6">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h1 className="font-display text-2xl font-bold tracking-tight">
                      {detay.kullanici_adi}
                    </h1>
                    <div className="text-[13px] font-mono text-stone-500 dark:text-zinc-500 mt-1">
                      {detay.email}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-[12px]">
                      {detay.universite && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600">
                            Üniversite
                          </div>
                          <div className="font-medium">{detay.universite}</div>
                        </div>
                      )}
                      {detay.bolum && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600">
                            Bölüm
                          </div>
                          <div className="font-medium">{detay.bolum}</div>
                        </div>
                      )}
                      {detay.sinif && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600">
                            Sınıf
                          </div>
                          <div className="font-medium">{detay.sinif}</div>
                        </div>
                      )}
                      {detay.hedef && (
                        <div>
                          <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600">
                            Hedef
                          </div>
                          <div className="font-medium">{detay.hedef}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600">
                          Kayıt Tarihi
                        </div>
                        <div className="font-medium">{tarihFormat(detay.created_at)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600">
                          KVKK Kabul
                        </div>
                        <div className="font-medium">{tarihFormat(detay.kvkk_kabul_tarihi)}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {premiumAktif ? (
                      <div className="inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 px-2 py-1 rounded">
                        <Icon name="Sparkles" size={11} />
                        Premium · {tarihFormat(detay.premium_bitis)} bitiyor
                      </div>
                    ) : (
                      <div className="inline-flex items-center text-[11px] tracking-wider uppercase font-mono font-bold text-stone-500 dark:text-zinc-500 bg-stone-100 dark:bg-zinc-800 px-2 py-1 rounded">
                        Free
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                    Çözüm
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">
                    {detay.cozumler.length}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-zinc-500 mt-0.5 font-mono">
                    {dogruCozumSayisi} doğru · {yanlisCozumSayisi} yanlış
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                    Puan
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">{toplamPuan}</div>
                </div>
                <div className="bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                    Aktif Gün
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">{toplamGun}</div>
                </div>
                <div className="bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                    Rozet
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">
                    {detay.rozetler.length}
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                    Toplam Ödeme
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">
                    {paraFormat(toplamOdeme)} ₺
                  </div>
                </div>
              </div>

              {/* Son çözümler */}
              <section>
                <h2 className="font-display text-lg font-bold mb-3">
                  Son Çözümler ({detay.cozumler.length})
                </h2>
                {detay.cozumler.length === 0 ? (
                  <div className="text-sm text-stone-400 dark:text-zinc-600 text-center py-6 border border-dashed border-stone-300 dark:border-zinc-700 rounded-xl">
                    Henüz çözüm yok.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-stone-200 dark:border-zinc-700 rounded-xl">
                    <table className="w-full text-[12.5px]">
                      <thead className="bg-stone-50 dark:bg-zinc-800/50 text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                        <tr>
                          <th className="text-left p-2.5">Tarih</th>
                          <th className="text-left p-2.5">Soru ID</th>
                          <th className="text-center p-2.5">Sonuç</th>
                          <th className="text-right p-2.5">Puan</th>
                          <th className="text-right p-2.5">Süre</th>
                          <th className="text-center p-2.5">AI?</th>
                          <th className="text-center p-2.5">Çöz?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detay.cozumler.slice(0, 50).map((c) => (
                          <tr
                            key={c.id}
                            className="border-t border-stone-200 dark:border-zinc-700"
                          >
                            <td className="p-2.5 text-stone-600 dark:text-zinc-400">
                              {tarihSaatFormat(c.created_at)}
                            </td>
                            <td className="p-2.5 font-mono text-[11px]">{c.soru_id}</td>
                            <td className="p-2.5 text-center">
                              {c.dogru_mu ? (
                                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                              ) : (
                                <span className="text-rose-600 dark:text-rose-400">✗</span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-mono">
                              {c.kazanilan_puan ?? '—'}
                            </td>
                            <td className="p-2.5 text-right font-mono text-stone-500">
                              {c.sure_saniye ? `${c.sure_saniye}s` : '—'}
                            </td>
                            <td className="p-2.5 text-center text-[11px]">
                              {c.kullanilan_ai ? '✓' : ''}
                            </td>
                            <td className="p-2.5 text-center text-[11px]">
                              {c.cozum_gosterildi ? '✓' : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {detay.cozumler.length > 50 && (
                      <div className="text-[11px] text-stone-500 dark:text-zinc-500 p-2 text-center bg-stone-50 dark:bg-zinc-800/30">
                        Son 50 çözüm gösteriliyor (toplam {detay.cozumler.length})
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Ödemeler */}
              <section>
                <h2 className="font-display text-lg font-bold mb-3">
                  Ödemeler ({detay.odemeler.length})
                </h2>
                {detay.odemeler.length === 0 ? (
                  <div className="text-sm text-stone-400 dark:text-zinc-600 text-center py-6 border border-dashed border-stone-300 dark:border-zinc-700 rounded-xl">
                    Ödeme kaydı yok.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-stone-200 dark:border-zinc-700 rounded-xl">
                    <table className="w-full text-[12.5px]">
                      <thead className="bg-stone-50 dark:bg-zinc-800/50 text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                        <tr>
                          <th className="text-left p-2.5">Tarih</th>
                          <th className="text-left p-2.5">Plan</th>
                          <th className="text-right p-2.5">Tutar</th>
                          <th className="text-center p-2.5">Durum</th>
                          <th className="text-left p-2.5">İyzico Ref</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detay.odemeler.map((o) => (
                          <tr
                            key={o.id}
                            className="border-t border-stone-200 dark:border-zinc-700"
                          >
                            <td className="p-2.5 text-stone-600 dark:text-zinc-400">
                              {tarihFormat(o.created_at)}
                            </td>
                            <td className="p-2.5 font-mono text-[11px]">
                              {o.plan_kodu ?? o.donem}
                            </td>
                            <td className="p-2.5 text-right font-mono">
                              {paraFormat(Number(o.tutar))} {o.para_birimi}
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`inline-flex text-[10px] tracking-wider uppercase font-mono font-bold px-1.5 py-0.5 rounded ${ODEME_DURUM_RENKLERI[o.durum] ?? 'text-stone-500'}`}
                              >
                                {o.durum}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-[10px] text-stone-500">
                              {o.iyzico_ref ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Aktivite */}
              <section>
                <h2 className="font-display text-lg font-bold mb-3">
                  Son Aktivite ({detay.aktivite.length} gün)
                </h2>
                {detay.aktivite.length === 0 ? (
                  <div className="text-sm text-stone-400 dark:text-zinc-600 text-center py-6 border border-dashed border-stone-300 dark:border-zinc-700 rounded-xl">
                    Aktivite kaydı yok.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {detay.aktivite.slice(0, 30).map((a) => (
                      <div
                        key={a.tarih}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded text-[11px] font-mono"
                        title={`${a.cozulen_sayi} soru çözüldü`}
                      >
                        {tarihFormat(a.tarih)}
                        <span className="font-bold">{a.cozulen_sayi}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};
