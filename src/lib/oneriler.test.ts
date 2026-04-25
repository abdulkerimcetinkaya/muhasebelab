import { describe, it, expect } from 'vitest';
import { devamEtSorusu, enCokYanlisSoru } from './oneriler';
import { varsayilanIlerleme } from './ilerleme';
import type { Ilerleme, SoruWithUnite } from '../types';

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

describe('devamEtSorusu', () => {
  const sorular = [soru('a'), soru('b'), soru('c')];

  it('hiç çözülmemişse ilk soruyu döner', () => {
    const s = devamEtSorusu(varsayilanIlerleme(), sorular);
    expect(s?.id).toBe('a');
  });

  it('ilk soru çözülmüşse sonrakini döner', () => {
    const i: Ilerleme = {
      ...varsayilanIlerleme(),
      cozulenler: { a: { tarih: '2026-01-01', zorluk: 'kolay' } },
    };
    const s = devamEtSorusu(i, sorular);
    expect(s?.id).toBe('b');
  });

  it('hepsi çözülmüşse null döner', () => {
    const i: Ilerleme = {
      ...varsayilanIlerleme(),
      cozulenler: {
        a: { tarih: '2026-01-01', zorluk: 'kolay' },
        b: { tarih: '2026-01-02', zorluk: 'kolay' },
        c: { tarih: '2026-01-03', zorluk: 'kolay' },
      },
    };
    expect(devamEtSorusu(i, sorular)).toBeNull();
  });

  it('soru listesi boşsa null döner', () => {
    expect(devamEtSorusu(varsayilanIlerleme(), [])).toBeNull();
  });
});

describe('enCokYanlisSoru', () => {
  const sorular = [soru('a'), soru('b'), soru('c')];

  it('yanlış kaydı yoksa null döner', () => {
    expect(enCokYanlisSoru(varsayilanIlerleme(), sorular)).toBeNull();
  });

  it('en yüksek yanlış sayısı olan soruyu döner', () => {
    const i: Ilerleme = {
      ...varsayilanIlerleme(),
      yanlislar: { a: 2, b: 5, c: 1 },
    };
    const s = enCokYanlisSoru(i, sorular);
    expect(s?.id).toBe('b');
  });

  it('yanlış kaydındaki id soru listesinde yoksa sonrakine geçer', () => {
    const i: Ilerleme = {
      ...varsayilanIlerleme(),
      yanlislar: { silinmis: 10, a: 3 },
    };
    const s = enCokYanlisSoru(i, sorular);
    expect(s?.id).toBe('a');
  });

  it('hiçbir yanlış eşleşmezse null döner', () => {
    const i: Ilerleme = {
      ...varsayilanIlerleme(),
      yanlislar: { yok1: 5, yok2: 3 },
    };
    expect(enCokYanlisSoru(i, sorular)).toBeNull();
  });
});
