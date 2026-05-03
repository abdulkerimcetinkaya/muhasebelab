import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Icon } from '../Icon';
import { supabase } from '../../lib/supabase';

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
  user: User;
  premiumBitis: string | null;
  isPremium: boolean;
}

/**
 * Premium üyelik durumu + ödeme geçmişi.
 */
export const UyelikView = ({ user, premiumBitis, isPremium }: Props) => {
  const nav = useNavigate();
  const [odemeler, setOdemeler] = useState<OdemeKayit[]>([]);

  useEffect(() => {
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
  }, [user.id]);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-xl md:text-2xl tracking-tight font-bold">Üyelik</h2>
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
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Icon name="Sparkles" size={22} className="text-stone-500 dark:text-zinc-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg font-bold mb-1">Ücretsiz hesap</div>
              <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium leading-relaxed">
                Tüm soruları sınırsız çözebilirsin. Premium aşağıdaki ek özellikleri açar.
              </p>
            </div>
          </div>

          {/* Mini karşılaştırma — Ücretsiz vs Premium */}
          <div className="border border-stone-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-5">
            <div className="grid grid-cols-[1fr_80px_80px] text-[12px]">
              <div className="px-4 py-2.5 bg-stone-50 dark:bg-zinc-800/60 border-b border-stone-200 dark:border-zinc-700 text-[10px] tracking-[0.18em] uppercase font-bold text-stone-500 dark:text-zinc-500">
                Özellik
              </div>
              <div className="px-3 py-2.5 bg-stone-50 dark:bg-zinc-800/60 border-b border-l border-stone-200 dark:border-zinc-700 text-[10px] tracking-[0.18em] uppercase font-bold text-stone-500 dark:text-zinc-500 text-center">
                Ücretsiz
              </div>
              <div className="px-3 py-2.5 bg-amber-50/60 dark:bg-amber-950/20 border-b border-l border-stone-200 dark:border-zinc-700 text-[10px] tracking-[0.18em] uppercase font-bold text-amber-800 dark:text-amber-300 text-center">
                Premium
              </div>

              <KrsRow ozellik="Soru havuzu" ucretsiz="✓" premium="✓" />
              <KrsRow ozellik="Çözüm + ipucu" ucretsiz="✓" premium="✓" />
              <KrsRow ozellik="İlerleme + rozet" ucretsiz="✓" premium="✓" />
              <KrsRow ozellik="AI asistan" ucretsiz="3/gün" premium="Sınırsız" vurgu />
              <KrsRow ozellik="AI yanlış analizi" ucretsiz="—" premium="✓" vurgu />
              <KrsRow ozellik="Hesap kodu otomatik tamamlama" ucretsiz="—" premium="✓" vurgu />
              <KrsRow
                ozellik="Belge üretimi (fatura/dekont)"
                ucretsiz="—"
                premium="✓"
                vurgu
                son
              />
            </div>
          </div>

          <button
            onClick={() => nav('/premium')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-900 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg active:scale-[0.98] transition"
          >
            <Icon name="Sparkles" size={12} />
            Premium'u Keşfet ve Fiyatları Gör
          </button>
        </div>
      )}

      {/* Premium ödeme geçmişi — varsa */}

      {odemeler.length > 0 && (
        <div className="mt-6">
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-3">
            Ödeme Geçmişi
          </h3>
          <div className="rounded-xl border border-stone-200 dark:border-zinc-800 overflow-hidden">
            {odemeler.map((o, i) => {
              const tarih = new Date(o.basarili_tarih ?? o.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
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
  );
};

const KrsRow = ({
  ozellik,
  ucretsiz,
  premium,
  vurgu = false,
  son = false,
}: {
  ozellik: string;
  ucretsiz: string;
  premium: string;
  vurgu?: boolean;
  son?: boolean;
}) => {
  const border = son ? '' : 'border-b border-stone-100 dark:border-zinc-800';
  return (
    <>
      <div className={`px-4 py-2.5 ${border} text-stone-700 dark:text-zinc-300 font-medium`}>
        {ozellik}
      </div>
      <div
        className={`px-3 py-2.5 ${border} border-l border-stone-200 dark:border-zinc-700 text-center font-mono font-bold tabular-nums ${
          ucretsiz === '—'
            ? 'text-stone-300 dark:text-zinc-700'
            : 'text-stone-700 dark:text-zinc-300'
        }`}
      >
        {ucretsiz}
      </div>
      <div
        className={`px-3 py-2.5 bg-amber-50/30 dark:bg-amber-950/10 ${border} border-l border-stone-200 dark:border-zinc-700 text-center font-mono font-bold tabular-nums ${
          vurgu
            ? 'text-amber-800 dark:text-amber-300'
            : 'text-stone-700 dark:text-zinc-300'
        }`}
      >
        {premium}
      </div>
    </>
  );
};
