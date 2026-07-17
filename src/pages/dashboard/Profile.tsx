import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Bell, Shield, Moon, Sun, LogOut, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { useThemeStore } from '@/stores/theme.store';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyName, setEmergencyName] = useState(user?.emergency_name || '');
  const [emergencyEmail, setEmergencyEmail] = useState(user?.emergency_email || '');
  const [isSavingEmergency, setIsSavingEmergency] = useState(false);
  const [emergencyError, setEmergencyError] = useState('');
  const [emergencySuccess, setEmergencySuccess] = useState('');

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

  const handleEmergencySave = async () => {
    setEmergencyError('');
    setEmergencySuccess('');
    if (!emergencyName || !emergencyEmail) {
      setEmergencyError('All fields are required');
      return;
    }
    setIsSavingEmergency(true);
    try {
      const updatedUser = await AuthService.updateEmergencyContact({
        emergency_name: emergencyName,
        emergency_email: emergencyEmail
      });
      useAuthStore.getState().setAuth(updatedUser, useAuthStore.getState().token || '');
      setEmergencySuccess('Emergency contact saved successfully');
      setTimeout(() => setShowEmergency(false), 2000);
    } catch (error: any) {
      setEmergencyError(error.response?.data?.detail || 'Failed to save emergency contact');
    } finally {
      setIsSavingEmergency(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Profile & Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Account Information</h2>
          <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white dark:border-zinc-900 shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Settings</h2>
          <div className="space-y-4">
            <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm transition-shadow hover:shadow-md cursor-pointer bg-white dark:bg-zinc-900">
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Privacy & Security</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Data and sessions</p>
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
                  <div className="px-4 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="max-w-md space-y-4">
                      <div>
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">Change Password</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Update your password to keep your account secure.</p>
                      </div>

                      {errorMsg && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errorMsg}
                        </div>
                      )}
                      
                      {successMsg && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-lg flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {successMsg}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Current Password</label>
                          <input 
                            type="password" 
                            placeholder="Enter current password" 
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
                          <input 
                            type="password" 
                            placeholder="Enter new password" 
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
                          <input 
                            type="password" 
                            placeholder="Confirm new password" 
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2 dark:bg-teal-700 dark:hover:bg-teal-600"
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

            <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm transition-shadow hover:shadow-md cursor-pointer bg-white dark:bg-zinc-900">
              <CardContent className="p-0">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Emergency Contact</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Notified upon high risk</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEmergency(!showEmergency)}
                  >
                    Configure
                  </Button>
                </div>
                
                {showEmergency && (
                  <div className="px-4 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="max-w-md space-y-4">
                      <div>
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">Emergency Alerts</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Set a trusted contact. We will alert them if our AI detects high levels of distress.</p>
                      </div>

                      {emergencyError && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm rounded-lg flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {emergencyError}
                        </div>
                      )}
                      
                      {emergencySuccess && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-lg flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {emergencySuccess}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Contact Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Jane Doe" 
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            value={emergencyName}
                            onChange={(e) => setEmergencyName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Contact Email</label>
                          <input 
                            type="email" 
                            placeholder="jane@example.com" 
                            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            value={emergencyEmail}
                            onChange={(e) => setEmergencyEmail(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2 dark:bg-teal-700 dark:hover:bg-teal-600"
                          onClick={handleEmergencySave}
                          disabled={isSavingEmergency}
                        >
                          {isSavingEmergency ? 'Saving...' : 'Save Contact'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4">Appearance</h3>
          <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Theme Mode</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose between light and dark mode</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                <button 
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${theme === 'light' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
                >
                  Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${theme === 'dark' ? 'bg-zinc-700 shadow-sm text-zinc-50' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
                >
                  Dark
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-8">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-400 py-6 font-medium text-base rounded-xl border border-rose-100 dark:border-rose-900/30"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign out from account</span>
          </Button>
        </section>
      </div>
    </div>
  );
}
