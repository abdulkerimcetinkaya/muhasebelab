import { useNavigate } from 'react-router-dom';
import { Thiings } from './Thiings';
import { useAuth } from '../contexts/AuthContext';

export const Footer = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const yil = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-900/10 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <button
              onClick={() => nav('/')}
              className="flex items-center gap-3 mb-4 hover:opacity-70 transition"
            >
              <Thiings name="calculator" size={36} />
              <div className="text-left">
                <div className="font-display text-xl leading-none tracking-tight font-bold">
                  MuhasebeLab
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 mt-1 font-medium">
                  Hesap Planı Atölyesi
                </div>
              </div>
            </button>
            <p className="text-sm text-stone-500 dark:text-zinc-500 font-medium leading-relaxed max-w-md">
              Üniversite muhasebe öğrencileri için interaktif yevmiye kaydı pratik platformu. Tek
              Düzen Hesap Planı&apos;nı senaryo bazlı problemlerle öğren.
            </p>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-4 font-bold">
              Keşfet
            </div>
            <div className="space-y-2.5 text-sm">
              <button
                onClick={() => nav('/uniteler')}
                className="block text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition font-semibold"
              >
                Üniteler
              </button>
              <button
                onClick={() => nav('/problemler')}
                className="block text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition font-semibold"
              >
                Tüm Sorular
              </button>
              {user && (
                <button
                  onClick={() => nav('/profil')}
                  className="block text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition font-semibold"
                >
                  Profil
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 mb-4 font-bold">
              Hakkında
            </div>
            <div className="space-y-2.5 text-sm">
              {!user && (
                <button
                  onClick={() => nav('/giris')}
                  className="block text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition font-semibold"
                >
                  Giriş / Kayıt
                </button>
              )}
              <span className="block text-stone-400 dark:text-zinc-600 font-medium cursor-default">
                Gizlilik · yakında
              </span>
              <span className="block text-stone-400 dark:text-zinc-600 font-medium cursor-default">
                KVKK · yakında
              </span>
              <span className="block text-stone-400 dark:text-zinc-600 font-medium cursor-default">
                İletişim · yakında
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-900/5 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-zinc-600 font-bold">
          <span>© {yil} MuhasebeLab · Editio I · MMXXVI</span>
          <span>Tüm hakları saklıdır</span>
        </div>
      </div>
    </footer>
  );
};
