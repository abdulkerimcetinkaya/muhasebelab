import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import { AdminYanMenu } from '../../components/AdminYanMenu';
import { SkeletonSatirlar } from '../../components/Skeleton';
import { mevzuatEmbed, type MevzuatChunk } from '../../lib/ai';
import { supabase } from '../../lib/supabase';
import { HESAP_PLANI } from '../../data/hesap-plani';

interface MevzuatRow {
  id: string;
  kaynak: string;
  baslik: string;
  url: string | null;
  metin: string;
  guncellendi: string | null;
  created_at: string;
}

const KAYNAK_SECENEK = [
  { kod: 'TDHP-MSUGT', etiket: 'TDHP / MSUGT — Hesap planı açıklaması' },
  { kod: 'VUK', etiket: 'VUK — Vergi Usul Kanunu' },
  { kod: 'KDV-UT', etiket: 'KDV-UT — KDV Uygulama Tebliği' },
  { kod: 'GVK', etiket: 'GVK — Gelir Vergisi Kanunu' },
  { kod: 'KVK', etiket: 'KVK — Kurumlar Vergisi Kanunu' },
  { kod: 'TTK', etiket: 'TTK — Türk Ticaret Kanunu' },
  { kod: 'GIB-SIRKULER', etiket: 'GİB Sirküleri / Özelge' },
  { kod: 'TFRS', etiket: 'TFRS / BOBİ FRS' },
  { kod: 'DIGER', etiket: 'Diğer' },
];

const SINIF_AD: Record<string, string> = {
  '1': 'Dönen Varlıklar',
  '2': 'Duran Varlıklar',
  '3': 'Kısa Vadeli Yabancı Kaynaklar',
  '4': 'Uzun Vadeli Yabancı Kaynaklar',
  '5': 'Öz Kaynaklar',
  '6': 'Gelir Tablosu Hesapları',
  '7': 'Maliyet Hesapları',
};

const TUR_AD: Record<string, string> = {
  AKTİF: 'aktif karakterli (varlık)',
  PASİF: 'pasif karakterli (kaynak)',
  GELİR: 'gelir hesabı',
  GİDER: 'gider hesabı',
  MALİYET: 'maliyet hesabı',
  KAPANIŞ: 'kapanış hesabı',
};

const TUR_DAVRANIS: Record<string, string> = {
  AKTİF: 'Borçlu çalışır; artışlar borç, azalışlar alacak tarafa yazılır.',
  PASİF: 'Alacaklı çalışır; artışlar alacak, azalışlar borç tarafa yazılır.',
  GELİR: 'Alacaklı çalışır; tahakkuk eden gelirler alacak tarafa yazılır, dönem sonunda 690 hesaba devredilir.',
  GİDER: 'Borçlu çalışır; tahakkuk eden giderler borç tarafa yazılır, dönem sonunda 690/690 üzerinden kapanır.',
  MALİYET: 'Maliyet aktarımı için kullanılır; ay/dönem sonunda 7/A veya 7/B akışına göre yansıtma hesaplarıyla aktarılır.',
  KAPANIŞ: 'Yansıtma/kapanış akışında kullanılır; mizan kapanışında bakiye verir.',
};

// Popüler hesaplar için ek detay — RAG retrieval'da bu terimleri yakalar.
// Anahtar: hesap kodu. Değer: hesabın iş anlamı, tipik kullanım, ilişkili olduğu süreç.
// Kaynak: TDHP-MSUGT (1992) + yaygın muhasebe pratiği. Resmi metin değil ama
// terim kapsamı geniş — "banka kredisi", "fatura", "stok" gibi kelimeleri içerir.
const POPULER_HESAP_DETAY: Record<string, string> = {
  // 10 — Hazır Değerler
  '100': 'İşletme kasasındaki nakit Türk Lirası ve döviz karşılığı izlenir. Tahsilatlarda borç, ödemelerde alacak çalışır. Kasa fazlası 397, kasa noksanı 197 hesaplarında izlenir.',
  '101': 'Müşterilerden alınan ama bankaya henüz ibraz edilmemiş çekler izlenir. Çek tahsil edildiğinde 102 Bankalar hesabına aktarılır.',
  '102': 'Bankalardaki vadesiz mevduat, vadeli mevduat ve döviz hesaplarının TL karşılığı izlenir. Banka havalesi, EFT, kredi kullanımı bu hesap üzerinden geçer.',
  '103': 'İşletmenin keşide ettiği ama henüz bankadan ödenmemiş çekler izlenir. Çek bankada ödendiğinde 102 hesabına aktarılır.',
  // 12 — Ticari Alacaklar
  '120': 'Mal/hizmet satışından doğan ve fatura kesilmiş açık hesap müşteri alacakları izlenir. Senede bağlanmamış kısa vadeli alacaklardır.',
  '121': 'Müşterilerden mal/hizmet satışı karşılığı alınan senet, bono ve poliçeler izlenir. Vade dolduğunda tahsil edilir.',
  '122': 'Senetli alacakların reeskont (vade indirim) tutarıdır — düzenleyici pasif hesap, borç bakiye verir.',
  '128': 'Şüpheli hâle gelen ticari alacakların izlendiği hesaptır. 129 ile karşılık ayrılır.',
  // 15 — Stoklar
  '150': 'Üretim sürecinde kullanılacak hammaddeler izlenir.',
  '151': 'Üretim sürecindeki yarı mamuller izlenir.',
  '152': 'Üretim tamamlanmış mamul stokları izlenir.',
  '153': 'İşletmenin satılmak üzere aldığı/ürettiği ticari mal stokları izlenir. Mal alımında borç, satış maliyetinde 621 üzerinden alacaklı çalışır.',
  '157': 'Tüketilmek üzere alınan, üretime girmeyen malzeme/sarf stokları izlenir (kırtasiye, temizlik, vs).',
  // 19 — Diğer Dönen Varlıklar
  '190': 'Devreden KDV — bir önceki dönemden devreden indirilecek KDV.',
  '191': 'Mal/hizmet alımında ödenen ve mahsup edilebilen KDV izlenir. KDV beyannamesinde 391 ile mahsuplaşır.',
  // 25 — Maddi Duran Varlıklar
  '252': 'Üretim/idare amaçlı binalar izlenir.',
  '253': 'Tesis, makine ve cihazlar izlenir.',
  '254': 'Taşıt araçları (ticari, idari) izlenir.',
  '255': 'Demirbaşlar — mobilya, bilgisayar, ekipman gibi 1 yıldan uzun ömürlü iktisadi kıymetler izlenir.',
  '257': 'Birikmiş amortisman — düzenleyici pasif hesap, MDV maliyetinden çıkartılarak net defter değeri bulunur.',
  '770': '', // sonra
  // 30 — Mali Borçlar (Kısa Vadeli)
  '300': 'Bilanço tarihinden itibaren bir yıl içinde ödenecek banka kredileri izlenir. Kredi kullanımında alacak (artış), anapara ödemesinde borç çalışır. Faiz tahakkukları 780 Finansman Giderleri\'ne yazılır.',
  '301': 'Cari hesap kredileri (kart limiti, açık kredi gibi) izlenir.',
  '303': 'Uzun vadeli kredilerin bir yıl içinde ödenecek anapara taksitleri izlenir.',
  // 32 — Ticari Borçlar
  '320': 'Mal/hizmet alımı kaynaklı, fatura kesilmiş ve senede bağlanmamış açık hesap satıcı borçları izlenir.',
  '321': 'Mal/hizmet alımı için verilen senet, bono ve poliçeler izlenir.',
  '322': 'Senetli borçların reeskont (vade indirim) tutarı — düzenleyici aktif hesap.',
  // 33 — Diğer Borçlar
  '335': 'Personele ait ödeme zamanı gelmiş net ücret borçları izlenir.',
  // 36 — Ödenecek Vergi ve Diğer Yükümlülükler
  '360': 'Ödenecek vergiler — gelir vergisi, damga vergisi, geçici vergi vb. izlenir.',
  '361': 'Ödenecek SGK primleri izlenir.',
  '391': 'Satışlarda hesaplanan ve devlete ödenecek KDV izlenir. 191 İndirilecek KDV ile mahsuplaşır, fark 360\'a aktarılır.',
  // 40 — Mali Borçlar (Uzun Vadeli)
  '400': 'Bilanço tarihinden itibaren bir yılı aşan vade ile alınmış banka kredileri izlenir. Vadenin son bir yılına girdiğinde 303\'e devredilir.',
  // 50 — Sermaye
  '500': 'Ortakların işletmeye taahhüt ettiği ve ödediği sermaye toplamı izlenir.',
  '501': 'Ödenmemiş sermaye — düzenleyici aktif hesap, taahhüt edilip henüz ödenmeyen kısım.',
  // 60 — Brüt Satışlar
  '600': 'Yurt içine yapılan mal/hizmet satışları izlenir.',
  '601': 'Yurt dışına yapılan ihracat satışları izlenir.',
  '602': 'Faaliyetle ilgili diğer gelirler izlenir.',
  // 61 — Satış İndirimleri
  '610': 'Satıştan iadeler — müşteriye iade edilen mal tutarları izlenir, brüt satışı azaltır.',
  '611': 'Satış iskontoları — peşin iskontosu, vadeden indirim, miktar iskontosu.',
  // 62 — Satışların Maliyeti
  '621': 'Satılan ticari malın maliyeti izlenir. Satış anında 153 Ticari Mallar\'dan bu hesaba aktarılır.',
  // 64 — Diğer Olağan Gelir ve Karlar
  '642': 'Faiz gelirleri — banka mevduat faizi, vadeli hesap getirisi.',
  // 66 — Finansman Giderleri (kısa vadeli — ana akış 78\'de)
  // 77 — Pazarlama, Satış ve Dağıtım Giderleri
  '760': 'Pazarlama, satış ve dağıtım giderleri (reklam, nakliye, komisyon).',
  // 77 — Genel Yönetim Giderleri
  // 78 — Finansman Giderleri
  '780': 'Banka kredisi faizleri, kur farkı zararı gibi finansman maliyetleri izlenir.',
};

// 268 hesap için stub chunk üretimi — kod, ad, sınıf, tür + popüler hesaplar için
// gerçek iş açıklaması. RAG retrieval'da terim isabeti yüksek.
const tdhpStubUret = (): MevzuatChunk[] =>
  HESAP_PLANI.map((h) => {
    const sinifAd = SINIF_AD[h.sinif] ?? `Sınıf ${h.sinif}`;
    const turAd = TUR_AD[h.tur] ?? h.tur.toLowerCase();
    const davr = TUR_DAVRANIS[h.tur] ?? '';
    const grup = h.kod.length >= 2 ? h.kod.substring(0, 2) : '';
    const detay = POPULER_HESAP_DETAY[h.kod];

    const metin = [
      `${h.kod} — ${h.ad}.`,
      detay || '', // popüler ise asıl iş açıklaması en başa
      `Sınıf ${h.sinif}: ${sinifAd}.`,
      grup ? `Grup ${grup} altında yer alır.` : '',
      `Tür: ${turAd}.`,
      davr,
      'Tek Düzen Hesap Planı (TDHP) — Muhasebe Sistemi Uygulama Genel Tebliği (1992) referans.',
    ]
      .filter(Boolean)
      .join(' ');

    return {
      kaynak: 'TDHP-MSUGT',
      baslik: `${h.kod} — ${h.ad}`,
      url: 'https://www.mevzuat.gov.tr',
      metin,
      guncellendi: '1992-12-26',
    };
  });

/**
 * Toplu metin → chunk listesi
 * 'MADDE 234' veya 'Madde 234' veya '234.' gibi başlıkları algılayıp böler.
 * Her bölünen parça bir chunk olur. Başlık + kalan metin = chunk gövdesi.
 */
const topluMetniBol = (
  ham: string,
  kaynak: string,
): MevzuatChunk[] => {
  const metin = ham.trim();
  if (!metin) return [];

  // Başlık desenleri (en güçlüden en zayıfa):
  //  - "MADDE 175" / "Madde 175" / "MADDE 175 -" / "MADDE 175."
  //  - "Madde 175/A" (alt madde)
  const regex = /^(MADDE|Madde|Bölüm|BÖLÜM)\s+([\dA-ZİÖÜŞĞÇa-zıöüşğç\/\-]+)/gm;
  const matches = [...metin.matchAll(regex)];
  if (matches.length === 0) {
    // Hiç madde başlığı bulunamadı → tek chunk
    return [
      {
        kaynak,
        baslik: kaynak,
        metin: metin.slice(0, 4000),
      },
    ];
  }

  const chunklar: MevzuatChunk[] = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const baslangic = m.index ?? 0;
    const bitis = i + 1 < matches.length ? (matches[i + 1].index ?? metin.length) : metin.length;
    const parca = metin.slice(baslangic, bitis).trim();
    const baslik = `${m[1]} ${m[2]}`.replace(/\s+/g, ' ').trim();

    if (parca.length < 30) continue; // çok kısa, anlamlı değil
    chunklar.push({
      kaynak,
      baslik,
      metin: parca.slice(0, 4000),
    });
  }

  return chunklar;
};

type Sekme = 'tek' | 'toplu' | 'tdhp';

export const AdminMevzuatSayfasi = () => {
  const [sekme, setSekme] = useState<Sekme>('tek');
  const [calisiyor, setCalisiyor] = useState(false);
  const [ilerleme, setIlerleme] = useState<{ yapilan: number; toplam: number } | null>(null);
  const [sonuc, setSonuc] = useState<string | null>(null);
  const [hataMsj, setHataMsj] = useState<string | null>(null);
  const [liste, setListe] = useState<MevzuatRow[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [arama, setArama] = useState('');

  // ── Tek madde formu ──
  const [formKaynak, setFormKaynak] = useState('VUK');
  const [formBaslik, setFormBaslik] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formMetin, setFormMetin] = useState('');
  const [formGuncellendi, setFormGuncellendi] = useState('');

  // ── Toplu metin ──
  const [topluKaynak, setTopluKaynak] = useState('VUK');
  const [topluMetin, setTopluMetin] = useState('');
  const [topluOnizleme, setTopluOnizleme] = useState<MevzuatChunk[] | null>(null);

  const yukle = async () => {
    setYukleniyor(true);
    const { data, error } = await supabase
      .from('mevzuat_chunklar')
      .select('id, kaynak, baslik, url, metin, guncellendi, created_at')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) setHataMsj(`Liste yüklenemedi: ${error.message}`);
    else setListe(data ?? []);
    setYukleniyor(false);
  };

  useEffect(() => {
    yukle().catch((e) => setHataMsj(String(e)));
  }, []);

  const filtreli = useMemo(() => {
    const q = arama.trim().toLowerCase();
    if (!q) return liste;
    return liste.filter(
      (r) =>
        r.kaynak.toLowerCase().includes(q) ||
        r.baslik.toLowerCase().includes(q) ||
        r.metin.toLowerCase().includes(q),
    );
  }, [liste, arama]);

  const grupla = useMemo(() => {
    const g: Record<string, number> = {};
    liste.forEach((r) => {
      g[r.kaynak] = (g[r.kaynak] ?? 0) + 1;
    });
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }, [liste]);

  // 50'lik batch'lere bölüp sırayla embed eder, progress'i günceller
  const batchEmbed = async (chunklar: MevzuatChunk[]) => {
    setSonuc(null);
    setHataMsj(null);
    setIlerleme({ yapilan: 0, toplam: chunklar.length });

    const BATCH = 5; // Edge Function compute limit'ine karşı küçük tut (gte-small belleği)
    let toplamEklenen = 0;
    const tumHatalar: string[] = [];

    for (let i = 0; i < chunklar.length; i += BATCH) {
      const dilim = chunklar.slice(i, i + BATCH);
      try {
        const r = await mevzuatEmbed({ chunklar: dilim });
        toplamEklenen += r.eklendi;
        if (r.hatalar?.length) {
          tumHatalar.push(...r.hatalar.map((h) => `[${i + h.index}] ${h.baslik}: ${h.hata}`));
        }
      } catch (e) {
        tumHatalar.push(`Batch ${i / BATCH + 1}: ${(e as Error).message}`);
      }
      setIlerleme({ yapilan: Math.min(i + BATCH, chunklar.length), toplam: chunklar.length });
    }

    setIlerleme(null);
    setSonuc(
      `${toplamEklenen} chunk eklendi${tumHatalar.length > 0 ? ` · ${tumHatalar.length} hata` : ''}`,
    );
    if (tumHatalar.length > 0) setHataMsj(tumHatalar.slice(0, 10).join('\n'));
    if (toplamEklenen > 0) await yukle();
  };

  // ── Sekme: tek madde ──
  const tekEkle = async () => {
    if (!formBaslik.trim() || !formMetin.trim()) {
      setHataMsj('Başlık ve metin zorunlu');
      return;
    }
    if (formMetin.length > 4000) {
      setHataMsj(`Metin çok uzun (${formMetin.length} karakter, max 4000). Toplu Metin sekmesini dene.`);
      return;
    }
    setCalisiyor(true);
    try {
      await batchEmbed([
        {
          kaynak: formKaynak,
          baslik: formBaslik.trim(),
          url: formUrl.trim() || undefined,
          metin: formMetin.trim(),
          guncellendi: formGuncellendi || undefined,
        },
      ]);
      setFormBaslik('');
      setFormUrl('');
      setFormMetin('');
      setFormGuncellendi('');
    } finally {
      setCalisiyor(false);
    }
  };

  // ── Sekme: toplu metin → otomatik böl ──
  const topluBol = () => {
    setHataMsj(null);
    setSonuc(null);
    const parcalar = topluMetniBol(topluMetin, topluKaynak);
    if (parcalar.length === 0) {
      setHataMsj('Metin boş');
      setTopluOnizleme(null);
      return;
    }
    setTopluOnizleme(parcalar);
  };

  const topluEmbedle = async () => {
    if (!topluOnizleme || topluOnizleme.length === 0) return;
    setCalisiyor(true);
    try {
      await batchEmbed(topluOnizleme);
      setTopluMetin('');
      setTopluOnizleme(null);
    } finally {
      setCalisiyor(false);
    }
  };

  // ── Sekme: TDHP otomatik ──
  // Tüm 268 hesabı oluşturur ve upsert eder (kaynak+baslik üzerinde unique).
  // Mevcut chunk'ların metni güncellenmiş olur — popüler hesaplar için iş
  // açıklamaları (banka kredisi, KDV, fatura, stok terimleri) eklenir.
  const tdhpUret = async () => {
    setCalisiyor(true);
    try {
      const { count } = await supabase
        .from('mevzuat_chunklar')
        .select('*', { count: 'exact', head: true })
        .eq('kaynak', 'TDHP-MSUGT');

      const tumStub = tdhpStubUret();

      const mesaj =
        !count || count === 0
          ? `${tumStub.length} hesap için otomatik chunk üretilecek ve embedlenecek. ~10-15 dakika sürer (Edge Function compute limiti nedeniyle 5'lik batch). Devam?`
          : `Mevcut ${count} TDHP chunk'ı yenilenecek (popüler hesaplar için zenginleştirilmiş açıklamalar). ~10-15 dakika. Devam?`;

      if (!confirm(mesaj)) return;

      await batchEmbed(tumStub);
    } finally {
      setCalisiyor(false);
    }
  };

  const sil = async (row: MevzuatRow) => {
    if (!confirm(`"${row.kaynak} — ${row.baslik}" silinsin mi?`)) return;
    const { error } = await supabase.from('mevzuat_chunklar').delete().eq('id', row.id);
    if (error) {
      setHataMsj(`Silinemedi: ${error.message}`);
      return;
    }
    setListe((l) => l.filter((r) => r.id !== row.id));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-8">
        <AdminYanMenu />

        <div className="flex-1 min-w-0">
          {/* Üst başlık */}
          <header className="mb-8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-2">
              AI Eğitim Verisi
            </div>
            <h1 className="font-display text-[32px] font-bold tracking-tight text-stone-900 dark:text-zinc-100 leading-tight">
              Mevzuat Havuzu
            </h1>
            <p className="text-[14px] text-stone-600 dark:text-zinc-400 leading-relaxed mt-2 max-w-2xl">
              Soru ekranındaki AI asistan, mevzuat parçalarını kaynak göstererek cevap verir.
              Aşağıdan üç farklı yolla içerik ekleyebilirsin.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-stone-50 dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-700 text-[11.5px] text-stone-600 dark:text-zinc-400">
              <Icon name="Info" size={12} className="text-stone-500 dark:text-zinc-500" />
              <span>
                Aynı <strong>kaynak + başlık</strong> tekrar gönderilirse mevcut chunk üzerine
                yazılır — duplicate oluşmaz.
              </span>
            </div>
          </header>

          {/* İstatistik şeridi */}
          <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 px-5 py-4 border border-stone-200 dark:border-zinc-700 rounded-xl bg-stone-50 dark:bg-zinc-900/40">
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                Toplam
              </div>
              <div className="font-display text-2xl font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
                {liste.length}
              </div>
            </div>
            {grupla.slice(0, 6).map(([kaynak, sayi]) => (
              <div key={kaynak}>
                <div className="text-[10px] tracking-[0.22em] uppercase text-stone-500 dark:text-zinc-500 font-bold font-mono">
                  {kaynak}
                </div>
                <div className="font-mono text-base font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
                  {sayi}
                </div>
              </div>
            ))}
          </div>

          {/* Sekme şeridi */}
          <div className="mb-5 flex gap-1 border-b border-stone-200 dark:border-zinc-700">
            {[
              { id: 'tek' as const, etiket: 'Tek madde ekle', icon: 'Plus' },
              { id: 'toplu' as const, etiket: 'Toplu metin yapıştır', icon: 'AlignLeft' },
              { id: 'tdhp' as const, etiket: 'Hesap planı (otomatik)', icon: 'Sparkles' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSekme(s.id);
                  setSonuc(null);
                  setHataMsj(null);
                  setTopluOnizleme(null);
                }}
                className={`px-4 py-2.5 text-[13px] font-semibold tracking-wide flex items-center gap-2 border-b-2 -mb-px transition ${
                  sekme === s.id
                    ? 'border-stone-900 dark:border-zinc-100 text-stone-900 dark:text-zinc-100'
                    : 'border-transparent text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon name={s.icon} size={13} />
                {s.etiket}
              </button>
            ))}
          </div>

          {/* SEKME — Tek madde */}
          {sekme === 'tek' && (
            <section className="mb-10 space-y-3">
              <p className="text-[12.5px] text-stone-500 dark:text-zinc-500 leading-relaxed">
                mevzuat.gov.tr'den <strong>tek bir maddeyi</strong> kopyalayıp yapıştır. Metin
                max 4000 karakter — daha uzun ise <em>Toplu metin</em> sekmesini kullan.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-[11px] tracking-wider uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1 block">
                    Kaynak
                  </span>
                  <select
                    value={formKaynak}
                    onChange={(e) => setFormKaynak(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
                  >
                    {KAYNAK_SECENEK.map((k) => (
                      <option key={k.kod} value={k.kod}>
                        {k.etiket}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-[11px] tracking-wider uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1 block">
                    Başlık (zorunlu)
                  </span>
                  <input
                    type="text"
                    value={formBaslik}
                    onChange={(e) => setFormBaslik(e.target.value)}
                    placeholder="Örn: Madde 234 — Gider Pusulası"
                    className="w-full px-3 py-2 text-[13px] bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block md:col-span-2">
                  <span className="text-[11px] tracking-wider uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1 block">
                    URL (opsiyonel)
                  </span>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://www.mevzuat.gov.tr/..."
                    className="w-full px-3 py-2 text-[13px] bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] tracking-wider uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1 block">
                    Yürürlük (opsiyonel)
                  </span>
                  <input
                    type="date"
                    value={formGuncellendi}
                    onChange={(e) => setFormGuncellendi(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-[11px] tracking-wider uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1 flex items-baseline justify-between">
                  <span>Metin (zorunlu)</span>
                  <span className="text-[10px] font-mono text-stone-400 dark:text-zinc-600 tabular-nums">
                    {formMetin.length} / 4000
                  </span>
                </span>
                <textarea
                  value={formMetin}
                  onChange={(e) => setFormMetin(e.target.value)}
                  placeholder="Madde gövdesini buraya yapıştır. mevzuat.gov.tr'den kopyala-yapıştır direkt çalışır."
                  className="w-full h-44 px-3 py-2 text-[13px] leading-relaxed bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300 resize-y"
                  disabled={calisiyor}
                />
              </label>

              <button
                onClick={tekEkle}
                disabled={calisiyor || !formBaslik.trim() || !formMetin.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold tracking-wide hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {calisiyor ? (
                  <>
                    <Icon name="Loader2" size={14} className="animate-spin" />
                    Embed ediliyor…
                  </>
                ) : (
                  <>
                    <Icon name="Plus" size={14} />
                    Ekle ve embedle
                  </>
                )}
              </button>
            </section>
          )}

          {/* SEKME — Toplu metin */}
          {sekme === 'toplu' && (
            <section className="mb-10 space-y-3">
              <p className="text-[12.5px] text-stone-500 dark:text-zinc-500 leading-relaxed">
                Bir mevzuatın birden fazla maddesini tek seferde yapıştır.{' '}
                <code className="font-mono text-[11px] bg-stone-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  MADDE 234
                </code>{' '}
                veya{' '}
                <code className="font-mono text-[11px] bg-stone-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  Bölüm V
                </code>{' '}
                gibi başlıkları otomatik tanır ve her maddeyi ayrı bir chunk yapar. Önce
                <strong> Önizle</strong>, sonra hepsini embedle.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-[11px] tracking-wider uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1 block">
                    Kaynak
                  </span>
                  <select
                    value={topluKaynak}
                    onChange={(e) => setTopluKaynak(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
                  >
                    {KAYNAK_SECENEK.map((k) => (
                      <option key={k.kod} value={k.kod}>
                        {k.etiket}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="md:col-span-2 text-[11.5px] text-stone-500 dark:text-zinc-500 self-end pb-2">
                  Tek seferde 200+ madde de yapıştırabilirsin — sistem 50'lik gruplara böler.
                </div>
              </div>

              <label className="block">
                <span className="text-[11px] tracking-wider uppercase text-stone-500 dark:text-zinc-500 font-bold mb-1 flex items-baseline justify-between">
                  <span>Tüm metin</span>
                  <span className="text-[10px] font-mono text-stone-400 dark:text-zinc-600 tabular-nums">
                    {topluMetin.length} karakter
                  </span>
                </span>
                <textarea
                  value={topluMetin}
                  onChange={(e) => {
                    setTopluMetin(e.target.value);
                    setTopluOnizleme(null);
                  }}
                  placeholder={`Örnek:\n\nMADDE 175\nBu Kanunun uygulanmasında...\n\nMADDE 176\nBirinci sınıf tüccarlar...\n\nMADDE 177\n...`}
                  className="w-full h-72 px-3 py-2 font-mono text-[12px] leading-relaxed bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300 resize-y"
                  disabled={calisiyor}
                />
              </label>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={topluBol}
                  disabled={calisiyor || !topluMetin.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 text-[13px] font-semibold transition disabled:opacity-40"
                >
                  <Icon name="AlignLeft" size={13} />
                  Önizle (madde madde böl)
                </button>
                {topluOnizleme && topluOnizleme.length > 0 && (
                  <button
                    onClick={topluEmbedle}
                    disabled={calisiyor}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold tracking-wide hover:opacity-90 transition disabled:opacity-40"
                  >
                    {calisiyor ? (
                      <>
                        <Icon name="Loader2" size={13} className="animate-spin" />
                        Embed ediliyor…
                      </>
                    ) : (
                      <>
                        <Icon name="Sparkles" size={13} />
                        {topluOnizleme.length} chunk'ı embedle
                      </>
                    )}
                  </button>
                )}
              </div>

              {topluOnizleme && topluOnizleme.length > 0 && (
                <div className="mt-3 border border-stone-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-stone-50 dark:bg-zinc-900/40 border-b border-stone-200 dark:border-zinc-700 text-[11px] tracking-wider uppercase font-bold text-stone-600 dark:text-zinc-400">
                    Önizleme — {topluOnizleme.length} chunk bulundu
                  </div>
                  <ul className="max-h-72 overflow-y-auto">
                    {topluOnizleme.slice(0, 30).map((c, i) => (
                      <li
                        key={i}
                        className="px-3 py-2 border-b border-stone-100 dark:border-zinc-800 text-[12px]"
                      >
                        <div className="font-mono text-[10px] tracking-wider uppercase text-stone-500 dark:text-zinc-500 font-bold mb-0.5">
                          {c.kaynak} · {c.baslik}
                        </div>
                        <div className="text-stone-600 dark:text-zinc-400 line-clamp-2 leading-snug">
                          {c.metin}
                        </div>
                      </li>
                    ))}
                    {topluOnizleme.length > 30 && (
                      <li className="px-3 py-2 text-[12px] text-stone-500 dark:text-zinc-500 text-center">
                        … ve {topluOnizleme.length - 30} chunk daha
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* SEKME — TDHP otomatik */}
          {sekme === 'tdhp' && (
            <section className="mb-10">
              <div className="border border-stone-200 dark:border-zinc-700 rounded-xl p-6 bg-stone-50 dark:bg-zinc-900/40">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon name="Sparkles" size={18} className="text-amber-700 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-base text-stone-900 dark:text-zinc-100 mb-1">
                      Hesap Planı'ndan otomatik chunk üret
                    </h3>
                    <p className="text-[13px] text-stone-600 dark:text-zinc-400 leading-relaxed mb-4">
                      Veritabanındaki <strong>{HESAP_PLANI.length} hesap</strong> için tek tıkla
                      başlangıç chunk'ları üretilir. Her hesap için kod, ad, sınıf, grup ve
                      borç/alacak davranışı içeren kısa bir özet metin oluşturulur ve
                      embedlenir.
                    </p>
                    <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded p-3 mb-4 font-mono text-[11.5px] leading-relaxed text-stone-700 dark:text-zinc-300">
                      <div className="font-bold mb-1">Örnek çıktı (100 — KASA):</div>
                      <div className="text-stone-600 dark:text-zinc-400">
                        100 — KASA. Sınıf 1: Dönen Varlıklar. Grup 10 altında yer alır. Tür:
                        aktif karakterli (varlık). Borçlu çalışır; artışlar borç, azalışlar
                        alacak tarafa yazılır. Tek Düzen Hesap Planı (TDHP) — Muhasebe Sistemi
                        Uygulama Genel Tebliği (1992) referans.
                      </div>
                    </div>
                    <div className="text-[11.5px] text-stone-500 dark:text-zinc-500 mb-4 leading-relaxed">
                      <strong>Bu başlangıç verisidir.</strong> İlerde her hesabı tek tek açıp
                      gerçek MSUGT açıklamasıyla zenginleştirebilirsin (Tek madde sekmesi). Ama
                      bugünden AI <em>"100 hesabı nedir?"</em> sorusuna cevap verir.
                    </div>
                    <button
                      onClick={tdhpUret}
                      disabled={calisiyor}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-bold tracking-wide hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {calisiyor ? (
                        <>
                          <Icon name="Loader2" size={14} className="animate-spin" />
                          Üretiliyor…
                        </>
                      ) : (
                        <>
                          <Icon name="Sparkles" size={14} />
                          {HESAP_PLANI.length} hesap için otomatik üret
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Progress / sonuç / hata */}
          {ilerleme && (
            <div className="mb-4 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-semibold text-blue-900 dark:text-blue-200">
                  Embed ediliyor ({ilerleme.yapilan}/{ilerleme.toplam})
                </span>
                <span className="text-[11px] font-mono text-blue-700 dark:text-blue-400 tabular-nums">
                  %{Math.round((ilerleme.yapilan / ilerleme.toplam) * 100)}
                </span>
              </div>
              <div className="h-1.5 bg-blue-100 dark:bg-blue-900/40 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-700 dark:bg-blue-400 transition-all"
                  style={{ width: `${(ilerleme.yapilan / ilerleme.toplam) * 100}%` }}
                />
              </div>
            </div>
          )}

          {sonuc && (
            <div className="mb-4 px-4 py-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 text-[13px] text-emerald-900 dark:text-emerald-200 inline-flex items-center gap-2">
              <Icon name="Check" size={14} />
              {sonuc}
            </div>
          )}

          {hataMsj && (
            <pre className="mb-6 px-4 py-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900 text-[12px] text-rose-800 dark:text-rose-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {hataMsj}
            </pre>
          )}

          {/* Mevcut chunk listesi */}
          <section className="mt-8">
            <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
              <h2 className="font-display text-lg font-bold text-stone-900 dark:text-zinc-100">
                Mevcut chunk'lar
              </h2>
              <input
                type="text"
                value={arama}
                onChange={(e) => setArama(e.target.value)}
                placeholder="Ara: kaynak, başlık, metin…"
                className="w-72 px-3 py-1.5 text-[13px] bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded focus:outline-none focus:border-stone-900 dark:focus:border-zinc-300"
              />
            </div>

            {yukleniyor ? (
              <SkeletonSatirlar satirSayisi={4} />
            ) : filtreli.length === 0 ? (
              <div className="py-12 text-center text-[13px] text-stone-500 dark:text-zinc-500">
                {liste.length === 0
                  ? 'Henüz chunk yok. Yukarıdan ilk grubu ekle.'
                  : 'Aramana uyan chunk yok.'}
              </div>
            ) : (
              <ul className="border-t border-stone-200 dark:border-zinc-700">
                {filtreli.map((row) => (
                  <li
                    key={row.id}
                    className="border-b border-stone-200 dark:border-zinc-700 py-4 px-1 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-stone-500 dark:text-zinc-500 font-bold">
                          {row.kaynak}
                        </span>
                        <span className="font-display text-[14px] font-bold text-stone-900 dark:text-zinc-100">
                          {row.baslik}
                        </span>
                        {row.guncellendi && (
                          <span className="font-mono text-[10px] text-stone-400 dark:text-zinc-600">
                            {row.guncellendi}
                          </span>
                        )}
                      </div>
                      <p className="text-[12.5px] text-stone-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {row.metin}
                      </p>
                      {row.url && (
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-1 text-[11px] text-blue-700 dark:text-blue-400 hover:underline truncate max-w-[420px]"
                        >
                          {row.url}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => sil(row)}
                      className="p-2 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition flex-shrink-0"
                      title="Sil"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};
