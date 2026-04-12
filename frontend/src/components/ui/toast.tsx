import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toast: (type: ToastType, message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string, description?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message, description }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "glass-panel p-4 flex gap-3 shadow-2xl border-l-4",
                t.type === 'success' && "border-l-primary",
                t.type === 'error' && "border-l-accent",
                t.type === 'info' && "border-l-secondary"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                {t.type === 'error' && <AlertCircle className="h-5 w-5 text-accent" />}
                {t.type === 'info' && <Info className="h-5 w-5 text-secondary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{t.message}</p>
                {t.description && <p className="text-xs text-muted mt-1 leading-relaxed">{t.description}</p>}
              </div>
              <button 
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-muted hover:text-white transition-colors h-fit pl-2"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
