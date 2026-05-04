import type { Hesap } from '../types';

// Tek Düzen Hesap Planı (TDHP)
// Kaynak: Maliye Bakanlığı, Muhasebe Sistemi Uygulama Genel Tebliği (1992)
// Sınıflar: 1-Dönen Varlıklar, 2-Duran Varlıklar, 3-KV Yabancı Kaynaklar,
// 4-UV Yabancı Kaynaklar, 5-Öz Kaynaklar, 6-Gelir Tablosu, 7-Maliyet Hesapları
export const HESAP_PLANI: Hesap[] = [
  // ───────────── SINIF 1 — DÖNEN VARLIKLAR ─────────────
  // 10. Hazır Değerler
  { kod: '100', ad: 'KASA', sinif: '1', tur: 'AKTİF' },
  { kod: '101', ad: 'ALINAN ÇEKLER', sinif: '1', tur: 'AKTİF' },
  { kod: '102', ad: 'BANKALAR', sinif: '1', tur: 'AKTİF' },
  { kod: '103', ad: 'VERİLEN ÇEKLER VE ÖDEME EMİRLERİ (-)', sinif: '1', tur: 'AKTİF' },
  { kod: '108', ad: 'DİĞER HAZIR DEĞERLER', sinif: '1', tur: 'AKTİF' },

  // 11. Menkul Kıymetler
  { kod: '110', ad: 'HİSSE SENETLERİ', sinif: '1', tur: 'AKTİF' },
  { kod: '111', ad: 'ÖZEL KESİM TAHVİL, SENET VE BONOLARI', sinif: '1', tur: 'AKTİF' },
  { kod: '112', ad: 'KAMU KESİMİ TAHVİL, SENET VE BONOLARI', sinif: '1', tur: 'AKTİF' },
  { kod: '118', ad: 'DİĞER MENKUL KIYMETLER', sinif: '1', tur: 'AKTİF' },
  { kod: '119', ad: 'MENKUL KIYMETLER DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI (-)', sinif: '1', tur: 'AKTİF' },

  // 12. Ticari Alacaklar
  { kod: '120', ad: 'ALICILAR', sinif: '1', tur: 'AKTİF' },
  { kod: '121', ad: 'ALACAK SENETLERİ', sinif: '1', tur: 'AKTİF' },
  { kod: '122', ad: 'ALACAK SENETLERİ REESKONTU (-)', sinif: '1', tur: 'AKTİF' },
  { kod: '124', ad: 'KAZANILMAMIŞ FİNANSAL KİRALAMA FAİZ GELİRLERİ (-)', sinif: '1', tur: 'AKTİF' },
  { kod: '126', ad: 'VERİLEN DEPOZİTO VE TEMİNATLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '127', ad: 'DİĞER TİCARİ ALACAKLAR SENET VE BONOLARI', sinif: '1', tur: 'AKTİF' },
  { kod: '128', ad: 'ŞÜPHELİ TİCARİ ALACAKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '129', ad: 'ŞÜPHELİ TİCARİ ALACAKLAR KARŞILIĞI (-)', sinif: '1', tur: 'AKTİF' },

  // 13. Diğer Alacaklar
  { kod: '131', ad: 'ORTAKLARDAN ALACAKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '132', ad: 'İŞTİRAKLERDEN ALACAKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '133', ad: 'BAĞLI ORTAKLIKLARDAN ALACAKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '135', ad: 'PERSONELDEN ALACAKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '136', ad: 'DİĞER ÇEŞİTLİ ALACAKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '137', ad: 'DİĞER ALACAK SENETLERİ REESKONTU (-)', sinif: '1', tur: 'AKTİF' },
  { kod: '138', ad: 'ŞÜPHELİ DİĞER ALACAKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '139', ad: 'ŞÜPHELİ DİĞER ALACAKLAR KARŞILIĞI (-)', sinif: '1', tur: 'AKTİF' },

  // 15. Stoklar
  { kod: '150', ad: 'İLK MADDE VE MALZEME', sinif: '1', tur: 'AKTİF' },
  { kod: '151', ad: 'YARI MAMULLER - ÜRETİM', sinif: '1', tur: 'AKTİF' },
  { kod: '152', ad: 'MAMULLER', sinif: '1', tur: 'AKTİF' },
  { kod: '153', ad: 'TİCARİ MALLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '157', ad: 'DİĞER STOKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '158', ad: 'STOK DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI (-)', sinif: '1', tur: 'AKTİF' },
  { kod: '159', ad: 'VERİLEN SİPARİŞ AVANSLARI', sinif: '1', tur: 'AKTİF' },

  // 17. Yıllara Yaygın İnşaat ve Onarım Maliyetleri
  { kod: '170', ad: 'YILLARA YAYGIN İNŞAAT VE ONARIM MALİYETLERİ', sinif: '1', tur: 'AKTİF' },
  { kod: '178', ad: 'YILLARA YAYGIN İNŞAAT ENFLASYON DÜZELTME', sinif: '1', tur: 'AKTİF' },
  { kod: '179', ad: 'TAŞERONLARA VERİLEN AVANSLAR', sinif: '1', tur: 'AKTİF' },

  // 18. Gelecek Aylara Ait Giderler ve Gelir Tahakkukları
  { kod: '180', ad: 'GELECEK AYLARA AİT GİDERLER', sinif: '1', tur: 'AKTİF' },
  { kod: '181', ad: 'GELİR TAHAKKUKLARI', sinif: '1', tur: 'AKTİF' },

  // 19. Diğer Dönen Varlıklar
  { kod: '190', ad: 'DEVREDEN KDV', sinif: '1', tur: 'AKTİF' },
  { kod: '191', ad: 'İNDİRİLECEK KDV', sinif: '1', tur: 'AKTİF' },
  { kod: '192', ad: 'DİĞER KDV', sinif: '1', tur: 'AKTİF' },
  { kod: '193', ad: 'PEŞİN ÖDENEN VERGİLER VE FONLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '195', ad: 'İŞ AVANSLARI', sinif: '1', tur: 'AKTİF' },
  { kod: '196', ad: 'PERSONEL AVANSLARI', sinif: '1', tur: 'AKTİF' },
  { kod: '197', ad: 'SAYIM VE TESELLÜM NOKSANLARI', sinif: '1', tur: 'AKTİF' },
  { kod: '198', ad: 'DİĞER ÇEŞİTLİ DÖNEN VARLIKLAR', sinif: '1', tur: 'AKTİF' },
  { kod: '199', ad: 'DİĞER DÖNEN VARLIKLAR KARŞILIĞI (-)', sinif: '1', tur: 'AKTİF' },

  // ───────────── SINIF 2 — DURAN VARLIKLAR ─────────────
  // 22. Ticari Alacaklar (Uzun Vadeli)
  { kod: '220', ad: 'ALICILAR', sinif: '2', tur: 'AKTİF' },
  { kod: '221', ad: 'ALACAK SENETLERİ', sinif: '2', tur: 'AKTİF' },
  { kod: '222', ad: 'ALACAK SENETLERİ REESKONTU (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '224', ad: 'KAZANILMAMIŞ FİNANSAL KİRALAMA FAİZ GELİRLERİ (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '226', ad: 'VERİLEN DEPOZİTO VE TEMİNATLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '229', ad: 'ŞÜPHELİ ALACAKLAR KARŞILIĞI (-)', sinif: '2', tur: 'AKTİF' },

  // 23. Diğer Alacaklar (Uzun Vadeli)
  { kod: '231', ad: 'ORTAKLARDAN ALACAKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '232', ad: 'İŞTİRAKLERDEN ALACAKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '233', ad: 'BAĞLI ORTAKLIKLARDAN ALACAKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '235', ad: 'PERSONELDEN ALACAKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '236', ad: 'DİĞER ÇEŞİTLİ ALACAKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '237', ad: 'DİĞER ALACAK SENETLERİ REESKONTU (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '238', ad: 'ŞÜPHELİ DİĞER ALACAKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '239', ad: 'ŞÜPHELİ DİĞER ALACAKLAR KARŞILIĞI (-)', sinif: '2', tur: 'AKTİF' },

  // 24. Mali Duran Varlıklar
  { kod: '240', ad: 'BAĞLI MENKUL KIYMETLER', sinif: '2', tur: 'AKTİF' },
  { kod: '241', ad: 'BAĞLI MENKUL KIYMETLER DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '242', ad: 'İŞTİRAKLER', sinif: '2', tur: 'AKTİF' },
  { kod: '243', ad: 'İŞTİRAKLERE SERMAYE TAAHHÜTLERİ (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '244', ad: 'İŞTİRAKLER SERMAYE PAYLARI DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '245', ad: 'BAĞLI ORTAKLIKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '246', ad: 'BAĞLI ORTAKLIKLARA SERMAYE TAAHHÜTLERİ (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '247', ad: 'BAĞLI ORTAKLIKLAR SERMAYE PAYLARI DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '248', ad: 'DİĞER MALİ DURAN VARLIKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '249', ad: 'DİĞER MALİ DURAN VARLIKLAR KARŞILIĞI (-)', sinif: '2', tur: 'AKTİF' },

  // 25. Maddi Duran Varlıklar
  { kod: '250', ad: 'ARAZİ VE ARSALAR', sinif: '2', tur: 'AKTİF' },
  { kod: '251', ad: 'YERALTI VE YERÜSTÜ DÜZENLERİ', sinif: '2', tur: 'AKTİF' },
  { kod: '252', ad: 'BİNALAR', sinif: '2', tur: 'AKTİF' },
  { kod: '253', ad: 'TESİS, MAKİNE VE CİHAZLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '254', ad: 'TAŞITLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '255', ad: 'DEMİRBAŞLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '256', ad: 'DİĞER MADDİ DURAN VARLIKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '257', ad: 'BİRİKMİŞ AMORTİSMANLAR (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '258', ad: 'YAPILMAKTA OLAN YATIRIMLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '259', ad: 'VERİLEN AVANSLAR', sinif: '2', tur: 'AKTİF' },

  // 26. Maddi Olmayan Duran Varlıklar
  { kod: '260', ad: 'HAKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '261', ad: 'ŞEREFİYE', sinif: '2', tur: 'AKTİF' },
  { kod: '262', ad: 'KURULUŞ VE ÖRGÜTLENME GİDERLERİ', sinif: '2', tur: 'AKTİF' },
  { kod: '263', ad: 'ARAŞTIRMA VE GELİŞTİRME GİDERLERİ', sinif: '2', tur: 'AKTİF' },
  { kod: '264', ad: 'ÖZEL MALİYETLER', sinif: '2', tur: 'AKTİF' },
  { kod: '267', ad: 'DİĞER MADDİ OLMAYAN DURAN VARLIKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '268', ad: 'BİRİKMİŞ AMORTİSMANLAR (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '269', ad: 'VERİLEN AVANSLAR', sinif: '2', tur: 'AKTİF' },

  // 27. Özel Tükenmeye Tabi Varlıklar
  { kod: '271', ad: 'ARAMA GİDERLERİ', sinif: '2', tur: 'AKTİF' },
  { kod: '272', ad: 'HAZIRLIK VE GELİŞTİRME GİDERLERİ', sinif: '2', tur: 'AKTİF' },
  { kod: '277', ad: 'DİĞER ÖZEL TÜKENMEYE TABİ VARLIKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '278', ad: 'BİRİKMİŞ TÜKENME PAYLARI (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '279', ad: 'VERİLEN AVANSLAR', sinif: '2', tur: 'AKTİF' },

  // 28. Gelecek Yıllara Ait Giderler ve Gelir Tahakkukları
  { kod: '280', ad: 'GELECEK YILLARA AİT GİDERLER', sinif: '2', tur: 'AKTİF' },
  { kod: '281', ad: 'GELİR TAHAKKUKLARI', sinif: '2', tur: 'AKTİF' },

  // 29. Diğer Duran Varlıklar
  { kod: '291', ad: 'GELECEK YILLARDA İNDİRİLECEK KDV', sinif: '2', tur: 'AKTİF' },
  { kod: '292', ad: 'DİĞER KDV', sinif: '2', tur: 'AKTİF' },
  { kod: '293', ad: 'GELECEK YILLAR İHTİYACI STOKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '294', ad: 'ELDEN ÇIKARILACAK STOKLAR VE MADDİ DURAN VARLIKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '295', ad: 'PEŞİN ÖDENEN VERGİLER VE FONLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '297', ad: 'DİĞER ÇEŞİTLİ DURAN VARLIKLAR', sinif: '2', tur: 'AKTİF' },
  { kod: '298', ad: 'STOK DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI (-)', sinif: '2', tur: 'AKTİF' },
  { kod: '299', ad: 'BİRİKMİŞ AMORTİSMANLAR (-)', sinif: '2', tur: 'AKTİF' },

  // ───────────── SINIF 3 — KISA VADELİ YABANCI KAYNAKLAR ─────────────
  // 30. Mali Borçlar
  { kod: '300', ad: 'BANKA KREDİLERİ', sinif: '3', tur: 'PASİF' },
  { kod: '301', ad: 'FİNANSAL KİRALAMA İŞLEMLERİNDEN BORÇLAR', sinif: '3', tur: 'PASİF' },
  { kod: '302', ad: 'ERTELENMİŞ FİNANSAL KİRALAMA BORÇLANMA MALİYETLERİ (-)', sinif: '3', tur: 'PASİF' },
  { kod: '303', ad: 'UZUN VADELİ KREDİLERİN ANAPARA TAKSİTLERİ VE FAİZLERİ', sinif: '3', tur: 'PASİF' },
  { kod: '304', ad: 'TAHVİL ANAPARA BORÇ, TAKSİT VE FAİZLERİ', sinif: '3', tur: 'PASİF' },
  { kod: '305', ad: 'ÇIKARILMIŞ BONOLAR VE SENETLER', sinif: '3', tur: 'PASİF' },
  { kod: '306', ad: 'ÇIKARILMIŞ DİĞER MENKUL KIYMETLER', sinif: '3', tur: 'PASİF' },
  { kod: '308', ad: 'MENKUL KIYMETLER İHRAÇ FARKI (-)', sinif: '3', tur: 'PASİF' },
  { kod: '309', ad: 'DİĞER MALİ BORÇLAR', sinif: '3', tur: 'PASİF' },

  // 32. Ticari Borçlar
  { kod: '320', ad: 'SATICILAR', sinif: '3', tur: 'PASİF' },
  { kod: '321', ad: 'BORÇ SENETLERİ', sinif: '3', tur: 'PASİF' },
  { kod: '322', ad: 'BORÇ SENETLERİ REESKONTU (-)', sinif: '3', tur: 'PASİF' },
  { kod: '326', ad: 'ALINAN DEPOZİTO VE TEMİNATLAR', sinif: '3', tur: 'PASİF' },
  { kod: '329', ad: 'DİĞER TİCARİ BORÇLAR', sinif: '3', tur: 'PASİF' },

  // 33. Diğer Borçlar
  { kod: '331', ad: 'ORTAKLARA BORÇLAR', sinif: '3', tur: 'PASİF' },
  { kod: '332', ad: 'İŞTİRAKLERE BORÇLAR', sinif: '3', tur: 'PASİF' },
  { kod: '333', ad: 'BAĞLI ORTAKLIKLARA BORÇLAR', sinif: '3', tur: 'PASİF' },
  { kod: '335', ad: 'PERSONELE BORÇLAR', sinif: '3', tur: 'PASİF' },
  { kod: '336', ad: 'DİĞER ÇEŞİTLİ BORÇLAR', sinif: '3', tur: 'PASİF' },
  { kod: '337', ad: 'DİĞER BORÇ SENETLERİ REESKONTU (-)', sinif: '3', tur: 'PASİF' },

  // 34. Alınan Avanslar
  { kod: '340', ad: 'ALINAN SİPARİŞ AVANSLARI', sinif: '3', tur: 'PASİF' },
  { kod: '349', ad: 'ALINAN DİĞER AVANSLAR', sinif: '3', tur: 'PASİF' },

  // 35. Yıllara Yaygın İnşaat ve Onarım Hakediş Bedelleri
  { kod: '350', ad: 'YILLARA YAYGIN İNŞAAT VE ONARIM HAKEDİŞ BEDELLERİ', sinif: '3', tur: 'PASİF' },
  { kod: '358', ad: 'YILLARA YAYGIN İNŞAAT ENFLASYON DÜZELTME HESABI', sinif: '3', tur: 'PASİF' },

  // 36. Ödenecek Vergi ve Diğer Yükümlülükler
  { kod: '360', ad: 'ÖDENECEK VERGİ VE FONLAR', sinif: '3', tur: 'PASİF' },
  { kod: '361', ad: 'ÖDENECEK SOSYAL GÜVENLİK KESİNTİLERİ', sinif: '3', tur: 'PASİF' },
  { kod: '368', ad: 'VADESİ GEÇMİŞ, ERTELENMİŞ VEYA TAKSİTLENDİRİLMİŞ VERGİ VE DİĞER YÜKÜMLÜLÜKLER', sinif: '3', tur: 'PASİF' },
  { kod: '369', ad: 'ÖDENECEK DİĞER YÜKÜMLÜLÜKLER', sinif: '3', tur: 'PASİF' },

  // 37. Borç ve Gider Karşılıkları
  { kod: '370', ad: 'DÖNEM KARI VERGİ VE DİĞER YASAL YÜKÜMLÜLÜK KARŞILIKLARI', sinif: '3', tur: 'PASİF' },
  { kod: '371', ad: 'DÖNEM KARININ PEŞİN ÖDENEN VERGİ VE DİĞER YÜKÜMLÜLÜKLERİ (-)', sinif: '3', tur: 'PASİF' },
  { kod: '372', ad: 'KIDEM TAZMİNATI KARŞILIĞI', sinif: '3', tur: 'PASİF' },
  { kod: '373', ad: 'MALİYET GİDERLERİ KARŞILIĞI', sinif: '3', tur: 'PASİF' },
  { kod: '379', ad: 'DİĞER BORÇ VE GİDER KARŞILIKLARI', sinif: '3', tur: 'PASİF' },

  // 38. Gelecek Aylara Ait Gelirler ve Gider Tahakkukları
  { kod: '380', ad: 'GELECEK AYLARA AİT GELİRLER', sinif: '3', tur: 'PASİF' },
  { kod: '381', ad: 'GİDER TAHAKKUKLARI', sinif: '3', tur: 'PASİF' },

  // 39. Diğer Kısa Vadeli Yabancı Kaynaklar
  { kod: '391', ad: 'HESAPLANAN KDV', sinif: '3', tur: 'PASİF' },
  { kod: '392', ad: 'DİĞER KDV', sinif: '3', tur: 'PASİF' },
  { kod: '393', ad: 'MERKEZ VE ŞUBELER CARİ HESABI', sinif: '3', tur: 'PASİF' },
  { kod: '397', ad: 'SAYIM VE TESELLÜM FAZLALARI', sinif: '3', tur: 'PASİF' },
  { kod: '399', ad: 'DİĞER ÇEŞİTLİ YABANCI KAYNAKLAR', sinif: '3', tur: 'PASİF' },

  // ───────────── SINIF 4 — UZUN VADELİ YABANCI KAYNAKLAR ─────────────
  // 40. Mali Borçlar
  { kod: '400', ad: 'BANKA KREDİLERİ', sinif: '4', tur: 'PASİF' },
  { kod: '401', ad: 'FİNANSAL KİRALAMA İŞLEMLERİNDEN BORÇLAR', sinif: '4', tur: 'PASİF' },
  { kod: '402', ad: 'ERTELENMİŞ FİNANSAL KİRALAMA BORÇLANMA MALİYETLERİ (-)', sinif: '4', tur: 'PASİF' },
  { kod: '405', ad: 'ÇIKARILMIŞ TAHVİLLER', sinif: '4', tur: 'PASİF' },
  { kod: '407', ad: 'ÇIKARILMIŞ DİĞER MENKUL KIYMETLER', sinif: '4', tur: 'PASİF' },
  { kod: '408', ad: 'MENKUL KIYMETLER İHRAÇ FARKI (-)', sinif: '4', tur: 'PASİF' },
  { kod: '409', ad: 'DİĞER MALİ BORÇLAR', sinif: '4', tur: 'PASİF' },

  // 42. Ticari Borçlar
  { kod: '420', ad: 'SATICILAR', sinif: '4', tur: 'PASİF' },
  { kod: '421', ad: 'BORÇ SENETLERİ', sinif: '4', tur: 'PASİF' },
  { kod: '422', ad: 'BORÇ SENETLERİ REESKONTU (-)', sinif: '4', tur: 'PASİF' },
  { kod: '426', ad: 'ALINAN DEPOZİTO VE TEMİNATLAR', sinif: '4', tur: 'PASİF' },
  { kod: '429', ad: 'DİĞER TİCARİ BORÇLAR', sinif: '4', tur: 'PASİF' },

  // 43. Diğer Borçlar
  { kod: '431', ad: 'ORTAKLARA BORÇLAR', sinif: '4', tur: 'PASİF' },
  { kod: '432', ad: 'İŞTİRAKLERE BORÇLAR', sinif: '4', tur: 'PASİF' },
  { kod: '433', ad: 'BAĞLI ORTAKLIKLARA BORÇLAR', sinif: '4', tur: 'PASİF' },
  { kod: '436', ad: 'DİĞER ÇEŞİTLİ BORÇLAR', sinif: '4', tur: 'PASİF' },
  { kod: '437', ad: 'DİĞER BORÇ SENETLERİ REESKONTU (-)', sinif: '4', tur: 'PASİF' },
  { kod: '438', ad: 'KAMUYA OLAN ERTELENMİŞ VEYA TAKSİTLENDİRİLMİŞ BORÇLAR', sinif: '4', tur: 'PASİF' },

  // 44. Alınan Avanslar
  { kod: '440', ad: 'ALINAN SİPARİŞ AVANSLARI', sinif: '4', tur: 'PASİF' },
  { kod: '449', ad: 'ALINAN DİĞER AVANSLAR', sinif: '4', tur: 'PASİF' },

  // 47. Borç ve Gider Karşılıkları
  { kod: '472', ad: 'KIDEM TAZMİNATI KARŞILIĞI', sinif: '4', tur: 'PASİF' },
  { kod: '479', ad: 'DİĞER BORÇ VE GİDER KARŞILIKLARI', sinif: '4', tur: 'PASİF' },

  // 48. Gelecek Yıllara Ait Gelirler ve Gider Tahakkukları
  { kod: '480', ad: 'GELECEK YILLARA AİT GELİRLER', sinif: '4', tur: 'PASİF' },
  { kod: '481', ad: 'GİDER TAHAKKUKLARI', sinif: '4', tur: 'PASİF' },

  // 49. Diğer Uzun Vadeli Yabancı Kaynaklar
  { kod: '492', ad: 'GELECEK YILLARA ERTELENEN VEYA TERKİN EDİLECEK KDV', sinif: '4', tur: 'PASİF' },
  { kod: '493', ad: 'TESİSE KATILMA PAYLARI', sinif: '4', tur: 'PASİF' },
  { kod: '499', ad: 'DİĞER UZUN VADELİ YABANCI KAYNAKLAR', sinif: '4', tur: 'PASİF' },

  // ───────────── SINIF 5 — ÖZ KAYNAKLAR ─────────────
  // 50. Ödenmiş Sermaye
  { kod: '500', ad: 'SERMAYE', sinif: '5', tur: 'PASİF' },
  { kod: '501', ad: 'ÖDENMEMİŞ SERMAYE (-)', sinif: '5', tur: 'PASİF' },
  { kod: '502', ad: 'SERMAYE DÜZELTMESİ OLUMLU FARKLARI', sinif: '5', tur: 'PASİF' },
  { kod: '503', ad: 'SERMAYE DÜZELTMESİ OLUMSUZ FARKLARI (-)', sinif: '5', tur: 'PASİF' },

  // 52. Sermaye Yedekleri
  { kod: '520', ad: 'HİSSE SENEDİ İHRAÇ PRİMLERİ', sinif: '5', tur: 'PASİF' },
  { kod: '521', ad: 'HİSSE SENEDİ İPTAL KARLARI', sinif: '5', tur: 'PASİF' },
  { kod: '522', ad: 'MDV YENİDEN DEĞERLEME ARTIŞLARI', sinif: '5', tur: 'PASİF' },
  { kod: '523', ad: 'İŞTİRAKLER YENİDEN DEĞERLEME ARTIŞLARI', sinif: '5', tur: 'PASİF' },
  { kod: '524', ad: 'MALİYET ARTIŞLARI FONU', sinif: '5', tur: 'PASİF' },
  { kod: '529', ad: 'DİĞER SERMAYE YEDEKLERİ', sinif: '5', tur: 'PASİF' },

  // 54. Kar Yedekleri
  { kod: '540', ad: 'YASAL YEDEKLER', sinif: '5', tur: 'PASİF' },
  { kod: '541', ad: 'STATÜ YEDEKLERİ', sinif: '5', tur: 'PASİF' },
  { kod: '542', ad: 'OLAĞANÜSTÜ YEDEKLER', sinif: '5', tur: 'PASİF' },
  { kod: '548', ad: 'DİĞER KAR YEDEKLERİ', sinif: '5', tur: 'PASİF' },
  { kod: '549', ad: 'ÖZEL FONLAR', sinif: '5', tur: 'PASİF' },

  // 57. Geçmiş Yıllar Karları
  { kod: '570', ad: 'GEÇMİŞ YILLAR KARLARI', sinif: '5', tur: 'PASİF' },

  // 58. Geçmiş Yıllar Zararları
  { kod: '580', ad: 'GEÇMİŞ YILLAR ZARARLARI (-)', sinif: '5', tur: 'PASİF' },

  // 59. Dönem Net Karı (Zararı)
  { kod: '590', ad: 'DÖNEM NET KARI', sinif: '5', tur: 'PASİF' },
  { kod: '591', ad: 'DÖNEM NET ZARARI (-)', sinif: '5', tur: 'PASİF' },

  // ───────────── SINIF 6 — GELİR TABLOSU HESAPLARI ─────────────
  // 60. Brüt Satışlar
  { kod: '600', ad: 'YURT İÇİ SATIŞLAR', sinif: '6', tur: 'GELİR' },
  { kod: '601', ad: 'YURT DIŞI SATIŞLAR', sinif: '6', tur: 'GELİR' },
  { kod: '602', ad: 'DİĞER GELİRLER', sinif: '6', tur: 'GELİR' },

  // 61. Satış İndirimleri (-)
  { kod: '610', ad: 'SATIŞTAN İADELER (-)', sinif: '6', tur: 'GİDER' },
  { kod: '611', ad: 'SATIŞ İSKONTOLARI (-)', sinif: '6', tur: 'GİDER' },
  { kod: '612', ad: 'DİĞER İNDİRİMLER (-)', sinif: '6', tur: 'GİDER' },

  // 62. Satışların Maliyeti (-)
  { kod: '620', ad: 'SATILAN MAMULLER MALİYETİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '621', ad: 'SATILAN TİCARİ MALLAR MALİYETİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '622', ad: 'SATILAN HİZMET MALİYETİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '623', ad: 'DİĞER SATIŞLARIN MALİYETİ (-)', sinif: '6', tur: 'GİDER' },

  // 63. Faaliyet Giderleri (-)
  { kod: '630', ad: 'ARAŞTIRMA VE GELİŞTİRME GİDERLERİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '631', ad: 'PAZARLAMA SATIŞ VE DAĞITIM GİDERLERİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '632', ad: 'GENEL YÖNETİM GİDERLERİ (-)', sinif: '6', tur: 'GİDER' },

  // 64. Diğer Faaliyetlerden Olağan Gelir ve Karlar
  { kod: '640', ad: 'İŞTİRAKLERDEN TEMETTÜ GELİRLERİ', sinif: '6', tur: 'GELİR' },
  { kod: '641', ad: 'BAĞLI ORTAKLIKLARDAN TEMETTÜ GELİRLERİ', sinif: '6', tur: 'GELİR' },
  { kod: '642', ad: 'FAİZ GELİRLERİ', sinif: '6', tur: 'GELİR' },
  { kod: '643', ad: 'KOMİSYON GELİRLERİ', sinif: '6', tur: 'GELİR' },
  { kod: '644', ad: 'KONUSU KALMAYAN KARŞILIKLAR', sinif: '6', tur: 'GELİR' },
  { kod: '645', ad: 'MENKUL KIYMET SATIŞ KARLARI', sinif: '6', tur: 'GELİR' },
  { kod: '646', ad: 'KAMBİYO KARLARI', sinif: '6', tur: 'GELİR' },
  { kod: '647', ad: 'REESKONT FAİZ GELİRLERİ', sinif: '6', tur: 'GELİR' },
  { kod: '648', ad: 'ENFLASYON DÜZELTMESİ KARLARI', sinif: '6', tur: 'GELİR' },
  { kod: '649', ad: 'DİĞER OLAĞAN GELİR VE KARLAR', sinif: '6', tur: 'GELİR' },

  // 65. Diğer Faaliyetlerden Olağan Gider ve Zararlar (-)
  { kod: '653', ad: 'KOMİSYON GİDERLERİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '654', ad: 'KARŞILIK GİDERLERİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '655', ad: 'MENKUL KIYMET SATIŞ ZARARLARI (-)', sinif: '6', tur: 'GİDER' },
  { kod: '656', ad: 'KAMBİYO ZARARLARI (-)', sinif: '6', tur: 'GİDER' },
  { kod: '657', ad: 'REESKONT FAİZ GİDERLERİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '658', ad: 'ENFLASYON DÜZELTMESİ ZARARLARI (-)', sinif: '6', tur: 'GİDER' },
  { kod: '659', ad: 'DİĞER OLAĞAN GİDER VE ZARARLAR (-)', sinif: '6', tur: 'GİDER' },

  // 66. Finansman Giderleri (-)
  { kod: '660', ad: 'KISA VADELİ BORÇLANMA GİDERLERİ (-)', sinif: '6', tur: 'GİDER' },
  { kod: '661', ad: 'UZUN VADELİ BORÇLANMA GİDERLERİ (-)', sinif: '6', tur: 'GİDER' },

  // 67. Olağandışı Gelir ve Karlar
  { kod: '671', ad: 'ÖNCEKİ DÖNEM GELİR VE KARLARI', sinif: '6', tur: 'GELİR' },
  { kod: '679', ad: 'DİĞER OLAĞANDIŞI GELİR VE KARLAR', sinif: '6', tur: 'GELİR' },

  // 68. Olağandışı Gider ve Zararlar (-)
  { kod: '680', ad: 'ÇALIŞMAYAN KISIM GİDER VE ZARARLARI (-)', sinif: '6', tur: 'GİDER' },
  { kod: '681', ad: 'ÖNCEKİ DÖNEM GİDER VE ZARARLARI (-)', sinif: '6', tur: 'GİDER' },
  { kod: '689', ad: 'DİĞER OLAĞANDIŞI GİDER VE ZARARLAR (-)', sinif: '6', tur: 'GİDER' },

  // 69. Dönem Net Karı (Zararı) — Kapanış Hesapları
  { kod: '690', ad: 'DÖNEM KARI VEYA ZARARI', sinif: '6', tur: 'KAPANIŞ' },
  { kod: '691', ad: 'DÖNEM KARI VERGİ VE DİĞER YASAL YÜKÜMLÜLÜK KARŞILIKLARI (-)', sinif: '6', tur: 'KAPANIŞ' },
  { kod: '692', ad: 'DÖNEM NET KARI VEYA ZARARI', sinif: '6', tur: 'KAPANIŞ' },
  { kod: '697', ad: 'YILLARA YAYGIN İNŞAAT ENFLASYON DÜZELTME HESABI', sinif: '6', tur: 'KAPANIŞ' },
  { kod: '698', ad: 'ENFLASYON DÜZELTME HESABI', sinif: '6', tur: 'KAPANIŞ' },

  // ───────────── SINIF 7 — MALİYET HESAPLARI ─────────────
  // 7/A — Fonksiyon Esaslı

  // 70. Maliyet Muhasebesi Bağlantı Hesapları
  { kod: '700', ad: 'MALİYET MUHASEBESİ BAĞLANTI HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '701', ad: 'MALİYET MUHASEBESİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },

  // 71. Direkt İlk Madde ve Malzeme Giderleri
  { kod: '710', ad: 'DİREKT İLK MADDE VE MALZEME GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '711', ad: 'DİREKT İLK MADDE VE MALZEME YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '712', ad: 'DİREKT İLK MADDE VE MALZEME FİYAT FARKI', sinif: '7', tur: 'MALİYET' },
  { kod: '713', ad: 'DİREKT İLK MADDE VE MALZEME MİKTAR FARKI', sinif: '7', tur: 'MALİYET' },

  // 72. Direkt İşçilik Giderleri
  { kod: '720', ad: 'DİREKT İŞÇİLİK GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '721', ad: 'DİREKT İŞÇİLİK GİDERLERİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '722', ad: 'DİREKT İŞÇİLİK ÜCRET FARKLARI', sinif: '7', tur: 'MALİYET' },
  { kod: '723', ad: 'DİREKT İŞÇİLİK SÜRE (ZAMAN) FARKLARI', sinif: '7', tur: 'MALİYET' },

  // 73. Genel Üretim Giderleri
  { kod: '730', ad: 'GENEL ÜRETİM GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '731', ad: 'GENEL ÜRETİM GİDERLERİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '732', ad: 'GENEL ÜRETİM GİDERLERİ BÜTÇE FARKLARI', sinif: '7', tur: 'MALİYET' },
  { kod: '733', ad: 'GENEL ÜRETİM GİDERLERİ VERİMLİLİK FARKLARI', sinif: '7', tur: 'MALİYET' },
  { kod: '734', ad: 'GENEL ÜRETİM GİDERLERİ KAPASİTE FARKLARI', sinif: '7', tur: 'MALİYET' },

  // 74. Hizmet Üretim Maliyeti
  { kod: '740', ad: 'HİZMET ÜRETİM MALİYETİ', sinif: '7', tur: 'MALİYET' },
  { kod: '741', ad: 'HİZMET ÜRETİM MALİYETİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '742', ad: 'HİZMET ÜRETİM MALİYETİ FARK HESABI', sinif: '7', tur: 'MALİYET' },

  // 75. Araştırma ve Geliştirme Giderleri
  { kod: '750', ad: 'ARAŞTIRMA VE GELİŞTİRME GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '751', ad: 'ARAŞTIRMA VE GELİŞTİRME GİDERLERİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '752', ad: 'ARAŞTIRMA VE GELİŞTİRME GİDERLERİ FARK HESABI', sinif: '7', tur: 'MALİYET' },

  // 76. Pazarlama, Satış ve Dağıtım Giderleri
  { kod: '760', ad: 'PAZARLAMA SATIŞ VE DAĞITIM GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '761', ad: 'PAZARLAMA SATIŞ VE DAĞITIM GİDERLERİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '762', ad: 'PAZARLAMA SATIŞ VE DAĞITIM GİDERLERİ FARK HESABI', sinif: '7', tur: 'MALİYET' },

  // 77. Genel Yönetim Giderleri
  { kod: '770', ad: 'GENEL YÖNETİM GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '771', ad: 'GENEL YÖNETİM GİDERLERİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '772', ad: 'GENEL YÖNETİM GİDERLERİ FARK HESABI', sinif: '7', tur: 'MALİYET' },

  // 78. Finansman Giderleri
  { kod: '780', ad: 'FİNANSMAN GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '781', ad: 'FİNANSMAN GİDERLERİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '782', ad: 'FİNANSMAN GİDERLERİ FARK HESABI', sinif: '7', tur: 'MALİYET' },

  // 7/B — Çeşit Esaslı (79. Gider Çeşitleri Hesapları)
  { kod: '790', ad: 'İLK MADDE VE MALZEME GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '791', ad: 'İŞÇİ ÜCRET VE GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '792', ad: 'MEMUR ÜCRET VE GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '793', ad: 'DIŞARDAN SAĞLANAN FAYDA VE HİZMETLER', sinif: '7', tur: 'MALİYET' },
  { kod: '794', ad: 'ÇEŞİTLİ GİDERLER', sinif: '7', tur: 'MALİYET' },
  { kod: '795', ad: 'VERGİ, RESİM VE HARÇLAR', sinif: '7', tur: 'MALİYET' },
  { kod: '796', ad: 'AMORTİSMANLAR VE TÜKENME PAYLARI', sinif: '7', tur: 'MALİYET' },
  { kod: '797', ad: 'FİNANSMAN GİDERLERİ', sinif: '7', tur: 'MALİYET' },
  { kod: '798', ad: 'GİDER ÇEŞİTLERİ YANSITMA HESABI', sinif: '7', tur: 'MALİYET' },
  { kod: '799', ad: 'ÜRETİM MALİYET HESABI', sinif: '7', tur: 'MALİYET' },
];
