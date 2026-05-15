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

// v9: `sorular.belgeler` JSONB kolonu artık liste yüklemesinde çekilmiyor
// (egress optimizasyonu). SoruEkrani belgeleri ayrı yükler.
const UNITELER_CACHE_KEY = 'mli_uniteler_cache_v9';

interface OnbellekPaketi {
  v: 9;
  ts: number;
  uniteler: Unite[];
}

export interface UnitelerVerisi {
  uniteler: Unite[];
  tumSorular: SoruWithUnite[];
}

// sorular tablosundan liste yüklemesi sırasında çekilen kolonlar.
// `belgeler` JSONB kolonu büyük (fatura/dekont JSON'u, ~10 KB/satır) ve
// liste için gereksiz — bu yüzden hariç. SoruEkrani açılınca ayrıca çekilir.
const SORU_LISTE_KOLONLARI =
  'id, baslik, zorluk, senaryo, ipucu, aciklama, durum, unite_id, konu_id, alt_baslik_id, ekleyen_id';

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
        .select(SORU_LISTE_KOLONLARI)
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
    const altBaslikId = (s as { alt_baslik_id?: string | null }).alt_baslik_id ?? null;
    const soru: Soru = {
      id: s.id,
      baslik: s.baslik,
      zorluk: s.zorluk,
      senaryo: s.senaryo,
      ipucu: s.ipucu ?? '',
      aciklama: s.aciklama ?? '',
      cozum: cozumById[s.id] ?? [],
      // belgeler liste yüklemesinde çekilmez — SoruEkrani lazy yükler
      belgeler: undefined,
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
      aktif: (k as { aktif?: boolean }).aktif ?? true,
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
      aktif: (a as { aktif?: boolean }).aktif ?? true,
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
      aktif: (m as { aktif?: boolean }).aktif ?? true,
      altBasliklar: altBasliklarByModul[m.id] ?? [],
    });
  });

  const uniteler: Unite[] = (unitesR.data ?? []).map((u) => ({
    id: u.id,
    ad: u.ad,
    thiingsIcon: u.thiings_icon ?? u.id,
    aciklama: u.aciklama ?? '',
    icerik: (u as { icerik?: unknown }).icerik ?? null,
    aktif: (u as { aktif?: boolean }).aktif ?? true,
    sorular: sorularByUnite[u.id] ?? [],
    konular: konularByUnite[u.id] ?? [],
    moduller: modullerByUnite[u.id] ?? [],
  }));

  return { uniteler, tumSorular: duzleTumSorular(uniteler) };
};

/**
 * Tek bir sorunun belgelerini ayrı bir query ile çek. Liste yüklemesinde
 * `belgeler` kolonu hariç tutulduğu için SoruEkrani'nde lazy çağrılır.
 * Belge yoksa boş array döner.
 */
export const soruBelgeleriniYukle = async (soruId: string): Promise<Belge[]> => {
  const { data, error } = await supabase
    .from('sorular')
    .select('belgeler')
    .eq('id', soruId)
    .maybeSingle();
  if (error) {
    console.error(`Belgeler yüklenemedi (${soruId}):`, error.message);
    return [];
  }
  const belgeler = (data as { belgeler?: unknown })?.belgeler;
  return Array.isArray(belgeler) ? (belgeler as Belge[]) : [];
};

export const uniteleriCachedenOku = (): UnitelerVerisi | null => {
  try {
    const raw = localStorage.getItem(UNITELER_CACHE_KEY);
    if (!raw) return null;
    const paket = JSON.parse(raw) as OnbellekPaketi;
    if (paket.v !== 9 || !Array.isArray(paket.uniteler)) return null;
    return { uniteler: paket.uniteler, tumSorular: duzleTumSorular(paket.uniteler) };
  } catch {
    return null;
  }
};

export const uniteleriCacheeYaz = (uniteler: Unite[]): void => {
  try {
    const paket: OnbellekPaketi = { v: 9, ts: Date.now(), uniteler };
    localStorage.setItem(UNITELER_CACHE_KEY, JSON.stringify(paket));
  } catch {
    // ignore (quota)
  }
};
