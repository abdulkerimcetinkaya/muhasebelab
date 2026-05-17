import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import {
  basvuruGonder,
  benimBasvurumYukle,
  DURUM_ETIKETLERI,
  UNVAN_ETIKETLERI,
  type KatkiciBasvuru,
  type YeniBasvuru,
} from '../lib/katkici';
import type { KatkiciUnvan } from '../lib/database.types';

const tarihFormat = (s: string | null): string => {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const KatkiciBasvuruSayfasi = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [yukleniyor, setYukleniyor] = useState(true);
  const [mevcut, setMevcut] = useState<KatkiciBasvuru | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [basarili, setBasarili] = useState(false);

  // Form
  const [adSoyad, setAdSoyad] = useState('');
  const [unvan, setUnvan] = useState<KatkiciUnvan>('akademisyen');
  const [kurum, setKurum] = useState('');
  const [iletisim, setIletisim] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);

  useEffect(() => {
    if (!user) {
      nav('/giris?redirect=/katkici-basvuru', { replace: true });
      return;
    }
    setYukleniyor(true);
    benimBasvurumYukle(user.id)
      .then((b) => {
        setMevcut(b);
        if (b) {
          setAdSoyad(b.ad_soyad);
          setUnvan(b.unvan);
          setKurum(b.kurum);
          setIletisim(b.iletisim_email);
          setAciklama(b.aciklama ?? '');
        }
      })
      .catch(() => setMevcut(null))
      .finally(() => setYukleniyor(false));
  }, [user, nav]);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adSoyad.trim().length < 3) {
      setHata('Ad-soyad gerekli.');
      return;
    }
    if (kurum.trim().length === 0) {
      setHata('Kurum gerekli.');
      return;
    }
    if (iletisim.trim().length === 0) {
      setHata('İletişim email gerekli.');
      return;
    }
    setGonderiliyor(true);
    setHata(null);
    try {
      const yeni: YeniBasvuru = {
        ad_soyad: adSoyad.trim(),
        unvan,
        kurum: kurum.trim(),
        iletisim_email: iletisim.trim(),
        aciklama: aciklama.trim() || null,
      };
      await basvuruGonder(yeni);
      setBasarili(true);
      // Sayfayı yenile
      const yeniBasvuru = user ? await benimBasvurumYukle(user.id) : null;
      setMevcut(yeniBasvuru);
    } catch (e) {
      setHata(`Gönderilemedi: ${(e as Error).message}`);
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <Link
        to="/profil"
        className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.2em] uppercase font-bold text-ink-mute hover:text-ink transition mb-6"
      >
        <Icon name="ArrowLeft" size={12} />
        Profil
      </Link>

      <h1 className="font-display text-4xl font-bold tracking-tight">
        Bir Öğrenciye Dokunun
      </h1>
      <p className="text-ink-soft mt-3 leading-relaxed">
        Yıllarınızı bu mesleğe verdiniz. Yevmiye defterindeki bir kaydın
        arkasındaki mantığı, bir kursta öğrenilemeyen tecrübeyi, mesleğin
        içinde edindiniz. Şimdi <strong>aynı yola çıkmak üzere olan binlerce
        öğrenci</strong> var — bir akademisyenin, bir YMM'nin, bir SMMM'nin
        elinden çıkmış bir soruya, bir senaryoya ihtiyacı olan binlerce öğrenci.
        MuhasebeAkademi'a ekleyeceğiniz her soru, onlardan birinin kafasında
        çakacak bir kıvılcım.
      </p>
      <p className="text-ink-mute mt-3 text-[13.5px] leading-relaxed">
        Küçük bir teşekkür olarak —
        <strong className="text-ink-soft"> 5 onaylı sorudan
        sonra 1 yıl Premium hediyemizdir.</strong>
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {[
          { ikon: 'GraduationCap', baslik: 'Bir Tecrübeyi Aktarın', metin: 'Yıllar içinde edindiğiniz sezgi, bir öğrenciye yıllar kazandırır' },
          { ikon: 'BadgeCheck', baslik: 'Adınız Anılır', metin: 'Eklediğiniz her soruda adınız ve unvanınız öğrencinin önünde durur' },
          { ikon: 'Sparkles', baslik: 'Küçük Teşekkürümüz', metin: '5 onaylı katkıdan sonra 1 yıl Premium — değil değer, kıymet bilmek' },
        ].map((k) => (
          <div
            key={k.baslik}
            className="bg-surface border border-line rounded-xl p-4"
          >
            <Icon name={k.ikon === 'GraduationCap' ? 'BadgeCheck' : k.ikon} size={20} className="text-brand dark:text-brand-mute" />
            <div className="font-display text-[15px] font-bold mt-2">{k.baslik}</div>
            <div className="text-[12.5px] text-ink-soft mt-1 leading-relaxed">
              {k.metin}
            </div>
          </div>
        ))}
      </div>

      {yukleniyor ? (
        <div className="text-sm text-ink-quiet">Yükleniyor…</div>
      ) : mevcut ? (
        <div className="space-y-4">
          <div
            className={`p-5 rounded-xl border ${
 mevcut.durum === 'onayli'
 ? 'bg-success-soft border-success-soft'
 : mevcut.durum === 'reddedildi'
 ? 'bg-danger-soft border-danger-soft'
 : 'bg-premium-soft border-premium-soft'
 }`}
          >
            <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold">
              <Icon
                name={
                  mevcut.durum === 'onayli'
                    ? 'BadgeCheck'
                    : mevcut.durum === 'reddedildi'
                      ? 'XCircle'
                      : 'Hourglass'
                }
                size={13}
              />
              Başvuru durumu: {DURUM_ETIKETLERI[mevcut.durum]}
            </div>
            <div className="mt-2 text-[13.5px]">
              <strong>{mevcut.ad_soyad}</strong> · {UNVAN_ETIKETLERI[mevcut.unvan]}
              {mevcut.kurum && mevcut.kurum !== '—' && ` · ${mevcut.kurum}`}
            </div>
            <div className="text-[12px] text-ink-soft mt-1">
              Başvuru: {tarihFormat(mevcut.created_at)}
              {mevcut.karar_at && ` · Karar: ${tarihFormat(mevcut.karar_at)}`}
            </div>
            {mevcut.red_sebep && (
              <div className="mt-3 text-[13px] text-danger font-medium">
                <strong>Red sebebi:</strong> {mevcut.red_sebep}
              </div>
            )}
            {mevcut.durum === 'onayli' && (
              <div className="mt-3 flex items-center gap-2">
                <Link
                  to="/katkici/soru/yeni"
                  className="inline-flex items-center gap-2 bg-success hover:bg-success text-bg px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg transition"
                >
                  <Icon name="PlusCircle" size={12} />
                  Soru Ekle
                </Link>
              </div>
            )}
          </div>

          {mevcut.durum === 'reddedildi' && (
            <div className="text-[13px] text-ink-soft">
              Red gerekçesini değerlendirip yeniden başvurabilirsin. Aşağıdaki formu
              güncelleyip tekrar gönder.
            </div>
          )}
        </div>
      ) : null}

      {(!mevcut || mevcut.durum === 'reddedildi') && !basarili && (
        <form
          onSubmit={gonder}
          className="mt-8 bg-surface border border-line rounded-2xl p-6 space-y-4"
        >
          <h2 className="font-display text-xl font-bold tracking-tight">
            {mevcut ? 'Yeniden Başvur' : 'Başvuru Formu'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute mb-1.5">
                Ad Soyad *
              </label>
              <input
                type="text"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                required
                maxLength={120}
                className="w-full px-3 py-2 bg-bg-tint border border-line-strong rounded-lg text-sm font-medium outline-none focus:border-ink"
                placeholder="Doç. Dr. Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute mb-1.5">
                Unvan *
              </label>
              <select
                value={unvan}
                onChange={(e) => setUnvan(e.target.value as KatkiciUnvan)}
                required
                className="w-full px-3 py-2 bg-bg-tint border border-line-strong rounded-lg text-sm font-medium outline-none focus:border-ink"
              >
                <option value="akademisyen">Akademisyen</option>
                <option value="ymm">YMM</option>
                <option value="smmm">SMMM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute mb-1.5">
              Kurum / Bağlı Olduğunuz Yer *
            </label>
            <input
              type="text"
              value={kurum}
              onChange={(e) => setKurum(e.target.value)}
              required
              maxLength={200}
              className="w-full px-3 py-2 bg-bg-tint border border-line-strong rounded-lg text-sm font-medium outline-none focus:border-ink"
              placeholder="Boğaziçi Üniversitesi · Ankara SMMM Odası · X YMM Bürosu"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute mb-1.5">
              İletişim Email *
            </label>
            <input
              type="email"
              value={iletisim}
              onChange={(e) => setIletisim(e.target.value)}
              required
              maxLength={200}
              className="w-full px-3 py-2 bg-bg-tint border border-line-strong rounded-lg text-sm font-mono outline-none focus:border-ink"
              placeholder="profesyonel@kurum.edu.tr"
            />
            <div className="text-[11px] text-ink-mute mt-1">
              Akademik veya mesleki email tercih edilir (doğrulama için).
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-ink-mute mb-1.5">
              Açıklama (opsiyonel)
            </label>
            <textarea
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              rows={5}
              maxLength={2000}
              className="w-full px-3 py-2 bg-bg-tint border border-line-strong rounded-lg text-sm font-medium outline-none focus:border-ink resize-none leading-relaxed"
              placeholder="Eklemek istediğin bir not varsa — uzmanlık alanın, hangi konularda soru hazırlamayı düşünüyorsun?"
            />
            <div className="text-[11px] text-ink-quiet mt-1 text-right font-mono">
              {aciklama.length} / 2000
            </div>
          </div>

          {hata && (
            <div className="flex items-start gap-2 p-3 bg-danger-soft border border-danger-soft rounded-lg text-[13px] text-danger font-medium">
              <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5" />
              <span>{hata}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={gonderiliyor}
            className="w-full inline-flex items-center justify-center gap-2 bg-ink text-bg px-5 py-3 text-[11px] tracking-[0.2em] uppercase font-bold rounded-lg hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
          >
            <Icon
              name={gonderiliyor ? 'Loader2' : 'Send'}
              size={12}
              className={gonderiliyor ? 'animate-spin' : ''}
            />
            {gonderiliyor ? 'Gönderiliyor' : 'Başvuruyu Gönder'}
          </button>
        </form>
      )}

      {basarili && (
        <div className="mt-6 p-5 bg-success-soft border border-success-soft rounded-xl text-success">
          <Icon name="CheckCircle2" size={18} className="inline mr-2" />
          <strong>Başvurun alındı.</strong> Admin inceleyip karar verince haberdar olacaksın.
        </div>
      )}
    </div>
  );
};
