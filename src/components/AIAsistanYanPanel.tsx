import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { MarkdownLite } from './MarkdownLite';
import { useIsPremium } from '../contexts/AuthContext';
import { aiAsistan, AIKotaHatasi, type AIMesaj } from '../lib/ai';

interface Props {
  acik: boolean;
  onKapat: () => void;
  baglam?: { soruBaslik?: string; senaryo?: string };
}

const HOSGELDIN: AIMesaj = {
  role: 'assistant',
  content:
    'Merhaba! Tek Düzen Hesap Planı, yevmiye kayıtları, KDV, amortisman ve dönem sonu işlemleri konularında sana yardımcı olabilirim. Üzerinde çalıştığın soruyu doğrudan çözmem ama kavramları açıklayabilirim.',
};

export const AIAsistanYanPanel = ({ acik, onKapat, baglam }: Props) => {
  const nav = useNavigate();
  const isPremium = useIsPremium();
  const [mesajlar, setMesajlar] = useState<AIMesaj[]>([HOSGELDIN]);
  const [girdi, setGirdi] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [kotaBitti, setKotaBitti] = useState(false);
  const [kalan, setKalan] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!acik) {
      setHata(null);
    }
  }, [acik]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mesajlar, yukleniyor]);

  const gonder = async () => {
    const metin = girdi.trim();
    if (!metin || yukleniyor || kotaBitti) return;
    setHata(null);
    const yeni: AIMesaj[] = [...mesajlar, { role: 'user', content: metin }];
    setMesajlar(yeni);
    setGirdi('');
    setYukleniyor(true);
    try {
      const sonuc = await aiAsistan({
        mesajlar: yeni.filter((m) => m !== HOSGELDIN),
        baglam,
      });
      setMesajlar((prev) => [...prev, { role: 'assistant', content: sonuc.metin }]);
      if (sonuc.kalan != null) setKalan(sonuc.kalan);
    } catch (e) {
      if (e instanceof AIKotaHatasi) {
        setKotaBitti(true);
        setKalan(0);
        setHata(e.message);
      } else {
        setHata((e as Error).message);
      }
    } finally {
      setYukleniyor(false);
    }
  };

  if (!acik) return null;

  const kalanRozet = isPremium
    ? 'Sınırsız'
    : kalan != null
      ? `${kalan} / 3 hak kaldı`
      : 'Free · 3/gün';

  return (
    <>
      <div
        onClick={onKapat}
        className="fixed inset-0 bg-stone-900/30 dark:bg-black/50 backdrop-blur-sm z-40 transition-opacity"
      />
      <aside className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-stone-50 dark:bg-zinc-900 border-l border-stone-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl">
        <div className="px-5 py-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-amber-50/40 to-transparent dark:from-amber-900/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 to-amber-100 dark:from-amber-800/40 dark:to-amber-900/40 flex items-center justify-center">
              <Icon name="Sparkles" size={14} className="text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-tight">AI Asistan</div>
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 dark:text-amber-400">
                {kalanRozet}
              </div>
            </div>
          </div>
          <button
            onClick={onKapat}
            className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-zinc-800 transition"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {mesajlar.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  m.role === 'user'
                    ? 'bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700'
                }`}
              >
                {m.role === 'user' ? (
                  <div className="text-sm font-medium whitespace-pre-wrap">{m.content}</div>
                ) : (
                  <MarkdownLite text={m.content} />
                )}
              </div>
            </div>
          ))}
          {yukleniyor && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-400 font-medium">
                <Icon name="Loader2" size={14} className="animate-spin" />
                Yazıyor...
              </div>
            </div>
          )}
          {kotaBitti && !isPremium && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 text-center">
              <Icon
                name="Sparkles"
                size={18}
                className="text-amber-700 dark:text-amber-400 mx-auto mb-2"
              />
              <div className="text-sm font-display font-bold mb-1">
                Bugünkü 3 hakkın doldu
              </div>
              <p className="text-[12px] text-stone-600 dark:text-zinc-400 leading-relaxed mb-3">
                Yarın tekrar 3 yeni hak. Premium ile sınırsız sohbet et, AI yanlış analizi
                ve adım adım çözüm anlatımı da açılır.
              </p>
              <button
                onClick={() => {
                  onKapat();
                  nav('/premium');
                }}
                className="bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-4 py-2 text-[11px] tracking-wide uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition inline-flex items-center gap-1.5"
              >
                <Icon name="Sparkles" size={12} />
                Premium&apos;u Keşfet
              </button>
            </div>
          )}
          {hata && !kotaBitti && (
            <div className="text-sm text-red-700 dark:text-red-400 font-medium px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {hata}
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900">
          <div className="flex items-end gap-2">
            <textarea
              value={girdi}
              onChange={(e) => setGirdi(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  gonder();
                }
              }}
              placeholder={
                kotaBitti && !isPremium
                  ? 'Bugünkü hakkın doldu — yarın tekrar dene'
                  : 'Sor: KDV indirimi nasıl çalışır?'
              }
              rows={2}
              disabled={kotaBitti && !isPremium}
              className="flex-1 resize-none bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none rounded-xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={gonder}
              disabled={!girdi.trim() || yukleniyor || (kotaBitti && !isPremium)}
              className="bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 p-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Icon name="ArrowUp" size={16} />
            </button>
          </div>
          <div className="text-[10px] text-stone-400 dark:text-zinc-600 font-medium mt-1.5 px-1">
            {isPremium
              ? 'Premium · sınırsız sorgu'
              : kalan != null
                ? `Bugün kalan: ${kalan}/3 · Enter göndermek için`
                : 'Free · günde 3 sorgu · Enter göndermek için'}
          </div>
        </div>
      </aside>
    </>
  );
};
