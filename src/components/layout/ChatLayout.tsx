import { Navbar } from '@/components/layout/navbar';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export function ChatLayout() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
