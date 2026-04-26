import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
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

  const linkler = [
    { id: '/', ad: 'Anasayfa', aktif: aktifAna },
    { id: '/uniteler', ad: 'Üniteler', aktif: aktifUnite },
    { id: '/problemler', ad: 'Problemler', aktif: aktifProblem },
    ...(user ? [{ id: '/profil', ad: 'Profil', aktif: aktifProfil }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-5 pt-3 sm:pt-4">
      <div className="max-w-[1320px] mx-auto">
        <div className="surface flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 backdrop-blur-md bg-surface/85">
          {/* Logo */}
          <button
            onClick={() => nav('/')}
            className="flex items-center gap-2.5 group pl-1.5 pr-2"
            aria-label="Anasayfa"
          >
            <span className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-ink text-bg font-display font-bold text-[16px] leading-none">
              M
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-energy border-2 border-surface" />
            </span>
            <span className="font-display font-bold text-[18px] tracking-[-0.025em] leading-none text-ink hidden sm:block">
              MuhasebeLab
            </span>
          </button>

          {/* Orta nav — masaüstü */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-2 rounded-pill p-1">
            {linkler.map((l) => (
              <button
                key={l.id}
                onClick={() => nav(l.id)}
                className={`px-4 py-1.5 rounded-pill text-[13.5px] font-medium transition ${
                  l.aktif
                    ? 'bg-surface text-ink shadow-soft'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {l.ad}
              </button>
            ))}
          </nav>

          {/* Sağ — istatistik + actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Streak + puan */}
            {(ilerleme.streak > 0 || ilerleme.puan > 0) && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-pill bg-surface-2 border border-line-soft">
                {ilerleme.streak > 0 && (
                  <div className="flex items-center gap-1.5" title="Seri">
                    <span className="live-dot" />
                    <span className="font-mono tnum text-[13px] font-bold text-ink">
                      {ilerleme.streak}
                    </span>
                  </div>
                )}
                {ilerleme.streak > 0 && ilerleme.puan > 0 && (
                  <span className="w-px h-3 bg-line-strong" />
                )}
                {ilerleme.puan > 0 && (
                  <div className="flex items-center gap-1.5" title="Puan">
                    <Icon name="Trophy" size={11} className="text-premium" />
                    <span className="font-mono tnum text-[13px] font-bold text-ink">
                      {ilerleme.puan}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Hesap planı */}
            <button
              onClick={onHesapPlaniAc}
              className="hidden lg:flex p-2 rounded-pill text-ink-soft hover:text-ink hover:bg-surface-2 transition"
              title="Hesap Planı"
            >
              <Icon name="BookOpen" size={15} />
            </button>

            {/* Tema */}
            <button
              onClick={onTemaDegistir}
              className="p-2 rounded-pill text-ink-soft hover:text-ink hover:bg-surface-2 transition"
              title={ilerleme.tema === 'dark' ? 'Açık tema' : 'Karanlık tema'}
            >
              <Icon name={ilerleme.tema === 'dark' ? 'Sun' : 'Moon'} size={15} />
            </button>

            {/* Premium */}
            {user &&
              (isPremium ? (
                <button
                  onClick={() => nav('/premium')}
                  className="hidden md:flex chip-premium"
                  title="Premium üyelik aktif"
                >
                  <Icon name="BadgeCheck" size={11} />
                  Premium
                </button>
              ) : (
                <button
                  onClick={() => nav('/premium')}
                  className="hidden md:flex chip chip-premium"
                  title="Premium özellikler"
                  style={{ background: 'transparent', borderColor: 'var(--premium)', color: 'var(--premium-deep)' }}
                >
                  <Icon name="Sparkles" size={11} />
                  Premium
                </button>
              ))}

            {/* Admin */}
            {isAdmin && (
              <button
                onClick={() => nav('/admin')}
                className="hidden md:flex chip"
                title="Admin"
              >
                <Icon name="Shield" size={11} />
                Admin
              </button>
            )}

            {/* Giriş / Çıkış */}
            {user ? (
              <button
                onClick={cikis}
                className="hidden md:flex p-2 rounded-pill text-ink-soft hover:text-danger hover:bg-surface-2 transition"
                title={user.email ?? ''}
              >
                <Icon name="LogOut" size={15} />
              </button>
            ) : (
              <button
                onClick={() => nav('/giris')}
                className="hidden md:flex btn btn-primary btn-sm"
              >
                Giriş Yap
                <Icon name="ArrowRight" size={13} />
              </button>
            )}

            {/* Mobil menü */}
            <button
              onClick={() => setMobilMenuAcik(!mobilMenuAcik)}
              className="md:hidden p-2 rounded-pill border border-line bg-surface text-ink"
              aria-label="Menü"
            >
              <Icon name={mobilMenuAcik ? 'X' : 'Menu'} size={16} />
            </button>
          </div>
        </div>

        {/* Mobil menü */}
        {mobilMenuAcik && (
          <div className="surface mt-2 overflow-hidden">
            <div className="flex flex-col">
              {linkler.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    nav(l.id);
                    setMobilMenuAcik(false);
                  }}
                  className={`px-5 py-3.5 text-left border-b border-line-soft text-[15px] font-medium last:border-b-0 ${
                    l.aktif ? 'bg-primary-soft text-primary' : 'text-ink hover:bg-surface-2'
                  }`}
                >
                  {l.ad}
                </button>
              ))}
              <button
                onClick={() => {
                  onHesapPlaniAc();
                  setMobilMenuAcik(false);
                }}
                className="px-5 py-3.5 text-left border-t border-line-soft text-[15px] font-medium text-ink hover:bg-surface-2 flex items-center gap-2.5"
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
                  className="px-5 py-3.5 text-left border-t border-line-soft text-[15px] font-medium text-premium-deep hover:bg-surface-2 flex items-center gap-2.5"
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
                  className={`px-5 py-3.5 text-left border-t border-line-soft text-[15px] font-medium hover:bg-surface-2 flex items-center gap-2.5 ${
                    aktifAdmin ? 'bg-primary-soft text-primary' : 'text-ink'
                  }`}
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
                  className="px-5 py-3.5 text-left border-t border-line-soft text-[15px] font-medium text-ink-soft flex items-center gap-2.5"
                >
                  <Icon name="LogOut" size={14} />
                  <span className="truncate">Çıkış · {user.email}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    nav('/giris');
                    setMobilMenuAcik(false);
                  }}
                  className="m-3 btn btn-primary"
                >
                  Giriş Yap
                  <Icon name="ArrowRight" size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
