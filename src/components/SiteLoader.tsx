import { useEffect, useState } from 'react';

const SESSION_KEY = 'muhasebelab_loader_seen';

/**
 * Site loader — ilk yüklemede 2.1s splash screen.
 * Aynı oturum içinde (sessionStorage) tekrar gösterilmez,
 * yani sayfa içi navigation'da splash spam yapmaz.
 */
export const SiteLoader = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(SESSION_KEY);
  });
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (!show) return;
    // Animasyon süresi: 1.4s loader + 0.7s fade-out = 2.1s
    const exitTimer = setTimeout(() => setExit(true), 1400);
    const removeTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, 2200);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={`site-loader ${exit ? 'exit' : ''}`} aria-hidden>
      <div className="site-loader-mark">
        muhasebelab<span className="mark-section">§</span>
      </div>
      <div className="site-loader-tagline">Tek Düzen Hesap Planı Atölyesi</div>
      <div className="site-loader-progress" />
    </div>
  );
};
