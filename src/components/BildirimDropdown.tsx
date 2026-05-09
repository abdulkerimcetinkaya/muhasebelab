import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';
import {
  bildirimleriYukle,
  bildirimOku,
  tumBildirimleriOku,
  type BildirimTip,
  type BildirimWithRead,
} from '../lib/bildirimler';

const POLL_MS = 60_000;

const TIP_RENGI: Record<BildirimTip, string> = {
  duyuru: 'text-brand dark:text-brand-mute',
  bilgi: 'text-ink-mute',
  uyari: 'text-premium',
  guncelleme: 'text-success dark:text-success',
};

const TIP_IKON: Record<BildirimTip, string> = {
  duyuru: 'Megaphone',
  bilgi: 'Info',
  uyari: 'AlertTriangle',
  guncelleme: 'Sparkles',
};

const tarihFormatla = (iso: string): string => {
  const d = new Date(iso);
  const fark = (Date.now() - d.getTime()) / 1000;
  if (fark < 60) return 'şimdi';
  if (fark < 3600) return `${Math.floor(fark / 60)} dk önce`;
  if (fark < 86400) return `${Math.floor(fark / 3600)} sa önce`;
  if (fark < 604800) return `${Math.floor(fark / 86400)} gün önce`;
  return d.toLocaleDateString('tr-TR');
};

export const BildirimDropdown = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [acik, setAcik] = useState(false);
  const [bildirimler, setBildirimler] = useState<BildirimWithRead[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const yukle = async () => {
    if (!user) return;
    setYukleniyor(true);
    try {
      const list = await bildirimleriYukle(user.id);
      setBildirimler(list);
    } catch (e) {
      console.error('Bildirim yüklenemedi', e);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setBildirimler([]);
      return;
    }
    yukle();
    const t = setInterval(yukle, POLL_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Dropdown açıkken dış tıklama → kapat
  useEffect(() => {
    if (!acik) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAcik(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [acik]);

  const okunmamisSayisi = bildirimler.filter((b) => !b.okundu).length;

  const bildirimeTik = async (b: BildirimWithRead) => {
    if (!user) return;
    if (!b.okundu) {
      try {
        await bildirimOku(user.id, b.id);
        setBildirimler((prev) =>
          prev.map((x) => (x.id === b.id ? { ...x, okundu: true } : x)),
        );
      } catch (e) {
        console.error('Okundu işaretlenemedi', e);
      }
    }
    if (b.link) {
      setAcik(false);
      nav(b.link);
    }
  };

  const hepsiniOkunduIsaretle = async () => {
    if (!user) return;
    const ids = bildirimler.filter((b) => !b.okundu).map((b) => b.id);
    if (ids.length === 0) return;
    try {
      await tumBildirimleriOku(user.id, ids);
      setBildirimler((prev) => prev.map((b) => ({ ...b, okundu: true })));
    } catch (e) {
      console.error('Toplu okundu işaretlenemedi', e);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAcik((v) => !v)}
        className="relative p-1.5 rounded text-ink-soft hover:text-ink transition"
        title="Bildirimler"
        aria-label="Bildirimler"
      >
        <Icon name="Bell" size={15} />
        {okunmamisSayisi > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 bg-danger text-bg text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
            {okunmamisSayisi > 9 ? '9+' : okunmamisSayisi}
          </span>
        )}
      </button>

      {acik && (
        <div className="absolute right-0 mt-2 w-[320px] sm:w-[380px] bg-surface border border-line rounded-xl shadow-2xl z-50 max-h-[70vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-line">
            <span className="font-display text-[15px] font-bold tracking-tight">
              Bildirimler
            </span>
            {okunmamisSayisi > 0 && (
              <button
                onClick={hepsiniOkunduIsaretle}
                className="text-[10px] tracking-[0.15em] uppercase font-mono font-bold text-ink-mute hover:text-ink transition"
              >
                Hepsini okundu işaretle
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {yukleniyor && bildirimler.length === 0 ? (
              <div className="p-6 text-center text-sm text-ink-mute">Yükleniyor…</div>
            ) : bildirimler.length === 0 ? (
              <div className="p-6 text-center text-sm text-ink-mute">
                Henüz bildirimin yok.
              </div>
            ) : (
              bildirimler.map((b) => (
                <button
                  key={b.id}
                  onClick={() => bildirimeTik(b)}
                  className={`w-full text-left p-3 border-b border-line-soft last:border-b-0 hover:bg-bg-tint transition flex items-start gap-3 ${
 !b.okundu ? 'bg-brand-soft/40' : ''
 }`}
                >
                  <div className={`flex-shrink-0 mt-0.5 ${TIP_RENGI[b.tip]}`}>
                    <Icon name={TIP_IKON[b.tip]} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span
                        className={`text-[13.5px] font-bold leading-tight ${
 !b.okundu ? 'text-ink' : 'text-ink-soft'
 }`}
                      >
                        {b.baslik}
                      </span>
                      {!b.okundu && (
                        <span className="w-1.5 h-1.5 bg-brand rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="text-[12.5px] text-ink-soft leading-snug whitespace-pre-wrap">
                      {b.metin}
                    </div>
                    <div className="text-[10px] text-ink-mute uppercase tracking-wider font-mono mt-1.5">
                      {tarihFormatla(b.created_at)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
