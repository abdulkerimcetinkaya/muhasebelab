import type { Zorluk } from '../types';

export const SINIF_ISIMLERI: Record<string, string> = {
  '1': 'Dönen Varlıklar',
  '2': 'Duran Varlıklar',
  '3': 'Kısa Vadeli Yabancı Kaynaklar',
  '4': 'Uzun Vadeli Yabancı Kaynaklar',
  '5': 'Öz Kaynaklar',
  '6': 'Gelir Tablosu Hesapları',
  '7': 'Maliyet Hesapları',
};

// İki haneli grup başlıkları (TDHP — Fuat Hoca PDF referansı)
export const GRUP_ISIMLERI: Record<string, string> = {
  // Sınıf 1 — Dönen Varlıklar
  '10': 'Hazır Değerler',
  '11': 'Menkul Kıymetler',
  '12': 'Ticari Alacaklar',
  '13': 'Diğer Alacaklar',
  '15': 'Stoklar',
  '17': 'Yıllara Yaygın İnşaat ve Onarım Maliyetleri',
  '18': 'Gelecek Aylara Ait Giderler ve Gelir Tahakkukları',
  '19': 'Diğer Dönen Varlıklar',
  // Sınıf 2 — Duran Varlıklar
  '22': 'Ticari Alacaklar',
  '23': 'Diğer Alacaklar',
  '24': 'Mali Duran Varlıklar',
  '25': 'Maddi Duran Varlıklar',
  '26': 'Maddi Olmayan Duran Varlıklar',
  '27': 'Özel Tükenmeye Tabi Varlıklar',
  '28': 'Gelecek Yıllara Ait Giderler ve Gelir Tahakkukları',
  '29': 'Diğer Duran Varlıklar',
  // Sınıf 3 — Kısa Vadeli Yabancı Kaynaklar
  '30': 'Mali Borçlar',
  '32': 'Ticari Borçlar',
  '33': 'Diğer Borçlar',
  '34': 'Alınan Avanslar',
  '35': 'Yıllara Yaygın İnşaat ve Onarım Hakedişleri',
  '36': 'Ödenecek Vergi ve Diğer Yükümlülükler',
  '37': 'Borç ve Gider Karşılıkları',
  '38': 'Gelecek Aylara Ait Gelirler ve Gider Tahakkukları',
  '39': 'Diğer Kısa Vadeli Yabancı Kaynaklar',
  // Sınıf 4 — Uzun Vadeli Yabancı Kaynaklar
  '40': 'Mali Borçlar',
  '42': 'Ticari Borçlar',
  '43': 'Diğer Borçlar',
  '44': 'Alınan Avanslar',
  '47': 'Borç ve Gider Karşılıkları',
  '48': 'Gelecek Yıllara Ait Gelirler ve Gider Tahakkukları',
  '49': 'Diğer Uzun Vadeli Yabancı Kaynaklar',
  // Sınıf 5 — Öz Kaynaklar
  '50': 'Ödenmiş Sermaye',
  '52': 'Sermaye Yedekleri',
  '54': 'Kar Yedekleri',
  '57': 'Geçmiş Yıllar Karları',
  '58': 'Geçmiş Yıllar Zararları',
  '59': 'Dönem Net Karı (Zararı)',
  // Sınıf 6 — Gelir Tablosu
  '60': 'Brüt Satışlar',
  '61': 'Satış İndirimleri (-)',
  '62': 'Satışların Maliyeti (-)',
  '63': 'Faaliyet Giderleri (-)',
  '64': 'Diğer Faaliyetlerden Olağan Gelir ve Karlar',
  '65': 'Diğer Faaliyetlerden Olağan Gider ve Zararlar (-)',
  '66': 'Finansman Giderleri (-)',
  '67': 'Olağandışı Gelir ve Karlar',
  '68': 'Olağandışı Gider ve Zararlar (-)',
  '69': 'Dönem Net Kar veya Zararı',
  // Sınıf 7 — Maliyet Hesapları
  '70': 'Maliyet Muhasebesi Bağlantı Hesapları',
  '71': 'Direkt İlk Madde ve Malzeme Giderleri',
  '72': 'Direkt İşçilik Giderleri',
  '73': 'Genel Üretim Giderleri',
  '74': 'Hizmet Üretim Maliyeti',
  '75': 'Araştırma ve Geliştirme Giderleri',
  '76': 'Pazarlama, Satış ve Dağıtım Giderleri',
  '77': 'Genel Yönetim Giderleri',
  '78': 'Finansman Giderleri',
  '79': 'Gider Çeşitleri Hesapları (7/B)',
};

export const ZORLUK_PUAN: Record<Zorluk, number> = {
  kolay: 5,
  orta: 10,
  zor: 20,
};

export const ZORLUK_STIL: Record<Zorluk, string> = {
  kolay: 'text-emerald-700 dark:text-emerald-400',
  orta: 'text-amber-700 dark:text-amber-400',
  zor: 'text-rose-700 dark:text-rose-400',
};

export const ZORLUK_AD: Record<Zorluk, string> = {
  kolay: 'Kolay',
  orta: 'Orta',
  zor: 'Zor',
};

export const ZORLUK_SIRA: Record<Zorluk, number> = {
  kolay: 1,
  orta: 2,
  zor: 3,
};

export const STORAGE_KEY = 'mli_progress_v3';
