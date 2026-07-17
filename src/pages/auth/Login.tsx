
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (data) => {
      useAuthStore.getState().setAuth({ id: 'temp', email }, data.access_token);
      try {
        const user = await AuthService.getMe();
        setAuth(user, data.access_token);
        navigate('/dashboard');
      } catch (e) {
        console.error(e);
        setErrorMsg('Failed to fetch user profile.');
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.detail || 'Incorrect email or password. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <img src="/synoraLogo2.png" alt="Synora" className="h-12 object-contain" />
      <Card className="w-full border-0 shadow-lg shadow-zinc-200/50">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-teal-700">Welcome Back</CardTitle>
          <p className="text-sm text-zinc-500">Log in to continue your mental wellness journey.</p>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700">Password</label>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base mt-2" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account? <Link to="/register" className="text-teal-600 font-medium hover:underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
