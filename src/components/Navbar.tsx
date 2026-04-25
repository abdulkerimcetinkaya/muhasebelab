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

const AY_ADLARI = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const GUN_ADLARI = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const tarihStr = () => {
  const d = new Date();
  return `${GUN_ADLARI[d.getDay()]} · ${d.getDate()} ${AY_ADLARI[d.getMonth()]} ${d.getFullYear()}`;
};

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
    { id: '/', ad: 'Anasayfa', kisa: 'I.', aktif: aktifAna },
    { id: '/uniteler', ad: 'Üniteler', kisa: 'II.', aktif: aktifUnite },
    { id: '/problemler', ad: 'Problemler', kisa: 'III.', aktif: aktifProblem },
    ...(user ? [{ id: '/profil', ad: 'Profil', kisa: 'IV.', aktif: aktifProfil }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm">
      {/* En üst künye şeridi */}
      <div className="border-b border-rule-strong">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-1.5 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase font-display font-semibold text-ink-soft">
          <span className="hidden sm:inline">Editio I · MMXXVI · No. 01</span>
          <span className="sm:hidden">Ed. I · MMXXVI</span>
          <span className="hidden md:inline font-display tracking-[0.22em] font-normal">{tarihStr()}</span>
          <span className="hidden lg:inline">Türkiye · Tek Düzen Hesap Planı</span>
        </div>
      </div>

      {/* Künye başlığı */}
      <div className="border-b border-rule-bold bg-paper">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Wordmark */}
          <button
            onClick={() => nav('/')}
            className="group flex items-baseline gap-3 hover:opacity-80 transition"
            aria-label="Anasayfa"
          >
            <span className="font-display text-[26px] sm:text-[32px] leading-none font-bold tracking-[-0.025em] text-ink">
              MuhasebeLab
            </span>
            <span className="hidden sm:inline font-display italic text-[13px] text-ink-soft pl-3 border-l border-rule-strong leading-none">
              Hesap Planı Atölyesi
            </span>
          </button>

          {/* Sağ blok — istatistik + premium + giriş */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak / puan */}
            {(ilerleme.streak > 0 || ilerleme.puan > 0) && (
              <div className="hidden sm:flex items-center gap-4 mr-2 pr-3 border-r border-rule-strong">
                <div className="flex items-baseline gap-1.5" title="Seri">
                  <span className="eyebrow text-[9.5px]">SERİ</span>
                  <span className="font-mono tnum font-bold text-[15px] text-ink">
                    {ilerleme.streak}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5" title="Puan">
                  <span className="eyebrow text-[9.5px]">PUAN</span>
                  <span className="font-mono tnum font-bold text-[15px] text-ink">
                    {ilerleme.puan}
                  </span>
                </div>
              </div>
            )}

            {/* Hesap Planı */}
            <button
              onClick={onHesapPlaniAc}
              className="hidden lg:flex items-center gap-1.5 text-[10.5px] tracking-[0.18em] uppercase font-display font-semibold text-ink-soft hover:text-ink transition"
              title="Hesap Planı"
            >
              <Icon name="BookOpen" size={13} />
              <span>Hesap Planı</span>
            </button>

            {/* Tema değiştir */}
            <button
              onClick={onTemaDegistir}
              className="p-2 text-ink-soft hover:text-ink transition"
              title={ilerleme.tema === 'dark' ? 'Açık tema' : 'Karanlık tema'}
              aria-label="Temayı değiştir"
            >
              <Icon name={ilerleme.tema === 'dark' ? 'Sun' : 'Moon'} size={15} />
            </button>

            {/* Premium */}
            {user &&
              (isPremium ? (
                <button
                  onClick={() => nav('/premium')}
                  className="hidden md:flex seal-ochre"
                  title="Premium üyelik aktif"
                >
                  <Icon name="BadgeCheck" size={11} />
                  <span>Premium</span>
                </button>
              ) : (
                <button
                  onClick={() => nav('/premium')}
                  className="hidden md:flex items-center gap-1.5 text-[10.5px] tracking-[0.16em] uppercase font-display font-semibold text-ochre hover:opacity-80 transition border-b border-ochre/40 hover:border-ochre"
                  title="Premium özellikler"
                >
                  <Icon name="Sparkles" size={11} />
                  <span>Premium</span>
                </button>
              ))}

            {/* Admin */}
            {isAdmin && (
              <button
                onClick={() => nav('/admin')}
                className="hidden md:flex items-center gap-1 text-[10.5px] tracking-[0.16em] uppercase font-display font-semibold text-ink-soft hover:text-ink transition"
                title="Admin"
              >
                <Icon name="Shield" size={11} />
                <span>Admin</span>
              </button>
            )}

            {/* Giriş / çıkış */}
            {user ? (
              <button
                onClick={cikis}
                className="hidden md:flex items-center gap-1.5 text-[10.5px] tracking-[0.16em] uppercase font-display font-semibold text-ink-soft hover:text-bordeaux transition"
                title={user.email ?? ''}
              >
                <Icon name="LogOut" size={11} />
                <span>Çıkış</span>
              </button>
            ) : (
              <button
                onClick={() => nav('/giris')}
                className="hidden md:flex btn-ink"
              >
                <span>Giriş Yap</span>
              </button>
            )}

            {/* Mobil menü */}
            <button
              onClick={() => setMobilMenuAcik(!mobilMenuAcik)}
              className="md:hidden p-2 border border-rule-bold text-ink"
              aria-label="Menü"
            >
              <Icon name={mobilMenuAcik ? 'X' : 'Menu'} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Sayfalar şeridi */}
      <div className="border-b border-rule-bold bg-paper-inset/40">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-2.5 hidden md:flex items-center justify-between gap-6">
          <nav className="flex items-center gap-7">
            {linkler.map((l) => (
              <button
                key={l.id}
                onClick={() => nav(l.id)}
                className={`group relative text-[12.5px] tracking-[0.05em] font-display font-semibold transition ${
                  l.aktif ? 'text-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                <span className="font-display italic text-ink-mute mr-1.5 text-[11px]">
                  {l.kisa}
                </span>
                {l.ad}
                {l.aktif && (
                  <span className="absolute -bottom-[10px] left-0 right-0 h-[2px] bg-bordeaux" />
                )}
              </button>
            ))}
          </nav>
          <span className="folio text-[10px]">
            Sayfa {linkler.findIndex((l) => l.aktif) >= 0 ? linkler.findIndex((l) => l.aktif) + 1 : '—'} / {linkler.length}
          </span>
        </div>
      </div>

      {/* Mobil menü */}
      {mobilMenuAcik && (
        <div className="md:hidden border-b border-rule-bold bg-paper-inset">
          <div className="flex flex-col">
            {linkler.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  nav(l.id);
                  setMobilMenuAcik(false);
                }}
                className={`px-6 py-4 text-left border-b border-rule font-display text-[15px] flex items-center gap-3 ${
                  l.aktif ? 'text-bordeaux font-bold' : 'text-ink'
                }`}
              >
                <span className="font-display italic text-ink-mute text-xs w-6">{l.kisa}</span>
                {l.ad}
              </button>
            ))}
            <button
              onClick={() => {
                onHesapPlaniAc();
                setMobilMenuAcik(false);
              }}
              className="px-6 py-4 text-left border-b border-rule font-display text-[15px] text-ink flex items-center gap-3"
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
                className="px-6 py-4 text-left border-b border-rule font-display text-[15px] text-ochre flex items-center gap-3"
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
                className={`px-6 py-4 text-left border-b border-rule font-display text-[15px] flex items-center gap-3 ${
                  aktifAdmin ? 'text-bordeaux font-bold' : 'text-ink'
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
                className="px-6 py-4 text-left font-display text-[15px] text-ink-soft flex items-center gap-3"
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
                className="px-6 py-4 text-left font-display text-[15px] text-bordeaux font-bold flex items-center gap-3"
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
