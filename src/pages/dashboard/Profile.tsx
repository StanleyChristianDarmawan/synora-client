import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Bell, Shield, Moon, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthService } from '@/services/auth.service';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }
    setIsChanging(true);
    try {
      await AuthService.changePassword({ old_password: oldPassword, new_password: newPassword });
      setSuccessMsg('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowPasswordChange(false), 2000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Profile & Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">Account Information</h2>
          <Card className="border border-zinc-100 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white shadow-sm ring-1 ring-zinc-100">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-zinc-500">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-800 mb-4">Settings</h2>
          <div className="space-y-4">
            <Card className="border border-zinc-100 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-900">Notifications</h4>
                    <p className="text-sm text-zinc-500">Manage daily reminders</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </CardContent>
            </Card>

            <Card className="border border-zinc-100 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-900">Appearance</h4>
                    <p className="text-sm text-zinc-500">Customize UI theme</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">System</Button>
              </CardContent>
            </Card>

            <Card className="border border-zinc-100 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900">Privacy & Security</h4>
                      <p className="text-sm text-zinc-500">Data and sessions</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                  >
                    Manage
                  </Button>
                </div>
                
                {showPasswordChange && (
                  <div className="px-4 pb-6 pt-2 border-t border-zinc-100">
                    <div className="max-w-md space-y-4">
                      <div>
                        <h3 className="font-medium text-zinc-900 mb-1">Change Password</h3>
                        <p className="text-sm text-zinc-500 mb-4">Update your password to keep your account secure.</p>
                      </div>

                      {errorMsg && (
                        <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errorMsg}
                        </div>
                      )}
                      
                      {successMsg && (
                        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {successMsg}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-700">Current Password</label>
                          <input 
                            type="password" 
                            placeholder="Enter current password" 
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-700">New Password</label>
                          <input 
                            type="password" 
                            placeholder="Enter new password" 
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-700">Confirm New Password</label>
                          <input 
                            type="password" 
                            placeholder="Confirm new password" 
                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2"
                          onClick={handlePasswordChange}
                          disabled={isChanging}
                        >
                          {isChanging ? 'Updating...' : 'Update Password'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="pt-4 border-t border-zinc-100 mt-8">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 py-6 font-medium text-base rounded-xl border border-rose-100"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign out from account</span>
          </Button>
        </section>
      </div>
    </div>
  );
}
