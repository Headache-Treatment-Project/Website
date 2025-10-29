import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { CaseManagerDashboard } from './components/CaseManagerDashboard';
import { AboutPage } from './components/AboutPage';
import { Button } from './components/ui/button';
import { Info } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    // 檢查 localStorage 中是否有已登入的用戶
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedToken);
    }
  }, []);

  const handleLogin = (userData: any, token: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  // 如果顯示關於頁面
  if (showAbout) {
    return <AboutPage onBack={() => setShowAbout(false)} />;
  }

  // 如果未登入，顯示登入頁面
  if (!user) {
    return (
      <div className="relative">
        <LoginPage onLogin={handleLogin} />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4"
          onClick={() => setShowAbout(true)}
        >
          <Info className="w-4 h-4 mr-2" />
          關於系統
        </Button>
      </div>
    );
  }

  // 根據用戶角色顯示對應的儀表板
  if (user.role === 'patient') {
    return <PatientDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />;
  }

  if (user.role === 'doctor') {
    return <DoctorDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />;
  }

  if (user.role === 'case_manager') {
    return <CaseManagerDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">無效的用戶角色</p>
        <Button onClick={handleLogout}>返回登入</Button>
      </div>
    </div>
  );
}
