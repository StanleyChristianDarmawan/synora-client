import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-zinc-950 p-4 transition-colors">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
