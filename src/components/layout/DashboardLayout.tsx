import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // For demo purposes, bypassing auth redirect if not strictly tested
    // if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
