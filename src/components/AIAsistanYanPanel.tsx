import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { MarkdownLite } from './MarkdownLite';
import { useIsPremium } from '../contexts/AuthContext';
import { aiAsistan, AIKotaHatasi, type AIMesaj, type AIKaynak } from '../lib/ai';

interface Props {
  acik: boolean;
  onKapat: () => void;
  baglam?: { soruBaslik?: string; senaryo?: string };
}

// Panel içinde assistant mesajları RAG kaynaklarını da taşıyor.
// API'ye giderken (sadece role+content beklenir) kaynaklar atılır.
interface PanelMesaj extends AIMesaj {
  kaynaklar?: AIKaynak[];
}

const ilkMesaj = (baglam?: { soruBaslik?: string; senaryo?: string }): PanelMesaj => ({
  role: 'assistant',
  content: baglam?.soruBaslik
    ? `Merhaba! Şu an **${baglam.soruBaslik}** üzerinde çalışıyorsun. Bu soruyu doğrudan çözmem ama takıldığın kavramı, hesap kodunu, KDV oranını veya yevmiye kuralını sorabilirsin — yol göstereyim.`
    : 'Merhaba! Tek Düzen Hesap Planı, yevmiye kayıtları, KDV, amortisman ve dönem sonu işlemleri konularında sana yardımcı olabilirim.',
});

const KaynakListesi = ({ kaynaklar }: { kaynaklar: AIKaynak[] }) => (
  <div className="mt-3 pt-3 border-t border-line-soft space-y-1">
    <div className="text-[9px] tracking-[0.22em] uppercase text-ink-mute font-bold mb-1.5">
      Kaynaklar
    </div>
    {kaynaklar.map((k, i) => {
      const etiket = k.madde_no
        ? `Madde ${k.madde_no}`
        : k.baslik !== k.kaynak
          ? k.baslik
          : '';
      const link = k.url;
      const icerik = (
        <span className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-semibold text-ink truncate">{k.kaynak}</span>
          {etiket && (
            <span className="text-[10px] text-ink-mute font-mono">— {etiket}</span>
          )}
        </span>
      );
      return link ? (
        <a
          key={i}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:bg-bg-tint -mx-1 px-1 py-0.5 rounded transition"
        >
          {icerik}
        </a>
      ) : (
        <div key={i} className="px-1 py-0.5">
          {icerik}
        </div>
      );
    })}
  </div>
);

export const AIAsistanYanPanel = ({ acik, onKapat, baglam }: Props) => {
  const nav = useNavigate();
  const isPremium = useIsPremium();
  const [mesajlar, setMesajlar] = useState<PanelMesaj[]>(() => [ilkMesaj(baglam)]);
  const [girdi, setGirdi] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [kotaBitti, setKotaBitti] = useState(false);
  const [kalan, setKalan] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const oncekiSoruRef = useRef<string | undefined>(baglam?.soruBaslik);

  useEffect(() => {
    if (!acik) {
      setHata(null);
    }
  }, [acik]);

  // Soru değişirse konuşmayı sıfırla — yeni sorunun bağlamıyla taze hoşgeldin
  useEffect(() => {
    if (baglam?.soruBaslik !== oncekiSoruRef.current) {
      oncekiSoruRef.current = baglam?.soruBaslik;
      setMesajlar([ilkMesaj(baglam)]);
      setKotaBitti(false);
      setHata(null);
    }
  }, [baglam?.soruBaslik, baglam]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mesajlar, yukleniyor]);

  const gonder = async () => {
    const metin = girdi.trim();
    if (!metin || yukleniyor || kotaBitti) return;
    setHata(null);
    const yeni: PanelMesaj[] = [...mesajlar, { role: 'user', content: metin }];
    setMesajlar(yeni);
    setGirdi('');
    setYukleniyor(true);
    try {
      const sonuc = await aiAsistan({
        // İlk hoşgeldin mesajı backend'e geçmesin (her oturumda yeni oluşur)
        // ve kaynaklar field'ı API'ye gitmesin — sadece role+content
        mesajlar: yeni.slice(1).map((m): AIMesaj => ({ role: m.role, content: m.content })),
        baglam,
      });
      setMesajlar((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          content: sonuc.metin,
          kaynaklar: sonuc.kaynaklar,
        },
      ]);
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
        className="fixed inset-0 bg-ink/30 dark:bg-black/50 backdrop-blur-sm z-40 transition-opacity"
      />
      <aside className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-bg-tint border-l border-line z-50 flex flex-col shadow-2xl">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-gradient-to-r from-premium-soft to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-premium-soft to-premium-soft flex items-center justify-center">
              <Icon name="Sparkles" size={14} className="text-premium-deep" />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-tight">AI Asistan</div>
              <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-premium-deep">
                {kalanRozet}
              </div>
            </div>
          </div>
          <button
            onClick={onKapat}
            className="p-1.5 rounded-lg hover:bg-line-soft transition"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Aktif soru bağlamı — AI bu soruyu hafızaya aldı */}
        {baglam?.soruBaslik && (
          <div className="px-5 py-2.5 border-b border-line bg-bg-tint/60">
            <div className="flex items-baseline gap-2">
              <Icon name="Bookmark" size={11} className="text-ink-mute flex-shrink-0 self-center" />
              <div className="min-w-0 flex-1">
                <div className="text-[9px] tracking-[0.22em] uppercase text-ink-mute font-bold leading-none mb-0.5">
                  Aktif soru
                </div>
                <div className="text-[12px] font-semibold text-ink line-clamp-1">
                  {baglam.soruBaslik}
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {mesajlar.map((m, i) => {
            return (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
 m.role === 'user'
 ? 'bg-ink text-bg '
 : 'bg-surface border border-line'
 }`}
                >
                  {m.role === 'user' ? (
                    <div className="text-sm font-medium whitespace-pre-wrap">{m.content}</div>
                  ) : (
                    <>
                      <MarkdownLite text={m.content} />
                      {m.kaynaklar && m.kaynaklar.length > 0 && (
                        <KaynakListesi kaynaklar={m.kaynaklar} />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {yukleniyor && (
            <div className="flex justify-start">
              <div className="bg-surface border border-line rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-ink-mute font-medium">
                <Icon name="Loader2" size={14} className="animate-spin" />
                Yazıyor...
              </div>
            </div>
          )}
          {kotaBitti && !isPremium && (
            <div className="bg-gradient-to-br from-premium-soft to-premium-soft border border-premium-soft dark:border-premium-deep/40 rounded-2xl p-4 text-center">
              <Icon
                name="Sparkles"
                size={18}
                className="text-premium-deep mx-auto mb-2"
              />
              <div className="text-sm font-display font-bold mb-1">
                Bugünkü 3 hakkın doldu
              </div>
              <p className="text-[12px] text-ink-soft leading-relaxed mb-3">
                Yarın tekrar 3 yeni hak. Premium ile sınırsız sohbet et, AI yanlış analizi
                ve adım adım çözüm anlatımı da açılır.
              </p>
              <button
                onClick={() => {
                  onKapat();
                  nav('/premium');
                }}
                className="bg-ink text-bg px-4 py-2 text-[11px] tracking-wide uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition inline-flex items-center gap-1.5"
              >
                <Icon name="Sparkles" size={12} />
                Premium&apos;u Keşfet
              </button>
            </div>
          )}
          {hata && !kotaBitti && (
            <div className="text-sm text-danger dark:text-danger font-medium px-4 py-2 bg-danger-soft dark:bg-danger/20 rounded-lg">
              {hata}
            </div>
          )}
        </div>

        <div className="border-t border-line p-3 bg-surface">
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
              className="flex-1 resize-none bg-bg-tint border border-line focus:border-ink focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none rounded-xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={gonder}
              disabled={!girdi.trim() || yukleniyor || (kotaBitti && !isPremium)}
              className="bg-ink text-bg p-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Icon name="ArrowUp" size={16} />
            </button>
          </div>
          <div className="text-[10px] text-ink-quiet font-medium mt-1.5 px-1">
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
