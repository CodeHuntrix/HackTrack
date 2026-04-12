import React, { useState } from 'react';
import { api } from '../services/api';

const MagicPaste = ({ onResult }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMagicPaste = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.extractData(text);
      onResult(data);
      setText(''); // Clear on success
    } catch (err) {
      setError("AI was overwhelmed by that text. Try a smaller snippet.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 mb-8 fade-in" style={{ padding: '1.5rem' }}>
      <h2 className="text-xl mb-4 gradient-text">✨ Magic Paste (AI Mode)</h2>
      <p className="text-muted mb-4 small">Copy-paste any hackathon page text here. Groq Llama3 will extract the dates and details automatically.</p>
      
      <textarea
        className="w-full h-32 bg-transparent border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-primary transition-all"
        style={{ width: '100%', minHeight: '120px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', padding: '12px' }}
        placeholder="Paste Code Carnival or Unstop text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      {error && <p className="text-accent mt-2 small" style={{ color: 'var(--accent)' }}>{error}</p>}
      
      <button 
        onClick={handleMagicPaste}
        disabled={loading || !text.trim()}
        className="btn btn-primary mt-4"
        style={{ marginTop: '1rem' }}
      >
        {loading ? "Analyzing..." : "Analyze with Groq"}
      </button>
    </div>
  );
};

export default MagicPaste;
