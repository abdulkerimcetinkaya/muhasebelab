import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';

const linkler = [
  { to: '/admin', etiket: 'Genel Bakış', icon: 'LayoutDashboard', end: true },
  { to: '/admin/uniteler', etiket: 'Üniteler', icon: 'LayoutGrid', end: true },
  { to: '/admin/sorular', etiket: 'Sorular', icon: 'FileText', end: true },
  { to: '/admin/sorular/yeni', etiket: 'Yeni Soru', icon: 'PlusCircle', end: true },
  { to: '/admin/sorular/toplu-ekle', etiket: 'Toplu Ekle (JSON)', icon: 'Upload', end: true },
  { to: '/admin/muavin-hesaplar', etiket: 'Muavin Hesaplar', icon: 'Wallet', end: true },
  { to: '/admin/kullanicilar', etiket: 'Kullanıcılar', icon: 'Users', end: false },
  { to: '/admin/mevzuat', etiket: 'Mevzuat (AI)', icon: 'Sparkles', end: true },
  { to: '/admin/sozluk', etiket: 'Mali Sözlük', icon: 'BookOpen', end: true },
  { to: '/admin/bildirimler', etiket: 'Bildirimler', icon: 'Megaphone', end: true },
  { to: '/admin/hatalar', etiket: 'Hata Bildirimleri', icon: 'AlertCircle', end: true },
];

export const AdminYanMenu = () => {
  return (
    <aside className="w-56 shrink-0 border-r border-stone-200 dark:border-zinc-800 pr-4">
      <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-3 px-3">
        Admin
      </div>
      <nav className="flex flex-col gap-1">
        {linkler.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                isActive
                  ? 'bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-zinc-100'
              }`
            }
          >
            <Icon name={l.icon} size={14} />
            {l.etiket}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
