import { supabase } from './supabase';

export interface IndirimKodu {
  id: string;
  kod: string;
  indirim_yuzde: number;
  max_kullanim: number | null;
  bitis_tarihi: string | null;
  aktif: boolean;
  aciklama: string | null;
  plan_kodu: string | null;
  created_at: string;
  olusturan_id: string | null;
  // Admin liste için: kalan kullanım hesaplaması (frontend doldurur)
  kullanim_sayisi?: number;
}

export interface DogrulamaSonuc {
  gecerli: boolean;
  indirim_yuzde: number;
  sebep: string;
  indirim_id: string | null;
}

/**
 * Kullanıcı checkout'ta kod girince çağrılır. Geçerli mi, % indirim ne?
 */
export const indirimDogrula = async (
  kod: string,
  planKodu?: string,
): Promise<DogrulamaSonuc> => {
  const { data, error } = await supabase.rpc('indirim_dogrula', {
    _kod: kod.trim(),
    _plan_kodu: planKodu ?? null,
  });
  if (error) throw new Error(error.message);
  // RPC table döndürüyor (1 satır), client SDK array veriyor
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return { gecerli: false, indirim_yuzde: 0, sebep: 'Beklenmeyen yanıt', indirim_id: null };
  }
  return row as DogrulamaSonuc;
};

/**
 * %100 indirim için iyzico'ya hiç gitmeden direkt aktive eder.
 * Sadece indirim_yuzde === 100 olan kodlar için.
 */
export const indirimUcretsizKullan = async (
  kod: string,
  planKodu: string,
): Promise<{ basarili: boolean; yeniBitis: string | null; hata: string | null }> => {
  const { data, error } = await supabase.rpc('indirim_kullan_ucretsiz', {
    _kod: kod.trim(),
    _plan_kodu: planKodu,
  });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { basarili: false, yeniBitis: null, hata: 'Yanıt boş' };
  return {
    basarili: row.basarili,
    yeniBitis: row.yeni_premium_bitis ?? null,
    hata: row.hata ?? null,
  };
};

// =====================================================================
// Admin tarafı
// =====================================================================

export interface YeniIndirimKodu {
  kod: string;
  indirim_yuzde: number;
  max_kullanim: number | null;
  bitis_tarihi: string | null;
  aktif: boolean;
  aciklama: string | null;
  plan_kodu: string | null;
}

export const tumIndirimKodlariYukle = async (): Promise<IndirimKodu[]> => {
  const { data, error } = await supabase
    .from('indirim_kodlari')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  const kodlar = (data ?? []) as IndirimKodu[];

  // Her kod için kullanım sayısını paralel olarak çek
  const sayilar = await Promise.all(
    kodlar.map(async (k) => {
      const { data: sayi } = await supabase.rpc('admin_indirim_kullanim_sayisi', {
        _indirim_id: k.id,
      });
      return { id: k.id, sayi: (sayi as number) ?? 0 };
    }),
  );
  const map = new Map(sayilar.map((s) => [s.id, s.sayi]));
  return kodlar.map((k) => ({ ...k, kullanim_sayisi: map.get(k.id) ?? 0 }));
};

export const indirimKoduOlustur = async (
  yeni: YeniIndirimKodu,
): Promise<IndirimKodu> => {
  const { data, error } = await supabase
    .from('indirim_kodlari')
    .insert({
      kod: yeni.kod.trim().toUpperCase(),
      indirim_yuzde: yeni.indirim_yuzde,
      max_kullanim: yeni.max_kullanim,
      bitis_tarihi: yeni.bitis_tarihi,
      aktif: yeni.aktif,
      aciklama: yeni.aciklama,
      plan_kodu: yeni.plan_kodu,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as IndirimKodu;
};

export const indirimKoduGuncelle = async (
  id: string,
  guncelleme: Partial<YeniIndirimKodu>,
): Promise<void> => {
  const { error } = await supabase
    .from('indirim_kodlari')
    .update(guncelleme)
    .eq('id', id);
  if (error) throw new Error(error.message);
};

export const indirimKoduSil = async (id: string): Promise<void> => {
  const { error } = await supabase.from('indirim_kodlari').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

/**
 * Random kod üretir — admin formunda placeholder/auto-generate için.
 * Karakterlerden A-Z + 2-9 (kafa karıştırıcı 0/O/I/1 hariç).
 */
export const rastgeleKodUret = (uzunluk = 8): string => {
  const harfler = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let kod = '';
  for (let i = 0; i < uzunluk; i++) {
    kod += harfler[Math.floor(Math.random() * harfler.length)];
  }
  return kod;
};
