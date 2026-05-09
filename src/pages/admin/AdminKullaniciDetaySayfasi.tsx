import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { AdminYanMenu } from '../../components/AdminYanMenu';
import { PremiumAyarlaModal } from '../../components/PremiumAyarlaModal';
import { ModerasyonModal } from '../../components/ModerasyonModal';
import { EmailGonderModal } from '../../components/EmailGonderModal';
import { AktiviteIsiHaritasi } from '../../components/AktiviteIsiHaritasi';
import { paraFormat } from '../../lib/format';
import {
  ilerlemeSifirla,
  kullaniciDetayYukle,
  sifreSifirlamaTetikle,
  supheliPatternleriBul,
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
  basarili: 'text-success dark:text-success bg-success-soft',
  beklemede: 'text-premium-deep bg-premium-soft',
  iptal: 'text-ink-soft bg-surface-2',
  iade: 'text-brand dark:text-brand-mute bg-brand-soft',
  hata: 'text-danger dark:text-danger bg-danger-soft',
};

export const AdminKullaniciDetaySayfasi = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [detay, setDetay] = useState<KullaniciDetay | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [premiumModalAcik, setPremiumModalAcik] = useState(false);
  const [moderasyonModalAcik, setModerasyonModalAcik] = useState(false);
  const [emailModalAcik, setEmailModalAcik] = useState(false);
  const [sifreSifirlaniyor, setSifreSifirlaniyor] = useState(false);
  const [sifreOnay, setSifreOnay] = useState<string | null>(null);

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

  const supheliFlagler = useMemo(
    () => (detay ? supheliPatternleriBul(detay.cozumler) : []),
    [detay],
  );

  const ilerlemeSifirlaTiklandi = async () => {
    if (!detay) return;
    if (
      !confirm(
        `${detay.kullanici_adi} kullanıcısının çözüm geçmişi (${detay.cozumler.length} çözüm + ${detay.rozetler.length} rozet + ${detay.aktivite.length} aktivite günü) silinecek.\n\nBu işlem geri alınamaz. Devam edilsin mi?`,
      )
    ) {
      return;
    }
    try {
      await ilerlemeSifirla(detay.id);
      // Sayfayı yenile
      const yeni = await kullaniciDetayYukle(detay.id);
      setDetay(yeni);
      alert('İlerleme sıfırlandı.');
    } catch (e) {
      alert(`Sıfırlanamadı: ${(e as Error).message}`);
    }
  };

  const sifreSifirlaTiklandi = async () => {
    if (!detay?.email) {
      setSifreOnay('Bu kullanıcının email adresi yok.');
      return;
    }
    if (!confirm(`${detay.email} adresine şifre sıfırlama linki gönderilsin mi?`)) {
      return;
    }
    setSifreSifirlaniyor(true);
    setSifreOnay(null);
    try {
      await sifreSifirlamaTetikle(detay.email);
      setSifreOnay('Şifre sıfırlama linki gönderildi.');
      setTimeout(() => setSifreOnay(null), 4000);
    } catch (e) {
      setSifreOnay(`Hata: ${(e as Error).message}`);
    } finally {
      setSifreSifirlaniyor(false);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-8">
      <div className="flex gap-8">
        <AdminYanMenu />
        <main className="flex-1 min-w-0 space-y-6">
          <Link
            to="/admin/kullanicilar"
            className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.2em] uppercase font-bold text-ink-mute hover:text-ink transition"
          >
            <Icon name="ArrowLeft" size={12} />
            Tüm Kullanıcılar
          </Link>

          {yukleniyor ? (
            <div className="text-sm text-ink-quiet">Yükleniyor…</div>
          ) : hata ? (
            <div className="flex items-start gap-2 p-3 bg-danger-soft border border-danger-soft rounded-lg text-[13px] text-danger font-medium">
              <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
              <span>{hata}</span>
            </div>
          ) : detay ? (
            <>
              {/* Profil başlığı */}
              <div className="bg-surface border border-line rounded-2xl p-6">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h1 className="font-display text-2xl font-bold tracking-tight">
                      {detay.kullanici_adi}
                    </h1>
                    <div className="text-[13px] font-mono text-ink-mute mt-1">
                      {detay.email}
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-[12px]">
                      {detay.universite && (
                        <div className="min-w-[140px]">
                          <div className="text-[10px] tracking-[0.18em] uppercase text-ink-quiet mb-0.5 whitespace-nowrap">
                            Üniversite
                          </div>
                          <div className="font-medium">{detay.universite}</div>
                        </div>
                      )}
                      {detay.bolum && (
                        <div className="min-w-[120px]">
                          <div className="text-[10px] tracking-[0.18em] uppercase text-ink-quiet mb-0.5 whitespace-nowrap">
                            Bölüm
                          </div>
                          <div className="font-medium">{detay.bolum}</div>
                        </div>
                      )}
                      {detay.sinif && (
                        <div className="min-w-[80px]">
                          <div className="text-[10px] tracking-[0.18em] uppercase text-ink-quiet mb-0.5 whitespace-nowrap">
                            Sınıf
                          </div>
                          <div className="font-medium">{detay.sinif}</div>
                        </div>
                      )}
                      {detay.hedef && (
                        <div className="min-w-[100px]">
                          <div className="text-[10px] tracking-[0.18em] uppercase text-ink-quiet mb-0.5 whitespace-nowrap">
                            Hedef
                          </div>
                          <div className="font-medium">{detay.hedef}</div>
                        </div>
                      )}
                      <div className="min-w-[120px]">
                        <div className="text-[10px] tracking-[0.18em] uppercase text-ink-quiet mb-0.5 whitespace-nowrap">
                          Kayıt Tarihi
                        </div>
                        <div className="font-medium">{tarihFormat(detay.created_at)}</div>
                      </div>
                      <div className="min-w-[120px]">
                        <div className="text-[10px] tracking-[0.18em] uppercase text-ink-quiet mb-0.5 whitespace-nowrap">
                          KVKK Kabul
                        </div>
                        <div className="font-medium">{tarihFormat(detay.kvkk_kabul_tarihi)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {premiumAktif ? (
                        <div className="inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase font-mono font-bold text-success bg-success-soft border border-success-soft px-2 py-1 rounded">
                          <Icon name="Sparkles" size={11} />
                          Premium · {tarihFormat(detay.premium_bitis)} bitiyor
                        </div>
                      ) : (
                        <div className="inline-flex items-center text-[11px] tracking-wider uppercase font-mono font-bold text-ink-mute bg-surface-2 px-2 py-1 rounded">
                          Free
                        </div>
                      )}
                      {detay.banli && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase font-mono font-bold text-danger bg-danger-soft border border-danger-soft px-2 py-1 rounded">
                          <Icon name="Lock" size={11} />
                          Banlı
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => setPremiumModalAcik(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-bold border border-line-strong hover:bg-bg-tint rounded-lg transition"
                      >
                        <Icon name="Sparkles" size={11} />
                        Premium
                      </button>
                      <button
                        onClick={() => setModerasyonModalAcik(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-bold border border-line-strong hover:bg-bg-tint rounded-lg transition"
                      >
                        <Icon name="Shield" size={11} />
                        Moderasyon
                      </button>
                      <button
                        onClick={() => setEmailModalAcik(true)}
                        disabled={!detay.email}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-bold border border-line-strong hover:bg-bg-tint rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                        title={!detay.email ? 'Email adresi yok' : ''}
                      >
                        <Icon name="Send" size={11} />
                        E-posta
                      </button>
                      <button
                        onClick={sifreSifirlaTiklandi}
                        disabled={sifreSifirlaniyor || !detay.email}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-bold border border-line-strong hover:bg-bg-tint rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Icon
                          name={sifreSifirlaniyor ? 'Loader2' : 'Lock'}
                          size={11}
                          className={sifreSifirlaniyor ? 'animate-spin' : ''}
                        />
                        Şifre Sıfırla
                      </button>
                      <button
                        onClick={ilerlemeSifirlaTiklandi}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-bold border border-danger-soft text-danger dark:text-danger hover:bg-danger-soft rounded-lg transition"
                      >
                        <Icon name="RotateCcw" size={11} />
                        İlerleme Sıfırla
                      </button>
                    </div>
                    {sifreOnay && (
                      <div
                        className={`text-[11px] mt-1 ${
 sifreOnay.startsWith('Hata')
 ? 'text-danger dark:text-danger'
 : 'text-success dark:text-success'
 }`}
                      >
                        {sifreOnay}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ban bilgisi */}
              {detay.banli && (
                <div className="flex items-start gap-2 p-3 bg-danger-soft border border-danger-soft rounded-xl text-[13px] text-danger">
                  <Icon name="Lock" size={16} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold">Banlı kullanıcı</div>
                    <div className="text-[12px] mt-0.5">
                      Sebep: {detay.ban_sebep ?? '—'} ·{' '}
                      <span className="opacity-70">{tarihFormat(detay.ban_tarihi)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Şüpheli aktivite uyarıları */}
              {supheliFlagler.length > 0 && (
                <div className="bg-premium-soft border border-premium-soft rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase font-bold text-premium-deep mb-2">
                    <Icon name="AlertTriangle" size={13} />
                    Şüpheli Aktivite ({supheliFlagler.length})
                  </div>
                  <ul className="space-y-1 text-[13px] text-premium-deep dark:text-premium-soft">
                    {supheliFlagler.map((f) => (
                      <li key={f.tip} className="flex items-start gap-2">
                        <span className="font-mono text-[10px] tracking-wider uppercase font-bold mt-0.5 opacity-70">
                          {f.tip.replace('_', ' ')}
                        </span>
                        <span>{f.mesaj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* İstatistikler */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-surface border border-line rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold">
                    Çözüm
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">
                    {detay.cozumler.length}
                  </div>
                  <div className="text-[11px] text-ink-mute mt-0.5 font-mono">
                    {dogruCozumSayisi} doğru · {yanlisCozumSayisi} yanlış
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold">
                    Puan
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">{toplamPuan}</div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold">
                    Aktif Gün
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">{toplamGun}</div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold">
                    Rozet
                  </div>
                  <div className="text-2xl font-display font-bold mt-1">
                    {detay.rozetler.length}
                  </div>
                </div>
                <div className="bg-surface border border-line rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold">
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
                  <div className="text-sm text-ink-quiet text-center py-6 border border-dashed border-line-strong rounded-xl">
                    Henüz çözüm yok.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-line rounded-xl">
                    <table className="w-full text-[12.5px]">
                      <thead className="bg-bg-tint text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute">
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
                            className="border-t border-line"
                          >
                            <td className="p-2.5 text-ink-soft">
                              {tarihSaatFormat(c.created_at)}
                            </td>
                            <td className="p-2.5 font-mono text-[11px]">{c.soru_id}</td>
                            <td className="p-2.5 text-center">
                              {c.dogru_mu ? (
                                <span className="text-success dark:text-success">✓</span>
                              ) : (
                                <span className="text-danger dark:text-danger">✗</span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-mono">
                              {c.kazanilan_puan ?? '—'}
                            </td>
                            <td className="p-2.5 text-right font-mono text-ink-mute">
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
                      <div className="text-[11px] text-ink-mute p-2 text-center bg-bg-tint">
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
                  <div className="text-sm text-ink-quiet text-center py-6 border border-dashed border-line-strong rounded-xl">
                    Ödeme kaydı yok.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-line rounded-xl">
                    <table className="w-full text-[12.5px]">
                      <thead className="bg-bg-tint text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute">
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
                            className="border-t border-line"
                          >
                            <td className="p-2.5 text-ink-soft">
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
                                className={`inline-flex text-[10px] tracking-wider uppercase font-mono font-bold px-1.5 py-0.5 rounded ${ODEME_DURUM_RENKLERI[o.durum] ?? 'text-ink-mute'}`}
                              >
                                {o.durum}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-[10px] text-ink-mute">
                              {o.iyzico_ref ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Aktivite ısı haritası */}
              <section>
                <h2 className="font-display text-lg font-bold mb-3">Aktivite</h2>
                {detay.aktivite.length === 0 ? (
                  <div className="text-sm text-ink-quiet text-center py-6 border border-dashed border-line-strong rounded-xl">
                    Aktivite kaydı yok.
                  </div>
                ) : (
                  <AktiviteIsiHaritasi aktivite={detay.aktivite} haftaSayisi={26} />
                )}
              </section>
            </>
          ) : null}
        </main>
      </div>

      {detay && premiumModalAcik && (
        <PremiumAyarlaModal
          userId={detay.id}
          kullaniciAd={detay.kullanici_adi}
          mevcutBitis={detay.premium_bitis}
          premiumAktif={!!premiumAktif}
          onKapat={() => setPremiumModalAcik(false)}
          onGuncellendi={(yeniBitis) => {
            setDetay((d) => (d ? { ...d, premium_bitis: yeniBitis } : d));
          }}
        />
      )}

      {detay && moderasyonModalAcik && (
        <ModerasyonModal
          userId={detay.id}
          kullaniciAd={detay.kullanici_adi}
          banli={detay.banli}
          banSebep={detay.ban_sebep}
          onKapat={() => setModerasyonModalAcik(false)}
          onBanGuncellendi={(banli, sebep, tarih) => {
            setDetay((d) =>
              d ? { ...d, banli, ban_sebep: sebep, ban_tarihi: tarih } : d,
            );
          }}
          onSilindi={() => {
            setModerasyonModalAcik(false);
            nav('/admin/kullanicilar', { replace: true });
          }}
        />
      )}

      {detay?.email && emailModalAcik && (
        <EmailGonderModal
          to={detay.email}
          kullaniciAd={detay.kullanici_adi}
          onKapat={() => setEmailModalAcik(false)}
        />
      )}
    </div>
  );
};
