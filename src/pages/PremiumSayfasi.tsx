import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { useAuth, useIsPremium } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { odemeBaslat, planlariYukle, type Plan } from '../lib/odeme';

const OZELLIKLER: { ad: string; aciklama: string; icon: string; durum: 'hazir' | 'yakinda' }[] = [
  {
    ad: 'AI Yanlış Analizi',
    aciklama:
      'Hatalı çözümünü yapay zekaya gönder, satır satır neyi neden yanlış yaptığını anlasın ve doğru kayda nasıl gideceğini açıklasın.',
    icon: 'Sparkles',
    durum: 'hazir',
  },
  {
    ad: 'AI Muhasebe Asistanı',
    aciklama:
      'Soru çözerken takıldığında "KDV indirimi nasıl çalışır?" gibi konuyu sorabileceğin yan panel chat asistanı.',
    icon: 'MessagesSquare',
    durum: 'hazir',
  },
  {
    ad: 'Hesap Kodu Otomatik Tamamlama',
    aciklama:
      'Hesap kodunu yazarken Tek Düzen Hesap Planı önerileri açılır, kod ezberini kolaylaştırır.',
    icon: 'Wand2',
    durum: 'hazir',
  },
  {
    ad: 'Adım Adım Çözüm Anlatımı',
    aciklama:
      'Her sorunun çözümü için "neden bu hesap?" mantığını öğreten ayrıntılı pedagojik açıklama.',
    icon: 'BookOpen',
    durum: 'yakinda',
  },
  {
    ad: 'Sınav Modu',
    aciklama:
      'Zamanlanmış simülasyon — gerçek sınav koşullarında pratik. Performans raporu ile bitirir.',
    icon: 'Timer',
    durum: 'yakinda',
  },
  {
    ad: 'PDF Çözüm Defteri',
    aciklama: 'Çözdüğün soruları profesyonel formatta PDF olarak indir, ödev/portföy için kullan.',
    icon: 'FileDown',
    durum: 'yakinda',
  },
  {
    ad: 'Detaylı İlerleme Raporu',
    aciklama:
      'Hangi konularda zayıfsın, hangi tür hataları tekrar ediyorsun — haftalık özet ve öneriler.',
    icon: 'LineChart',
    durum: 'yakinda',
  },
  {
    ad: 'Premium Temalar',
    aciklama: 'Sade akademik klasik tema, koyu kahve, sepia ve high-contrast erişilebilirlik teması.',
    icon: 'Palette',
    durum: 'yakinda',
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

  useEffect(() => {
    if (!yukleniyor && !user) nav('/giris', { replace: true });
  }, [user, yukleniyor, nav]);

  // Erken erişim kontenjanı: ilk 100 premium kullanıcıya ücretsiz 1 yıl
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
        // Sessiz geç — planlar gelmezse erken erişim kutusu zaten gösteriliyor
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
      // İyzico ödeme sayfasına yönlendir (assign — React Compiler uyumlu)
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/40 dark:to-amber-900/40 mb-5">
          <Icon name="Sparkles" size={28} className="text-amber-700 dark:text-amber-300" />
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-amber-700 dark:text-amber-400 font-bold mb-3">
          MuhasebeLab Premium
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight font-bold mb-4">
          Yapay zekayla daha hızlı öğren
        </h1>
        <p className="text-lg text-stone-600 dark:text-zinc-400 leading-relaxed font-medium max-w-2xl mx-auto">
          Ücretsiz hesap ile tüm soruları sınırsız çözersin. Premium üyelik, takıldığın yerde
          sana özel rehberlik eden AI özellikleri ve ileri seviye araçları açar.
        </p>
      </div>

      {isPremium && premiumBitis && (
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950/30 border border-amber-300/60 dark:border-amber-700/40 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Icon name="BadgeCheck" size={18} className="text-amber-700 dark:text-amber-300" />
            <span className="font-display text-lg font-bold text-amber-900 dark:text-amber-100">
              Premium üyeliğin aktif
            </span>
          </div>
          <div className="text-sm text-amber-800 dark:text-amber-200/80 font-medium">
            Bitiş: {new Date(premiumBitis).toLocaleDateString('tr-TR')}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {OZELLIKLER.map((o) => (
          <div
            key={o.ad}
            className="group p-6 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 hover:border-stone-400 dark:hover:border-zinc-600 transition"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition">
                <Icon
                  name={o.icon}
                  size={20}
                  className="text-stone-700 dark:text-zinc-300 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-display font-bold tracking-tight">{o.ad}</h3>
                  {o.durum === 'yakinda' && (
                    <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 bg-stone-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      Yakında
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium leading-relaxed">
                  {o.aciklama}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isPremium && erkenKontenjanKalan !== null && erkenKontenjanKalan > 0 && (
        <div className="mb-8 rounded-3xl p-8 md:p-10 bg-gradient-to-br from-stone-900 to-stone-800 dark:from-zinc-100 dark:to-white text-stone-50 dark:text-zinc-900 text-center">
          <div className="inline-flex items-center gap-2 mb-4 text-[10px] tracking-[0.3em] uppercase font-bold opacity-70">
            <Thiings name="rocket" size={20} />
            Erken Erişim
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-3">
            İlk 100 kullanıcıya 1 yıl ücretsiz
          </h2>
          <p className="text-base opacity-80 font-medium mb-6 max-w-xl mx-auto">
            Beta dönemi süresince geri bildirim karşılığında premium özelliklerin tamamı ücretsiz.
            Ödeme bilgisi istemiyoruz, kredi kartı yok.
          </p>

          <div className="text-sm font-mono opacity-70 mb-5">
            {erkenKontenjanKalan} / 100 yer kaldı
          </div>

          <button
            onClick={erkenAktivasyon}
            disabled={yukleniyorAktivasyon}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 px-8 py-3.5 text-sm tracking-wide uppercase font-bold rounded-xl shadow-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="Sparkles" size={14} />
            {yukleniyorAktivasyon ? 'Aktive ediliyor...' : 'Premium’u Ücretsiz Aç'}
          </button>

          {hata && (
            <div className="mt-4 text-sm text-red-300 dark:text-red-700 font-medium">{hata}</div>
          )}
        </div>
      )}

      {!isPremium && planlar.length > 0 && (
        <div className="mt-8">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight font-bold mb-2">
              Premium Plan Seç
            </h2>
            <p className="text-stone-600 dark:text-zinc-400 font-medium">
              7 gün ücretsiz iade · İstediğin zaman iptal et · Türkiye’de düzenlenmiş fatura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {planlar.map((p) => {
              const aylikEsdeger = Number(p.tutar) / p.ay_sayisi;
              const yukleniyor = secilenPlan === p.kod;
              const oneCikan = p.kod === 'donemlik';
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
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-display text-xl font-bold tracking-tight">{p.ad}</h3>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-display text-4xl font-bold tracking-tight">
                      ₺{Number(p.tutar).toFixed(0)}
                    </span>
                    <span className="text-sm text-stone-500 dark:text-zinc-500 font-medium">
                      / {p.ay_sayisi === 1 ? 'ay' : `${p.ay_sayisi} ay`}
                    </span>
                  </div>
                  {p.ay_sayisi > 1 && (
                    <div className="text-xs text-stone-500 dark:text-zinc-500 font-medium mb-3">
                      Aylığa düşen ₺{aylikEsdeger.toFixed(0)}
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
                        Yönlendiriliyor...
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

          <div className="mt-6 text-center text-[11px] text-stone-500 dark:text-zinc-500 font-medium">
            Ödeme iyzico ile güvenli — kart bilgileriniz MuhasebeLab’a iletilmez.
          </div>
        </div>
      )}
    </main>
  );
};
