import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Thiings } from '../components/Thiings';
import { HesapKoduInput } from '../components/HesapKoduInput';
import { CozumModal } from '../components/CozumModal';
import { BelgeModal } from '../components/BelgeModal';
import { HataBildirModal } from '../components/HataBildirModal';
import { PremiumGate } from '../components/PremiumGate';
import { AIAsistanYanPanel } from '../components/AIAsistanYanPanel';
import { MarkdownLite } from '../components/MarkdownLite';
import { KocTuru, type KocTuruAdim } from '../components/KocTuru';
import { IcerikGoruntuleyici } from '../components/IcerikGoruntuleyici';
import { useAuth } from '../contexts/AuthContext';
import { useUniteler } from '../contexts/UnitelerContext';
import { HESAP_PLANI } from '../data/hesap-plani';
import { ZORLUK_AD, ZORLUK_PUAN, ZORLUK_STIL } from '../data/sabitler';
import { bugununTarihi, paraFormat } from '../lib/format';
import { yanlisAnaliziYap, type YanlisAnaliz } from '../lib/kontrol';
import { aiYanlisAnalizi } from '../lib/ai';
import { authDonusYaz } from '../lib/auth-donus';
import { aktifMuavinleriYukle, type MuavinHesap } from '../lib/muavin';
import type { CozumSatir, FisBilgi, FisTuru, Soru, SoruWithUnite, UserRow } from '../types';

type Durum = 'bos' | 'dogru' | 'yanlis';

interface CozumYardim {
  kullanilanAi?: boolean;
  cozumGosterildi?: boolean;
}

interface Props {
  soru: SoruWithUnite;
  onCozuldu: (soru: Soru, yardim?: CozumYardim) => void;
  onYanlis: (soruId: string) => void;
  cozulmusMu: boolean;
  onHesapPlaniYanPanel: () => void;
}

const bosSatir = (): UserRow => ({ kod: '', borc: '', alacak: '', aciklama: '' });

const FIS_TURLERI: { kod: FisTuru; ad: string }[] = [
  { kod: 'M', ad: 'Mahsup' },
  { kod: 'T', ad: 'Tahsil' },
  { kod: 'Ö', ad: 'Tediye' },
  { kod: 'A', ad: 'Açılış' },
  { kod: 'K', ad: 'Kapanış' },
  { kod: 'V', ad: 'Virman' },
];

// Soru ID'sinden deterministik 4 haneli yevmiye no üret
const yevmiyeNoUret = (soruId: string): string => {
  let hash = 0;
  for (let i = 0; i < soruId.length; i++) {
    hash = (hash * 31 + soruId.charCodeAt(i)) | 0;
  }
  return String(Math.abs(hash) % 9999 + 1).padStart(4, '0');
};

const FisField = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={`bg-white dark:bg-zinc-900 ${className ?? ''}`}>
    <div className="text-[9px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold px-2 pt-1.5">
      {label}
    </div>
    {children}
  </div>
);

const SoruEkraniIci = ({
  soru,
  onCozuldu,
  onYanlis,
  cozulmusMu,
  onHesapPlaniYanPanel,
}: Props) => {
  const nav = useNavigate();
  const location = useLocation();
  const liste = (location.state as { liste?: string[] } | null)?.liste ?? null;
  const { uniteler, tumSorular } = useUniteler();
  const unite = uniteler.find((u) => u.id === soru.uniteId);
  const [kayitlar, setKayitlar] = useState<UserRow[]>([bosSatir(), bosSatir()]);
  const [fis, setFis] = useState<FisBilgi>(() => ({
    yevmiyeNo: yevmiyeNoUret(soru.id),
    tarih: bugununTarihi(),
    fisTuru: 'M',
    belgeNo: '',
    aciklama: '',
  }));
  const [durum, setDurum] = useState<Durum>('bos');
  const [muavinler, setMuavinler] = useState<MuavinHesap[]>([]);
  const [satirSonuclari, setSatirSonuclari] = useState<(boolean | null)[]>([]);
  const [yanlisAnaliz, setYanlisAnaliz] = useState<YanlisAnaliz | null>(null);
  const [kontrolHatasi, setKontrolHatasi] = useState<string | null>(null);
  const [cozumAcik, setCozumAcik] = useState(false);
  const [cozumOnayAcik, setCozumOnayAcik] = useState(false);
  const [hataAcik, setHataAcik] = useState(false);
  const [belgeAcik, setBelgeAcik] = useState(false);
  const [aiAsistanAcik, setAiAsistanAcik] = useState(false);
  const [aiYukleniyor, setAiYukleniyor] = useState(false);
  // Yardım takibi — puanlama için. AI açıldıysa veya çözüm gösterildiyse
  // soru çözüldüğünde bu flag'ler onCozuldu'ya iletilir.
  const [kullanilanAi, setKullanilanAi] = useState(false);
  const [cozumGosterildi, setCozumGosterildi] = useState(false);
  const [aiMetin, setAiMetin] = useState<string | null>(null);
  const [aiHata, setAiHata] = useState<string | null>(null);
  const [kocTuruAcik, setKocTuruAcik] = useState(false);
  const [konuModalAcik, setKonuModalAcik] = useState(false);
  const konuIcerikVar = Array.isArray(unite?.icerik) && (unite?.icerik as unknown[]).length > 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('koc-turu-tamam') === '1') return;
    const t = setTimeout(() => setKocTuruAcik(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    aktifMuavinleriYukle()
      .then(setMuavinler)
      .catch(() => {
        // sessizce geç — muavin yoksa eski davranış (sadece ana hesap) korunur
      });
  }, []);

  const kocTuruKapat = () => {
    setKocTuruAcik(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('koc-turu-tamam', '1');
    }
  };

  const kocTuruAdimlari: KocTuruAdim[] = [
    {
      hedef: 'senaryo',
      baslik: 'Önce senaryoyu oku',
      metin: 'Burada gerçek bir muhasebe olayı anlatılıyor. Tutarlar ve taraflar bu metinden çıkar.',
    },
    {
      hedef: 'fis',
      baslik: 'Yevmiye fişine kayıt gir',
      metin: 'Senaryodaki olayı fişe çeviriyorsun: tarih, açıklama, hesap, borç ve alacak.',
    },
    {
      hedef: 'satir',
      baslik: 'Hesap kodu + tutar',
      metin: 'Hesap kodunu yazınca öneriler çıkar. Borçlanan tarafa borç sütununa, alacaklı tarafa alacak sütununa tutarı yaz.',
    },
    {
      hedef: 'kontrol',
      baslik: 'Kaydı kontrol et',
      metin: 'Bittiğinde bu butonla kaydını doğrula. Yanlış varsa anlık geri bildirim alırsın.',
    },
  ];

  const fisTuruAd = useMemo(
    () => FIS_TURLERI.find((f) => f.kod === fis.fisTuru)?.ad ?? '',
    [fis.fisTuru],
  );

  useEffect(() => {
    setKayitlar([bosSatir(), bosSatir()]);
    setFis({
      yevmiyeNo: yevmiyeNoUret(soru.id),
      tarih: bugununTarihi(),
      fisTuru: 'M',
      belgeNo: '',
      aciklama: '',
    });
    setDurum('bos');
    setSatirSonuclari([]);
    setYanlisAnaliz(null);
    setKontrolHatasi(null);
    setCozumAcik(false);
    setCozumOnayAcik(false);
    setHataAcik(false);
    setBelgeAcik(false);
    setAiMetin(null);
    setAiHata(null);
    setKullanilanAi(false);
    setCozumGosterildi(false);
  }, [soru.id]);

  const aiAnalizCalistir = async () => {
    setAiYukleniyor(true);
    setAiHata(null);
    try {
      const kullaniciCevap: CozumSatir[] = kayitlar
        .filter((k) => k.kod && (+k.borc > 0 || +k.alacak > 0))
        .map((k) => ({ kod: k.kod, borc: +k.borc || 0, alacak: +k.alacak || 0 }));
      const sonuc = await aiYanlisAnalizi({
        soruBaslik: soru.baslik,
        senaryo: soru.senaryo,
        dogruCozum: soru.cozum,
        kullaniciCevap,
      });
      setAiMetin(sonuc.metin);
    } catch (e) {
      setAiHata((e as Error).message);
    } finally {
      setAiYukleniyor(false);
    }
  };

  const toplamBorc = kayitlar.reduce((a, k) => a + (+k.borc || 0), 0);
  const toplamAlacak = kayitlar.reduce((a, k) => a + (+k.alacak || 0), 0);
  const esit = Math.abs(toplamBorc - toplamAlacak) < 0.01 && toplamBorc > 0;

  const satirEkle = () => {
    setKayitlar((prev) => [...prev, bosSatir()]);
    setSatirSonuclari((prev) => [...prev, null]);
    setDurum('bos');
    setTimeout(() => {
      const yeniIdx = kayitlar.length;
      const input = document.querySelector<HTMLInputElement>(
        `[data-row="${yeniIdx}"][data-col="kod"]`,
      );
      if (input) input.focus();
    }, 50);
  };

  const satirSil = (i: number) => {
    setKayitlar(kayitlar.filter((_, idx) => idx !== i));
    setSatirSonuclari(satirSonuclari.filter((_, idx) => idx !== i));
  };

  const satirGuncelle = (i: number, alan: keyof UserRow, deger: string) => {
    const yeni = [...kayitlar];
    yeni[i] = { ...yeni[i], [alan]: deger };
    if (alan === 'borc' && deger) yeni[i].alacak = '';
    if (alan === 'alacak' && deger) yeni[i].borc = '';
    setKayitlar(yeni);
    if (durum !== 'bos') {
      setDurum('bos');
      setSatirSonuclari([]);
      setYanlisAnaliz(null);
      setKontrolHatasi(null);
    }
  };

  const kontrol = useCallback(() => {
    setKontrolHatasi(null);
    const dolu = kayitlar.filter(
      (k) => k.kod || +k.borc > 0 || +k.alacak > 0,
    );
    if (dolu.length < 2) {
      setKontrolHatasi('En az iki satır doldurulmalı.');
      return;
    }

    const analiz = yanlisAnaliziYap(kayitlar, soru.cozum, muavinler);

    // En iyi senaryo: tüm satırlar doğru ve eksik yok
    const hepsiDogru =
      analiz.satirAnalizleri.every((s) => s.tip === 'dogru') &&
      analiz.eksikHesaplar.length === 0 &&
      Math.abs(analiz.dengeFarki) < 0.01 &&
      analiz.satirAnalizleri.length >= 2;

    // Backend ile uyumlu satırSonuclari (true/false) — UI satır işaretleri için
    const sonuclar = kayitlar.map((_, i) => {
      const a = analiz.satirAnalizleri.find((s) => s.satirIdx === i);
      if (!a) return null;
      return a.tip === 'dogru';
    });
    setSatirSonuclari(sonuclar);

    if (hepsiDogru) {
      setDurum('dogru');
      setYanlisAnaliz(null);
      onCozuldu(soru, { kullanilanAi, cozumGosterildi });
    } else {
      setDurum('yanlis');
      setYanlisAnaliz(analiz);
      onYanlis(soru.id);
    }
  }, [kayitlar, soru, onCozuldu, onYanlis, kullanilanAi, cozumGosterildi]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        kontrol();
        return;
      }
      if (e.key === 'Escape') {
        if (cozumAcik) { setCozumAcik(false); return; }
        if (cozumOnayAcik) { setCozumOnayAcik(false); return; }
        if (belgeAcik) { setBelgeAcik(false); return; }
        if (hataAcik) { setHataAcik(false); return; }
        if (aiAsistanAcik) { setAiAsistanAcik(false); return; }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [kontrol, cozumAcik, cozumOnayAcik, belgeAcik, hataAcik, aiAsistanAcik]);

  const bulunanHesap = (kod: string) => HESAP_PLANI.find((h) => h.kod === kod)?.ad || '';
  const handleTutarKey = (e: React.KeyboardEvent<HTMLInputElement>, i: number, col: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (i === kayitlar.length - 1 && col === 'alacak') satirEkle();
      else {
        const next = document.querySelector<HTMLInputElement>(
          `[data-row="${i + 1}"][data-col="kod"]`,
        );
        if (next) next.focus();
        else satirEkle();
      }
    }
  };

  const sonraki = () => {
    if (liste && liste.length > 0) {
      const idx = liste.findIndex((id) => id === soru.id);
      if (idx >= 0 && idx < liste.length - 1) {
        nav(`/problemler/${liste[idx + 1]}`, { state: { liste } });
        return;
      }
      nav('/problemler');
      return;
    }
    const idx = tumSorular.findIndex((s) => s.id === soru.id);
    if (idx >= 0 && idx < tumSorular.length - 1) nav(`/problemler/${tumSorular[idx + 1].id}`);
    else nav('/problemler');
  };

  return (
    <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
      <button
        onClick={() => nav('/problemler')}
        className="flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 mb-5 font-semibold"
      >
        <Icon name="ArrowLeft" size={14} />
        <span>Tüm Problemler</span>
      </button>

      {/* ÜST BÖLÜM: Soru bilgisi + yan toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {unite && <Thiings name={unite.thiingsIcon} size={22} />}
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
              {unite?.ad}
            </div>
            <span
              className={`text-[9px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[soru.zorluk]}`}
            >
              {ZORLUK_AD[soru.zorluk]} · {ZORLUK_PUAN[soru.zorluk]} puan
            </span>
            {cozulmusMu && (
              <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                Çözüldü
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl md:text-3xl tracking-tight mb-4 font-bold">
            {soru.baslik}
          </h1>
          <div data-tour="senaryo" className="border-l-4 border-stone-900 dark:border-zinc-100 pl-5 py-1">
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-2 font-bold">
              Senaryo
            </div>
            <p className="text-base lg:text-lg leading-relaxed text-stone-800 dark:text-zinc-200 font-medium whitespace-pre-line">
              {soru.senaryo}
            </p>
          </div>
        </div>

        {/* YAN TOOLBAR */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          {soru.belgeler && soru.belgeler.length > 0 && (
            <button
              onClick={() => setBelgeAcik(true)}
              className="flex items-center gap-2.5 px-3 py-2.5 border border-blue-300 dark:border-blue-700/50 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 hover:border-blue-500 transition text-left text-sm font-semibold rounded-lg col-span-2 lg:col-span-1"
            >
              <Icon
                name="FileText"
                size={14}
                className="text-blue-700 dark:text-blue-400 flex-shrink-0"
              />
              <span>Belgeyi Görüntüle</span>
              <span className="ml-auto text-[9px] tracking-[0.2em] uppercase font-bold text-blue-700 dark:text-blue-400 font-mono">
                {soru.belgeler.length}
              </span>
            </button>
          )}
          <button
            onClick={onHesapPlaniYanPanel}
            className="flex items-center gap-2.5 px-3 py-2.5 border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 transition text-left text-sm font-semibold rounded-lg"
          >
            <Icon name="BookOpen" size={14} className="flex-shrink-0" />
            <span>Hesap Planı</span>
          </button>
          {konuIcerikVar && (
            <button
              onClick={() => setKonuModalAcik(true)}
              className="flex items-center gap-2.5 px-3 py-2.5 border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 transition text-left text-sm font-semibold rounded-lg"
            >
              <Icon name="Info" size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>Konuyu Hatırlat</span>
            </button>
          )}
          <button
            onClick={() => {
              setAiAsistanAcik(true);
              setKullanilanAi(true);
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 border border-amber-300/60 dark:border-amber-700/40 bg-gradient-to-r from-amber-50/40 to-transparent dark:from-amber-900/10 hover:border-amber-500 transition text-left text-sm font-semibold rounded-lg"
          >
            <Icon
              name="Sparkles"
              size={14}
              className="text-amber-600 dark:text-amber-400 flex-shrink-0"
            />
            <span>AI Asistan</span>
            <span className="ml-auto text-[8px] tracking-[0.2em] uppercase font-bold text-amber-700 dark:text-amber-400">
              Pro
            </span>
          </button>
          <button
            onClick={() => {
              if (cozumGosterildi) {
                setCozumAcik(true);
              } else {
                setCozumOnayAcik(true);
              }
            }}
            className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-lg text-left text-sm font-semibold transition ${
              cozumGosterildi
                ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300'
                : 'border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400'
            }`}
          >
            <Icon name="Eye" size={14} className="flex-shrink-0" />
            <span>Çözümü Gör</span>
            {cozumGosterildi && (
              <span className="ml-auto text-[8px] tracking-[0.2em] uppercase font-bold text-rose-700 dark:text-rose-400">
                0 puan
              </span>
            )}
          </button>
          <button
            onClick={() => setHataAcik(true)}
            className="flex items-center gap-2.5 px-3 py-2.5 border border-stone-300 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-700 transition text-left text-sm font-semibold rounded-lg col-span-2 lg:col-span-1"
          >
            <Icon name="AlertCircle" size={14} className="text-rose-500 flex-shrink-0" />
            <span>Hata Bildir</span>
          </button>
        </div>
      </div>

      {/* YEVMİYE FİŞİ — LUCA tarzı */}
      <div data-tour="fis" className="bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm">
        {/* Fiş başlığı */}
        <div className="bg-stone-100 dark:bg-zinc-800 px-4 py-2 border-b-2 border-stone-300 dark:border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="FileText" size={14} className="text-stone-600 dark:text-zinc-400" />
            <span className="font-display font-bold text-sm tracking-tight">YEVMİYE FİŞİ</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
              · {fisTuruAd}
            </span>
          </div>
          <div className="text-[10px] text-stone-500 dark:text-zinc-500 font-medium hidden sm:flex items-center gap-1.5">
            <Icon name="Info" size={11} />
            Sıralama serbest, istediğin satıra yazabilirsin
          </div>
        </div>

        {/* Fiş üst bilgi satırı */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-px bg-stone-200 dark:bg-zinc-700">
          <FisField label="Yev. No" className="md:col-span-2">
            <input
              type="text"
              value={fis.yevmiyeNo}
              onChange={(e) => setFis({ ...fis, yevmiyeNo: e.target.value })}
              className="w-full font-mono text-sm bg-white dark:bg-zinc-900 px-2 py-1.5 outline-none focus:bg-amber-50 dark:focus:bg-amber-900/10 transition font-semibold"
            />
          </FisField>
          <FisField label="Tarih" className="md:col-span-2">
            <input
              type="date"
              value={fis.tarih}
              onChange={(e) => setFis({ ...fis, tarih: e.target.value })}
              className="w-full font-mono text-sm bg-white dark:bg-zinc-900 px-2 py-1.5 outline-none focus:bg-amber-50 dark:focus:bg-amber-900/10 transition font-semibold"
            />
          </FisField>
          <FisField label="Fiş Türü" className="md:col-span-2">
            <select
              value={fis.fisTuru}
              onChange={(e) => setFis({ ...fis, fisTuru: e.target.value as FisTuru })}
              className="w-full font-mono text-sm bg-white dark:bg-zinc-900 px-2 py-1.5 outline-none focus:bg-amber-50 dark:focus:bg-amber-900/10 transition font-semibold cursor-pointer"
            >
              {FIS_TURLERI.map((f) => (
                <option key={f.kod} value={f.kod}>
                  {f.kod} — {f.ad}
                </option>
              ))}
            </select>
          </FisField>
          <FisField label="Belge No" className="md:col-span-2">
            <input
              type="text"
              value={fis.belgeNo}
              onChange={(e) => setFis({ ...fis, belgeNo: e.target.value })}
              placeholder="—"
              className="w-full font-mono text-sm bg-white dark:bg-zinc-900 px-2 py-1.5 outline-none focus:bg-amber-50 dark:focus:bg-amber-900/10 transition font-semibold placeholder:text-stone-300 dark:placeholder:text-zinc-700"
            />
          </FisField>
          <FisField label="Açıklama" className="md:col-span-4">
            <input
              type="text"
              value={fis.aciklama}
              onChange={(e) => setFis({ ...fis, aciklama: e.target.value })}
              placeholder="Fiş açıklaması..."
              className="w-full text-sm bg-white dark:bg-zinc-900 px-2 py-1.5 outline-none focus:bg-amber-50 dark:focus:bg-amber-900/10 transition font-medium placeholder:text-stone-300 dark:placeholder:text-zinc-700"
            />
          </FisField>
        </div>

        <div className="overflow-x-auto">
        <div data-tour="satir" className="min-w-[680px]">
        {/* Satır başlıkları */}
        <div className="grid grid-cols-[40px_120px_1fr_1.5fr_140px_140px_40px] gap-px bg-stone-300 dark:bg-zinc-700 border-t-2 border-stone-300 dark:border-zinc-700">
          {['Sıra', 'Hesap Kodu', 'Hesap Adı', 'Açıklama', 'Borç', 'Alacak', ''].map((h, i) => (
            <div
              key={i}
              className={`bg-stone-100 dark:bg-zinc-800 px-2 py-2 text-[10px] tracking-[0.2em] uppercase text-stone-600 dark:text-zinc-400 font-bold ${
                i >= 4 && i <= 5 ? 'text-right' : i === 0 ? 'text-center' : ''
              }`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Satırlar */}
        {kayitlar.map((k, i) => {
          const sonuc = satirSonuclari[i];
          let satirBg = 'bg-white dark:bg-zinc-900';
          if (durum === 'yanlis' && sonuc === false) satirBg = 'bg-red-50 dark:bg-red-900/10';
          else if (durum === 'yanlis' && sonuc === true)
            satirBg = 'bg-emerald-50/60 dark:bg-emerald-900/10';
          return (
            <div
              key={i}
              className={`grid grid-cols-[40px_120px_1fr_1.5fr_140px_140px_40px] gap-px bg-stone-200 dark:bg-zinc-800 border-b border-stone-200 dark:border-zinc-800 ${satirBg}`}
            >
              <div
                className={`px-2 py-1.5 text-center text-xs font-mono font-bold text-stone-400 dark:text-zinc-600 ${satirBg}`}
              >
                {i + 1}
              </div>
              <div className={satirBg}>
                <HesapKoduInput
                  value={k.kod}
                  onChange={(v) => satirGuncelle(i, 'kod', v)}
                  rowIndex={i}
                  muavinler={muavinler}
                />
              </div>
              <div
                className={`px-2 py-1.5 text-xs text-stone-700 dark:text-zinc-300 truncate font-medium flex items-center ${satirBg}`}
              >
                {bulunanHesap(k.kod)}
              </div>
              <div className={satirBg}>
                <input
                  type="text"
                  value={k.aciklama ?? ''}
                  onChange={(e) => satirGuncelle(i, 'aciklama', e.target.value)}
                  placeholder="—"
                  data-row={i}
                  data-col="aciklama"
                  className="w-full text-xs px-2 py-1.5 bg-transparent outline-none focus:bg-amber-50 dark:focus:bg-amber-900/10 transition font-medium placeholder:text-stone-300 dark:placeholder:text-zinc-700"
                />
              </div>
              <div className={satirBg}>
                <input
                  type="number"
                  value={k.borc}
                  onChange={(e) => satirGuncelle(i, 'borc', e.target.value)}
                  onKeyDown={(e) => handleTutarKey(e, i, 'borc')}
                  placeholder="0,00"
                  data-row={i}
                  data-col="borc"
                  className="w-full font-mono text-sm text-right px-2 py-1.5 bg-transparent outline-none focus:bg-amber-50 dark:focus:bg-amber-900/10 transition font-semibold placeholder:text-stone-300 dark:placeholder:text-zinc-700"
                />
              </div>
              <div className={satirBg}>
                <input
                  type="number"
                  value={k.alacak}
                  onChange={(e) => satirGuncelle(i, 'alacak', e.target.value)}
                  onKeyDown={(e) => handleTutarKey(e, i, 'alacak')}
                  placeholder="0,00"
                  data-row={i}
                  data-col="alacak"
                  className="w-full font-mono text-sm text-right px-2 py-1.5 bg-transparent outline-none focus:bg-amber-50 dark:focus:bg-amber-900/10 transition font-semibold placeholder:text-stone-300 dark:placeholder:text-zinc-700"
                />
              </div>
              <div className={`flex items-center justify-center ${satirBg}`}>
                {durum === 'yanlis' && sonuc === false && (
                  <Icon name="X" size={13} className="text-red-600" />
                )}
                {durum === 'yanlis' && sonuc === true && (
                  <Icon name="Check" size={13} className="text-emerald-600" />
                )}
                {durum !== 'yanlis' && kayitlar.length > 2 && (
                  <button
                    onClick={() => satirSil(i)}
                    className="text-stone-300 dark:text-zinc-600 hover:text-red-600 transition p-1"
                  >
                    <Icon name="Trash2" size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Satır ekle */}
        <button
          onClick={satirEkle}
          className="w-full px-4 py-2 text-xs text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2 border-b-2 border-stone-300 dark:border-zinc-700 font-semibold bg-stone-50/50 dark:bg-zinc-900"
        >
          <Icon name="Plus" size={11} /> Satır Ekle
        </button>

        {/* Toplam */}
        <div className="grid grid-cols-[40px_120px_1fr_1.5fr_140px_140px_40px] gap-px bg-stone-300 dark:bg-zinc-700">
          <div className="bg-stone-100 dark:bg-zinc-800 col-span-4 px-3 py-2.5 text-[10px] tracking-[0.2em] uppercase text-stone-600 dark:text-zinc-400 font-bold text-right flex items-center justify-end">
            Toplam
          </div>
          <div
            className={`bg-stone-100 dark:bg-zinc-800 px-2 py-2.5 text-right font-mono text-sm font-bold ${esit ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-zinc-300'}`}
          >
            {paraFormat(toplamBorc) || '0,00'}
          </div>
          <div
            className={`bg-stone-100 dark:bg-zinc-800 px-2 py-2.5 text-right font-mono text-sm font-bold ${esit ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-700 dark:text-zinc-300'}`}
          >
            {paraFormat(toplamAlacak) || '0,00'}
          </div>
          <div className="bg-stone-100 dark:bg-zinc-800 flex items-center justify-center">
            {esit && (
              <Icon
                name="CheckCircle2"
                size={13}
                className="text-emerald-700 dark:text-emerald-400"
              />
            )}
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Aksiyon butonları */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          onClick={kontrol}
          data-tour="kontrol"
          className="flex-1 bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 py-3.5 text-sm tracking-wide uppercase font-bold hover:bg-stone-800 dark:hover:bg-white transition flex items-center justify-center gap-2 rounded-xl shadow-lg"
        >
          <Icon name="Zap" size={14} />
          Kaydı Kontrol Et
          <span className="hidden sm:inline font-mono text-[9px] opacity-60 ml-2">Ctrl+↵</span>
        </button>
      </div>

      {kontrolHatasi && (
        <div className="mt-3 px-4 py-2.5 border border-amber-300 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-300 text-sm font-medium rounded-lg flex items-center gap-2">
          <Icon name="AlertTriangle" size={14} />
          {kontrolHatasi}
        </div>
      )}

      {/* Sonuç paneli */}
      {durum === 'dogru' && (() => {
        // Bu çözümden kazanılan gerçek puan (sadece çözüm gör cezasını uygular)
        const kazanilan = cozumGosterildi ? 0 : ZORLUK_PUAN[soru.zorluk];
        const puanMesaji = cozulmusMu
          ? ''
          : kazanilan > 0
            ? `+${kazanilan} puan`
            : 'Çözümü gördüğün için puan kazanamadın.';
        return (
        <div className="mt-4 p-5 border-l-4 border-emerald-700 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Icon
              name="CheckCircle2"
              size={20}
              className="text-emerald-700 dark:text-emerald-400"
            />
            <div className="font-display text-lg font-bold">
              Doğru kayıt. {puanMesaji}
            </div>
          </div>
          <p className="text-sm text-stone-700 dark:text-zinc-300 leading-relaxed mb-4 font-medium">
            {soru.aciklama}
          </p>
          <button
            onClick={sonraki}
            className="flex items-center gap-2 text-sm bg-stone-900 dark:bg-zinc-100 text-stone-50 dark:text-zinc-900 px-4 py-2 hover:bg-stone-800 dark:hover:bg-white transition rounded-lg font-semibold"
          >
            Sıradaki Soru <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        );
      })()}
      {durum === 'yanlis' && yanlisAnaliz && (
        <div className="mt-4 space-y-4">
          <div className="p-5 border-l-4 border-red-700 dark:border-red-400 bg-red-50 dark:bg-red-900/10 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="X" size={20} className="text-red-700 dark:text-red-400" />
              <div className="font-display text-lg font-bold">Kayıt doğru değil.</div>
            </div>

            {yanlisAnaliz.ozet.length > 0 && (
              <ul className="space-y-1.5 mb-3">
                {yanlisAnaliz.ozet.map((m, i) => (
                  <li
                    key={i}
                    className="text-sm text-stone-700 dark:text-zinc-300 leading-relaxed font-medium flex gap-2"
                  >
                    <span className="text-red-600 dark:text-red-400 font-bold flex-shrink-0 mt-0.5">
                      ▸
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            )}

            {yanlisAnaliz.satirAnalizleri.some((s) => s.tip !== 'dogru') && (
              <details className="mt-3 group">
                <summary className="cursor-pointer text-[11px] tracking-[0.2em] uppercase font-bold text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 inline-flex items-center gap-1.5">
                  <Icon
                    name="ChevronRight"
                    size={11}
                    className="transition group-open:rotate-90"
                  />
                  Satır satır detay
                </summary>
                <div className="mt-2 space-y-1.5 pl-3 border-l border-red-200 dark:border-red-800/40">
                  {yanlisAnaliz.satirAnalizleri
                    .filter((s) => s.tip !== 'dogru')
                    .map((s, i) => (
                      <div key={i} className="text-xs leading-relaxed">
                        <span className="font-mono font-bold text-stone-500 dark:text-zinc-500">
                          Satır {s.satirIdx + 1}:
                        </span>{' '}
                        <span className="text-stone-700 dark:text-zinc-300 font-medium">
                          {s.mesaj}
                        </span>
                      </div>
                    ))}
                </div>
              </details>
            )}
          </div>

          <PremiumGate
            ozellikAdi="AI Yanlış Analizi"
            aciklama="Yapay zeka cevabını satır satır inceler ve nerede hata yaptığını kavramsal olarak açıklar."
          >
            {!aiMetin && !aiYukleniyor && (
              <button
                onClick={aiAnalizCalistir}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 text-sm font-bold rounded-xl transition shadow-md"
              >
                <Icon name="Sparkles" size={14} />
                AI ile Yanlışını Anla
              </button>
            )}
            {aiYukleniyor && (
              <div className="flex items-center justify-center gap-2 px-4 py-4 bg-amber-50/60 dark:bg-amber-900/10 border border-amber-300/50 dark:border-amber-800/40 rounded-xl text-sm text-amber-800 dark:text-amber-300 font-semibold">
                <Icon name="Loader2" size={14} className="animate-spin" />
                AI yanlışını analiz ediyor...
              </div>
            )}
            {aiMetin && (
              <div className="p-5 bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-900/10 dark:to-zinc-900 border border-amber-300/50 dark:border-amber-800/40 rounded-xl">
                <div className="flex items-center gap-2 mb-3 text-[10px] tracking-[0.2em] uppercase font-bold text-amber-700 dark:text-amber-300">
                  <Icon name="Sparkles" size={12} />
                  AI Yanlış Analizi
                </div>
                <MarkdownLite text={aiMetin} />
                <button
                  onClick={() => {
                    setAiMetin(null);
                    setAiHata(null);
                  }}
                  className="mt-3 text-xs text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 font-semibold"
                >
                  Kapat
                </button>
              </div>
            )}
            {aiHata && (
              <div className="text-sm text-red-700 dark:text-red-400 font-medium mt-2">
                AI yanıtı alınamadı: {aiHata}
              </div>
            )}
          </PremiumGate>
        </div>
      )}

      {cozumAcik && <CozumModal soru={soru} onKapat={() => setCozumAcik(false)} />}
      {cozumOnayAcik && (
        <div
          className="fixed inset-0 z-[110] bg-stone-950/55 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          onClick={() => setCozumOnayAcik(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-rose-300 dark:border-rose-800 rounded-2xl shadow-2xl my-auto"
          >
            <div className="p-5 border-b border-stone-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 mb-2">
                <Icon name="AlertTriangle" size={18} />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold">
                  Puan kaybı
                </span>
              </div>
              <h2 className="font-display text-xl font-bold tracking-tight">
                Çözümü görmek üzeresin
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-[14px] text-stone-700 dark:text-zinc-300 leading-relaxed">
                Çözümü görürsen bu sorudan{' '}
                <strong className="text-rose-700 dark:text-rose-400">0 puan</strong> alırsın
                (normalde {ZORLUK_PUAN[soru.zorluk]} puan).
              </p>
              <p className="text-[13px] text-stone-600 dark:text-zinc-400 leading-relaxed">
                Önce kendin denemeyi tercih edersen modalı kapatabilirsin.
                Yardım için <span className="font-bold">AI Asistan</span> seçeneği var
                — puana etkisi yok.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-stone-200 dark:border-zinc-700">
              <button
                onClick={() => setCozumOnayAcik(false)}
                className="px-4 py-2 text-[12px] font-bold text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  setCozumGosterildi(true);
                  setCozumOnayAcik(false);
                  setCozumAcik(true);
                }}
                className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white px-4 py-2 text-[12px] tracking-[0.2em] uppercase font-bold rounded-lg active:scale-[0.98] transition"
              >
                <Icon name="Eye" size={13} />
                Çözümü Göster (0 puan)
              </button>
            </div>
          </div>
        </div>
      )}
      {belgeAcik && soru.belgeler && (
        <BelgeModal belgeler={soru.belgeler} onKapat={() => setBelgeAcik(false)} />
      )}
      {hataAcik && (
        <HataBildirModal
          soruId={soru.id}
          soruBaslik={soru.baslik}
          onKapat={() => setHataAcik(false)}
        />
      )}
      <AIAsistanYanPanel
        acik={aiAsistanAcik}
        onKapat={() => setAiAsistanAcik(false)}
        baglam={{ soruBaslik: soru.baslik, senaryo: soru.senaryo }}
      />
      <KocTuru
        adimlar={kocTuruAdimlari}
        acik={kocTuruAcik}
        onKapat={kocTuruKapat}
      />
      {konuModalAcik && konuIcerikVar && unite && (
        <div
          className="fixed inset-0 z-[90] bg-stone-950/55 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:p-8 animate-[koc-tour-pop_0.28s_cubic-bezier(0.22,1,0.36,1)_both]"
          onClick={() => setKonuModalAcik(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl my-auto bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            <button
              onClick={() => setKonuModalAcik(false)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 shadow-lg flex items-center justify-center hover:bg-stone-50 dark:hover:bg-zinc-800 transition"
              aria-label="Kapat"
            >
              <Icon name="X" size={14} />
            </button>
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                Konu Anlatımı
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
                {unite.ad}
              </h3>
            </div>
            <IcerikGoruntuleyici icerik={unite.icerik} />
          </div>
        </div>
      )}
    </main>
  );
};

interface WrapperProps {
  ilerleme: { cozulenler: Record<string, unknown> };
  onCozuldu: (soru: Soru, yardim?: CozumYardim) => void;
  onYanlis: (soruId: string) => void;
  onHesapPlaniYanPanel: () => void;
}

export const SoruEkrani = ({
  ilerleme,
  onCozuldu,
  onYanlis,
  onHesapPlaniYanPanel,
}: WrapperProps) => {
  const { soruId } = useParams<{ soruId: string }>();
  const nav = useNavigate();
  const { user, yukleniyor } = useAuth();
  const { tumSorular, yukleniyor: uniteYukleniyor } = useUniteler();
  const soru = tumSorular.find((s) => s.id === soruId);

  useEffect(() => {
    if (!uniteYukleniyor && !soru) nav('/problemler', { replace: true });
  }, [soru, nav, uniteYukleniyor]);

  if (yukleniyor || uniteYukleniyor) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center">
        <Icon name="Loader2" size={20} className="animate-spin text-stone-500" />
      </main>
    );
  }

  if (!soru) return null;

  if (!user) return <GirisDuvari soru={soru} />;

  return (
    <SoruEkraniIci
      soru={soru}
      onCozuldu={onCozuldu}
      onYanlis={onYanlis}
      cozulmusMu={!!ilerleme.cozulenler[soru.id]}
      onHesapPlaniYanPanel={onHesapPlaniYanPanel}
    />
  );
};

const GirisDuvari = ({ soru }: { soru: SoruWithUnite }) => {
  const nav = useNavigate();
  const { uniteler } = useUniteler();
  const unite = uniteler.find((u) => u.id === soru.uniteId);

  const giriseGit = () => {
    authDonusYaz(`/problemler/${soru.id}`);
    nav('/giris');
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <button
        onClick={() => nav('/problemler')}
        className="flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 mb-8 font-semibold"
      >
        <Icon name="ArrowLeft" size={14} />
        <span>Tüm Problemler</span>
      </button>

      <div className="flex items-center gap-3 mb-3">
        {unite && <Thiings name={unite.thiingsIcon} size={24} />}
        <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
          {unite?.ad}
        </div>
        <span
          className={`text-[9px] tracking-[0.2em] uppercase font-bold ${ZORLUK_STIL[soru.zorluk]}`}
        >
          {ZORLUK_AD[soru.zorluk]} · {ZORLUK_PUAN[soru.zorluk]} puan
        </span>
      </div>
      <h1 className="font-display text-3xl md:text-4xl tracking-tight mb-4 font-bold">
        {soru.baslik}
      </h1>
      <p className="text-base text-stone-600 dark:text-zinc-400 leading-relaxed font-medium mb-10">
        {soru.senaryo}
      </p>

      <div className="bg-white dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700 rounded-2xl p-8 md:p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-5">
          <Icon name="Lock" size={22} className="text-blue-700 dark:text-blue-400" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight mb-3">
          Soruyu çözmek için giriş yap
        </h2>
        <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed font-medium max-w-md mx-auto mb-7">
          Ücretsiz hesap ile ilerlemeni kaydet, rozet kazan, seriyi büyüt. 30 saniyede
          başlayabilirsin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={giriseGit}
            className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3 text-sm tracking-wide uppercase font-bold transition inline-flex items-center justify-center gap-2 rounded-xl shadow-md"
          >
            <Icon name="LogIn" size={14} />
            Giriş Yap / Kayıt Ol
          </button>
          <button
            onClick={() => nav('/problemler')}
            className="border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 px-6 py-3 text-sm tracking-wide uppercase font-bold transition inline-flex items-center justify-center gap-2 rounded-xl"
          >
            Soru Listesine Dön
          </button>
        </div>
      </div>
    </main>
  );
};
