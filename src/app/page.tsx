"use client";
import React, { useState } from 'react';
import { Terminal, Copy, Check, Cpu, Layout, ArrowRight } from 'lucide-react';

export default function SignalApp() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 const analyzeLink = async () => {
  if (!url) return;
  setLoading(true);
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    
    const data = await response.json();
    setResult(data);
  } catch (err) {
    console.error("Error analizando:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-mono p-6 selection:bg-emerald-500/30">
      <nav className="max-w-4xl mx-auto flex justify-between items-center mb-20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-bold tracking-widest text-lg">SIGNAL_</span>
        </div>
        <div className="text-[10px] text-zinc-500 border border-zinc-800 px-2 py-1 rounded uppercase">Guest Mode: 3/3 Left</div>
      </nav>

      <main className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Focus on Code, not noise.</h2>
          <p className="text-zinc-500 text-sm">Pega una URL técnica para extraer arquitectura y comandos.</p>
        </div>

        <div className="relative mb-12">
          <input 
            type="text"
            className="w-full bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            placeholder="https://github.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={simulateAnalysis}
            disabled={loading}
            className="absolute right-3 top-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
          >
            {loading ? "Analizando..." : "Analizar"} <ArrowRight size={14} />
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl">
                <span className="text-[10px] text-emerald-500 uppercase block mb-1">Stack</span>
                <span className="text-sm font-bold">{result.stack}</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl">
                <span className="text-[10px] text-emerald-500 uppercase block mb-1">Status</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">Ready to Deploy</span>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  <Terminal size={12} /> Standard Install
                </div>
                <button onClick={() => handleCopy(result.install)} className="text-zinc-500 hover:text-white transition-colors">
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="p-4 bg-black/40">
                <code className="text-emerald-400 text-sm">{result.install}</code>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-xl border-dashed">
              <h3 className="text-[10px] text-emerald-500 uppercase mb-4 flex items-center gap-2">
                <Cpu size={14} /> AI Deep Architecture
              </h3>
              <div className="flex justify-between items-center gap-4">
                 {result.arch.split('->').map((step: string, i: number) => (
                   <React.Fragment key={i}>
                     <div className="bg-zinc-900 border border-zinc-800 p-2 rounded text-[10px]">{step.trim()}</div>
                     {i < 3 && <ArrowRight size={10} className="text-zinc-700" />}
                   </React.Fragment>
                 ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}