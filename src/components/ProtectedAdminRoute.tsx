import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth, useIsAdmin } from '../contexts/AuthContext';

interface Props {
  children: ReactNode;
}

export const ProtectedAdminRoute = ({ children }: Props) => {
  const { user, yukleniyor } = useAuth();
  const isAdmin = useIsAdmin();

  if (yukleniyor) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-center">
        <Icon name="Loader2" size={20} className="animate-spin text-stone-500" />
      </main>
    );
  }

  if (!user) return <Navigate to="/giris" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};
