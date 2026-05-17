/**
 * Initials-only avatar (Linear/Vercel pattern). Görünen ad'dan baş harfler
 * çıkarılıp deterministik renkli gradyan arka plana yerleştirilir.
 *
 * - "Abdulkerim Çetinkaya" → "AÇ"
 * - "kerim" → "K"
 * - "" → "?"
 *
 * Renk hash'i kullanıcı adından türetildiği için aynı kişi her zaman
 * aynı renk paletini görür. 8 farklı gradient palette (slate, copper,
 * brand, success, premium, danger, neutral) arasından deterministik seçim.
 */

interface Props {
  ad: string | null | undefined;
  /** Pixel boyut. Default 32 (navbar size). 40+ profil için. */
  size?: number;
  /** Yuvarlak yerine kare istiyorsan. Default rounded-full. */
  shape?: 'circle' | 'square';
}

// 8 gradient palette — token'larla uyumlu olsun diye Tailwind class değil,
// inline gradyan kullanıyoruz (rastgele 8 ton arası, hepsi koyu kontrastlı).
const PALETLER: Array<{ from: string; to: string; text: string }> = [
  { from: '#3b5a8a', to: '#1e3a5f', text: '#fff' }, // brand-deep
  { from: '#b56b3e', to: '#8a4a23', text: '#fff' }, // copper-deep
  { from: '#3d7a4e', to: '#1f4d2e', text: '#fff' }, // success-deep
  { from: '#8a6a1f', to: '#5e4715', text: '#fff' }, // premium-deep
  { from: '#7a3a3a', to: '#4d1f1f', text: '#fff' }, // danger-deep
  { from: '#4a4540', to: '#2a2620', text: '#fff' }, // ink-deep
  { from: '#5a6a7a', to: '#2e3a4a', text: '#fff' }, // slate
  { from: '#6a4a7a', to: '#3a1f4a', text: '#fff' }, // purple-deep
];

const initialsCikar = (ad: string | null | undefined): string => {
  if (!ad) return '?';
  const temiz = ad.trim();
  if (!temiz) return '?';
  const parcalar = temiz.split(/\s+/).filter(Boolean);
  if (parcalar.length === 0) return '?';
  if (parcalar.length === 1) return parcalar[0]!.charAt(0).toUpperCase();
  // İlk + son kelimenin ilk harfi (ortadakileri atla)
  return (parcalar[0]!.charAt(0) + parcalar[parcalar.length - 1]!.charAt(0)).toUpperCase();
};

// Basit deterministik hash — string → 0..7 arası index
const paletIndexi = (ad: string | null | undefined): number => {
  if (!ad) return 0;
  let hash = 0;
  for (let i = 0; i < ad.length; i++) {
    hash = (hash << 5) - hash + ad.charCodeAt(i);
    hash |= 0; // 32-bit int
  }
  return Math.abs(hash) % PALETLER.length;
};

export const InitialsAvatar = ({ ad, size = 32, shape = 'circle' }: Props) => {
  const initials = initialsCikar(ad);
  const palet = PALETLER[paletIndexi(ad)]!;
  const fontSize = Math.round(size * 0.42);
  const radius = shape === 'circle' ? '50%' : `${Math.round(size * 0.2)}px`;

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center font-bold select-none"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${palet.from} 0%, ${palet.to} 100%)`,
        color: palet.text,
        borderRadius: radius,
        fontSize,
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}
    >
      {initials}
    </span>
  );
};
