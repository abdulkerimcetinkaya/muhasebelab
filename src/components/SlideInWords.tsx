import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props {
  children: string;
  className?: string;
  /** Kelimeler arası gecikme (saniye) */
  stagger?: number;
  /** Animasyon başlangıç gecikmesi (saniye) */
  delay?: number;
  /** Tek kelime süresi (saniye) */
  duration?: number;
  /** Mount'ta mı yoksa viewport'a girince mi tetiklensin */
  trigger?: 'mount' | 'in-view';
  /** Tek seferlik mi yoksa her görüşte mi */
  once?: boolean;
  /** Block element olarak render et (display: block) — h1 satırları için */
  as?: 'inline' | 'block';
  /** Vurgu için: kelimelerden bazıları farklı renk veya stilde olabilir */
  highlightWords?: { index: number; color?: string; italic?: boolean; fontFamily?: string }[];
}

/**
 * Bir cümleyi kelime kelime alttan yukarı süzdüren komponent.
 * Her kelime overflow-hidden bir kapsayıcı içinde, transform ile yukarı kayar.
 * Ventriloc-tarzı slidein-by-words pattern.
 */
export const SlideInWords = ({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  duration = 1.0,
  trigger = 'in-view',
  once = true,
  as = 'inline',
  highlightWords = [],
}: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.2 });
  const shouldAnimate = trigger === 'mount' ? true : inView;

  const words = children.split(' ');

  const renderWord = (word: string, i: number): ReactNode => {
    const highlight = highlightWords.find((h) => h.index === i);
    return (
      <span
        key={i}
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          verticalAlign: 'top',
          lineHeight: 1.05,
        }}
      >
        <motion.span
          style={{
            display: 'inline-block',
            color: highlight?.color,
            fontStyle: highlight?.italic ? 'italic' : undefined,
            fontFamily: highlight?.fontFamily,
          }}
          initial={{ y: '110%', opacity: 0 }}
          animate={
            shouldAnimate
              ? { y: '0%', opacity: 1 }
              : { y: '110%', opacity: 0 }
          }
          transition={{
            duration,
            ease: [0.55, 0.21, 0.07, 0.87],
            delay: delay + i * stagger,
            opacity: { duration: duration * 0.6, ease: 'linear' },
          }}
        >
          {word}
          {i < words.length - 1 && ' '}
        </motion.span>
      </span>
    );
  };

  const Wrapper = as === 'block' ? 'span' : 'span';

  return (
    <Wrapper
      ref={ref}
      className={className}
      style={{ display: as === 'block' ? 'block' : 'inline-block' }}
    >
      {words.map((w, i) => renderWord(w, i))}
    </Wrapper>
  );
};
