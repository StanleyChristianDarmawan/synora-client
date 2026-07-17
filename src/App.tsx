import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Providers from '@/components/providers';

// Pages
import LandingPage from '@/pages/Landing';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import DashboardPage from '@/pages/dashboard/Dashboard';
import ChatPage from '@/pages/dashboard/Chat';
import CheckinPage from '@/pages/dashboard/Checkin';
import ReflectionPage from '@/pages/dashboard/Reflection';
import HistoryPage from '@/pages/dashboard/History';
import ProfilePage from '@/pages/dashboard/Profile';

function App() {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/checkin" element={<CheckinPage />} />
            <Route path="/reflection" element={<ReflectionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </Providers>
  );
}

export default App;
