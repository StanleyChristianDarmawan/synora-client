import { Navbar } from '@/components/layout/navbar';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
