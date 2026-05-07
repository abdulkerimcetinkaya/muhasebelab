import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { oturumAl, oturumDinle } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { AdminRol } from '../lib/database.types';

interface AuthDurumu {
  user: User | null;
  session: Session | null;
  yukleniyor: boolean;
  premiumBitis: string | null;
  adminRoller: AdminRol[] | null; // null = henüz yüklenmedi, [] = admin değil
  premiumYenile: () => Promise<void>;
}

const baslangic: AuthDurumu = {
  user: null,
  session: null,
  yukleniyor: true,
  premiumBitis: null,
  adminRoller: null,
  premiumYenile: async () => {},
};

const AuthContext = createContext<AuthDurumu>(baslangic);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [durum, setDurum] = useState<AuthDurumu>(baslangic);

  const premiumGetir = async (userId: string): Promise<string | null> => {
    const { data } = await supabase
      .from('kullanicilar')
      .select('premium_bitis')
      .eq('id', userId)
      .maybeSingle();
    return data?.premium_bitis ?? null;
  };

  const adminRollerGetir = async (userId: string): Promise<AdminRol[]> => {
    const { data } = await supabase
      .from('adminler')
      .select('roller')
      .eq('user_id', userId)
      .maybeSingle();
    return ((data?.roller as AdminRol[]) ?? []);
  };

  // Closure'a takılmaması için user'ı her çağrıda supabase.auth'tan al
  const premiumYenile = async () => {
    const {
      data: { user: aktifUser },
    } = await supabase.auth.getUser();
    if (!aktifUser) return;
    const bitis = await premiumGetir(aktifUser.id);
    setDurum((prev) => ({ ...prev, premiumBitis: bitis }));
  };

  useEffect(() => {
    let aktif = true;

    // Önce user'ı senkron şekilde güncelle, premium'u deadlock yaratmayacak
    // şekilde mikro-görev sonrasına ertele. onAuthStateChange callback'i içinde
    // supabase.from() çağırmak auth kilidini tutar ve signInWithPassword'ü asar.
    const uygula = (session: Session | null) => {
      const u = session?.user ?? null;
      if (!aktif) return;
      setDurum((prev) => ({
        ...prev,
        session,
        user: u,
        yukleniyor: false,
        premiumBitis: u ? prev.premiumBitis : null,
        adminRoller: u ? prev.adminRoller : null,
        premiumYenile,
      }));
      if (u) {
        setTimeout(() => {
          Promise.all([premiumGetir(u.id), adminRollerGetir(u.id)]).then(([bitis, roller]) => {
            if (!aktif) return;
            setDurum((prev) => ({ ...prev, premiumBitis: bitis, adminRoller: roller }));
          });
        }, 0);
      }
    };

    oturumAl().then(uygula);
    const cikar = oturumDinle(uygula);
    return () => {
      aktif = false;
      cikar();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={durum}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

/**
 * Kullanıcının herhangi bir admin rolü var mı? (super, icerik, operasyon)
 * adminler tablosundan dinamik olarak okunur. Hardcoded email kontrolü artık yok.
 */
export const useIsAdmin = (): boolean => {
  const { adminRoller } = useAuth();
  return useMemo(() => (adminRoller ?? []).length > 0, [adminRoller]);
};

/** Spesifik bir role sahip mi? (super her şeyi kapsar) */
export const useHasAdminRol = (rol: AdminRol): boolean => {
  const { adminRoller } = useAuth();
  return useMemo(() => {
    if (!adminRoller) return false;
    return adminRoller.includes('super') || adminRoller.includes(rol);
  }, [adminRoller, rol]);
};

export const useIsPremium = (): boolean => {
  const { premiumBitis } = useAuth();
  return useMemo(() => {
    if (!premiumBitis) return false;
    return new Date(premiumBitis) > new Date();
  }, [premiumBitis]);
};
