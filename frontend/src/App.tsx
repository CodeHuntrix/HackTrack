import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PinGate from './components/PinGate';
import { ToastProvider } from './components/ui/toast';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ht_authenticated') === 'true';
  });

  const handleAuthSuccess = () => {
    sessionStorage.setItem('ht_authenticated', 'true');
    setIsAuthenticated(true);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
        {/* Subtle Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[120px]" />
        </div>
        
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <PinGate key="pin-gate" onSuccess={handleAuthSuccess} />
          ) : (
            <Dashboard key="dashboard" />
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
}

export default App;
