import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import {
  premiumAyarla,
  premiumHediyeEt,
  premiumIptal,
  premiumUzat,
} from '../lib/admin-kullanicilar';

type Mod = 'hediye' | 'uzat' | 'iptal';

interface Props {
  userId: string;
  kullaniciAd: string;
  mevcutBitis: string | null;
  premiumAktif: boolean;
  onKapat: () => void;
  onGuncellendi: (yeniBitis: string | null) => void;
}

const PRESET_AYLAR: { etiket: string; ay: number }[] = [
  { etiket: '1 ay', ay: 1 },
  { etiket: '3 ay', ay: 3 },
  { etiket: '6 ay', ay: 6 },
  { etiket: '1 yıl', ay: 12 },
  { etiket: '2 yıl', ay: 24 },
];

const tarihInputFormat = (d: Date): string => d.toISOString().split('T')[0];

const tarihGoster = (s: string | null): string => {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const PremiumAyarlaModal = ({
  userId,
  kullaniciAd,
  mevcutBitis,
  premiumAktif,
  onKapat,
  onGuncellendi,
}: Props) => {
  const [mod, setMod] = useState<Mod>(premiumAktif ? 'uzat' : 'hediye');
  const [seciliAy, setSeciliAy] = useState<number | null>(1);
  const [ozelTarih, setOzelTarih] = useState('');
  const [hata, setHata] = useState<string | null>(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onKapat();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onKapat]);

  const uygula = async () => {
    setHata(null);
    setKaydediliyor(true);
    try {
      let yeniBitis: string | null = null;

      if (mod === 'iptal') {
        await premiumIptal(userId);
        yeniBitis = null;
      } else if (ozelTarih) {
        const tarih = new Date(ozelTarih);
        if (isNaN(tarih.getTime())) {
          throw new Error('Geçersiz tarih.');
        }
        yeniBitis = await premiumAyarla(userId, tarih);
      } else if (seciliAy !== null) {
        if (mod === 'hediye') {
          yeniBitis = await premiumHediyeEt(userId, seciliAy);
        } else {
          yeniBitis = await premiumUzat(userId, mevcutBitis, seciliAy);
        }
      } else {
        throw new Error('Süre veya tarih seç.');
      }

      onGuncellendi(yeniBitis);
      onKapat();
    } catch (e) {
      setHata(`İşlem başarısız: ${(e as Error).message}`);
    } finally {
      setKaydediliyor(false);
    }
  };

  const onaylayicilik = () => {
    if (mod === 'iptal') {
      return `${kullaniciAd} adlı kullanıcının premiumunu iptal et`;
    }
    if (ozelTarih) {
      return `Premium'u ${tarihGoster(ozelTarih)} tarihine kadar ${mod === 'hediye' ? 'hediye et' : 'uzat'}`;
    }
    if (seciliAy) {
      return `${seciliAy} ay ${mod === 'hediye' ? 'hediye et' : 'uzat'}`;
    }
    return '';
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
      onClick={onKapat}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              Premium Yönetimi
            </h2>
            <p className="text-[12px] text-stone-500 dark:text-zinc-500 mt-0.5">
              <strong>{kullaniciAd}</strong> · Mevcut bitiş: {tarihGoster(mevcutBitis)}
            </p>
          </div>
          <button
            onClick={onKapat}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Mod seçimi */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMod('hediye')}
            className={`px-3 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg border transition ${
              mod === 'hediye'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800'
            }`}
          >
            Hediye Et
          </button>
          <button
            type="button"
            onClick={() => setMod('uzat')}
            disabled={!premiumAktif}
            className={`px-3 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed ${
              mod === 'uzat'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800'
            }`}
            title={!premiumAktif ? 'Aktif premium yok, hediye et' : ''}
          >
            Süre Uzat
          </button>
          <button
            type="button"
            onClick={() => setMod('iptal')}
            disabled={!premiumAktif}
            className={`px-3 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed ${
              mod === 'iptal'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800'
            }`}
            title={!premiumAktif ? 'Aktif premium yok' : ''}
          >
            İptal Et
          </button>
        </div>

        {/* Mod açıklaması */}
        <div className="text-[12px] text-stone-600 dark:text-zinc-400 px-3 py-2 bg-stone-50 dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-lg">
          {mod === 'hediye' && 'Bugünden başlayan yeni premium üyelik açar. Mevcut premium varsa üzerine yazılır.'}
          {mod === 'uzat' && 'Mevcut premium bitişine ek süre ekler.'}
          {mod === 'iptal' && 'Premium üyeliği derhal sonlandırır (bitiş tarihi siliniyor).'}
        </div>

        {/* Süre seçimi (iptal modunda gösterilmez) */}
        {mod !== 'iptal' && (
          <>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-2">
                Hızlı Seç
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_AYLAR.map((p) => (
                  <button
                    key={p.ay}
                    type="button"
                    onClick={() => {
                      setSeciliAy(p.ay);
                      setOzelTarih('');
                    }}
                    className={`px-3 py-1.5 text-[12px] font-bold rounded-lg border transition ${
                      seciliAy === p.ay && !ozelTarih
                        ? 'bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-stone-900 dark:border-zinc-100'
                        : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {p.etiket}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-2">
                veya Özel Tarih
              </label>
              <input
                type="date"
                value={ozelTarih}
                onChange={(e) => {
                  setOzelTarih(e.target.value);
                  if (e.target.value) setSeciliAy(null);
                }}
                min={tarihInputFormat(new Date())}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-sm font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400"
              />
            </div>
          </>
        )}

        {/* Onay özeti */}
        <div
          className={`text-[13px] px-3 py-2.5 rounded-lg border font-medium ${
            mod === 'iptal'
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
              : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300'
          }`}
        >
          <Icon name={mod === 'iptal' ? 'AlertTriangle' : 'Info'} size={13} className="inline mr-1.5" />
          {onaylayicilik()}
        </div>

        {hata && (
          <div className="flex items-start gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-[12px] text-rose-800 dark:text-rose-300 font-medium">
            <Icon name="AlertCircle" size={14} className="flex-shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onKapat}
            className="px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold border border-stone-300 dark:border-zinc-700 rounded-lg hover:bg-stone-50 dark:hover:bg-zinc-800 transition"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={uygula}
            disabled={kaydediliyor || (mod !== 'iptal' && !seciliAy && !ozelTarih)}
            className={`inline-flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              mod === 'iptal'
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90'
            }`}
          >
            <Icon
              name={kaydediliyor ? 'Loader2' : mod === 'iptal' ? 'AlertTriangle' : 'Sparkles'}
              size={12}
              className={kaydediliyor ? 'animate-spin' : ''}
            />
            {kaydediliyor
              ? 'Uygulanıyor'
              : mod === 'iptal'
                ? 'İptal Et'
                : mod === 'hediye'
                  ? 'Hediye Et'
                  : 'Süreyi Uzat'}
          </button>
        </div>
      </div>
    </div>
  );
};
