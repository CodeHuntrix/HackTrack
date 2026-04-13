import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Lock, Delete, X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PinGateProps {
  onSuccess: () => void;
}

const PIN_LENGTH = 4;
const EXPECTED_PIN = import.meta.env.VITE_DASHBOARD_PIN || '0404';

const PinGate: React.FC<PinGateProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (pin === EXPECTED_PIN) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setIsError(true);
        setTimeout(() => {
          setPin('');
          setIsError(false);
        }, 600);
      }
    }
  }, [pin, onSuccess]);

  const handleNumberClick = (num: string) => {
    if (pin.length < PIN_LENGTH && !isSuccess) {
      setPin(prev => prev + num);
      setIsError(false);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isSuccess) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!isSuccess) {
      setPin('');
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.1, 
      filter: "blur(10px)",
      transition: { duration: 0.5 }
    }
  };

  const shakeVariants: Variants = {
    error: {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  const digitVariants: Variants = {
    empty: { scale: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" },
    filled: { scale: 1.2, backgroundColor: "#a855f7" },
    success: { scale: 1.1, backgroundColor: "#10b981" },
    error: { scale: 1.1, backgroundColor: "#ef4444" }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-sm glass-panel p-8 flex flex-col items-center space-y-8 relative overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

        <div className="flex flex-col items-center space-y-2">
          <motion.div 
            animate={isSuccess ? { rotateY: 360 } : {}}
            transition={{ duration: 0.8 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isSuccess ? 'bg-emerald-500/20 text-emerald-500' : isError ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'} mb-2`}
          >
            {isSuccess ? <CheckCircle2 size={32} /> : isError ? <ShieldAlert size={32} /> : <Lock size={32} />}
          </motion.div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{isSuccess ? 'Access Granted' : 'Restricted Access'}</h2>
          <p className="text-muted text-sm">{isError ? 'Incorrect PIN, try again' : 'Please enter your 4-digit security PIN'}</p>
        </div>

        {/* PIN Indicators */}
        <motion.div 
          animate={isError ? "error" : ""}
          variants={shakeVariants}
          className="flex space-x-4 h-12 items-center"
        >
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <motion.div
              key={i}
              variants={digitVariants}
              initial="empty"
              animate={
                isSuccess ? "success" : 
                isError ? "error" : 
                i < pin.length ? "filled" : "empty"
              }
              className="w-4 h-4 rounded-full border border-white/20 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            />
          ))}
        </motion.div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick(num.toString())}
              className="h-16 rounded-xl flex items-center justify-center text-xl font-semibold border border-white/5 bg-white/5 backdrop-blur-sm transition-all text-white hover:border-primary/50"
            >
              {num}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            className="h-16 rounded-xl flex items-center justify-center text-sm font-medium border border-white/5 bg-white/5 backdrop-blur-sm text-muted hover:text-white"
          >
            <X size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumberClick('0')}
            className="h-16 rounded-xl flex items-center justify-center text-xl font-semibold border border-white/5 bg-white/5 backdrop-blur-sm text-white hover:border-primary/50"
          >
            0
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="h-16 rounded-xl flex items-center justify-center text-sm font-medium border border-white/5 bg-white/5 backdrop-blur-sm text-muted hover:text-red-400"
          >
            <Delete size={20} />
          </motion.button>
        </div>

        {/* Footer Hint */}
        <div className="pt-4 opacity-50 text-[10px] uppercase tracking-widest text-center">
          Security Layer v1.0 • encrypted session
        </div>
      </motion.div>
    </div>
  );
};

export default PinGate;
