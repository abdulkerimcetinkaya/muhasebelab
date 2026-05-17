// MuhasebeAkademi — admin yetki kontrolü
//
// DEPRECATED: Hardcoded ADMIN_EMAILS listesi artık kullanılmıyor. Admin durumu
// AuthContext üzerinden adminler tablosundan dinamik olarak okunuyor.
// useIsAdmin() ve useHasAdminRol(rol) hook'larını kullan.
//
// Bu dosya geriye dönük uyum için duruyor; ileride silinebilir.

import type { User } from '@supabase/supabase-js';

/** @deprecated useIsAdmin() hook'unu kullan */
export const adminMi = (_user: User | null): boolean => false;
