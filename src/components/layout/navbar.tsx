import { User, Bell, LogOut, Home, Edit3, MessageCircle, BarChart2, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/theme.store';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const menus = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Journal', href: '/history' },
    { name: 'Reflection', href: '/reflection' },
    { name: 'Synora AI', href: '/chat' },
    { name: 'Consulting', href: '/consulting' },
  ];

  return (
    <header className="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-6 sticky top-0 z-40 shadow-sm relative transition-colors duration-300">
      <div className="flex items-center w-32">
        <img src={theme === 'dark' ? "/synoraLogo.png" : "/synoraLogo2.png"} alt="Synora" className="h-8 object-contain" />
      </div>

      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-2">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.href;
          return (
            <Link
              key={menu.name}
              to={menu.href}
              className={cn(
                "px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <span>{menu.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center space-x-4 w-32 ml-auto justify-end">

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center border border-teal-200 dark:border-teal-800 hover:bg-teal-200 dark:hover:bg-teal-900/80 transition-colors focus:outline-none ring-2 ring-transparent focus:ring-teal-100 dark:focus:ring-teal-900"
          >
            <User className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-800 py-1 z-50 transform origin-top-right transition-all">
              <div className="px-4 py-2 border-b border-zinc-50 dark:border-zinc-800/50 mb-1">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">{user?.email || 'Guest'}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="w-full flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
              >
                <Settings className="w-4 h-4 mr-2 text-zinc-400 dark:text-zinc-500" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium border-t border-zinc-50 dark:border-zinc-800/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
