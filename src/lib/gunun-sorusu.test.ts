import { describe, it, expect } from 'vitest';
import { gununSorusu } from './gunun-sorusu';
import type { Ilerleme, SoruWithUnite } from '../types';

const soru = (
  id: string,
  ekstra?: Partial<Pick<SoruWithUnite, 'konuId' | 'altBaslikId'>>,
): SoruWithUnite => ({
  id,
  baslik: id,
  zorluk: 'kolay',
  senaryo: '',
  ipucu: '',
  aciklama: '',
  cozum: [],
  uniteId: 'u1',
  uniteAd: 'U1',
  uniteIcon: 'i',
  ...ekstra,
});

const bosIlerleme = (
  ekstra?: Partial<Pick<Ilerleme, 'cozulenler' | 'yanlislar'>>,
): Ilerleme => ({
  kullaniciAdi: 'test',
  ad: null,
  soyad: null,
  cozulenler: {},
  yanlislar: {},
  puan: 0,
  streak: 0,
  sonCozumTarihi: null,
  aktiviteTarihleri: {},
  kazanilanRozetler: {},
  tema: 'light',
  ...ekstra,
});

describe('gununSorusu', () => {
  it('boş listede null döner', () => {
    expect(gununSorusu([])).toBeNull();
  });

  it('tek soru varsa onu döner', () => {
    const s = soru('only');
    expect(gununSorusu([s])).toEqual(s);
  });

  it('aynı gün aynı soruyu döndürür (deterministik)', () => {
    const liste = [soru('a'), soru('b'), soru('c'), soru('d'), soru('e')];
    const ilk = gununSorusu(liste);
    const ikinci = gununSorusu(liste);
    expect(ilk).toEqual(ikinci);
  });

  it('listedeki bir soruyu döner', () => {
    const liste = [soru('a'), soru('b'), soru('c')];
    const sonuc = gununSorusu(liste);
    expect(liste).toContainEqual(sonuc);
  });

  it('ilerleme verildiğinde çözülmüş soruyu vermez', () => {
    const liste = [soru('a'), soru('b'), soru('c')];
    const ilerleme = bosIlerleme({
      cozulenler: {
        a: { tarih: '2026-05-16', zorluk: 'kolay', puan: 5 },
        b: { tarih: '2026-05-16', zorluk: 'kolay', puan: 5 },
      },
    });
    const sonuc = gununSorusu(liste, ilerleme);
    expect(sonuc?.id).toBe('c');
  });

  it('yanlış yapılan soru varsa o konudan çözülmemiş bir soru döner', () => {
    const liste = [
      soru('a', { konuId: 'k1' }),
      soru('b', { konuId: 'k2' }),
      soru('c', { konuId: 'k1' }),
      soru('d', { konuId: 'k1' }),
    ];
    const ilerleme = bosIlerleme({
      yanlislar: { a: 3 },
    });
    const sonuc = gununSorusu(liste, ilerleme);
    // a yanlış yapıldı (konu k1) → k1'den çözülmemiş c veya d gelmeli (a değil)
    expect(['c', 'd']).toContain(sonuc?.id);
  });

  it('tüm sorular çözülmüşse revizyon olarak herhangi birini döner', () => {
    const liste = [soru('a'), soru('b')];
    const ilerleme = bosIlerleme({
      cozulenler: {
        a: { tarih: '2026-05-16', zorluk: 'kolay', puan: 5 },
        b: { tarih: '2026-05-16', zorluk: 'kolay', puan: 5 },
      },
    });
    const sonuc = gununSorusu(liste, ilerleme);
    expect(['a', 'b']).toContain(sonuc?.id);
  });
});
