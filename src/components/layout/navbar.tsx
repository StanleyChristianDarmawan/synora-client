import { User, Bell, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold text-zinc-800">Good Morning, {user?.email?.split('@')[0] || 'User'}</h2>
        <p className="text-sm text-zinc-500">Let's check in with yourself today.</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-zinc-100">
          <Bell className="w-5 h-5 text-zinc-500" />
        </Button>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center border border-teal-200 hover:bg-teal-200 transition-colors focus:outline-none"
          >
            <User className="w-5 h-5 text-teal-700" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 py-1 z-50 transform origin-top-right transition-all">
              <div className="px-4 py-2 border-b border-zinc-50 mb-1">
                <p className="text-xs font-medium text-zinc-500 truncate">{user?.email || 'Guest'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
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
