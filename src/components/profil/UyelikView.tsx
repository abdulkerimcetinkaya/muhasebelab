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
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-bold text-premium-deep bg-premium-soft px-2.5 py-1 rounded-full">
            <Icon name="Sparkles" size={11} />
            Premium
          </span>
        )}
      </div>

      {isPremium && premiumBitis ? (
        <div className="rounded-2xl bg-gradient-to-br from-premium-soft to-premium-soft border border-premium-soft dark:border-premium-deep/40 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-premium-soft to-premium-soft flex items-center justify-center flex-shrink-0">
              <Icon name="BadgeCheck" size={22} className="text-premium-deep" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg font-bold mb-1">Premium üyeliğin aktif</div>
              <div className="text-sm text-ink-soft font-medium">
                Bitiş:{' '}
                <span className="font-mono font-bold">
                  {new Date(premiumBitis).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="text-xs text-ink-soft font-medium mt-1">
                Tüm AI özellikleri ve premium araçlar bu tarihe kadar açık.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => nav('/premium')}
              className="inline-flex items-center gap-1.5 bg-ink text-bg px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition"
            >
              <Icon name="RefreshCw" size={12} />
              Süreyi Uzat
            </button>
            <a
              href="mailto:kerim.cetinkayaa78@gmail.com?subject=MuhasebeLab%20iade%20talebi"
              className="inline-flex items-center gap-1.5 border border-line-strong px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:border-ink transition"
            >
              <Icon name="Send" size={12} />
              İade Talebi
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
              <Icon name="Sparkles" size={22} className="text-ink-mute" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg font-bold mb-1">Ücretsiz hesap</div>
              <p className="text-sm text-ink-soft font-medium leading-relaxed">
                Tüm soruları sınırsız çözebilirsin. Premium aşağıdaki ek özellikleri açar.
              </p>
            </div>
          </div>

          {/* Mini karşılaştırma — Ücretsiz vs Premium */}
          <div className="border border-line rounded-xl overflow-hidden mb-5">
            <div className="grid grid-cols-[1fr_80px_80px] text-[12px]">
              <div className="px-4 py-2.5 bg-bg-tint border-b border-line text-[10px] tracking-[0.18em] uppercase font-bold text-ink-mute">
                Özellik
              </div>
              <div className="px-3 py-2.5 bg-bg-tint border-b border-l border-line text-[10px] tracking-[0.18em] uppercase font-bold text-ink-mute text-center">
                Ücretsiz
              </div>
              <div className="px-3 py-2.5 bg-premium-soft/60 border-b border-l border-line text-[10px] tracking-[0.18em] uppercase font-bold text-premium-deep text-center">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-premium hover:bg-premium text-ink px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg active:scale-[0.98] transition"
          >
            <Icon name="Sparkles" size={12} />
            Premium'u Keşfet ve Fiyatları Gör
          </button>
        </div>
      )}

      {/* Premium ödeme geçmişi — varsa */}

      {odemeler.length > 0 && (
        <div className="mt-6">
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-ink-mute font-bold mb-3">
            Ödeme Geçmişi
          </h3>
          <div className="rounded-xl border border-line overflow-hidden">
            {odemeler.map((o, i) => {
              const tarih = new Date(o.basarili_tarih ?? o.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const durumStil =
                o.durum === 'basarili'
                  ? 'text-success dark:text-success bg-success-soft'
                  : o.durum === 'beklemede'
                    ? 'text-ink-soft bg-surface-2'
                    : 'text-danger dark:text-danger bg-danger-soft';
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
 i > 0 ? 'border-t border-line-soft' : ''
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
                    <div className="text-xs text-ink-mute font-medium font-mono">
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
  const border = son ? '' : 'border-b border-line-soft';
  return (
    <>
      <div className={`px-4 py-2.5 ${border} text-ink-soft font-medium`}>
        {ozellik}
      </div>
      <div
        className={`px-3 py-2.5 ${border} border-l border-line text-center font-mono font-bold tabular-nums ${
 ucretsiz === '—'
 ? 'text-ink-quiet'
 : 'text-ink-soft'
 }`}
      >
        {ucretsiz}
      </div>
      <div
        className={`px-3 py-2.5 bg-premium-soft/30 ${border} border-l border-line text-center font-mono font-bold tabular-nums ${
 vurgu
 ? 'text-premium-deep'
 : 'text-ink-soft'
 }`}
      >
        {premium}
      </div>
    </>
  );
};
