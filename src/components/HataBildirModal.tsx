import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useEsc } from '../lib/hooks/use-esc';

interface Props {
  soruId: string;
  soruBaslik: string;
  onKapat: () => void;
}

type Durum = 'form' | 'gonderiliyor' | 'gonderildi' | 'hata';

export const HataBildirModal = ({ soruId, soruBaslik, onKapat }: Props) => {
  const { user } = useAuth();
  const [aciklama, setAciklama] = useState('');
  const [durum, setDurum] = useState<Durum>('form');
  const [hataMesaj, setHataMesaj] = useState('');

  useEsc(onKapat);

  useEffect(() => {
    if (durum !== 'gonderildi') return;
    const t = setTimeout(onKapat, 2200);
    return () => clearTimeout(t);
  }, [durum, onKapat]);

  const gonder = async () => {
    if (!user) return;
    const metin = aciklama.trim();
    if (metin.length < 10) {
      setHataMesaj('En az 10 karakter yaz.');
      return;
    }
    setDurum('gonderiliyor');
    setHataMesaj('');
    try {
      const insertPromise = supabase.from('soru_hatalari').insert({
        soru_id: soruId,
        user_id: user.id,
        aciklama: metin,
      });
      const timeoutPromise = new Promise<{ error: { message: string } }>((resolve) =>
        setTimeout(
          () => resolve({ error: { message: 'Sunucu yanıt vermedi (15s). İnternetini kontrol et.' } }),
          15000,
        ),
      );
      const { error } = await Promise.race([insertPromise, timeoutPromise]);
      if (error) {
        setDurum('hata');
        setHataMesaj(error.message);
        return;
      }
      setDurum('gonderildi');
    } catch (e) {
      setDurum('hata');
      setHataMesaj(e instanceof Error ? e.message : 'Bilinmeyen hata.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4"
      onClick={onKapat}
    >
      <div
        className="bg-stone-50 dark:bg-zinc-900 max-w-lg w-full rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-stone-900/10 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="AlertCircle" size={18} className="text-rose-600" />
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                Hata Bildir
              </div>
              <div className="font-display text-lg font-bold tracking-tight truncate max-w-[24rem]">
                {soruBaslik}
              </div>
            </div>
          </div>
          <button
            onClick={onKapat}
            className="text-stone-500 hover:text-stone-900 dark:hover:text-zinc-100"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="text-center py-4">
              <p className="text-sm text-stone-700 dark:text-zinc-300 font-medium mb-4">
                Hata bildirmek için giriş yapman gerekiyor.
              </p>
              <Link
                to="/giris"
                onClick={onKapat}
                className="inline-flex items-center gap-2 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition"
              >
                <Icon name="LogIn" size={14} />
                Giriş Yap
              </Link>
            </div>
          ) : durum === 'gonderildi' ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 mb-3">
                <Icon
                  name="CheckCircle2"
                  size={24}
                  className="text-emerald-700 dark:text-emerald-400"
                />
              </div>
              <div className="font-display text-lg font-bold tracking-tight mb-1">
                Bildirim alındı.
              </div>
              <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium">
                Teşekkürler. En kısa sürede inceleyeceğiz.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-stone-600 dark:text-zinc-400 font-medium mb-3 leading-relaxed">
                Hangi hatayı fark ettin? Yanlış hesap kodu, hatalı KDV, eksik açıklama vs.
              </p>
              <textarea
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Örn: 391 hesabı yerine 191 olmalı, çünkü..."
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 focus:border-stone-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 outline-none text-sm rounded-lg font-medium resize-none"
                disabled={durum === 'gonderiliyor'}
              />
              <div className="flex items-center justify-between mt-1">
                <div className="text-[10px] text-stone-400 dark:text-zinc-600 font-mono">
                  {aciklama.length} / 1000
                </div>
                {hataMesaj && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                    {hataMesaj}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={onKapat}
                  className="flex-1 px-4 py-2.5 border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 text-sm font-bold rounded-lg transition"
                  disabled={durum === 'gonderiliyor'}
                >
                  İptal
                </button>
                <button
                  onClick={gonder}
                  disabled={durum === 'gonderiliyor' || aciklama.trim().length < 10}
                  className="flex-1 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {durum === 'gonderiliyor' ? (
                    <>
                      <Icon name="Loader2" size={14} className="animate-spin" />
                      Gönderiliyor…
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={14} />
                      Gönder
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
