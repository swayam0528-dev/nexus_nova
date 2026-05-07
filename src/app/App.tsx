import React, { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { getCurrentUser } from './utils/storage';

type AuthView = 'login' | 'signup' | 'dashboard';

function App() {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
      setAuthView('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAuthView('dashboard');
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    setAuthView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('login');
  };

  if (!isAuthenticated) {
    if (authView === 'signup') {
      return (
        <Signup
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthView('signup')}
      />
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
