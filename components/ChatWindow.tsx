
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types';
import ChatBubble from './ChatBubble';
import { translations } from '../translations';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isGenerating: boolean;
  lang: 'en' | 'ar';
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, isGenerating, lang }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // تمرير تلقائي عند وصول رسائل جديدة
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // منطق لضمان بقاء حقل الإدخال مرئياً عند التركيز (Focus) على الجوال
  const handleFocus = () => {
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSend(input);
    setInput('');
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'ar' ? 'متصفحك لا يدعم التعرف على الصوت.' : 'Your browser does not support speech recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] relative overflow-hidden">
      {/* منطقة الرسائل مع دعم التمرير السلس */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 custom-scroll scroll-smooth"
        style={{ scrollPaddingBottom: '100px' }}
      >
        {messages.length === 0 && (
          <div className="min-h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-12 animate-in fade-in zoom-in duration-1000 py-10">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600 blur-[100px] opacity-25 animate-pulse"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)] ring-1 ring-white/20">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-indigo-200 to-slate-500 bg-clip-text text-transparent tracking-tighter px-4">
                {t.startTitle}
              </h2>
              <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-lg mx-auto opacity-80 px-6">
                {t.startSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full px-6">
               {t.hints.map((hint, idx) => (
                 <button 
                  key={hint}
                  onClick={() => setInput(hint)}
                  className="group px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[12px] font-bold hover:bg-indigo-600/10 hover:border-indigo-500/40 transition-all text-slate-400 hover:text-indigo-400 text-left flex items-center gap-4 active:scale-[0.98]"
                 >
                   <div className="w-8 h-8 shrink-0 rounded-lg bg-slate-900 group-hover:bg-indigo-500/20 flex items-center justify-center transition-all border border-white/5">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={idx === 0 ? "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" : idx === 1 ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" : idx === 2 ? "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"} />
                     </svg>
                   </div>
                   <span className="flex-1 truncate">{hint}</span>
                 </button>
               ))}
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} lang={lang} />
        ))}
        
        {isGenerating && (
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 w-max animate-pulse">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{lang === 'ar' ? 'المحرك يولد الآن...' : 'Engine Generating...'}</span>
          </div>
        )}
        <div ref={endRef} className="h-4" />
      </div>

      {/* منطقة الإدخال المحسنة للجوال */}
      <div className="p-4 md:p-8 border-t border-white/5 bg-[#05070a]/95 backdrop-blur-3xl z-40 sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto flex items-end gap-3 md:gap-5">
          <div className="flex-1 relative group bg-white/[0.03] rounded-2xl md:rounded-[2rem] border border-white/10 focus-within:border-indigo-500/40 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
            <textarea
              value={input}
              onFocus={handleFocus}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              rows={1}
              className="w-full bg-transparent px-4 py-4 md:px-6 md:py-5 pr-16 md:pr-20 focus:outline-none min-h-[50px] max-h-32 md:max-h-56 resize-none font-medium text-slate-100 placeholder:text-slate-600 custom-scroll leading-relaxed text-sm md:text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className={`absolute ${lang === 'ar' ? 'left-3 md:left-5' : 'right-3 md:right-5'} bottom-3 md:bottom-4 flex gap-2 md:gap-3`}>
              <button 
                type="button" 
                onClick={startVoiceInput}
                className={`p-2 rounded-lg md:rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-slate-500 hover:text-indigo-400 hover:bg-white/10'}`}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="h-[50px] w-[50px] md:h-[64px] md:w-[64px] shrink-0 flex items-center justify-center rounded-2xl md:rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/30 group active:scale-90"
          >
            <svg className={`w-5 h-5 md:w-7 md:h-7 text-white transition-transform group-hover:-translate-y-1 ${lang === 'ar' ? 'rotate-[-90deg]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </form>
        
        {/* معلومات إضافية مخفية على الشاشات الصغيرة جداً */}
        <div className="hidden sm:flex max-w-5xl mx-auto items-center justify-between mt-4 px-2 opacity-60">
           <div className="flex items-center gap-3">
             <p className="text-[8px] md:text-[10px] text-slate-600 uppercase tracking-[0.3em] font-black">Studio Core v2.5</p>
           </div>
           <div className="flex items-center gap-4 text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-500"></div> Synthesis</span>
              <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500"></div> Deployment</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
