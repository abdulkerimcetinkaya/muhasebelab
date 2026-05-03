// MuhasebeLab Karne — A4 PDF rapor kartı.
// Profil sayfasındaki "Karneyi PDF indir" butonu bu modülü dynamic import'la
// yükler — @react-pdf/renderer ~600KB initial bundle'a girmesin diye.
//
// Türkçe karakter desteği için Roboto fontu @fontsource/roboto paketinden
// (latin-ext alfabesi — ş ı ğ ü ö ç dahil). Vite asset olarak sunulur,
// runtime fetch yok, offline çalışır, versionlanır.
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';
// TTF — public/fonts/'tan sunulan Roboto. fontkit (PDFKit altyapısı) TTF'yi en
// güvenilir şekilde parse ediyor. WOFF1'de dotless ı (U+0131) "1" olarak
// görünüyor, WOFF2'de "DataView out of bounds" hatası — TTF her ikisini de
// çözüyor.
import { ROZETLER } from '../data/rozetler';
import { kisiselRekorlar } from './profil-rekorlar';
import { uniteYetkinlikleri } from './yetkinlik';
import type { Ilerleme, Istatistik, Unite } from '../types';

const FONT_BASE = `${window.location.origin}/fonts`;

Font.register({
  family: 'Roboto',
  fonts: [
    { src: `${FONT_BASE}/Roboto-Regular.ttf`, fontWeight: 400 },
    { src: `${FONT_BASE}/Roboto-Medium.ttf`, fontWeight: 500 },
    { src: `${FONT_BASE}/Roboto-Bold.ttf`, fontWeight: 700 },
    { src: `${FONT_BASE}/Roboto-Black.ttf`, fontWeight: 900 },
  ],
});

const C = {
  ink: '#0f172a',
  inkSoft: '#475569',
  inkMute: '#94a3b8',
  bg: '#ffffff',
  surface: '#f8fafc',
  line: '#e2e8f0',
  blue: '#1d4ed8',
  blueLight: '#dbeafe',
  amber: '#b45309',
  amberLight: '#fef3c7',
  rose: '#b91c1c',
  emerald: '#047857',
  violet: '#6d28d9',
};

const s = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    backgroundColor: C.bg,
    padding: 36,
    color: C.ink,
    fontSize: 10,
    lineHeight: 1.4,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: C.ink,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 900 },
  headerInfo: { flex: 1 },
  brand: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.inkMute,
    fontWeight: 700,
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: -0.3,
    lineHeight: 1.15,
    marginBottom: 6,
  },
  meta: {
    fontSize: 9,
    color: C.inkSoft,
    fontWeight: 500,
    lineHeight: 1.3,
  },
  tarih: {
    fontSize: 9,
    color: C.inkMute,
    fontWeight: 500,
    textAlign: 'right',
  },

  // Bölüm başlığı
  sectionH: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.inkSoft,
    fontWeight: 700,
    marginBottom: 8,
  },
  sectionGap: { marginBottom: 18 },

  // Karne özeti — 4 büyük sayı yan yana
  karne: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 8,
    padding: 14,
    gap: 0,
  },
  karneCol: {
    flex: 1,
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderLeftColor: C.line,
  },
  karneColFirst: { borderLeftWidth: 0 },
  karneEt: {
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.inkMute,
    fontWeight: 700,
    marginBottom: 4,
  },
  karneVal: { fontSize: 24, fontWeight: 900, color: C.ink, lineHeight: 1 },
  karneAlt: { fontSize: 8, color: C.inkSoft, marginTop: 4, fontWeight: 500 },

  // Yetkinlik
  yetkinlikRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: C.line,
  },
  yetkinlikAd: { flex: 1, fontSize: 10, fontWeight: 500, color: C.ink },
  yetkinlikBarBg: {
    flex: 2,
    height: 6,
    backgroundColor: C.line,
    borderRadius: 3,
    overflow: 'hidden',
  },
  yetkinlikBarFill: { height: '100%', backgroundColor: C.blue },
  yetkinlikDeger: {
    width: 50,
    fontSize: 9,
    fontWeight: 700,
    color: C.inkSoft,
    textAlign: 'right',
  },
  yetkinlikYuzde: {
    width: 35,
    fontSize: 11,
    fontWeight: 900,
    textAlign: 'right',
  },

  // Rozetler
  rozetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rozetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: C.amberLight,
    borderRadius: 12,
  },
  rozetText: {
    fontSize: 9,
    fontWeight: 700,
    color: C.amber,
  },

  // Rekorlar
  rekorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rekorBox: {
    flex: 1,
    padding: 10,
    borderWidth: 0.5,
    borderColor: C.line,
    borderRadius: 6,
  },
  rekorEt: {
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.inkMute,
    fontWeight: 700,
    marginBottom: 4,
  },
  rekorVal: { fontSize: 16, fontWeight: 900, color: C.ink, lineHeight: 1 },
  rekorAlt: { fontSize: 8, color: C.inkSoft, marginTop: 3, fontWeight: 500 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: C.inkMute,
    fontWeight: 500,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: C.line,
  },
});

export interface KarneVerisi {
  ilerleme: Ilerleme;
  stat: Istatistik;
  uniteler: Unite[];
  profil: {
    universite: string;
    bolum: string;
    sinif: string;
    hedef: string;
  };
}

const SINIF_ETIKET: Record<string, string> = {
  '1': '1. Sınıf',
  '2': '2. Sınıf',
  '3': '3. Sınıf',
  '4': '4. Sınıf',
  mezun: 'Mezun',
  diger: '',
};
const HEDEF_ETIKET: Record<string, string> = {
  'vize-final': 'Vize/Final',
  kpss: 'KPSS',
  genel: 'Genel pratik',
  belirsiz: '',
};

const avatarRengi = (ad: string): string => {
  const renkler = ['#1d4ed8', '#047857', '#b91c1c', '#b45309', '#6d28d9', '#0e7490'];
  let hash = 0;
  for (let i = 0; i < ad.length; i++) hash += ad.charCodeAt(i);
  return renkler[hash % renkler.length];
};

const KarneDoc = ({ ilerleme, stat, uniteler, profil }: KarneVerisi) => {
  const ad = ilerleme.kullaniciAdi || 'Öğrenci';
  const rekorlar = kisiselRekorlar(ilerleme);
  const yetkinlikler = uniteYetkinlikleri(uniteler, ilerleme);
  const kazanilanRozetler = ROZETLER.filter((r) => ilerleme.kazanilanRozetler[r.id]);
  const bitirilenUnite = uniteler.filter((u) => {
    if (u.sorular.length === 0) return false;
    return u.sorular.every((sx) => ilerleme.cozulenler[sx.id]);
  }).length;

  const akademik = [
    profil.universite,
    profil.bolum,
    profil.sinif ? SINIF_ETIKET[profil.sinif] : '',
    profil.hedef ? HEDEF_ETIKET[profil.hedef] : '',
  ]
    .filter(Boolean)
    .join(' · ');

  const tarih = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document
      title={`MuhasebeLab Karne — ${ad}`}
      author="MuhasebeLab"
      subject="Öğrenci ilerleme karnesi"
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={[s.avatar, { backgroundColor: avatarRengi(ad) }]}>
            <Text style={s.avatarText}>{ad[0].toUpperCase()}</Text>
          </View>
          <View style={s.headerInfo}>
            <Text style={s.brand}>MuhasebeLab — Karne</Text>
            <Text style={s.name}>{ad}</Text>
            {akademik && <Text style={s.meta}>{akademik}</Text>}
          </View>
          <View>
            <Text style={s.brand}>Tarih</Text>
            <Text style={s.tarih}>{tarih}</Text>
          </View>
        </View>

        {/* Karne Özeti */}
        <View style={s.sectionGap}>
          <Text style={s.sectionH}>Karne Özeti</Text>
          <View style={s.karne}>
            <View style={[s.karneCol, s.karneColFirst]}>
              <Text style={s.karneEt}>Toplam Çözüm</Text>
              <Text style={s.karneVal}>{stat.cozulenSayi}</Text>
              <Text style={s.karneAlt}>/ {stat.toplamSoru} soru</Text>
            </View>
            <View style={s.karneCol}>
              <Text style={s.karneEt}>Toplam Puan</Text>
              <Text style={s.karneVal}>{ilerleme.puan}</Text>
              <Text style={s.karneAlt}>kazanılan</Text>
            </View>
            <View style={s.karneCol}>
              <Text style={s.karneEt}>Rozet</Text>
              <Text style={s.karneVal}>{kazanilanRozetler.length}</Text>
              <Text style={s.karneAlt}>/ {ROZETLER.length} rozet</Text>
            </View>
            <View style={s.karneCol}>
              <Text style={s.karneEt}>En Uzun Streak</Text>
              <Text style={s.karneVal}>{rekorlar.enUzunStreak}</Text>
              <Text style={s.karneAlt}>gün</Text>
            </View>
          </View>
        </View>

        {/* Yetkinlik Haritası */}
        <View style={s.sectionGap}>
          <Text style={s.sectionH}>Yetkinlik Haritası — Ünite × Mastery</Text>
          {yetkinlikler.map((y) => (
            <View key={y.uniteId} style={s.yetkinlikRow}>
              <Text style={s.yetkinlikAd}>{y.uniteAd}</Text>
              <View style={s.yetkinlikBarBg}>
                <View style={[s.yetkinlikBarFill, { width: `${y.yetkinlik}%` }]} />
              </View>
              <Text style={s.yetkinlikDeger}>
                {y.cozulenSoru}/{y.toplamSoru}
              </Text>
              <Text style={s.yetkinlikYuzde}>%{y.yetkinlik}</Text>
            </View>
          ))}
        </View>

        {/* Rozetler */}
        <View style={s.sectionGap}>
          <Text style={s.sectionH}>
            Kazanılan Rozetler ({kazanilanRozetler.length}/{ROZETLER.length})
          </Text>
          {kazanilanRozetler.length > 0 ? (
            <View style={s.rozetGrid}>
              {kazanilanRozetler.map((r) => (
                <View key={r.id} style={s.rozetItem}>
                  <Text style={s.rozetText}>{r.ad}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ fontSize: 9, color: C.inkMute, fontStyle: 'italic' }}>
              Henüz kazanılmış rozet yok.
            </Text>
          )}
        </View>

        {/* Kişisel Rekorlar */}
        <View style={s.sectionGap}>
          <Text style={s.sectionH}>Kişisel Rekorlar</Text>
          <View style={s.rekorRow}>
            <View style={s.rekorBox}>
              <Text style={s.rekorEt}>Tek günde rekor</Text>
              <Text style={s.rekorVal}>{rekorlar.enCokGun.sayi}</Text>
              <Text style={s.rekorAlt}>
                {rekorlar.enCokGun.tarih
                  ? new Date(rekorlar.enCokGun.tarih).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : '—'}
              </Text>
            </View>
            <View style={s.rekorBox}>
              <Text style={s.rekorEt}>Aktif gün</Text>
              <Text style={s.rekorVal}>{rekorlar.toplamAktifGun}</Text>
              <Text style={s.rekorAlt}>toplam</Text>
            </View>
            <View style={s.rekorBox}>
              <Text style={s.rekorEt}>İlk soru</Text>
              <Text style={s.rekorVal}>
                {rekorlar.ilkSoruTarihi
                  ? new Date(rekorlar.ilkSoruTarihi).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : '—'}
              </Text>
              <Text style={s.rekorAlt}>
                {rekorlar.ilkSoruTarihi
                  ? new Date(rekorlar.ilkSoruTarihi).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                    })
                  : 'henüz yok'}
              </Text>
            </View>
            <View style={s.rekorBox}>
              <Text style={s.rekorEt}>Bitirilen ünite</Text>
              <Text style={s.rekorVal}>{bitirilenUnite}</Text>
              <Text style={s.rekorAlt}>/ {uniteler.length} ünite</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text>MuhasebeLab — muhasebelab.com</Text>
          <Text>{tarih}</Text>
        </View>
      </Page>
    </Document>
  );
};

/**
 * Karneyi PDF olarak indirir. Tarayıcıda blob URL üretip download tetikler.
 */
export const karneyiIndir = async (veri: KarneVerisi): Promise<void> => {
  const blob = await pdf(<KarneDoc {...veri} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ad = (veri.ilerleme.kullaniciAdi || 'ogrenci')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  a.download = `muhasebelab-karne-${ad}-${new Date().toISOString().split('T')[0]}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};
