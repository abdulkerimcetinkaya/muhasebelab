import type { Rozet } from '../types';

export const ROZETLER: Rozet[] = [
  { id: 'ilk-adim', ad: 'İlk Adım', aciklama: 'İlk soruyu çöz', icon: 'Footprints', kontrol: (s) => s.cozulenSayi >= 1 },
  { id: 'besinci', ad: 'Yol Alıyor', aciklama: '5 soru çöz', icon: 'Milestone', kontrol: (s) => s.cozulenSayi >= 5 },
  { id: 'onuncu', ad: 'Onuncu Kayıt', aciklama: '10 soru çöz', icon: 'Award', kontrol: (s) => s.cozulenSayi >= 10 },
  {
    id: 'hepsi',
    ad: 'İleri Düzey',
    aciklama: "Soruların %80'ini çöz",
    icon: 'Trophy',
    kontrol: (s) => s.toplamSoru > 0 && s.cozulenSayi >= Math.ceil(s.toplamSoru * 0.8),
  },
  {
    id: 'kasa-usta',
    ad: 'Kasa Ustası',
    aciklama: 'Kasa İşlemleri ünitesini bitir',
    icon: 'Banknote',
    kontrol: (s) => !!s.uniteTamamlanmis['kasa'],
  },
  {
    id: 'mal-usta',
    ad: 'Ticaret Ustası',
    aciklama: 'Ticari Mal ünitesini bitir',
    icon: 'Package',
    kontrol: (s) => !!s.uniteTamamlanmis['mal'],
  },
  {
    id: 'kdv-usta',
    ad: 'KDV Ustası',
    aciklama: 'KDV ünitesini bitir',
    icon: 'Receipt',
    kontrol: (s) => !!s.uniteTamamlanmis['kdv'],
  },
  { id: 'zor-aslani', ad: 'Zor Aslanı', aciklama: '3 zor soruyu çöz', icon: 'Flame', kontrol: (s) => s.zorCozum >= 3 },
  { id: 'seri-3', ad: 'Üç Günlük Seri', aciklama: '3 gün üst üste çözüm', icon: 'Calendar', kontrol: (s) => s.streak >= 3 },
  { id: 'seri-7', ad: 'Haftalık Ateş', aciklama: '7 gün üst üste çözüm', icon: 'Zap', kontrol: (s) => s.streak >= 7 },
  { id: 'puan-100', ad: 'Yüzlük', aciklama: '100 puana ulaş', icon: 'Star', kontrol: (s) => s.puan >= 100 },
  { id: 'puan-500', ad: 'Beş Yüz', aciklama: '500 puana ulaş', icon: 'Sparkles', kontrol: (s) => s.puan >= 500 },
];
