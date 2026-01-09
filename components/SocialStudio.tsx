
import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { UserProfile } from '../types';
import VerificationBadge from './VerificationBadge';

interface SocialStudioProps {
  lang: 'en' | 'ar';
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onSwitchTool: (tool: string) => void;
}

interface Streamer {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  viewers: string;
  diamonds: number;
  level: number;
  tags: string[];
  role: 'admin' | 'creator' | 'user';
  joinDate: string;
}

const SocialStudio: React.FC<SocialStudioProps> = ({ lang, user, onUpdateUser, onSwitchTool }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'following'>('all');
  const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(null);
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);
  const [messages, setMessages] = useState<{ user: string; text: string; isGift?: boolean; icon?: string; role: any; joinDate: string }[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const streamers: Streamer[] = [
    { id: '1', name: 'Khalid Al-Muntasir', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800', viewers: '1M', diamonds: 999999, level: 100, tags: ['CEO', 'Tech'], role: 'admin', joinDate: '2023-01-01' },
    { id: '2', name: 'Sara_Admin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', cover: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=800', viewers: '4.2K', diamonds: 15200, level: 45, tags: ['Support'], role: 'admin', joinDate: '2024-05-01' },
    { id: '3', name: 'New_Creator', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', cover: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=800', viewers: '1.8K', diamonds: 8500, level: 32, tags: ['Art'], role: 'user', joinDate: new Date().toISOString() },
  ];

  const handleSendGift = (gift: { icon: string; cost: number; label: string }) => {
    if (user.diamonds < gift.cost) {
      alert(lang === 'ar' ? 'رصيد الماسات غير كافٍ!' : 'Not enough diamonds!');
      return;
    }
    
    onUpdateUser({ ...user, diamonds: user.diamonds - gift.cost });
    const giftMsg = { 
      user: user.name, 
      text: `${lang === 'ar' ? 'أرسل' : 'sent'} ${gift.label}`, 
      isGift: true, 
      icon: gift.icon,
      role: user.role,
      joinDate: user.joinDate
    };
    setMessages(prev => [...prev.slice(-15), giftMsg]);
    
    const id = Date.now();
    setHearts(prev => [...prev, { id, left: Math.random() * 80 + 10 }]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden relative">
      <header className="h-16 border-b border-white/5 bg-[#0a0c10] flex items-center justify-between px-6 z-30 sticky top-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
            </div>
            <h2 className="text-lg font-black tracking-tighter text-white uppercase">Connect Studio</h2>
          </div>
          
          <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl">
            {['all', 'popular', 'following'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : tab === 'popular' ? (lang === 'ar' ? 'شائع' : 'Popular') : (lang === 'ar' ? 'متابعة' : 'Following')}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full cursor-pointer hover:bg-amber-500/20 transition-all">
             <span className="text-xs font-black text-amber-500 tabular-nums">{user.diamonds.toLocaleString()}</span>
             <VerificationBadge user={user} size="sm" />
          </div>
          <button onClick={() => setIsEditingProfile(true)} className="w-10 h-10 rounded-xl border-2 border-indigo-500/50 overflow-hidden hover:scale-110 active:scale-95 transition-all">
             <img src={user.avatar} className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max custom-scroll">
          {streamers.map(s => (
            <div key={s.id} onClick={() => setSelectedStreamer(s)} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 cursor-pointer hover:scale-[1.02] transition-all duration-500">
              <img src={s.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30"></div>
              
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                 <div className="px-3 py-1 bg-rose-600 rounded-lg text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    LIVE
                 </div>
                 <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <span className="text-[10px] font-black text-white">{s.viewers}</span>
                 </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                 <img src={s.avatar} className="w-12 h-12 rounded-2xl border-2 border-white/20 object-cover shadow-2xl" />
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                       <h4 className="text-sm font-black text-white truncate">{s.name}</h4>
                       <VerificationBadge user={{ ...user, name: s.name, role: s.role, joinDate: s.joinDate }} size="sm" />
                    </div>
                    <span className="text-[8px] font-black bg-amber-500 text-black px-1.5 rounded-sm">LV.{s.level}</span>
                 </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {selectedStreamer && (
        <div className="absolute inset-0 z-[100] bg-black flex animate-in fade-in duration-300 overflow-hidden">
           <img src={selectedStreamer.cover} className="absolute inset-0 w-full h-full object-cover blur-[100px] opacity-30" />
           <div className="flex-1 flex relative">
              <div className="flex-1 flex items-center justify-center p-12">
                 <div className="relative aspect-[9/16] h-full bg-slate-900 rounded-[3rem] shadow-[0_0_100px_rgba(244,63,94,0.3)] border border-white/10 overflow-hidden">
                    <img src={selectedStreamer.cover} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                    <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                       <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl p-2 rounded-3xl border border-white/10 pr-6">
                          <img src={selectedStreamer.avatar} className="w-11 h-11 rounded-2xl object-cover" />
                          <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-white">{selectedStreamer.name}</span>
                                <VerificationBadge user={{...user, name: selectedStreamer.name, role: selectedStreamer.role, joinDate: selectedStreamer.joinDate}} size="sm" />
                             </div>
                             <span className="text-[10px] text-amber-500 flex items-center gap-1 font-bold">💎 {selectedStreamer.diamonds.toLocaleString()}</span>
                          </div>
                       </div>
                       <button onClick={() => setSelectedStreamer(null)} className="w-12 h-12 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-rose-600 transition-all">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 space-y-6">
                       <div className="max-h-56 overflow-y-auto flex flex-col gap-2 custom-scroll no-scrollbar mask-linear-t">
                          {messages.map((m, i) => (
                            <div key={i} className={`flex gap-2 items-center p-2 rounded-xl backdrop-blur-md border ${m.isGift ? 'bg-amber-500/20 border-amber-500/30' : 'bg-black/30 border-white/5'} animate-in slide-in-from-left-2 duration-300 w-max max-w-[90%]`}>
                               {m.icon && <span className="text-lg">{m.icon}</span>}
                               <div className="flex items-center gap-1">
                                 <span className={`text-[10px] font-black uppercase ${m.isGift ? 'text-amber-500' : 'text-rose-400'}`}>{m.user}</span>
                                 <VerificationBadge user={{...user, name: m.user, role: m.role, joinDate: m.joinDate}} size="sm" />
                                 <span className="text-[10px] font-black text-white">:</span>
                               </div>
                               <span className="text-[10px] font-bold text-white">{m.text}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SocialStudio;
