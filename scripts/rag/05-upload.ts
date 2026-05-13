/**
 * Adım 5 — Embed edilmiş chunk'ları Supabase pgvector'e yaz.
 *
 * Strateji:
 *   1. Kaynak meta'sını upsert et (rag_kaynaklar)
 *   2. Mevcut chunk hash'lerini çek → değişmemiş olanlar atlanır
 *   3. Yeni/değişmiş chunk'ları batch insert et
 *   4. Eski sırada bulunan ama yeni listede olmayan chunk'ları sil
 *
 * Bu sayede tam reindex yerine **incremental** çalışıyoruz —
 * 5000 chunk'lık bir kaynakta 10 madde değiştiyse sadece 10
 * embedding yeniden üretilir.
 */

import { createClient } from '@supabase/supabase-js';
import type { Kaynak, EmbeddedChunk } from './lib/types.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY env tanımlı olmalı');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const BATCH = 50; // PgREST insert payload sınırı (~5MB)

export const kaynakKaydet = async (kaynak: Kaynak, icerikHash: string) => {
  const { error } = await supabase.from('rag_kaynaklar').upsert(
    {
      id: kaynak.id,
      baslik: kaynak.baslik,
      kategori: kaynak.kategori,
      yayinci: kaynak.yayinci,
      url: kaynak.url,
      format: kaynak.format,
      yayim_tarihi: kaynak.yayim_tarihi ?? null,
      son_indirme: new Date().toISOString(),
      icerik_hash: icerikHash,
      durum: 'isleniyor',
      hata_mesaji: null,
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(`Kaynak upsert hatası: ${error.message}`);
};

export const kaynagiTamamla = async (kaynakId: string) => {
  await supabase
    .from('rag_kaynaklar')
    .update({ durum: 'tamamlandi' })
    .eq('id', kaynakId);
};

export const kaynagiHataylaIsaretle = async (kaynakId: string, mesaj: string) => {
  await supabase
    .from('rag_kaynaklar')
    .update({ durum: 'hata', hata_mesaji: mesaj })
    .eq('id', kaynakId);
};

interface MevcutChunk {
  id: string;
  sira: number;
  metin_hash: string;
}

export const chunklariYukle = async (
  kaynakId: string,
  yeniler: EmbeddedChunk[],
): Promise<{ eklendi: number; guncellendi: number; silindi: number; atlandı: number }> => {
  // 1) Mevcut chunk hash'lerini çek
  const { data: mevcut, error: hata } = await supabase
    .from('rag_chunks')
    .select('id, sira, metin_hash')
    .eq('kaynak_id', kaynakId);

  if (hata) throw new Error(`Mevcut chunk listesi alınamadı: ${hata.message}`);

  const mevcutMap = new Map<number, MevcutChunk>();
  for (const m of (mevcut ?? []) as MevcutChunk[]) {
    mevcutMap.set(m.sira, m);
  }

  // 2) Yeni listede olanları işle
  const insertler: Array<Record<string, unknown>> = [];
  const updateler: Array<{ id: string; data: Record<string, unknown> }> = [];
  let atlandı = 0;

  for (const y of yeniler) {
    const eski = mevcutMap.get(y.sira);
    if (eski && eski.metin_hash === y.metin_hash) {
      atlandı++;
      mevcutMap.delete(y.sira);
      continue;
    }

    const veri = {
      kaynak_id: y.kaynak_id,
      sira: y.sira,
      baslik: y.baslik,
      madde_no: y.madde_no,
      metin: y.metin,
      token_sayisi: y.token_sayisi,
      embedding: y.embedding,
      metin_hash: y.metin_hash,
    };

    if (eski) {
      updateler.push({ id: eski.id, data: veri });
      mevcutMap.delete(y.sira);
    } else {
      insertler.push(veri);
    }
  }

  // 3) Insert (batch)
  for (let i = 0; i < insertler.length; i += BATCH) {
    const grup = insertler.slice(i, i + BATCH);
    const { error } = await supabase.from('rag_chunks').insert(grup);
    if (error) throw new Error(`Insert hatası: ${error.message}`);
  }

  // 4) Update (tek tek — chunk az ise sorun yok)
  for (const u of updateler) {
    const { error } = await supabase
      .from('rag_chunks')
      .update(u.data)
      .eq('id', u.id);
    if (error) throw new Error(`Update hatası: ${error.message}`);
  }

  // 5) Yeni listede olmayanları sil
  const silinecekIdler = Array.from(mevcutMap.values()).map((m) => m.id);
  if (silinecekIdler.length > 0) {
    const { error } = await supabase
      .from('rag_chunks')
      .delete()
      .in('id', silinecekIdler);
    if (error) throw new Error(`Delete hatası: ${error.message}`);
  }

  console.log(
    `  📤 ${kaynakId}: +${insertler.length} eklendi, ~${updateler.length} güncellendi, -${silinecekIdler.length} silindi, ${atlandı} değişmedi`,
  );

  return {
    eklendi: insertler.length,
    guncellendi: updateler.length,
    silindi: silinecekIdler.length,
    atlandı,
  };
};
