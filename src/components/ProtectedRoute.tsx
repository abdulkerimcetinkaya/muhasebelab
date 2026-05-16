import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';
import { authDonusYaz } from '../lib/auth-donus';

interface Props {
  children: ReactNode;
}

/**
 * Sadece giriş yapmış kullanıcılara açık route wrapper'ı.
 * Anonim kullanıcı /giris'e yönlendirilir; giriş sonrası geri dönüş için
 * mevcut URL `auth_donus_url` olarak sessionStorage'a yazılır.
 */
export const ProtectedRoute = ({ children }: Props) => {
  const { user, yukleniyor } = useAuth();
  const location = useLocation();

  if (yukleniyor) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-center">
        <Icon name="Loader2" size={20} className="animate-spin text-ink-mute" />
      </main>
    );
  }

  if (!user) {
    // Hash router olduğu için pathname'i hash sonrası kısma yaz
    const donusUrl = location.pathname + location.search;
    authDonusYaz(donusUrl);
    return <Navigate to="/giris" replace />;
  }

  return <>{children}</>;
};
