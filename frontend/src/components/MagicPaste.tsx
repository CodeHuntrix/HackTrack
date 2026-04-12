import React, { useState } from 'react';
import { api, HackathonData } from '../services/api';
import { Button } from './ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from './ui/toast';

interface MagicPasteProps {
  onResult: (data: HackathonData) => void;
  isAnalyzing?: boolean;
}

const MagicPaste = ({ onResult, isAnalyzing }: MagicPasteProps) => {
  const [text, setText] = useState('');

  const { toast } = useToast();

  const handleAnalyze = async () => {
    // This will be called via form submission from the Modal footer
    if (!text.trim()) return;

    try {
      const data = await api.extractWithAI(text);
      onResult(data);
      toast('success', 'Extraction complete', 'Please review the details in the form.');
      setText('');
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail;
      const errorMessage = typeof errorDetail === 'string' ? errorDetail : (err.message || 'AI processing failed');
      toast('error', 'AI extraction failed', errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Magic Paste (AI Mode)</h3>
      </div>
      <p className="text-sm text-muted">Copy-paste any hackathon page text here. AI will extract dates, rounds, and prize pools automatically.</p>
      
      <form 
        id="magic-paste-form" 
        onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}
        className="relative group"
      >
        <textarea
          className="w-full h-48 bg-surface/50 border border-white/10 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-primary outline-none transition-all resize-none group-hover:border-primary/30"
          placeholder="Paste Code Carnival, Unstop or Devfolio text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all" />
      </form>
    </div>
  );
};

export default MagicPaste;
