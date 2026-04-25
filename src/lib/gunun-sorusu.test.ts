import { describe, it, expect } from 'vitest';
import { gununSorusu } from './gunun-sorusu';
import type { SoruWithUnite } from '../types';

const soru = (id: string): SoruWithUnite => ({
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
});
