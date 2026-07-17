import { Link, useNavigate } from 'react-router-dom';
import { Home, Edit3, MessageCircle, BarChart2, Settings, LogOut, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { AuthService } from '@/services/auth.service';

export function Sidebar({ className }: { className?: string }) {
  const menus = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Journal', icon: Edit3, href: '/history' },
    { name: 'Reflection', icon: BarChart2, href: '/reflection' },
    { name: 'Synora AI', icon: MessageCircle, href: '/chat' },
    { name: 'Consulting', icon: Stethoscope, href: '/consulting' },
    { name: 'Settings', icon: Settings, href: '/profile' },
  ];

  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <aside className={cn("h-screen w-64 bg-white border-r border-zinc-100 flex flex-col p-6", className)}>
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-bold text-teal-700">Synora</h1>
        <p className="text-xs text-zinc-400 mt-1">Mental Wellness AI</p>
      </div>
      <nav className="flex-1 space-y-2">
        {menus.map((menu) => (
          <Link
            key={menu.name}
            to={menu.href}
            className="flex items-center space-x-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <menu.icon className="w-5 h-5" />
            <span className="font-medium">{menu.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-zinc-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-500 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
