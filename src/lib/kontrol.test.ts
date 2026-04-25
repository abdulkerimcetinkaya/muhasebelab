import { describe, it, expect } from 'vitest';
import { satirlariKontrolEt, yanlisAnaliziYap } from './kontrol';
import type { CozumSatir, UserRow } from '../types';

describe('satirlariKontrolEt', () => {
  it('tek satır doğru eşleşince true döner', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.satirSonuclari).toEqual([true]);
    expect(sonuc.hepsiDogru).toBe(true);
  });

  it('kod yanlışsa satır yanlış olur', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '102', borc: 1000, alacak: 0 }];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.satirSonuclari).toEqual([false]);
    expect(sonuc.hepsiDogru).toBe(false);
  });

  it('tutar yanlışsa satır yanlış olur', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: 999, alacak: 0 }];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.satirSonuclari).toEqual([false]);
    expect(sonuc.hepsiDogru).toBe(false);
  });

  it('string girilen tutarları sayıya çevirip eşler', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: '1000', alacak: '' }];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.hepsiDogru).toBe(true);
  });

  it('float tutarları 0.01 toleransla eşler', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1234.56, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: 1234.56, alacak: 0 }];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.hepsiDogru).toBe(true);
  });

  it('sıra bağımsız olarak çoklu satırları eşler', () => {
    const cozum: CozumSatir[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1000 },
    ];
    const user: UserRow[] = [
      { kod: '600', borc: 0, alacak: 1000 },
      { kod: '100', borc: 1000, alacak: 0 },
    ];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.satirSonuclari).toEqual([true, true]);
    expect(sonuc.hepsiDogru).toBe(true);
  });

  it('aynı kodun iki farklı tutar satırını ayrı ayrı eşler', () => {
    const cozum: CozumSatir[] = [
      { kod: '100', borc: 500, alacak: 0 },
      { kod: '100', borc: 300, alacak: 0 },
    ];
    const user: UserRow[] = [
      { kod: '100', borc: 300, alacak: 0 },
      { kod: '100', borc: 500, alacak: 0 },
    ];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.hepsiDogru).toBe(true);
  });

  it('aynı satırı iki kez eşleştirmez (kullanılan set)', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '100', borc: 1000, alacak: 0 },
    ];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.satirSonuclari).toEqual([true, false]);
    expect(sonuc.hepsiDogru).toBe(false);
  });

  it('eksik satır hepsiDogru=false yapar', () => {
    const cozum: CozumSatir[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1000 },
    ];
    const user: UserRow[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const sonuc = satirlariKontrolEt(user, cozum);
    expect(sonuc.satirSonuclari).toEqual([true]);
    expect(sonuc.hepsiDogru).toBe(false);
  });

  it('boş user ve boş çözüm hepsiDogru=true (edge)', () => {
    const sonuc = satirlariKontrolEt([], []);
    expect(sonuc.hepsiDogru).toBe(true);
    expect(sonuc.satirSonuclari).toEqual([]);
  });
});

describe('yanlisAnaliziYap', () => {
  it('tam doğru cevapta her satır "dogru" tipinde olur', () => {
    const cozum: CozumSatir[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1000 },
    ];
    const user: UserRow[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1000 },
    ];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri.map((s) => s.tip)).toEqual(['dogru', 'dogru']);
    expect(a.eksikHesaplar).toEqual([]);
    expect(a.dengeFarki).toBe(0);
    expect(a.ozet).toEqual([]);
  });

  it('borç/alacak tarafı ters yazılırsa "taraf_ters" tespit edilir', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: 0, alacak: 1000 }];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('taraf_ters');
    expect(a.satirAnalizleri[0].beklenenBorc).toBe(1000);
    expect(a.ozet.some((o) => o.includes('yanlış tarafta'))).toBe(true);
  });

  it('hesap doğru ama tutar yanlışsa "tutar_yanlis" döner ve fark hesaplanır', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: 800, alacak: 0 }];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('tutar_yanlis');
    expect(a.satirAnalizleri[0].beklenenBorc).toBe(1000);
    expect(a.satirAnalizleri[0].mesaj).toContain('eksik');
    expect(a.ozet.some((o) => o.includes('tutar hatalı'))).toBe(true);
  });

  it('tutar fazla yazılınca mesaj "fazla" diye uyarır', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: 1500, alacak: 0 }];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('tutar_yanlis');
    expect(a.satirAnalizleri[0].mesaj).toContain('fazla');
  });

  it('hesap planında olmayan kod "kod_gecersiz" olarak işaretlenir', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '999', borc: 1000, alacak: 0 }];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('kod_gecersiz');
    expect(a.eksikHesaplar).toHaveLength(1);
    expect(a.eksikHesaplar[0].kod).toBe('100');
  });

  it('cevapta olmayan ama plana ait hesap "fazla" olur', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '102', borc: 500, alacak: 0 },
    ];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('dogru');
    expect(a.satirAnalizleri[1].tip).toBe('fazla');
    expect(a.ozet.some((o) => o.includes('kayda ait olmayan'))).toBe(true);
  });

  it('eksik satır "eksikHesaplar" listesine düşer', () => {
    const cozum: CozumSatir[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1000 },
    ];
    const user: UserRow[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.eksikHesaplar).toHaveLength(1);
    expect(a.eksikHesaplar[0].kod).toBe('600');
    expect(a.ozet.some((o) => o.includes('eksik'))).toBe(true);
  });

  it('kod boş bırakılırsa "kod_bos" döner', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '', borc: 1000, alacak: 0 }];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('kod_bos');
  });

  it('tutar boş ama kod doluysa "tutar_bos" döner', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: 0, alacak: 0 }];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('tutar_bos');
  });

  it('tamamen boş satır analiz dışı tutulur', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '', borc: 0, alacak: 0 },
    ];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri).toHaveLength(1);
    expect(a.satirAnalizleri[0].tip).toBe('dogru');
  });

  it('borç toplamı alacak toplamından fazlaysa pozitif denge farkı + özet uyarısı', () => {
    const cozum: CozumSatir[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1000 },
    ];
    const user: UserRow[] = [
      { kod: '100', borc: 1500, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1000 },
    ];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.toplamBorc).toBe(1500);
    expect(a.toplamAlacak).toBe(1000);
    expect(a.dengeFarki).toBe(500);
    expect(a.ozet[0]).toContain('Borç toplamı');
  });

  it('alacak fazla olursa negatif denge farkı + alacak fazla mesajı', () => {
    const cozum: CozumSatir[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1000 },
    ];
    const user: UserRow[] = [
      { kod: '100', borc: 1000, alacak: 0 },
      { kod: '600', borc: 0, alacak: 1500 },
    ];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.dengeFarki).toBe(-500);
    expect(a.ozet[0]).toContain('Alacak toplamı');
  });

  it('aynı kodun iki satırından sadece biri eşleşirse diğeri tutar_yanlis olur', () => {
    const cozum: CozumSatir[] = [
      { kod: '100', borc: 500, alacak: 0 },
      { kod: '100', borc: 300, alacak: 0 },
    ];
    const user: UserRow[] = [
      { kod: '100', borc: 500, alacak: 0 },
      { kod: '100', borc: 999, alacak: 0 },
    ];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('dogru');
    expect(a.satirAnalizleri[1].tip).toBe('tutar_yanlis');
    expect(a.satirAnalizleri[1].beklenenBorc).toBe(300);
    expect(a.eksikHesaplar).toHaveLength(0);
  });

  it('string tutarları sayıya çevirip toplamları doğru hesaplar', () => {
    const cozum: CozumSatir[] = [{ kod: '100', borc: 1000, alacak: 0 }];
    const user: UserRow[] = [{ kod: '100', borc: '1000', alacak: '' }];
    const a = yanlisAnaliziYap(user, cozum);
    expect(a.satirAnalizleri[0].tip).toBe('dogru');
    expect(a.toplamBorc).toBe(1000);
    expect(a.toplamAlacak).toBe(0);
  });
});
