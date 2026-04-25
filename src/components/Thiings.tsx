import { useState } from 'react';

type AnimateKind = 'float' | 'float-2' | 'float-3' | 'float-4' | null;

interface Props {
  name: string;
  size?: number;
  className?: string;
  animate?: AnimateKind;
}

export const Thiings = ({ name, size = 48, className = '', animate = null }: Props) => {
  const [yok, setYok] = useState(false);
  const animClass = animate ? `thiings-${animate}` : '';
  if (yok) {
    return (
      <div
        className={`${className} ${animClass} inline-flex items-center justify-center rounded-2xl`}
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
        }}
      >
        <span
          className="text-[9px] font-semibold text-blue-800 px-1 text-center leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {name}
        </span>
      </div>
    );
  }
  return (
    <img
      src={`/icons/${name}.png`}
      alt={name}
      onError={() => setYok(true)}
      className={`thiings-img ${animClass} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
