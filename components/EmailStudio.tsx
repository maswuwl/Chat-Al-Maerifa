
import React, { useState } from 'react';
import { translations } from '../translations';
import { UserProfile } from '../types';

interface EmailStudioProps {
  lang: 'en' | 'ar';
  user: UserProfile;
}

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  avatar: string;
}

const EmailStudio: React.FC<EmailStudioProps> = ({ lang, user }) => {
  const t = translations[lang];
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  const emails: Email[] = [
    { id: '1', sender: 'Studio AI Engine', subject: 'Build Successful: Landing Page v2', preview: 'Your latest deployment is live at studio-preview-99.web.app. The assets were optimized successfully.', time: '10:45 AM', isRead: false, avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100' },
    { id: '2', sender: 'Community Manager', subject: 'Trending App: PixelQuest Pro', preview: 'Congratulations! Your community app PixelQuest has reached 5K downloads in just 2 days.', time: 'Yesterday', isRead: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  ];

  return (
    <div className="flex-1 flex h-full bg-[#05070a] overflow-hidden">
      {/* Sidebar Folders */}
      <div className="w-64 border-r border-white/5 bg-[#0a0c10]/50 p-6 hidden lg:flex flex-col gap-10">
        <button onClick={() => setIsComposing(true)} className="w-full py-4 bg-indigo-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          {t.email.compose}
        </button>

        <nav className="space-y-1">
          {['inbox', 'sent', 'drafts', 'trash'].map(folder => (
            <button key={folder} onClick={() => setActiveFolder(folder)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeFolder === folder ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
               <span className="text-xs font-bold capitalize">{folder}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Email List */}
      <div className="flex-1 flex flex-col border-r border-white/5">
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/20">
          <h3 className="text-lg font-black text-white uppercase tracking-widest">{t.email.inbox}</h3>
        </header>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scroll">
          {emails.map(email => (
            <button key={email.id} onClick={() => setSelectedEmail(email)} className={`w-full p-6 text-left flex items-start gap-5 transition-all ${selectedEmail?.id === email.id ? 'bg-indigo-600/5' : 'hover:bg-white/[0.02]'}`}>
              <img src={email.avatar} className="w-12 h-12 rounded-2xl border border-white/10 object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black uppercase text-white">{email.sender}</span>
                  <span className="text-[10px] font-mono text-slate-600">{email.time}</span>
                </div>
                <h4 className="text-sm font-bold text-indigo-400 truncate">{email.subject}</h4>
                <p className="text-xs text-slate-500 truncate opacity-60">{email.preview}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Preview */}
      <div className="flex-[1.5] hidden md:flex flex-col bg-black/20">
        {selectedEmail ? (
          <div className="flex-1 flex flex-col p-10 space-y-8">
            <header className="flex items-center gap-6 pb-8 border-b border-white/5">
               <img src={selectedEmail.avatar} className="w-16 h-16 rounded-[1.5rem]" />
               <div>
                  <h3 className="text-xl font-black text-white">{selectedEmail.sender}</h3>
                  <p className="text-xs text-slate-500 font-mono">system.alert@hybrid-studio.ai</p>
               </div>
            </header>
            <h2 className="text-3xl font-black text-indigo-400 leading-tight">{selectedEmail.subject}</h2>
            <div className="text-slate-300 text-lg leading-relaxed font-medium">
               {selectedEmail.preview}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-20 flex-col gap-6">
             <svg className="w-20 h-20 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
             <p className="text-xs font-black uppercase tracking-[0.3em]">{lang === 'ar' ? 'حدد رسالة لعرض محتواها' : 'Select a message'}</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {isComposing && (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
           <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden">
              <header className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xl font-black text-white">{t.email.compose}</h3>
                 <button onClick={() => setIsComposing(false)} className="text-slate-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </header>
              <div className="p-10 space-y-6">
                 <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-xl" />
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase">From:</p>
                       <p className="text-xs font-bold text-white">{user.name} &lt;{user.email}&gt;</p>
                    </div>
                 </div>
                 <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs outline-none" placeholder={t.email.to} />
                 <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs outline-none" placeholder={t.email.subject} />
                 <textarea className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white text-xs outline-none min-h-[150px]" placeholder={t.email.message}></textarea>
                 <button className="w-full py-5 bg-indigo-600 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/50 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    {t.email.send}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EmailStudio;
