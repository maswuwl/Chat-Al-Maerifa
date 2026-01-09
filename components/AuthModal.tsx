
import React, { useState } from 'react';
import { translations } from '../translations';

interface AuthModalProps {
  lang: 'en' | 'ar';
  isOpen: boolean;
  onClose: () => void;
  onLogin: (provider: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ lang, isOpen, onClose, onLogin }) => {
  const t = translations[lang];
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#05070a]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0d1117] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-600/20 to-transparent"></div>
        
        <div className="relative p-10 flex flex-col items-center text-center space-y-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl ring-4 ring-white/5 animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {lang === 'ar' ? 'مرحباً بك في النواة' : 'Welcome to the Core'}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              {lang === 'ar' ? 'سجل دخولك للوصول إلى أدوات الذكاء الاصطناعي المتقدمة' : 'Login to access advanced AI production tools'}
            </p>
          </div>

          {/* Social Buttons */}
          <div className="w-full space-y-3">
            <button 
              onClick={() => acceptedTerms && onLogin('google')}
              disabled={!acceptedTerms}
              className="w-full py-4 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt=""/>
              {lang === 'ar' ? 'المتابعة باستخدام جوجل' : 'Continue with Google'}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => acceptedTerms && onLogin('github')}
                disabled={!acceptedTerms}
                className="py-4 bg-[#24292f] text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-wider hover:bg-[#333] transition-all disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
              <button 
                onClick={() => acceptedTerms && onLogin('facebook')}
                disabled={!acceptedTerms}
                className="py-4 bg-[#1877f2] text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-wider hover:bg-[#166fe5] transition-all disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </div>

          {/* Terms Section */}
          <div className="w-full p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
            <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setAcceptedTerms(!acceptedTerms)}>
              <div className={`mt-1 w-5 h-5 rounded border transition-all flex items-center justify-center ${acceptedTerms ? 'bg-indigo-600 border-indigo-500' : 'bg-transparent border-slate-600'}`}>
                {acceptedTerms && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7"/></svg>}
              </div>
              <p className="text-[10px] text-slate-500 text-left leading-relaxed select-none group-hover:text-slate-300">
                {lang === 'ar' 
                  ? 'أوافق على شروط الخدمة وسياسة الخصوصية. أتعهد باستخدام أدوات الذكاء الاصطناعي بشكل قانوني وعدم انتهاك حقوق الملكية الفكرية.' 
                  : 'I agree to the Terms of Service and Privacy Policy. I pledge to use AI tools legally and not violate intellectual property rights.'}
              </p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <button onClick={onClose} className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">
                {lang === 'ar' ? 'المتابعة كضيف' : 'Continue as Guest'}
              </button>
              <a href="https://ai.google.dev/terms" target="_blank" className="text-[10px] font-black text-indigo-500 uppercase hover:underline">
                {lang === 'ar' ? 'اقرأ الشروط كاملة' : 'Full Terms'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
