import { Icon } from './Icon';

interface Props {
  /** Rozetin dış çapı (px). Tik ikon boyutu otomatik ayarlanır. */
  size?: number;
  className?: string;
}

/**
 * "Tamamlandı" rozeti — lacivert dolgu + beyaz tik.
 * Konu kartlarında, sol nav'da, başlık üstündeki rozette kullanılır.
 */
export const TamamRozeti = ({ size = 16, className = '' }: Props) => {
  const ikonBoyut = Math.max(8, Math.round(size * 0.6));
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-blue-900 dark:bg-blue-700 text-white ${className}`}
      style={{ width: size, height: size }}
      aria-label="Tamamlandı"
    >
      <Icon name="Check" size={ikonBoyut} strokeWidth={3} />
    </span>
  );
};
