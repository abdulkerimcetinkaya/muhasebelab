import { supabase } from './supabase';

export interface AdminLogKaydi {
  id: string;
  admin_id: string | null;
  admin_email: string;
  islem: string;
  hedef_user_id: string | null;
  hedef_email: string | null;
  detay: Record<string, unknown> | null;
  yapilan_at: string;
}

export const ISLEM_ETIKETLERI: Record<string, string> = {
  premium_ayarla: 'Premium ayarlandı',
  ilerleme_sifirla: 'İlerleme sıfırlandı',
  kullanici_banla: 'Kullanıcı banlandı',
  kullanici_unbanla: 'Ban kaldırıldı',
  kullanici_sil: 'Kullanıcı silindi',
  admin_ekle: 'Admin eklendi',
  admin_cikar: 'Admin çıkarıldı',
  admin_roller_guncelle: 'Admin rolleri güncellendi',
  katkici_onayla: 'Katkıcı onaylandı',
  katkici_reddet: 'Katkıcı reddedildi',
  katkici_yetki_kaldir: 'Katkıcı yetkisi kaldırıldı',
};

export const adminLogYukle = async (limit = 200): Promise<AdminLogKaydi[]> => {
  const { data, error } = await supabase
    .from('admin_log')
    .select('*')
    .order('yapilan_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminLogKaydi[];
};
