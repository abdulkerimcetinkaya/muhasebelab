import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

interface Props {
  acik: boolean;
  secilenMetin: string;
  baslangicAciklama: string;
  onKaydet: (aciklama: string) => void;
  onSil: () => void;
  onKapat: () => void;
}

/**
 * Admin sözlük modalı — IcerikEditor toolbar butonundan açılır.
 * Seçili kelime gösterilir, kullanıcı açıklamayı yazar.
 * - `baslangicAciklama` boş değilse "düzenleme" modu (Sil butonu görünür).
 */
export const SozlukAdminModal = ({
  acik,
  secilenMetin,
  baslangicAciklama,
  onKaydet,
  onSil,
  onKapat,
}: Props) => {
  const [aciklama, setAciklama] = useState(baslangicAciklama);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (acik) {
      setAciklama(baslangicAciklama);
      // Bir tick sonra focus — modal mount edildikten sonra
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [acik, baslangicAciklama]);

  useEffect(() => {
    if (!acik) return;
    const escYakala = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onKapat();
    };
    document.addEventListener('keydown', escYakala);
    return () => document.removeEventListener('keydown', escYakala);
  }, [acik, onKapat]);

  if (!acik) return null;

  const kaydet = () => {
    const temizlenmis = aciklama.trim();
    if (!temizlenmis) return;
    onKaydet(temizlenmis);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onKapat();
      }}
    >
      <div
        className="w-full max-w-md bg-bg border border-line rounded-2xl shadow-xl"
        role="dialog"
        aria-label="Sözlük açıklaması"
      >
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-ink-mute font-bold mb-1.5">
              Sözlük Açıklaması
            </div>
            <h3 className="font-display text-[20px] font-bold tracking-tight text-ink leading-tight break-words">
              {secilenMetin || '—'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="flex-shrink-0 p-1.5 rounded-md text-ink-mute hover:text-ink hover:bg-bg-tint transition"
            aria-label="Kapat"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="px-5 pb-3">
          <label
            htmlFor="sozluk-aciklama"
            className="block text-[11px] tracking-[0.18em] uppercase text-ink-mute font-bold mb-2"
          >
            Açıklama
          </label>
          <textarea
            id="sozluk-aciklama"
            ref={inputRef}
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                kaydet();
              }
            }}
            rows={4}
            placeholder="Bu kelime/kavramın kısa açıklamasını yaz…"
            className="w-full bg-bg-tint border border-line-strong focus:border-ink focus:ring-2 focus:ring-blue-500/20 outline-none px-3 py-2.5 rounded-lg text-[13.5px] text-ink leading-relaxed resize-none transition"
          />
          <p className="text-[11px] text-ink-mute mt-1.5">
            Cmd+Enter ile hızlı kaydet.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-line-soft">
          {baslangicAciklama ? (
            <button
              type="button"
              onClick={onSil}
              className="inline-flex items-center gap-1.5 text-[12px] text-danger font-semibold hover:underline"
            >
              <Icon name="Trash2" size={12} />
              Sözlükten çıkar
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onKapat}
              className="px-4 py-2 rounded-lg text-[12.5px] font-semibold text-ink-soft hover:bg-bg-tint transition"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={kaydet}
              disabled={!aciklama.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ink text-bg text-[12.5px] font-bold hover:opacity-90 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="Save" size={12} />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
