import { useNavigate, useParams } from 'react-router-dom';

/**
 * Karne QR'ı taranınca buraya gelinir — şu an gerçek bir doğrulama veritabanı
 * sorgusu yapılmıyor (verifikasyon endpoint'i ayrı PR'da gelecek). Bu stub
 * sayfası boş 404'ten kaçınmak ve "karne sahiden MuhasebeAkademi tarafından
 * üretildi" güvencesini görsel olarak vermek için var.
 *
 * URL pattern: /k/:karneId — karneId 8 haneli hex hash (karne-pdf.tsx'te üretilir).
 * Şu an karneId'i doğrulamıyoruz, sadece minimal brand sayfası gösteriyoruz.
 */
export const KarneStubSayfasi = () => {
  const { karneId } = useParams<{ karneId: string }>();
  const nav = useNavigate();

  return (
    <main className="min-h-[80vh] max-w-2xl mx-auto px-5 sm:px-8 py-20">
      <div className="text-[10px] tracking-[0.32em] uppercase text-ink-mute font-bold mb-4">
        MuhasebeAkademi · Karne Doğrulama
      </div>
      <h1
        className="font-display-italic text-ink leading-[0.96] tracking-tight mb-8"
        style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
      >
        Karne No <span className="font-mono italic text-[0.7em] text-ink-soft">·</span>{' '}
        <span className="font-mono not-italic text-ink-soft" style={{ fontSize: '0.6em' }}>
          K-{karneId ?? '—'}
        </span>
      </h1>

      <div className="border-l-4 pl-5 py-2 mb-8" style={{ borderColor: 'var(--copper-deep)' }}>
        <p className="text-ink leading-relaxed font-medium">
          Bu karne MuhasebeAkademi üzerinden üretilmiştir.
        </p>
        <p className="text-ink-soft text-sm mt-2 leading-relaxed">
          Tam doğrulama servisi yakında devreye giriyor. Şu an için: karne sahibinin
          kendi profilinden tekrar indirip karşılaştırması en güvenli yöntem.
        </p>
      </div>

      <div className="space-y-3 text-sm text-ink-soft leading-relaxed">
        <p>
          <span className="font-bold text-ink">Doğrulama Süreci.</span> Karne PDF'i,
          kullanıcının çözdüğü soru sayısı, kazandığı rozetler, modül ilerlemesi ve
          aktivite verilerini kapsar. Veriler doğrudan platformdan üretilir; PDF
          oluşturma anındaki ilerlemeyi yansıtır.
        </p>
        <p>
          <span className="font-bold text-ink">Karne No nasıl üretilir?</span> Kullanıcı
          adı + üretim tarihi'nden deterministik bir hash. Aynı kullanıcı aynı gün
          her zaman aynı No'yu üretir.
        </p>
        <p>
          <span className="font-bold text-ink">Tam doğrulama yakında.</span> Genel kullanıma
          açık doğrulama servisi tasarım aşamasında. O zamana kadar karneyi paylaşan
          kişiden kendi profil sayfasından yeniden indirmesini isteyebilirsin.
        </p>
      </div>

      <button
        onClick={() => nav('/')}
        className="mt-10 inline-flex items-baseline gap-2 text-sm font-medium text-ink hover:text-copper-deep transition"
      >
        <span className="font-mono text-[12px]">←</span>
        <span>Anasayfaya dön</span>
      </button>
    </main>
  );
};
