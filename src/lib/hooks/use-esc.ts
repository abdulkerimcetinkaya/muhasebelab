import { useEffect } from 'react';

// Modal/yan panel/popover için ESC tuşuyla kapatma davranışı.
// Listener her modal mount olduğunda eklenir, unmount/onKapat değişiminde temizlenir.
export const useEsc = (onKapat: () => void, aktif = true) => {
  useEffect(() => {
    if (!aktif) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onKapat();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKapat, aktif]);
};
