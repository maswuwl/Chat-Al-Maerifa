
import React, { useState } from 'react';
import { translations } from '../translations';

interface VoiceStudioProps {
  lang: 'en' | 'ar';
}

const VoiceStudio: React.FC<VoiceStudioProps> = ({ lang }) => {
  const t = translations[lang];
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDubbing = () => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsProcessing(false), 1000);
          return 100;
        }
        return p + 2;
      });
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#05070a] overflow-hidden">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white">{t.dubbingTitle}</h2>
          <p className="text-slate-500 font-medium">{t.dubbingSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
           <div className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 group hover:border-emerald-500/40 transition-all cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <span className="text-sm font-bold text-slate-400">{t.selectVideo}</span>
           </div>

           <div className="space-y-6 text-left" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.dubbingLang}</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50">
                  <option>English (US)</option>
                  <option>Arabic (Saudi)</option>
                  <option>French (Paris)</option>
                  <option>Spanish (Madrid)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.voiceStyle}</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50">
                  <option>Professional (Male)</option>
                  <option>Professional (Female)</option>
                  <option>Natural / Neutral</option>
                  <option>Cloned Voice (Beta)</option>
                </select>
              </div>
              <button 
                onClick={startDubbing}
                disabled={isProcessing}
                className="w-full py-4 bg-emerald-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
              >
                {t.processDub}
              </button>
           </div>
        </div>

        {isProcessing && (
          <div className="w-full space-y-4 animate-in fade-in duration-500">
             <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t.dubbingProgress}</span>
                <span className="text-[10px] font-mono text-emerald-400">{progress}%</span>
             </div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]" style={{ width: `${progress}%` }}></div>
             </div>
             <div className="flex gap-2 justify-center">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 bg-emerald-500/20 rounded-full animate-wave" style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
             </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); background-color: rgb(16, 185, 129); }
        }
        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VoiceStudio;
