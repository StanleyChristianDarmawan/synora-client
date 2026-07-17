
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useThemeStore } from '@/stores/theme.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);

  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      navigate('/login');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ email, password });
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <img src={theme === 'dark' ? '/synoraLogo.png' : '/synoraLogo2.png'} alt="Synora" className="h-12 object-contain" />
      <Card className="w-full border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-teal-700 dark:text-teal-400">Create an Account</CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Start noticing yourself before it's too late.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <Input
                type="password"
                placeholder="password"
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base mt-2 dark:bg-teal-700 dark:hover:bg-teal-600" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account? <Link to="/login" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">Log in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
