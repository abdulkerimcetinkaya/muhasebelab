import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth, useIsPremium } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { odemeBaslat, planlariYukle, type Plan } from '../lib/odeme';

const KURUM_EMAIL = 'kurum@muhasebelab.com';

interface Ozellik {
  ad: string;
  aciklama: string;
  icon: string;
  ucretsiz: boolean;
  yakinda?: boolean;
}

const KARSILASTIRMA: Ozellik[] = [
  {
    ad: 'Tüm soruları çözme',
    aciklama: '213 soru · 15 ünite — sınırsız erişim',
    icon: 'CheckCircle2',
    ucretsiz: true,
  },
  {
    ad: 'Hesap planı + sözlük',
    aciklama: '272 hesaplı TDHP, 20 mali terim',
    icon: 'BookOpen',
    ucretsiz: true,
  },
  {
    ad: 'Puan, streak ve rozet',
    aciklama: 'Günlük seri, başarı rozetleri, liderlik',
    icon: 'Trophy',
    ucretsiz: true,
  },
  {
    ad: 'AI Yanlış Analizi',
    aciklama: 'Hatanı satır satır AI sana açıklasın',
    icon: 'Sparkles',
    ucretsiz: false,
  },
  {
    ad: 'AI Muhasebe Asistanı',
    aciklama: 'Soru çözerken yan panelden konuyu sor',
    icon: 'MessagesSquare',
    ucretsiz: false,
  },
  {
    ad: 'Hesap Kodu Otomatik Tamamlama',
    aciklama: 'Kod yazarken TDHP önerileri',
    icon: 'Wand2',
    ucretsiz: false,
  },
  {
    ad: 'Adım Adım Çözüm Anlatımı',
    aciklama: '"Neden bu hesap?" pedagojik açıklama',
    icon: 'BookMarked',
    ucretsiz: false,
    yakinda: true,
  },
  {
    ad: 'Sınav Modu',
    aciklama: 'Zamanlı simülasyon + performans raporu',
    icon: 'Timer',
    ucretsiz: false,
    yakinda: true,
  },
  {
    ad: 'PDF Çözüm Defteri',
    aciklama: 'Profesyonel formatta indir',
    icon: 'FileDown',
    ucretsiz: false,
    yakinda: true,
  },
  {
    ad: 'Detaylı İlerleme Raporu',
    aciklama: 'Haftalık özet + zayıf konu önerisi',
    icon: 'LineChart',
    ucretsiz: false,
    yakinda: true,
  },
];

const SSS: { soru: string; cevap: string }[] = [
  {
    soru: 'Ücretsiz hesapla nereye kadar gidebilirim?',
    cevap:
      'Tüm soruları sınırsız çözebilir, üniteleri tamamlayabilir, puan ve rozet kazanabilirsin. Premium sadece AI rehberliği ve ileri seviye araçları açar — ücretsiz tarafta hiçbir soru kilitli değil.',
  },
  {
    soru: 'Premium\'u istediğim zaman iptal edebilir miyim?',
    cevap:
      'Evet. Profil > Premium ekranından iptal edebilirsin. İptal sonrası mevcut dönemin sonuna kadar Premium özellikler açık kalır, otomatik yenilenmez.',
  },
  {
    soru: 'Fatura kesiliyor mu?',
    cevap:
      'Evet, ödeme sonrası e-arşiv fatura email adresine gönderilir. Tutarlar KDV dahildir. Kurumsal müşteriler için e-fatura kesilebilir.',
  },
  {
    soru: 'İade alabilir miyim?',
    cevap:
      'İlk 7 gün koşulsuz iade hakkın var (Mesafeli Satış Sözleşmesi gereği). Bu süre içinde profil sayfasından iade talebi açabilirsin.',
  },
  {
    soru: 'Sınıfım/kurumum için toplu lisans nasıl alırım?',
    cevap:
      `30+ öğrenci için özel fiyatlandırma + e-fatura + öğretmen yönetim paneli sunuyoruz. ${KURUM_EMAIL} adresine yazın, 1 iş günü içinde dönüş yapalım.`,
  },
  {
    soru: 'Hangi ödeme yöntemleri kabul ediliyor?',
    cevap:
      'iyzico altyapısı üzerinden tüm Türk bankalarının kredi/banka kartlarını kabul ediyoruz. Kart bilgileriniz MuhasebeLab’a iletilmez, doğrudan iyzico\'da işlenir.',
  },
];

export const PremiumSayfasi = () => {
  const nav = useNavigate();
  const { user, premiumBitis, premiumYenile, yukleniyor } = useAuth();
  const isPremium = useIsPremium();
  const [yukleniyorAktivasyon, setYukleniyorAktivasyon] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [erkenKontenjanKalan, setErkenKontenjanKalan] = useState<number | null>(null);
  const [planlar, setPlanlar] = useState<Plan[]>([]);
  const [secilenPlan, setSecilenPlan] = useState<string | null>(null);
  const [acikSoru, setAcikSoru] = useState<number | null>(null);
  const [kurumKisi, setKurumKisi] = useState<number>(30);
  const [kurumPeriod, setKurumPeriod] = useState<'aylik' | 'yillik'>('yillik');

  useEffect(() => {
    if (!yukleniyor && !user) nav('/giris', { replace: true });
  }, [user, yukleniyor, nav]);

  useEffect(() => {
    let aktif = true;
    supabase.rpc('premium_kontenjan_kalan').then(({ data, error }) => {
      if (!aktif) return;
      if (error || data == null) return;
      setErkenKontenjanKalan(data as number);
    });
    return () => {
      aktif = false;
    };
  }, []);

  useEffect(() => {
    let aktif = true;
    planlariYukle()
      .then((p) => {
        if (aktif) setPlanlar(p);
      })
      .catch(() => {
        // Sessiz geç
      });
    return () => {
      aktif = false;
    };
  }, []);

  const planSatinAl = async (kod: string) => {
    if (!user) {
      nav('/giris');
      return;
    }
    setSecilenPlan(kod);
    setHata(null);
    try {
      const yanit = await odemeBaslat(kod);
      window.location.assign(yanit.paymentPageUrl);
    } catch (e) {
      setHata((e as Error).message);
      setSecilenPlan(null);
    }
  };

  const erkenAktivasyon = async () => {
    if (!user) return;
    setYukleniyorAktivasyon(true);
    setHata(null);
    try {
      const { error } = await supabase.rpc('premium_erken_erisim_aktive');
      if (error) {
        if (error.code === 'P0001') {
          setHata('Erken erişim kontenjanı doldu. Aşağıdaki planlardan birini seçebilirsin.');
          setErkenKontenjanKalan(0);
        } else if (error.code === 'P0002') {
          setHata('Premium üyeliğin zaten aktif.');
        } else {
          setHata(error.message);
        }
        return;
      }
      await premiumYenile();
      setErkenKontenjanKalan((p) => (p === null ? null : Math.max(0, p - 1)));
    } finally {
      setYukleniyorAktivasyon(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-5 text-[10px] tracking-[0.3em] uppercase font-bold text-amber-700 dark:text-amber-400">
          <Icon name="Sparkles" size={12} />
          MuhasebeLab Premium
        </div>
        <h1 className="font-display text-4xl md:text-6xl tracking-tight font-bold mb-5 leading-[1.05]">
          Yapay zekayla
          <br />
          <span
            className="font-serif italic"
            style={{ color: 'var(--copper, #b87333)' }}
          >
            daha hızlı öğren
          </span>
        </h1>
        <p className="text-base md:text-lg text-stone-600 dark:text-zinc-400 leading-relaxed font-medium max-w-2xl mx-auto">
          Tüm soruları zaten ücretsiz çözebilirsin. Premium, takıldığın yerde
          rehberlik eden AI özellikleri ve ileri seviye araçlar açar.
        </p>
      </div>

      {/* ─── İSTATİSTİK ŞERİDİ ─────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-14 text-[12px] sm:text-[13px] font-mono text-stone-500 dark:text-zinc-500 uppercase tracking-[0.15em]">
        <span className="flex items-center gap-1.5">
          <span className="font-display text-base font-bold text-stone-900 dark:text-zinc-100 normal-case tracking-tight">
            213
          </span>
          soru
        </span>
        <span className="opacity-30">·</span>
        <span className="flex items-center gap-1.5">
          <span className="font-display text-base font-bold text-stone-900 dark:text-zinc-100 normal-case tracking-tight">
            15
          </span>
          ünite
        </span>
        <span className="opacity-30">·</span>
        <span className="flex items-center gap-1.5">
          <span className="font-display text-base font-bold text-stone-900 dark:text-zinc-100 normal-case tracking-tight">
            272
          </span>
          hesap planı
        </span>
        <span className="opacity-30">·</span>
        <span className="flex items-center gap-1.5">
          <span className="font-display text-base font-bold text-stone-900 dark:text-zinc-100 normal-case tracking-tight">
            20
          </span>
          mali terim
        </span>
      </div>

      {/* ─── PREMIUM AKTİF BANNERı ────────────────────────────────── */}
      {isPremium && premiumBitis && (
        <div className="mb-12 p-5 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950/30 border border-amber-300/60 dark:border-amber-700/40 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Icon name="BadgeCheck" size={18} className="text-amber-700 dark:text-amber-300" />
            <span className="font-display text-lg font-bold text-amber-900 dark:text-amber-100">
              Premium üyeliğin aktif
            </span>
          </div>
          <div className="text-sm text-amber-800 dark:text-amber-200/80 font-medium">
            Bitiş: {new Date(premiumBitis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      )}

      {/* ─── KARŞILAŞTIRMA TABLOSU ────────────────────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-2">
            Ücretsiz vs Premium
          </div>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight font-bold">
            Ne ücretsiz, ne Premium’da?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ÜCRETSİZ kolonu */}
          <div className="rounded-2xl border-2 border-stone-200 dark:border-zinc-800 bg-stone-50/50 dark:bg-zinc-900/30 p-6 md:p-7">
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="font-display text-xl font-bold tracking-tight">Ücretsiz</h3>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                Daima ücretsiz
              </span>
            </div>
            <div className="space-y-3">
              {KARSILASTIRMA.filter((o) => o.ucretsiz).map((o) => (
                <div key={o.ad} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Check" size={13} className="text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-tight">{o.ad}</div>
                    <div className="text-[12.5px] text-stone-600 dark:text-zinc-400 font-medium leading-relaxed">
                      {o.aciklama}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PREMIUM kolonu */}
          <div className="rounded-2xl border-2 border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-zinc-900/30 p-6 md:p-7 shadow-lg shadow-amber-200/30 dark:shadow-amber-900/10">
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
                <Icon name="Sparkles" size={16} className="text-amber-700 dark:text-amber-400" />
                Premium
              </h3>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 dark:text-amber-400">
                Tüm ücretsiz +
              </span>
            </div>
            <div className="space-y-3">
              {KARSILASTIRMA.filter((o) => !o.ucretsiz).map((o) => (
                <div key={o.ad} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={o.icon} size={13} className="text-amber-700 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-sm font-semibold tracking-tight">{o.ad}</div>
                      {o.yakinda && (
                        <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 bg-stone-200/60 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          Yakında
                        </span>
                      )}
                    </div>
                    <div className="text-[12.5px] text-stone-600 dark:text-zinc-400 font-medium leading-relaxed">
                      {o.aciklama}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ERKEN ERİŞİM ─────────────────────────────────────────── */}
      {!isPremium && erkenKontenjanKalan !== null && erkenKontenjanKalan > 0 && (
        <section className="mb-16">
          <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-stone-900 to-stone-800 dark:from-zinc-100 dark:to-white text-stone-50 dark:text-zinc-900 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[10px] tracking-[0.3em] uppercase font-bold opacity-40 font-mono">
              {erkenKontenjanKalan} / 100
            </div>

            <div className="inline-flex items-center gap-2 mb-4 text-[10px] tracking-[0.3em] uppercase font-bold opacity-70">
              <Thiings name="rocket" size={20} />
              Erken Erişim
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-3">
              İlk 100 kullanıcıya
              <br />
              <span className="opacity-80">1 yıl ücretsiz</span>
            </h2>
            <p className="text-base opacity-80 font-medium mb-7 max-w-xl mx-auto leading-relaxed">
              Beta dönemi süresince geri bildirim karşılığında premium
              özelliklerin tamamı ücretsiz. Kart bilgisi istemiyoruz.
            </p>

            <button
              onClick={erkenAktivasyon}
              disabled={yukleniyorAktivasyon}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 px-8 py-3.5 text-sm tracking-wide uppercase font-bold rounded-xl shadow-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="Sparkles" size={14} />
              {yukleniyorAktivasyon ? 'Aktive ediliyor…' : 'Premium’u Ücretsiz Aç'}
            </button>

            {hata && (
              <div className="mt-4 text-sm text-red-300 dark:text-red-700 font-medium">
                {hata}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── PLANLAR ──────────────────────────────────────────────── */}
      {!isPremium && planlar.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-2">
              Bireysel
            </div>
            <h2 className="font-display text-2xl md:text-3xl tracking-tight font-bold mb-3">
              Premium Plan Seç
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12.5px] text-stone-600 dark:text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Icon name="ShieldCheck" size={13} className="text-emerald-600" />
                7 gün koşulsuz iade
              </span>
              <span className="opacity-30">·</span>
              <span className="flex items-center gap-1.5">
                <Icon name="X" size={13} className="text-stone-400" />
                İstediğin zaman iptal
              </span>
              <span className="opacity-30">·</span>
              <span className="flex items-center gap-1.5">
                <Icon name="FileText" size={13} className="text-stone-400" />
                E-arşiv fatura
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {planlar.map((p) => {
              const aylikEsdeger = Number(p.tutar) / p.ay_sayisi;
              const yukleniyor = secilenPlan === p.kod;
              const oneCikan = p.kod === 'donemlik';
              const tasarruf = p.ay_sayisi > 1
                ? Math.round((1 - aylikEsdeger / (Number(planlar[0]?.tutar) || aylikEsdeger)) * 100)
                : 0;
              return (
                <div
                  key={p.kod}
                  className={`relative p-6 md:p-7 rounded-2xl border-2 bg-white dark:bg-zinc-800/40 transition ${
                    oneCikan
                      ? 'border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-200/30 dark:shadow-amber-900/20'
                      : 'border-stone-200 dark:border-zinc-800 hover:border-stone-400 dark:hover:border-zinc-600'
                  }`}
                >
                  {oneCikan && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-900 text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full">
                      En İyi Değer
                    </div>
                  )}
                  <h3 className="font-display text-xl font-bold tracking-tight mb-1">{p.ad}</h3>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                      ₺{Number(p.tutar).toFixed(0)}
                    </span>
                    <span className="text-sm text-stone-500 dark:text-zinc-500 font-medium">
                      / {p.ay_sayisi === 1 ? 'ay' : `${p.ay_sayisi} ay`}
                    </span>
                  </div>
                  {p.ay_sayisi > 1 ? (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-stone-500 dark:text-zinc-500 font-medium">
                        Aylığa düşen ₺{aylikEsdeger.toFixed(0)}
                      </span>
                      {tasarruf > 0 && (
                        <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
                          %{tasarruf} tasarruf
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium mb-4">
                      Esnek aylık ödeme
                    </div>
                  )}
                  {p.aciklama && (
                    <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium leading-relaxed mb-5">
                      {p.aciklama}
                    </p>
                  )}
                  <button
                    onClick={() => planSatinAl(p.kod)}
                    disabled={yukleniyor || secilenPlan !== null}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs tracking-[0.2em] uppercase font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      oneCikan
                        ? 'bg-amber-500 hover:bg-amber-400 text-stone-900'
                        : 'bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 hover:opacity-90'
                    }`}
                  >
                    {yukleniyor ? (
                      <>
                        <Icon name="Loader2" size={14} className="animate-spin" />
                        Yönlendiriliyor…
                      </>
                    ) : (
                      <>
                        <Icon name="CreditCard" size={14} />
                        Hemen Başla
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {hata && (
            <div className="mt-5 text-center text-sm text-red-700 dark:text-red-400 font-medium">
              {hata}
            </div>
          )}

          <div className="mt-5 text-center text-[11px] text-stone-500 dark:text-zinc-500 font-medium">
            Tutarlar KDV dahildir · Ödeme iyzico ile güvenli — kart bilgilerin MuhasebeLab’a iletilmez.
          </div>
        </section>
      )}

      {/* ─── KURUM / SINIF (configurator) ─────────────────────────── */}
      {(() => {
        const aylikPlan = planlar.find((p) => p.donem === 'aylik');
        const yillikPlan = planlar.find((p) => p.donem === 'yillik');
        const baseAylik = aylikPlan ? Number(aylikPlan.tutar) : 99;
        const baseYillikAylik = yillikPlan
          ? Number(yillikPlan.tutar) / Math.max(1, yillikPlan.ay_sayisi)
          : 79;
        const ay = kurumPeriod === 'aylik' ? 1 : 12;
        const birimAylik = kurumPeriod === 'aylik' ? baseAylik : baseYillikAylik;
        const indirimYuzde =
          kurumKisi >= 250 ? 35 : kurumKisi >= 100 ? 25 : kurumKisi >= 30 ? 15 : 0;
        const bireyselToplam = Math.round(birimAylik * ay * kurumKisi);
        const kurumFiyat = Math.round(bireyselToplam * (1 - indirimYuzde / 100));
        const tasarruf = bireyselToplam - kurumFiyat;
        const fmt = (n: number) => n.toLocaleString('tr-TR');
        const mailtoBody = `Merhaba,

Kurumum / sınıfım için MuhasebeLab toplu lisans almak istiyorum.

Kurum adı:
Kişi sayısı: ${kurumKisi}
Faturalandırma: ${kurumPeriod === 'aylik' ? 'Aylık' : 'Yıllık'}
İlgili kişi telefonu:

Sayfada gösterilen tahminî tutar: ₺${fmt(kurumFiyat)} (${
          kurumPeriod === 'aylik' ? 'aylık' : 'yıllık toplam'
        })

Teşekkürler.`;
        const mailtoUrl = `mailto:${KURUM_EMAIL}?subject=${encodeURIComponent(
          `Toplu Lisans Talebi — ${kurumKisi} kişi`,
        )}&body=${encodeURIComponent(mailtoBody)}`;

        return (
          <section className="mb-16">
            <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-slate-100 to-stone-50 dark:from-zinc-900 dark:to-zinc-950 border border-stone-200 dark:border-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,1.1fr] gap-8 md:gap-12 items-start">
                {/* SOL: pitch */}
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 text-[10px] tracking-[0.3em] uppercase font-bold text-slate-700 dark:text-slate-400">
                    <Icon name="Users" size={12} />
                    Sınıf · Kurum · Üniversite
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-4 leading-tight">
                    Bir öğretmen,
                    <br />
                    <span
                      className="font-serif italic"
                      style={{ color: 'var(--copper, #b87333)' }}
                    >
                      bütün sınıf
                    </span>
                  </h2>
                  <p className="text-stone-600 dark:text-zinc-400 leading-relaxed font-medium mb-5">
                    Akademisyenler, SMMM staj merkezleri ve dershaneler
                    için toplu lisans. Sayıyı kendin seç, indirim
                    otomatik uygulansın.
                  </p>
                  <div className="space-y-2.5 mb-2">
                    {[
                      { kisi: '30+', indirim: '%15' },
                      { kisi: '100+', indirim: '%25' },
                      { kisi: '250+', indirim: '%35' },
                    ].map((t) => (
                      <div
                        key={t.kisi}
                        className="flex items-center justify-between text-[13px] py-2 px-3 rounded-lg bg-white/60 dark:bg-zinc-800/40 border border-stone-200/70 dark:border-zinc-700/50"
                      >
                        <span className="font-mono text-stone-600 dark:text-zinc-400">
                          {t.kisi} kişi
                        </span>
                        <span
                          className="font-display font-bold"
                          style={{ color: 'var(--copper, #b87333)' }}
                        >
                          −{t.indirim} indirim
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {[
                      'E-fatura',
                      'Öğretmen paneli (yakında)',
                      'Sınıf ortalaması (yakında)',
                    ].map((b) => (
                      <span
                        key={b}
                        className="text-[11px] font-medium px-2 py-1 rounded-md bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* SAĞ: configurator */}
                <div className="rounded-2xl bg-white dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 p-6 md:p-7 shadow-sm">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-4">
                    Teklifini Yapılandır
                  </div>

                  {/* Period toggle */}
                  <div className="inline-flex bg-stone-100 dark:bg-zinc-900 rounded-xl p-1 mb-5 w-full">
                    <button
                      type="button"
                      onClick={() => setKurumPeriod('aylik')}
                      className={`flex-1 px-3 py-2 text-[12.5px] font-bold tracking-tight rounded-lg transition ${
                        kurumPeriod === 'aylik'
                          ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 shadow-sm'
                          : 'text-stone-500 dark:text-zinc-500'
                      }`}
                    >
                      Aylık
                    </button>
                    <button
                      type="button"
                      onClick={() => setKurumPeriod('yillik')}
                      className={`flex-1 px-3 py-2 text-[12.5px] font-bold tracking-tight rounded-lg transition flex items-center justify-center gap-1.5 ${
                        kurumPeriod === 'yillik'
                          ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 shadow-sm'
                          : 'text-stone-500 dark:text-zinc-500'
                      }`}
                    >
                      Yıllık
                      <span className="text-[9px] tracking-[0.15em] uppercase font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                        −%20
                      </span>
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="mb-5">
                    <div className="flex items-baseline justify-between mb-2">
                      <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                        Kişi sayısı
                      </label>
                      <span className="text-[11px] text-stone-500 dark:text-zinc-500 font-mono">
                        min 10 · max 500
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setKurumKisi(Math.max(10, kurumKisi - 5))}
                        className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-zinc-900 hover:bg-stone-200 dark:hover:bg-zinc-700 transition flex items-center justify-center"
                      >
                        <Icon name="Minus" size={14} />
                      </button>
                      <input
                        type="number"
                        min={10}
                        max={500}
                        value={kurumKisi}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (Number.isNaN(v)) return;
                          setKurumKisi(Math.min(500, Math.max(10, v)));
                        }}
                        className="flex-1 h-10 text-center font-display text-xl font-bold tracking-tight bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-lg outline-none focus:border-stone-900 dark:focus:border-zinc-400"
                      />
                      <button
                        type="button"
                        onClick={() => setKurumKisi(Math.min(500, kurumKisi + 5))}
                        className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-zinc-900 hover:bg-stone-200 dark:hover:bg-zinc-700 transition flex items-center justify-center"
                      >
                        <Icon name="Plus" size={14} />
                      </button>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={300}
                      step={5}
                      value={Math.min(300, kurumKisi)}
                      onChange={(e) => setKurumKisi(parseInt(e.target.value, 10))}
                      className="w-full mt-3 accent-amber-500"
                    />
                  </div>

                  {/* Live calculation */}
                  <div className="space-y-2 py-4 border-t border-stone-200 dark:border-zinc-700 text-[13px]">
                    <div className="flex items-baseline justify-between text-stone-600 dark:text-zinc-400">
                      <span>
                        Bireysel toplam ({fmt(kurumKisi)} ×{' '}
                        ₺{Math.round(birimAylik * ay)})
                      </span>
                      <span className="font-mono">₺{fmt(bireyselToplam)}</span>
                    </div>
                    {indirimYuzde > 0 ? (
                      <div className="flex items-baseline justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                        <span>Toplu indirim −%{indirimYuzde}</span>
                        <span className="font-mono">−₺{fmt(tasarruf)}</span>
                      </div>
                    ) : (
                      <div className="text-[12px] text-stone-500 dark:text-zinc-500 italic">
                        30+ kişi için %15, 100+ için %25, 250+ için %35 indirim
                      </div>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between py-3 border-t border-stone-200 dark:border-zinc-700">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                      {kurumPeriod === 'aylik' ? 'Aylık tutar' : 'Yıllık toplam'}
                    </span>
                    <span
                      className="font-display text-3xl font-bold tracking-tight"
                      style={{ color: 'var(--copper, #b87333)' }}
                    >
                      ₺{fmt(kurumFiyat)}
                    </span>
                  </div>

                  <a
                    href={mailtoUrl}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-5 py-3 text-xs tracking-[0.2em] uppercase font-bold rounded-xl hover:opacity-90 transition"
                  >
                    <Icon name="Mail" size={14} />
                    Teklif İste
                  </a>
                  <div className="mt-2.5 text-center text-[11px] text-stone-500 dark:text-zinc-500">
                    {KURUM_EMAIL} · 1 iş günü içinde dönüş
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ─── SSS ───────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-2">
            Sıkça Sorulanlar
          </div>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight font-bold">
            Aklındaki sorulara cevap
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-stone-200 dark:divide-zinc-800 border-y border-stone-200 dark:border-zinc-800">
          {SSS.map((s, i) => {
            const acik = acikSoru === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setAcikSoru(acik ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                >
                  <span className="font-display text-base md:text-lg font-semibold tracking-tight">
                    {s.soru}
                  </span>
                  <Icon
                    name={acik ? 'Minus' : 'Plus'}
                    size={16}
                    className="text-stone-400 dark:text-zinc-600 flex-shrink-0 group-hover:text-stone-700 dark:group-hover:text-zinc-300 transition"
                  />
                </button>
                {acik && (
                  <div className="pb-5 text-[14px] text-stone-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {s.cevap}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── KAPANIŞ NOTU ─────────────────────────────────────────── */}
      <div className="text-center text-[12px] text-stone-500 dark:text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto">
        <Icon name="Info" size={13} className="inline mr-1.5 -mt-0.5" />
        Soru çözmek <strong>her zaman ücretsiz</strong>. Premium öğrenmeyi
        hızlandıran katmandır — paran yoksa lütfen ücretsiz kullan, biraz
        feedback yeter.
      </div>
    </main>
  );
};
