import { Link } from 'react-router-dom';
import { Home, Edit3, MessageCircle, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ className }: { className?: string }) {
  const menus = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Journal', icon: Edit3, href: '/history' },
    { name: 'Reflection', icon: BarChart2, href: '/reflection' },
    { name: 'Synora AI', icon: MessageCircle, href: '/chat' },
    { name: 'Settings', icon: Settings, href: '/profile' },
  ];

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
            className="flex items-center space-x-3 px-4 py-3 text-zinc-600 rounded-2xl hover:bg-zinc-50 hover:text-teal-600 transition-colors"
          >
            <menu.icon className="w-5 h-5" />
            <span className="font-medium">{menu.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
