
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      {user ? (
        <>
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <Dashboard />
          </main>
        </>
      ) : (
        <AuthScreen />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;