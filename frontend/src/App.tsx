import React from 'react';
import Dashboard from './components/Dashboard';
import { ToastProvider } from './components/ui/toast';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
        {/* Subtle Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[120px]" />
        </div>
        
        <Dashboard />
      </div>
    </ToastProvider>
  );
}

export default App;
