import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const CustomSelect = ({ value, onChange, options, icon, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white cursor-pointer hover:bg-white/10 transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          {icon}
          <span className="text-sm">{value || "Select..."}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 glass-panel rounded-md border-white/10 shadow-2xl py-1 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-2 text-sm cursor-pointer transition-colors",
                  value === opt ? "bg-primary text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
