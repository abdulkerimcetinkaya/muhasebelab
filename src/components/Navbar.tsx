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
    <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-md border-b border-line">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between gap-4 py-3.5">
          {/* Logo */}
          <button
            onClick={() => nav('/')}
            className="flex items-baseline gap-2.5 group"
            aria-label="Anasayfa"
          >
            <span className="font-display text-[24px] leading-none text-ink tracking-tight">
              MuhasebeLab
            </span>
            <span className="hidden md:inline font-display italic text-[13px] text-ink-mute leading-none">
              — atölye
            </span>
          </button>

          {/* Orta nav */}
          <nav className="hidden md:flex items-center">
            {linkler.map((l, i) => (
              <span key={l.id} className="flex items-center">
                {i > 0 && <span className="text-ink-quiet mx-3.5 text-[12px]">·</span>}
                <button
                  onClick={() => nav(l.id)}
                  className={`relative text-[13.5px] font-medium tracking-tight transition py-1 ${
                    l.aktif ? 'text-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {l.ad}
                  {l.aktif && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-ink" />
                  )}
                </button>
              </span>
            ))}
          </nav>

          {/* Sağ */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Streak / puan */}
            {(ilerleme.streak > 0 || ilerleme.puan > 0) && (
              <div className="hidden sm:flex items-center gap-3 mr-1 pr-3 border-r border-line">
                {ilerleme.streak > 0 && (
                  <div className="flex items-baseline gap-1.5" title="Seri">
                    <span className="font-mono tnum text-[13px] text-ink">{ilerleme.streak}</span>
                    <span className="text-[10px] text-ink-mute uppercase tracking-wider font-mono">seri</span>
                  </div>
                )}
                {ilerleme.streak > 0 && ilerleme.puan > 0 && (
                  <span className="w-px h-3 bg-line" />
                )}
                {ilerleme.puan > 0 && (
                  <div className="flex items-baseline gap-1.5" title="Puan">
                    <span className="font-mono tnum text-[13px] text-ink">{ilerleme.puan}</span>
                    <span className="text-[10px] text-ink-mute uppercase tracking-wider font-mono">puan</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onHesapPlaniAc}
              className="hidden lg:flex p-1.5 rounded text-ink-soft hover:text-ink transition"
              title="Hesap Planı"
            >
              <Icon name="BookOpen" size={15} />
            </button>

            <button
              onClick={onTemaDegistir}
              className="p-1.5 rounded text-ink-soft hover:text-ink transition"
              title={ilerleme.tema === 'dark' ? 'Açık tema' : 'Karanlık tema'}
            >
              <Icon name={ilerleme.tema === 'dark' ? 'Sun' : 'Moon'} size={15} />
            </button>

            {user &&
              (isPremium ? (
                <button
                  onClick={() => nav('/premium')}
                  className="hidden md:inline-flex chip chip-premium"
                  title="Premium aktif"
                >
                  <Icon name="BadgeCheck" size={10} />
                  Premium
                </button>
              ) : (
                <button
                  onClick={() => nav('/premium')}
                  className="hidden md:inline-flex text-[11px] tracking-wider uppercase font-mono font-medium text-premium-deep hover:text-premium transition py-1 px-1"
                  title="Premium"
                >
                  Premium →
                </button>
              ))}

            {isAdmin && (
              <button
                onClick={() => nav('/admin')}
                className="hidden md:flex chip"
                title="Admin"
              >
                <Icon name="Shield" size={10} />
                Admin
              </button>
            )}

            {user ? (
              <button
                onClick={cikis}
                className="hidden md:flex p-1.5 rounded text-ink-soft hover:text-danger transition"
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
              </button>
            )}

            <button
              onClick={() => setMobilMenuAcik(!mobilMenuAcik)}
              className="md:hidden p-1.5 rounded border border-line text-ink"
              aria-label="Menü"
            >
              <Icon name={mobilMenuAcik ? 'X' : 'Menu'} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      {mobilMenuAcik && (
        <div className="md:hidden border-t border-line bg-surface">
          <div className="max-w-[1240px] mx-auto px-5 py-2">
            {linkler.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  nav(l.id);
                  setMobilMenuAcik(false);
                }}
                className={`w-full px-2 py-3 text-left text-[15px] flex items-center justify-between border-b border-line-soft last:border-b-0 ${
                  l.aktif ? 'text-ink font-medium' : 'text-ink-soft'
                }`}
              >
                <span>{l.ad}</span>
                {l.aktif && <span className="folio">●</span>}
              </button>
            ))}
            <div className="hairline my-2" />
            <button
              onClick={() => {
                onHesapPlaniAc();
                setMobilMenuAcik(false);
              }}
              className="w-full px-2 py-3 text-left text-[14px] text-ink-soft flex items-center gap-2.5"
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
                className="w-full px-2 py-3 text-left text-[14px] text-premium-deep flex items-center gap-2.5"
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
                className={`w-full px-2 py-3 text-left text-[14px] flex items-center gap-2.5 ${
                  aktifAdmin ? 'text-ink font-medium' : 'text-ink-soft'
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
                className="w-full px-2 py-3 text-left text-[14px] text-ink-soft flex items-center gap-2.5"
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
                className="w-full mt-2 btn btn-primary"
              >
                Giriş Yap
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
