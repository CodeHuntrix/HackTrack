import React, { useState } from 'react';
import { api, HackathonData } from '../services/api';
import { Button } from './ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from './ui/toast';

interface MagicPasteProps {
  onResult: (data: HackathonData) => void;
}

const MagicPaste = ({ onResult }: MagicPasteProps) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const data = await api.extractWithAI(text);
      onResult(data);
      toast('success', 'Extraction complete', 'Please review the details in the form.');
      setText('');
    } catch (err: any) {
      toast('error', 'AI extraction failed', err.response?.data?.detail || 'Please try again or enter manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Magic Paste (AI Mode)</h3>
      </div>
      <p className="text-sm text-muted">Copy-paste any hackathon page text here. AI will extract dates, rounds, and prize pools automatically.</p>
      
      <div className="relative group">
        <textarea
          className="w-full h-48 bg-surface/50 border border-white/10 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-primary outline-none transition-all resize-none group-hover:border-primary/30"
          placeholder="Paste Code Carnival, Unstop or Devfolio text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all" />
      </div>

      <Button 
        onClick={handleAnalyze} 
        disabled={isAnalyzing || !text.trim()}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Groq is Thinking...
          </>
        ) : (
          "Extract with AI"
        )}
      </Button>
    </div>
  );
};

export default MagicPaste;
