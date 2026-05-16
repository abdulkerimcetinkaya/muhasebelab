// Doğru cevap kutlama bloğu — editorial refined, context-aware.
// SoruEkrani success panel'inin içinde render edilir.
// İki katman: (1) varsa milestone banner, (2) her zaman context başlığı + alt metin + yakın rozet satırı.

import { motion } from 'framer-motion';
import { Icon } from './Icon';
import type { KutlamaBaglami } from '../lib/kutlama-baglami';

interface Props {
  baglam: KutlamaBaglami;
  /** Sıradaki soru CTA — success panel'de eski yerinde durur */
  cta: React.ReactNode;
  /** Mevcut "puan kazanıldı" mesajı — success panel'den geçer (ör. "+10 puan") */
  puanMesaji: string;
  /** Soru açıklaması — context bağlamından sonra gösterilir */
  aciklama: string;
}

export const CevapKutlama = ({ baglam, cta, puanMesaji, aciklama }: Props) => {
  const milestone = baglam.milestone;

  return (
    <div className="space-y-3">
      {/* MILESTONE BANNER — sadece milestone varsa */}
      {milestone && <MilestoneBanner milestone={milestone} />}

      {/* CONTEXT — her zaman */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 border-l-4 border-success bg-success-soft rounded-xl"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.05 }}
          >
            <Icon
              name="CheckCircle2"
              size={20}
              className="text-success dark:text-success"
            />
          </motion.div>
          <div className="font-display text-lg font-bold leading-tight">
            {baglam.baslik}
            {puanMesaji && (
              <span className="ml-2 text-ink-soft font-medium text-sm align-middle">
                {puanMesaji}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-ink-soft leading-relaxed font-medium mb-1">
          {baglam.altMetin}
        </p>

        {/* Yaklaşan rozet — bilgilendirme tonu, dikkat dağıtmadan */}
        {baglam.yakinRozet && (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-mute font-mono tracking-wider uppercase">
            <Icon name="Trophy" size={11} className="text-ink-quiet" />
            <span>
              {baglam.yakinRozet.ad}'na {baglam.yakinRozet.hedef - baglam.yakinRozet.mevcut} kaldı
            </span>
          </div>
        )}

        {/* Soru açıklaması — eski yapıda olduğu gibi context altında */}
        {aciklama && (
          <p className="text-sm text-ink-soft leading-relaxed mt-4 mb-4 font-medium">
            {aciklama}
          </p>
        )}

        {cta}
      </motion.div>
    </div>
  );
};

const MilestoneBanner = ({
  milestone,
}: {
  milestone: NonNullable<KutlamaBaglami['milestone']>;
}) => {
  const altin = milestone.rozetTipi === 'altin';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className={
        altin
          ? 'flex items-center gap-3 px-4 py-3 bg-ink text-bg border-l-4 border-premium rounded-xl shadow-lg'
          : 'flex items-center gap-3 px-4 py-3 bg-bg-tint border-l-4 border-premium rounded-xl'
      }
    >
      <Icon
        name={milestoneIkon(milestone.tip)}
        size={20}
        className={altin ? 'text-premium' : 'text-premium-deep'}
      />
      <div className="flex-1 min-w-0">
        <div
          className={
            altin
              ? 'font-display text-base leading-tight font-semibold text-bg'
              : 'font-display text-base leading-tight font-bold text-ink'
          }
        >
          {milestone.baslik}
        </div>
        <div
          className={
            altin
              ? 'text-xs opacity-70 mt-0.5'
              : 'text-xs text-ink-soft mt-0.5 font-medium'
          }
        >
          {milestone.altMetin}
        </div>
      </div>
    </motion.div>
  );
};

function milestoneIkon(tip: NonNullable<KutlamaBaglami['milestone']>['tip']): string {
  switch (tip) {
    case 'streak':
      return 'Flame';
    case 'combo':
      return 'Zap';
    case 'zor':
      return 'Mountain';
    case 'ilk-modul':
      return 'Sparkles';
  }
}
