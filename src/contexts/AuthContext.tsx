import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { oturumAl, oturumDinle } from '../lib/auth';
import { adminMi } from '../lib/admin';
import { supabase } from '../lib/supabase';

interface AuthDurumu {
  user: User | null;
  session: Session | null;
  yukleniyor: boolean;
  premiumBitis: string | null;
  premiumYenile: () => Promise<void>;
}

const baslangic: AuthDurumu = {
  user: null,
  session: null,
  yukleniyor: true,
  premiumBitis: null,
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
        premiumYenile,
      }));
      if (u) {
        setTimeout(() => {
          premiumGetir(u.id).then((bitis) => {
            if (!aktif) return;
            setDurum((prev) => ({ ...prev, premiumBitis: bitis }));
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

export const useIsAdmin = (): boolean => {
  const { user } = useAuth();
  return useMemo(() => adminMi(user), [user]);
};

export const useIsPremium = (): boolean => {
  const { premiumBitis } = useAuth();
  return useMemo(() => {
    if (!premiumBitis) return false;
    return new Date(premiumBitis) > new Date();
  }, [premiumBitis]);
};
