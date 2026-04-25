import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Thiings } from './Thiings';
import { useAuth, useIsAdmin, useIsPremium } from '../contexts/AuthContext';
import { cikisYap } from '../lib/auth';
import type { Ilerleme } from '../types';

interface Props {
  ilerleme: Ilerleme;
  onTemaDegistir: () => void;
  onHesapPlaniAc: () => void;
}

export const Navbar = ({ ilerleme, onTemaDegistir, onHesapPlaniAc }: Props) => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const isPremium = useIsPremium();
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);

  const cikis = async () => {
    await cikisYap();
    nav('/');
  };

  const aktifAna = pathname === '/';
  const aktifUnite = pathname === '/uniteler' || pathname.startsWith('/uniteler/');
  const aktifProblem = pathname === '/problemler' || pathname.startsWith('/problemler/');
  const aktifProfil = pathname === '/profil';
  const aktifAdmin = pathname.startsWith('/admin');

  const linkStil = (aktif: boolean) =>
    `relative text-sm transition font-semibold ${
      aktif
        ? 'text-stone-900 dark:text-zinc-100'
        : 'text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100'
    }`;

  return (
    <header className="border-b border-stone-900/10 dark:border-zinc-800 bg-stone-50/90 dark:bg-zinc-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
        <button
          onClick={() => nav('/')}
          className="flex items-center gap-3 hover:opacity-70 transition"
        >
          <Thiings name="calculator" size={36} />
          <div className="text-left hidden sm:block">
            <div className="font-display text-xl leading-none tracking-tight font-bold">
              MuhasebeLab
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 mt-1 font-medium">
              Hesap Planı Atölyesi
            </div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => nav('/')} className={linkStil(aktifAna)}>
            Ana Sayfa
            {aktifAna && (
              <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-stone-900 dark:bg-zinc-100" />
            )}
          </button>
          <button onClick={() => nav('/uniteler')} className={linkStil(aktifUnite)}>
            Üniteler
            {aktifUnite && (
              <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-stone-900 dark:bg-zinc-100" />
            )}
          </button>
          <button onClick={() => nav('/problemler')} className={linkStil(aktifProblem)}>
            Problemler
            {aktifProblem && (
              <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-stone-900 dark:bg-zinc-100" />
            )}
          </button>
          {user && (
            <button onClick={() => nav('/profil')} className={linkStil(aktifProfil)}>
              Profil
              {aktifProfil && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-stone-900 dark:bg-zinc-100" />
              )}
            </button>
          )}
          {isAdmin && (
            <button onClick={() => nav('/admin')} className={linkStil(aktifAdmin)}>
              <span className="flex items-center gap-1.5">
                <Icon name="Shield" size={12} />
                Admin
              </span>
              {aktifAdmin && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-stone-900 dark:bg-zinc-100" />
              )}
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onHesapPlaniAc}
            className="hidden lg:flex items-center gap-2 text-sm text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white px-3 py-1.5 border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 transition rounded-lg font-medium"
          >
            <Icon name="BookOpen" size={14} />
            <span>Hesap Planı</span>
          </button>
          <button
            onClick={onTemaDegistir}
            className="p-2 border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 transition rounded-lg"
            title={ilerleme.tema === 'dark' ? 'Açık tema' : 'Karanlık tema'}
          >
            <Icon name={ilerleme.tema === 'dark' ? 'Sun' : 'Moon'} size={14} />
          </button>
          {(ilerleme.streak > 0 || ilerleme.puan > 0) && (
            <div className="hidden sm:flex items-center gap-3 lg:gap-4 text-sm ml-1 lg:ml-2 lg:pl-4 lg:border-l border-stone-300 dark:border-zinc-700">
              <div className="flex items-center gap-1.5" title="Seri">
                <Icon
                  name="Flame"
                  size={16}
                  className={ilerleme.streak > 0 ? 'text-orange-600' : 'text-stone-300 dark:text-zinc-600'}
                />
                <span className="font-mono font-bold">{ilerleme.streak}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Puan">
                <Icon name="Trophy" size={16} className="text-amber-600" />
                <span className="font-mono font-bold">{ilerleme.puan}</span>
              </div>
            </div>
          )}
          {user && (
            isPremium ? (
              <button
                onClick={() => nav('/premium')}
                className="hidden md:flex items-center gap-1.5 text-[11px] tracking-wide uppercase font-bold bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-950/40 border border-amber-300/60 dark:border-amber-700/40 text-amber-900 dark:text-amber-200 px-2.5 py-1.5 rounded-lg ml-2 hover:opacity-90 active:scale-[0.98] transition"
                title="Premium üyelik aktif"
              >
                <Icon name="BadgeCheck" size={13} />
                <span>Premium</span>
              </button>
            ) : (
              <button
                onClick={() => nav('/premium')}
                className="hidden md:flex items-center gap-1.5 text-[11px] tracking-wide uppercase font-bold text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/40 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-2.5 py-1.5 rounded-lg ml-2 transition"
                title="Premium özellikler"
              >
                <Icon name="Sparkles" size={13} />
                <span>Premium</span>
              </button>
            )
          )}
          {user ? (
            <button
              onClick={cikis}
              className="hidden md:flex items-center gap-2 text-sm text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white px-3 py-1.5 border border-stone-300 dark:border-zinc-700 hover:border-stone-900 dark:hover:border-zinc-400 transition rounded-lg font-medium ml-2"
              title={user.email ?? ''}
            >
              <Icon name="LogOut" size={14} />
              <span>Çıkış</span>
            </button>
          ) : (
            <button
              onClick={() => nav('/giris')}
              className="hidden md:flex items-center gap-2 text-sm bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 px-3 py-1.5 transition rounded-lg font-bold ml-2"
            >
              <Icon name="LogIn" size={14} />
              <span>Giriş Yap</span>
            </button>
          )}
          <button
            onClick={() => setMobilMenuAcik(!mobilMenuAcik)}
            className="md:hidden p-2 border border-stone-300 dark:border-zinc-700 rounded-lg"
          >
            <Icon name={mobilMenuAcik ? 'X' : 'Menu'} size={16} />
          </button>
        </div>
      </div>

      {mobilMenuAcik && (
        <div className="md:hidden border-t border-stone-900/10 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900">
          <div className="flex flex-col">
            {[
              { id: '/', ad: 'Ana Sayfa', aktif: aktifAna },
              { id: '/uniteler', ad: 'Üniteler', aktif: aktifUnite },
              { id: '/problemler', ad: 'Problemler', aktif: aktifProblem },
              ...(user ? [{ id: '/profil', ad: 'Profil', aktif: aktifProfil }] : []),
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  nav(l.id);
                  setMobilMenuAcik(false);
                }}
                className={`px-6 py-3 text-left border-b border-stone-900/5 dark:border-zinc-800 font-semibold ${l.aktif ? 'bg-white dark:bg-zinc-800' : ''}`}
              >
                {l.ad}
              </button>
            ))}
            <button
              onClick={() => {
                onHesapPlaniAc();
                setMobilMenuAcik(false);
              }}
              className="px-6 py-3 text-left border-b border-stone-900/5 dark:border-zinc-800 font-semibold flex items-center gap-2"
            >
              <Icon name="BookOpen" size={14} />
              Hesap Planı
            </button>
            {user && (
              <button
                onClick={() => {
                  nav('/premium');
                  setMobilMenuAcik(false);
                }}
                className="px-6 py-3 text-left border-b border-stone-900/5 dark:border-zinc-800 font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400"
              >
                <Icon name={isPremium ? 'BadgeCheck' : 'Sparkles'} size={14} />
                {isPremium ? 'Premium (Aktif)' : 'Premium'}
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  nav('/admin');
                  setMobilMenuAcik(false);
                }}
                className={`px-6 py-3 text-left border-b border-stone-900/5 dark:border-zinc-800 font-semibold flex items-center gap-2 ${aktifAdmin ? 'bg-white dark:bg-zinc-800' : ''}`}
              >
                <Icon name="Shield" size={14} />
                Admin
              </button>
            )}
            {user ? (
              <button
                onClick={() => {
                  cikis();
                  setMobilMenuAcik(false);
                }}
                className="px-6 py-3 text-left border-b border-stone-900/5 dark:border-zinc-800 font-semibold flex items-center gap-2 text-stone-600 dark:text-zinc-400"
              >
                <Icon name="LogOut" size={14} />
                <span className="truncate">Çıkış ({user.email})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  nav('/giris');
                  setMobilMenuAcik(false);
                }}
                className="px-6 py-3 text-left border-b border-stone-900/5 dark:border-zinc-800 font-bold flex items-center gap-2"
              >
                <Icon name="LogIn" size={14} />
                Giriş Yap
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
