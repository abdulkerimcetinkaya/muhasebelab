// MuhasebeLab — admin yetki kontrolü
// SQL tarafındaki is_admin() ile aynı listeyi tutar.
// Yeni admin eklerken iki yeri de güncelle:
//   1. Bu dosyadaki ADMIN_EMAILS
//   2. supabase/migrations/20260422000002_admin_rls.sql > is_admin()

import type { User } from '@supabase/supabase-js';

export const ADMIN_EMAILS: readonly string[] = ['kerim.cetinkayaa78@gmail.com'];

export const adminMi = (user: User | null): boolean => {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email);
};
