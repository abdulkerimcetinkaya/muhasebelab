import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth, useIsPremium } from '../contexts/AuthContext';
import { useUniteler } from '../contexts/UnitelerContext';
import { ROZETLER } from '../data/rozetler';
import { supabase } from '../lib/supabase';
import type { Ilerleme, Istatistik } from '../types';

interface OdemeKayit {
  id: string;
  tutar: number;
  para_birimi: string;
  durum: string;
  basarili_tarih: string | null;
  created_at: string;
  plan_kodu: string | null;
}

interface Props {
  ilerleme: Ilerleme;
  stat: Istatistik;
  onKullaniciAdiGuncelle: (ad: string) => void;
  onSifirla: () => void;
  onDisaAktar: () => void;
  onTemaDegistir: () => void;
}

export const ProfilSayfasi = ({
  ilerleme,
  stat,
  onKullaniciAdiGuncelle,
  onSifirla,
  onDisaAktar,
  onTemaDegistir,
}: Props) => {
  const nav = useNavigate();
  const { uniteler, tumSorular } = useUniteler();
  const { user, premiumBitis } = useAuth();
  const isPremium = useIsPremium();
  const [adDuzenle, setAdDuzenle] = useState(false);
  const [geciciAd, setGeciciAd] = useState(ilerleme.kullaniciAdi);
  const [odemeler, setOdemeler] = useState<OdemeKayit[]>([]);

  useEffect(() => {
    if (!user) {
      setOdemeler([]);
      return;
    }
    let aktif = true;
    supabase
      .from('odemeler')
      .select('id, tutar, para_birimi, durum, basarili_tarih, created_at, plan_kodu')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (aktif && data) setOdemeler(data as OdemeKayit[]);
      });
    return () => {
      aktif = false;
    };
  }, [user]);

  const avatarHarfi = (ilerleme.kullaniciAdi || '?')[0].toUpperCase();
  const avatarRenk = useMemo(() => {
    const renkler = [
      'bg-blue-700',
      'bg-emerald-700',
      'bg-rose-700',
      'bg-amber-700',
      'bg-violet-700',
      'bg-teal-700',
    ];
    let hash = 0;
    const ad = ilerleme.kullaniciAdi || 'X';
    for (let i = 0; i < ad.length; i++) hash += ad.charCodeAt(i);
    return renkler[hash % renkler.length];
  }, [ilerleme.kullaniciAdi]);

  const son30Gun = useMemo(() => {
    const bugun = new Date();
    const gunler: { tarih: string; sayi: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(bugun.getTime() - i * 86400000);
      const k = d.toISOString().split('T')[0];
      gunler.push({ tarih: k, sayi: ilerleme.aktiviteTarihleri[k] || 0 });
    }
    return gunler;
  }, [ilerleme.aktiviteTarihleri]);
  const maxAkt = Math.max(1, ...son30Gun.map((g) => g.sayi));
  const kazanilanRozetSayi = Object.keys(ilerleme.kazanilanRozetler).length;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-stone-900/10 dark:border-zinc-800">
          <div
            className={`w-28 h-28 ${avatarRenk} text-white font-display text-6xl font-bold flex items-center justify-center shadow-xl flex-shrink-0 rounded-2xl`}
          >
            {avatarHarfi}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-2 font-bold">
              Kullanıcı
            </div>
            {adDuzenle ? (
              <div className="flex gap-2 items-center justify-center sm:justify-start">
                <input
                  type="text"
                  value={geciciAd}
                  onChange={(e) => setGeciciAd(e.target.value)}
                  maxLength={30}
                  className="font-display text-4xl font-bold bg-transparent border-b-2 border-stone-900 dark:border-zinc-100 outline-none px-1"
                  autoFocus
                />
                <button
                  onClick={() => {
                    onKullaniciAdiGuncelle(geciciAd || 'Öğrenci');
                    setAdDuzenle(false);
                  }}
                  className="p-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 rounded-lg"
                >
                  <Icon name="Check" size={14} />
                </button>
                <button
                  onClick={() => {
                    setGeciciAd(ilerleme.kullaniciAdi);
                    setAdDuzenle(false);
                  }}
                  className="p-2 border border-stone-300 dark:border-zinc-700 rounded-lg"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <h1 className="font-display text-4xl md:text-5xl tracking-tight font-bold">
                  {ilerleme.kullaniciAdi}
                </h1>
                <button
                  onClick={() => setAdDuzenle(true)}
                  className="text-stone-400 hover:text-stone-900 dark:hover:text-zinc-100 transition"
                  title="Adı düzenle"
                >
                  <Icon name="Pencil" size={14} />
                </button>
              </div>
            )}
            <div className="mt-2 text-sm text-stone-500 dark:text-zinc-500 font-medium">
              MuhasebeLab · {stat.cozulenSayi} soru çözüldü
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-900/10 dark:bg-zinc-700 rounded-xl overflow-hidden">
          {[
            { et: 'Çözülen', de: stat.cozulenSayi, toplam: stat.toplamSoru },
            { et: 'Puan', de: ilerleme.puan, icon: 'Trophy', renk: 'text-amber-600' },
            { et: 'Seri', de: ilerleme.streak, icon: 'Flame', renk: 'text-orange-600' },
            { et: 'Rozet', de: kazanilanRozetSayi, toplam: ROZETLER.length },
          ].map((k, i) => (
            <div key={i} className="bg-stone-50 dark:bg-zinc-900 p-5">
              <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-2 font-bold">
                {k.et}
              </div>
              <div className="font-display text-4xl font-bold flex items-center gap-2">
                {k.de}
                {k.toplam !== undefined && (
                  <span className="text-stone-400 dark:text-zinc-600 text-2xl">/{k.toplam}</span>
                )}
                {k.icon && <Icon name={k.icon} size={22} className={k.renk} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {user && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-6 border-b border-stone-900/20 dark:border-zinc-700 pb-3">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight font-bold">Üyelik</h2>
            {isPremium && (
              <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
                <Icon name="Sparkles" size={11} />
                Premium
              </span>
            )}
          </div>

          {isPremium && premiumBitis ? (
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/40 dark:to-amber-900/40 flex items-center justify-center flex-shrink-0">
                  <Icon name="BadgeCheck" size={22} className="text-amber-700 dark:text-amber-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-bold mb-1">Premium üyeliğin aktif</div>
                  <div className="text-sm text-stone-700 dark:text-zinc-300 font-medium">
                    Bitiş:{' '}
                    <span className="font-mono font-bold">
                      {new Date(premiumBitis).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 dark:text-zinc-400 font-medium mt-1">
                    Tüm AI özellikleri ve premium araçlar bu tarihe kadar açık.
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => nav('/premium')}
                  className="inline-flex items-center gap-1.5 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition"
                >
                  <Icon name="RefreshCw" size={12} />
                  Süreyi Uzat
                </button>
                <a
                  href="mailto:kerim.cetinkayaa78@gmail.com?subject=MuhasebeLab%20iade%20talebi"
                  className="inline-flex items-center gap-1.5 border border-stone-300 dark:border-zinc-700 px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:border-stone-900 dark:hover:border-zinc-400 transition"
                >
                  <Icon name="Send" size={12} />
                  İade Talebi
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Icon name="Sparkles" size={22} className="text-stone-500 dark:text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-bold mb-1">Ücretsiz hesap</div>
                  <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium leading-relaxed">
                    Tüm sorular sınırsız açık. AI asistan günde 3 sorgu.
                    <br />
                    Premium → AI yanlış analizi, sınırsız asistan, hesap kodu otomatik tamamlama.
                  </p>
                </div>
              </div>
              <button
                onClick={() => nav('/premium')}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-900 px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg transition"
              >
                <Icon name="Sparkles" size={12} />
                Premium’u Keşfet
              </button>
            </div>
          )}

          {odemeler.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-3">
                Ödeme Geçmişi
              </h3>
              <div className="rounded-xl border border-stone-200 dark:border-zinc-800 overflow-hidden">
                {odemeler.map((o, i) => {
                  const tarih = new Date(o.basarili_tarih ?? o.created_at).toLocaleDateString(
                    'tr-TR',
                    { day: 'numeric', month: 'short', year: 'numeric' },
                  );
                  const durumStil =
                    o.durum === 'basarili'
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                      : o.durum === 'beklemede'
                        ? 'text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800'
                        : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30';
                  const durumAd =
                    o.durum === 'basarili'
                      ? 'Başarılı'
                      : o.durum === 'beklemede'
                        ? 'Beklemede'
                        : o.durum === 'iade'
                          ? 'İade'
                          : 'Hata';
                  return (
                    <div
                      key={o.id}
                      className={`flex items-center justify-between px-4 py-3 text-sm ${
                        i > 0 ? 'border-t border-stone-100 dark:border-zinc-800' : ''
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-display font-bold tracking-tight">
                          {o.plan_kodu === 'donemlik'
                            ? 'Premium · Dönemlik (3 ay)'
                            : o.plan_kodu === 'aylik'
                              ? 'Premium · Aylık'
                              : 'Premium'}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium font-mono">
                          {tarih}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-mono font-bold">
                          ₺{Number(o.tutar).toFixed(2).replace('.', ',')}
                        </span>
                        <span
                          className={`text-[10px] tracking-[0.2em] uppercase font-bold px-2 py-0.5 rounded ${durumStil}`}
                        >
                          {durumAd}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6 border-b border-stone-900/20 dark:border-zinc-700 pb-3">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight font-bold">Rozetler</h2>
          <span className="text-xs tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
            {kazanilanRozetSayi}/{ROZETLER.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ROZETLER.map((r) => {
            const kazanildi = !!ilerleme.kazanilanRozetler[r.id];
            return (
              <div
                key={r.id}
                className={`p-4 border text-center transition rounded-xl ${
                  kazanildi
                    ? 'border-amber-600/40 bg-amber-50/40 dark:bg-amber-900/10 dark:border-amber-400/40'
                    : 'border-stone-200 dark:border-zinc-800 opacity-60 dark:opacity-50'
                }`}
              >
                <Icon
                  name={r.icon}
                  size={22}
                  className={`mx-auto mb-2 ${kazanildi ? 'text-amber-700 dark:text-amber-400' : 'text-stone-400 dark:text-zinc-600'}`}
                />
                <div className="font-display text-sm leading-tight mb-1 font-bold">{r.ad}</div>
                <div className="text-[10px] text-stone-500 dark:text-zinc-500 leading-tight font-medium">
                  {r.aciklama}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-6 pb-3 border-b border-stone-900/20 dark:border-zinc-700 font-bold">
          Ünite İlerlemesi
        </h2>
        <div className="space-y-4">
          {uniteler.map((u) => {
            const cozulen = u.sorular.filter((s) => ilerleme.cozulenler[s.id]).length;
            const toplam = u.sorular.length;
            const yuzde = (cozulen / toplam) * 100;
            return (
              <div key={u.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="flex items-center gap-3 text-sm">
                    <Thiings name={u.thiingsIcon} size={28} />
                    <span className="font-semibold">{u.ad}</span>
                  </span>
                  <span className="font-mono text-xs text-stone-500 dark:text-zinc-500 font-bold">
                    {cozulen}/{toplam}
                  </span>
                </div>
                <div className="h-1.5 bg-stone-200 dark:bg-zinc-800 relative overflow-hidden rounded-full">
                  <div
                    className="absolute inset-y-0 left-0 bg-stone-900 dark:bg-zinc-100 transition-all duration-700"
                    style={{ width: `${yuzde}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-6 pb-3 border-b border-stone-900/20 dark:border-zinc-700 font-bold">
          Son 30 Gün
        </h2>
        <div className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-1">
          {son30Gun.map((g, i) => {
            const yogunluk = g.sayi === 0 ? 0 : Math.min(4, Math.ceil((g.sayi / maxAkt) * 4));
            const opacity = [0.08, 0.3, 0.55, 0.8, 1][yogunluk];
            return (
              <div
                key={i}
                title={`${g.tarih}: ${g.sayi} soru`}
                className="aspect-square bg-blue-700 dark:bg-blue-400 rounded-sm"
                style={{ opacity }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-stone-500 dark:text-zinc-500 font-semibold">
          <span>30 gün önce</span>
          <span>Bugün</span>
        </div>
      </section>

      {Object.keys(ilerleme.yanlislar).length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-6 pb-3 border-b border-stone-900/20 dark:border-zinc-700 font-bold">
            En Çok Zorlanılanlar
          </h2>
          <div className="space-y-2">
            {Object.entries(ilerleme.yanlislar)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([id, sayi]) => {
                const s = tumSorular.find((x) => x.id === id);
                if (!s) return null;
                const cozulmus = !!ilerleme.cozulenler[id];
                return (
                  <button
                    key={id}
                    onClick={() => nav(`/problemler/${id}`)}
                    className="w-full flex items-center justify-between py-3 px-3 border-b border-stone-100 dark:border-zinc-800 hover:bg-stone-50 dark:hover:bg-zinc-800 transition text-sm rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Thiings name={s.uniteIcon} size={28} />
                      <span className="font-display font-bold">{s.baslik}</span>
                      {cozulmus && (
                        <Icon
                          name="CheckCircle2"
                          size={12}
                          className="text-emerald-700 dark:text-emerald-400"
                        />
                      )}
                    </div>
                    <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                      × {sayi}
                    </span>
                  </button>
                );
              })}
          </div>
        </section>
      )}

      <section className="pt-8 border-t border-stone-900/10 dark:border-zinc-800">
        <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-6 font-bold">Ayarlar</h2>
        <div className="space-y-2">
          <button
            onClick={onTemaDegistir}
            className="w-full flex items-center justify-between py-4 px-4 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 transition text-left rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Icon name={ilerleme.tema === 'dark' ? 'Moon' : 'Sun'} size={16} />
              <span className="font-semibold">
                Görünüm · {ilerleme.tema === 'dark' ? 'Karanlık' : 'Açık'}
              </span>
            </div>
            <Icon name="ChevronRight" size={14} className="text-stone-400" />
          </button>
          <button
            onClick={onDisaAktar}
            className="w-full flex items-center justify-between py-4 px-4 border border-stone-200 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 transition text-left rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Icon name="Download" size={16} />
              <span className="font-semibold">İlerlemeyi dışa aktar (JSON)</span>
            </div>
            <Icon name="ChevronRight" size={14} className="text-stone-400" />
          </button>
          <button
            onClick={onSifirla}
            className="w-full flex items-center justify-between py-4 px-4 border border-stone-200 dark:border-zinc-700 hover:border-rose-600 transition text-left group rounded-xl"
          >
            <div className="flex items-center gap-3 text-rose-700 dark:text-rose-400 group-hover:text-rose-600">
              <Icon name="Trash2" size={16} />
              <span className="font-semibold">Tüm ilerlemeyi sıfırla</span>
            </div>
            <Icon name="ChevronRight" size={14} className="text-stone-400" />
          </button>
        </div>
      </section>
    </main>
  );
};
