import { supabase } from './supabase';
import type {
  AltBaslik,
  Belge,
  Konu,
  Modul,
  ModulZorluk,
  Soru,
  SoruWithUnite,
  Unite,
} from '../types';

// v5: Mal-alis-satis M1/M2 yeniden yapılandırma — alt başlık adları ve sıraları
// değişti, M2'ye 9 yeni alt başlık eklendi. Eski cache invalidate.
const UNITELER_CACHE_KEY = 'mli_uniteler_cache_v5';

interface OnbellekPaketi {
  v: 5;
  ts: number;
  uniteler: Unite[];
}

export interface UnitelerVerisi {
  uniteler: Unite[];
  tumSorular: SoruWithUnite[];
}

const duzleTumSorular = (uniteler: Unite[]): SoruWithUnite[] =>
  uniteler.flatMap((u) =>
    u.sorular.map((s) => ({
      ...s,
      uniteId: u.id,
      uniteAd: u.ad,
      uniteIcon: u.thiingsIcon,
    })),
  );

export const uniteleriYukle = async (): Promise<UnitelerVerisi> => {
  const [unitesR, konularR, modullerR, altBasliklarR, sorularR, cozumlerR] =
    await Promise.all([
      supabase.from('unites').select('*').order('sira'),
      supabase.from('unite_konulari').select('*').order('sira'),
      supabase.from('unite_modulleri').select('*').order('sira'),
      supabase.from('modul_alt_basliklari').select('*').order('sira'),
      supabase
        .from('sorular')
        .select('*')
        .eq('durum', 'onayli')
        .order('unite_id')
        .order('id'),
      supabase.from('cozumler').select('*').order('soru_id').order('sira'),
    ]);

  if (unitesR.error) throw new Error(`Ünites yüklenemedi: ${unitesR.error.message}`);
  if (konularR.error) throw new Error(`Konular yüklenemedi: ${konularR.error.message}`);
  if (modullerR.error)
    throw new Error(`Modüller yüklenemedi: ${modullerR.error.message}`);
  if (altBasliklarR.error)
    throw new Error(`Alt başlıklar yüklenemedi: ${altBasliklarR.error.message}`);
  if (sorularR.error) throw new Error(`Sorular yüklenemedi: ${sorularR.error.message}`);
  if (cozumlerR.error) throw new Error(`Çözümler yüklenemedi: ${cozumlerR.error.message}`);

  const cozumById: Record<string, { kod: string; borc: number; alacak: number }[]> = {};
  (cozumlerR.data ?? []).forEach((c) => {
    if (!cozumById[c.soru_id]) cozumById[c.soru_id] = [];
    cozumById[c.soru_id].push({ kod: c.kod, borc: c.borc, alacak: c.alacak });
  });

  const sorularByUnite: Record<string, Soru[]> = {};
  const sorularByKonu: Record<string, Soru[]> = {};
  const sorularByAltBaslik: Record<string, Soru[]> = {};
  (sorularR.data ?? []).forEach((s) => {
    if (!sorularByUnite[s.unite_id]) sorularByUnite[s.unite_id] = [];
    const belgeler = Array.isArray(s.belgeler) ? (s.belgeler as Belge[]) : undefined;
    const altBaslikId = (s as { alt_baslik_id?: string | null }).alt_baslik_id ?? null;
    const soru: Soru = {
      id: s.id,
      baslik: s.baslik,
      zorluk: s.zorluk,
      senaryo: s.senaryo,
      ipucu: s.ipucu ?? '',
      aciklama: s.aciklama ?? '',
      cozum: cozumById[s.id] ?? [],
      belgeler: belgeler && belgeler.length > 0 ? belgeler : undefined,
      konuId: s.konu_id ?? null,
      altBaslikId,
      ekleyenId: s.ekleyen_id ?? null,
    };
    sorularByUnite[s.unite_id].push(soru);
    if (s.konu_id) {
      if (!sorularByKonu[s.konu_id]) sorularByKonu[s.konu_id] = [];
      sorularByKonu[s.konu_id].push(soru);
    }
    if (altBaslikId) {
      if (!sorularByAltBaslik[altBaslikId]) sorularByAltBaslik[altBaslikId] = [];
      sorularByAltBaslik[altBaslikId].push(soru);
    }
  });

  const konularByUnite: Record<string, Konu[]> = {};
  (konularR.data ?? []).forEach((k) => {
    if (!konularByUnite[k.unite_id]) konularByUnite[k.unite_id] = [];
    konularByUnite[k.unite_id].push({
      id: k.id,
      uniteId: k.unite_id,
      ad: k.ad,
      aciklama: k.aciklama ?? null,
      icerik: (k as { icerik?: unknown }).icerik ?? null,
      sira: k.sira,
      sorular: sorularByKonu[k.id] ?? [],
    });
  });

  // Alt başlıkları modüllere bağla
  const altBasliklarByModul: Record<string, AltBaslik[]> = {};
  (altBasliklarR.data ?? []).forEach((a) => {
    if (!altBasliklarByModul[a.modul_id]) altBasliklarByModul[a.modul_id] = [];
    const altIcerik = (a as { icerik?: unknown }).icerik;
    const altIcerikGuncellendi = (a as { icerik_guncellendi?: string | null }).icerik_guncellendi;
    altBasliklarByModul[a.modul_id].push({
      id: a.id,
      modulId: a.modul_id,
      sira: a.sira,
      baslik: a.baslik,
      karma: !!a.karma,
      icerik: Array.isArray(altIcerik) ? (altIcerik as unknown[]) : null,
      icerikGuncellendi: altIcerikGuncellendi ?? null,
      sorular: sorularByAltBaslik[a.id] ?? [],
    });
  });

  // Modülleri ünitelere bağla
  const modullerByUnite: Record<string, Modul[]> = {};
  (modullerR.data ?? []).forEach((m) => {
    if (!modullerByUnite[m.unite_id]) modullerByUnite[m.unite_id] = [];
    const modulIcerik = (m as { icerik?: unknown }).icerik;
    const modulIcerikGuncellendi = (m as { icerik_guncellendi?: string | null }).icerik_guncellendi;
    modullerByUnite[m.unite_id].push({
      id: m.id,
      uniteId: m.unite_id,
      sira: m.sira,
      baslik: m.baslik,
      aciklama: m.aciklama ?? null,
      zorlukSeviyesi: m.zorluk_seviyesi as ModulZorluk,
      opsiyonel: !!m.opsiyonel,
      icerik: Array.isArray(modulIcerik) ? (modulIcerik as unknown[]) : null,
      icerikGuncellendi: modulIcerikGuncellendi ?? null,
      altBasliklar: altBasliklarByModul[m.id] ?? [],
    });
  });

  const uniteler: Unite[] = (unitesR.data ?? []).map((u) => ({
    id: u.id,
    ad: u.ad,
    thiingsIcon: u.thiings_icon ?? u.id,
    aciklama: u.aciklama ?? '',
    icerik: (u as { icerik?: unknown }).icerik ?? null,
    sorular: sorularByUnite[u.id] ?? [],
    konular: konularByUnite[u.id] ?? [],
    moduller: modullerByUnite[u.id] ?? [],
  }));

  return { uniteler, tumSorular: duzleTumSorular(uniteler) };
};

export const uniteleriCachedenOku = (): UnitelerVerisi | null => {
  try {
    const raw = localStorage.getItem(UNITELER_CACHE_KEY);
    if (!raw) return null;
    const paket = JSON.parse(raw) as OnbellekPaketi;
    if (paket.v !== 5 || !Array.isArray(paket.uniteler)) return null;
    return { uniteler: paket.uniteler, tumSorular: duzleTumSorular(paket.uniteler) };
  } catch {
    return null;
  }
};

export const uniteleriCacheeYaz = (uniteler: Unite[]): void => {
  try {
    const paket: OnbellekPaketi = { v: 5, ts: Date.now(), uniteler };
    localStorage.setItem(UNITELER_CACHE_KEY, JSON.stringify(paket));
  } catch {
    // ignore (quota)
  }
};
