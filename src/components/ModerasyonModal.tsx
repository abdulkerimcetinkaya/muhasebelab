import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { kullaniciBanla, kullaniciSil, kullaniciUnbanla } from '../lib/admin-kullanicilar';

type Mod = 'banla' | 'unbanla' | 'sil';

interface Props {
  userId: string;
  kullaniciAd: string;
  banli: boolean;
  banSebep: string | null;
  onKapat: () => void;
  onBanGuncellendi: (banli: boolean, sebep: string | null, tarih: string | null) => void;
  onSilindi: () => void;
}

export const ModerasyonModal = ({
  userId,
  kullaniciAd,
  banli,
  banSebep,
  onKapat,
  onBanGuncellendi,
  onSilindi,
}: Props) => {
  const [mod, setMod] = useState<Mod>(banli ? 'unbanla' : 'banla');
  const [sebep, setSebep] = useState('');
  const [silOnay, setSilOnay] = useState(''); // "SİL" yazılmalı
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
      if (mod === 'banla') {
        if (!sebep.trim()) {
          throw new Error('Ban sebebi zorunlu.');
        }
        await kullaniciBanla(userId, sebep.trim());
        onBanGuncellendi(true, sebep.trim(), new Date().toISOString());
        onKapat();
      } else if (mod === 'unbanla') {
        await kullaniciUnbanla(userId);
        onBanGuncellendi(false, null, null);
        onKapat();
      } else {
        if (silOnay !== 'SİL') {
          throw new Error('Onay için "SİL" yazmalısın.');
        }
        await kullaniciSil(userId);
        onSilindi();
      }
    } catch (e) {
      setHata(`İşlem başarısız: ${(e as Error).message}`);
    } finally {
      setKaydediliyor(false);
    }
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
              Moderasyon
            </h2>
            <p className="text-[12px] text-stone-500 dark:text-zinc-500 mt-0.5">
              <strong>{kullaniciAd}</strong>
              {banli && (
                <span className="ml-2 text-rose-700 dark:text-rose-400">
                  · banlı: {banSebep ?? '—'}
                </span>
              )}
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
            onClick={() => setMod('banla')}
            disabled={banli}
            className={`px-3 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed ${
              mod === 'banla' && !banli
                ? 'bg-amber-600 text-white border-amber-600'
                : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800'
            }`}
          >
            Banla
          </button>
          <button
            type="button"
            onClick={() => setMod('unbanla')}
            disabled={!banli}
            className={`px-3 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed ${
              mod === 'unbanla' && banli
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800'
            }`}
          >
            Banı Kaldır
          </button>
          <button
            type="button"
            onClick={() => setMod('sil')}
            className={`px-3 py-2.5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg border transition ${
              mod === 'sil'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'border-stone-300 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800'
            }`}
          >
            Sil
          </button>
        </div>

        {/* Mod açıklaması */}
        <div className="text-[12px] text-stone-600 dark:text-zinc-400 px-3 py-2 bg-stone-50 dark:bg-zinc-800/40 border border-stone-200 dark:border-zinc-700 rounded-lg leading-relaxed">
          {mod === 'banla' && 'Kullanıcı yeni soru çözemez, hata bildiremez. Profil görüntüleme açık kalır. Geri alınabilir.'}
          {mod === 'unbanla' && 'Banı kaldırır, kullanıcı tekrar tüm özelliklere erişebilir.'}
          {mod === 'sil' && (
            <span className="text-rose-700 dark:text-rose-400">
              <strong>Geri alınamaz.</strong> Kullanıcı + ilerleme + rozetler + aktivite + hata bildirimleri silinir. Ödemeler audit için tutulur ama bağlantı kopar.
            </span>
          )}
        </div>

        {/* Banlama sebebi */}
        {mod === 'banla' && (
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 mb-2">
              Sebep
            </label>
            <textarea
              value={sebep}
              onChange={(e) => setSebep(e.target.value)}
              autoFocus
              rows={2}
              required
              placeholder="Spam, çoklu hesap, bot davranışı..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-lg text-[13px] font-medium outline-none focus:border-stone-900 dark:focus:border-zinc-400 resize-none"
            />
          </div>
        )}

        {/* Silme onayı */}
        {mod === 'sil' && (
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-rose-700 dark:text-rose-400 mb-2">
              Onay için "SİL" yaz
            </label>
            <input
              type="text"
              value={silOnay}
              onChange={(e) => setSilOnay(e.target.value)}
              autoFocus
              placeholder="SİL"
              className="w-full px-3 py-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 rounded-lg text-[13px] font-mono font-bold outline-none focus:border-rose-600"
            />
          </div>
        )}

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
            disabled={
              kaydediliyor ||
              (mod === 'banla' && !sebep.trim()) ||
              (mod === 'sil' && silOnay !== 'SİL')
            }
            className={`inline-flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-white ${
              mod === 'sil'
                ? 'bg-rose-600 hover:bg-rose-700'
                : mod === 'unbanla'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            <Icon
              name={kaydediliyor ? 'Loader2' : mod === 'sil' ? 'Trash2' : mod === 'unbanla' ? 'BadgeCheck' : 'AlertTriangle'}
              size={12}
              className={kaydediliyor ? 'animate-spin' : ''}
            />
            {kaydediliyor
              ? 'Uygulanıyor'
              : mod === 'sil'
                ? 'Kalıcı Sil'
                : mod === 'unbanla'
                  ? 'Banı Kaldır'
                  : 'Banla'}
          </button>
        </div>
      </div>
    </div>
  );
};
