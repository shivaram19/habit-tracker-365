import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import LogScreen from './pages/LogScreen';
import HistoryScreen from './pages/HistoryScreen';
import WrappedScreen from './pages/WrappedScreen';
import ProfileScreen from './pages/ProfileScreen';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

type Tab = 'log' | 'history' | 'wrapped' | 'profile';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-12 h-12 border-4 border-burnt-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--burnt-orange)', borderTopColor: 'transparent' }}
          />
          <p className="font-mono text-sm" style={{ color: 'var(--ink-color)' }}>
            Loading your colors...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Main app content with Layout
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab from route
  const getActiveTab = (): Tab => {
    const path = location.pathname;
    if (path === '/history') return 'history';
    if (path === '/wrapped') return 'wrapped';
    if (path === '/profile') return 'profile';
    return 'log';
  };

  const handleTabChange = (tab: Tab) => {
    const routes: Record<Tab, string> = {
      log: '/',
      history: '/history',
      wrapped: '/wrapped',
      profile: '/profile',
    };
    navigate(routes[tab]);
  };

  return (
    <Layout activeTab={getActiveTab()} onTabChange={handleTabChange}>
      <Routes>
        <Route path="/" element={<LogScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/wrapped" element={<WrappedScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppContent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
