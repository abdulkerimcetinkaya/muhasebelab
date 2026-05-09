import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { adminEmailGonder } from '../lib/admin-kullanicilar';

interface Props {
  to: string;
  kullaniciAd: string;
  onKapat: () => void;
}

export const EmailGonderModal = ({ to, kullaniciAd, onKapat }: Props) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [hata, setHata] = useState<string | null>(null);
  const [basarili, setBasarili] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onKapat();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onKapat]);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      setHata('Konu ve mesaj zorunlu.');
      return;
    }
    setGonderiliyor(true);
    setHata(null);
    try {
      await adminEmailGonder(to, subject.trim(), body.trim(), false);
      setBasarili(true);
      setTimeout(() => onKapat(), 1500);
    } catch (e) {
      setHata((e as Error).message);
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
      onClick={onKapat}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-line rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              E-posta Gönder
            </h2>
            <p className="text-[12px] text-ink-mute mt-0.5">
              <strong>{kullaniciAd}</strong> · {to}
            </p>
          </div>
          <button
            onClick={onKapat}
            className="p-1.5 hover:bg-surface-2 rounded-lg transition"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <form onSubmit={gonder} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute mb-1.5">
              Konu
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              autoFocus
              required
              maxLength={120}
              className="w-full px-3 py-2 bg-bg-tint border border-line-strong rounded-lg text-sm font-medium outline-none focus:border-ink"
              placeholder="MuhasebeLab — Önemli bir bilgilendirme"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute mb-1.5">
              Mesaj
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={8}
              maxLength={5000}
              className="w-full px-3 py-2 bg-bg-tint border border-line-strong rounded-lg text-sm font-medium outline-none focus:border-ink resize-none leading-relaxed"
              placeholder="Merhaba,&#10;&#10;..."
            />
            <div className="text-[10px] text-ink-quiet mt-1 text-right font-mono">
              {body.length} / 5000
            </div>
          </div>

          <div className="text-[11px] text-ink-mute px-3 py-2 bg-bg-tint border border-line rounded-lg">
            <Icon name="Info" size={11} className="inline mr-1.5" />
            Bu özelliğin çalışması için Supabase secret olarak{' '}
            <code className="font-mono">RESEND_API_KEY</code> ve{' '}
            <code className="font-mono">RESEND_FROM_EMAIL</code> tanımlı olmalı.
          </div>

          {hata && (
            <div className="flex items-start gap-2 p-2.5 bg-danger-soft border border-danger-soft rounded-lg text-[12px] text-danger font-medium">
              <Icon name="AlertCircle" size={14} className="flex-shrink-0 mt-0.5" />
              <span>{hata}</span>
            </div>
          )}

          {basarili && (
            <div className="flex items-start gap-2 p-2.5 bg-success-soft border border-success-soft rounded-lg text-[12px] text-success font-medium">
              <Icon name="CheckCircle2" size={14} className="flex-shrink-0 mt-0.5" />
              <span>E-posta gönderildi.</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onKapat}
              className="px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold border border-line-strong rounded-lg hover:bg-bg-tint transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={gonderiliyor || basarili || !subject.trim() || !body.trim()}
              className="inline-flex items-center gap-2 bg-ink text-bg px-5 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon
                name={gonderiliyor ? 'Loader2' : 'Send'}
                size={12}
                className={gonderiliyor ? 'animate-spin' : ''}
              />
              {gonderiliyor ? 'Gönderiliyor' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
